{
	$name: 'DataCube.WidgetSettingsView',
	$parent: 'JSB.Workspace.BrowserView',
	$client: {
	    $require: ['DataCube.Widgets.WidgetSchemeRenderer',
                   'JSB.Widgets.ScrollBox',
                   'DataCube.Widgets.WidgetWrapper',
                   'JSB.Widgets.PrimitiveEditor',
                   'JSB.Widgets.Button'
        ],
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('WidgetSettingsView.css');
			this.addClass('widgetSettingsView');

            this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);

            this.titleEditor = new PrimitiveEditor();
            this.titleBlock.append(this.titleEditor.getElement());

            this.saveBtn = new Button({
                cssClass: "btnOk",
                caption: "Сохранить",
                onClick: function(){
                    $this.applySettings();
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());

            this.saveBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Обновить данные",
                onClick: function(){
                    $this.updateData();
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());

	        this.schemeBlock = new ScrollBox();
	        this.append(this.schemeBlock);
	        this.schemeBlock.addClass('schemeBlock');

	        this.widgetBlock = this.$('<div class="widgetBlock"></div>');
	        this.append(this.widgetBlock);

	        this.savedMessage = this.$('<div class="savedMessage" style="display: none;">Изменения сохранены!</div>');
	        this.savedMessage.click(function(){
	            $this.savedMessage.css('display', 'none');
	        });
	        this.append(this.savedMessage);
		},

		refresh: function(){
		    JSB.defer(function(){
		        $this._refresh();
		    }, 300, 'widgetSettingsView_refresh' + this.getId());
		},

		_refresh: function(){
			this.entry = this.node.getEntry();

            if(this.wrapper) this.wrapper.destroy();
            this.wrapper = new WidgetWrapper(this.entry, null, { isCacheMod: true });
            this.widgetBlock.append(this.wrapper.getElement());

            if(this.widgetSchemeRenderer) this.widgetSchemeRenderer.destroy();
            JSB().deferUntil(function(){
                $this.widgetSchemeRenderer = new WidgetSchemeRenderer({
                    scheme: $this.wrapper.extractWidgetScheme(),
                    values: JSB.clone($this.wrapper.getValues()),
                    wrapper: $this.wrapper,
                    onChange: function(){
                        if(this.scheme.binding === 'field') return; // need data update
                        JSB().defer(function(){
                            $this.setChanges();
                        }, 800, "widgetSettingsView_setChanges" + $this.getId());
                    }
                });
                $this.schemeBlock.append($this.widgetSchemeRenderer.getElement());
            }, function(){
                return $this.wrapper.getWidget() !== null;
            });

            this.titleEditor.setData(this.entry.name);
		},

		updateData: function(){
		    this.wrapper.values = this.widgetSchemeRenderer.getValues();
		    this.wrapper.getWidget().updateValues(JSB.clone(this.wrapper.values));
		    this.wrapper.getWidget().refresh({
                isCacheMod: true
            });
		},

		applySettings: function(){
		    this.savedMessage.fadeIn(1600, "linear", function(){
		        $this.savedMessage.fadeOut(1600, "linear");
		    });
		    var title = this.titleEditor.getData().getValue();
		    this.wrapper.values = this.widgetSchemeRenderer.getValues();

            this.entry.server().storeValues(title, this.wrapper.values, function(sourceDesc){
                // $this.wrapper.getWidget().updateValues(JSB.clone($this.wrapper.values), sourceDesc);
                $this.publish('widgetSettings.updateValues', {
                    entryId: $this.wrapper.getWidgetEntry().getId(),
                    values: JSB.clone($this.wrapper.values),
                    sourceDesc: sourceDesc
                });
            });
		},

		setChanges: function(){
            this.wrapper.values = this.widgetSchemeRenderer.getValues();
            this.wrapper.getWidget().updateValues(JSB.clone(this.wrapper.values));
            try{
                this.wrapper.getWidget().refresh({
                    refreshFromCache: true
                });
            } catch(ex){
                //console.log(ex);
            }
		}
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: ['DataCube.WidgetNode'],
				caption: 'Настройка'
			});
		},
	}
}