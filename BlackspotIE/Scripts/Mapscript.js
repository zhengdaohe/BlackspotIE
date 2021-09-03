(function (window, undefined) {
    'use strict';

    // responsive pinnable sidemenu component
    var sideMenu = function (el) {
        var htmlSideMenu = el, htmlSideMenuPinTrigger = {}, htmlSideMenuPinTriggerImage = {}, htmlOverlay = {};
        var init = function () {
            htmlSideMenuPinTrigger = el.querySelector('.wui-side-menu-pin-trigger');
            htmlSideMenuPinTriggerImage = htmlSideMenuPinTrigger.querySelector('i.fa');
            htmlOverlay = document.querySelector('.wui-overlay');
            Array.prototype.forEach.call(document.querySelectorAll('.wui-side-menu-trigger'), function (elmt, i) {
                elmt.addEventListener('click', function (e) {
                    e.preventDefault();
                    toggleMenuState();
                }, false);

            });
            htmlSideMenuPinTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                toggleMenuPinState();
            }, false);
            htmlOverlay.addEventListener("click", function (e) {
                htmlSideMenu.classList.remove('open');
            }, false);
            window.addEventListener("resize", checkIfNeedToCloseMenu, false);
            checkIfNeedToCloseMenu();
        };
        var toggleMenuState = function () {
            htmlSideMenu.classList.toggle('open');
            menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
        };
        var toggleMenuPinState = function () {
            htmlSideMenu.classList.toggle('pinned');
            htmlSideMenuPinTriggerImage.classList.toggle('fa-rotate-90');
            if (htmlSideMenu.classList.contains('pinned') !== true) {
                htmlSideMenu.classList.remove('open');
            }
            menuPinStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('pinned'));
        };
        var checkIfNeedToCloseMenu = function () {
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (width <= 767 && htmlSideMenu.classList.contains('open') === true) {
                htmlSideMenu.classList.remove('open');
                menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
            }
            if (width > 767 && htmlSideMenu.classList.contains('pinned') === false) {
                htmlSideMenu.classList.remove('open');
                menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
            }

        };
        var menuStateChanged = function (element, state) {
            var evt = new CustomEvent('menuStateChanged', { detail: { open: state } });
            element.dispatchEvent(evt);
        };
        var menuPinStateChanged = function (element, state) {
            var evt = new CustomEvent('menuPinStateChanged', { detail: { pinned: state } });
            element.dispatchEvent(evt);
        };
        init();
        return {
            htmlElement: htmlSideMenu,
            toggleMenuState: toggleMenuState,
            toggleMenuPinState: toggleMenuPinState
        };
    };


    window.SideMenu = sideMenu;
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
            element: document.querySelector('#fil-btn-txt'),
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
    var sample = new SideMenu(document.querySelector('.wui-side-menu'))
    // store tooltip showup
    var newVisitOrNot = localStorage.getItem('ifNewVisit');
    console.log(JSON.parse(newVisitOrNot));

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
        $('.wui-side-menu-items li').on("click", function () {

            // Example to get this on click element
            // alert($(this).children("#filter-btn").text());
            /*******
             * 
             * 
             * Do spots filter here..
             * 
             */
            // This is the filter option highlight effect, by switching its own css class.
            $(this).children("#filter-btn").toggleClass("wui-side-menu-item wui-side-menu-item active");

        })


        $('.wui-risk-menu-items li').on("click", function () {

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
            var selectedRiskTxt = $(this).children("#risk-toggle-btn").children(".iphToggle").text();
            selectedRiskTxt = selectedRiskTxt.replace(/\s+/g, '');
            // console.log(selectedRisk.replace(/\s+/g, ''));
            if (selectedRiskTxt === "Lowrisks") {
                $(this).children("#risk-toggle-btn").toggleClass("wui-side-menu-item wui-side-menu-item active");

                // Get those objects
                var slider = $('#risk3 .switch .slider');
                var checkBx = $('#risk3 .switch #checkbox');

                // Change colours when  clicking. The colour must match with the attached class in html side.
                slider.toggleClass('riskDarkGreen toggleOff');
                // Change FONT colour
                $(this).children("#risk-toggle-btn").toggleClass('riskGreenFont toggleOffFont');
                // set checked/unchecked
                checkBx.prop("checked", !checkBx.prop("checked"));
            }
            else if (selectedRiskTxt === "Midrisks") {
                $(this).children("#risk-toggle-btn").toggleClass("wui-side-menu-item wui-side-menu-item active");

                // Get those objects
                var slider = $('#risk2 .switch .slider');
                var checkBx = $('#risk2 .switch #checkbox');
                // Change colours when  clicking. The colour must match with the attached class in html side.
                slider.toggleClass('riskOrange toggleOff');
                // Change FONT colour
                $(this).children("#risk-toggle-btn").toggleClass('riskOrangeFont toggleOffFont');
                // set checked/unchecked
                checkBx.prop("checked", !checkBx.prop("checked"));
            }
            else if (selectedRiskTxt === "Highrisks") {
                $(this).children("#risk-toggle-btn").toggleClass("wui-side-menu-item wui-side-menu-item active");
                // $('#risk1').children('.switch').children('#checkbox');
                // Get those objects
                var slider = $('#risk1 .switch .slider');
                var checkBx = $('#risk1 .switch #checkbox');
                // Change colours when  clicking. The colour must match with the attached class in html side.
                slider.toggleClass('riskRed toggleOff');
                // Change FONT colour
                $(this).children("#risk-toggle-btn").toggleClass('riskRedFont toggleOffFont');
                // set checked/unchecked
                checkBx.prop("checked", !checkBx.prop("checked"));
            }
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
    var isSelect = false;
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
                '<i class="type-icon fa fa-' + feature.ACCIDENT_NO + ' fa-stack-1x"></i>';
            pinElem.style.color = "transparent";
            var spi_popup;
            $(pinElem)
                .on('mouseenter', function () {
                    spi_popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        offset: MapboxglSpiderifier.popupOffsetForSpiderLeg(spiderLeg)
                    });
                    spi_popup.setHTML('Accident No. <b>:' + feature.ACCIDENT_NO + '</b>')
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
        var url = "https://opendata.arcgis.com/datasets/74dd92127eea4404b0dad1d7e39bf0e3_1.geojson";
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);
        var newGeoJSON = null;
        request.onload = function () {
            if (request.status == 200) {
                var json = JSON.parse(request.responseText);
                console.log("Crash data loaded");
                //newGeoJSON = {
                //    type: "FeatureCollection",
                //    name: "Road_Crashes_for_five_Years_-_Victoria",
                //    features: []
                //};ee
                //newGeoJSON.features = json.features.filter(feature => feature.properties.ROAD_GEOMETRY === "Cross intersection");
                map.getSource('crash').setData(json);
                $('#prompt').html('Highlight a suburb: ');
                document.getElementById('searchText').style = 'display: normal;';

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
                    20,
                    10,
                    30,
                    30,
                    40
                ],
                'circle-blur': [
                    'step',
                    ['get', 'point_count'],
                    0.5,
                    10,
                    0.5,
                    30,
                    0.5
                ],
                'circle-opacity': [
                    'step',
                    ['get', 'point_count'],
                    0.5,
                    10,
                    0.7,
                    30,
                    0.9
                ],
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'crash',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
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
                                total_fatal = total_fatal + leafFeature.properties.FATALITY;
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
                'fill-opacity': 0.3
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
            postCodeQuery.client.displaypolygon = function (geometry, center) {
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
                        $('.search-bar-results').show();
                    }
                }).on("click", function (event) { event.stopPropagation(); });
                $(document).click(function () { $('.search-bar-results').hide();});

                $('#searchText').on('input', function () {
                    clearTimeout(searchTimeout);
                    $('.search-bar-results').hide();
                    var patt = /^[\d]*$/;
                    if (patt.test($('#searchText').val())) {
                        if (!$(this).val()) {
                            $('.search-bar-results').hide();
                        }
                        else if ($('#searchText').val().length != 4) {
                            searchTimeout = setTimeout(function () {
                                $('.search-bar-results').show();
                                $('#result').html('<li>Not a valid VIC postcode</li>');
                            }, 750);
                        }
                        else {
                            searchTimeout = setTimeout(function () {
                                $('.search-bar-results').show();
                                $('#searchText').attr("readonly", "readonly");
                                var postcode = $('#searchText').val();
                                postCodeQuery.server.send(postcode);
                            }, 750);
                        }
                    }
                    else {
                        $(this).val($(this).val().replace(/[^\d]/g, ''));
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
