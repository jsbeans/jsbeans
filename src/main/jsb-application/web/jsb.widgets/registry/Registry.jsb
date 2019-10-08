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
	$name: 'JSB.Widgets.Registry',
	
	$client: {
		registry: {},
		registryByType: {},
		_allFilled: false,
		
		$constructor: function(opts){
			$base(opts);
		},
		
		lookupItems: function(category, callback){
			if(JSB.isFunction(category)){
				callback = category;
				category = undefined;
			}
			if(category){
				if(this.registry && this.registry[category] && this.registry[category].length > 0){
					callback.call(this, this.registry[category]);
					return;
				}
				this.server().getItems(category, function(r, fail){
					if(r){
						$this.registry[category] = r;
						for(var i = 0; i < r.length; i++){
							var desc = r[i];
							$this.registryByType[desc.jsb] = desc;
						}
					}
					
					callback.call($this, $this.registry[category], fail);
				});
			} else {
				if($this._allFilled){
					callback.call(this, this.registry);
					return;
				}
				this.server().getItems(function(r, fail){
					if(r){
						$this._allFilled = true;
						$this.registry = r;
						// fill registryByType
						for(var cat in $this.registry){
							var arr = $this.registry[cat];
							for(var i = 0; i < arr.length; i++){
								var desc = arr[i];
								$this.registryByType[desc.jsb] = desc;
							}
						}
					}
					
					callback.call($this, $this.registry, fail);
				});
			}
		},
		
		lookupItemAttr: function(jsb, attr, callback){
			if(this.registryByType[jsb] && JSB.isDefined(this.registryByType[jsb][attr])){
				callback.call(this, this.registryByType[jsb][attr]);
				return;
			}
			this.server().getItemAttr(jsb, attr, function(val){
				if(!$this.registryByType[jsb]){
					$this.registryByType[jsb] = {};
				}
				$this.registryByType[jsb][attr] = val;
				callback.call($this, $this.registryByType[jsb][attr]);
			});
		}
	},
	
	$server: {
		registry: {},
		registryByType: {},
		
		$constructor: function(){
			$base();
		},
		
		register: function(jsb){
			var expose = jsb.getDescriptor().$expose;
			if(!expose || Object.keys(expose).length == 0){
				return;
			}
			var cats = [];
			if(JSB.isArray(expose.category)){
				cats = expose.category;
			} else if(JSB.isString(expose.category)){
				cats = [expose.category];
			} else {
				throw new Error('Failed to register bean: "' + jsb.getDescriptor().$name + '" due to its category type not expected');
			}
			for(var i = 0; i < cats.length; i++){
				var category = cats[i];
				if(!this.registry[category]){
					this.registry[category] = [];
				}
				var desc = JSB.merge({}, expose, {jsb: jsb.$name});
				this.registry[category].push(desc);
				this.registryByType[desc.jsb] = desc;
			}
		},
		
		getItems: function(category){
			if(category){
				return this.registry[category];
			}
			return this.registry;
		},
		
		getItemAttr: function(jsb, attr){
			var desc = this.registryByType[jsb];
			if(!desc){
				return;
			}
			if(attr){
				if(JSB.isDefined(desc[attr])){
					return desc[attr];
				}
			}
			return desc;
		}
	}
}