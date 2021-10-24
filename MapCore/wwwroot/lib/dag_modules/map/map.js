/* globals google, MarkerWithLabel, numeral */


(function () {
    'use strict';

    var DAG = window.DAG = window.DAG || {}; //merge DAG namespace

    DAG.Map = function () {
        var _params = null;
        var _defaultParams = {
            MAP_JSON: null,
            map: null,
            bounds: null,
            markerLimits: null,
            boundaryLimits: null,
            googleMapMarkers: [],
            googleMapPolygons: [],
            mapInitialized: false,
            executeCustomFunctionOnClick: false,
            showInfoBoxOnClick: true,
            showLegend: true,
            customFunction: null,
            initialZoomOffset: 1,
            mapHtml: '',
            mapHtmlArray: ['<div id="', 'mapContent', '" style="height:100%;position:relative"><div id="', 'map-canvas', '" style=" height:100%;width: 100%;margin: 0px;padding: 0px"></div><button class="slideMarkerInfoButton" id="', 'infoButtonText', '" ></button><div id="', 'infoBox', '" class="slideInfo" ></div><button class="slideLegendButton" id="', 'legendButtonText', '"></button><div id="', 'legendBox', '"  class="slideLegend"></div></div>'],
            MapConfigs: {
                DefaultStrokeOpacity: 0.5,
                DefaultFillOpacity: 0.8,
                DefaultBorderColor: '#e4e4e4',
                DefaultStrokeWeight: 1,
                HoverStrokeWeight: 3,
                DefaultStrokeColor: '#FF0000',
                DefaultFillColor: '#a0a0a0',
                ClickFillColor: '#fc9a89'

            },
            centerMapOnClick: true,
            containerId: null,
            containerRendered: false,
            mapContentId: 'mapContent',
            mapCanvasId: 'mapCanvas',
            infoButtonTextId: 'infoButtonText',
            infoBoxId: 'infoBox',
            legendButtonTextId: 'legendButtonText',
            legendBoxId: 'legendBox',
            randomId: null,
            maskHtml: "Please Wait...",
            markerClusterer: false,
            markerClustererLoaded: false,
            markerClustererJSPath: "/2014_G_DAG_Gmap_API_V1/Scripts/markerclusterer.js",
            markerClustererOptions: {
                gridSize: 70,
                maxZoom: 11,
                minimumClusterSize: 20,
                styles: [{
                    height: 46,
                    url: "/2014_G_DAG_Gmap_API_V1/Content/cluster1.png",
                    width: 46,
                    textColor: '#ffffff'
                }]
            },
            ghostMarker: null,
            mapOptions: {
                zoom: 10,
                scrollwheel: true,
                keyboardShortcuts: false,
                panControl: false,
                streetViewControl: false,
                zoomControl: true,
                disableDefaultUI: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                },
                styles: [{ "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#efefef" }] }, { "featureType": "landscape", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#cfcfcf" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#aaaaaa" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#efefef" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#cfcfcf" }] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#aaaaaa" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "#efefef" }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#cfcfcf" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#aaaaaa" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#EBF4FA" }] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#aaaaaa" }] }, { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "color": "#aaaaaa" }] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#E1E2E3" }] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#E1E2E3" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.man_made", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "on" }, { "gamma": 0.27 }] }]

            },
            legendPosition: google.maps.ControlPosition.LEFT_TOP,
            infoBoxPosition: google.maps.ControlPosition.RIGHT_TOP,
        };
        var ItemType = {
            MARKER: 'Marker',
            BOUNDARY: 'Boundary'
        };
        var _filterOptions = {
            multiSelect: false,
            inclusion: true
        };
        var _functions = {
            getMapContainerIds: function () {
                _params.randomId = '-' + _params.containerId;
                _params.mapContentId = _params.mapContentId.concat(_params.randomId);
                _params.mapCanvasId = _params.mapCanvasId.concat(_params.randomId);
                _params.infoButtonTextId = _params.infoButtonTextId.concat(_params.randomId);
                _params.infoBoxId = _params.infoBoxId.concat(_params.randomId);
                _params.legendButtonTextId = _params.legendButtonTextId.concat(_params.randomId);
                _params.legendBoxId = _params.legendBoxId.concat(_params.randomId);
                _params.mapHtmlArray[1] = _params.mapContentId;
                _params.mapHtmlArray[3] = _params.mapCanvasId;
                _params.mapHtmlArray[5] = _params.infoButtonTextId;
                _params.mapHtmlArray[7] = _params.infoBoxId;
                _params.mapHtmlArray[9] = _params.legendButtonTextId;
                _params.mapHtmlArray[11] = _params.legendBoxId;
                _params.mapHtml = _params.mapHtmlArray.join('');
            },
            setButtonEvents: function () {
                $('#'.concat(_params.infoButtonTextId)).click(function () {
                    if ($('#'.concat(_params.infoBoxId)).css('display') == 'none')
                        $('#'.concat(_params.infoBoxId)).show();
                    else
                        $('#'.concat(_params.infoBoxId)).hide();
                });
                $('#'.concat(_params.legendButtonTextId)).click(function () {
                    if ($('#'.concat(_params.legendBoxId)).css('display') == 'none')
                        $('#'.concat(_params.legendBoxId)).show();
                    else
                        $('#'.concat(_params.legendBoxId)).hide();
                });
            },
            addMarkers: function () {
                var latLng;
                if (_params.MAP_JSON.Markers)
                    for (var marker = 0; marker < _params.MAP_JSON.Markers.length ; marker++) {
                        var markerValue = 0;
                        try {
                            markerValue = _params.MAP_JSON.Markers[marker].MainAttribute.Value;
                        } catch (e) {
                            markerValue = 0;
                        }
                        var markerColor = _functions.checkAttributeWithLegend(ItemType.MARKER, markerValue);
                        if (_params.MAP_JSON.Markers[marker].Icon != null)
                            markerColor = _params.MAP_JSON.Markers[marker].Icon;

                        latLng = new google.maps.LatLng(_params.MAP_JSON.Markers[marker].LatLng[0], _params.MAP_JSON.Markers[marker].LatLng[1]);
                        var mapmarker = new google.maps.Marker({
                            position: latLng,
                            //animation: google.maps.Animation.BOUNCE,
                            map: _params.map,
                            icon: markerColor,
                            indexId: marker
                        });
                        _params.bounds.extend(latLng);
                        _params.googleMapMarkers.push(mapmarker);
                        google.maps.event.addListener(mapmarker, 'click', function () {
                            if (_params.centerMapOnClick) {
                                var newCenter = new google.maps.LatLng(_params.MAP_JSON.Markers[this.indexId].LatLng[0], _params.MAP_JSON.Markers[this.indexId].LatLng[1]);
                                _params.map.panTo(newCenter);
                            }
                            if (_params.showInfoBoxOnClick) {
                                _functions.showInfoBox(this.indexId, ItemType.MARKER);
                            }
                            if (_params.executeCustomFunctionOnClick) {
                                _params.customFunction(this.indexId, _params, _functions);
                            }
                        });
                    }
            },
            addBoundaries: function () {
                if (_params.MAP_JSON.Boundaries)
                    for (var boundary = 0; boundary < _params.MAP_JSON.Boundaries.length; boundary++) {
                        var points,
                        decodedSets,
                        paths = [],
                        brokenstring,
                        encodedPathsArray;
                        try {
                            encodedPathsArray = _params.MAP_JSON.Boundaries[boundary].BoundaryString.split('/');
                        } catch (e) {
                            //console.log(_params.MAP_JSON.Boundaries[boundary].BoundaryString);
                            continue;
                        }
                        for (var e = 0; e < encodedPathsArray.length; e++) {
                            var path = [];
                            decodedSets = google.maps.geometry.encoding.decodePath(encodedPathsArray[e]).toString();
                            decodedSets = decodedSets.replace(/\,\(/gi, "");
                            decodedSets = decodedSets.replace(/\(/gi, "");
                            brokenstring = decodedSets.split(")");
                            for (var f in brokenstring) {
                                if (typeof brokenstring[f] === 'string') {
                                    if (brokenstring[f].length > 1) {
                                        points = brokenstring[f].split(",");
                                        var myLatLng = new google.maps.LatLng(points[0], points[1]);
                                        path.push(myLatLng);
                                    }
                                }
                            }
                            paths.push(path);
                        }
                        var boundaryValue = 0;
                        try {
                            boundaryValue = _params.MAP_JSON.Boundaries[boundary].MainAttribute.Value;
                        } catch (e) {
                            boundaryValue = 0;
                        }
                        var boundaryColor = _functions.checkAttributeWithLegend(ItemType.BOUNDARY, boundaryValue);
                        var polygon = new google.maps.Polygon({
                            paths: paths,
                            strokeColor: _params.MapConfigs.DefaultBorderColor,
                            strokeOpacity: _params.MapConfigs.DefaultStrokeOpacity,
                            strokeWeight: _params.MapConfigs.DefaultStrokeWeight,
                            fillColor: boundaryColor,
                            DefaultBorderColor: _params.MapConfigs.DefaultBorderColor,
                            fillOpacity: 0.8,
                            title: _params.MAP_JSON.Boundaries[boundary].BoundaryId,
                            //   html: 'Zip Code : ' + markerObj[i].marker_id,
                            indexId: boundary
                        });
                        polygon.setMap(_params.map);
                        _params.googleMapPolygons.push(polygon);
                        var latLng = new google.maps.LatLng(_params.MAP_JSON.Boundaries[boundary].BoundaryCentroid[0], _params.MAP_JSON.Boundaries[boundary].BoundaryCentroid[1]);
                        _params.bounds.extend(latLng);
                        google.maps.event.addListener(polygon, 'click', function () {
                            if (_params.centerMapOnClick) {
                                var newCenter = new google.maps.LatLng(_params.MAP_JSON.Boundaries[this.indexId].BoundaryCentroid[0], _params.MAP_JSON.Boundaries[this.indexId].BoundaryCentroid[1]);
                                _params.map.panTo(newCenter);
                            }
                            if (_params.showInfoBoxOnClick)
                                _functions.showInfoBox(this.indexId, ItemType.BOUNDARY);
                            if (_params.executeCustomFunctionOnClick) {
                                _params.customFunction(this.indexId, _params, _functions);
                            }
                        });
                        google.maps.event.addListener(polygon, 'mouseover', function (event) {
                            _params.ghostMarker.setPosition(event.latLng);
                            _params.ghostMarker.labelContent = '<div>' + _params.MAP_JSON.Boundaries[this.indexId].Name + '<br/>' + _params.MAP_JSON.Boundaries[this.indexId].MainAttribute.Name + ': ' + _functions.getFormattedNumber(_params.MAP_JSON.Boundaries[this.indexId].MainAttribute.Value, _params.MAP_JSON.Boundaries[this.indexId].MainAttribute.FormatId, _params.MAP_JSON.Boundaries[this.indexId].MainAttribute.NumFormat) + '</div>';
                            _params.ghostMarker.label.setContent();
                            _params.ghostMarker.setVisible(true);
                            this.setOptions({ strokeWeight: _params.MapConfigs.HoverStrokeWeight });
                        });
                        google.maps.event.addListener(polygon, "mouseout", function () {
                            _params.ghostMarker.setVisible(false);
                            this.setOptions({ strokeWeight: _params.MapConfigs.DefaultStrokeWeight });
                        });
                    }
            },
            showInfoBox: function (indexId, type) {
                var baseArray;
                if (type == ItemType.MARKER) {
                    baseArray = _params.MAP_JSON.Markers;
                } else if (type == ItemType.BOUNDARY) {
                    baseArray = _params.MAP_JSON.Boundaries;
                }
                var infoBoxHtml = "";
                if (type == ItemType.MARKER) {
                    infoBoxHtml = '<div class="infoBoxRow"></div>';
                }
                else {
                    infoBoxHtml = '<div class="infoBoxRow"><b>' + baseArray[indexId].Name + '</b></div>';
                }

                if (baseArray[indexId].MainAttribute)
                    if (!baseArray[indexId].MainAttribute.Hidden)
                        infoBoxHtml = infoBoxHtml.concat('<div class="infoBoxRow">' + baseArray[indexId].MainAttribute.Name + ': ' + _functions.getFormattedNumber(baseArray[indexId].MainAttribute.Value, baseArray[indexId].MainAttribute.FormatId, baseArray[indexId].MainAttribute.NumFormat) + '</div>');
                if (baseArray[indexId].Attributes) {
                    for (var i in baseArray[indexId].Attributes) {
                        if (!baseArray[indexId].Attributes[i].Hidden)
                            infoBoxHtml = infoBoxHtml.concat('<div class="infoBoxRow">' + baseArray[indexId].Attributes[i].Name + ': ' + _functions.getFormattedNumber(baseArray[indexId].Attributes[i].Value, baseArray[indexId].Attributes[i].FormatId, baseArray[indexId].Attributes[i].NumFormat) + '</div>');
                    }
                }
                $('#'.concat(_params.infoBoxId)).html(infoBoxHtml);
                if (baseArray[indexId].MainAttribute || baseArray[indexId].Attributes.length)
                    $('#'.concat(_params.infoBoxId)).show();
            },
            buildLegendJson: function (type) {
                var legendType;
                var valuesArray = [];
                var baseArray = [];
                var legendArray = [];
                var lowerLimit;
                var upperLimit;
                var limits = [];

                if (type == ItemType.MARKER) {
                    baseArray = _params.MAP_JSON.Markers;
                    legendArray = _params.MAP_JSON.MarkerLegend;
                } else if (type == ItemType.BOUNDARY) {
                    baseArray = _params.MAP_JSON.Boundaries;
                    legendArray = _params.MAP_JSON.BoundaryLegend;
                }
                if (type == ItemType.MARKER) {
                    baseArray = _params.MAP_JSON.Markers;
                    legendArray = _params.MAP_JSON.MarkerLegend;
                } else if (type == ItemType.BOUNDARY) {
                    baseArray = _params.MAP_JSON.Boundaries;
                    legendArray = _params.MAP_JSON.BoundaryLegend;
                }
                if (legendArray.LegendType == 1) {
                    for (var i in baseArray) {
                        try {
                            valuesArray.push(baseArray[i].MainAttribute.Value);
                        } catch (e) {
                            valuesArray.push(0);
                        }
                    }
                    valuesArray.sort(function (a, b) { return a - b; });
                    var tempArray = [];
                    var legendLength = legendArray.LegendValues.length;
                    for (var i = 0; i < legendLength; i++) {
                        var len1 = valuesArray.length;
                        var sliceParam1 = Math.round(len1 / (legendLength - i));
                        if (sliceParam1 == 0) {
                            if (valuesArray.length) {

                                var limit = { "LowerLimit": valuesArray[0], "UpperLimit": valuesArray[valuesArray.length - 1], "URL": legendArray.LegendValues[i].URL };
                                limits.push(limit);
                            }
                            break;
                        }
                        else {
                            tempArray = valuesArray.splice(0, sliceParam1);
                            for (var j = 0; j < valuesArray.length; j++) {
                                if (tempArray[tempArray.length - 1] == valuesArray[j]) {
                                    tempArray.push(valuesArray[j]);
                                } else {
                                    valuesArray.splice(0, j);
                                    break;
                                }

                            }
                        }
                        var limit = { "LowerLimit": tempArray[0], "UpperLimit": tempArray[tempArray.length - 1], "URL": legendArray.LegendValues[i].URL };
                        limits.push(limit);
                    }
                } else if (legendArray.LegendType == 2) {
                    var legendLength = legendArray.LegendValues.length;
                    for (var i = 0; i < legendLength; i++) {
                        limits.push(legendArray.LegendValues[i]);
                    }
                }

                return limits;
            },
            buildLegendJsonPercentile: function (type) {
                var legendType;
                var valuesArray = [];
                var baseArray = [];
                var legendArray = [];
                var lowerLimit;
                var upperLimit;
                var limits = [];
                if (type == ItemType.MARKER) {
                    baseArray = _params.MAP_JSON.Markers;
                    legendArray = _params.MAP_JSON.MarkerLegend;
                } else if (type == ItemType.BOUNDARY) {
                    baseArray = _params.MAP_JSON.Boundaries;
                    legendArray = _params.MAP_JSON.BoundaryLegend;
                }
                if (legendArray.LegendType == 1) {
                    for (var i in baseArray) {
                        try {
                            valuesArray.push(baseArray[i].MainAttribute.Value);
                        } catch (e) {
                            valuesArray.push(0);
                        }
                    }
                    valuesArray.sort(function (a, b) { return a - b; });
                    var legendLength = legendArray.LegendValues.length;
                    for (var i = 0; i < legendLength; i++) {
                        if (i == 0) {
                            lowerLimit = Math.floor(valuesArray[0]);
                        } else {
                            lowerLimit = parseFloat(upperLimit);
                        }
                        var percentileValue = (i + 1) / legendLength;
                        upperLimit = _functions.percentile(valuesArray, percentileValue);
                        if (i == legendLength - 1)
                            upperLimit = Math.ceil(upperLimit);
                        var limit = { "LowerLimit": lowerLimit, "UpperLimit": upperLimit, "URL": legendArray.LegendValues[i].URL };

                        limits.push(limit);
                    }
                } else if (legendArray.LegendType == 2) {
                    var legendLength = legendArray.LegendValues.length;
                    for (var i = 0; i < legendLength; i++) {
                        limits.push(legendArray.LegendValues[i]);
                    }
                }
                return limits;
            },
            buildLegendHtml: function () {
                $('#'.concat(_params.legendButtonTextId)).show();
                $('#'.concat(_params.legendButtonTextId)).html(_params.MAP_JSON.LegendButtonHeader);
                var legendHtml = '';
                if (_params.MAP_JSON.MarkerLegend) {
                    legendHtml = legendHtml.concat('<div class="innerLegend">');
                    legendHtml = legendHtml.concat('<div  class="legendRow"><b>' + _params.MAP_JSON.MarkerLegend.LegendHeader + '</b></div>');

                    for (var i = 0; i < _params.markerLimits.length ; i++) {
                        legendHtml = legendHtml.concat('<div class="legendRow" style="position:relative;"><div style="height:12px;width:12px;position:absolute;top:1px;background-image:url(\'' + _params.markerLimits[i].URL + '\');background-repeat:no-repeat;"></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span  id="markerLegendLimits' + i + '-' + _params.containerId + '" style="cursor:pointer;" class="legendTextDefault">');

                        if (_params.markerLimits[i].DisplayText)
                            legendHtml = legendHtml.concat(_params.markerLimits[i].DisplayText);
                        else
                            legendHtml = legendHtml.concat(_functions.getFormattedNumber(_params.markerLimits[i].LowerLimit, _params.MAP_JSON.MarkerLegend.FormatId, _params.MAP_JSON.MarkerLegend.NumFormat) + ' &mdash; ' + _functions.getFormattedNumber(_params.markerLimits[i].UpperLimit, _params.MAP_JSON.MarkerLegend.FormatId, _params.MAP_JSON.MarkerLegend.NumFormat));

                        legendHtml = legendHtml.concat('</span></div>');
                    }
                    legendHtml = legendHtml.concat('</div>');
                    legendHtml = legendHtml.concat('<br/>');
                }

                if (_params.MAP_JSON.BoundaryLegend) {
                    if (_params.MAP_JSON.BoundaryLegend) {
                        legendHtml = legendHtml.concat('<div class="innerLegend">');
                        legendHtml = legendHtml.concat('<div  class="legendRow"><b>' + _params.MAP_JSON.BoundaryLegend.LegendHeader + '</b></div>');
                        for (var i = 0; i < _params.boundaryLimits.length; i++) {
                            legendHtml = legendHtml.concat('<div class="legendRow" style="position:relative;"><div style="height:12px;width:12px;position:absolute;top:0px;background-color:' + _params.boundaryLimits[i].URL + '"></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span  id="boundaryLegendLimits' + i + '-' + _params.containerId + '" style="cursor:pointer;" class="legendTextDefault">');
                            if (_params.boundaryLimits[i].DisplayText)
                                legendHtml = legendHtml.concat(_params.boundaryLimits[i].DisplayText);
                            else
                                legendHtml = legendHtml.concat(_functions.getFormattedNumber(_params.boundaryLimits[i].LowerLimit, _params.MAP_JSON.BoundaryLegend.FormatId, _params.MAP_JSON.BoundaryLegend.NumFormat) + ' &mdash; ' + _functions.getFormattedNumber(_params.boundaryLimits[i].UpperLimit, _params.MAP_JSON.BoundaryLegend.FormatId, _params.MAP_JSON.BoundaryLegend.NumFormat));
                            legendHtml = legendHtml.concat('</span></div>');

                        }
                        legendHtml = legendHtml.concat('</div>');
                    }
                }


                $('#'.concat(_params.legendBoxId)).html(legendHtml);
                if (_params.MAP_JSON.MarkerLegend) {
                    for (var i in _params.markerLimits) {
                        $('#markerLegendLimits' + i + '-' + _params.containerId).clickToggle(function (e) {
                            var opts = _filterOptions;
                            opts.multiSelect = true;
                            opts.inclusion = false;
                            $('#markerLegendLimits' + e.counter + '-' + _params.containerId).toggleClass('legendTextDefault');
                            _functions.applyFiltersRange(_params.MAP_JSON.Markers[0].MainAttribute.Name, _params.markerLimits[e.counter].LowerLimit, _params.markerLimits[e.counter].UpperLimit, opts, ItemType.MARKER);
                        }, function (e) {
                            var opts = _filterOptions;
                            opts.multiSelect = true;
                            opts.inclusion = true;
                            $('#markerLegendLimits' + e.counter + '-' + _params.containerId).toggleClass('legendTextDefault');
                            _functions.applyFiltersRange(_params.MAP_JSON.Markers[0].MainAttribute.Name, _params.markerLimits[e.counter].LowerLimit, _params.markerLimits[e.counter].UpperLimit, opts, ItemType.MARKER);
                        }, { counter: i });
                    }
                }
                for (var i in _params.boundaryLimits) {
                    $('#boundaryLegendLimits' + i + '-' + _params.containerId).clickToggle(function (e) {
                        var opts = _filterOptions;
                        opts.multiSelect = true;
                        opts.inclusion = false;
                        $('#boundaryLegendLimits' + e.counter + '-' + _params.containerId).toggleClass('legendTextDefault');
                        _functions.applyFiltersRange(_params.MAP_JSON.Boundaries[0].MainAttribute.Name, _params.boundaryLimits[e.counter].LowerLimit, _params.boundaryLimits[e.counter].UpperLimit, opts, ItemType.BOUNDARY);
                    }, function (e) {
                        var opts = _filterOptions;
                        opts.multiSelect = true;
                        opts.inclusion = true;
                        $('#boundaryLegendLimits' + e.counter + '-' + _params.containerId).toggleClass('legendTextDefault');
                        _functions.applyFiltersRange(_params.MAP_JSON.Boundaries[0].MainAttribute.Name, _params.boundaryLimits[e.counter].LowerLimit, _params.boundaryLimits[e.counter].UpperLimit, opts, ItemType.BOUNDARY);
                    }, { counter: i });

                }
            },
            checkAttributeWithLegend: function (type, value) {
                var limits = [];
                var legendArray = [];
                var URL;
                if (type == ItemType.MARKER) {
                    legendArray = _params.MAP_JSON.MarkerLegend;
                    limits = _params.markerLimits;
                } else if (type == ItemType.BOUNDARY) {
                    legendArray = _params.MAP_JSON.BoundaryLegend;
                    limits = _params.boundaryLimits;
                }
                for (var i in limits) {
                    if (Number(value) >= limits[i].LowerLimit && Number(value) <= limits[i].UpperLimit) {
                        URL = limits[i].URL;
                        break;
                    }
                }
                return URL;
            },
            percentile: function (sequence, percentileValue) {
                var N = sequence.length;
                var n = (N - 1) * percentileValue + 1;
                // Another method: double n = (N + 1) * excelPercentile;
                if (n == 1) return parseFloat(sequence[0]);
                else if (n == N) return parseFloat(sequence[N - 1]);
                else {
                    var k = Math.floor(n);
                    var d = n - k;
                    return parseFloat(sequence[k - 1]) + d * parseFloat((sequence[k] - sequence[k - 1]));
                }
            },
            getFormattedNumber: function (value, format_id, numFormat) {
                //If using the new, NumeralJS numFormat string...
                if (numFormat) {
                    return numeral(value).format(numFormat);
                }
                    //Else use legacy formatting id's
                else {
                    var nStr, x, x1, x2;
                    switch (format_id) {
                        case 0:
                        case 1:
                            return value;
                        case 2:
                            value = value * 100;
                        case 5:
                            var result = parseFloat(value).toFixed(2);
                            if (result == '-0.00') {
                                result = "0.00";
                            }
                            return result + '%';
                        case 3:
                            var result = value;
                            nStr = result;
                            nStr += '';
                            x = nStr.split('.');
                            x1 = x[0];
                            x2 = x.length > 1 ? '.' + x[1] : '';
                            var rgx = /(\d+)(\d{3})/;
                            while (rgx.test(x1)) {
                                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                            }
                            result = x2.length > 0 ? x1 + parseFloat(x2).toFixed(2) : x1;
                            if (value != 0) {
                                result = "$" + result;
                                return result;
                            } else if (value == 0) {
                                result = "$" + value;
                                return result;
                            }
                        case 4:
                            var result = value;
                            nStr = result;
                            nStr += '';
                            x = nStr.split('.');
                            x1 = x[0];
                            x2 = x.length > 1 ? '.' + x[1] : '';
                            var rgx = /(\d+)(\d{3})/;
                            while (rgx.test(x1)) {
                                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                            }
                            return x2.length > 0 ? x1 + parseFloat(x2).toFixed(2) : x1;
                        default:
                            return value;
                    }
                }
            },
            getMapData: function (url, params, method) {
                $.support.cors = true;
                $.ajax({
                    type: method,
                    url: url,
                    data: params,
                    dataType: 'json',
                    success: function (data) {
                        _functions.updateMap(data);
                    }
                });
            },
            createMap: function () {
                _params.bounds = new google.maps.LatLngBounds();
                _params.map = new google.maps.Map(document.getElementById(_params.mapCanvasId), _params.mapOptions);
                _params.mapInitialized = true;
                google.maps.event.addListener(_params.map, 'click', function () {
                    $('#'.concat(_params.infoBoxId)).html('');
                    $('#'.concat(_params.infoBoxId)).hide();
                    $('#'.concat(_params.legendBoxId)).hide();
                    //_functions.updateMap(_params.MAP_JSON);
                });
                if (_params.showLegend) {
                    _params.map.controls[_params.legendPosition].push(document.getElementById(_params.legendButtonTextId));
                    _params.map.controls[_params.legendPosition].push(document.getElementById(_params.legendBoxId));
                }
                _params.map.controls[_params.infoBoxPosition].push(document.getElementById(_params.infoButtonTextId));
                _params.map.controls[_params.infoBoxPosition].push(document.getElementById(_params.infoBoxId));
            },
            clearMap: function () {
                for (var i = 0; i < _params.googleMapMarkers.length; i++) {
                    _params.googleMapMarkers[i].setMap(null);
                }
                _params.googleMapMarkers = [];
                for (var i = 0; i < _params.googleMapPolygons.length; i++) {
                    _params.googleMapPolygons[i].setMap(null);
                }
                _params.googleMapPolygons = [];
                $('#'.concat(_params.infoBoxId)).html('');
                $('#'.concat(_params.infoBoxId)).hide();
                $('#'.concat(_params.legendBoxId)).html('');
                $('#'.concat(_params.legendBoxId)).hide();

            },
            initialize: function (containerId) {
                if (!containerId) {
                    return;
                } else if (containerId != _params.containerId) {
                    _params.containerId = containerId;
                    _functions.getMapContainerIds();
                    $('#'.concat(containerId)).html(_params.mapHtml);
                    $('#'.concat(containerId)).mask(_params.maskHtml);
                    _functions.setButtonEvents();

                    _functions.createMap();
                    _params.containerRendered = true;

                } else {
                    _functions.clearMap();
                }
            },
            updateMap: function (data) {
                if (data != null) {
                    _params.MAP_JSON = data;
                }
                if (!_params.mapInitialized) {
                    _functions.createMap();
                }
                else {
                    _functions.clearMap();
                }
                _params.ghostMarker = new MarkerWithLabel({
                    position: new google.maps.LatLng(0, 0),
                    draggable: false,
                    raiseOnDrag: false,
                    map: _params.map,
                    labelContent: "",
                    labelAnchor: new google.maps.Point(-10, 20),
                    labelClass: "hoverBox", // the CSS class for the label
                    labelStyle: { opacity: 1.0 },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 0
                    },
                    visible: false
                });
                if (_params.MAP_JSON.InfoboxButtonHeader)
                    $('#'.concat(_params.infoButtonTextId)).html(_params.MAP_JSON.InfoboxButtonHeader);
                if (_params.MAP_JSON.MarkerLegend)
                    _params.markerLimits = _functions.buildLegendJson(ItemType.MARKER);
                if (_params.MAP_JSON.BoundaryLegend)
                    _params.boundaryLimits = _functions.buildLegendJson(ItemType.BOUNDARY);
                if (_params.MAP_JSON.MarkerLegend || _params.MAP_JSON.BoundaryLegend)
                    _functions.buildLegendHtml();
                if (!_params.MAP_JSON.MarkerLegend && !_params.MAP_JSON.BoundaryLegend)
                    $('#'.concat(_params.legendButtonTextId)).hide();
                if (_params.MAP_JSON.Markers) {
                    _functions.addMarkers();
                    if (_params.markerClusterer) {
                        var markerCluster = new MarkerClusterer(_params.map, _params.googleMapMarkers, _params.markerClustererOptions);
                    }
                }
                if (_params.MAP_JSON.Boundaries)
                    _functions.addBoundaries();
                google.maps.event.addListener(_params.map, 'zoom_changed', function () {
                    var zoomChangeBoundsListener;
                    google.maps.event.addListener(_params.map, 'bounds_changed', function (event) {
                        if (this.getZoom() > 11 && this.initialZoom == true) {
                            // Change max/min zoom here
                            this.setZoom(11);
                            this.initialZoom = false;
                        }
                        google.maps.event.removeListener(zoomChangeBoundsListener);
                    });
                });
                google.maps.event.trigger(_params.map, 'resize');
                _params.map.fitBounds(_params.bounds);
                _params.map.setCenter(_params.bounds.getCenter());
                _params.map.setZoom(_params.map.getZoom() + _params.initialZoomOffset);
                $('#'.concat(_params.containerId)).unmask();
            },
            applyFilters: function (name, values, type) {
                var baseArray, mapArray;
                if (type == ItemType.MARKER) {
                    baseArray = _params.MAP_JSON.Markers;
                    mapArray = _params.googleMapMarkers;
                } else if (type == ItemType.BOUNDARY) {
                    baseArray = _params.MAP_JSON.Boundaries;
                    mapArray = _params.googleMapPolygons;
                }
                var indexIds = [];
                for (var m = 0; m < mapArray.length; m++) {
                    mapArray[m].setMap(null);
                    var k = mapArray[m].indexId;
                    if (baseArray[k].MainAttribute && baseArray[k].MainAttribute.Name == name) {
                        if ($.inArray(baseArray[k].MainAttribute.Value, values) != -1) {
                            mapArray[m].setMap(_params.map);
                        }
                    }
                    else {
                        for (var attribute in baseArray[k].Attributes) {
                            if (baseArray[k].Attributes[attribute].Name == name) {
                                if ($.inArray(baseArray[k].Attributes[attribute].Value, values) != -1) {
                                    mapArray[m].setMap(_params.map);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            applyFiltersRange: function (name, min, max, opts, type) {
                var baseArray, mapArray;
                if (type == ItemType.MARKER) {
                    baseArray = _params.MAP_JSON.Markers;
                    mapArray = _params.googleMapMarkers;
                } else if (type == ItemType.BOUNDARY) {
                    baseArray = _params.MAP_JSON.Boundaries;
                    mapArray = _params.googleMapPolygons;

                }
                var options = $.extend(true, _filterOptions, opts || {});
                if (Number(min) > Number(max)) {
                    var temp = min;
                    min = max;
                    max = temp;
                }
                var mapObj = options.inclusion ? _params.map : null;
                var indexIds = [];
                for (var m = 0; m < mapArray.length; m++) {
                    if (!options.multiSelect) {
                        mapArray[m].setMap(null);
                    }
                    var k = mapArray[m].indexId;
                    if (baseArray[k].MainAttribute && baseArray[k].MainAttribute.Name == name) {
                        if (baseArray[k].MainAttribute.Value >= Number(min) && baseArray[k].MainAttribute.Value <= Number(max)) {
                            mapArray[m].setMap(mapObj);
                        }
                    }
                    else {
                        for (var attribute in baseArray[k].Attributes) {
                            if (baseArray[k].Attributes[attribute].Name == name) {
                                if (baseArray[k].Attributes[attribute].Value >= Number(min) && baseArray[k].Attributes[attribute].Value <= Number(max)) {
                                    mapArray[m].setMap(mapObj);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };

        return {
            initialize: function (containerId, opts) {
                _params = $.extend(true, _defaultParams, opts || {});
                if (_params.markerClusterer) {
                    $.getScript(_params.markerClustererJSPath, function () {
                        _functions.initialize(containerId);
                        _params.markerClustererLoaded = true;
                    });
                } else {
                    _functions.initialize(containerId);
                }
            },
            setMapData: function (url, params, method) {
                $('#'.concat(_params.containerId)).mask(_params.maskHtml);
                _functions.getMapData(url, params, method);

            },
            updateMap: function (data) {
                $('#'.concat(_params.containerId)).mask(_params.maskHtml);
                var updateTimer = window.setInterval(function () {
                    if (_params.containerRendered) {
                        _functions.updateMap(data);
                        window.clearInterval(updateTimer);
                    }
                }, 200);

            },
            getJsonData: function () {
                return _params.MAP_JSON;
            },
            setMaskHtml: function (maskHtml) {
                _params.maskHtml = maskHtml;
            },
            applyMarkerFilters: function (name, values) {
                _functions.applyFilters(name, values, ItemType.MARKER);
            },
            applyMarkerFiltersRange: function (name, min, max, opts) {
                _functions.applyFiltersRange(name, min, max, opts, ItemType.MARKER);
            },
            applyBoundaryFilters: function (name, values) {
                _functions.applyFilters(name, values, ItemType.BOUNDARY);
            },
            applyBoundaryFiltersRange: function (name, min, max, opts) {
                _functions.applyFiltersRange(name, min, max, opts, ItemType.BOUNDARY);
            },
            getMapDefaultParams: function () {
                return _defaultParams;
            },
            getMapParams: function () {
                return _params;
            },
            insertHTMLElement: function (position, elementID) {
                _params.map.controls[position].push(document.getElementById(elementID));
            }
        };
    };
})();

(function ($) {
    'use strict';
    $.fn.clickToggle = function (func1, func2, params) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.on("click", function (event) {

            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this, params)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));



// numeral.js
// version : 1.4.5
// author : Adam Draper
// license : MIT
// http://adamwdraper.github.com/Numeral-js/
if (!numeral) {
    (function(){function o(e){this._n=e}function u(e,t,n){var r=Math.pow(10,t),i;i=(Math.round(e*r)/r).toFixed(t);if(n){var s=new RegExp("0{1,"+n+"}$");i=i.replace(s,"")}return i}function a(e,t){var n;t.indexOf("$")>-1?n=l(e,t):t.indexOf("%")>-1?n=c(e,t):t.indexOf(":")>-1?n=h(e,t):n=d(e,t);return n}function f(e,t){if(t.indexOf(":")>-1)e._n=p(t);else if(t===i)e._n=0;else{var s=t;n[r].delimiters.decimal!=="."&&(t=t.replace(/\./g,"").replace(n[r].delimiters.decimal,"."));var o=new RegExp(n[r].abbreviations.thousand+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),u=new RegExp(n[r].abbreviations.million+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),a=new RegExp(n[r].abbreviations.billion+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),f=new RegExp(n[r].abbreviations.trillion+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),l=["KB","MB","GB","TB","PB","EB","ZB","YB"],c=!1;for(var h=0;h<=l.length;h++){c=t.indexOf(l[h])>-1?Math.pow(1024,h+1):!1;if(c)break}e._n=(c?c:1)*(s.match(o)?Math.pow(10,3):1)*(s.match(u)?Math.pow(10,6):1)*(s.match(a)?Math.pow(10,9):1)*(s.match(f)?Math.pow(10,12):1)*(t.indexOf("%")>-1?.01:1)*Number((t.indexOf("(")>-1?"-":"")+t.replace(/[^0-9\.'-]+/g,""));e._n=c?Math.ceil(e._n):e._n}return e._n}function l(e,t){var i=t.indexOf("$")<=1?!0:!1,s="";if(t.indexOf(" $")>-1){s=" ";t=t.replace(" $","")}else if(t.indexOf("$ ")>-1){s=" ";t=t.replace("$ ","")}else t=t.replace("$","");var o=a(e,t);if(i)if(o.indexOf("(")>-1||o.indexOf("-")>-1){o=o.split("");o.splice(1,0,n[r].currency.symbol+s);o=o.join("")}else o=n[r].currency.symbol+s+o;else if(o.indexOf(")")>-1){o=o.split("");o.splice(-1,0,s+n[r].currency.symbol);o=o.join("")}else o=o+s+n[r].currency.symbol;return o}function c(e,t){var n="";if(t.indexOf(" %")>-1){n=" ";t=t.replace(" %","")}else t=t.replace("%","");e._n=e._n*100;var r=a(e,t);if(r.indexOf(")")>-1){r=r.split("");r.splice(-1,0,n+"%");r=r.join("")}else r=r+n+"%";return r}function h(e,t){var n=Math.floor(e._n/60/60),r=Math.floor((e._n-n*60*60)/60),i=Math.round(e._n-n*60*60-r*60);return n+":"+(r<10?"0"+r:r)+":"+(i<10?"0"+i:i)}function p(e){var t=e.split(":"),n=0;if(t.length===3){n+=Number(t[0])*60*60;n+=Number(t[1])*60;n+=Number(t[2])}else if(t.lenght===2){n+=Number(t[0])*60;n+=Number(t[1])}return Number(n)}function d(e,t){var s=!1,o=!1,a="",f="",l="",c=Math.abs(e._n);if(e._n===0&&i!==null)return i;if(t.indexOf("(")>-1){s=!0;t=t.slice(1,-1)}if(t.indexOf("a")>-1){if(t.indexOf(" a")>-1){a=" ";t=t.replace(" a","")}else t=t.replace("a","");if(c>=Math.pow(10,12)){a+=n[r].abbreviations.tillion;e._n=e._n/Math.pow(10,12)}else if(c<Math.pow(10,12)&&c>=Math.pow(10,9)){a+=n[r].abbreviations.billion;e._n=e._n/Math.pow(10,9)}else if(c<Math.pow(10,9)&&c>=Math.pow(10,6)){a+=n[r].abbreviations.million;e._n=e._n/Math.pow(10,6)}else if(c<Math.pow(10,6)&&c>=Math.pow(10,3)){a+=n[r].abbreviations.thousand;e._n=e._n/Math.pow(10,3)}}if(t.indexOf("b")>-1){if(t.indexOf(" b")>-1){f=" ";t=t.replace(" b","")}else t=t.replace("b","");var h=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],p,d;for(var v=0;v<=h.length;v++){p=Math.pow(1024,v);d=Math.pow(1024,v+1);if(e._n>=p&&e._n<d){f+=h[v];p>0&&(e._n=e._n/p);break}}}if(t.indexOf("o")>-1){if(t.indexOf(" o")>-1){l=" ";t=t.replace(" o","")}else t=t.replace("o","");l+=n[r].ordinal(e._n)}if(t.indexOf("[.]")>-1){o=!0;t=t.replace("[.]",".")}var m=e._n.toString().split(".")[0],g=t.split(".")[1],y=t.indexOf(","),b="",w=!1;if(g){if(g.indexOf("[")>-1){g=g.replace("]","");g=g.split("[");b=u(e._n,g[0].length+g[1].length,g[1].length)}else b=u(e._n,g.length);m=b.split(".")[0];b.split(".")[1].length?b=n[r].delimiters.decimal+b.split(".")[1]:b="";o&&Number(b)===0&&(b="")}else m=u(e._n,null);if(m.indexOf("-")>-1){m=m.slice(1);w=!0}y>-1&&(m=m.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1"+n[r].delimiters.thousands));t.indexOf(".")===0&&(m="");return(s&&w?"(":"")+(!s&&w?"-":"")+m+b+(l?l:"")+(a?a:"")+(f?f:"")+(s&&w?")":"")}function v(e,t){n[e]=t}var e,t="1.4.5",n={},r="en",i=null,s=typeof module!="undefined"&&module.exports;e=function(t){e.isNumeral(t)?t=t.value():Number(t)||(t=0);return new o(Number(t))};e.version=t;e.isNumeral=function(e){return e instanceof o};e.language=function(t,i){if(!t)return r;t&&!i&&(r=t);(i||!n[t])&&v(t,i);return e};e.language("en",{delimiters:{thousands:",",decimal:"."},abbreviations:{thousand:"k",million:"m",billion:"b",trillion:"t"},ordinal:function(e){var t=e%10;return~~(e%100/10)===1?"th":t===1?"st":t===2?"nd":t===3?"rd":"th"},currency:{symbol:"$"}});e.zeroFormat=function(e){typeof e=="string"?i=e:i=null};e.fn=o.prototype={clone:function(){return e(this)},format:function(t){return a(this,t?t:e.defaultFormat)},unformat:function(t){return f(this,t?t:e.defaultFormat)},value:function(){return this._n},valueOf:function(){return this._n},set:function(e){this._n=Number(e);return this},add:function(e){this._n=this._n+Number(e);return this},subtract:function(e){this._n=this._n-Number(e);return this},multiply:function(e){this._n=this._n*Number(e);return this},divide:function(e){this._n=this._n/Number(e);return this},difference:function(e){var t=this._n-Number(e);t<0&&(t=-t);return t}};s&&(module.exports=e);typeof ender=="undefined"&&(this.numeral=e);typeof define=="function"&&define.amd&&define([],function(){return e})}).call(this);
}

/**
 * @name MarkerWithLabel for V3
 * @version 1.1.8 [February 26, 2013]
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2012 Gary Little [gary at luxcentral.com]
 * @fileoverview MarkerWithLabel extends the Google Maps JavaScript API V3

/*!
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function inherits(e, t) { function i() { } i.prototype = t.prototype, e.superClass_ = t.prototype, e.prototype = new i, e.prototype.constructor = e } function MarkerLabel_(e, t) { this.marker_ = e, this.handCursorURL_ = e.handCursorURL, this.labelDiv_ = document.createElement("div"), this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;", this.eventDiv_ = document.createElement("div"), this.eventDiv_.style.cssText = this.labelDiv_.style.cssText, this.eventDiv_.setAttribute("onselectstart", "return false;"), this.eventDiv_.setAttribute("ondragstart", "return false;"), this.crossDiv_ = MarkerLabel_.getSharedCross(t) } function MarkerWithLabel(e) { e = e || {}, e.labelContent = e.labelContent || "", e.labelAnchor = e.labelAnchor || new google.maps.Point(0, 0), e.labelClass = e.labelClass || "markerLabels", e.labelStyle = e.labelStyle || {}, e.labelInBackground = e.labelInBackground || !1, "undefined" == typeof e.labelVisible && (e.labelVisible = !0), "undefined" == typeof e.raiseOnDrag && (e.raiseOnDrag = !0), "undefined" == typeof e.clickable && (e.clickable = !0), "undefined" == typeof e.draggable && (e.draggable = !1), "undefined" == typeof e.optimized && (e.optimized = !1), e.crossImage = e.crossImage || "http" + ("https:" === document.location.protocol ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png", e.handCursor = e.handCursor || "http" + ("https:" === document.location.protocol ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur", e.optimized = !1, this.label = new MarkerLabel_(this, e.crossImage, e.handCursor), google.maps.Marker.apply(this, arguments) } inherits(MarkerLabel_, google.maps.OverlayView), MarkerLabel_.getSharedCross = function (e) { var t; return "undefined" == typeof MarkerLabel_.getSharedCross.crossDiv && (t = document.createElement("img"), t.style.cssText = "position: absolute; z-index: 1000002; display: none;", t.style.marginLeft = "-8px", t.style.marginTop = "-9px", t.src = e, MarkerLabel_.getSharedCross.crossDiv = t), MarkerLabel_.getSharedCross.crossDiv }, MarkerLabel_.prototype.onAdd = function () { var e, t, i, s, a, r, o, n = this, l = !1, g = !1, p = 20, _ = "url(" + this.handCursorURL_ + ")", h = function (e) { e.preventDefault && e.preventDefault(), e.cancelBubble = !0, e.stopPropagation && e.stopPropagation() }, v = function () { n.marker_.setAnimation(null) }; this.getPanes().overlayImage.appendChild(this.labelDiv_), this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_), "undefined" == typeof MarkerLabel_.getSharedCross.processed && (this.getPanes().overlayImage.appendChild(this.crossDiv_), MarkerLabel_.getSharedCross.processed = !0), this.listeners_ = [google.maps.event.addDomListener(this.eventDiv_, "mouseover", function (e) { (n.marker_.getDraggable() || n.marker_.getClickable()) && (this.style.cursor = "pointer", google.maps.event.trigger(n.marker_, "mouseover", e)) }), google.maps.event.addDomListener(this.eventDiv_, "mouseout", function (e) { !n.marker_.getDraggable() && !n.marker_.getClickable() || g || (this.style.cursor = n.marker_.getCursor(), google.maps.event.trigger(n.marker_, "mouseout", e)) }), google.maps.event.addDomListener(this.eventDiv_, "mousedown", function (e) { g = !1, n.marker_.getDraggable() && (l = !0, this.style.cursor = _), (n.marker_.getDraggable() || n.marker_.getClickable()) && (google.maps.event.trigger(n.marker_, "mousedown", e), h(e)) }), google.maps.event.addDomListener(document, "mouseup", function (t) { var i; if (l && (l = !1, n.eventDiv_.style.cursor = "pointer", google.maps.event.trigger(n.marker_, "mouseup", t)), g) { if (a) { i = n.getProjection().fromLatLngToDivPixel(n.marker_.getPosition()), i.y += p, n.marker_.setPosition(n.getProjection().fromDivPixelToLatLng(i)); try { n.marker_.setAnimation(google.maps.Animation.BOUNCE), setTimeout(v, 1406) } catch (r) { } } n.crossDiv_.style.display = "none", n.marker_.setZIndex(e), s = !0, g = !1, t.latLng = n.marker_.getPosition(), google.maps.event.trigger(n.marker_, "dragend", t) } }), google.maps.event.addListener(n.marker_.getMap(), "mousemove", function (s) { var _; l && (g ? (s.latLng = new google.maps.LatLng(s.latLng.lat() - t, s.latLng.lng() - i), _ = n.getProjection().fromLatLngToDivPixel(s.latLng), a && (n.crossDiv_.style.left = _.x + "px", n.crossDiv_.style.top = _.y + "px", n.crossDiv_.style.display = "", _.y -= p), n.marker_.setPosition(n.getProjection().fromDivPixelToLatLng(_)), a && (n.eventDiv_.style.top = _.y + p + "px"), google.maps.event.trigger(n.marker_, "drag", s)) : (t = s.latLng.lat() - n.marker_.getPosition().lat(), i = s.latLng.lng() - n.marker_.getPosition().lng(), e = n.marker_.getZIndex(), r = n.marker_.getPosition(), o = n.marker_.getMap().getCenter(), a = n.marker_.get("raiseOnDrag"), g = !0, n.marker_.setZIndex(1e6), s.latLng = n.marker_.getPosition(), google.maps.event.trigger(n.marker_, "dragstart", s))) }), google.maps.event.addDomListener(document, "keydown", function (e) { g && 27 === e.keyCode && (a = !1, n.marker_.setPosition(r), n.marker_.getMap().setCenter(o), google.maps.event.trigger(document, "mouseup", e)) }), google.maps.event.addDomListener(this.eventDiv_, "click", function (e) { (n.marker_.getDraggable() || n.marker_.getClickable()) && (s ? s = !1 : (google.maps.event.trigger(n.marker_, "click", e), h(e))) }), google.maps.event.addDomListener(this.eventDiv_, "dblclick", function (e) { (n.marker_.getDraggable() || n.marker_.getClickable()) && (google.maps.event.trigger(n.marker_, "dblclick", e), h(e)) }), google.maps.event.addListener(this.marker_, "dragstart", function () { g || (a = this.get("raiseOnDrag")) }), google.maps.event.addListener(this.marker_, "drag", function () { g || a && (n.setPosition(p), n.labelDiv_.style.zIndex = 1e6 + (this.get("labelInBackground") ? -1 : 1)) }), google.maps.event.addListener(this.marker_, "dragend", function () { g || a && n.setPosition(0) }), google.maps.event.addListener(this.marker_, "position_changed", function () { n.setPosition() }), google.maps.event.addListener(this.marker_, "zindex_changed", function () { n.setZIndex() }), google.maps.event.addListener(this.marker_, "visible_changed", function () { n.setVisible() }), google.maps.event.addListener(this.marker_, "labelvisible_changed", function () { n.setVisible() }), google.maps.event.addListener(this.marker_, "title_changed", function () { n.setTitle() }), google.maps.event.addListener(this.marker_, "labelcontent_changed", function () { n.setContent() }), google.maps.event.addListener(this.marker_, "labelanchor_changed", function () { n.setAnchor() }), google.maps.event.addListener(this.marker_, "labelclass_changed", function () { n.setStyles() }), google.maps.event.addListener(this.marker_, "labelstyle_changed", function () { n.setStyles() })] }, MarkerLabel_.prototype.onRemove = function () { var e; for (this.labelDiv_.parentNode.removeChild(this.labelDiv_), this.eventDiv_.parentNode.removeChild(this.eventDiv_), e = 0; e < this.listeners_.length; e++) google.maps.event.removeListener(this.listeners_[e]) }, MarkerLabel_.prototype.draw = function () { this.setContent(), this.setTitle(), this.setStyles() }, MarkerLabel_.prototype.setContent = function () { var e = this.marker_.get("labelContent"); "undefined" == typeof e.nodeType ? (this.labelDiv_.innerHTML = e, this.eventDiv_.innerHTML = this.labelDiv_.innerHTML) : (this.labelDiv_.innerHTML = "", this.labelDiv_.appendChild(e), e = e.cloneNode(!0), this.eventDiv_.appendChild(e)) }, MarkerLabel_.prototype.setTitle = function () { this.eventDiv_.title = this.marker_.getTitle() || "" }, MarkerLabel_.prototype.setStyles = function () { var e, t; this.labelDiv_.className = this.marker_.get("labelClass"), this.eventDiv_.className = this.labelDiv_.className, this.labelDiv_.style.cssText = "", this.eventDiv_.style.cssText = "", t = this.marker_.get("labelStyle"); for (e in t) t.hasOwnProperty(e) && (this.labelDiv_.style[e] = t[e], this.eventDiv_.style[e] = t[e]); this.setMandatoryStyles() }, MarkerLabel_.prototype.setMandatoryStyles = function () { this.labelDiv_.style.position = "absolute", this.labelDiv_.style.overflow = "hidden", "undefined" != typeof this.labelDiv_.style.opacity && "" !== this.labelDiv_.style.opacity && (this.labelDiv_.style.MsFilter = '"progid:DXImageTransform.Microsoft.Alpha(opacity=' + 100 * this.labelDiv_.style.opacity + ')"', this.labelDiv_.style.filter = "alpha(opacity=" + 100 * this.labelDiv_.style.opacity + ")"), this.eventDiv_.style.position = this.labelDiv_.style.position, this.eventDiv_.style.overflow = this.labelDiv_.style.overflow, this.eventDiv_.style.opacity = .01, this.eventDiv_.style.MsFilter = '"progid:DXImageTransform.Microsoft.Alpha(opacity=1)"', this.eventDiv_.style.filter = "alpha(opacity=1)", this.setAnchor(), this.setPosition(), this.setVisible() }, MarkerLabel_.prototype.setAnchor = function () { var e = this.marker_.get("labelAnchor"); this.labelDiv_.style.marginLeft = -e.x + "px", this.labelDiv_.style.marginTop = -e.y + "px", this.eventDiv_.style.marginLeft = -e.x + "px", this.eventDiv_.style.marginTop = -e.y + "px" }, MarkerLabel_.prototype.setPosition = function (e) { var t = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition()); "undefined" == typeof e && (e = 0), this.labelDiv_.style.left = Math.round(t.x) + "px", this.labelDiv_.style.top = Math.round(t.y - e) + "px", this.eventDiv_.style.left = this.labelDiv_.style.left, this.eventDiv_.style.top = this.labelDiv_.style.top, this.setZIndex() }, MarkerLabel_.prototype.setZIndex = function () { var e = this.marker_.get("labelInBackground") ? -1 : 1; "undefined" == typeof this.marker_.getZIndex() ? (this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + e, this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex) : (this.labelDiv_.style.zIndex = this.marker_.getZIndex() + e, this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex) }, MarkerLabel_.prototype.setVisible = function () { this.labelDiv_.style.display = this.marker_.get("labelVisible") && this.marker_.getVisible() ? "block" : "none", this.eventDiv_.style.display = this.labelDiv_.style.display }, inherits(MarkerWithLabel, google.maps.Marker), MarkerWithLabel.prototype.setMap = function (e) { google.maps.Marker.prototype.setMap.apply(this, arguments), this.label.setMap(e) };

/**
* Copyright (c) 2009 Sergiy Kovalchuk (serg472@gmail.com)
* 
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*  
* Following code is based on Element.mask() implementation from ExtJS framework (http://extjs.com/)
*
*/
(function (a) { a.fn.mask = function (c, b) { a(this).each(function () { if (b !== undefined && b > 0) { var d = a(this); d.data("_mask_timeout", setTimeout(function () { a.maskElement(d, c) }, b)) } else { a.maskElement(a(this), c) } }) }; a.fn.unmask = function () { a(this).each(function () { a.unmaskElement(a(this)) }) }; a.fn.isMasked = function () { return this.hasClass("masked") }; a.maskElement = function (d, c) { if (d.data("_mask_timeout") !== undefined) { clearTimeout(d.data("_mask_timeout")); d.removeData("_mask_timeout") } if (d.isMasked()) { a.unmaskElement(d) } if (d.css("position") == "static") { d.addClass("masked-relative") } d.addClass("masked"); var e = a('<div class="loadmask"></div>'); if (navigator.userAgent.toLowerCase().indexOf("msie") > -1) { e.height(d.height() + parseInt(d.css("padding-top")) + parseInt(d.css("padding-bottom"))); e.width(d.width() + parseInt(d.css("padding-left")) + parseInt(d.css("padding-right"))) } if (navigator.userAgent.toLowerCase().indexOf("msie 6") > -1) { d.find("select").addClass("masked-hidden") } d.append(e); if (c !== undefined) { var b = a('<div class="loadmask-msg" style="display:none;"></div>'); b.append("<div>" + c + "</div>"); d.append(b); b.css("top", Math.round(d.height() / 2 - (b.height() - parseInt(b.css("padding-top")) - parseInt(b.css("padding-bottom"))) / 2) + "px"); b.css("left", Math.round(d.width() / 2 - (b.width() - parseInt(b.css("padding-left")) - parseInt(b.css("padding-right"))) / 2) + "px"); b.show() } }; a.unmaskElement = function (b) { if (b.data("_mask_timeout") !== undefined) { clearTimeout(b.data("_mask_timeout")); b.removeData("_mask_timeout") } b.find(".loadmask-msg,.loadmask").remove(); b.removeClass("masked"); b.removeClass("masked-relative"); b.find("select").removeClass("masked-hidden") } })(jQuery);
/**End Copyright (c) 2009 Sergiy Kovalchuk (serg472@gmail.com)**/