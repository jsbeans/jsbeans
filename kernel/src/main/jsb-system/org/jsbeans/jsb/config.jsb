{
	$name:'Config',
	$server: {
		$singleton: true,
		$globalize: true,
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
				return cfgVal.unwrapped().booleanValue();
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
			return Packages.org.jsbeans.helpers.ConfigHelper.getInstance().has(path);
		}
	}
}