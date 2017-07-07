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
		
		getWidget: function(){
			return this.widget;
		},
		
		extractWidgetScheme: function(){
			var scheme = {};
			var curWidgetJsb = this.widget.getJsb();
			while(curWidgetJsb){
				if(!curWidgetJsb.isSubclassOf('JSB.DataCube.Widgets.Widget')){
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
		},
		
		combineDataScheme: function(source){
			var iterator = null;
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
				iterator = source.executeQuery();
			} else {
				
			}
			if(!iterator){
				return null;
			}
			var recordTypes = {};
			function processObject(el, scope){
				for(var f in el){
					var val = el[f];
					if(JSB.isNull(val)){
						if(!scope[f]){
							scope[f] = {type: 'null', source: f};
						}
					} else if(JSB.isObject(val)){
						scope[f] = {type: 'object', source: f, record: {}};
						processObject(val, scope[f].record);
					} else if(JSB.isArray(val)){
						scope[f] = {type: 'array', source: f, record: {}};
						for(var i = 0; i < val.length; i++){
							processObject(val[i], scope[f].record);
						}
					} else if(JSB.isString(val)){
						scope[f] = {type: 'string', source: f};
					} else if(JSB.isFloat(val)){
						scope[f] = {type: 'float', source: f};
					} else if(JSB.isInteger(val)){
						scope[f] = {type: 'integer', source: f};
					} else if(JSB.isBoolean(val)){
						scope[f] = {type: 'boolean', source: f};
					} else if(JSB.isDate(val)){
						scope[f] = {type: 'date', source: f};
					}
				}
			}
			for(var j = 0; j < 100; j++){
				var el = iterator.next();
				if(!el){
					break;
				}
				processObject(el, recordTypes);
			}
			iterator.close();
			return {
				type: 'array',
				source: source,
				record: recordTypes
			}
		}
	}
}