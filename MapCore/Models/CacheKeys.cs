using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapCore.Models
{
    public static class CacheKeys
    {
        public static string GetMapConfigJson(int mapId) {
            return string.Format("GetMapConfigJson:{0}", mapId);
        }

        public static string GetMarkers(int mapId, string filterId)
        {
            return string.Format("GetMarkers:{0}:{1}", mapId, filterId);
        }

        public static string GetInfoBoxConfig(int mapId, string filterId)
        {
            return string.Format("GetInfoBoxConfig:{0}:{1}", mapId, filterId);
        }
    }
}
