using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapCore.Models
{
    /// <summary>
    /// A set of Attributes with a given name and ordering
    /// </summary>
    public class InfoBoxTab
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<MapAttribute> Attributes { get; set; }

        /// <summary>Returns a new InfoBoxTab and maps to Attribute data</summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public InfoBoxTab MapToData(IDictionary<string, object> dataRow)
        {
            var tab = new InfoBoxTab
            {
                Id = Id,
                Name = Name,
                Attributes = new List<MapAttribute>()
            };
            //Map attribute to incoming data frame
            foreach(var att in Attributes)
            {
                if (dataRow.ContainsKey(att.ColName))
                {
                    tab.Attributes.Add(att.MapToData(dataRow));
                }
            }
            return tab;
        }
    }
}
