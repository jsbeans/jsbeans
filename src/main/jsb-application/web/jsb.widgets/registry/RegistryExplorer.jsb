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
	$name: 'JSB.Widgets.RegistryExplorer',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.TreeView',
		           'JSB.Widgets.RendererRepository',
		           'css:RegistryExplorer.css'],
		           
		registry: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('registryExplorer');
			
			this.treeView = new TreeView({
			    onSelectionChanged: function() {
			        $this.options.onSelectionChanged && $this.options.onSelectionChanged.apply($this, arguments);
			    }
			});
			this.append(this.treeView);
			
			if(this.options.registry){
				if(JSB.isString(this.options.registry)){
					JSB.lookup(this.options.registry, function(reg){
						$this.bindRegistry(reg);
					});
				} else {
					this.bindRegistry(this.options.registry);
				}
			}
		},
		
		bindRegistry: function(reg){
			if(!reg){
				return;
			}
			this.registry = reg;
			this.registry.lookupItems(function(iDesc){
				$this.draw(iDesc);
			});
		},
		
		createItemRenderer: function(obj){
			var renderer = obj.name;
			if(this.options.itemRenderer){
				var itemRenderer = this.options.itemRenderer;
				if(JSB.isFunction(itemRenderer)){
					itemRenderer = itemRenderer.call(this, itemDesc);
				}
				if(JSB.isString(itemRenderer)){
					renderer = RendererRepository.createRendererFor(obj, {}, itemRenderer);
				} else if(itemRenderer instanceof JSB){
					var RendererCls = itemRenderer.getClass();
					renderer = new RendererCls(obj, {});
				}
			}
			return renderer;
		},
		
		draw: function(wDescObj){
			RendererRepository.ensureReady(function(){
				$this.treeView.clear();
				var orderMap = {};
				if($this.options.order){
					if(JSB.isArray($this.options.order)){
						for(var i = 0; i < $this.options.order.length; i++){
							var on = $this.options.order[i];
							orderMap[on] = $this.options.order.length - i;
						}
					} else if(JSB.isObject($this.options.order)){
						orderMap = $this.options.order;
					}
				}
				var descArr = Object.keys(wDescObj);
				descArr.sort(function(a, b){
					var an = 0;
					var bn = 0;
					if(orderMap[a]){
						an = orderMap[a];
					}
					if(orderMap[b]){
						bn = orderMap[b];
					}
					if(an == bn){
						return a.localeCompare(b);	
					}
					return bn - an;
				});
				
				for(var i = 0; i < descArr.length; i++){
					var category = descArr[i];
					var catParts = category.split(/[\.\/]/i);
					var pKey = null;
					for(var p = 0; p < catParts.length; p++){
						var catPart = catParts[p];
						var curKey = catPart;
						if(pKey){
							curKey = pKey + '_' + curKey;
						}
						var catNode = $this.treeView.get(curKey);
						if(!catNode){
							catNode = $this.treeView.addNode({
								allowHover: false,
								allowSelect: false,
								cssClass: 'category',
								key: curKey,
								element: $this.$('<div class="category"></div>').text(catPart)
							}, pKey);
						}
						pKey = curKey;
					}
					
					// create renderer
					var items = wDescObj[category];

					items.forEach((itemDesc) => {
						var renderer = $this.createItemRenderer(itemDesc);
						
						$this.treeView.addNode({
							key: itemDesc.name,
							element: renderer,
						}, pKey);
						
						renderer.registry = $this.registry;

                        renderer.getElement().draggable({
                            start: function(evt, ui){
                                evt.originalEvent.preventDefault();
                                evt.stopPropagation();
                            },
                            helper: function(evt, ui){
                                this.draggingItems = [renderer];

                                // create drag container
                                var helper = $this.$('<div class="dragHelper"></div>');
                                helper.append($this.$('<div class="dragItem"></div>').append(renderer.getElement().clone()));
                                return helper.get(0);
                            },
                            stop: function(evt, ui){
                            },
                            revert: false,
                            scroll: false,
                            zIndex: 100000,
                            distance: 10,
                            appendTo: 'body'
                        });
					});
					
					$this.treeView.sort(function(a, b){
						var an = 0;
						var bn = 0;
						if(orderMap[a.key]){
							an = orderMap[a.key];
						}
						if(orderMap[b.key]){
							bn = orderMap[b.key];
						}
						if(an == bn){
							return a.key.localeCompare(b.key);	
						}
						return bn - an;
					});
				}
			});
		},

		getSelected: function() {
		    return this.treeView.getSelected();
		}
	}
}