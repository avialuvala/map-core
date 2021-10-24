using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Extensions.Caching.Memory;
using Advisory.Highcharts;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MapCore.Controllers;

namespace MapCore.Models
{
    /// <summary>Helper Repository for fetching JSON data files</summary>
    public class JsonDataRepo
    {
        /// <summary>Name of project directory in which this resides</summary>
        protected const string ProjectDirectory = "MapCore";
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _env;
        private readonly IMemoryCache _cache;
        private readonly IAmazonS3 _s3Client;
        private readonly ILogger<HomeController> _logger;
        private readonly string _baseFilePath;

        public JsonDataRepo(IConfiguration configuration, IHostingEnvironment env, IMemoryCache cache, IAmazonS3 s3Client, ILogger<HomeController> logger)
        {
            _configuration = configuration;
            _env = env;
            _cache = cache;
            _s3Client = s3Client;
            _logger = logger;
            _baseFilePath = _env == null ? null : Path.Combine(_env.ContentRootPath, "tmp");
        }

        /// <summary>Gets a JSON object from IMemoryCache > Local File Storage > S3</summary>
        private T GetJsonObject<T>(string path)
        {
            //If object exists in IMemoryCache, return cached object
            string cacheKey = $"JsonDataRepo.GetJsonObject:{path}";
            _cache.Remove(cacheKey); // enable if needed for debugging locally
            if (!_cache.TryGetValue(cacheKey, out T result))
            {
                //Else check if file exists in local file system
                string localFilePath = Path.Combine(_baseFilePath, path);
                var uri = new Uri(localFilePath);
                var fileInfo = new FileInfo(uri.LocalPath);
                if (fileInfo.Exists)
                {
                    string jsonString = File.ReadAllText(uri.LocalPath);
                    result = JsonConvert.DeserializeObject<T>(jsonString);
                }
                //Else read from S3
                else
                {
                    // Create a GetObject request
                    string bucketName = _configuration[Constants.PrivateS3Bucket];
                    string key = $"Map/json/{path}";
                    _logger.LogInformation($"JsonDataRepo.GetJsonObject:{bucketName}:{key}");
                    GetObjectRequest request = new GetObjectRequest
                    {
                        BucketName = bucketName,
                        Key = key
                    };
                    // Issue request and remember to dispose of the response
                    using (GetObjectResponse response = Task.Run(() => _s3Client.GetObjectAsync(request)).Result)
                    {
                        using (StreamReader reader = new StreamReader(response.ResponseStream))
                        {
                            string contents = reader.ReadToEnd();
                            //Write result to local file system
                            fileInfo.Directory.Create();
                            File.WriteAllText(uri.LocalPath, contents);
                            result = JsonConvert.DeserializeObject<T>(contents);
                        }
                    }
                }
                //Store in cache
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromDays(1));
                _cache.Set(cacheKey, result, cacheEntryOptions);
            }
            return result;
        }

        /// <summary>Gets MapConfig for a given mapId from JSON file</summary>
        public ToolConfig GetToolConfig(int mapId)
        {
            string path = $"{mapId}/ToolConfig.json";
            var mapConfig = GetJsonObject<ToolConfig>(path);
            return mapConfig;
        }

        /// <summary>Gets MapConfig for a given *mapName* from JSON file</summary>
        public ToolConfig GetMapConfig(string mapName, bool isEmbedded)
        {
            if (string.IsNullOrWhiteSpace(mapName))
            {
                mapName = "p4p";
            }
            int mapId = GetMapId(mapName);
            var pageModel = GetToolConfig(mapId);
            pageModel.IsEmbedded = isEmbedded;
            return pageModel;
        }

        /// <summary>Gets MapId for a given MapName from JSON file</summary>
        private int GetMapId(string mapName)
        {
            var path = "MapNameConfig.json";
            var mapNameConfig = GetJsonObject<ToolConfig[]>(path);
            int mapId = mapNameConfig.Where(a => a.ShortName.Equals(mapName, StringComparison.InvariantCultureIgnoreCase)).Select(id => id.MapId).First();
            return mapId;
        }

        /// <summary>Gets Markers for a given mapId + filter/year</summary>
        public List<MapMarker> GetMarkers(int mapId, string filterId)
        {
            string path = GetMarkerPath(mapId, filterId);
            var markers = GetJsonObject<List<MapMarker>>(path);
            return markers;
        }

        /// <summary>Gets Marker path</summary>
        /// <param name="root"></param>
        /// <param name="mapId"></param>
        /// <param name="filterId"></param>
        /// <returns></returns>
        protected string GetMarkerPath(int mapId, string filterId)
        {
            string fileName = string.Format("Markers_{0}.json", filterId);
            string path = $"{mapId}/Markers/{fileName}";
            return path;
        }

        /// <summary>Gets InfoBox data for a given map-marker-filterId pair</summary>
        public InfoBox GetInfoBoxById(int mapId, string markerId, string filterId)
        {
            string path = GetInfoBoxPath(mapId, filterId);
            var allInfoBoxes = GetJsonObject<List<InfoBox>>(path);//JsonConvert.DeserializeObject<List<InfoBox>>(jsonString);
            var infoBox = allInfoBoxes.Where(x => x.Id == markerId).FirstOrDefault();
            return infoBox;
        }

        protected string GetInfoBoxPath(int mapId, string filterId)
        {
            string fileName = string.Format("InfoBox_{0}.json", filterId);
            string path = $"{mapId}/InfoBox/{fileName}";
            return path;
        }

        /// <summary>Gets trend line chart for given map-marker-attribute pair</summary>
        public GenericChart GetChart(int mapId, string markerId, int attributeId)
        {
            //Get attribute value for each year
            List<DataPoint> dataPoints = new List<DataPoint>();
            var toolConfig = GetToolConfig(mapId);
            foreach(var filter in toolConfig.Filter.Options)
            {
                var infoBox = GetInfoBoxById(mapId, markerId, filter.Id);
                double? value = null;
                if (infoBox != null)
                {
                    var attr = infoBox.GetAttribute(attributeId);
                    value = attr?.Val;
                }
                dataPoints.Add(new DataPoint(filter.Name, value));
            }
            //Build chart
            var attribute = toolConfig.InfoBox.GetAttribute(attributeId);
            var chart = new LineChart
            {
                chart = new ChartSettings
                {
                    type = RenderType.line,
                },
                title = new Title(attribute.Name),
                legend = new Legend { enabled = false },
                series = new SeriesCollection
                {
                    new Series
                    {
                        name = attribute.Name,
                        data = dataPoints,
                        dataLabels = new DataLabels(attribute.Format)
                    }
                },
                xAxis = new XAxis
                {
                    new XAxisItem
                    {
                        title = new Title(""),
                        visible = true,
                        type = AxisDataType.category,
                        categories = null
                    }
                },
                yAxis = new YAxis
                {
                    new YAxisItem
                    {
                        title = new Title(""),
                        visible = true,
                        labels = new Labels
                        {
                            formatNumeral = attribute.Format,
                            enabled = true
                        }
                    }
                }
            };
            return chart;
        }

        //private void NoOp() {
        //    
        //}
    }
}
