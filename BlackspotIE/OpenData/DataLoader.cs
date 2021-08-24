using BlackspotIE.Controllers;
using BlackspotIE.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Spatial;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace BlackspotIE.OpenData
{
    public class DataLoader
    {
        public static BlackSpotDataModelContainer1 DB = HomeController.DB;
        public static void Load()
        {
            //string path_A = @"E:\Users\Lohse\source\repos\BlackspotIE\BlackspotIE\OpenData\australian_postcodes.json";
            //FileStream fileStream = new FileStream(path_A, FileMode.Open, FileAccess.Read, FileShare.Read);
            //StreamReader reader = new StreamReader(fileStream, Encoding.UTF8);
            var client = new HttpClient();
            var uri = "https://www.matthewproctor.com/Content/postcodes/australian_postcodes.json";
            var response = client.GetAsync(uri);
            response.Wait();
            var json = response.Result.Content.ReadAsStringAsync();
            json.Wait();
            string content = json.Result;
            content = Regex.Replace(content, "\r", "");
            content = Regex.Replace(content, "\n", "");
            string pattern = "\"postcode\": \"([\\d]{4})\", {4}\"locality\": \"([A-Z ]+?)\", {4}\"state\": \"VIC\",[\\s\\S]+?\"Lat_precise\": \"([-.\\d]+?)\", {4}\"Long_precise\": \"([-.\\d]+?)\",";
            string[] suburb_details = Regex.Split(content, "},");
            List<Suburb> suburbs = new List<Suburb>();
            foreach (string detail in suburb_details)
            {
                if (Regex.IsMatch(detail, pattern))
                {
                    Match matching = Regex.Match(detail, pattern);
                    Suburb suburb = new Suburb()
                    {
                        Postcode = matching.Groups[1].Value,
                        Name = matching.Groups[2].Value,
                        Lat = matching.Groups[3].Value,
                        Long = matching.Groups[4].Value,
                        Geometry = ""
                    };
                    suburbs.Add(suburb);
                }
            }
            //string path_B = @"E:\Users\Lohse\source\repos\BlackspotIE\BlackspotIE\OpenData\VICSuburb.json";
            //fileStream = new FileStream(path_B, FileMode.Open, FileAccess.Read, FileShare.Read);
            //reader = new StreamReader(fileStream, Encoding.UTF8);
            //content = reader.ReadToEnd();
            client = new HttpClient();
            uri = "https://data.gov.au/geoserver/vic-suburb-locality-boundaries-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_af33dd8c_0534_4e18_9245_fc64440f742e&outputFormat=json";
            response = client.GetAsync(uri);
            response.Wait();
            json = response.Result.Content.ReadAsStringAsync();
            json.Wait();
            content = json.Result;
            pattern = "\"coordinates\":\\[\\[\\[((?:\\[.+?,.+?])+)]]][\\s\\S]+?\"vic_loca_2\":\"([A-Z ]+?)\"";
            string[] suburb_poly_details = Regex.Split(content, "MultiPolygon");
            foreach (string poly in suburb_poly_details)
            {
                if (Regex.IsMatch(poly, pattern))
                {
                    Match matching = Regex.Match(poly, pattern);
                    List<Suburb> select = suburbs.Where(s => s.Name.Equals(matching.Groups[2].Value)).ToList();
                    if (matching.Groups[2].Value.Equals("WILLIAMSTOWN"))
                    {
                        var x = matching.Groups[1].Value;
                    }
                    foreach (Suburb sb in select)
                    {
                        sb.Geometry = matching.Groups[1].Value;
                        DB.Suburbs.Add(sb);
                    }

                }
            }

            DB.SaveChanges();
            
            //path = @"E:\Users\Lohse\source\repos\BlackspotIE\BlackspotIE\OpenData\RoadCrashes.geojson";
            //fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
            //reader = new StreamReader(fileStream, Encoding.UTF8);
            //while (reader.ReadLine() != null)
            //{
            //    string pattern = "\"coordinate\": \\[ ([\\s\\S]+?) ]";
            //    string line = reader.ReadLine();
            //    if (Regex.IsMatch(line, pattern))
            //    {
            //        Match matching = Regex.Match(line, pattern);
            //        Suburb suburb = new Suburb()
            //        {
            //            Postcode = matching.Groups[1].Value,
            //            Name = matching.Groups[2].Value,
            //            Geometry = matching.Groups[3].Value
            //        };
            //        DB.Suburbs.Add(suburb);
            //    }

            //}
            //DB.SaveChanges();


        }
    }
}