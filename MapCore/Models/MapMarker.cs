using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MapCore.Models
{
    public class MapMarker
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public string Lat { get; set; }

        public string Lng { get; set; }
    }
}