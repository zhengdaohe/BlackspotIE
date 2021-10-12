var isDone = true;
var maxCluster = null;
var rendered = true;
var feature_list = [];
// Header Sticky
function stickyFunction() {
    var header = document.getElementById("site-header");
    var sticky = header.offsetHeight;
    // if (window.pageYOffset > 0) {
    // 	header.classList.add("fixed");
    // } else {
    // 	header.classList.remove("fixed");
    // }
}


function lockScroll() {
    // lock scroll position, but retain settings for later
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];
    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
    $('#fp-nav').hide()
    $.fn.fullpage.setAllowScrolling(false);
}

function unlockScroll() {
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
    $('#fp-nav').show()
    $.fn.fullpage.setAllowScrolling(true);
}

$(document).ready(function () {
    // hide the search dropdown box.
    lockScroll();

    var w_width = $(window).width();


    var origin = null;
    var json = {
        type: "FeatureCollection",
        name: "Road_Crashes_for_five_Years_-_Victoria",
        features: []
    };
    mapboxgl.accessToken = 'pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        maxZoom: 14,
        minZoom: 14,
        center: [144.946457, -37.840935],
        interactive:false
    });

    map.on('load', () => {
        var url = "https://crash.b-cdn.net/Edited_Postcode_suburb1.json";
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);
        request.onload = function () {
            if (request.status == 200) {
                origin = JSON.parse(request.responseText);
                console.log("Crash data loaded");
                $("#section09").html("What is the postcode<br>where you currently live ?");
                $('#loader').fadeOut(500, "linear", function () {
                    $("#section09").fadeIn(500);
                    $('#searchText').fadeIn(500);
                });
            }
        };
        map.addSource('crash', {
            type: 'geojson',
            data: null,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 27.3
        });
       
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'crash',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#ff0000',
                    10,
                    '#ff0000',
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
        map.on('idle', () => {

            if (!isDone) {
                //const features = map.queryRenderedFeatures({
                //    layers: ['clusters']
                //});
                var features = [];
                const features_ = map.querySourceFeatures('crash', {
                    sourceLayer: 'clusters'
                });
                features_.forEach(function (point) {
                    if (typeof (point.id) != "undefined") {
                        features.push(point);
                    };

                })
                if (feature_list.length == 0) {
                    $("#tick").html("You are safe!");
                    $("#road").text("no spot");
                }
                if (feature_list.length < features.length) {
                    console.log("render")
                    feature_list = features;
                    var max = features[0].properties.point_count_abbreviated;
                    var maxCluster_ = features[0];
                    features.forEach(function (cluster) {
                        if (cluster.properties.point_count_abbreviated > max) {
                            maxCluster_ = cluster;
                            max = cluster.properties.point_count_abbreviated;
                        };

                    });
                    if (maxCluster == null || max > maxCluster.properties.point_count_abbreviated) {
                        
                        maxCluster = maxCluster_;
                        map.setCenter([maxCluster.geometry.coordinates[0], maxCluster.geometry.coordinates[1]]);
                        map.setFilter("clusters", ["==", ['get', 'cluster_id'], maxCluster.properties.cluster_id]);
                        map.setFilter("cluster-count", ["==", ['get', 'cluster_id'], maxCluster.properties.cluster_id]);
                        var api = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + maxCluster.geometry.coordinates[0] + "," + maxCluster.geometry.coordinates[1] + ".json?types=address&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
                        var geo_request = new XMLHttpRequest();
                        var response = null;
                        geo_request.open("get", api);
                        geo_request.send(null);
                        geo_request.onload = function () {
                            if (geo_request.status == 200) {
                                response = JSON.parse(geo_request.responseText).features[0].text;
                                $("#tick").html("Take Care!");
                                $("#road").text(response);
                                $('#indicator').text(maxCluster.properties.point_count_abbreviated)
                            }
                            else {
                                geo_request.send(null);
                            }
                        };
                    }

                }
            }
        });

    })

    

    // Stopping user from refreshing page by hitting "ENTER" key on search bar.
    document.getElementById('searchForm').addEventListener('submit', function (e) {
        // search(document.getElementById('searchText'));
        e.preventDefault();
    }, false);

    $('#replay').on('click', function () {
        $('#section10').fadeIn(1500);
        $('.search-bar').fadeOut(300);
        $('.search-bar-results').fadeOut(100);
        $('.leftnav').fadeIn(1500);

        isDone = true;
        rendered = true;
        feature_list = [];
        maxCluster = null;
        $.fn.fullpage.moveTo(1);
        $('.search-bar-results').hide();
        $('.leftnav').hide();
        $('#section10').hide();
        $('.search-bar').show();
        $('#section09').show();
        $('#section09').animate({ 'opacity': 0 }, 500, function () {
            $(this).html("What is the postcode<br>where you currently live?").animate({ 'opacity': 1 }, 500);
            $("input").val('');
            lockScroll();
        });
        $("#canvas-holder").html('<canvas id="chart-area"></canvas>');

    });
    $('#scorebtm').on('click', function (e) {
        e.preventDefault()
        var light = $('#select-light option:selected').val()
        var day = $('#select-day option:selected').val()
        var vehicle = $('#select-vehicle option:selected').val()
        var driver = $('#select-driver option:selected').val()
        var hour = $('#select-hour option:selected').val()
        if (hour.length == 1) {
            hour = '0' + hour
        }
        var link = "https://crash.b-cdn.net/danger_ratings.json";
        var request = new XMLHttpRequest();
        request.open("get", link);
        request.send(null);
        request.onload = function () {
            if (request.status == 200) {
                var dict = JSON.parse(request.responseText);
                var score = ((dict['feature_importance']["Suburb"] * dict["Suburb"][$('#loc').val()]) +
                    (dict['feature_importance']["Hour"] * dict["Hour"][hour]) +
                    (dict['feature_importance']["Day"] * dict["Day"][day]) + 
                    (dict['feature_importance']["Light_Condition"] * dict["Light_Conditions"][light]) + 
                    (dict['feature_importance'][driver] * dict["Age"][driver]) + 
                    (dict['feature_importance'][vehicle] * dict["Vehicle"][vehicle]))
                Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
                    yAxis: {
                        min: 0,
                        max: 100,
                        title: {
                            text: 'Risk Level'
                        },
                        tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                        minorTickLength: 0,
                    },

                    credits: {
                        enabled: false
                    },

                    series: [{
                        name: 'Risk',
                        data: [Math.round(score * 100)],
                        dataLabels: {
                            borderRadius: 5,
                            backgroundColor: 'rgba(252, 255, 197, 1.0)',
                            borderWidth: 0,
                            padding: 15,
                            borderColor: '#AAA',
                            y: -500,
                            shape: 'callout',
                            format:
                                '<div style="text-align:center;">' +
                                '<span style="font-size:20px;">It is {y}% risky.</span>' +
                                '</div>'
                        },
                        tooltip: {
                            valueSuffix: '%'
                        }
                    }]

                }));
            }
        }
    })
    $(function () {
        var searchTimeout = null;
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
                        console.log(e.target.innerHTML);
                        document.getElementById('loc').value = e.target.innerHTML;
                        postCodeQuery.server.getpoly($('#postcode').val(), $(this).text());
                        var current = $(this);
                        $('#section09').animate({ 'opacity': 0 }, 500, function () {
                            $(this).html("<span>Got it.</span><br> That means you live in " + current.text() + ".<br> Let's have a look!").animate({ 'opacity': 1 }, 500);
                        });
                        $(".name").text(current.text());
                        $('#section10').fadeIn(1500);
                        $('.search-bar').fadeOut(300);
                        $('.search-bar-results').fadeOut(100);
                        $('.leftnav').fadeIn(1500);
                        // un-lock scroll position
                        unlockScroll();
                        
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

            json.features = origin.features.filter(feature => feature.properties.suburb == suburb);
            const ac_types = json.features.map(feature => feature.properties.ACCIDENT_TYPE);
            const unique_ac_types = Array.from(new Set(ac_types));
            var count = new Array();
            unique_ac_types.forEach(function (type) {
                count[type] = 0;
            });
            ac_types.forEach(function (type) {
                count[type] = count[type] + 1;
            });
            var sum = 0;
            var max = 0;
            var max_type = "";
            unique_ac_types.forEach(function (type) {
                sum = sum + count[type];
                if (count[type] > max) {
                    max = count[type]
                    max_type = type
                }
            });
            const nd_types = json.features.map(feature => feature.properties.NODE_TYPE);
            const unique_nd_types = Array.from(new Set(nd_types));
            var count_nd = new Array();
            unique_nd_types.forEach(function (type) {
                count_nd[type] = 0;
            });
            nd_types.forEach(function (type) {
                count_nd[type] = count_nd[type] + 1;
            });
            var max_nd_type = "";
            var max_nd_count = 0;
            unique_nd_types.forEach(function (type) {
                if (count_nd[type] > max_nd_count) {
                    max_nd_count = count_nd[type]
                    max_nd_type = type
                }
            });
            $('#node').text(max_nd_type)
            var percentage = Math.round((max / sum) * 100);
            $("#sub_4").text("In " + suburb);
            $(".num").text(sum);
            $("#perc").text(percentage);
            $("#actype").text(max_type);

            var avg = Math.ceil(json.features.length / 60);
            if (avg == 1 && avg > Math.round(json.features.length / 60)) {
                $("#avg").text("less than 1");
            }
            else {
                $("#avg").text(avg);
            }
            

            const yd = json.features.filter(feature => feature.properties.YOUNG_DRIVER == 1).length;
            $("#yd").text(yd);
            $("#ydp").text(Math.round((yd / sum) * 100));
            const alc = json.features.filter(feature => feature.properties.ALCOHOLTIME == "Yes").length;
            $("#alc").text(alc);
            $("#alcp").text(Math.round((alc / sum) * 100));
            var loc_api = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + suburb.replace(" ", "%20") + ".json?types=locality&country=AU&limit=1&access_token=pk.eyJ1IjoibG9oc2UiLCJhIjoiY2tnbmVtdGM4MDlkdjMxcWg4ODg0MjY0dCJ9.WiZuARwnopVEj478S6oaXg";
            var loc_request = new XMLHttpRequest();
            var coordinate = null;
            loc_request.open("get", loc_api);
            loc_request.send(null);
            loc_request.onload = function () {
                if (loc_request.status == 200) {
                    coordinate = JSON.parse(loc_request.responseText).features[0].geometry.coordinates;
                    if (json.features.length == 0) {
                        $("#tick").html("You are safe!");
                        $("#road").text("no spot");
                        $("#type").text(" ");
                    } else {
                        isDone = false;
                        rendered = false;
                        
                    }
                    map.setFilter("clusters", ['has', 'point_count']);
                    map.setFilter("cluster-count", ['has', 'point_count']);
                    map.setCenter(coordinate);
                    map.getSource('crash').setData(json);
                    var poly = JSON.parse(geometry);
                    map.getSource('poly').setData(null);
                    map.getSource('poly').setData(poly);

                }
                else {
                    loc_request.send(null);
                }
            };
            var count_number = [];
            unique_ac_types.forEach(function (type) {
                count_number.push(count[type]);
            });
            var config = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: count_number,
                        backgroundColor: window.chartColors.slice(0, unique_ac_types.length),
                    }],
                    labels: unique_ac_types
                },
                options: {
                    responsive: true,
                    legend: {
                        display: true,
                        labels: {
                            padding: 20
                        },
                    },
                    tooltips: {
                        enabled: true,
                    }
                }
            };

            var ctx = document.getElementById("chart-area").getContext("2d");
            window.myPie = new Chart(ctx, config);

        };
        postCodeQuery.client.display = function (message) {
            $('#result').html(message);
        };
        $.connection.hub.start().done(function () {
            $("#searchText").on("focus", function () {
                if ($(this).val()) {
                    $('.search-bar-results').fadeIn(500);
                }
            }).on("click", function (event) { event.stopPropagation(); });
            $(document).click(function () { $('.search-bar-results').hide(); });

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
                        $('.search-bar-results').hide();
                    }
                    else {
                        searchTimeout = setTimeout(function () {

                            $('.search-bar-results').fadeIn(500);
                            $('#result').html('Not a valid VIC postcode');
                        }, 750);
                    }

                }


            }
            );
        });

    });

    var gaugeOptions = {
        chart: {
          type: 'gauge',
          height: 300,
          backgroundColor: null,
        },
      
        title: null,
        pane: {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },
      
        exporting: {
          enabled: false
        },
      
        tooltip: {
          enabled: true
        },
      
        // the value axis
        yAxis: {
          stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
          ],
          plotBands: [{
            from: 0,
            to: 25,
            color: 'rgb(155, 187, 89)', // green
            thickness: '50%'
          }, {
            from: 25,
            to: 75,
            color: 'rgb(255, 192, 0)', // yellow
            thickness: '50%'
          }, {
            from: 75,
            to: 100,
            color: 'rgb(233, 0, 0)', // red
            thickness: '50%'
          }],
          lineWidth: 0,
          tickWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          title: {
            y: -70
          },
          labels: {
            y: 16
          }
        },
      
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          },
          dial: {
            baseLength: '0%',
            baseWidth: 10,
            radius: '100%',
            rearLength: '0%',
            topWidth: 1
          }
        }
      };
      
      // The speed gauge
      var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Risk Level'
          },
          tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          minorTickLength: 0,
        },
      
        credits: {
          enabled: false
        },
      
        series: [{
          name: 'Risk',
          data: [10],
          dataLabels: {
            borderRadius: 5,
            backgroundColor: 'rgba(252, 255, 197, 1.0)',
            borderWidth: 0,
            padding: 15,
            borderColor: '#AAA',
            y: -500,
            shape: 'callout',
            format:
              '<div style="text-align:center;">' +
              '<span style="font-size:20px;">It is {y}% risky.</span>' +
              '</div>'
          },
          tooltip: {
            valueSuffix: '%'
          }
        }]
      
      }));
})

$(window).resize(function () {

});



window.chartColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(231,233,237)'
];


window.onload = function () {
    // var ctx = document.getElementById("chart-area").getContext("2d");
    // window.myPie = new Chart(ctx, config);
    $('html, body').animate({ scrollTop: '0px' });
};