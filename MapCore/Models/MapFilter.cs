using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MapCore.Models
{
    public class MapFilter
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Desc { get; set; }

        public MapFilter[] Options { get; set; }

        /// <summary>Optional columname of corresponding DataRow property</summary>
        public string ColName { get; set; }

    }
}