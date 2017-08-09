{
	$name: 'DataCube.Widgets.WidgetWrapper',
	$parent: 'JSB.Widgets.Widget',

	widgetEntry: null,
	name: null,
	values: null,
	
	getName: function(){
		return this.name;
	},
	
	getWidgetType: function(){
		return this.widgetEntry.getWidgetType();
	},
	
	getValues: function(){
		return this.values;
	},
	
	getDashboard: function(){
		return this.widgetEntry.getDashboard();
	},
	
	getWidgetEntry: function(){
		return this.widgetEntry;
	},
	
	getBindingRelativePath: function(parent, child){
		function searchChild(p, c){
			if(JSB.isEqual(p, c)){
				return '';
			}
			if(p.type == 'array'){
				return searchChild(p.arrayType, c);
			} else if(p.type == 'object'){
				for(var f in p.record){
					var rf = p.record[f];
					var cc = searchChild(rf, c);
					if(JSB.isDefined(cc)){
						if(cc.length > 0){
							return rf.field + '.' + cc;
						}
						return rf.field;
					}
				}
				return undefined;
			} else {
				return undefined;
			}
		}
		
		return searchChild(parent, child);
	},
	
	applyBindingRelativePath: function(parent, path){
		var curVal = parent;
		if(!path || path.length == 0){
			return curVal;
		}
		var parts = path.split(/[\.\/]/);
		
		for(var i = 0; i < parts.length; i++){
			while(curVal.type == 'array'){
				curVal = curVal.arrayType;
			}
			if(curVal.type != 'object'){
				return null;
			}
			if(!curVal.record || !JSB.isDefined(curVal.record[parts[i]])){
				return null;
			}
			curVal = curVal.record[parts[i]];
		}
		
		return curVal;
	},
	
	$client: {
		$require: ['JSB.Widgets.Button', 
		           'JSB.Widgets.PrimitiveEditor',
		           'JSB.Widgets.ToolManager',
		           'DataCube.Dialogs.WidgetOptionsTool',
		           'DataCube.Widgets.WidgetSchemeRenderer'],
		
		owner: null,
		widget: null,
		settingsVisible: false,
		attached: false,
		
		$constructor: function(widgetEntry, owner, opts){
			$base();
			this.widgetEntry = widgetEntry;
			this.owner = owner;
			this.name = this.widgetEntry.getName();
			this.values = this.widgetEntry.getValues();
			this.loadCss('WidgetWrapper.css');
			this.addClass('widgetWrapper');
			this.settingsContainer = this.$(`#dot
			<div class="settingsContainer">
				<div class="header">
					<div class="caption">
						<div class="icon"></div>
						<div class="title" jsb="JSB.Widgets.PrimitiveEditor"></div>
					</div>
					<div class="buttons">
						<div jsb="JSB.Widgets.Button" 
							class="roundButton btnOk btn16" 
							onclick="{{=this.callbackAttr(function(evt){ $this.applySettings(evt); })}}" >
						</div>
						<div jsb="JSB.Widgets.Button" 
							class="roundButton btnCancel btn16" 
							onclick="{{=this.callbackAttr(function(evt){ $this.closeSettings(); })}}" >
						</div>
					</div>
				</div>
				
				<div class="scroll" jsb="JSB.Widgets.ScrollBox"></div>

			</div>`);
			this.widgetContainer = this.$('<div class="widgetContainer"></div>');
			this.append(this.widgetContainer);
			this.append(this.settingsContainer);
			
			this.settingsContainer.on({
				'transitionend': function(evt){
					var elt = $this.$(evt.currentTarget);
					if($this.settingsVisible){
						elt.css('height', 'auto');
					} else {
						elt.css('visibility', '');
					}
				}
			});
			
			$this.setTitle($this.getName());
			$this.updateTabHeader();
			JSB.lookup($this.getWidgetType(), function(WidgetClass){
				$this.widget = new WidgetClass();
				$this.widgetContainer.append($this.widget.getElement());
				$this.widget.setWrapper($this);
				$this.widget.refresh();
			});

			this.subscribe('JSB.Widgets.WidgetContainer.widgetAttached', function(sender, msg, w){
				if(w == $this){
					// update header
					$this.updateTabHeader();
					$this.attached = true;
				}
			});
			
			this.subscribe('DataCube.filterChanged', function(sender, msg, opts){
				if(JSB.isInstanceOf(sender, 'DataCube.Widgets.FilterManager')){
					return;
				}
				if(!opts || opts.dashboard != $this.getDashboard()){
					return;
				}
				$this.getWidget().refresh(opts);
			});
			
			if(opts && opts.showSettings){
				var dashboardContainer = $this.getElement().closest("._jsb_dashboardContainer").jsb();
				if(!$this.attached || !dashboardContainer || !$this.isContentReady()){
					JSB.deferUntil(function(){
						$this.showSettings();
					}, function(){
						return $this.attached && $this.getElement().closest("._jsb_dashboardContainer").jsb() && $this.isContentReady();
					});
				} else {
					$this.showSettings();
				}
			}

		},
		
		
		setOwner: function(owner){
			this.owner = owner;
		},
		
		getOwner: function(){
			return this.owner;
		},
		
		destroy: function(){
			if($this.widget){
				$this.widget.destroy();
				$this.widget = null;
			}
			$base();
		},
		
		getWidget: function(){
			return this.widget;
		},
		
		constructFilter: function(srcId){
			return this.getOwner().getFilterManager().constructFilter(srcId);
		},
		
		hasFilter: function(fDesc){
			return this.getOwner().getFilterManager().hasFilter(fDesc);
		},
		
		addFilter: function(fDesc, sourceIds, widget){
			return this.getOwner().getFilterManager().addFilter(fDesc, sourceIds, widget);
		},
		
		removeFilter: function(fItemId, widget){
			return this.getOwner().getFilterManager().removeFilter(fItemId, widget);
		},
		
		clearFilters: function(widget){
			this.getOwner().getFilterManager().clearFilters(widget);
		},
		
		extractWidgetScheme: function(curWidgetJsb){
			var scheme = {};
			if(!curWidgetJsb){
				curWidgetJsb = this.widget.getJsb();
			}
			while(curWidgetJsb){
				if(!curWidgetJsb.isSubclassOf('DataCube.Widgets.Widget')){
					break;
				}
				var wScheme = curWidgetJsb.getDescriptor().$scheme;
				if( wScheme && Object.keys(wScheme).length > 0){
					JSB.merge(true, scheme, wScheme);
				}
				curWidgetJsb = curWidgetJsb.getParent();
			}
			return scheme;
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
						$this.getWidgetEntry().server().rename(val, function(res){
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
									$this.getDashboard().server().removeWidgetWrapper($this.getWidgetEntry().getLocalId(), function(res, fail){
										if(res){
											// remove from dashboard container
											var container = $this.getContainer();
											if(container){
												var dashboardContainer = container.getElement().closest('._jsb_dashboardContainer').jsb();
												dashboardContainer.placeholders['center'].enable(true);
												dashboardContainer.removeWidget($this);
												if($this.getOwner().wrappers[$this.getId()]){
													delete $this.getOwner().wrappers[$this.getId()];
												}
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
		
		showSettings: function(){
			var dashboardContainer = this.getElement().closest('._jsb_dashboardContainer').jsb();
			dashboardContainer.placeholders['center'].enable(false);
			
			var scheme = this.extractWidgetScheme();
			var scroll = this.settingsContainer.find('> .scroll').jsb();
			scroll.clear();
			
			var titleEditor = this.settingsContainer.find('> .header > .caption > .title').jsb();
			titleEditor.setData(this.getName());
			
			// create scheme renderer
			this.settingsRenderer = new WidgetSchemeRenderer({
				scheme: scheme,
				values: JSB.clone(this.getValues()),
				wrapper: $this,
				onChange: function(){
//					$this.updateButtons();
				}
			});
			scroll.append(this.settingsRenderer);
			this.settingsVisible = true;
			this.settingsContainer.css({
				height: this.getElement().height(),
				visibility: 'visible'
			});
			
		},
		
		closeSettings: function(){
			this.settingsVisible = false;
			this.settingsContainer.css('height',this.getElement().height());
			var dashboardContainer = this.getElement().closest('._jsb_dashboardContainer').jsb();
			dashboardContainer.placeholders['center'].enable(true);
			JSB.defer(function(){
				$this.settingsContainer.css('height','');
			}, 0);
			
		},
		
		applySettings: function(){
			var title = this.settingsContainer.find('> .header > .caption > .title').jsb().getData().getValue();
			this.values = this.settingsRenderer.getValues();
			
			// store data in wrapper
			this.getWidgetEntry().server().storeValues(title, this.values, function(sourceMap){
				$this.name = title;
				$this.updateTabHeader();
				$this.getWidget().updateValues(JSB.clone($this.values), sourceMap);
				$this.getWidget().refresh();
			});
			
			this.closeSettings();
		}
		
	}
	
}