$(function () {

    //Filter Dropdown "component"
    //handleUpdate: callback function(id, name)
    var FilterDropdown = function (handleUpdate) {
        var self = this;
        self.ddl = $("#navFilterDdl");
        self.$label = $("#navFilterDdl .navFilterDdlLabel");
        self.ddl.find(".dropdown-item").click(function (e, ix) {
            $filterOption = $(e.target);
            //Update lable with new year-name
            var name = $filterOption.data("name");
            self.$label.html(name);
            //Fire callback handler
            if (handleUpdate) {
                var id = $filterOption.data("id");
                handleUpdate(id, name);
            }
        });
    };

    //Legend component
    var Legend = function () {
        var self = this;
        self.state = {
            show: true
        };
        self.btn = $("#legend .slideLegendButton");
        self.panel = $("#legend .legend-panel");

        //Handle button click. Toggle panel visibility
        self.btn.click(function (e) {
            self.state.show = !self.state.show;
            self.render();
        });

        //Re-render component
        self.render = function () {
            self.panel.toggle(self.state.show);
        };

        self.render();
    };

    var ZOOM_LEVEL_PROVIDER = 12; //Zoom-level for selected provider zoom
    var ProviderSelector = function (mapMarkers, handleChange) {
        var self = this;

        var options = _.map(mapMarkers, function (m) {
            return {
                value: m.Id,
                text: m.Id + " - " + m.Name
            };
        });

        //Provider Search component
        self.selectize = $('#search-prov-ddl').selectize({
            create: true,
            options: options,
            sortField: 'text',
            onChange: function (value) {
                if (handleChange) {
                    handleChange(value);
                }
            }
        });

    };

    //InfoxBox component
    var InfoBox = function (mapId, markerId, filterId) {
        var self = this;
        self.state = {
            show: true,
            infoBox: null
        };
        self.$info = $("#info");

        $.post("/Home/GetInfoBox", {
            mapId: mapId,
            markerId: markerId,
            filterId: filterId
        }).then(function (res) {
            self.state.infoBox = res;
            self.state.show = true;
            self.render();
        });

        self.render = function () {
            self.$info.toggle(self.state.show);
            var html = renderTabs(self.state.infoBox.tabs);
            self.$info.html(html);
            //Bind click event to charts
            self.$info.find(".info-box-chart").click(
                function (e) {
                    e.preventDefault();
                    var attributeId = $(e.currentTarget).data("attr");
                    new ChartModal(mapId, markerId, attributeId);
                }.bind(this)
            );
        };

        //Renders section stateless components
        function renderTabs(tabs) {
            var html = _.reduce(
                tabs,
                function (result, tab) {
                    return (
                        result +
                        '<div class="card mb-0 rounded-0"><div class="card-header font-weight-bold rounded-0 px-2 py-2">'
                        + tab.name
                        + '</div><table class="table table-bordered table-sm mb-0"><tbody>'
                        + _.map(tab.attributes, function (attr) {
                            return renderAttribute(attr);
                        }).join("")
                        + '</tbody></table></div>'
                    );
                },
                ""
            );
            return html;
        }

        //Renders section.attribute stateless components
        function renderAttribute(attr) {
            var html = '<tr><td><' + (attr.desc ? "abbr" : "span") + ' title="'+ attr.desc + '">'
                + attr.name
                + '</' + (attr.desc ? "abbr" : "span") + '></td>'
                + '<td>' + attr.displayVal + '</td>'
                + '<td class="text-center"><span class="' + (attr.hasChart ? "" : "d-none") + '">'
                + '<a class="info-box-chart" href="#" title="View trend" data-attr="' + attr.id
                + '"><i class="fas fa-chart-line"></i></a></span></td></tr>'
            ;
            return html;
        }
    };

    //Chart modal component
    var ChartModal = function (mapId, markerId, attributeId) {
        var self = this;
        self.state = {
            show: true,
            chart: null
        };
        self.$modal = $("#chart-modal");
        self.$spinner = $("#chart-modal .chart-modal-spinner");
        self.$chartPanel = $("#chart-modal .chart-modal-chart");

        $.post("/Home/GetChart", {
            mapId: mapId,
            markerId: markerId,
            attributeId: attributeId
        }).then(function (res) {
            self.state.chart = res;
            self.state.show = true;
            self.render();
        });

        self.render = function () {
            var hasChart = self.state.chart !== null;
            self.$modal.modal(self.state.show ? "show" : "hide");
            self.$spinner.toggle(!hasChart);
            self.$chartPanel.toggle(hasChart);
            if (hasChart) {
                Highcharts.chart("chart-modal-chart", self.state.chart);
            }
        };

        self.render();
    };

    //Main App ////////////////////////////////////////////////////////////////
    //Merge pageConfig settings with defaults
    var toolConfig = DAG.Config;

    var _defaultParams = {
        MapConfigs: {
            DefaultStrokeOpacity: 0.5,
            DefaultFillOpacity: 0.8,
            DefaultBorderColor: "#e4e4e4",
            DefaultStrokeWeight: 1,
            DefaultStrokeColor: "#FF0000",
            DefaultFillColor: "#a0a0a0",
            HoverStrokeWeight: 3
        },
        mapOptions: {
            center: new google.maps.LatLng(40.647304, -98.613281),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            backgroundColor: "e4e4e4",
            keyboardShortcuts: false,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            navigationControl: true,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            styles: [
                {
                    featureType: "road.highway",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#efefef" }]
                },
                {
                    featureType: "landscape",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "transit",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "poi",
                    elementType: "geometry.fill",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#cfcfcf" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#aaaaaa" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#efefef" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#cfcfcf" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#aaaaaa" }]
                },
                {
                    featureType: "road.local",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#efefef" }]
                },
                {
                    featureType: "road.local",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#cfcfcf" }]
                },
                {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#aaaaaa" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#EBF4FA" }]
                },
                {
                    featureType: "administrative",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#aaaaaa" }]
                },
                {
                    featureType: "transit",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#aaaaaa" }]
                },
                {
                    featureType: "transit.line",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#E1E2E3" }]
                },
                {
                    featureType: "transit.line",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#E1E2E3" }]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry.fill",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "landscape.man_made",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "administrative.province",
                    stylers: [
                        {
                            visibility: "on"
                        },
                        {
                            gamma: 0.27
                        }
                    ]
                }
            ]
        },
        googleMapPolygons: [],
        mapInitialized: false,
        bounds: null,
        ghostMarker: null,
        centerMapOnClick: true,
        MAP_JSON: null
    };

    var getMarkers = function () {
        //Get Markers
        $.post("/Home/GetMarkers", {
            mapId: DAG.Config.mapId,
            //mainAttributeId: mainAttributeId,
            selectedFilter: state.selectedFilter,
            filterId: state.filterId,
            has_json_data: DAG.Config.has_json_data
        }).then(function (res) {
            var mapMarkers = res;
            renderMap(mapMarkers);
            state.providerSelector = new ProviderSelector(mapMarkers, handleProviderSelect);
        });
    };

    //Render map with given set of Markers
    var renderMap = function (mapMarkers) {
        var self = this;
        state.map = new google.maps.Map(
            document.getElementById("map_canvas"),
            _defaultParams.mapOptions
        );
        var bounds = new google.maps.LatLngBounds();
        var gmarkers = state.markers = [];
        _.forEach(mapMarkers, function (marker, ix) {
            //Set Marker icon URL based on where value falls within legend ranges
            _.forEach(toolConfig.legend.ranges, function (range) {
                var lowerLimit = range.lowerLimit;
                var upperLimit = range.upperLimit;
                var value;
                if (
                    marker.Value === null ||
                    marker.Value === "" ||
                    marker.Value == "Not Available"
                ) {
                    value = null;
                } else {
                    value = _.toNumber(marker.Value);
                }
                //Set icon if exact match
                if (value === lowerLimit && value === upperLimit) {
                    marker.icon = range.iconUrl;
                }
                //Else set icon if within range
                else if (value >= lowerLimit && value < upperLimit) {
                    marker.icon = range.iconUrl;
                }
            });
            //Add as google maps Marker class
            var latlng = new google.maps.LatLng(marker.Lat, marker.Lng);
            bounds.extend(latlng);
            var gMarker = new google.maps.Marker({
                position: latlng,
                map: state.map,
                icon: marker.icon,
                id: marker.Id,
                indexId: ix,
                provId: marker.Id
            });
            gmarkers.push(gMarker);

            //Add marker click handler
            google.maps.event.addListener(
                gMarker,
                "click",
                handleMarkerClick.bind(self, gMarker)
            );
        });
        //Add clustering if applicable
        if (toolConfig.showMapClustering) {
            var mcOptions = {
                gridSize: 50,
                maxZoom: 11,
                minimumClusterSize: 20,
                styles: [
                    {
                        height: 46,
                        url: "/img/cluster.png",
                        width: 46,
                        textColor: "#ffffff"
                    }
                ]
            };
            markerCluster = new MarkerClusterer(state.map, gmarkers, mcOptions);
            markerCluster.addMarkers(gmarkers);
        }
    };

    //Handle Marker click event
    var handleMarkerClick = function (mk) {
        var lat = mk.getPosition().lat();
        var lng = mk.getPosition().lng();
        var newCenter = new google.maps.LatLng(lat, lng);
        state.map.setCenter(newCenter);
        state.map.panTo(newCenter);
        var infoBox = new InfoBox(toolConfig.mapId, mk.id, state.filterId);
        state.selMarker = mk;
    };

    //Handle Provider select event
    var handleProviderSelect = function (providerId) {
        //Find selected marker
        var marker = _.find(state.markers, function (m) {
            return m.id === providerId;
        });
        //Fire click event
        handleMarkerClick(marker);
        //Zoom in
        state.map.setZoom(ZOOM_LEVEL_PROVIDER);
    };

    //Handle filter change
    var handleFilterUpdate = function (filterId) {
        state.filterId = filterId;
        getMarkers();
        handleMarkerClick(state.selMarker); //re-render selected marker
    };

    //Set map canvas height
    var resizeMap = function () {
        var MIN_MAP_HEIGHT = 400;
        var MAP_HEIGHT_OFFSET = 125; //Amount to offset from window height
        var mapHeight = Math.max(
            MIN_MAP_HEIGHT,
            window.innerHeight - MAP_HEIGHT_OFFSET
        );
        $("#map_canvas").height(mapHeight);
        $("#Info").height(mapHeight - 10 + "px");
    };
    $(window).resize(function () {
        resizeMap();
    });

    //Main init logic
    //Internal app "Component" state
    var state = {
        map: null,
        markers: null,
        selMarker: null, //Selected marker
        filterId: toolConfig.defaultFilterId,
        filterDropdown: null
    };
    //Initialize navbar items
    $("#navDownloadData").click(function () {
        window.open("/static/Map/ExcelFiles/FY13-21_P4P_Summary_Impact_File.xlsx");
    });

    resizeMap();
    getMarkers();

    if (toolConfig.hasFilter) {
        state.filterDropdown = new FilterDropdown(handleFilterUpdate);
    }
    state.legend = new Legend();
    //state.providerSelector = new ProviderSelector([]);
});
