using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MapCore.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Serialization;
using Microsoft.Extensions.Logging;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Amazon.S3;

namespace MapCore.Controllers
{
    public class HomeController : Controller
    {
        //private DataRepo _dataRepo;
        //int _toolId;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private readonly JsonDataRepo _jsonDataRepo;
        private readonly ILogger _logger;

        public HomeController(IConfiguration configuration, IHostingEnvironment env, IMemoryCache memoryCache, ILogger<HomeController> logger, IAmazonS3 s3Client)
        {
            _configuration = configuration;
            _cache = memoryCache;
            _jsonDataRepo = new JsonDataRepo(configuration, env, _cache, s3Client, logger);
            _logger = logger;
        }

        /// <summary>Returns a JSON result in camel case form</summary>
        /// <param name="res"></param>
        /// <returns></returns>
        private ContentResult JsonCamelCaseResult(object res)
        {
            string json = JsonConvert.SerializeObject(res, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            return Content(json, "application/json");
        }

        public IActionResult Index(string var, string time, int? embed)
        {
            _logger.LogInformation("/Map/Index/ var={1},time={time}", var, time);
            var pageModel = _jsonDataRepo.GetMapConfig(var, embed == 1);// new PageModel();
            //p.Aid = CipherHelper.Encrypt(_advid); 
            if (time != null)
            {
                pageModel.DefaultFilterId = time;
            }
            return View("Index", pageModel);
        }

        /// <summary>Redirect static requests to public S3 bucket</summary>
        /// <param name="fileKey">File path</param>
        public RedirectResult Static(string fileKey)
        {
            string cdnUrlBase = Constants.CdnUrlBase;
            string redirectUrl = $"{cdnUrlBase}/{fileKey}";
         
            return Redirect(redirectUrl);
        }

        public ContentResult GetMarkers(int? filterId, int mapId)
        {
            var markers = _jsonDataRepo.GetMarkers(mapId, filterId?.ToString());            
            return Content(JsonConvert.SerializeObject(markers), "application/json");
        }

        public ContentResult GetInfoBox(int mapId, string markerId, string filterId)
        {
            _logger.LogInformation("/Map/GetInfoBox/ mapId={1},markerId={2},filterId={3}", mapId, markerId, filterId);
            var infoBox = _jsonDataRepo.GetInfoBoxById(mapId, markerId, filterId);
            return JsonCamelCaseResult(infoBox);
        }

        public ContentResult GetChart(int mapId, string markerId, int attributeId)
        {
            _logger.LogInformation("/Map/GetChart/ mapId={1},markerId={2},attributeId={3}", mapId, markerId, attributeId);
            var chart = _jsonDataRepo.GetChart(mapId, markerId, attributeId);
            return Content(JsonConvert.SerializeObject(chart), "application/json");
        }

        public int HealthCheck()
        {
            return (int)HttpStatusCode.OK;
        }
    }
}
