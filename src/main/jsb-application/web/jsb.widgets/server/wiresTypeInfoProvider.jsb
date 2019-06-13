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
	$name:'WiresTypeInfoProvider',
	$parent: 'JSB.AbstractTypeInfoProvider',
	$server: {
		$singleton: true,
		$constructor: function(){
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