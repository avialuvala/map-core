using CsvHelper;
using MapCore.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace MapCore.Admin.Models
{
    public class AdminRepo : JsonDataRepo
    {
        public const string _defaultFileName = "main";
        public const string _idColName = "Id";

        /// <summary>Path to input project base directory ("MapCore.Admin")</summary>
        private readonly string _inputDirectory;
        /// <summary>Path to output project base directory ("MapCore")</summary>
        private readonly string _outputDirectory;

        public AdminRepo() : base(null, null, null, null, null)
        {
            //Set input directory = ./MapCore.Admin/json
            string inputDirectoryBase = AppContext.BaseDirectory.Substring(0, AppContext.BaseDirectory.LastIndexOf("bin"));
            _inputDirectory = Path.Combine(inputDirectoryBase, "json-input");
            //Set output directory to ../MapCore/wwwroot/json
            var adminDir = new DirectoryInfo(inputDirectoryBase).ToString();
            _outputDirectory = Path.Combine(adminDir, "json-output", "Map", "json");
        }

        /// <summary>Writes object to JSON at given file path, creating directories if necessary</summary>
        private void WriteJsonToFilePath(string filePath, object obj)
        {
            var file = new FileInfo(filePath);
            file.Directory.Create(); //Create directory if none exists
            File.WriteAllText(filePath, JsonConvert.SerializeObject(obj));
        }

        /// <summary>Top-level call which takes in the config JSON file and generates the Tool, Marker, and InfoBox JSON files</summary>
        public void BuildMapJson(int mapId)
        {
            //Read in the input config JSON file
            string inputPath = Path.Combine(_inputDirectory, mapId.ToString(), "ToolConfig.json");
            string inputJson = File.ReadAllText(inputPath);
            var toolConfig = JsonConvert.DeserializeObject<ToolConfig>(inputJson);
            //Write ToolConfig.json
            string outputPath = Path.Combine(_outputDirectory, mapId.ToString(), "ToolConfig.json");
            WriteJsonToFilePath(outputPath, toolConfig);
            //Build Markers + Infoboxes
            //If Filter exists, build for each year 
            if (toolConfig.HasFilter)
            {
                foreach (var filterOption in toolConfig.Filter.Options)
                {
                    BuildMarkers(toolConfig, filterOption.Id);
                    BuildInfoBoxes(toolConfig, filterOption.Id);
                }
            }
            //Else build default infoboxes
            else
            {
                BuildMarkers(toolConfig, _defaultFileName);
                BuildInfoBoxes(toolConfig, _defaultFileName);
            }
        }

        private void BuildMarkers(ToolConfig toolConfig, string filterId)
        {
            //Get CSV of Ids
            var dataRows = GetRawData(toolConfig, filterId);

            // Format for leading "0" in provider Ids
            dataRows = DataRowIdFormatting(toolConfig, dataRows);

            var rowMap = dataRows.ToDictionary(r => r[_idColName] as string); //Map of Id => data row
            var rowMapTemp = new Dictionary<string, IDictionary<string, object>>();
            foreach (string key1 in rowMap.Keys)
            {

                if (key1.StartsWith('M'))
                {
                    var tempKey = key1.TrimStart('M');
                    var tempValue = rowMap[key1];
                    //   rowMap.Remove(tempKey);
                    rowMapTemp.Add(tempKey, tempValue);
                }
                else
                {
                    rowMapTemp.Add(key1, rowMap[key1]);
                }
            }

            var ids = rowMapTemp.Keys.ToList();
            for (var v = 0; v < ids.Count; v++)
            {
                if (ids[v].StartsWith('M'))
                {
                    ids[v] = Convert.ToString(ids[v].TrimStart('M'));

                }
            }
            //Get base marker info for given set of Ids
            string idsCsv = string.Join(",", ids.ToArray());
            List<CProvGeoConfig> baseMarkers;


            using (var dataContext = new G_GmapContext())
            {
                var idCsvParam = new SqlParameter("zip", idsCsv);
                baseMarkers = dataContext.Set<CProvGeoConfig>()
                    .FromSql("EXECUTE dbo.usp_GetMarkersByEntityCsv @zip", idCsvParam) // service to get lat and longs by zip
                    .AsNoTracking()
                    .ToList();
            }
            //Map primary attribute to each marker
            var markers = new List<MapMarker>();
            var mainAttribute = toolConfig.GetMainAttribute();
            foreach (var baseMarker in baseMarkers)
            {
                var marker = baseMarker.ToMapMarker();
                marker.Id = marker.Id.Trim();


                if (rowMapTemp.ContainsKey(marker.Id))
                {
                    var dataRow = rowMapTemp[marker.Id];
                    //Get column name of main attribute (e.g. "Id")
                    //Try to get from current Filter. Fall back to tool-level main attribute.
                    string mainAttributeColName = mainAttribute.ColName;
                    if (toolConfig.HasFilter)
                    {
                        var filter = toolConfig.Filter.Options.Where(opt => opt.Id == filterId).First();
                        if (!string.IsNullOrEmpty(filter.ColName))
                        {
                            mainAttributeColName = filter.ColName;
                        }
                    }
                    if (dataRow.ContainsKey(mainAttributeColName))
                    {
                        marker.Value = dataRow[mainAttributeColName] as string;
                    }
                }
                markers.Add(marker);
            }
            //Write to disk
            var path = Path.Combine(_outputDirectory, GetMarkerPath(toolConfig.MapId, filterId));
            var uri = new Uri(path);
            WriteJsonToFilePath(uri.LocalPath, markers);
        }

        /// <summary>Builds the Infobox JSON file for a given year</summary>
        private void BuildInfoBoxes(ToolConfig toolConfig, string filterId)
        {
            int mapId = toolConfig.MapId;
            //Read raw data CSV for given filterId, and conver to InfoBoxTabs for each row
            var infoBoxes = new List<InfoBox>();
            var dataRows = GetRawData(toolConfig, filterId);

            // Format for leading "0" in provider Ids
            dataRows = DataRowIdFormatting(toolConfig, dataRows);

            foreach (var v in dataRows)
            {
                v["Id"] = v["Id"].ToString().TrimStart('M');
            }

            foreach (var row in dataRows)
            {

                var infoBox = new InfoBox(row[_idColName] as string); //Assign Id
                infoBox.Id = infoBox.Id.TrimStart('M');
                foreach (var tab in toolConfig.InfoBox.Tabs)
                {
                    infoBox.Tabs.Add(tab.MapToData(row));
                }
                // Remove Tabs that has no Attributes
                infoBox.Tabs = infoBox.Tabs.Where(x => x.Attributes.Count > 0).ToList();
                infoBoxes.Add(infoBox);
            }
            //Write ToolConfig.json
            string outputPath = Path.Combine(_outputDirectory, GetInfoBoxPath(mapId, filterId));
            var uri = new Uri(outputPath);
            WriteJsonToFilePath(uri.LocalPath, infoBoxes);
        }

        /// <summary>Gets raw data rows as Dictionary of ColumnName => Value</summary>
        private List<IDictionary<string, object>> GetRawData(ToolConfig toolConfig, string filterId)
        {
            string inputPath = Path.Combine(_inputDirectory, toolConfig.MapId.ToString(), filterId + ".csv");
            using (var reader = new StreamReader(inputPath))
            using (var csv = new CsvReader(reader))
            {
                var dataRows = csv.GetRecords<dynamic>()
                    .Select(r => r as IDictionary<string, object>)
                    .ToList();
                return dataRows.ToList();
            }
        }

        /// <summary>Format Id Column in Raw Data to add leading "0"s</summary>
        public List<IDictionary<string, object>> DataRowIdFormatting(ToolConfig toolConfig, List<IDictionary<string, object>> dataRows)
        {
            foreach (IDictionary<string, object> id in dataRows)
            {
                int idealLength = toolConfig.IdealRowIdLength;
                var value = new object();
                if (id.TryGetValue(toolConfig.RowIdColName, out value))
                {
                    // value = value.ToString().Trim();
                    int itemLength = value.ToString().Length;
                    StringBuilder sb1 = new StringBuilder(idealLength);
                    if (itemLength != idealLength)
                    {
                        sb1 = new StringBuilder(idealLength);
                        for (int j = 0; j < idealLength - itemLength; j++)
                        {
                            sb1.Append("0");
                        }
                        sb1.Append(value);
                        id[toolConfig.RowIdColName] = sb1.ToString();
                    }
                }
            }

            return dataRows;
        }
    }
}
