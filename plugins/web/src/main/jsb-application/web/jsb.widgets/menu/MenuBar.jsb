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
		_items: [],
		           
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
						data: $this._items,
						key: 'actionMenu',
						target: {
							selector: $this.menuButton.getElement(),
							dock: 'bottom'
						},
						callback: function(key, item, evt){
							$this.executeAction($this._actions[key]);
						}
					});
				}
			});
			this.append(this.menuButton);
			
			this.update();
		},
		
		setContext: function(ctx){
			this.setOption('context', ctx);
			this.update();
		},
		
		update: function(){
			if(this.options.showItems) {
				this.addClass('showItems');
			}

			if(this.options.showButton) {
				this.addClass('showButton');
			}
			
			MenuRegistry.lookupActions(this.options.category, function(actMap){
				$this._actions = actMap;
				
				// construct renderers
				$this._items = [];
				for(var actId in $this._actions){
					var action = $this._actions[actId];
					var renderer = $this._renderers[actId];
					if(!renderer){
						renderer = $this._renderers[actId] = RendererRepository.createRendererFor(action);
					}
					$this._items.push({
						key: actId,
						element: renderer.getElement()
					});
				}
			});
		},
		
		executeAction: function(action){
			if(action){
				action.execute($this.options.category, $this.options.context);
			}
		}
		
	}
}