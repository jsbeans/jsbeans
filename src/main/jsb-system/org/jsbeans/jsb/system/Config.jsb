/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.System.Config',
	$server: {
		$require: ['java:org.jsbeans.helpers.ConfigHelper',
		           'java:com.typesafe.config.ConfigValueType',
		           'java:scala.concurrent.duration.Duration',
		           'java:org.jsbeans.serialization.JsObjectSerializerHelper'],
		$singleton: true,
		$globalize: 'Config',
		$constructor: function(){
			JSB().setServerVersion(this.get('build.version'));
		},
		
		get: function(path){
			if(!this.has(path)){
				return undefined;
			}
			var cfgHelper = ConfigHelper.getInstance();
			var cfgVal = cfgHelper.getConfigValue(path);
			if(cfgVal.valueType() == ConfigValueType.STRING){
				// string value
				return '' + cfgVal.unwrapped().toString();
			} else if(cfgVal.valueType() == ConfigValueType.BOOLEAN){
				return cfgVal.unwrapped().toString().toLowerCase() == 'true';
			} else if(cfgVal.valueType() == ConfigValueType.NUMBER){
				return parseFloat(cfgVal.unwrapped().toString());
			} else if(cfgVal.valueType() == ConfigValueType.NULL){
				return null;
			} else if(cfgVal.valueType() == ConfigValueType.OBJECT 
					|| cfgVal.valueType() == ConfigValueType.LIST) {
				return JsObjectSerializerHelper.getInstance().convertToNativeObject(cfgVal.unwrapped(), this);
			} else {
				throw 'Unsupported value type: ' + cfgVal.valueType();
			}
		},
		
		getTimeout: function(path){
			if(!this.has(path)){
				return null;
			}
			
			return this.parseTimeout(this.get(path));
		},
		
		parseTimeout: function(str){
			var d = Duration.create(str);
			return d.toMillis();
		},
		
		has: function(path){
			return !!ConfigHelper.getInstance().has(path);
		}
	}
}