{
	$name: 'DataCube.WidgetSettingsView',
	$parent: 'JSB.Workspace.BrowserView',
	$client: {
	    $require: ['Unimap.Controller',
	               'Datacube.Unimap.Bootstrap',
                   'JSB.Controls.ScrollBox',
                   'JSB.Widgets.SplitBox',
                   'DataCube.Widgets.WidgetWrapper',
                   'JSB.Widgets.PrimitiveEditor',
                   'JSB.Widgets.Button',
                   'DataCube.SaveMessage'
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
                caption: "Обновить",
                onClick: function(){
                    $this.setChanges(true);
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());
            
            var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.5
			});
			this.append(splitBox);

			var schemeBlock = this.$('<div class="schemeBlock"></div>');
			splitBox.append(schemeBlock);

	        this.schemeScroll = new ScrollBox();
	        schemeBlock.append(this.schemeScroll.getElement());

	        this.warningBlock = this.$('<div class="warningBlock hidden"></div>');
	        schemeBlock.append(this.warningBlock);

	        this.widgetBlock = this.$('<div class="widgetBlock"></div>');
	        splitBox.append(this.widgetBlock);

	        // todo: add save msg
            this.savedMessage = this.$('<div class="savedMessage" style="display: none;">Изменения сохранены!</div>');
            this.savedMessage.click(function(){
                $this.savedMessage.css('display', 'none');
            });
            this.append(this.savedMessage);
		},

		refresh: function(){
			this.entry = this.node.getEntry();

            if(this.wrapper) {
                this.wrapper.destroy();
            }

            this.wrapper = new WidgetWrapper(this.entry, null, { isCacheMod: true, designMode: true });
            this.widgetBlock.append(this.wrapper.getElement());

            if(this.widgetSchemeRenderer){
                this.widgetSchemeRenderer.destroy();
            }

            this.wrapper.ensureWidgetInitialized(function(){
                $this.widgetSchemeRenderer = new Controller({
                    scheme: $this.entry.extractWidgetScheme(),
                    values: JSB.clone($this.entry.getValues()),
                    bootstrap: 'Datacube.Unimap.Bootstrap',
                    onchange: function(key, values){
                        if(values.render === 'dataBinding' || values.render === 'sourceBinding'){
                            return;
                        }

                        JSB().defer(function(){
                            $this.setChanges();
                        }, 800, "widgetSettingsView_setChanges" + $this.getId());
                    }
                });
                $this.schemeScroll.append($this.widgetSchemeRenderer.getElement());
            });

            this.titleEditor.setData(this.entry.name);
		},

		applySettings: function(){
		    var values = this.widgetSchemeRenderer.getValues();

		    var sources = this.widgetSchemeRenderer.findRendersByRender('sourceBinding'),
		        sourcesIds = [];

            for(var i = 0; i < sources.length; i++){
                var s = sources[i].getValues();

                for(var j = 0; j < s.values.length; j++){
                    if(s.values[j].binding){
                        sourcesIds.push(s.values[j].binding.source);
                    }
                }
            }

            this.updateValidation();

            $this.savedMessage.fadeIn(1600, "linear", function(){
                $this.savedMessage.fadeOut(1600, "linear");
            });

            this.entry.server().storeValues({
                name: this.titleEditor.getData().getValue(),
                sourcesIds: sourcesIds,
                values: values
            }, function(sourceDesc){
                $this.publish('widgetSettings.updateValues', {
                    entryId: $this.entry.getId(),
                    sourceDesc: sourceDesc,
                    values: values
                });
            });
		},

		setChanges: function(isUpdateData){
		    if(!this.warningBlock.hasClass('hidden')){
		        this.updateValidation();
		    }

		    this.wrapper.getWidget().updateValues({values: this.widgetSchemeRenderer.getValues()});

            this.wrapper.getWidget().ensureInitialized(function(){
                $this.wrapper.getWidget().refresh({
                    isCacheMod: isUpdateData,
                    refreshFromCache: !isUpdateData,
                    updateStyles: true
                });
        	});
		},

		updateValidation: function(){
		    this.warningBlock.empty();

            var validate = this.widgetSchemeRenderer.validate();
            if(validate.length > 0){
                this.warningBlock.removeClass('hidden');

                for(var i = 0; i < validate.length; i++){
                    this.warningBlock.append('<p>Поле <b>' + validate[i].name + '</b> обязательно к заполнению!</p>');
                }

                var warningBlockHeight = this.warningBlock.outerHeight();

                if(warningBlockHeight > 200){
                    this.warningBlock.outerHeight(200);
                    this.schemeScroll.getElement().outerHeight('calc(100% - 200px)');
                } else {
                    this.schemeScroll.getElement().outerHeight('calc(100% - ' + warningBlockHeight + 'px)');
                }
            } else {
                this.warningBlock.addClass('hidden');
                this.schemeScroll.getElement().outerHeight('100%');
            }
		}
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 1,
				acceptNode: ['DataCube.WidgetNode'],
				caption: 'Настройка',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9IndpZGdldHMuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNDEiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMzOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXczNyINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIyNC42Nzk3MzgiDQogICAgIGlua3NjYXBlOmN4PSIxOC45NTU3OTMiDQogICAgIGlua3NjYXBlOmN5PSIxMC43MjYzOTEiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz48Zw0KICAgICBpZD0iZzQyMTYiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDIuOTk1MDA4MywwLDAsMi45OTUwMDgzLC01LjIyNDg4MywtNzIuMzg5NTk0KSI+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ0NzgyMTtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDcuNjkwNjA1LDI1LjU1MTk2IGMgLTAuODE5NTkyLDAuNjEzNjc1IC0xLjYyODk5LDEuMjIxMjMzIC0yLjQ2Mjg1NCwxLjg0NTEwMSBsIDAsLTMuMTYyMTU3IGMgMC43NDYxOTYsLTAuMDczNCAyLjAyNjU1MywwLjYwNTUyIDIuNDYyODU0LDEuMzE3MDU2IHoiDQogICAgICAgaWQ9InBhdGg4LTctMiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzAwNjY4MDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDQuNzIzMDY2MywyNC41MDAyNDQgMCwxLjg2NTQ4OSBjIDAsMC4zODk0MDggLTAuMDA2MSwwLjc4MDg1NSAwLjAwNDEsMS4xNzAyNjMgMC4wMDIsMC4wOTc4NiAwLjAzMDU4LDAuMjA1OTE4IDAuMDgzNTksMC4yODc0NjkgMC40ODMxOTMsMC43NjI1MDYgMC45NzY1NzksMS41MTg4OTYgMS40NjM4NDksMi4yNzczMjQgbCAwLjE3NzM3NCwwLjI3NTIzNiBjIC0wLjg2ODUyMywwLjU1MjUxMSAtMi4yNzkzNjMsMC42MTU3MTQgLTMuMzcyMTUyLC0wLjE3NTMzNSAtMS4xMTExNiwtMC44MDMyODIgLTEuNTgyMTIsLTIuMjE2MTYxIC0xLjE3MDI4NSwtMy41MTA3OSAwLjM5NTUyNCwtMS4yNDk3NzYgMS41NzM5NDMsLTIuMTczMzQ2IDIuODEzNTI0LC0yLjE4OTY1NiB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItOSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjIg0KICAgICAgIHN0eWxlPSJmaWxsOiNhYTQ0MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgZD0ibSA3LjAyMTE5OTYsMzAuNDAyMzgzIGMgLTAuNTQ0MzU2LC0wLjg0NDA1NyAtMS4wODg3MTIsLTEuNjg4MTE1IC0xLjY0MTIyMywtMi41NDIzNjYgMC44NTgzMjksLTAuNjQyMjE4IDEuNzAyMzg3LC0xLjI3NDI0MSAyLjU0ODQ4MywtMS45MDgzMDQgMC44NjAzNjgsMS4yODY0NzQgMC41OTUzMjUsMy40MDA2OTUgLTAuOTA3MjYsNC40NTA2NyB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItNSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvZz48Zw0KICAgICBpZD0iZzciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9Imc5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzE1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PC9zdmc+'
			});
		},
	}
}