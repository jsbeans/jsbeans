{
	$name: 'DataCube.Widgets.WidgetWrapper',
	$parent: 'JSB.Widgets.Widget',

	widgetEntry: null,
	
	getWidgetType: function(){
		return this.widgetEntry.getWidgetType();
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
		$require: ['JQuery.UI.Loader',
		           'JSB.Widgets.Button',
		           'JSB.Widgets.PrimitiveEditor',
		           'JSB.Widgets.ToolManager',
		           'JSB.Controls.Navigator'],

		attached: false,
		childWidgets: [],
		currentWidget: null,
		mainWidget: null,
		owner: null,
		settingsVisible: false,
		
		options: {
			auto: true
		},
		
		$constructor: function(widgetEntry, owner, opts){
			$base(opts);
			this.widgetEntry = widgetEntry;
			this.owner = owner;

			this.loadCss('WidgetWrapper.css');
			this.addClass('widgetWrapper');
			
			this.setTitle(this.getWidgetEntry().getName());

			if(!this.options.viewMode){
				this.updateTabHeader();
			}

			JSB.lookup($this.getWidgetType(), function(WidgetClass){
				$this.mainWidget = new WidgetClass({
				    filterManager: owner ? owner.getFilterManager() : null,
				    widgetEntry: $this.widgetEntry,
				    widgetWrapper: $this
				});
				$this.append($this.mainWidget);

				$this.setWidgetInitialized();

				if($this.options.auto){
					$this.mainWidget.ensureInitialized(function(){
						$this.mainWidget.refresh();
					});
				}

				$this.currentWidget = $this.mainWidget;
			});

			this.subscribe('JSB.Widgets.WidgetContainer.widgetAttached', function(sender, msg, w){
				if(w == $this){
					// update header
					if(!$this.options.viewMode){
						$this.updateTabHeader();
					} else {
                     	$this.createButtons();
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
				$this.currentWidget.ensureInitialized(function(){
			    	 $this.currentWidget.refresh(opts);
				});
			});

			this.subscribe('widgetSettings.updateValues', function(sender, msg, opts){
			    if(opts.entryId !== $this.getWidgetEntry().getId()){
			        return;
			    }

			    $this.getWidget().updateValues(JSB.clone(opts));
			    $this.mainWidget.ensureInitialized(function(){
			    	 $this.getWidget().refresh({
			    	    updateStyles: true
			    	 });
				});
			});

			if(opts && opts.showSettings){
			    this.publish('Workspace.Entry.open', $this.widgetEntry);
			}
		},

		addDrilldownElement: function(opts){
		    if(!this._drilldownPanel){
		        this._drilldownPanel = new Navigator({
		            onclick: function(key, index){
		                $this.changeDrilldown(index);
		            }
		        });
		        this.prepend(this._drilldownPanel);

		        this._drilldownPanel.addElement({
		            key: 'root',
		            element: this.getWidgetEntry().getName()
		        });
		    } else {
		        this._drilldownPanel.removeClass('hidden');
		    }

            this._drilldownPanel.addElement({
                key: opts.widget.widgetWid,
                element: opts.widget.name
            });

            this.currentWidget.addClass('hidden');

            this.getElement().loader();
            this.server().getWidgetEntry(opts.widget.widgetWsid, opts.widget.widgetWid, function(entry, fail){
                if(fail){
                    $this.getElement().loader('hide');
                    return;
                }

                JSB.lookup(entry.wType, function(WidgetClass){
                    var widget = new WidgetClass({
                        filterManager: $this.owner ? $this.owner.getFilterManager() : null,
                        widgetEntry: entry,
                        widgetWrapper: $this
                    });
                    $this.append(widget);

                    widget.ensureInitialized(function(){
                        if(opts.filterOpts){
                            widget.setContextFilter(opts.filterOpts);
                        }
                        widget.refresh();
                    });

                    $this.currentWidget = widget;

                    $this.childWidgets.push(widget);

                    $this.getElement().loader('hide');
                });
            });
		},

		changeDrilldown: function(index){
            for(var i = index; i < this.childWidgets.length; i++){
                this.childWidgets[i].destroy();
            }

		    if(index === 0){
		        this._drilldownPanel.addClass('hidden');

		        this.currentWidget = this.mainWidget;
		    } else {
		        this.currentWidget = this.childWidgets[index - 1];
		    }

		    this.currentWidget.removeClass('hidden');
		    this.currentWidget.refresh();
		},

		createButtons: function(){
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
                            $this.mainWidget.exportData(key);
                        }
                    });
                }
            });
            tab.append(exportBtn.getElement());

            var fullScreenBtn = new Button({
                cssClass: 'roundButton btnFullScreen btn10',
                tooltip: 'На полный экран',
                onClick: function(evt){
                    $this.getContainer().toggleClass('fullScreenMode');
                }
            });
            tab.append(fullScreenBtn.getElement());
		},

		destroy: function(){
			if($this.mainWidget){
				$this.mainWidget.destroy();
			}

            for(var i = 0; i < this.childWidgets.length; i++){
                this.childWidgets[i].destroy();
            }

			$base();
		},

		ensureWidgetInitialized: function(callback){
		    this.ensureTrigger('_widgetInitialized', callback);
		},

		getOwner: function(){
			return this.owner;
		},
		
		getWidget: function(){
			return this.mainWidget;
		},

		setWidgetInitialized: function(){
		    this.setTrigger('_widgetInitialized');
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
					    var oldName = $this.getWidgetEntry().getName();

						$this.getWidgetEntry().server().setName(val, function(res, fail){
						    if(fail){
						        editor.setData(oldName);
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
							text: 'Вы уверены что хотите удалить виджет "' + $this.getWidgetEntry().getName() + '" ?',
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

                this.createButtons();
			}
			editor.setData(this.getWidgetEntry().getName());
		}
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],

		getWidgetEntry: function(wsId, wId){
			var wm = WorkspaceController.ensureManager('datacube');
			if(!wm){
				throw new Error('Internal error: missing WorkspaceManager for datacube');
			}

			var w = wm.workspace(wsId);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + wsId);
			}

			var widgetEntry = w.entry(wId);
			if(!widgetEntry || !JSB.isInstanceOf(widgetEntry, 'DataCube.Model.Widget')){
				throw new Error('Unable to find widget with id: ' + wId);
			}

			return widgetEntry;
		}
	}
}