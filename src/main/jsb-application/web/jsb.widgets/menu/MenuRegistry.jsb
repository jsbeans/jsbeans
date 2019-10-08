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
	$name: 'JSB.Widgets.MenuRegistry',
	$parent: 'JSB.Widgets.Registry',
	$singleton: true,
	
	$client: {
		lookupActions: function(category, callback){
			if(!category){
				throw new Error('Missing "category" argument in calling JSB.Widgets.MenuRegistry.lookupActions');
			}
			this.lookupItems(category, function(res){
				if(!JSB.isArray(res) || res.length == 0){
					if(callback){
						callback.call($this, {});
					}
					return;
				}
				JSB.chain(res, function(desc, c){
					if(desc.inst){
						c(desc.inst);
					} else {
						JSB.lookup(desc.jsb, function(cls){
							desc.inst = new cls();
							c(desc.inst);
						});
					}
				}, function(actArr){
					var actMap = {};
					for(var i = 0; i < actArr.length; i++){
						actMap[actArr[i].getJsb().getDescriptor().$name] = actArr[i];
					}
					if(callback){
						callback.call($this, actMap);
					}
				});
			});
		}
	},
	
	$server: {
		$constructor: function(){
			$base();
			JSB.onLoad(function(){
				if(this.isSubclassOf('JSB.Widgets.MenuAction') && JSB.isDefined(this.$expose)){
					$this.register(this);
				}
			});
		}
	}
}