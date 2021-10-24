using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NumeralSharp;

namespace MapCore.Models
{
    public class MapAttribute : ICloneable
    {
        private const string _defaultDisplayValue = "No Data";

        public int Id { get; set; }

        /// <summary>Display name</summary>
        public string Name { get; set; }

        /// <summary>Column/property name used to map to raw data</summary>
        public string ColName { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Desc { get; set; }

        public bool LessThan11Check { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? HasChart { get; set; }

        public MapAttribute() { }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public double? Val { get; set; }

        public string DisplayVal { get; set; }

        /// <summary>NumeralJS format</summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Format { get; set; }

        /// <summary>DisplayVal if null</summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string FormatNull { get; set; }

        /// <summary>Sets attribute_display_value based on value and metadata</summary>
        public string CalculateDisplayValue()
        {
            //If a NumeralJS format exists, convert Val to DispVal
            if(!string.IsNullOrEmpty(Format))
            {
                DisplayVal = new Numeral(Val).Format(Format);
            }
            return DisplayVal;
        }

        /// <summary>Creates a fork of current Attribute and maps values to data frame</summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public MapAttribute MapToData(IDictionary<string, object> dataRow)
        {
            //Map display value based on column name
            var att = (MapAttribute)Clone();
            if (dataRow.ContainsKey(ColName))
            {
                att.DisplayVal = dataRow[ColName] as string;
                //If numeric, convert to double
                bool isNumeric = double.TryParse(att.DisplayVal, out var numericVal);
                if(isNumeric)
                {
                    att.Val = numericVal;
                    //If formatting exists, format numeral
                    if(!string.IsNullOrEmpty(Format))                      
                    {
                        if (ColName != "Id" && !att.DisplayVal.Contains('E'))
                        { 
                            att.DisplayVal = new Numeral(att.Val).Format(Format);
                        }
                    }
                }
                //Else if FormatNull exists and value is null, set FormatNull (e.g. "No Data")
                else if(FormatNull != null && string.IsNullOrEmpty(att.DisplayVal))
                {
                    att.DisplayVal = FormatNull;
                }
            }
            return att;
        }

        public object Clone()
        {
            return MemberwiseClone();
        }

    }

    /// <summary>TODO fill out rather than use placeholder nonsense</summary>
    public enum AttributeType
    {
        Normal = 2
    }
}