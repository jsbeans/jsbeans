({
	$name: 'jsb.store.StoreManager',
	$singleton: true,
	$globalize: 'StoreManager',

	$server: {
		$require: [
		    'jsb.store.sql.SQLStore'
		],

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
		    return 'jsb.store.dataStores.' + name;
		},

		_ensureStore: function(config) {
		    if (!JSB.isString(config.name)) {
		        throw new Error('Store name is not configured');
		    }
		    var store = this._stores[config.name];
            if (store) {
                return store;
            }

            return JSB.locked(this, function(){
                var store = $this._stores[config.name];
                if (!store) {
                    // TODO
//                    var TypedStore = JSB(config.type).getClass();
                    if (config.type == 'jsb.store.sql.SQLStore') {
                        var TypedStore = SQLStore;
                    } else {
                        throw new Error('Not supported store type ' + config.type);
                    }
                    store = $this._stores[config.name] = new TypedStore(config);
                }
                return store;
            });
		}


    }
})