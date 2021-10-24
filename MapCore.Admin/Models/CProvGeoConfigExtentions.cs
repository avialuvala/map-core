using MapCore.Models;
using System;
using System.Collections.Generic;

namespace MapCore.Admin.Models
{
    public partial class CProvGeoConfig
    {
        public MapMarker ToMapMarker()
        {
            return new MapMarker
            {
                Id = EntityId,
                Name = ProvName,
                Lat = GmapLat,
                Lng = GmapLng
            };
        }
    }
}
