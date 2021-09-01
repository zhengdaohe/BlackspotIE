using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using Newtonsoft.Json;
using BlackspotIE.OpenData;
using BlackspotIE.Models;

namespace BlackspotIE.Hubs
{
    public class PostCodeQuery : Hub
    {
        public static BlackSpotDataModelContainer1 DB = new BlackSpotDataModelContainer1();
        public void Send(string postcode)
        {

            Clients.Caller.display("Accessing Database......");
            if (DB.Suburbs.Count() == 0)
            {
                Clients.Caller.display("database loading");
                DataLoader.Load();
                Clients.Caller.display("database loaded");
            }
            //var client = new HttpClient();
            //var uri = "http://api.beliefmedia.com/postcodes/" + postcode + ".json";
            //var response = client.GetAsync(uri);
            //response.Wait();
            //var content = response.Result.Content.ReadAsStringAsync();
            //content.Wait();
            //LocationModel formattedResult = JsonConvert.DeserializeObject<LocationModel>(content.Result);
            //Clients.Caller.displayResult(formattedResult.data.locality);
            List<Suburb> matched = DB.Suburbs.Where(s => s.Postcode.Equals(postcode)).ToList();
            if (matched.Count > 0)
            {
                string names = "[";
                foreach (Suburb suburb in matched)
                {
                    names = names + '"' + suburb.Name + '"' + ",";
                }
                names = names.TrimEnd(',');
                names = names + ']';
                string geometry = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[" + matched.First().Geometry + "]]]}}";
                Clients.Caller.displayResult(postcode, names, "true");
            }
            else
            {
                Clients.Caller.displayResult(postcode, "Not found", "false");
            }
            
        }
        public void Getpoly(string postcode, string loc)
        {
            List<Suburb> matched = DB.Suburbs.Where(s => s.Postcode.Equals(postcode)).ToList();
            List<Suburb> result = matched.Where(s => s.Name.Equals(loc)).ToList();
            string geometry = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[" + result[0].Geometry + "]]]}}";
            Clients.Caller.displaypolygon(geometry, "[" + result[0].Long + "," + result[0].Lat + "]");

        }
        public void Getinfo(string postcode, string loc)
        {
            List<Suburb> matched = DB.Suburbs.Where(s => s.Postcode.Equals(postcode)).ToList();
            Suburb result = matched.Where(s => s.Name.Equals(loc)).ToList()[0];
            

        }
    }


}