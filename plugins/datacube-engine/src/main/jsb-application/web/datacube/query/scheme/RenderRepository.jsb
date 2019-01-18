{
	$name: 'DataCube.Query.RenderRepository',
	$singleton: true,
	$sync: {
		updateCheckInterval: 0
	},

	_rendersMap: {},

	$client: {
		$constructor: function(){
		    $base();
			this.doSync();

			this.ensureSynchronized(function(){
				var jsbArr = [];

				for(var eType in $this._rendersMap){
					jsbArr.push($this._rendersMap[eType]);
				}

				JSB.chain(jsbArr, function(jsbName, c){
					JSB.lookup(jsbName, function(){
						c.call($this);
					});
				}, function(){
					$this.setTrigger('ready');
				});
			});
		},

		ensureReady: function(callback){
			this.ensureTrigger('ready', callback);
		},

		createRender: function(opts){
			if(!this.matchTrigger('ready')){
				throw new Error('RendererRepository has not been initialized yet');
			}

			var rName = this._rendersMap[opts.desc.scheme.render];

			if(!rName || !JSB.get(rName)){
				return null;
			}

			var RendererClass = JSB.get(rName).getClass();
			return new RendererClass(opts);
		}
	},

	$server: {
	    $constructor: function(opts){
	        $base();

			JSB.onLoad(function(){
				if(this.isSubclassOf('DataCube.Query.Renders.Basic') && JSB.isDefined(this.$alias)){
				    $this._rendersMap[this.$alias] = this.$name;
				}
			});
	    }
	}
}