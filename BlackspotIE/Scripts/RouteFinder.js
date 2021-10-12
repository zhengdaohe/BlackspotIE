$(".wui-side-menu-item").attr("disabled", true).css("pointer-events", "none");
mapboxgl.accessToken =
    "pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    maxZoom: 14,
    bounds: [
        [141, -39], // southwestern corner of the bounds
        [150, -34] // northeastern corner of the bounds
    ],
});
(function (window, undefined) {
    "use strict";
})(window);
const index = new Supercluster({
    radius: 27.3,
    maxZoom: 15
});
var fit = false;
var spots = null;
var start = $("#start");
var end = $("#end");
var count = 0;
var feature_list = [];
var current_marker = []
var documentReady = function (fn) {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});

if (start.val() != "" && end.val() != "") {
    $(".wui-overlay").removeClass("visible").addClass("hidden");
    introJs().hideHints();
}

function showRedToast() {
    $('.toast').remove();
    $('.map_box_container').before('<div class="toast add-margin"> <div class="toast__icon"> <i class="fa fa-exclamation-circle" aria-hidden="true" style="color: red"></i></div><div class="toast__content"> <p class="toast__type u-text-variant">Sorry</p><p class="toast__message">The algorithm has found no appropriate routes that can avoid high-risk black spots in 50 tries, but we show you the default shortest route for you on the map.</p></div><div class="toast__close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642"> <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061 c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061 l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541 l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path></svg></div></div>');
    $('.toast').focus();
    $('.toast__close').on("click", function (e) {
        e.preventDefault();
        var parent = $(this).parent('.toast');
        parent.fadeOut("slow", function () { $(this).remove(); });
    });
}

function showGreenToastWithSpot(counter) {
    $('.toast').remove();
    if (counter > 1) {
        $('.map_box_container').before('<div class="toast add-margin"> <div class="toast__icon"> <i class="fa fa-check-circle" aria-hidden="true" style="color: green"></i> </div><div class="toast__content"> <p class="toast__type">Success</p><p class="toast__message">The algorithm has found a safe route for you in ' + counter + ' tries, however there is still some mid-risk black spots on the route, check them in the list below. And we also show a comparision of the result(green) with the shortest route(blue)</p></div><div class="toast__close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642"> <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061 c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061 l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541 l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path></svg> </div></div>');

    }
    else {
        $('.map_box_container').before('<div class="toast add-margin"> <div class="toast__icon"> <i class="fa fa-check-circle" aria-hidden="true" style="color: green"></i> </div><div class="toast__content"> <p class="toast__type">Success</p><p class="toast__message">The algorithm has found a safe route for you in ' + counter + ' tries, however there is still some mid-risk black spots on the route, check them in the list below.</p></div><div class="toast__close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642"> <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061 c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061 l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541 l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path></svg> </div></div>');

    }
    $('.toast').focus();
    $('.toast__close').on("click", function (e) {
        e.preventDefault();
        var parent = $(this).parent('.toast');
        parent.fadeOut("slow", function () { $(this).remove(); });
    });
}
function showGreenToastWithoutSpot(counter) {
    $('.toast').remove();
    $('.map_box_container').before('<div class="toast add-margin"> <div class="toast__icon"> <i class="fa fa-check-circle" aria-hidden="true" style="color: green"></i> </div><div class="toast__content"> <p class="toast__type">Success</p><p class="toast__message">The algorithm has found a safe route for you in ' + counter + ' tries, your road is safe and good to go. </p></div><div class="toast__close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642"> <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061 c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061 l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541 l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path></svg> </div></div>');
    $('.toast').focus();
    $('.toast__close').on("click", function (e) {
        e.preventDefault();
        var parent = $(this).parent('.toast');
        parent.fadeOut("slow", function () { $(this).remove(); });
    });
}

documentReady(function () {

    $("#startInput").on("focus", function () {
        $('.search-bar-results').fadeOut(300);
        $('.result-list').html("");

    });
    $("#endInput").on("focus", function () {
        $('.search-bar-results').fadeOut(300);
        $('.result-list').html("");

    });
    // store tooltip showup
    var newVisitOrNot = localStorage.getItem("ifNewVisit");

    // Set to true to show the tooltips, but will save it as false for the next time.
    if (newVisitOrNot === null) {
        newVisitOrNot = true;
    }
    // Add hide overlay and show overlay event listener.
    $(".wui-retry-trigger").on("click", function () {
        // Shows the blur overlay.
        $('#startInput').val('');
        $('#start').val('');
        $('#endInput').val('');
        $('#end').val('');
        $(".wui-overlay").removeClass("hidden").addClass("visible");
        $(".chat").hide();
        $(".chat-message-counter").hide();
        $('.toast').remove();
        introJs().showHints();
        $("#prompt").text("");
        $("#listing").html('')
        map.setPaintProperty('clearances', 'fill-opacity', 0.8);
        current_marker.forEach(function (m) {
            m.remove()
        })
        current_marker = []
        map.getSource("theRoute").setData({
            type: "Feature",
        });
        map.setPaintProperty("theRoute", "line-color", "#b54343");
        map.getSource("theRouteDefault").setData({
            type: "Feature",
        });
        map.fitBounds(new mapboxgl.LngLatBounds(
            [141, -39], // southwestern corner of the bounds
            [150, -34] // northeastern corner of the bounds
        ), {
            padding: 20
        });
    });


    var json = null;

    map.on("load", () => {
        map.addSource("blackspot", {
            type: "geojson",
            data: null,
        });

        map.addSource("theRoute", {
            type: "geojson",
            data: null,
        });

        map.addLayer({
            id: "theRouteWrapper",
            type: "line",
            source: "theRoute",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#690000",
                "line-opacity": 1,
                "line-width": 15,
                "line-blur": 0.5,
            },
        });
        map.addSource("theRouteDefault", {
            type: "geojson",
            data: null,
        });
        map.addLayer({
            id: "theRouteDefaultWrapper",
            type: "line",
            source: "theRouteDefault",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#690000",
                "line-opacity": 1,
                "line-width": 15,
                "line-blur": 0.5,
            },
        });
        map.addLayer({
            id: "theRouteDefault",
            type: "line",
            source: "theRouteDefault",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#236bb8",
                "line-opacity": 1,
                "line-width": 11,
                "line-blur": 0.5,
            },
        });
        map.addLayer({
            id: "theRoute",
            type: "line",
            source: "theRoute",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#b54343",
                "line-opacity": 1,
                "line-width": 11,
                "line-blur": 0.5,
            },
        });
        map.addLayer({
            id: "clearances",
            type: "fill",
            source: "blackspot",
            layout: {},
            filter: [">=", ["get", "point_count"], 10],
            paint: {
                "fill-color": [
                    "step",
                    ["get", "point_count"],
                    "#ed9b18",
                    30,
                    "#eb1543",
                ],
                "fill-opacity": 0.8,

            },
        });
        map.addSource("theBox", {
            type: "geojson",
            data: {
                type: "Feature",
            },
        });
        map.addLayer({
            id: "theBox",
            type: "fill",
            source: "theBox",
            layout: {},
            paint: {
                "fill-color": "#FFC300",
                "fill-opacity": 0.5,
                "fill-outline-color": "#FFC300",
            },
        });
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
        var url = "https://crash.b-cdn.net/Edited_Postcode_suburb1.json";
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);
        request.onload = function () {
            if (request.status == 200) {
                json = JSON.parse(request.responseText);
                feature_list = index.load(json.features).getClusters([141, -39, 150, -34], 14);
                var obstacle = {
                    type: "FeatureCollection",
                    properties: {},
                    features: feature_list.filter(
                        (feature) => feature.properties.point_count >= 30
                    ),
                };
                spots = turf.buffer(obstacle, 0.05, { units: "kilometers" });

                map.getSource("blackspot").setData(
                    turf.buffer(
                        {
                            type: "FeatureCollection",
                            properties: {},
                            features: feature_list.filter(
                                (feature) => feature.properties.point_count >= 10
                            ),
                        },
                        0.05,
                        { units: "kilometers" }
                    )
                );
                if (start.val() != "" && end.val() != "") {
                    current_marker = [new mapboxgl.Marker(), new mapboxgl.Marker({
                        color: "#ed1581",
                    })]
                    current_marker[0].setLngLat([parseFloat(start.val().split(',')[0]), parseFloat(start.val().split(',')[1])])
                    current_marker[1].setLngLat([parseFloat(end.val().split(',')[0]), parseFloat(end.val().split(',')[1])])
                    start.change()
                }
            }
        };
    });

    var timer = null;
    $(document).click(function () {
        $(".search-bar-results").fadeOut(500);
    });
    $(".addr").on("input", function () {
        var input = $(this);
        clearTimeout(timer);
        $(".search-bar-results").fadeOut(500);
        if ($(this).val().length != 0) {
            var cur = $(this);
            timer = setTimeout(function () {
                keyword = cur.val().replace(" ", "%20").replace("/", "%2F");
                var geo_api =
                    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                    keyword +
                    ".json?bbox=141,-39,150,-34&language=en&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
                var loc_request = new XMLHttpRequest();
                loc_request.open("get", geo_api);
                loc_request.send(null);
                console.log("asa");
                loc_request.onload = function () {
                    if (loc_request.status == 200) {
                        response = JSON.parse(loc_request.responseText);
                        var selectlist = document.getElementById("result1");
                        if (input.attr("id") == "endInput") {
                            selectlist = document.getElementById("result2");
                        }

                        selectlist.innerHTML = "";
                        if (response.features.length == 0) {
                            $("#result").html("Address Not Found!");
                        }
                        response.features.forEach(function (loc) {
                            if (loc.place_name_en.indexOf(" Victoria") != -1) {
                                var option = document.createElement("li");
                                var link = document.createElement("a");
                                if (typeof (loc.address) == "undefined") {
                                    loc.address = "";
                                } else {
                                    loc.address = loc.address + " ";
                                }
                                var addr_line =
                                    loc.address +
                                    loc.text_en +
                                    ", " +
                                    loc.context[1].text_en +
                                    ", VIC, " +
                                    loc.context[0].text_en;
                                link.innerHTML = addr_line;
                                link.id = loc.center[0] + "," + loc.center[1];
                                link.href = "#";
                                link.addEventListener("click", function (e) {
                                    input.val(this.innerHTML);
                                    if (input.attr("id") == "startInput") {
                                        start.val(this.id);
                                        var marker = new mapboxgl.Marker();
                                        marker.setLngLat(loc.center);
                                        current_marker.push(marker)
                                        //start.change();
                                    } else if (input.attr("id") == "endInput") {
                                        end.val(this.id);
                                        var marker = new mapboxgl.Marker({
                                            color: "#ed1581",
                                        });
                                        marker.setLngLat(loc.center);
                                        current_marker.push(marker)
                                        //end.change();
                                    }
                                    return false;
                                });
                                option.appendChild(link);

                                selectlist.appendChild(option);
                            }
                        });
                        if (selectlist.childElementCount == 0) {

                            $('.result-list').html("Address Not Found!");
                        }
                        if (input.attr("id") == "endInput") {
                            $("#search-bar2").fadeIn(500);
                        }
                        else {
                            $("#search-bar1").fadeIn(500);
                        }
                    } else {
                        $('.result-list').html("Search Failed!");
                        if (input.attr("id") == "endInput") {
                            $("#search-bar2").fadeIn(500);
                        }
                        else {
                            $("#search-bar1").fadeIn(500);
                        }

                    }
                };
            }, 500);
        } else {
            $(".search-bar-results").fadeOut(500);
        }
    });

    var route = null;
    var first_result = {
        type: "Feature",
        properties: {},
        geometry: null,
    };
    var boundary = null;
    //var polygon = null;
    //var bbox = null;
    var start_iter = 0;
    var draw_route = function (waypoint, direction_api) {
        if (direction_api == "") {
            direction_api =
                "https://api.mapbox.com/directions/v5/mapbox/driving/" +
                waypoint +
                "?geometries=geojson&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
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
                if (!fit) {
                    var fitBox = turf.bbox(turf.transformScale(polygon, 1.1));
                    map.fitBounds(new mapboxgl.LngLatBounds(
                        [fitBox[0], fitBox[1]],
                        [fitBox[2], fitBox[3]]
                    ), {
                        padding: 20
                    });

                    fit = true;
                    first_result.geometry = route.routes[0].geometry
                }
                
                start_iter = 1;
                //}
                var route_line = {
                    type: "Feature",
                    properties: {},
                    geometry: route.routes[0].geometry,
                };

                map.getSource("theRoute").setData(route_line);
                map.getSource("theBox").setData(polygon);

                if (!turf.booleanDisjoint(spots, route_line)) {
                    if (count != 70) {
                        count = count + 1;
                        polygon = turf.transformScale(polygon, count * 0.01);
                        bbox = turf.bbox(polygon);
                        const randomWaypoint = turf.randomPoint(1, { bbox: bbox });
                        if (waypoint.split(";").length == 2) {
                            waypoint =
                                waypoint.split(";")[0] +
                                ";" +
                                randomWaypoint["features"][0].geometry.coordinates[0] +
                                "," +
                                randomWaypoint["features"][0].geometry.coordinates[1] +
                                ";" +
                                waypoint.split(";")[1];
                        } else {
                            waypoint =
                                waypoint.split(";")[0] +
                                ";" +
                                randomWaypoint["features"][0].geometry.coordinates[0] +
                                "," +
                                randomWaypoint["features"][0].geometry.coordinates[1] +
                                ";" +
                                waypoint.split(";")[2];
                        }

                        direction_api =
                            "https://api.mapbox.com/directions/v5/mapbox/driving/" +
                            waypoint +
                            "?radiuses=unlimited;;unlimited&waypoints=0;2&geometries=geojson&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
                        draw_route(waypoint, direction_api);
                    } else {
                        map.getSource("theBox").setData({
                            type: "Feature",
                        });
                        $("#prompt").text("Sorry, details is not availible for this route. ");
                        map.getSource("theRoute").setData(first_result);
                        map.setPaintProperty("theRoute", "line-color", "#236bb8");
                        // show notfication
                        showRedToast();
                        fit = false;
                        $("#live-chat header").unbind("click")
                        $("#live-chat header").on("click", function (e) {
                            e.preventDefault()
                        });
                    }
                } else {
                    map.getSource("theBox").setData({
                        type: "Feature",
                    });
                    if (count != 0) {
                        map.getSource("theRouteDefault").setData(first_result);

                    }



                    map.setPaintProperty("theRoute", "line-color", "#74c476");

                    // show notfication

                    var intersect_blackspot = []
                    var obstacle = {
                        type: "FeatureCollection",
                        properties: {},
                        features: index.getClusters(bbox, 14).filter(
                            (feature) => feature.properties.point_count >= 10 && feature.properties.point_count < 30
                        ),
                    };
                    var mid_risk_spots = turf.buffer(obstacle, 0.05, { units: "kilometers" });
                    mid_risk_spots.features.forEach(function (s) {
                        if (turf.booleanIntersects(route_line, s)) {
                            intersect_blackspot.push(s.properties.cluster_id)


                        };

                    });
                    if (intersect_blackspot.length > 0) {
                        $("#counter").text(intersect_blackspot.length)
                        showGreenToastWithSpot(count + 1);
                        $("#prompt").text("Check details about the mid-risk blackspot here:");
                        intersect_blackspot.sort(function (a, b) {
                            var starting_point = turf.point(eval("[" + start.val() + "]"))
                            var pointA = index.getClusters(bbox, 14).filter(
                                (feature) => feature.id == a
                            )[0];
                            var pointB = index.getClusters(bbox, 14).filter(
                                (feature) => feature.id == b
                            )[0];
                            return turf.distance(starting_point, pointA, { units: 'miles' }) - turf.distance(starting_point, pointB, { units: 'miles' })
                        })
                        intersect_blackspot.forEach(function (id) {
                            var point = index.getClusters(bbox, 14).filter(
                                (feature) => feature.id == id
                            )[0];
                            var leaves = index.getLeaves(id, limit = 100, offset = 0);
                            const node_types = leaves.map(point => point.properties.NODE_TYPE);
                            const unique_node_types = Array.from(new Set(node_types));
                            var counting = new Array()
                            unique_node_types.forEach(function (type) {
                                counting[type] = 0
                            });
                            node_types.forEach(function (type) {
                                counting[type] = counting[type] + 1
                            })
                            var max = unique_node_types[0]
                            var max_count = 0
                            unique_node_types.forEach(function (type) {
                                if (counting[type] > max_count) {
                                    max = type
                                }
                                
                            });
                            $("#listing").append('<div class="chat-message clearfix" id="' + id + '">\
                        <div class="chat-message-content clearfix">\
                        <h4>No. '+ (intersect_blackspot.indexOf(id) + 1) + '</h4>\
                        <h4>Coordinate: '+ point.geometry.coordinates[0].toFixed(6) + ',' + point.geometry.coordinates[1].toFixed(6) + '</h4>\
                        <h4>Node type: '+ max + '</h4>\
                        </div >\
                    </div ><hr />')
                            $("#" + id).on("click", function () {

                                var point = index.getClusters(bbox, 14).filter(
                                    (feature) => feature.id == id
                                )[0];
                                map.flyTo({
                                    center: [
                                        point.geometry.coordinates[0],
                                        point.geometry.coordinates[1]
                                    ],
                                    zoom: 14,
                                    essential: true
                                });
                                map.setPaintProperty('clearances', 'fill-opacity', [
                                    'case',
                                    ["==", ['get', 'cluster_id'], id],
                                    1,
                                    0.3
                                ]);
                            })
                        })
                        $(".chat-message-counter").fadeToggle(300, "swing");
                        $("#live-chat header").unbind("click")
                        $("#live-chat header").on("click", function () {
                            map.fitBounds(new mapboxgl.LngLatBounds(
                                [bbox[0], bbox[1]],
                                [bbox[2], bbox[3]]
                            ), {
                                padding: 20
                            });
                            map.setPaintProperty('clearances', 'fill-opacity', 0.8);
                            $(".chat").slideToggle(300, "swing");
                            $(".chat-message-counter").fadeToggle(300, "swing");
                        });
                    }
                    else {
                        showGreenToastWithoutSpot(count + 1);
                        $("#prompt").text("No blackspot on the route");
                    }


                    fit = false;
                }
            }
        };
    };
    $(".addr").on("focus", function () {
        $('#errormsg').text('')
    })

    $('#submitBtn').on("click", function () {
        var a = start.val();
        var b = end.val();
        if (start.val() != "" && end.val() != "") {
            start.change()
        }
        else {
            $('#errormsg').text('You have to choose locations from the searching result list.')
        }
    })
    $(".locs").on("change", function () {
        var a = start.val();
        var b = end.val();
        var waypoint = a + ";" + b;
        console.log("a : " + a);
        console.log("b : " + b);
        console.log("waypoint : " + waypoint);
        if (start.val() != "" && end.val() != "") {
            current_marker.forEach(function (m) {
                m.addTo(map);
            })
            draw_route(waypoint, "");

            count = 0;
            // Hides the blur overlay.
            $(".wui-overlay").removeClass("visible").addClass("hidden");
            introJs().hideHints();
        }
    });
    var address_query = function (keyword) { };
    

    // Add Tour Guide Click Listener For help button
    //document.getElementById("help-tooltip-toggle").addEventListener(
    //    "click",
    //    function () {
    //        //  showTourGuide();
    //    },
    //    false
    //);

    document.getElementById("searchForm").addEventListener(
        "submit",
        function (e) {
            e.preventDefault();
        },
        false
    );



    $(".chat").hide();



    if (newVisitOrNot === true) {
        // showTourGuide();
    }
    // Intro.js scans the webpage and finds all elements with `data-hint` attribute
    introJs().addHints();
});