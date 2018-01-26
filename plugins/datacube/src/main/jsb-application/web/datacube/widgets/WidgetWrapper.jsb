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
		
		options: {
			auto: true
		},
		
		$constructor: function(widgetEntry, owner, opts){
			$base(opts);
			this.widgetEntry = widgetEntry;
			this.owner = owner;
			this.name = this.widgetEntry.getName();
			this.values = this.widgetEntry.getValues();
			this.loadCss('WidgetWrapper.css');
			this.addClass('widgetWrapper');
			this.widgetContainer = this.$('<div class="widgetContainer"></div>');
			this.append(this.widgetContainer);
			
			$this.setTitle($this.getName());

			if(!$this.options.viewMode){
				$this.updateTabHeader();
			}

			JSB.lookup($this.getWidgetType(), function(WidgetClass){
				$this.widget = new WidgetClass();
				$this.widgetContainer.append($this.widget.getElement());
				$this.widget.setWrapper($this);
				if($this.options.auto){
					$this.widget.ensureInitialized(function(){
						$this.widget.refresh({
						    isCacheMod: $this.options.isCacheMod || false
						});
					});
				}
			});

			this.subscribe('JSB.Widgets.WidgetContainer.widgetAttached', function(sender, msg, w){
				if(w == $this){
					// update header
					if(!$this.options.viewMode){
						$this.updateTabHeader();
					} else {
                     	this.createUniBtns();
                    }
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
				$this.widget.ensureInitialized(function(){
			    	 $this.getWidget().refresh(opts);
				});
			});

			this.subscribe('widgetSettings.updateValues', function(sender, msg, opts){
			    if(opts.entryId !== $this.getWidgetEntry().getId()){
			        return;
			    }

			    $this.getWidget().updateValues(opts.values, opts.sourceDesc);
			    $this.widget.ensureInitialized(function(){
			    	 $this.getWidget().refresh();
				});
			});

			if(opts && opts.showSettings){
			    this.publish('Workspace.Entry.open', $this.widgetEntry);
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
		
		localizeFilter: function(src){
		    if(!this.getOwner()) return;
			return this.getOwner().getFilterManager().localizeFilter(src);
		},
		
		constructFilterBySource: function(src){
		    if(!this.getOwner()) return;
			return this.getOwner().getFilterManager().constructFilterBySource(src);
		},

		constructFilterByLocal: function(filters, src){
		    if(!this.getOwner()) return;
			return this.getOwner().getFilterManager().constructFilterByLocal(filters, src);
		},

		hasFilter: function(fDesc){
		    if(!this.getOwner()) return;
			return this.getOwner().getFilterManager().hasFilter(fDesc);
		},
		
		addFilter: function(fDesc, sourceIds, widget){
		    if(!this.getOwner()) return;
			return this.getOwner().getFilterManager().addFilter(fDesc, sourceIds, widget);
		},
		
		removeFilter: function(fItemId, widget){
		    if(!this.getOwner()) return;
			return this.getOwner().getFilterManager().removeFilter(fItemId, widget);
		},
		
		clearFilters: function(widget){
		    if(!this.getOwner()) return;
			this.getOwner().getFilterManager().clearFilters(widget);
		},
		
		getFilterManager: function(){
			return this.getOwner().getFilterManager();
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

			if(!this.checkSchemeKeys(scheme)){
			    throw 'Ошибка! Не у всех элементов схемы присутствуют ключи!';
			}

			return scheme;
		},

		checkSchemeKeys: function(scheme){
		    var root = true;

            function checkKeys(scheme){
                switch(scheme.type){
                    case 'group':
                        if(!scheme.key){
                            if(!root){
                                return false;
                            } else {
                                root = false;
                            }
                        }

                        for(var i = 0; i < scheme.items.length; i++){
                            if(!checkKeys(scheme.items[i])) return false;
                        }
                        break;
                    case 'item':
                    case 'select':
                    case 'widget':
                        if(!scheme.key) return false;
                        break;
                }

                return true;
            }

            return checkKeys(scheme);
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
					    $this.publish('Workspace.Entry.open', $this.widgetEntry);
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

                this.createUniBtns();
			}
			editor.setData(this.getName());
		},

		createUniBtns: function(){
		    if(!this.getContainer()){
		        return;
		    }

		    var tab = $this.getContainer().getTab($this.getId()).tab.find('._dwp_tabText'),
		        keys = [{
                            key: 'xls',
                            element: 'Excel'
                        },{
                            key: 'csv',
                            element: 'CSV'
                        },{
                            key: 'png',
                            element: 'Изображение'
                        }];

            var exportBtn = new Button({
                cssClass: 'roundButton btnExport btn10',
                tooltip: 'Экспорт',
                onClick: function(evt){
                    ToolManager.activate({
                        id: '_dwp_droplistTool',
                        cmd: 'show',
                        data: keys,
                        target: {
                            selector: exportBtn.getElement(),
                            dock: 'bottom'
                        },
                        callback: function(key, item, evt){
                            $this.widget.exportData(key);
                        }
                    });
                }
            });
            tab.append(exportBtn.getElement());

            var fullScreenBtn = new Button({
                cssClass: 'roundButton btnFullScreen btn10',
                tooltip: 'На полный экран',
                onClick: function(evt){
                    fullScreenBtn.toggleClass('collapse');
                    $this.getContainer().toggleClass('fullScreenMod');
                }
            });
            tab.append(fullScreenBtn.getElement());
		}
	}
}