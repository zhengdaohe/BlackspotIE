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



// LeftNav Sticky
window.onscroll = function () {
    var scrollposition = $(window).scrollTop();
    var headerheight = $('.header').outerHeight();
    if (scrollposition > 0 && scrollposition < $('.site-footer').offset().top - $('.leftnav-listing').outerHeight() - headerheight) {
        $('.leftnav-listing').addClass('leftnav-fixed')
    } else {
        $('.leftnav-listing').removeClass('leftnav-fixed')
    }
    stickyFunction();
    onScrollHighlighted();
};

// LeftNav onscroll Highlight
function onScrollHighlighted() {
    var leftNavHeight = 0;
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    var contentnavArray = [];
    var scrollPos = $(document).scrollTop();
    var header_height = $('.header').outerHeight();

    $('.leftnav-listing li a').each(function () {
        var currLink = $(this);
        var refElement = currLink.attr('href').replace('#', '');
        contentnavArray.push(refElement);
    });

    $.each(contentnavArray, function (i, val) {
        var refElement = $('section#' + val);
        var currLink = $('*[href=\'#' + val + '\']');
        var nextrefElement;
        if (contentnavArray.length > i + 1) {
            nextrefElement = $('section#' + contentnavArray[i + 1]);
        } else {
            nextrefElement = $('footer');
        }
        if (0 !== refElement.length) {
            if (refElement.offset().top - header_height <= scrollPos && nextrefElement.offset().top > scrollPos) {
                $('.leftnav-listing li').removeClass('is_visiable_section');
                currLink.parents('.leftnav-listing li').addClass('is_visiable_section');
            } else if (0 === (scrollHeight - scrollPosition) / scrollHeight) {
                currLink.parents('.leftnav-listing li').removeClass('is_visiable_section');
                currLink.parents('.leftnav-listing li').addClass('is_visiable_section');
            } else {
                currLink.parents('.leftnav-listing li').removeClass('is_visiable_section');
            }
        }
    });
}

// leftnav on click scroll
//$(document).on('click', '.leftnav-listing li > a', function () {
//    var getattr = ($(this).attr('href')).trim();
//    var headmrg = ($('[id="' + getattr.substr(1) + '"]').css('margin-top')).slice(0, -2);
//    $('html, body').animate({
//        scrollTop: $('[id="' + getattr.substr(1) + '"]').offset().top - $('.header').outerHeight() - headmrg
//    }, 1000);
//});

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
}

function unlockScroll() {
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

$(document).ready(function () {
    // hide the search dropdown box.


    lockScroll();


    var w_width = $(window).width();


    onScrollHighlighted();
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
        var url = "https://crash.b-cdn.net/Edited_Postcode_suburb.json";
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
        map.on('idle', 'clusters', () => {

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
                        $("#name").text(current.text());
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
            var percentage = Math.round((max / sum) * 100);
            $("#sub_4").text("In " + suburb);
            $("#num").text(sum);
            $("#perc").text(percentage);
            $("#actype").text(max_type);
            var avg = Math.ceil(json.features.length / 60);
            if (avg == 1 && avg > Math.round(json.features.length / 60)) {
                $("#avg").text("less than 1");
            }
            else {
                $("#avg").text(avg);
            }
            
            

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
                        $("#road").text("No spot");
                        $("#type").text(" ");
                    } else {
                        isDone = false;
                        rendered = false;
                        map.setFilter("clusters", ['has', 'point_count']);
                        map.setFilter("cluster-count", ['has', 'point_count']);
                    }
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
})

$(window).resize(function () {

    onScrollHighlighted();
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
