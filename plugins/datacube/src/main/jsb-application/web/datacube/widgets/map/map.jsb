{
	$name: 'DataCube.Widgets.MapWidget',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Карта мира',
		description: '',
		category: 'Карты',
		thumb: `data:image/png;base64,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
		jgsMcwsP3gAAAABJRU5ErkJggg==`
	},
	$scheme: {
        type: 'group',
        items: [
        {
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                name: 'Имя поля',
                type: 'item',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field'
            },
            {
                name: 'Количество',
                type: 'item',
                binding: 'field',
                itemType: 'number',
                itemValue: ''
            }
            ]
        },
        {
            type: 'item',
            key: 'autoSize',
            name: 'Автоматически считать количество',
            optional: true,
            editor: 'none'
        }
        ]
	},
	$client: {
		$require: ['Tipsy', 'JQuery.UI.Loader'],

		$constructor: function(opts){
			$base(opts);
			this.addClass('mapWidget');
			this.loadCss('map.css');
			this.loadCss('leaflet/leaflet.css');

			this.mapContainer = this.$('<div class="mapContainer"></div>');
			this.append(this.mapContainer);

			JSB().loadCss('tpl/font-awesome/css/font-awesome.min.css');
			JSB().loadScript(['tpl/d3/d3.min.js', 'datacube/widgets/map/topojson/topojson.min.js', 'datacube/widgets/map/leaflet/leaflet.js'],
			    function(){
			        $this.fillData();
			        $this.loadGeo();
			    }
			);
		},

		$lang: {
            ZoomIn: "Приблизить",
            ZoomOut: "Отдалить",
            ZoomToFit: "Масштаб по содержимому",
            Elements: "элементов"
		},

		/*
		* data structure
		[
        	{
        		id: "",
        		value: "",
        		geo: "",
        		path: {
        		    base: {
                        attrs: {

                        },
                        styles: {

                        }
        		    },
        		    selected: {
        		        ...
        		    },
        		    disabled:{
        		        ...
        		    }
        		},
        		label: {
        		    base: {
                        attrs: {

                        },
                        styles: {

                        }
        		    },
        		    selected: {
        		        ...
        		    },
        		    disabled:{
        		        ...
        		    }
                },
        	},
        	{...},
        	{...}
        ]
		*/

		// example
		_aggrs: [],

		_defaults: {
		    path: {
		        base: {
                    styles: {
                        fill: "rgb(199, 233, 180)",
                        stroke: "rgb(34, 94, 168)"
                    }
		        },
                selected: {
                    styles: {
                        "stroke-width": "2px",
                        stroke: "orangered",
                        fill: "rgb(255, 181, 153)"
                    }
                }
		    },
		    label: {
		        base: {
		            styles: {
                        color: "black",
                        fill: "black",
                        "font-weight": "500",
                        "text-shadow": "rgb(255, 255, 255) 0px 0px 1px, rgb(255, 255, 239) 0px 0px 1px, rgb(255, 255, 255) 0px 0px 1px, rgb(255, 255, 255) 0px 0px 1px, rgb(255, 255, 255) 0px 0px 8px",
                        "text-rendering": "geometricPrecision",
                        "text-anchor": "middle",
                        "alignment-baseline": "middle",
                        "paint-order": "stroke",
                        stroke: "white",
                        "stroke-width": "2px",
                        "stroke-linecap": "butt",
                        "stroke-linejoin": "miter",
                        "pointer-events": "none"
		            }
		        }
		    }
		},

        map: {
            // http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png
            // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            // http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
            // http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png
            // http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png
            // http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
            // http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg
            // http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png
            // http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png
            // http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png

            //tileTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            tileTemplate: 'http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png',
            wrapLongitude: -30,
            config: {
              maxBoundsViscosity: 1,
              boxZoom: false,
              touchZoom: false,
              doubleClickZoom: false,
              zoomControl: false,
              worldcopyjump: true
            },
            tileConfig: {
              attribution: '© <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'+
                ' &amp; <a href="http://cartodb.com/attributions" target="_blank">CartoDB</a>',
              subdomains: 'abcd',
              maxZoom: 19,
              //noWrap: true
            },
            flyConfig:{
              padding: [0,0],
              pan: {animate: true, duration: 1.2},
              zoom: {animate: true}
            },
            startPosition: {
                coordinates: [40.5, -280.5],
                zoom: 2
            }
        },

		countries: {
		    index_alpha: {},
            index_alpha3: {},
            index_num: {},
            index_name: {}
		},

        fillData: function(){
            $this.countries.data = `#include '../map/countries.json'`;

            $this.countries.data.forEach(function(s){
              $this.countries.index_alpha[s.alpha] = s;
              $this.countries.index_alpha3[s.alpha3] = s;
              $this.countries.index_num  [s.num  ] = s;
              $this.countries.index_name [s.name ] = s;
            });
        },

        loadGeo: function(){
            d3.request('../datacube/widgets/map/ru_world.topojson')
                .get(function (error, data) {
                    var topojsonData = JSON.parse(data.response);
                    topojson.feature(topojsonData, topojsonData.objects.countries)
                      .features.forEach(function(feature){
                        var country = $this.countries.index_alpha[feature.id];
                        if(country) country.geo = feature;
                      });
                    $this.initView();
                });
        },

        initView: function(){
            this.leafletAttrMap = L.map(this.mapContainer.get(0), this.map.config )
                .addLayer( new L.TileLayer( this.map.tileTemplate, this.map.tileConfig ) )
                .setView(L.latLng(this.map.startPosition.coordinates), this.map.startPosition.zoom)
                .on("viewreset",function(){
                    $this.updateCategories();
                })
                .on("movestart",function(){
                    this._zoomInit_ = this.getZoom();
                    $this.catMap_SVG.style("opacity",0.3);
                })
                .on("moveend",function(){
                    $this.catMap_SVG.style("opacity", null);
                    if(this._zoomInit_ !== this.getZoom()) $this.updateCategories();
                });
                /*
                .on("zoom",function(){
                debugger;
                    $this.updateCategories();
                });
                */
            this.geoPath = d3.geoPath().projection(
                d3.geoTransform({
                  // Use Leaflet to implement a D3 geometric transformation.
                    point: function(x, y) {
                        if(x > $this.map.wrapLongitude) x -= 360;
                        var point = $this.leafletAttrMap.latLngToLayerPoint(new L.LatLng(y, x));
                        this.stream.point(point.x, point.y);
                    }
                })
            );

            this.catMap_SVG = d3.select(this.leafletAttrMap.getPanes().overlayPane)
                .append("svg").attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("class", "catMap_SVG");

            // The fill pattern definition in SVG, used to denote geo-objects with no data.
            // http://stackoverflow.com/questions/17776641/fill-rect-with-pattern
            this.catMap_SVG.append('defs')
                .append('pattern')
                  .attr('id', 'diagonalHatch')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 4)
                  .attr('height', 4)
                  .append('path')
                    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
                    .attr('stroke', 'gray')
                    .attr('stroke-width', 1);

            // custom controls
            var X = d3.select(this.getElement().get(0)).append("div").attr("class", "mapControl");
            X.append("div")
                .attr("class","mapControlButton fa fa-plus")
                .attr("title", $this.$lang.ZoomIn)
                .on("click",function(){ $this.leafletAttrMap.zoomIn(); });
            X.append("div")
                .attr("class","mapControlButton fa fa-minus")
                .attr("title", $this.$lang.ZoomOut)
                .on("click",function(){ $this.leafletAttrMap.zoomOut(); });
            X.append("div")
                .attr("class","mapControlButton viewFit fa fa-arrows-alt")
                .attr("title", $this.$lang.ZoomToFit)
                .on("dblclick",function(){
                  d3.event.preventDefault();
                  d3.event.stopPropagation();
                })
                .on("click",function(){
                  $this.zoomToActive();
                  d3.event.preventDefault();
                  d3.event.stopPropagation();
                });

            this.aggrGroup = this.catMap_SVG.append("g").attr("class", "leaflet-zoom-hide aggrGroup");

            this.isInit = true;

            // this.rebuildCategories();

            JSB().defer(function(){
                var height = $this.mapContainer.height();
                if($this.leafletAttrMap) $this.leafletAttrMap.invalidateSize();
            }, 1000);

            this.mapContainer.resize(function(){
            	if(!$this.mapContainer.is(':visible')){
            		return;
            	}

                JSB().defer(function(){
                    var height = $this.mapContainer.height();
                    if($this.leafletAttrMap) $this.leafletAttrMap.invalidateSize();
                }, 300, 'map.resize.' + $this.getId());
            })
        },

        refresh: function(){
            if(opts && this == opts.initiator) return;

            var context = this.getContext().find('source');
            if(!context.bound()) return;

			$base();

            this.getElement().loader();
            JSB().deferUntil(function(){
                var rows = $this.getContext().find('source').values();

                var autoSize = $this.getContext().find('autoSize').used();

                var flag = context.fetch({readAll: true}, function(){
                    $this.getElement().loader('hide');
                    var data = [];

                    while(context.next()){
                        var id = rows[0].get(0).value();
                        var w = rows[0].get(1).value();

                        var e = null;
                        for(var j = 0; j < data.length; j++){
                            if(data[j].id === id){
                                e = data[j];
                                break;
                            }
                        }

                        if(!e){
                            data.push({
                                id: rows[0].get(0).value(),
                                value: rows[0].get(1).value()
                            });

                            if(autoSize){
                                data[data.length - 1].value = 1;
                            }
                        } else {
                            if(autoSize){
                                e.value++;
                            }
                        }
                    }

                    $this._aggrs = data;

                    $this._aggrs.forEach(function(_cat){
                        if($this.countries.index_name[_cat.id])
                            _cat.geo = $this.countries.index_name[_cat.id].geo.geometry;
                    });

                    $this.rebuildCategories();
                });

                if(!flag) $this.getElement().loader('hide');
            }, function(){
                return $this.isInit && $this.getElement().is(':visible');
            });
        },

        rebuildCategories: function(){
            this.aggrGroup.selectAll("*").remove();

            // enter
            this.mapGlyphsPaths = this.aggrGroup.selectAll('g.mapGlyph').data(this._aggrs).enter().append("g").attr("class", "mapGlyph").append("path");
            this.mapGlyphsLabels = this.aggrGroup.selectAll('g.mapGlyph').append("text").attr("class", "mapGlyphLabel");

            // update
            this.mapGlyphsPaths.nodes().forEach(function(item, i, arr){
                if(!$this._aggrs[i].geo) return;

                item = d3.select(item);

                item.attr("mapId", $this._aggrs[i].id);

                item.attr("d", $this.geoPath($this._aggrs[i].geo));

                var opts = JSB().merge($this._defaults.path.base, typeof $this._aggrs[i].path !== 'undefined' ? $this._aggrs[i].path.base : null);
                $this.fillStyle(item, opts);

                arr[i].tipsy = new Tipsy(arr[i], {
                  gravity: 'e',
                  className: 'recordTip',
                  title: function(){
                    var str="";
                    str += "<span class='mapItemName'>" + $this._aggrs[i].id + "</span>";
                    str += "<span style='font-weight: 300'>";
                    str += $this._aggrs[i].value + " " + $this.$lang.Elements;
                    str += "</span>";
                    return str;
                  },
                  rootElement: $this.mapContainer.get(0)
                });

                // highlight
                /*
                item.on("mouseenter", function(_cat){
                        if(this.tipsy) {
                            this.tipsy.show();
                            var left = (d3.event.pageX - this.tipsy.tipWidth - 10);
                            var top  = (d3.event.pageY - this.tipsy.tipHeight / 2);

                            var rootPos = $this.mapContainer.get(0).getBoundingClientRect();
                            left = left - rootPos.left;
                            top = top - rootPos.top;

                            this.tipsy.jq_tip.node().style.left = left + "px";
                            this.tipsy.jq_tip.node().style.top = top + "px";
                        }
                        var opts = JSB().merge($this._defaults.path.selected, typeof $this._aggrs[i].path !== 'undefined' ? $this._aggrs[i].path.selected : null);
                        $this.fillStyle(item, opts);
                        $this.onCatEnter(_cat);
                    })
                    .on("mousemove", function(){
                        if(this.tipsy) {
                            var rootPos = $this.mapContainer.get(0).getBoundingClientRect();
                            var left = (d3.event.pageX - rootPos.left - this.tipsy.tipWidth - 10);
                            var top = (d3.event.pageY - rootPos.top - this.tipsy.tipHeight / 2);

                            this.tipsy.jq_tip.node().style.left = left + "px";
                            this.tipsy.jq_tip.node().style.top = top + "px";
                        }
                    })
                    .on("mouseleave",function(_cat){
                        if(this.tipsy) this.tipsy.hide();
                        var opts = JSB().merge($this._defaults.path.base, typeof $this._aggrs[i].path !== 'undefined' ? $this._aggrs[i].path.base : null);
                        $this.fillStyle(item, opts);
                        $this.onCatLeave(_cat);
                    });
                */
                // cat click
                item.on("click", function(_cat){
                        $this.onCatClick(this, _cat);
                    });
            });

            this.mapGlyphsLabels.nodes().forEach(function(item, i, arr){
                if(!$this._aggrs[i].geo) return;

                item = d3.select(item);

                item.attr("mapId", $this._aggrs[i].id);

                item.text($this._aggrs[i].value);

                item.attr("transform", function(){
                   var centroid = $this.geoPath.centroid($this._aggrs[i].geo);
                   return "translate(" + centroid[0] + "," + centroid[1] + ")";
                });

                var opts = JSB().merge($this._defaults.label.base, typeof $this._aggrs[i].label !== 'undefined' ? $this._aggrs[i].label.base : null);
                $this.fillStyle(item, opts);

                // highlight
                /*
                item.on("mouseenter", function(){
                        var opts = JSB().merge($this._defaults.label.selected, typeof $this._aggrs[i].label !== 'undefined' ? $this._aggrs[i].label.selected : null);
                        $this.fillStyle(item, opts);
                    })
                    .on("mouseleave",function(_cat){
                        var opts = JSB().merge($this._defaults.label.base, typeof $this._aggrs[i].label !== 'undefined' ? $this._aggrs[i].label.base : null);
                        $this.fillStyle(item, opts);
                    });
                */
            });

            // exit
            this.aggrGroup.selectAll('g.mapGlyph').data(this._aggrs).exit().remove();
        },

        fillStyle: function(item, opts){
            if(!item || !opts) return;

            for(var j in opts.attrs){
                item.attr(j, opts.attrs[j]);
            }

            for(var j in opts.styles){
                item.style(j, opts.styles[j]);
            }
        },

        setNewAttrs: function(attrs){
            for(var i in attrs){
                if(attr[i].path){
                    var obj = d3.select("path[mapId=" + attrs[i].id + "]");

                    var opts = JSB().merge($this._defaults.path.base, typeof attr[i].path !== 'undefined' ? attr[i].path.base : null);
                    $this.fillStyle(item, opts);
                }
                if(attr[i].label){
                    var obj = d3.select("text[mapId=" + attrs[i].id + "]");

                    var opts = JSB().merge($this._defaults.label.base, typeof attr[i].label !== 'undefined' ? attr[i].label.base : null);
                    $this.fillStyle(item, opts);
                }
            }
        },

        updateCategories: function(){
            if(!this.mapGlyphsPaths) return;

            this.mapGlyphsPaths.data(this._aggrs).attr("d", function(_cat){ return $this.geoPath(_cat.geo); });
            this.mapGlyphsLabels.data(this._aggrs)
                .attr("transform", function(_cat){
                    var centroid = $this.geoPath.centroid(_cat.geo);
                    return "translate("+centroid[0]+","+centroid[1]+")";
                })
                .style("display", function(aggr, i, item){
                    var bounds = $this.geoPath.bounds(aggr.geo);
                    var pathWidth = Math.abs(bounds[0][0] - bounds[1][0]);
                    var textWidth = item[0].getBoundingClientRect().width  * 2;
                    return pathWidth < textWidth ? "none" : "block";
                });
        },

        zoomToActive: function(){
            var bs = [];

            this._aggrs.forEach(function(_cat){
                if(typeof _cat.geo === 'undefined') return;
                var b = d3.geoBounds(_cat.geo);
                if(isNaN(b[0][0])) return;
                // Change wrapping
                if(b[0][0] > $this.map.wrapLongitude) b[0][0] -= 360;
                if(b[1][0] > $this.map.wrapLongitude) b[1][0] -= 360;
                bs.push(L.latLng(b[0][1], b[0][0]));
                bs.push(L.latLng(b[1][1], b[1][0]));
            });

            this.leafletAttrMap.flyToBounds(new L.latLngBounds(bs), this.map.flyConfig);
        },

        // callbacks
        onCatClick: function(item, _cat){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            if(this._selectedCat === _cat){
                // remove old filter
                this._selectedCat = null;
                if(this._currentFilter){
                	this.removeFilter(this._currentFilter);
                }

                this.fillStyle(d3.select(item), $this._defaults.path.base);
            } else {
                // add new filter
                this.fillStyle(d3.select(item), $this._defaults.path.selected);

                var field = this.getContext().find('source').value().get(0).binding();

                var fDesc = {
                	sourceId: context.source,
                	type: '$and',
                	op: '$eq',
                	field: field,
                	value: _cat.id
                };
                if(!this.hasFilter(fDesc)){
                	if(this._currentFilter){
                		this.removeFilter(this._currentFilter);
                	}
                	this._currentFilter = this.addFilter(fDesc);
                	this.refreshAll();
                }
                this._selectedCat = _cat;
            }
        },
        onCatEnter: function(_cat){
        },
        onCatLeave: function(_cat){
        },
	}
}