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
			        $this.initView();
			    }
			);
		},

		//_aggrs: null,

		_aggrs: [
		    {
		        id: "Франция",
		        records: ["1"]
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
            index_name: {},
            loadGeo: function(){
                d3.request('../widgets/sharedData/ru_world.topojson')
                    .get(function (error, data) {
                        var topojsonData = JSON.parse(data.response);
                        topojson.feature(topojsonData, topojsonData.objects.countries)
                          .features.forEach(function(feature){
                            var country = $this.countries.index_alpha[feature.id];
                            if(country) country.geo = feature;
                          });
                    });
            },
            fillData: function(){
                this.countries.data.forEach(function(s){
                  $this.countries.index_alpha[s.alpha] = s;
                  $this.countries.index_alpha3[s.alpha3] = s;
                  $this.countries.index_num  [s.num  ] = s;
                  $this.countries.index_name [s.name ] = s;
                });
            }
		},

        initView: function(){
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

            this.leafletAttrMap = L.map(this.mapContainer.get(0), this.map.config )
                .addLayer( new L.TileLayer( this.map.tileTemplate, this.map.tileConfig ) )
                .setView(L.latLng(this.map.startPosition.coordinates), this.map.startPosition.zoom)
                .on("viewreset",function(){
                    //me.map_projectCategories()
                })
                .on("movestart",function(){
                    //me.browser.DOM.root.attr("pointerEvents",false);
                    this._zoomInit_ = this.getZoom();
                    //$this.catMap_SVG.style("opacity",0.3);
                })
                .on("moveend",function(){
                    //me.browser.DOM.root.attr("pointerEvents",true);
                    //$this.DOM.catMap_SVG.style("opacity", null);
                    //if(this._zoomInit_ !== this.getZoom()) me.map_projectCategories();
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

            this.mapColorQuantize = d3.scaleQuantize()
                .domain([0,9])
                .range(colorScale.converge);

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

            // custom map controls
            /*
            var X = this.DOM.summaryCategorical.append("div").attr("class","visViewControl");

            X.append("div")
            .attr("class","visViewControlButton fa fa-plus")
            .attr("title", kshf.lang.cur.ZoomIn)
            .on("click",function(){ me.leafletAttrMap.zoomIn(); });
            X.append("div")
            .attr("class","visViewControlButton fa fa-minus")
            .attr("title", kshf.lang.cur.ZoomOut)
            .on("click",function(){ me.leafletAttrMap.zoomOut(); });
            X.append("div")
            .attr("class","visViewControlButton viewFit fa fa-arrows-alt")
            .attr("title", kshf.lang.cur.ZoomToFit)
            .on("dblclick",function(){
              d3.event.preventDefault();
              d3.event.stopPropagation();
            })
            .on("click",function(){
              me.map_refreshBounds_Active();
              me.catMap_zoomToActive();
              d3.event.preventDefault();
              d3.event.stopPropagation();
            });
            */

            var height = this.mapContainer.height();
            if(this.catMap_SVG) this.catMap_SVG.style("height", height + "px");
            if(this.leafletAttrMap) this.leafletAttrMap.invalidateSize();
            //this.aggrGroup.style("height", height + "px");

            this.insertCategories();
        },

        insertCategories: function(){
            this.aggrGroup = this.catMap_SVG.append("g").attr("class", "leaflet-zoom-hide aggrGroup");

            var aggrGlyphSelection = this.aggrGroup.selectAll(".aggrGlyph")
                .data(this._aggrs, function(aggr){ return aggr.id; });

            var categories = aggrGlyphSelection.enter()
                .append('g')
                .attr("class", "aggrGlyph mapGlyph")
                //.attr("title", me.catTooltip ? function(_cat){ return me.catTooltip.call(_cat.data); } : null);
/*
            categories.each(function(_cat){
                this.tipsy = new Tipsy(this, {
                  gravity: 'e',
                  className: 'recordTip',
                  title: function(){
                    var str="";
                    str += "<span class='mapItemName'>"+me.catLabel_Func.call(_cat.data)+"</span>";
                    str += "<span style='font-weight: 300'>";
                    str += me.browser.getMeasureLabel(_cat)+" "+me.browser.getMeasureFuncTypeText_Brief();
                    if(me.browser.measureFunc!=="Count"){
                      str+="<br>in "+(_cat.recCnt.Active)+" "+me.browser.recordName;
                    }
                    str += "</span>";
                    return str;
                  }
                });
              })
              .on("mouseenter",function(_cat){
                if(this.tipsy) {
                  this.tipsy.show();
                  var left = (d3.event.pageX-this.tipsy.tipWidth-10);
                  var top  = (d3.event.pageY-this.tipsy.tipHeight/2);

                  var browserPos = kshf.browser.DOM.root.node().getBoundingClientRect();
                  left = left - browserPos.left;
                  top = top - browserPos.top;

                  this.tipsy.jq_tip.node().style.left = left+"px";
                  this.tipsy.jq_tip.node().style.top = top+"px";
                }
                if(me.browser.mouseSpeed<0.2) {
                  me.onAggrHighlight(_cat);
                } else {
                  this.highlightTimeout = window.setTimeout( function(){ me.onAggrHighlight(_cat) }, me.browser.mouseSpeed*500);
                }
              })
              .on("mousemove", function(){
                var browserPos = kshf.browser.DOM.root.node().getBoundingClientRect();
                var left = (d3.event.pageX - browserPos.left - this.tipsy.tipWidth-10); // left - browserPos.left;
                var top = (d3.event.pageY - browserPos.top -this.tipsy.tipHeight/2); // top - browserPos.top;

                this.tipsy.jq_tip.node().style.left = left+"px";
                this.tipsy.jq_tip.node().style.top = top+"px";
              })
              .on("mouseleave",function(_cat){
                if(this.tipsy) this.tipsy.hide();
                if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
                me.onAggrLeave(_cat);
              });
*/
            categories.append("path").attr("class", "measure_Active")
                .on("click", function(aggr){ /*me.onCatClick(aggr); */});
            categories.append("text").attr("class", "measureLabel");

            debugger;
        }
	}
}