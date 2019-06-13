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
	$name: 'JSB.Widgets.MenuBar',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$require: ['JSB.Widgets.MenuRegistry',
		           'JSB.Widgets.RendererRepository',
		           'JSB.Widgets.ToolManager',
		           'JSB.Widgets.Button',
		           'css:MenuBar.css'],
		           
		options: {
			showItems: false,
			showButton: true
		},
		
		_actions: {},
		_renderers: {},
		_fixedItems: [],
		_buttonItems: [],
		           
		$constructor: function(opts){
			$base(opts);
			this.addClass('_jsb_menuBar');
			
			if(!this.options.category){
				throw new Error('Missing category parameter');
			}
			
			if(this.options.cssClass){
				this.addClass(this.options.cssClass);
			}

			// construct layout
			this.menuItems = this.$('<ul class="menuItems"></ul>');
			this.append(this.menuItems);
			
			this.menuButton = new Button({
				cssClass: 'btnMenu',
				hideCaption: true,
				onClick: function(){
					ToolManager.activate({
						id: '_dwp_droplistTool',
						cmd: 'show',
						data: $this._buttonItems,
						key: 'actionMenu',
						target: {
							selector: $this.menuButton.getElement(),
							dock: 'bottom'
						},
						callback: function(key, item, evt){
							$this.executeAction($this._actions[key], evt);
						}
					});
				}
			});
			this.append(this.menuButton);
			
			this.update();
		},
		
		ensureReady: function(callback){
			this.ensureTrigger('ready', callback);
		},
		
		setContext: function(ctx){
			this.setOption('context', ctx);
			this.update();
		},
		
		update: function(){
			MenuRegistry.lookupActions(this.options.category, function(actMap){
				$this._actions = actMap;
				
				RendererRepository.ensureReady(function(){
					$this.updateButton();
					$this.updateItems();
					if($this._fixedItems.length > 0 || $this._buttonItems.length > 0){
						$this.addClass('hasItems');
						$this.removeClass('noItems');
					} else {
						$this.removeClass('hasItems');
						$this.addClass('noItems');
					}
					$this.setTrigger('ready');
				});
			});
		},
		
		updateItems: function(){
			this.menuItems.empty();
			if(!this.options.showItems){
				this.removeClass('showItems');
				return;
			}
			// collect items to fixed show
			$this._fixedItems = [];
			for(var actId in $this._actions){
				var action = $this._actions[actId];
				var expose = action.getJsb().getDescriptor().$expose;
				if(!expose.fixed && $this.options.showButton){
					continue;
				}
				var renderer = $this._renderers[actId];
				if(!renderer){
					renderer = $this._renderers[actId] = RendererRepository.createRendererFor(action, {fixed: true});
				}
				$this._fixedItems.push({
					key: actId,
					element: renderer.getElement()
				});
				var itemElt = $this.$('<li class="item"></li>');
				itemElt.attr('key', actId);
				itemElt.append(renderer.getElement());
				$this.menuItems.append(itemElt);
				itemElt.click(function(evt){
					var elt = $this.$(evt.currentTarget);
					var actId = elt.attr('key');
					$this.executeAction($this._actions[actId], evt);
				});
			}
			
			if($this._fixedItems.length > 0){
				this.addClass('showItems');	
			} else {
				this.removeClass('showItems');
			}
		},
		
		updateButton: function(){
			if(!this.options.showButton){
				this.removeClass('showButton');
				return;
			}
			$this._buttonItems = [];
			for(var actId in $this._actions){
				var action = $this._actions[actId];
				var expose = action.getJsb().getDescriptor().$expose;
				if(expose.fixed && $this.options.showItems){
					continue;
				}
				var renderer = $this._renderers[actId];
				if(!renderer){
					renderer = $this._renderers[actId] = RendererRepository.createRendererFor(action);
				}
				$this._buttonItems.push({
					key: actId,
					element: renderer.getElement()
				});
			}
			
			
			if(Object.keys($this._buttonItems).length > 0){
				$this.addClass('showButton');	
			} else {
				$this.removeClass('showButton');
			}
		},
		
		getActions: function(){
			return $this._actions;
		},
		
		executeAction: function(action, evt){
			if(action){
				action.execute({
					category: $this.options.category, 
					context: $this.options.context, 
					event: evt,
					sender: $this});
			}
		}
		
	}
}