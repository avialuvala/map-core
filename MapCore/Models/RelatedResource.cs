using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MapCore.Models
{
    /// <summary>Represents a Related Resource link</summary>
    public class RelatedResource
    {
        public int ToolId { get; set; }
        public int Ix { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Desc { get; set; }
    }
}