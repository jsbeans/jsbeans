{
	$name: 'JSB.DataCube.Widgets.WidgetWrapper',
	$parent: 'JSB.Widgets.Widget',
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},

	entry: null,
	wType: null,
	name: null,
	
	getName: function(){
		return this.name;
	},
	
	getWidgetType: function(){
		return this.wType;
	},
	
	$client: {
		$require: ['JSB.Widgets.Button', 
		           'JSB.Widgets.PrimitiveEditor',
		           'JSB.Widgets.ToolManager',
		           'JSB.DataCube.Dialogs.WidgetOptionsTool'],
		
		editor: null,
		widget: null,
		
		$constructor: function(){
			$base();
			this.loadCss('WidgetWrapper.css');
			this.addClass('widgetWrapper');
			this.ensureSynchronized(function(){
				$this.setTitle($this.getName());
				$this.updateTabHeader();
				JSB.lookup($this.wType, function(WidgetClass){
					$this.widget = new WidgetClass();
					$this.append($this.widget);
				});
			});

			this.subscribe('JSB.Widgets.WidgetContainer.widgetAttached', function(sender, msg, w){
				if(w == $this){
					// update header
					$this.updateTabHeader();
				}
			});
		},
		
		destroy: function(){
			if($this.widget){
				$this.widget.destroy();
				$this.widget = null;
			}
			$base();
		},
		
		updateTabHeader: function(){
			if(!this.getContainer() || this.getContainer().hasClass('_jsb_dashboardFloatingContainer')){
				return;
			}
			var tab = $this.getContainer().getTab($this.getId());
			if(tab.tab.width() == 0 || tab.tab.height() == 0){
				JSB.deferUntil(function(){
					$this.updateTabHeader();
				}, function(){
					var tab = $this.getContainer().getTab($this.getId());
					return tab.tab.find('._dwp_tabText').length > 0;
				});
				return;
			}
			var textElt = tab.tab.find('._dwp_tabText');
			var editor = textElt.find('> ._dwp_primitiveEditor');
			if(editor.length > 0){
				editor = editor.jsb();
			} else {
				editor = new PrimitiveEditor({
					mode: 'inplace',
					onValidate: function(val){
						var t = val.trim();
						if(t.length < 3 || t.length > 32){
							return false;
						}
						return /^[\-_\.\s\wа-я]+$/i.test(t);
					},
					onChange: function(val){
						$this.server().rename(val, function(res){
							if(res){
								$this.name = val;
							} else {
								editor.setData($this.name);
							}
						});
					}
				});
				
				var settingsBtn = new Button({
					cssClass: 'roundButton btnSettings btn10',
					tooltip: 'Настроить',
					onClick: function(evt){
						$this.showSettings(evt);
					}
				});
				
				var closeBtn = new Button({
					cssClass: 'roundButton btnDelete btn10',
					tooltip: 'Удалить',
					onClick: function(evt){
						var elt = $this.$(evt.currentTarget);
						ToolManager.showMessage({
							icon: 'removeDialogIcon',
							text: 'Вы уверены что хотите удалить виджет "'+$this.getName()+'" ?',
							buttons: [{text: 'Удалить', value: true},
							          {text: 'Нет', value: false}],
							target: {
								selector: elt
							},
							constraints: [{
								weight: 10.0,
								selector: elt
							},{
								selector: $this.getElement(),
								weight: 10.0
							}],
							callback: function(bDel){
								if(bDel){
									$this.entry.server().removeWidgetWrapper($this.getId(), function(res, fail){
										if(res){
											// remove from dashboard container
											var container = $this.getContainer();
											if(container){
												var dashboardContainer = container.getElement().closest('._jsb_dashboardContainer').jsb();
												dashboardContainer.removeWidget($this);
												$this.destroy();
											}
										}
									});
								}
							}
						});
					}
				});

				textElt.empty()
					.append(editor.getElement())
					.append(settingsBtn.getElement())
					.append(closeBtn.getElement());
			}
			editor.setData(this.getName());
		},
		
		showSettings: function(evt){
			var elt = this.$(evt.currentTarget);
			ToolManager.activate({
				id: 'widgetOptionsTool',
				cmd: 'show',
				data: {
					wrapper: $this,
				},
				scope: $this.$('.dashboardEditorView'),
				target: {
					selector: elt,
				},
				constraints: [{
					selector: elt,
					weight: 10.0
				},{
					selector: $this.getElement(),
					weight: 10.0
				},{
					selector: $this.$('.workspaceExplorer'),
					weight: 10.0
				}],
				callback: function(desc){
					debugger;
				}
			});
		},
		
		
	},
	
	$server: {
		
		$constructor: function(id, entry, wType){
			this.id = id;
			this.entry = entry;
			this.wType = wType;
			$base();
		},
		
		setName: function(name){
			this.name = name;
		},
		
		rename: function(name){
			this.setName(name);
			this.entry.store();
			this.doSync();
			return true;
		}
	}
}