using System;
using System.Collections.Generic;

namespace MapCore.Admin.Models
{
    public partial class CProvGeoConfig
    {
        public int? MarkerId { get; set; }
        public string EntityId { get; set; }
        public string GmapLat { get; set; }
        public string GmapLng { get; set; }
        public string StateFips { get; set; }
        public string StateShortName { get; set; }
        public string StateLongName { get; set; }
        public string CountyFips { get; set; }
        public string CountyLongName { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Src { get; set; }
        public string CbsaCode { get; set; }
        public string CbsaName { get; set; }
        public string ProvName { get; set; }
    }
}
