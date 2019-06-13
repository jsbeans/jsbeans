/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.System.Config',
	$server: {
		$singleton: true,
		$globalize: 'Config',
		$constructor: function(){
			JSB().setServerVersion(this.get('build.version'));
		},
		
		get: function(path){
			if(!this.has(path)){
				return undefined;
			}
			var cfgHelper = Packages.org.jsbeans.helpers.ConfigHelper.getInstance();
			var cfgVal = cfgHelper.getConfigValue(path);
			if(cfgVal.valueType() == Packages.com.typesafe.config.ConfigValueType.STRING){
				// string value
				return '' + cfgVal.unwrapped().toString();
			} else if(cfgVal.valueType() == Packages.com.typesafe.config.ConfigValueType.BOOLEAN){
				return !!cfgVal.unwrapped().booleanValue();
			} else if(cfgVal.valueType() == Packages.com.typesafe.config.ConfigValueType.NUMBER){
				return parseFloat(cfgVal.unwrapped().toString());
			} else if(cfgVal.valueType() == Packages.com.typesafe.config.ConfigValueType.NULL){
				return null;
			} else if(cfgVal.valueType() == Packages.com.typesafe.config.ConfigValueType.OBJECT 
					|| cfgVal.valueType() == Packages.com.typesafe.config.ConfigValueType.LIST) {
				return Packages.org.jsbeans.serialization.JsObjectSerializerHelper.getInstance().convertToNativeObject(cfgVal.unwrapped(), this);
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
			var d = Packages.scala.concurrent.duration.Duration.create(str);
			return d.toMillis();
		},
		
		has: function(path){
			return !!Packages.org.jsbeans.helpers.ConfigHelper.getInstance().has(path);
		}
	}
}