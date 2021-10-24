
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MapCore.Models
{
    public class MapLegend //: Legend
    {
        public string Header { get; set; }

        public string Footer { get; set; }

        public List<LegendRange> Ranges { get; set; }
    }

    public class LegendRange
    {
        /// <summary>Index used for id and sort order</summary>
        public int Ix { get; set; }
        public double? LowerLimit { get; set; }
        public double? UpperLimit { get; set; }

        public string DisplayText { get; set; }

        public string IconUrl { get; set; }
    }
}