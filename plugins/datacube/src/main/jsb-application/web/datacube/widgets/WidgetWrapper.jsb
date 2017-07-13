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
	values: {},
	
	getName: function(){
		return this.name;
	},
	
	getWidgetType: function(){
		return this.wType;
	},
	
	getValues: function(){
		return this.values;
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
	
	$client: {
		$require: ['JSB.Widgets.Button', 
		           'JSB.Widgets.PrimitiveEditor',
		           'JSB.Widgets.ToolManager',
		           'JSB.DataCube.Dialogs.WidgetOptionsTool',
		           'JSB.DataCube.Widgets.WidgetSchemeRenderer'],
		
		editor: null,
		widget: null,
		settingsVisible: false,
		
		$constructor: function(){
			$base();
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
			
			this.ensureSynchronized(function(){
				$this.setTitle($this.getName());
				$this.updateTabHeader();
				JSB.lookup($this.wType, function(WidgetClass){
					$this.widget = new WidgetClass();
					$this.widgetContainer.append($this.widget.getElement());
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
		
		extractWidgetScheme: function(curWidgetJsb){
			var scheme = {};
			if(!curWidgetJsb){
				curWidgetJsb = this.widget.getJsb();
			}
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
				values: JSB.clone(this.values),
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
			this.values = this.settingsRenderer.getValues();
			
			// store data in wrapper
			this.server().storeValues(this.values, function(){
				$this.refreshWidget();
			});
			
			this.closeSettings();
		},
		
		refreshWidget: function(){
			
		}
	},
	
	$server: {
		$require: ['JSB.DataCube.Providers.DataProviderRepository',
		           'JSB.DataCube.Query.QueryEngine'],
		
		$constructor: function(id, entry, wType, values){
			this.id = id;
			this.entry = entry;
			this.wType = wType;
			this.values = values || {};
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
		
		storeValues: function(values){
			this.values = values;
			this.entry.store();
			this.doSync();
			return true;
		},
		
		getDataSchemeSource: function(ds){
			if(!ds || !ds.source){
				throw new Error('Invalid datascheme passed');
			}
			return this.entry.workspace.entry(ds.source);
		},
		
		combineDataScheme: function(source){
			var iterator = null;
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
				iterator = source.executeQuery();
			} else {
				// TODO
				var dpInfo = DataProviderRepository.queryDataProviderInfo(source);
				var ProviderClass = JSB.get(dpInfo.pType).getClass();
				var provider = new ProviderClass(JSB.generateUid(), source, null);
				provider.extractFields();
/*				var qe = new QueryEngine(null);
				iterator = qe.query({$select:{}}, {}, provider);
*/
				var buffer = provider.find();
				iterator = {
					buffer: buffer,
					total: buffer.length,
					pos: 0,
					next: function(){
						if(this.pos >= this.total){
							return null;
						}
						return this.buffer[this.pos++];
					},
					close: function(){
						this.buffer = [];
						this.total = 0;
						this.pos = 0;
					}
				}
			}
			if(!iterator){
				return null;
			}
			function processElement(val){
				if(JSB.isNull(val)){
					return {type: 'null'};
				} else if(JSB.isObject(val)){
					var rDesc = {type: 'object', record: {}};
					for(var f in val){
						var cVal = val[f];
						var r = processElement(cVal);
						if(r.type != 'null' || !rDesc.record[f]){
							rDesc.record[f] = JSB.merge(true, rDesc.record[f] || {}, r);
						}
						rDesc.record[f].field = f;
					}
					return rDesc;
				} else if(JSB.isArray(val)){
					var rDesc = {type:'array', arrayType: {type:'null'}};
					for(var i = 0; i < val.length; i++){
						var r = processElement(val[i]);
						if(r && r.type != 'null'){
							rDesc.arrayType = r;
						}
					}
					return rDesc;
				} else if(JSB.isString(val)){
					return {type: 'string'};
				} else if(JSB.isFloat(val)){
					return {type: 'float'};
				} else if(JSB.isInteger(val)){
					return {type: 'integer'};
				} else if(JSB.isBoolean(val)){
					return {type: 'boolean'};
				} else if(JSB.isDate(val)){
					return {type: 'date'};
				}
			}
			
			var recordTypes = {};
			for(var j = 0; j < 100; j++){
				var el = iterator.next();
				if(!el){
					break;
				}
				var r = processElement(el);
				JSB.merge(true, recordTypes, r);
			}
			iterator.close();
			return {
				type: 'array',
				source: source.getLocalId(),
				arrayType: recordTypes
			}
		}
	}
}