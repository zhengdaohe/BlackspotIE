$(".wui-side-menu-item").attr("disabled", true).css("pointer-events", "none");
(function (window, undefined) {
    'use strict';

})(window);



var documentReady = function (fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);


    }
};


function showTourGuide() {
    introJs().setOptions({
        tooltipClass: 'myCustomIntroJSTooltip',
        overlayOpacity: 0.1,
        disableInteraction: true,
        highlightClass: 'myCustomIntroJSHighlight',
        skipLabel: "skip",
        showStepNumbers: true,
        steps: [{
            intro: 'We will guide you on how to use our map tool. Lets get started shall we?'
        },
        {
            element: document.querySelector('.search-bar-header'),
            intro: 'Want to check out black spots in a suburb? Enter a Victoria postcode here to highlight an area.'
        },
        {
            element: document.querySelector('.con-tooltip'),
            intro: 'To see this guide again, click here!'
        },
        {
            element: document.querySelector('#legend'),
            intro: 'Black spots shown on the map are categorized with 3 risk levels. Here is a map legend for you.'
        },
        {
            intro: '<div class="content" style="width: 250px;display: block;"> <p class="text1">Each number shown on the map is a total of road accidents happened on a same spot between 2014 - 2019.</p> <div class="ndline" style="display:flex;"> <div class="bs" style="display:flex;justify-content: center;align-items: center;padding-left: 5px;"> <div class="dot" style="position: absolute;height: 25px;width: 25px;background-color: #e2aa50;justify-content: center;border-radius: 50%;display: flex;filter: blur(2px);border-radius: 50%;"></div> <span class="text" style="filter: blur(0);z-index:1;">10</span> </div> <span class="text2" style="margin-left: 20px;">For example, this means ten car accidents happened at the same area.</span> </div> </div>'
        },
        {
            element: document.querySelector('.wui-side-menu-items'),
            position: 'bottom',
            intro: 'Is the map too crowded? Map filtering options are hidden here.'
        },
        {
            title: 'Farewell!',
            intro: "That's all! Stay safe and always drive safe."
        },
        ]
    }).onbeforeexit(function () {
        localStorage.setItem('ifNewVisit', false);
    }).start();
}

documentReady(function () {
    // store tooltip showup
    var newVisitOrNot = localStorage.getItem('ifNewVisit');

    // Set to true to show the tooltips, but will save it as false for the next time.
    if (newVisitOrNot === null) {
        newVisitOrNot = true;
    }

    //   Load map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        maxZoom: 14,
        minZoom: 14,
        center: [144.946457, -37.840935]
    });

    // $("a.wui-side-menu-item").click(changeClass);

    $(function () {
        //On li click where li has .something class
        $('.wui-side-menu-items li #filter-btn').on("click", function () {
            var patt = $(this).children('#select').text();
            console.log("Pressed name: " + patt);
            console.log("add val: " + $('#sidefilter').val());
            console.log("index : " + $('#sidefilter').val().indexOf(patt));

            if ($('#sidefilter').val().indexOf(patt) == -1) {
                $('#sidefilter').val($('#sidefilter').val() + patt + "!");
            }
            else {
                $('#sidefilter').val($('#sidefilter').val().replace(patt + "!", ""));
            }


            // group the daytime nighttime checkbox with html name. This will allow checkboxes to react like radio boxes effect.

            $(this).toggleClass("wui-side-menu-item wui-side-menu-item active").promise().done(function () {
                if ($(this).hasClass("active")) {
                    $(this).children('.checkbox').prop('checked', true);
                    if (patt == 'Nighttime' && $('.day').parent().hasClass("active")) {
                        $('.day').parent().click()
                    }
                    if (patt == 'Daytime' && $('.night').parent().hasClass("active")) {
                        $('.night').parent().click()
                    }
                }
                else {
                    $(this).children('.checkbox').prop('checked', false);
                }
                // $(this).prop("checked",true);
            });


            $('#sidefilter').change();
        })


        $('.wui-risk-menu-items li #risk-toggle-btn').on("click", function () {

            var patt = $(this).children(".iphToggle").children("#select").text();

            console.log(patt)
            if ($('#riskfilter').val().indexOf(patt) == -1) {
                $('#riskfilter').val($('#riskfilter').val() + patt + "!");
            }
            else {
                $('#riskfilter').val($('#riskfilter').val().replace(patt + "!", ""));
            }
            // Example to get this on click element
            // alert($(this).children("#risk-toggle-btn").children(".iphToggle").text());

            // This is the filter option highlight effect, by switching its own css class.
            /*******
             * 
             * 
             * Do risk filter here..
             * 
             */

            // This case i can listen to click based on the text written.
            var selectedRiskTxt = $(this).children(".iphToggle").text();
            selectedRiskTxt = selectedRiskTxt.replace(/\s+/g, '');
            // console.log(selectedRisk.replace(/\s+/g, ''));
            if (selectedRiskTxt === "Lowrisks") {
                $(this).toggleClass("wui-side-menu-item wui-side-menu-item active");

                // Get those objects
                var slider = $('#risk3 .switch .slider');
                var checkBx = $('#risk3 .switch #checkbox');

                // Change colours when  clicking. The colour must match with the attached class in html side.
                slider.toggleClass('riskDarkGreen toggleOff');
                // Change FONT colour
                $(this).toggleClass('riskGreenFont toggleOffFont');
                // set checked/unchecked
                checkBx.prop("checked", !checkBx.prop("checked"));
            }
            else if (selectedRiskTxt === "Midrisks") {
                $(this).toggleClass("wui-side-menu-item wui-side-menu-item active");

                // Get those objects
                var slider = $('#risk2 .switch .slider');
                var checkBx = $('#risk2 .switch #checkbox');
                // Change colours when  clicking. The colour must match with the attached class in html side.
                slider.toggleClass('riskOrange toggleOff');
                // Change FONT colour
                $(this).toggleClass('riskOrangeFont toggleOffFont');
                // set checked/unchecked
                checkBx.prop("checked", !checkBx.prop("checked"));
            }
            else if (selectedRiskTxt === "Highrisks") {
                $(this).toggleClass("wui-side-menu-item wui-side-menu-item active");
                // $('#risk1').children('.switch').children('#checkbox');
                // Get those objects
                var slider = $('#risk1 .switch .slider');
                var checkBx = $('#risk1 .switch #checkbox');
                // Change colours when  clicking. The colour must match with the attached class in html side.
                slider.toggleClass('riskRed toggleOff');
                // Change FONT colour
                $(this).toggleClass('riskRedFont toggleOffFont');
                // set checked/unchecked
                checkBx.prop("checked", !checkBx.prop("checked"));
            }
            $('#riskfilter').change();
        })

        // Stopping user from refreshing page by hitting "ENTER" key on search bar.
        // document.getElementById('searchForm').addEventListener('submit', function(e) {
        //     // search(document.getElementById('searchText'));
        //     e.preventDefault();
        // }, false);

        // Add Tour Guide Click Listener For help button
        document.getElementById('help-tooltip-toggle').addEventListener('click', function () {
            showTourGuide();
        }, false);

    });
    document.getElementById('searchForm').addEventListener('submit', function (e) {
        // search(document.getElementById('searchText'));
        e.preventDefault();
    }, false);

    var cluster_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    var timeOut = null;
    var searchTimeout = null;
    var origin = {
        type: "FeatureCollection",
        name: "Road_Crashes_for_five_Years_-_Victoria",
        features: []
    };
    var json = null;
    var newGeoJSON = {
        type: "FeatureCollection",
        name: "Road_Crashes_for_five_Years_-_Victoria",
        features: []
    };
    map.on('load', () => {
        spiderifier = new MapboxglSpiderifier(map, {
            customPin: true,
            animate: true,
            animationSpeed: 30,
            initializeLeg: initializePopup
        });
        var isSpiderPopupShown = false;
        function initializePopup(spiderLeg) {
            cluster_popup.remove();
            var pinElem = spiderLeg.elements.pin;
            var feature = spiderLeg.feature;
            pinElem.className = pinElem.className + ' fa-stack fa-lg';
            pinElem.innerHTML = '<i class="circle-icon fa fa-circle fa-stack-2x"></i>' +
                '<i class="type-icon fa fa-' + feature.ACCIDENT_NO + ' fa-stack-1x"></i>' +  
                '<i class="type-icon fa fa-' + feature.ACCIDENT_TYPE + ' fa-stack-1x"></i>' +
                '<i class="type-icon fa fa-' + feature.NODE_TYPE + ' fa-stack-1x"></i>';
            pinElem.style.color = "transparent";
            var spi_popup;
            $(pinElem)
                .on('mouseenter', function () {
                    spi_popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        offset: MapboxglSpiderifier.popupOffsetForSpiderLeg(spiderLeg)
                    });
                    spi_popup.setHTML('Accident No. <b>:' + feature.ACCIDENT_NO + '</b><br />' + 
                        'Node Type. <b>:' + feature.NODE_TYPE + '</b><br />' + 
                        'Accident Type. <b>:' + feature.ACCIDENT_TYPE + '</b>')
                        .addTo(map)
                    cluster_popup.remove();
                    spiderLeg.mapboxMarker.setPopup(spi_popup);
                    isSpiderPopupShown = true;
                })
                .on('mouseleave', function () {
                    if (spi_popup) {
                        spi_popup.remove();
                        isSpiderPopupShown = false;
                    }
                });
        }
        map.addSource('crash', {
            type: 'geojson',
            data: null,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 27.3
        });
        SPIDERFY_FROM_ZOOM = 13;
        var url = "https://crash.b-cdn.net/Edited_Postcode_suburb.json";
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);

        request.onload = function () {
            if (request.status == 200) {
                json = JSON.parse(request.responseText);

                $(".wui-side-menu-item").attr("disabled", false).css("pointer-events", "auto");
                //newGeoJSON = {
                //    type: "FeatureCollection",
                //    name: "Road_Crashes_for_five_Years_-_Victoria",
                //    features: []
                //};ee
                newGeoJSON.features = json.features;
                origin.features = json.features;
                //    .filter(feature => feature.properties.ROAD_GEOMETRY === "Cross intersection");
                map.getSource('crash').setData(json);
                $('#prompt').html('Highlight a suburb: ');
                document.getElementById('searchText').style = 'display: normal;';
                $('#sidefilter').on("change", function () {
                    $(".wui-side-menu-item").attr("disabled", true).css("pointer-events", "none");
                    $('#prompt').html('Filtering');
                    document.getElementById('searchText').style = 'display: none;';
                    if ($(this).val().length == 0) {
                        map.getSource('crash').setData(json);
                    }
                    else {
                        newGeoJSON.features = json.features;
                        var selectors = $(this).val().trim("!").split("!");
                        if (selectors.indexOf("Young drivers") > -1) {
                            newGeoJSON.features = newGeoJSON.features.filter(feature => feature.properties.YOUNG_DRIVER === 1);
                        }
                        if (selectors.indexOf("Daytime") > -1) {
                            newGeoJSON.features = newGeoJSON.features.filter(feature => feature.properties.LIGHT_CONDITION === "Day");
                        }
                        if (selectors.indexOf("Nighttime") > -1) {
                            newGeoJSON.features = newGeoJSON.features.filter(feature => feature.properties.LIGHT_CONDITION.indexOf('Dark') > -1);
                        }
                        if (selectors.indexOf("Intersections") > -1) {
                            newGeoJSON.features = newGeoJSON.features.filter(feature => feature.properties.ROAD_GEOMETRY.indexOf('T intersection') > -1 || feature.properties.ROAD_GEOMETRY.indexOf('Cross intersection') > -1);
                        }
                        map.getSource('crash').setData(newGeoJSON);

                    }
                    $(".wui-side-menu-item").attr("disabled", false).css("pointer-events", "auto");
                    $('#prompt').html('Highlight a suburb: ');
                    document.getElementById('searchText').style = 'display: normal;';
                });

            }
        };
        //const pubTypes = geojson.features.map(feature => feature.properties.PubType);
        //const uniquePubTypes = Array.from(new Set(pubTypes));
        //const filterElem = document.getElementById('pubTypeFilter');
        //uniquePubTypes.forEach(pubType => {
        //    const opt = document.createElement('option');
        //    opt.value = pubType;
        //    opt.innerText = pubType;
        //    filterElem.appendChild(opt);
        //});

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'crash',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#45d649',
                    10,
                    '#ed9b18',
                    30,
                    '#ff0000'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    10,
                    10,
                    11,
                    30,
                    12
                ],
                'circle-opacity': 0.8,
            }
        });

        //map.addLayer({
        //    id: 'cluster-count',
        //    type: 'symbol',
        //    source: 'crash',
        //    filter: ['has', 'point_count'],
        //    layout: {
        //        'text-field': '{point_count_abbreviated}',
        //        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        //        'text-size': 12
        //    }
        //});
        $('#riskfilter').on("change", function () {
            $(".wui-side-menu-item").attr("disabled", true).css("pointer-events", "none");
            $('#prompt').html('Filtering');
            document.getElementById('searchText').style = 'display: none;';
            if ($(this).val().length == 0) {
                map.setFilter("clusters", ['has', 'point_count']);
                //map.setFilter("cluster-count", ['has', 'point_count']);
            }
            else {
                var selectors = $(this).val().trim("!").split("!");
                var filter = ["any"];
                if (selectors.indexOf("High risks") > -1) {
                    filter.push([">=", ['get', 'point_count'], 30]);
                }
                if (selectors.indexOf("Mid risks") > -1) {
                    filter.push(["all", ["<", ['get', 'point_count'], 30], [">=", ['get', 'point_count'], 10]]);
                }
                if (selectors.indexOf("Low risks") > -1) {
                    filter.push(["<", ['get', 'point_count'], 10]);
                }

                map.setFilter("clusters", filter);
                //map.setFilter("cluster-count", filter);

            }
            $(".wui-side-menu-item").attr("disabled", false).css("pointer-events", "auto");
            $('#prompt').html('Highlight a suburb: ');
            document.getElementById('searchText').style = 'display: normal;';
        });

        map.on('zoomstart', function () {
            spiderifier.unspiderfy();
        });
        map.on('click', (e) => {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            spiderifier.unspiderfy();
            if (!features.length) {
                return;
            } else if (map.getZoom() < SPIDERFY_FROM_ZOOM) {
                map.easeTo({ center: e.lngLat, zoom: map.getZoom() + 2 });
            } else {
                cluster_popup.remove();
                map.getSource('crash').getClusterLeaves(
                    features[0].properties.cluster_id,
                    300,
                    0,
                    function (error, leafFeatures) {
                        if (error) {
                            return console.error('cluster error', error);
                        }
                        var markers = _.map(leafFeatures, function (leafFeature) {
                            return leafFeature.properties;
                        });
                        spiderifier.spiderfy(features[0].geometry.coordinates, markers);
                    }
                );
            }
        });

        map.on('mouseenter', 'clusters', (e) => {
            map.getCanvas().style.cursor = 'pointer';

            if (!isSpiderPopupShown) {
                clearTimeout(timeOut);
                const coordinates = e.features[0].geometry.coordinates.slice();

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                cluster_popup.setLngLat(coordinates).setHTML('<div class="loader"></div>').addTo(map);

                timeOut = setTimeout(function () {
                    map.getSource('crash').getClusterLeaves(
                        e.features[0].properties.cluster_id,
                        100,
                        0,
                        function (error, leafFeatures) {
                            if (error) {
                                return console.error('POPUP ERROR', error);
                            }
                            var Html = "";
                            var total_fatal = 0;
                            var last_accident_date = "1999-01-01";
                            var total_injur_fatal = 0;
                            var average_injur_fatal = 0;
                            var mostcommon_accident_type = "";
                            var blackspot_severity = "";
                            var mostcommon_light_condition = "";

                            const accident_types = leafFeatures.map(feature => feature.properties.ACCIDENT_TYPE);
                            const unique_accident_types = Array.from(new Set(accident_types));
                            var accident_type_count = new Array();
                            unique_accident_types.forEach(accident_type => {
                                accident_type_count[accident_type] = 0;
                            });
                            const light_conditions = leafFeatures.map(feature => feature.properties.LIGHT_CONDITION);
                            const unique_light_condition = Array.from(new Set(light_conditions));
                            var light_condition_count = new Array();
                            unique_light_condition.forEach(light_condition => {
                                light_condition_count[light_condition] = 0;
                            });
                            leafFeatures.forEach(leafFeature => {

                                if (last_accident_date < leafFeature.properties.ACCIDENT_DATE) {
                                    last_accident_date = leafFeature.properties.ACCIDENT_DATE;
                                }
                                total_injur_fatal = total_injur_fatal + leafFeature.properties.INJ_OR_FATAL;
                                accident_type_count[leafFeature.properties.ACCIDENT_TYPE] += 1;
                                light_condition_count[leafFeature.properties.LIGHT_CONDITION] += 1;
                            });
                            average_injur_fatal = total_injur_fatal / leafFeatures.length;
                            mostcommon_accident_type = unique_accident_types[0];
                            mostcommon_light_condition = unique_light_condition[0];
                            for (var keyA in accident_type_count) {
                                if (accident_type_count[keyA] > accident_type_count[mostcommon_accident_type]) {
                                    mostcommon_accident_type = keyA;
                                }
                            }
                            for (var keyL in light_condition_count) {
                                if (light_condition_count[keyL] > light_condition_count[mostcommon_light_condition]) {
                                    mostcommon_light_condition = keyL;
                                }
                            }
                            if (leafFeatures.length < 10) {
                                blackspot_severity = '<p style="color: green"><strong>blackspot risk: </strong>Low risk</p>';
                            }
                            else if (leafFeatures.length >= 30) {
                                blackspot_severity = '<p style="color: red"><strong>blackspot risk: </strong>High risk</p>';
                            }
                            else {
                                blackspot_severity = '<p style="color: #ed9b18"><strong>blackspot risk: </strong>Medium risk</p>';
                            }
                            Html = blackspot_severity +
                                "<p><strong>Last accident happened in: </strong>" + last_accident_date + "</p>" +
                                "<p><strong>Total Injury&Fatality: </strong>" + total_injur_fatal + "</p>" +
                                "<p><strong>Average Injury&Fatality: </strong>" + Math.round(average_injur_fatal) + "</p>" +
                                "<p><strong>Most accident: </strong>" + mostcommon_accident_type + "</p>" +
                                "<p><strong>Most light condition: </strong>" + mostcommon_light_condition + "</p>";
                            cluster_popup.setHTML(Html);
                        }
                    );
                }, 750);



            }

        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
            cluster_popup.remove();
            clearTimeout(timeOut);
        });
        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });
        map.addSource('poly', {
            'type': 'geojson',
            'data': null
        });
        map.addLayer({
            'id': 'poly',
            'type': 'fill',
            'source': 'poly',
            'layout': {},
            'paint': {
                'fill-color': '#0080ff',
                'fill-opacity': 0.1
            }
        });
        map.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'poly',
            'layout': {},
            'paint': {
                'line-color': '#000',
                'line-width': 1
            }
        });
        $(function () {
            var postCodeQuery = $.connection.postCodeQuery;
            postCodeQuery.client.displayResult = function (postcode, locationArray, isFound) {
                document.getElementById('searchText').removeAttribute("disabled");
                document.getElementById('searchText').removeAttribute("readonly");
                if (isFound == "true") {
                    document.getElementById('postcode').value = postcode
                    var selectlist = document.getElementById('result');
                    selectlist.innerHTML = "";
                    var locs = eval(locationArray);
                    locs.forEach(function (loc) {
                        var option = document.createElement("li");
                        var link = document.createElement("a");
                        link.innerHTML = loc;
                        link.href = "#";
                        link.addEventListener("click", function (e) {
                            map.getSource('poly').setData(null);
                            $('#prompt').text("Loading......");
                            console.log(e.target.innerHTML);
                            document.getElementById('loc').value = e.target.innerHTML;
                            postCodeQuery.server.getpoly($('#postcode').val(), $(this).text());

                        })
                        option.appendChild(link);

                        selectlist.appendChild(option);
                    });


                }
                if (isFound == "false") {
                    $('#result').html('Postcode Not Found!');

                }
            };
            postCodeQuery.client.displaypolygon = function (geometry, center, suburb) {
                json.features = origin.features.filter(feature => feature.properties.suburb === suburb);
                map.getSource('crash').setData(json);
                $('#sidefilter').change();
                var poly = JSON.parse(geometry);
                map.getSource('poly').setData(null);
                map.getSource('poly').setData(poly);
                map.setCenter(eval(center));
                $('#prompt').text(document.getElementById('loc').value);
                map.flyTo({
                    center: eval(center), zoom: 14, speed: 0.25,
                    curve: 2,
                    easing(t) {
                        return t;
                    }
                });
            };
            postCodeQuery.client.display = function (message) {
                $('#result').html(message);
            };
            postCodeQuery.client.displayprompt = function (message) {
                $('#prompt').html(message);
            };
            $.connection.hub.start().done(function () {
                $("#searchText").on("focus", function () {
                    $('#prompt').html('Highlight a suburb: ');
                    if ($(this).val()) {
                        $('.search-bar-results').fadeIn(500);
                    }
                }).on("click", function (event) { event.stopPropagation(); });
                $(document).click(function () { $('.search-bar-results').fadeOut(500); });

                $('#searchText').on('input', function () {
                    clearTimeout(searchTimeout);
                    $('.search-bar-results').fadeOut(500);
                    var patt = /^[\d]*$/;
                    if (patt.test($('#searchText').val())) {
                        if (!$(this).val()) {
                            $('.search-bar-results').fadeOut(500);
                        }
                        else if ($('#searchText').val().length != 4) {
                            searchTimeout = setTimeout(function () {
                                $('.search-bar-results').fadeIn(500);
                                $('#result').html('Not a valid VIC postcode');
                            }, 750);
                        }
                        else {
                            searchTimeout = setTimeout(function () {
                                $('.search-bar-results').fadeIn(500);
                                $('#searchText').attr("readonly", "readonly");
                                var postcode = $('#searchText').val();
                                postCodeQuery.server.send(postcode);
                            }, 750);
                        }
                    }
                    else {
                        $(this).val($(this).val().replace(/[^\d]/g, ""));
                        if ($(this).val().length == 0) {
                            $('.search-bar-results').fadeOut(500);
                        }
                        else {
                            searchTimeout = setTimeout(function () {

                                $('.search-bar-results').fadeIn(500);
                                $('#result').html('<li>Not a valid VIC postcode</li>');
                            }, 750);
                        }

                    }


                }
                );
            });

        });
    });

    if (newVisitOrNot === true) {
        showTourGuide();
    }
});