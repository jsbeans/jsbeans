{
	$name: 'Unimap.Repository',
	$singleton: true,
	$sync: {
		updateCheckInterval: 0
	},

	_rendersMap: {},
	_selectorsMap: {},

	createAllSelectors: function(opts){
        if(JSB.isClient() && !this.matchTrigger('_initialized')){
            throw new Error('Unimap repository has not been initialized yet');
        }

	    var selectors = {};

	    for(var i in this._selectorsMap){
	        var jsbClass = JSB.get(this._selectorsMap[i]).getClass();

	        selectors[i] = new jsbClass(opts);
	    }

	    return selectors;
	},

	createSelector: function(opts){
	    return this._create('selector', opts);
	},

	_create: function(type, opts){
        if(JSB.isClient() && !this.matchTrigger('_initialized')){
            throw new Error('Unimap repository has not been initialized yet');
        }

        var className;

        if(type === 'selector'){
            className = this._selectorsMap[opts.scheme.render];
        } else {
            className = this._rendersMap[opts.scheme.render];
        }

        if(!className || !JSB.get(className)){
            throw new Error('Unimap repository not contains render with name "' + rName + '"');
        }

        var jsbClass = JSB.get(className).getClass();
        return new jsbClass(opts);
	},

	$client: {
		$constructor: function(){
		    $base();
			this.doSync();

			this.ensureSynchronized(function(){
				var jsbArr = [];

				for(var i in $this._rendersMap){
					jsbArr.push($this._rendersMap[i]);
				}

				for(var i in $this._selectorsMap){
					jsbArr.push($this._selectorsMap[i]);
				}

				JSB.chain(jsbArr, function(jsbName, c){
					JSB.lookup(jsbName, function(){
						c.call($this);
					});
				}, function(){
					$this.setTrigger('_initialized');
				});
			});
		},

		ensureInitialized: function(callback){
			this.ensureTrigger('_initialized', callback);
		},

		createRender: function(opts){
		    return this._create('render', opts);
		}
	},

	$server: {
	    $constructor: function(opts){
	        $base();

			JSB.onLoad(function(){
				if(this.isSubclassOf('Unimap.Render.Basic') && JSB.isDefined(this.$alias)){
					$this.register('render', this.$name, this.$alias);

					if(this.$selector){
					    $this.register('selector', this.$selector, this.$alias);
					}
				}

				if(this.isSubclassOf('Unimap.Selectors.Basic') && JSB.isDefined(this.$alias)){
					$this.register('selector', this.$name, this.$alias);
				}
			});
	    },

		register: function(type, name, alias){
		    if(type === 'selector'){
		        this._selectorsMap[alias] = name;
		    } else {
		        this._rendersMap[alias] = name;
		    }
		}
	}
}