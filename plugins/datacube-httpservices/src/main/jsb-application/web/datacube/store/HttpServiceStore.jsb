/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

({
	$name: 'DataCube.Store.HttpServiceStore',
	$parent: 'JSB.Store.DataStore',
	$session: false,
	$server: {
		$require: [],

		connections: {},

		$constructor: function(config, storeManager){
			$base(JSB.merge({
                    argumentTypes: {}
			    }, config), storeManager);
		}

    }
})