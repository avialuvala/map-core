using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapCore.Models
{
    /// <summary>Global context class which contains Map, Legend, Filter settings etc.</summary>
    public class ToolConfig
    {
        public const int PayForPerfNavId = 656;
        public const int FinancialHealthNavId = 761;
        private const int _legendFooterWidthDefault = 165;
        private const int _legendFooterWidthWide = 165;
        public const string BoundaryPath = "\\json\\{0}\\Boundary\\Boundary_{1}_{2}.txt";
        public const string MarkerDataPath = "\\json\\Marker\\Marker_Data_{0}_ver{1}.txt";
        public const string BoundaryDataPath = "\\json\\Boundary\\Boundary_Data_{0}_ver{1}.txt";

        public const string BoundaryCountyPath = "\\json\\{0}\\Boundary\\Boundary_{1}_{2}_{3}.txt";

        public int MapId { get; set; }

        public int? NavId { get; set; }

        public string DisplayName { get; set; }

        public string ShortName { get; set; }

        public int MainAttributeId { get; set; }

        public bool ShowBanner { get; set; }

        /// <summary>TODO un-hard code</summary>
        public int LegendFooterWidth
        {
            get { return NavId == FinancialHealthNavId ? _legendFooterWidthWide : _legendFooterWidthDefault; }
        }

        public bool HasFilter { get { return Filter != null && Filter.Options != null && Filter.Options.Length > 0; } }

        public string DefaultFilterId { get; set; }

        public bool HasFaq { get; set; }

        public string IntroText { get; set; }

        /// <summary>TODO Generalize logic</summary>
        public bool ShowDataDownloadButton
        {
            get { return NavId == PayForPerfNavId; }
        }

        public int MarkerPriorityId { get; set; }

        public bool ShowMapClustering { get; set; }

        public bool ShowRelatedTools { get; set; }

        public int? MapType { get; set; }

        public RelatedResource[] RelatedResources { get; set; }

        public string RelatedResourcesJson
        {
            get
            {
                return JsonConvert.SerializeObject(RelatedResources);
            }
        }

        public InfoBox InfoBox { get; set; }

        public MapLegend Legend { get; set; }

        public MapFilter Filter { get; set; }

        public int IdealRowIdLength { get; set; }

        public string RowIdColName { get; set; }

        /// <summary>Whether to use embedded styling or not</summary>
        public bool IsEmbedded { get; set; }

        public ToolConfig()
        { }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }

        public MapAttribute GetMainAttribute()
        {
            return InfoBox.GetAttribute(MainAttributeId);
        }

        //Reference table is C_AdminMapType_Reference so if you update it here, update it there or you're just gonna break things
        public enum MapTypes
        {
            Provider = 1,
            ZipCode = 4,
            Zip3 = 5,
            County = 3,
            State = 6,
            General = 7
        }
    }
}
