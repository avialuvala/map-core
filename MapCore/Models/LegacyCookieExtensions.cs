using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapCore.Models
{
    /// <summary>
    /// Handle parsing of request cookies
    /// https://stackoverflow.com/questions/43701126/how-to-handle-multi-value-cookies-in-asp-net-core
    /// </summary>
    public static class LegacyCookieExtensions
    {
        public static IDictionary<string, string> FromLegacyCookieString(this string legacyCookie)
        {
            return legacyCookie.Split('&').Select(s => s.Split('=')).ToDictionary(kvp => kvp[0], kvp => kvp[1]);
        }

        public static string ToLegacyCookieString(this IDictionary<string, string> dict)
        {
            return string.Join("&", dict.Select(kvp => string.Join("=", kvp.Key, kvp.Value)));
        }
    }
}
