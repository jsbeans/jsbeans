{
	$name:'JSB.AbstractTypeInfoProvider',
	$server: {
		$singleton: true,
		$constructor: function(){
			var self = this;
			JSB().lookupSingleton('JSB.TypeInfoRegistry', function(obj){
				obj.setProvider(self);
			});
		},
		
		getDescriptorFor: function(typeName){
//				throw 'DWP.AbstractTypeInfoProvider.getDescriptorFor: This method must be overriden to correspond server-specific type environment';
			return null;
		}
	}
}