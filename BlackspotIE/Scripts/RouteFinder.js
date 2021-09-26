
var spots = null;
var start = $("#start");
var end = $("#end");
var count = 0
mapboxgl.accessToken = 'pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg';
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v10', 
    maxZoom: 14,
    minZoom: 14,
    center: [144.946457, -37.840935]
});
var feature_list = [];
var json = null;

map.on('load', () => {
    map.addSource('crash', {
        type: 'geojson',
        data: null,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 27.3
    });
    map.addSource('blackspot', {
        type: 'geojson',
        data: null,
    });
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'crash',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': '#ff0000',
            'circle-radius': 0.1,
            'circle-opacity': 0.1,
        }
    });
    
    map.addSource('theRoute', {
        type: 'geojson',
        data: {
            type: 'Feature'
        }
    });
    
    map.addLayer({
        id: 'theRouteWrapper',
        type: 'line',
        source: 'theRoute',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#e61549',
            'line-opacity': 1,
            'line-width': 15,
            'line-blur': 0.5
        }
    });
    map.addLayer({
        id: 'theRoute',
        type: 'line',
        source: 'theRoute',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#e61549',
            'line-opacity': 1,
            'line-width': 11,
            'line-blur': 0.5
        }
    });
    map.addLayer({
        id: 'clearances',
        type: 'fill',
        source: 'blackspot',
        layout: {},
        filter: [">=", ['get', 'point_count'], 10],
        paint: {
            'fill-color': [
                'step',
                ['get', 'point_count'],
                '#ed9b18',
                30,
                '#eb1543'
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': '#f03b20'
        }
    });
    map.addSource('theBox', {
        type: 'geojson',
        data: {
            type: 'Feature'
        }
    });
    map.addLayer({
        id: 'theBox',
        type: 'fill',
        source: 'theBox',
        layout: {},
        paint: {
            'fill-color': '#FFC300',
            'fill-opacity': 0.5,
            'fill-outline-color': '#FFC300'
        }
    });
    map.on('render', () => {
        var features = [];
        const features_ = map.querySourceFeatures('crash', {
            sourceLayer: 'clusters'
        });
        features_.forEach(function (point) {
            if (typeof (point.id) != "undefined") {
                features.push(point);
            };
        })
        if (feature_list.length != features.length) {
            console.log("render")
            feature_list = features;
            var obstacle = {
                'type': 'FeatureCollection',
                'properties': {},
                'features': feature_list.filter(feature => feature.properties.point_count >= 30)
            }
            spots = turf.buffer(obstacle, 0.05, { units: 'kilometers' });
            
            map.getSource('blackspot').setData(turf.buffer({
                'type': 'FeatureCollection',
                'properties': {},
                'features': feature_list.filter(feature => feature.properties.point_count >= 10)
            }, 0.05, { units: 'kilometers' }));
        }
    });
    var url = "https://crash.b-cdn.net/Edited_Postcode_suburb.json";
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function () {
        if (request.status == 200) {
            json = JSON.parse(request.responseText);
            map.getSource('crash').setData(json);
        }
    }
});



var timer = null;
$(document).click(function () { $('.search-bar-results').fadeOut(500); });
$(".addr").on('input', function () {
    var input = $(this);
    clearTimeout(timer);
    $('.search-bar-results').fadeOut(500);
    if ($(this).val().length != 0) {
        var cur = $(this);
        timer = setTimeout(function () {
            keyword = cur.val().replace(" ", "%20").replace("/", "%2F");
            var geo_api = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + keyword + ".json?bbox=141,-39,150,-34&language=en&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
            var loc_request = new XMLHttpRequest();
            loc_request.open("get", geo_api);
            loc_request.send(null);
            console.log("asa")
            loc_request.onload = function () {
                if (loc_request.status == 200) {
                    response = JSON.parse(loc_request.responseText)
                    var selectlist = document.getElementById('result');
                    selectlist.innerHTML = "";
                    if (response.features.length == 0) {
                        $('#result').html('Address Not Found!');
                    }
                    response.features.forEach(function (loc) {
                        if (loc.place_name_en.indexOf(" Victoria") != -1) {
                            var option = document.createElement("li");
                            var link = document.createElement("a");
                            if (typeof (loc.address) == "undefined") {
                                loc.address = "";
                            }
                            else {
                                loc.address = loc.address + " "
                            }
                            var addr_line = loc.address + loc.text_en + ", " + loc.context[1].text_en + ", VIC" + loc.context[0].text_en;
                            link.innerHTML = addr_line;
                            link.id = loc.center[0] + "," + loc.center[1];
                            link.href = "#";
                            link.addEventListener("click", function (e) {
                                input.val(this.innerHTML)
                                if (input.attr("id") == "startInput") {
                                    start.val(this.id)
                                    map.setCenter(loc.center)
                                    var marker = new mapboxgl.Marker()
                                    marker.setLngLat(loc.center).addTo(map)
                                    start.change()
                                }
                                else if (input.attr("id") == "endInput") {
                                    end.val(this.id)
                                    var marker = new mapboxgl.Marker({
                                        color: '#ed1581'
                                    })
                                    marker.setLngLat(loc.center).addTo(map)
                                    end.change()
                                }
                                return false

                            });
                            option.appendChild(link);

                            selectlist.appendChild(option);
                        }
                        
                    });
                    if (selectlist.childElementCount == 0) {
                        $('#result').html('Address Not Found!');
                    }
                    
                    $('.search-bar-results').fadeIn(500);

                }
                else {
                    $('#result').html('Search Failed!');
                    $('.search-bar-results').fadeIn(500);
                }
            }
        }, 500);
        
    }
    else {
        $('.search-bar-results').fadeOut(500);
    }
    
})

var route = null;
var boundary = null;
//var polygon = null;
//var bbox = null;
var start_iter = 0;
var draw_route = function (waypoint, direction_api) {
    if (direction_api == "") {
        direction_api = "https://api.mapbox.com/directions/v5/mapbox/driving/" + waypoint + "?geometries=geojson&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg"
    }
    
    var direction_request = new XMLHttpRequest();
    direction_request.open("get", direction_api);
    direction_request.send(null);
    direction_request.onload = function () {
        if (direction_request.status == 200) {

            route = JSON.parse(direction_request.responseText);
            //if (start_iter == 0) {
                var bbox = turf.bbox(route.routes[0].geometry);
                var polygon = turf.bboxPolygon(bbox);
                start_iter = 1
            //}
            var route_line = {
                'type': 'Feature',
                'properties': {},
                'geometry': route.routes[0].geometry
            }
            map.getSource('theRoute').setData(route_line);
            map.getSource('theBox').setData(polygon);
            map.setPaintProperty('theRoute', 'line-color', '#5ea39e');
            map.setPaintProperty('theRouteWrapper', 'line-color', '#5d9991');
            if (!turf.booleanDisjoint(spots, route_line)) {
                if (count != 50) {
                    count = count + 1
                    map.setPaintProperty('theRoute', 'line-color', '#4882c5');
                    map.setPaintProperty('theRouteWrapper', 'line-color', '#2d5f99');
                    polygon = turf.transformScale(polygon, count * 0.01);
                    bbox = turf.bbox(polygon);
                    const randomWaypoint = turf.randomPoint(1, { bbox: bbox });
                    if (waypoint.split(";").length == 2) {
                        waypoint = waypoint.split(";")[0] + ";" + randomWaypoint['features'][0].geometry.coordinates[0] + "," + randomWaypoint['features'][0].geometry.coordinates[1] + ";" + waypoint.split(";")[1]
                    }
                    else {
                        waypoint = waypoint.split(";")[0] + ";" + randomWaypoint['features'][0].geometry.coordinates[0] + "," + randomWaypoint['features'][0].geometry.coordinates[1] + ";" + waypoint.split(";")[2]
                    }

                    direction_api = "https://api.mapbox.com/directions/v5/mapbox/driving/" + waypoint + "?radiuses=40;;100&waypoints=0;2&geometries=geojson&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg"
                    draw_route(waypoint, direction_api)
                }
                else {
                    map.setLayoutProperty('theBox', 'visibility', 'none');
                    $("#prompt").text("No appropriate route found in 50 tries.")
                }

            }
            else {
                map.setLayoutProperty('theBox', 'visibility', 'none');
                map.setPaintProperty('theRoute', 'line-color', '#74c476');
                $("#prompt").text("Route found!")
            }


        }
    }

}
$(".locs").on("change", function () {
    var a = start.val()
    var b = end.val()
    var waypoint = a+";"+b
    if (start.val() != "" && end.val() != "") {
        draw_route(waypoint,"")
        count = 0

    }
})
var address_query = function (keyword) {
    }

$(function () {
    var postCodeQuery = $.connection.postCodeQuery;
    postCodeQuery.client.displayResult = function (postcode, locationArray, isFound) {
        
    };
    postCodeQuery.client.displaypolygon = function (geometry, center, suburb) {
        
    };
    $.connection.hub.start().done(function () {
        
    });

});