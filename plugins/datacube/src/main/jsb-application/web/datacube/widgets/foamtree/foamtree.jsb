{
	$name: 'JSB.DataCube.Foamtree',
	$parent: 'JSB.Widgets.Widget',
	$require: [],
	$client: {
        $constructor: function(opts){
            $base(opts);
            this.foamtreeId = JSB().generateUid();

            this.foamtreeContainer = this.$('<div class="foamtreeWidget" id="' + this.foamtreeId + '"></div>')

            JSB().loadScript(['datacube/widgets/foamtree/foamtree.js'],
                function(){
                    $this.init();
                }
            );

            /*
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
            */
        },

        init: function(){
            this.foamtree = new CarrotSearchFoamTree({
                id: this.foamtreeId,
                dataObject: {
                    groups: this.data.groups
                }
            });
        }
	}
}