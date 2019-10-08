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
	$name: 'JSB.Widgets.RendererRepository',
	$singleton: true,
	$require: [],
	$sync: {
		updateCheckInterval: 0
	},
	
	rendererMap: {},
	
	$client: {
		$constructor: function(){
			$base();
			this.doSync();
			this.ensureSynchronized(function(){
				var jsbArr = [];
				for(var eType in $this.rendererMap){
					var jsbName = $this.rendererMap[eType];
					jsbArr.push(jsbName);
				}
				JSB.chain(jsbArr, function(jsbName, c){
					JSB.lookup(jsbName, function(){
						c.call($this);
					})
				}, function(){
					$this.setTrigger('ready');
				});
			});
		},
		
		ensureReady: function(callback){
			this.ensureTrigger('ready', callback);
		},
		
		createRendererFor: function(obj, opts, eType){
			if(!this.matchTrigger('ready')){
				throw new Error('RendererRepository has not been initialized yet');
			}
			if(!eType){
				if(!JSB.isBean(obj)){
					throw new Error('Unable to resolve renderer for specified object');
				}
				eType = obj.getJsb().$name;
			}
			var rName = this.rendererMap[eType];
			if(!rName){
				var bestNt = null;
				var bestDist = null;
				for(nt in this.rendererMap){
					var dist = obj.getJsb().getSubclassOfDistance(nt);
					if(!JSB.isNull(dist)){
						if(JSB.isNull(bestDist) || bestDist > dist){
							bestDist = dist;
							bestNt = nt;
						}
					}
				}
				if(bestNt){
					rName = this.rendererMap[eType] = this.rendererMap[bestNt];
				}
			}
			if(!rName || !JSB.get(rName)){
				return null;
			}
			var RendererClass = JSB.get(rName).getClass();
			return new RendererClass(obj, opts);
		}
		
	},
	
	$server: {
		registerRenderer: function(rendererType, entityType){
			var rendererJsb = null;
			if(JSB.isString(rendererType)){
				rendererJsb = JSB.get(rendererType);
				if(!rendererJsb){
					throw new Error('Unable to find renderer bean: ' + rendererType);
				}
			} else if(rendererType instanceof JSB){
				rendererJsb = rendererType;
			} else if(JSB.isBean(rendererType)){
				rendererJsb = rendererType.getJsb();
			}
			if(!rendererJsb.isSubclassOf('JSB.Widgets.Renderer')){
				throw new Error('Renderer bean should be inherited from "JSB.Widgets.Renderer"');
			}
			
			if(JSB.isBean(entityType)){
				entityType = entityType.getJsb().$name;
			} else if(entityType instanceof JSB){
				entityType = entityType.$name;
			} else if(!JSB.isString(entityType)){
				throw new Error('Invalid entity bean specified');
			}
			
			this.rendererMap[entityType] = rendererJsb.$name;
		}
	}
}