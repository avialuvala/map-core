using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapCore.Models
{
    /// <summary>
    /// A set of InfoBoxTabs for a given Marker
    /// </summary>
    public class InfoBox
    {
        public string Id { get; set; }
        public List<InfoBoxTab> Tabs { get; set; }

        public InfoBox()
        {
            Tabs = new List<InfoBoxTab>();
        }

        public InfoBox(string id) : this()
        {
            Id = id;
        }

        /// <summary>Finds Attribute by Id if exists</summary>
        public MapAttribute GetAttribute(int attributeId)
        {
            foreach (var tab in Tabs)
            {
                foreach (var attr in tab.Attributes)
                {
                    if (attr.Id == attributeId)
                    {
                        return attr;
                    }
                }
            }
            return null;
        }
    }
}
