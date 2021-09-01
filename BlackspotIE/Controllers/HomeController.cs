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
            if ((bool)Session["isVerified"])
            {
                ViewBag.Title = "Black Spot Overwatch";
                return View();
            }
            else
            {
                ViewBag.Error = "You need to enter the password first.";
                return RedirectToAction("Password");
            }
        }
        public ActionResult Map()
        {
            if ((bool)Session["isVerified"])
            {
                ViewBag.Title = "View The Map - Black Spot Overwatch";
                return View();
            }
            else
            {
                ViewBag.Error = "You need to enter the password first.";
                return RedirectToAction("Password");
            }
        }

        public ActionResult SpotMyArea()
        {
           
            if ((bool)Session["isVerified"])
            {
                ViewBag.Title = "Spot My Area - Black Spot Overwatch";
                return View();
            }
            else
            {
                ViewBag.Error = "You need to enter the password first.";
                return RedirectToAction("Password");
            }
        }
        public ActionResult MoreInfo()
        {
            
            if ((bool)Session["isVerified"])
            {
                ViewBag.Title = "MoreInfo - Black Spot Overwatch";
                return View();
            }
            else
            {
                ViewBag.Error = "You need to enter the password first.";
                return RedirectToAction("Password");
            }
        }
        public ActionResult About()
        {
            
            if ((bool)Session["isVerified"])
            {
                ViewBag.Title = "About Us - Black Spot Overwatch";
                return View();
            }
            else
            {
                ViewBag.Error = "You need to enter the password first.";
                return RedirectToAction("Password");
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Password(string password)
        {
            if (password.Equals("blackspot"))
            {
                Session["isVerified"] = true;
                return RedirectToAction("Index");
            }
            else
            {
                Session["isVerified"] = false;
                ViewBag.Error = "Password not correct!!";
                return View();
            }
            
        }
        public ActionResult Password()
        {
            if ((bool)Session["isVerified"] == false)
            {
                
                return View();
            }
            else
            {
                return RedirectToAction("Index");
            }
        }
    }
}