/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.MaterializationEngine',
	$singleton: true,
	
	$server: {
		$require: ['JSB.System.Config'],

		materializers: {},
		
		$constructor: function(){
		},
		
		registerMaterializer: function(sourceType, mType){
			JSB.getLocker().lock('registerMaterializer');
			
			if(mType instanceof JSB){
				mType = mType.getClass();
			}
			
			if(JSB.isString(mType)){
				mType = JSB.get(mType).getClass();
			}
			
			this.materializers[sourceType] = mType;
			
			JSB.getLogger().info('Registered materializer "'+mType.jsb.$name+'" for "' + sourceType + '"');
			
			JSB.getLocker().unlock('registerMaterializer');
		},
		
		createMaterializer: function(source){
			var MaterializerCls = this.materializers[source.getJsb().$name];
			return new MaterializerCls(this, source);
		}
	}
}