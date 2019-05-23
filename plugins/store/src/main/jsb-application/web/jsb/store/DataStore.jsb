/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

({
	$name: 'JSB.Store.DataStore',
	$session: false,
	$server: {
		$require: [
		],

		$constructor: function(config, storeManager){
			$base();
			this.config = config;
			this.storeManager = storeManager;
		},

		getName: function(){
		    return this.config.name;
		},

		asSQL: function() {
            throw new Error('SQL query not supported for store ' + this.config.name);
		},

		asMongo: function() {
            throw new Error('MongoDB query not supported for store ' + this.config.name);
		},
		
		getType: function(){
			return this.config.type;
		},

		getVendor: function(){
		    return null;
		},

		close: function() {
			this.storeManager._removeStore(this);
		    this.destroy();
		},
    }
})