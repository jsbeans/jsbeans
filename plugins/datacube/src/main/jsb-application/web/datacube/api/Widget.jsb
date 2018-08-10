{
	$name: 'DataCube.Api.Widget',
	$parent: 'JSB.Widgets.Control',

	$client: {
		$require: ['DataCube.Widgets.FilterManager', 'DataCube.Api.WidgetController', 'JSB.Controls.Navigator'],
		
		options: {
			wsid: null,
			wid: null,
			onCreateWidget: null,
			onMessage: null,
			auto: true
		},
		widgetEntry: null,
		values: null,
		childWidgets: [],
		currentWidget: null,
		mainWidget: null,
		
		$constructor: function(opts){
			$base(opts);

			this.addClass('apiWidget');
			this.loadCss('Widget.css');
			
			var wsId = opts.wsid;
			var wId = opts.wid;
			this.server().getWidgetEntry(wsId, wId, function(wEntry){
				$this.widgetEntry = wEntry;
				$this.init();
			});
		},
		
		setWidgetInitialized: function(){
		    this.setTrigger('_widgetInitialized');
		},
		
		ensureWidgetInitialized: function(callback){
		    this.ensureTrigger('_widgetInitialized', callback);
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
                        filterManager: WidgetController.getFilterManager(),
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

		init: function(){
			JSB.lookup($this.getWidgetType(), function(WidgetClass){
				$this.mainWidget = new WidgetClass({
				    filterManager: WidgetController.getFilterManager(),
				    widgetEntry: $this.widgetEntry,
				    widgetWrapper: $this
				});
				$this.append($this.mainWidget);
				$this.mainWidget.ensureInitialized(function(){
					$this.setWidgetInitialized();
					$this.subscribe('DataCube.filterChanged', function(sender, msg, params){
						if(!JSB.isInstanceOf(sender, 'DataCube.Widgets.Widget')){
							return;
						}

						$this.mainWidget.refresh(params);
					});
					$this.subscribe('DataCube.Widget.eventFired', function(sender, msg, params){
						if($this.currentWidget != sender){
							return;
						}
						if($this.options.onMessage){
							if(JSB.isString($this.options.onMessage)){
								$this.options.onMessage = eval('(' + $this.options.onMessage + ')');
							}
							$this.options.onMessage.call($this, params.message, params.data);
						}
					});

					$this.publish('DataCube.Api.Widget.widgetCreated', {wsid: $this.options.wsid, wid: $this.options.wid});
					if($this.options.onCreateWidget){
						if(JSB.isString($this.options.onCreateWidget)){
							$this.options.onCreateWidget = eval('(' + $this.options.onCreateWidget + ')');
						}
						$this.options.onCreateWidget.call($this, $this.mainWidget);
					}
					if($this.options.auto){
						$this.mainWidget.refresh();
					}
				});

				$this.currentWidget = $this.mainWidget;
			});
		},
		
		getName: function(){
			return this.getWidgetEntry().getName();
		},
		
		getWidgetType: function(){
			return this.getWidgetEntry().getWidgetType();
		},
		
		getDashboard: function(){
			return this.getWidgetEntry().getDashboard();
		},
		
		getWidgetEntry: function(){
			return this.widgetEntry;
		},
		
		getWidget: function(){
			return $this.mainWidget;
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		getWidgetEntry: function(wsId, wId){
			var w = WorkspaceController.getWorkspace(wsId);
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