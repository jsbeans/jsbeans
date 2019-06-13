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
	$name:'JSB.TypeInfoRegistry',
	
	register: function(typeId, desc){
		if(JSB().isNull(this.types)){
			this.types = {};
		}
		this.types[typeId] = desc;
	},
	
	get: function(typeId){
		if(JSB().isNull(this.types)){
			return null;
		}
		var res = this.types[typeId];
		if(JSB().isNull(res)){
			return null;
		}
		return res;
	},

	$client: {
		$singleton: true,
		lookup: function(typeId, callback){
			var self = this;
			var desc = this.get(typeId);
			if(!JSB().isNull(desc)){
				callback.call(this, desc);
				return;
			}
			this.rpc('getInfo', [typeId], function(desc){
				self.register(typeId, desc);
				if(!JSB().isNull(callback)){
					callback.call(self, desc);
				}
			});
		}
	},
	
	$server: {
		$singleton: true,
		$constructor: function(){
		},
		
		setProvider: function(p){
			this.provider = p;
		},
		
		lookup: function(typeId, callback){
			var self = this;
			var desc = this.get(typeId);
			if(!JSB().isNull(desc)){
				callback.call(this, desc);
				return;
			}
			desc = this.getInfo(typeId);
			callback.call(this, desc);
		},
		
		getInfo: function(typeId){
			var desc = this.get(typeId);
			if(!JSB().isNull(desc)){
				return desc; 
			}
			
			if(JSB().isNull(this.provider)){
				return null;
			}
			desc = this.provider.getDescriptorFor(typeId);
			this.register(typeId, desc);
			return desc; 
		}
	}
}