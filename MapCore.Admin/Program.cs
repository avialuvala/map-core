using MapCore.Admin.Models;
using System;

namespace MapCore.Admin
{
    class Program
    {
        // 656 - P4P
        // 681 - Star Ratings
        private const int MapId = 681; //MapId to read input JSON from

        static void Main(string[] args)
        {
            //Start JSON building functions
            var adminRepo = new AdminRepo();
            adminRepo.BuildMapJson(MapId);
        }
    }
}
