{
	$name: 'DataCube.Query.RenderRepository',
	$singleton: true,
	$sync: {
		updateCheckInterval: 0
	},

	_rendererMap: {},

	$client: {
		$constructor: function(){
		    $base();
			this.doSync();

			this.ensureSynchronized(function(){
				var jsbArr = [];

				for(var eType in $this._rendererMap){
					jsbArr.push($this._rendererMap[eType]);
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

		createRenderFor: function(renderName, opts){
			if(!this.matchTrigger('ready')){
				throw new Error('RendererRepository has not been initialized yet');
			}

			var rName = this.rendererMap[renderName];

			// todo: use basic render?
            /*
			if(!rName){
				var bestNt = null;
				var bestDist = null;
				for(nt in this.rendererMap){
					var dist = obj.getJsb().getSubclassOfDistance(nt);
					if(!JSB.isNull(dist)){
						if(JSB.isNull(bestDist) || bestDist > dist){
							bestDist = dist;
							bestNt = nt;
						}
					}
				}
				if(bestNt){
					rName = this.rendererMap[obj.getJsb().$name] = this.rendererMap[bestNt];
				}
			}
			*/
			if(!rName || !JSB.get(rName)){
				return null;
			}

			var RendererClass = JSB.get(rName).getClass();
			return new RendererClass(opts);
		}
	},

	$server: {
		registerRender: function(rendererType, renderName){
			var rendererJsb = null;

			if(JSB.isString(rendererType)){
				rendererJsb = JSB.get(rendererType);
				if(!rendererJsb){
					throw new Error('Unable to find renderer bean: ' + rendererType);
				}
			} else if(rendererType instanceof JSB){
				rendererJsb = rendererType;
			} else if(JSB.isBean(rendererType)){
				rendererJsb = rendererType.getJsb();
			}

			this._rendererMap[renderName] = rendererJsb.$name;
		}
	}
}