({
	$name: 'JSB.Store.StoreManager',
	$singleton: true,
	$globalize: 'StoreManager',

	$server: {
		_stores: {},

		$constructor: function(){
			$base();
		},

		getStore: function(nameOrConfig) {
		    var config = nameOrConfig;
		    if (JSB.isString(nameOrConfig)) {
		        config = Config.get(this._getStoreConfigPath(nameOrConfig));
		    } else if (!JSB.isPlainObject(nameOrConfig)) {
		        throw new Error('Store configuration type failed');
		    }
		    if (!config) {
                throw new Error('Configuration is not defined for store ' + nameOrConfig);
		    }

		    if (!config.name) {
		        if (JSB.isString(nameOrConfig)) {
                    config.name = nameOrConfig;
                } else {
                    throw new Error('Store name is not defined');
                }
		    }
		    if (!config.type) {
		        throw new Error('Store type is not defined');
		    }

		    return this._ensureStore(config);
		},

		_getStoreConfigPath: function(name) {
		    return 'JSB.Store.dataStores.' + name;
		},

		_ensureStore: function(config) {
		    if (!JSB.isString(config.name)) {
		        throw new Error('Store name is not configured');
		    }

            return JSB.locked(this, function(){
                var store = $this._stores[config.name];
                if (store && !$this._compareConfigs(config, store.config) ) {
                    Log.debug('Close and recreate Store ' + config.name);
                    store.close();
                    store = null;
                }
                if (!store) {
                	var TypeStoreJsb = JSB.get(config.type);
                	if(!TypeStoreJsb){
                		throw new Error('Not supported store type ' + config.type);
                	}
                	
                    var TypedStore = TypeStoreJsb.getClass();
                    store = $this._stores[config.name] = new TypedStore(config, $this);
                }
                return store;
            });
		},

		_removeStore: function(store){
            delete $this._stores[store.config.name];
		},

		_compareConfigs: function(inputConfig, storeConfig){
		    function compareWithLeft(left, right) {
		        if (left == right) return true;
		        if (JSB.isArray(left) && JSB.isArray(right)) {
                    if (left.length != right.length) return false;
                    for(var i in left) {
                        if (!compareWithLeft(left[i], right[i])) return false;
                    }
                    return true;
		        } else if (JSB.isPlainObject(left) && JSB.isPlainObject(right)) {
                    for(var p in left) if (left.hasOwnProperty(p)) {
                        if (!compareWithLeft(left[p], right[p])) return false;
                    }
                    return true;
                }
                return false;
		    }
		    
		    var left = {
		    	name: inputConfig.name,
		    	type: inputConfig.type,
		    	url: inputConfig.url,
		    	properties: inputConfig.properties
		    };

		    var right = {
		    	name: storeConfig.name,
		    	type: storeConfig.type,
		    	url: storeConfig.url,
		    	properties: storeConfig.properties
		    };

            return compareWithLeft(left, right);
		}
    }
})