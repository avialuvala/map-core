using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MapCore.Models
{
    /// <summary>
    /// Helper method for cache-busting static file assets. Uses SHA256 of file to determine if change occurred.
    /// https://stefanolsen.com/posts/cache-busting-2-an-update-for-aspnet-core/
    /// </summary>
    public static class UrlHelperExtensions
    {
        private const string WebRootBasePath = "wwwroot";
        private static readonly ConcurrentDictionary<string, string> CachedFileHashes =
            new ConcurrentDictionary<string, string>();

        public static string ContentVersioned(this IUrlHelper urlHelper, string contentPath)
        {
            string url = urlHelper.Content(contentPath);

            // Check if we already cached the file hash in the cache. If not, add it using the inner method.
            string fileHash = CachedFileHashes.GetOrAdd(url, key =>
            {
                var fileInfo = new FileInfo(WebRootBasePath + key);

                // If file exists, generate a hash of it, otherwise return null.
                return fileInfo.Exists
                    ? ComputeFileHash(fileInfo.OpenRead())
                    : null;
            });

            return $"{url}?v={fileHash}";
        }

        private static string ComputeFileHash(Stream fileStream)
        {
            using (SHA256 hasher = new SHA256Managed())
            using (fileStream)
            {
                byte[] hashBytes = hasher.ComputeHash(fileStream);

                var sb = new StringBuilder(hashBytes.Length * 2);

                foreach (byte hashByte in hashBytes)
                {
                    sb.AppendFormat("{0:x2}", hashByte);
                }

                return sb.ToString();
            }
        }
    }
}
