{
	$name: 'JSB.DataCube.MapWidget',
	$parent: 'JSB.Widgets.Widget',
	$require: [],
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('map.css');

			this.mapContainer = this.$('<div class="mapContainer"></div>');
			this.append(this.mapContainer);

			this.loadCss('leaflet/leaflet.css');
			// develop
			//JSB().loadScript(['thirdparty/topojson/topojson.js', 'thirdparty/leaflet/leaflet-src.js']);
			// production
			JSB().loadScript(['tpl/d3/d3.min.js', 'datacube/widgets/map/topojson/topojson.min.js', 'datacube/widgets/map/leaflet/leaflet.js'],
			    function(){
			        $this.fillData();
			        $this.loadGeo();
			    }
			);
		},

		//_aggrs: null,

		_aggrs: [
		    {
		        id: "Франция",
		        value: 10
		    }
		],

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
                    //me.browser.DOM.root.attr("pointerEvents",false);
                    this._zoomInit_ = this.getZoom();
                    $this.catMap_SVG.style("opacity",0.3);
                })
                .on("moveend",function(){
                    //me.browser.DOM.root.attr("pointerEvents",true);
                    $this.catMap_SVG.style("opacity", null);
                    if(this._zoomInit_ !== this.getZoom()) $this.updateCategories();
                })
                .on("zoom",function(){
                debugger;
                    $this.updateCategories();
                });

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

            this.aggrGroup = this.catMap_SVG.append("g").attr("class", "leaflet-zoom-hide aggrGroup");

            this._aggrs.forEach(function(_cat){
                _cat.geo = $this.countries.index_name[_cat.id].geo.geometry;
            });

            this.rebuildCategories();

            JSB().defer(function(){
                var height = $this.mapContainer.height();
                if($this.catMap_SVG) $this.catMap_SVG.style("height", height + "px");
                if($this.leafletAttrMap) $this.leafletAttrMap.invalidateSize();
                //$this.aggrGroup.style("height", height + "px");
            }, 1000)
        },
/*
        mapColorScale: function(){
            var values = this._aggrs.map(function(el){ return el.value; }),
                            boundMin = d3.min(values),
                            boundMax = d3.max(values);
            return d3.scaleLinear().range([0, 9]).domain([boundMin, boundMax]);
        },

        mapColorQuantize: function(){
            var colorScale = {
                converge: [
                  d3.rgb('#ffffd9'),
                  d3.rgb('#edf8b1'),
                  d3.rgb('#c7e9b4'),
                  d3.rgb('#7fcdbb'),
                  d3.rgb('#41b6c4'),
                  d3.rgb('#1d91c0'),
                  d3.rgb('#225ea8'),
                  d3.rgb('#253494'),
                  d3.rgb('#081d58')],
                diverge: [
                  d3.rgb('#8c510a'),
                  d3.rgb('#bf812d'),
                  d3.rgb('#dfc27d'),
                  d3.rgb('#f6e8c3'),
                  d3.rgb('#f5f5f5'),
                  d3.rgb('#c7eae5'),
                  d3.rgb('#80cdc1'),
                  d3.rgb('#35978f'),
                  d3.rgb('#01665e')]
            };

            return d3.scaleQuantize().domain([0,9]).range(colorScale.converge);
        },
*/
        rebuildCategories: function(){
            this.aggrGroup.selectAll("*").remove();

            // enter
            this.mapGlyphsPaths = this.aggrGroup.selectAll('g.mapGlyph').data(this._aggrs).enter().append("g").attr("class", "mapGlyph").append("path");
            this.mapGlyphsLabels = this.aggrGroup.selectAll('g.mapGlyph').append("text").attr("class", "mapGlyphLabel");

            // update
            this.mapGlyphsPaths.data(this._aggrs).attr("d", function(_cat){ return $this.geoPath(_cat.geo); });
            this.mapGlyphsLabels.data(this._aggrs).text(function(_cat){ return _cat.value; })
                .attr("transform", function(_cat){
                   var centroid = $this.geoPath.centroid(_cat.geo);
                   return "translate("+centroid[0]+","+centroid[1]+")";
                 });

            // exit
            this.aggrGroup.selectAll('g.mapGlyph').data(this._aggrs).exit().remove();

            this.mapGlyphsPaths
              .attr("fill", function(_cat){
                return "red";
              })
              .attr("stroke", function(_cat){
                return "red";
              });
        },

        updateCategories: function(){
            this.mapGlyphsPaths.data(this._aggrs).attr("d", function(_cat){ return $this.geoPath(_cat.geo); });
            this.mapGlyphsLabels.data(this._aggrs).text(function(_cat){ return _cat.value; })
                .attr("transform", function(_cat){
                   var centroid = $this.geoPath.centroid(_cat.geo);
                   return "translate("+centroid[0]+","+centroid[1]+")";
                 });
        }
	}
}