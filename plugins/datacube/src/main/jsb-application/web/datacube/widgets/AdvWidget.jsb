{
	$name: 'DataCube.Widgets.AdvancedWidget',
	$parent: 'DataCube.Widgets.Widget',
	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        // create style cache object
	        var Cache = function(){
	            this._cache = {};

	            function findInObject(){
	                //
	            }

	            this.prototype.set = function(opts){
	                this._cache = opts;
	            }

	            this.prototype.get = function(){
	                return this._cache;
                }

                this.prototype.clear = function(){
                    this._cache = {};
                }
	        }

	        this.selectorsCache = new Cache();
	        this.dataCache = new Cache();
	    },
	    refresh: function(opts){
	        $base();

            // if filter source is current widget
            if(opts && this == opts.initiator && !opts.filterData){
                return false;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                var cache = this.dataCache.get();
                if(cache){
                    this.buildChart(cache);
                    return false;
                }
            }

            if(!this._dataSource){
                var dataSource = this.getContext().find('source');

                if(!dataSource.hasBinding()){
                    return false;
                }

                this._dataSource = dataSource;
            }
	    }
	}
}