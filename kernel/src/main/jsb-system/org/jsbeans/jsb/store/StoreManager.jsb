({
	$name: 'jsb.store.StoreManager',
	$singleton: true,
	$globalize: 'DataSource',

	$server: {
		$require: [
		],

		_stores: {},

		$constructor: function(){
			$base();
		},

		getStore: function(nameOrConfig) {
		    var config = nameOrConfig;
		    if (JSB.isString(nameOrConfig)) {
		        config = JSB.merge(true, {name: nameOrConfig}, Config.get(this._getStoreConfigPath(nameOrConfig)));
		    } else if (!JDB.isPlainObject(nameOrConfig)) {
		        throw new Error('Store configuration type failed');
		    }
		    if (!config) {
                throw new Error('Configuration is not defined for store ' + nameOrConfig);
		    }

		    if (!config.name) {
                throw new Error('Store name is not defined');
		    }

		    return this._ensureStore(config);
		},

		_getStoreConfigPath: function(name) {
		    return 'jsb.store.dataStore.' + name;
		},

		_ensureStore: function(config) {
		    if (!JDB.isString(config.name)) {
		        throw new Error('Store name is not configured');
		    }
		    var store = this._stores[config.name];
            if (store) {
                this.connect(store);
                return store;
            }

            JSB.locked(this, function(){
                var TypesStore = JSB(config.type).getClass();
                $this._stores[config.name] = new TypedStore(config);
            });
            var store = this._stores[config.name];
            this.connect(store);
            return store;
		},

		destroy: function(){
		    $base();

		    JSB.locked(this, function(){
		        for(var name in $this._stores) {
		            var store = $this._stores[name];
		            try {
		                $this.disconnect(store);
                    } catch(e) {
                        Log.error('Disconnect store failed', e);
                    }
		        }
		    });
		},


    }
})