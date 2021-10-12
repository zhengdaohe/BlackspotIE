using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace BlackspotIE
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}/{start}/{end}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, start = UrlParameter.Optional, end = UrlParameter.Optional }
            );
        }
    }
}
