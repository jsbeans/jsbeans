{
	name:'WiresTypeInfoProvider',
	parent: 'JSB.AbstractTypeInfoProvider',
	server: {
		singleton: true,
		constructor: function(){
			var self = this;
			JSB().lookupSingleton('JSB.TypeInfoRegistry', function(obj){
				obj.setProvider(self);
			});
		},
		
		getDescriptorFor: function(typeName){
			// obtain type info via bridge
			var rh = Bridge.getReflectionHelper();
			var jsSer = Bridge.getJsObjectSerializerHelper();
			var javaCls = rh.getClassForName(typeName);
			if(javaCls !== null){
				var native = rh.generateTypeInfoDescriptor(javaCls);
				var str = jsSer.serializeNative(native).toJS();
				var res = eval( '(' + str + ')' );
				return res;
			}
			return {};
		}
	}
}