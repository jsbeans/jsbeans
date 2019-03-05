{
	$name: 'DataCube.SettingsView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$expose: {
		priority: 0.4,
		acceptNode: ['DataCube.SettingsNode'],
		acceptEntry: ['DataCube.Model.SettingsEntry'],
		caption: 'Настройки',
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgZGF0YS1uYW1lPSJMYXllciAzIgogICBpZD0iTGF5ZXJfMyIKICAgdmlld0JveD0iMCAwIDI2IDI2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJzZXR0aW5ncy5zdmciCiAgIHdpZHRoPSIyNiIKICAgaGVpZ2h0PSIyNiI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMjUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTYxMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA0IgogICAgIGlkPSJuYW1lZHZpZXcyMyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSIKICAgICBpbmtzY2FwZTpndWlkZS1iYm94PSJ0cnVlIgogICAgIGlua3NjYXBlOnpvb209IjIwLjg1OTY1IgogICAgIGlua3NjYXBlOmN4PSI3Ljg0MDgxOTUiCiAgICAgaW5rc2NhcGU6Y3k9IjE1LjgzMjkyOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMjE3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxOSIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzMiPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMy4wMTY5NDkyLDI0Ljg4MTM1NiIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MjAwIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMjguMzA1MDg1LDkuMDE2OTQ5MiIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MjA0IiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMjguMTY5NDkyLDEwIgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQyMTAiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIyOC4xNjk0OTIsNi4wNjc3OTY2IgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQyMTIiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIyOC44ODEzNTYsMjAiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDIxNiIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI4LjY0NDA2OCwyMy4wMTY5NDkiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDIxOCIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI4LjY0NDA2OCwxMy4wMTY5NDkiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDIyMiIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjEzLjY5NDkxNSwzLjAxNjk0OTIiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDIyNCIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI4Ljc3OTY2MSwxNy4wMTY5NDkiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDIyOCIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI4LjUwODQ3NSwxNiIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MjMwIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iNS45ODMwNTA5LDE0IgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTQyNjIiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSI5LjAwMDYzMDQsMjEuMzA5MDgyIgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTQyNjQiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIxMCwyNS42NjEwMTciCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDI2NiIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI1LjAwNjQxMiwyMS42NTA2NTEiCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDI2OCIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI3LjgzMDUwOSwxNC45ODMwNTEiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDI3MCIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjI0LjA2Nzc5NywxOC45ODMwNTEiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDI3MiIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjIyLjY0NDA2OCwyMC45ODMwNTEiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDI3NCIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjEzLDE0IgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQyNzciIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPGRlZnMKICAgICBpZD0iZGVmczMiPgogICAgPHN0eWxlCiAgICAgICBpZD0ic3R5bGU1Ij4uY2xzLTEsLmNscy0ye2ZpbGw6bm9uZTtzdHJva2U6IzA4MzJmZjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5jbHMtMXtzdHJva2Utd2lkdGg6MnB4O30uY2xzLTN7ZmlsbDojMDgzMmZmO308L3N0eWxlPgogIDwvZGVmcz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMxODY0OWY7c3Ryb2tlLXdpZHRoOjIuMDQxNzMzMDM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgZD0ibSAxMC4wMjM1OCw2LjAyMzQzNzUgMTQuOTQ4OTI5LDAgLTE0Ljk0ODkyOSwwIHoiCiAgICAgaWQ9ImxpbmU5IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBjbGFzcz0iY2xzLTIiCiAgICAgZD0ibSA1LjQ2Mzg2NDksMTIuOTQ2MzUgYSAyLjU1MzY1NzEsMi41NTM2NTcxIDAgMCAxIC0yLjQ1NTQzOTYsMi41MjkxMDMgMi41NTM2NTcxLDIuNTUzNjU3MSAwIDAgMSAtMi40NTU0Mzk2NCwtMi41MjkxMDMgMi40NTU0Mzk4LDIuNDU1NDM5OCAwIDEgMSA0LjkxMDg3OTI0LDAgeiIKICAgICBpZD0icGF0aDExIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2Q0NTUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzhlMzkwMDtzdHJva2Utd2lkdGg6MS4wMjg5OTg4NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KICA8bGluZQogICAgIGNsYXNzPSJjbHMtMSIKICAgICB4MT0iMTAuMDQ1OTM4IgogICAgIHgyPSIyNC45NDEwMTEiCiAgICAgeTE9IjEyLjk5OTgyNSIKICAgICB5Mj0iMTIuOTk5ODI1IgogICAgIGlkPSJsaW5lMTUiCiAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzE4NjQ5ZjtzdHJva2Utd2lkdGg6Mi4wMzc5NjIyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogIDxsaW5lCiAgICAgY2xhc3M9ImNscy0xIgogICAgIHgxPSIxMC4wNjE4NDUiCiAgICAgeDI9IjI0Ljk0MjA1NSIKICAgICB5MT0iMTkuOTc1MzU5IgogICAgIHkyPSIxOS45NzUzNTkiCiAgICAgaWQ9ImxpbmUxOSIKICAgICBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMTg2NDlmO3N0cm9rZS13aWR0aDoyLjAzNjk0NDg3O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogIDxwYXRoCiAgICAgY2xhc3M9ImNscy0yIgogICAgIGQ9Im0gNS40NTUyMzAzLDUuOTY0MzI2MyBhIDIuNTUzNjU4MiwyLjU1MzY1ODIgMCAwIDEgLTIuNDU1NDQwNSwyLjUyOTEwNSAyLjU1MzY1ODIsMi41NTM2NTgyIDAgMCAxIC0yLjQ1NTQ0MDkyLC0yLjUyOTEwNSAyLjQ1NTQ0MDgsMi40NTU0NDA4IDAgMSAxIDQuOTEwODgxNDIsMCB6IgogICAgIGlkPSJwYXRoMTEtNiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMxODY0OWY7c3Ryb2tlLXdpZHRoOjEuMDI4OTk5MzM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgPHBhdGgKICAgICBjbGFzcz0iY2xzLTIiCiAgICAgZD0ibSA1LjQ5MDI3NjgsMTkuOTQ3MTI5IGEgMi41NTQxOTg5LDIuNTU0MTk4OSAwIDAgMSAtMi40NTU5NjA1LDIuNTI5NjQgMi41NTQxOTg5LDIuNTU0MTk4OSAwIDAgMSAtMi40NTU5NjA3NSwtMi41Mjk2NCAyLjQ1NTk2MDcsMi40NTU5NjA3IDAgMSAxIDQuOTExOTIxMjUsMCB6IgogICAgIGlkPSJwYXRoMTEtNi01IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzE4NjQ5ZjtzdHJva2Utd2lkdGg6MS4wMjkyMTcyNDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KPC9zdmc+Cg=='
	},
	
	$client: {
	    $require: ['Unimap.Controller',
                   'JSB.Controls.ScrollBox',
                   'JSB.Widgets.Button',
                   'css:SettingsView.css'
        ],

		$constructor: function(opts){
			$base(opts);
			
			this.addClass('settingsView');

            this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);

            if(!$this.options.dontSave){
	            var saveBtn = new Button({
	                cssClass: "btnOk",
	                caption: "Сохранить",
	                onClick: function(){
	                    $this.applySettings();
	                }
	            });
	            this.titleBlock.append(saveBtn.getElement());
            }

			this.schemeBlock = this.$('<div class="schemeBlock"></div>');
			this.append(this.schemeBlock);

	        this.schemeScroll = new ScrollBox();
	        this.schemeBlock.append(this.schemeScroll.getElement());

	        this.warningBlock = this.$('<div class="warningBlock hidden"></div>');
	        this.schemeBlock.append(this.warningBlock);
	        
	        this.subscribe('DataCube.Model.SettingsEntry.settingsUpdated', function(sender, msg, settings){
	        	if(sender != $this.getCurrentEntry()){
	        		return;
	        	}
	        	$this.refresh();
	        })
		},

		refresh: function(){
			this.entry = this.getCurrentEntry();

            $this.schemeBlock.loader();
            $this.entry.loadSettings(function(settings){
            	$this.entry.loadSettingsScheme(function(scheme){
                    if($this.widgetSchemeRenderer){
                        $this.widgetSchemeRenderer.destroy();
                    }

                    $this.widgetSchemeRenderer = new Controller({
                        context: $this.entry,
                        scheme: scheme,
                        values: settings
                    });
                    $this.schemeScroll.append($this.widgetSchemeRenderer.getElement());

                    $this.schemeBlock.loader('hide');
            	});
            });
		},
		

		applySettings: function(){
			if($this.options.dontSave){
				return;
			}

            if(this.updateValidation()){
    		    var values = this.widgetSchemeRenderer.getValues();
	            this.getElement().loader({message:'Сохранение...'});
	            this.entry.saveSettings(values, function(){
	                $this.getElement().loader('hide');
	            });
            }
		},

		setChanges: function(){
		    if(!this.warningBlock.hasClass('hidden')){
		        this.updateValidation();
		    }

		    var sourcesIds = this.extractSourceIds();
		    var sources = {};
		    for(var i = 0; i < sourcesIds.length; i++){
		    	sources[sourcesIds[i]] = JSB.getInstance(sourcesIds[i]);
		    }

		    this.wrapper.getWidget().updateValues({
		    	values: this.widgetSchemeRenderer.getValues(),
		    	sources: sources
		    });

            this.wrapper.getWidget().ensureInitialized(function(){
                $this.wrapper.getWidget().refresh({
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
                return false;
            } else {
                this.warningBlock.addClass('hidden');
                this.schemeScroll.getElement().outerHeight('100%');
            }
            return true;
		}
	}
	
}