using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BlackspotIE.Models;
using BlackspotIE.OpenData;

namespace BlackspotIE.Controllers
{
    public class HomeController : Controller
    {
        public static BlackSpotDataModelContainer1 DB = new BlackSpotDataModelContainer1();
        public ActionResult Index()
        {
                ViewBag.Title = "Black Spot Overwatch";
                return View();
        }
        public ActionResult Map(int id)
        {

                ViewBag.Title = "View The Map - Black Spot Overwatch";
                if (id == 1)
                {
                    return View();
                }
                else
                {

                    return View("RouteFinder");
                }


        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Map(string start, string end)
        {

                ViewBag.start = start;
                ViewBag.end = end;
                ViewBag.Title = "View The Map - Black Spot Overwatch";
                return View("RouteFinder");
           
        }

        public ActionResult SpotMyArea()
        {
           
            
                ViewBag.Title = "Spot My Area - Black Spot Overwatch";
                return View();
            
        }
        public ActionResult MoreInfo()
        {
            
            
                ViewBag.Title = "MoreInfo - Black Spot Overwatch";
                return View();
            
        }
        public ActionResult About()
        {
            
            
                ViewBag.Title = "About Us - Black Spot Overwatch";
                return View();
            
        }

        public ActionResult ErrorPage()
        {
                return View();
        }
    }
}