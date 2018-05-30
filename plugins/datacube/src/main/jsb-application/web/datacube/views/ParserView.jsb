{
	$name: 'DataCube.ParserView',
	$parent: 'JSB.Workspace.BrowserView',
	$client: {
	    $require: ['Unimap.Controller',
	               'Unimap.ValueSelector',
	               'JSB.Controls.Select',
	               'DataCube.ParserManager',
	               'Datacube.Unimap.Bootstrap',
                   'JSB.Controls.ScrollBox',
                   'JSB.Widgets.SplitBox',
                   'DataCube.Widgets.WidgetWrapper',
                   'JSB.Widgets.PrimitiveEditor',
                   'JSB.Widgets.Button'
        ],

		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('ParserView.css');
			this.addClass('parserView');

            this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);

            this.saveBtn = new Button({
                cssClass: "btnOk",
                caption: "Сохранить настройки",
                onClick: function(){
                    $this.applySettings();
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());

            this.saveBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Обновить",
                onClick: function(){
                    $this.updatePreview();
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());
            
            var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.33
			});
			this.append(splitBox);

			this.schemeScroll = new ScrollBox();
			splitBox.append(this.schemeScroll.getElement());
			
			var parserSelectorElt = this.$('<div class="parserSelector"></div>').append('<div class="label">Парсер</div>');
			this.parserSelectorCombo = new Select({
				onchange: function(val){
					$this.setParser(val.key);
				}
			});
			parserSelectorElt.append(this.parserSelectorCombo.getElement());
			this.schemeScroll.append(parserSelectorElt);
			

	        this.widgetBlock = this.$('<div class="widgetBlock"></div>');
	        splitBox.append(this.widgetBlock);
	        
	        this.subscribe('Unimap.Render.ParserSourceBinding.analyze', function(sender, msg, params){
	        	$this.extractStructure(sender);
	        });
	        
	        this.subscribe('ParserManager.analysisComplete', function(sender, msg, params){
	        	if(params.entry != $this.entry){
	        		return;
	        	}
	        	$this.applyValues(params.struct, params.values);
	        });
		},

		refresh: function(){
			this.entry = this.node.getEntry();
			ParserManager.getSupportedParsers(this.entry, function(parsers){
				$this.setParsers(parsers);
			});

/*
            if(this.widgetSchemeRenderer){
                this.widgetSchemeRenderer.destroy();
            }

            this.wrapper.ensureWidgetInitialized(function(){
                var widget = $this.wrapper.getWidget();

                $this.widgetSchemeRenderer = new Controller({
                    scheme: widget.getEntry().extractWidgetScheme(),
                    values: widget.getValues(),
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
*/
		},
		
		setParsers: function(parsers){
			$this.parsers = parsers;
			var comboOpts = {};
			for(var i = 0; i < $this.parsers.length; i++){
				var pDesc = $this.parsers[i];
				comboOpts[pDesc.jsb] = pDesc.name;
			}
			$this.parserSelectorCombo.setOptions(comboOpts);
			if($this.parsers.length > 0){
				var currentParserKey = $this.parsers[0].jsb;
				$this.setParser(currentParserKey);
				$this.parserSelectorCombo.setValue(currentParserKey);
			}
		},
		
		setParser: function(parserKey){
			if($this.currentParser && $this.currentParser == parserKey){
				return;
			}
			for(var i = 0; i < $this.parsers.length; i++){
				var pDesc = $this.parsers[i];
				if(pDesc.jsb == parserKey){
					$this.currentParser = parserKey;
					if($this.schemeRenderer){
						$this.schemeRenderer.destroy();
					}
					
					var bootstrap = 'Datacube.Unimap.Bootstrap';
					var valSel = new ValueSelector({
						bootstrap: bootstrap
					});
					var vals = valSel.createDefaultValues(pDesc.scheme);
					
					$this.schemeRenderer = new Controller({
	                    scheme: pDesc.scheme,
	                    values: vals,
	                    bootstrap: bootstrap,
	                    onchange: function(key, values){
	                    }
	                });
					$this.schemeScroll.append($this.schemeRenderer.getElement());
					return;
				}
			}
		},
		
		extractStructure: function(parserBinding){
			ParserManager.server().runStructureAnalyzing($this.entry, $this.currentParser, $this.schemeRenderer.getValues());
			
		},
		
		applyValues: function(struct, values){
			debugger;
			$this.schemeRenderer.findRenderByKey('structure').setScheme(struct);
		},
		
		updatePreview: function(){
			// TODO: perform validation
			
			ParserManager.server().executePreview($this.entry, $this.currentParser, $this.schemeRenderer.getValues(), function(){
				debugger;
			});
		},
/*
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

            this.getElement().loader({message:'Сохранение...'});
            this.entry.server().storeValues({
                name: this.titleEditor.getData().getValue(),
                sourcesIds: sourcesIds,
                values: values
            }, function(sourceDesc){
                $this.getElement().loader('hide');

                $this.publish('widgetSettings.updateValues', {
                    entryId: $this.entry.getId(),
				    sourceMap: sourceDesc.sourceMap,
				    sources: sourceDesc.sources,
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
		*/
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 1,
				acceptNode: ['DataCube.JsonFileNode','DataCube.ExcelFileNode', 'DataCube.CsvFileNode', 'DataCube.XmlFileNode'],
				caption: 'Парсер',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCINCiAgIGhlaWdodD0iMTAwcHgiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMTAwIDEwMCINCiAgIHdpZHRoPSIxMDBweCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpZD0ic3ZnMiINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0iaWZfU3RvcmFnZV9fQ29udGVudF9EZWxpdmVyeV9BV1NfSW1wb3J0X0V4cG9ydF8yNTkyNTAuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhMTIxIj48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzMTE5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTU1MyINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iODQ1Ig0KICAgICBpZD0ibmFtZWR2aWV3MTE3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjIuMzYiDQogICAgIGlua3NjYXBlOmN4PSI1MCINCiAgICAgaW5rc2NhcGU6Y3k9IjUwIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+PGcNCiAgICAgaWQ9IkxheWVyXzEiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEuNzI1OTYwMiwwLDAsMS43MjU5NjAyLC0zNi41MTc5OTMsLTM1LjU1NTg1NykiPjxnDQogICAgICAgaWQ9Imc1Ij48Zw0KICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICBpZD0iZzciPjxnDQogICAgICAgICAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIg0KICAgICAgICAgICBpZD0iZzkiPjxkZWZzDQogICAgICAgICAgICAgaWQ9ImRlZnMxMSI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNzcuMDIzLDI3LjM1MiAwLDIuNjE1IGMgMCwzLjIwNyAtMTIuNTA4LDUuNzk1IC0yNy45NTMsNS43OTUgLTE1LjQyNiwwIC0yNy45NTEsLTIuNTg4IC0yNy45NTEsLTUuNzk1IGwgMCwtMi42MTUgYyAwLDMuMjA3IDEyLjUyNSw1Ljc5NSAyNy45NTEsNS43OTUgMTUuNDQ2LC0xMGUtNCAyNy45NTMsLTIuNTg4IDI3Ljk1MywtNS43OTUgeiINCiAgICAgICAgICAgICAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIg0KICAgICAgICAgICAgICAgaWQ9IlNWR0lEXzIzXyINCiAgICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PC9kZWZzPjxjbGlwUGF0aA0KICAgICAgICAgICAgIGlkPSJTVkdJRF8yXyIgLz48Zw0KICAgICAgICAgICAgIGNsaXAtcGF0aD0idXJsKCNTVkdJRF8yXykiDQogICAgICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICAgICAgaWQ9ImcxNSI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNzcuMDIzLDI3LjM1MiAwLDIuNjE1IGMgMCwwLjA3MiAtMC4wMDgsMC4xNDUgLTAuMDIsMC4yMTcgbCAwLC0yLjYxNCBjIDAuMDEzLC0wLjA3NCAwLjAyLC0wLjE0NiAwLjAyLC0wLjIxOCINCiAgICAgICAgICAgICAgIGlkPSJwYXRoMTciDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48cGF0aA0KICAgICAgICAgICAgICAgZD0ibSA3Ny4wMDQsMjcuNTcgMCwyLjYxMyBjIC0wLjAxNCwwLjA4NCAtMC4wMzcsMC4xNjYgLTAuMDY4LDAuMjQ4IGwgMCwtMi42MTMgYyAwLjAzMSwtMC4wODQgMC4wNTQsLTAuMTY2IDAuMDY4LC0wLjI0OCINCiAgICAgICAgICAgICAgIGlkPSJwYXRoMTkiDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48cGF0aA0KICAgICAgICAgICAgICAgZD0ibSA3Ni45MzYsMjcuODE4IDAsMi42MTMgYyAtMC4wNDcsMC4xMTkgLTAuMTA5LDAuMjM4IC0wLjE4OSwwLjM1NSBsIDAsLTIuNjE1IGMgMC4wNzksLTAuMTE2IDAuMTQyLC0wLjIzMyAwLjE4OSwtMC4zNTMiDQogICAgICAgICAgICAgICBpZD0icGF0aDIxIg0KICAgICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNzYuNzQ2LDI4LjE3MiAwLDIuNjE1IGMgLTEuOTIsMi44MTYgLTEzLjU3Miw0Ljk3NSAtMjcuNjc2LDQuOTc1IC0xNS40MjYsMCAtMjcuOTUxLC0yLjU4OCAtMjcuOTUxLC01Ljc5NSBsIDAsLTIuNjE1IGMgMCwzLjIwNyAxMi41MjUsNS43OTUgMjcuOTUxLDUuNzk1IDE0LjEwNCwtMTBlLTQgMjUuNzU2LC0yLjE1OSAyNy42NzYsLTQuOTc1Ig0KICAgICAgICAgICAgICAgaWQ9InBhdGgyMyINCiAgICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48L2c+PGcNCiAgICAgICAgICAgaWQ9ImcyNSI+PHBhdGgNCiAgICAgICAgICAgICBkPSJtIDQ5LjA3LDIxLjU1OSBjIDE1LjQ0NSwwIDI3Ljk1MywyLjU4NiAyNy45NTMsNS43OTMgMCwzLjIwNyAtMTIuNTA4LDUuNzk1IC0yNy45NTMsNS43OTUgLTE1LjQyNiwwIC0yNy45NTEsLTIuNTg4IC0yNy45NTEsLTUuNzk1IDAsLTMuMjA3IDEyLjUyNiwtNS43OTMgMjcuOTUxLC01Ljc5MyB6Ig0KICAgICAgICAgICAgIGlkPSJwYXRoMjciDQogICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojZTE1MzQzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzI5Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iNDQuNjIzLDQ3LjkzIDQ0LjQ0MSw0NS4xNiA1OS42OTUsNDUuMzE2IDU5LjY5NSw0Ny45MyAiDQogICAgICAgICAgICAgaWQ9InBvbHlnb24zMSINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzMzIj48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iMzQuMzcxLDQwLjk5IDMzLjkyLDM3LjkzIDQ1LjU0NSw0NS4zMDUgNDQuNjIzLDQ3LjkzICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjM1Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnMzciPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSIyMS4yNzksMzQuNDI4IDIxLjI3OSwzMS44MTIgMjUuNTg2LDQ1LjQ5MiAyNC45ODgsNDguMzQ4ICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjM5Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNDEiPjxyZWN0DQogICAgICAgICAgICAgaGVpZ2h0PSIyLjYxNSINCiAgICAgICAgICAgICB3aWR0aD0iOS4zODMwMDA0Ig0KICAgICAgICAgICAgIHg9IjI0Ljk4ODAwMSINCiAgICAgICAgICAgICB5PSI0NS43MzE5OTgiDQogICAgICAgICAgICAgaWQ9InJlY3Q0MyINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzQ1Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iNzIuODY3LDQ5LjQ4IDcyLjUyMyw0Ni40OTIgNzYuODYzLDMxLjgxMiA3Ni44NjMsMzQuNDI4ICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjQ3Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNDkiPjxwYXRoDQogICAgICAgICAgICAgZD0ibSA3Ni44NjMsMzEuODEyIC0zLjk5NiwxNS4wNTMgLTEzLjE3MiwtOC45MDggMCw3LjM1OSAtMTUuMDcyLDAgLTEwLjI1MiwtNi45NDEgMCw3LjM1NyAtOS4zODMsMCAtMy43MDksLTEzLjkyIGMgMS41MTYsMi45MTIgMTMuMzgxLDUuMTYgMjcuNzkxLDUuMTYgMTQuNDEyLDEwZS00IDI2LjI3OCwtMi4yNDcgMjcuNzkzLC01LjE2IHoiDQogICAgICAgICAgICAgaWQ9InBhdGg1MSINCiAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNlMTUzNDMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNTMiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI1OS42OTUsNDAuNTcyIDU5LjY5NSwzNy45NTcgNzIuODY3LDQ2Ljg2NSA3Mi44NjcsNDkuNDggIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNTUiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc1NyI+PHBvbHlnb24NCiAgICAgICAgICAgICBwb2ludHM9IjUwLjY2Niw1Mi43MjkgNTAuNjY2LDUwLjExMyA1OC4xNDYsNTUuNjExIDU4LjE0Niw1OC4yMjcgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNTkiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc2MSI+PHBvbHlnb24NCiAgICAgICAgICAgICBwb2ludHM9IjUxLjQyNiw2Mi42OTkgNTEuNDI2LDYwLjA4NiA2My44NCw2MC4xMzkgNjMuODQsNjIuNzU0ICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjYzIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNjUiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI0NC44NjcsNjIuOTA0IDQ0Ljg2Nyw2MC4yODkgNTEuMzYxLDU1LjY4IDUxLjM2MSw1OC4yOTMgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNjciDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc2OSI+PHJlY3QNCiAgICAgICAgICAgICBoZWlnaHQ9IjIuNjE1Ig0KICAgICAgICAgICAgIHdpZHRoPSIxMy4wNzIiDQogICAgICAgICAgICAgeD0iMjMuNjk4OTk5Ig0KICAgICAgICAgICAgIHk9IjYwLjU1Njk5OSINCiAgICAgICAgICAgICBpZD0icmVjdDcxIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNzMiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI2My44NCw2Ny45MDIgNjMuODQsNjUuMjg3IDc4Ljg4MSw1NS4yMjEgNzguODgxLDU3LjgzNiAiDQogICAgICAgICAgICAgaWQ9InBvbHlnb243NSINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzc3Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iNjMuODQsNjUuMjg3IDYzLjg0LDYwLjEzOSA1MS40MjYsNjAuMDg2IDU4LjE0Niw1NS42MTEgNTAuNjY2LDUwLjExMyA2My44NCw1MC4xNjggNjMuODQsNDUuMDMzIDc4Ljg4MSw1NS4yMjEgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNzkiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6I2UxNTM0MyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc4MSI+PHBvbHlnb24NCiAgICAgICAgICAgICBwb2ludHM9IjUxLjM2MSw1NS42OCA0NC45OTIsNjAuMjA3IDM2Ljc3MSw2NS43MDUgMzYuNzcxLDYwLjU1NyAyMy42OTksNjAuNTU3IDIzLjY5OSw1MC41ODYgMzYuNzcxLDUwLjU4NiAzNi43NzEsNDUuNDUxIDQzLjM1LDQ5Ljg5OCAiDQogICAgICAgICAgICAgaWQ9InBvbHlnb244MyINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojZTE1MzQzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzg1Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iMzYuNzcxLDY4LjMyIDM2Ljc3MSw2NS43MDUgNDQuOTkyLDYwLjIwNyA0NC45OTIsNjIuODIyICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjg3Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnODkiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI2Ny42MzksNzQuMzUyIDY3LjQ4Miw3Mi4wNzYgNjguNTU5LDY3LjkwNiA2OC41NTksNzAuNTIxICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjkxIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnOTMiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSIyOC42OTUsNjguMDIzIDI4LjY5NSw2NS40MDggMzEuMDQ1LDcyLjE4IDMwLjQzNiw3NC41NzQgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uOTUiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICAgIGlkPSJnOTciPjxkZWZzDQogICAgICAgICAgICAgaWQ9ImRlZnM5OSI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNjcuNjM5LDcxLjczNiAwLDIuNjE1IGMgMCwyLjEyOSAtOC4yNjYsNC4wOSAtMTguNTY4LDQuMDkgLTEwLjI5OSwwIC0xOC42MzUsLTEuNzI1IC0xOC42MzUsLTMuODY3IGwgMCwtMi42MTUgYyAwLDIuMTQzIDguMzM2LDMuODY3IDE4LjYzNSwzLjg2NyAxMC4zMDIsMCAxOC41NjgsLTEuOTU5IDE4LjU2OCwtNC4wOSB6Ig0KICAgICAgICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICAgICAgICBpZD0iU1ZHSURfMjVfIg0KICAgICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48L2RlZnM+PGNsaXBQYXRoDQogICAgICAgICAgICAgaWQ9IlNWR0lEXzRfIiAvPjxnDQogICAgICAgICAgICAgY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzRfKSINCiAgICAgICAgICAgICBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICINCiAgICAgICAgICAgICBpZD0iZzEwMyI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNjcuNjM5LDcxLjczNiAwLDIuNjE1IGMgMCwwLjAzNyAtMC4wMDQsMC4wNzggLTAuMDEyLDAuMTE1IGwgMCwtMi42MTUgYyAwLjAwOCwtMC4wMzcgMC4wMTIsLTAuMDc2IDAuMDEyLC0wLjExNSINCiAgICAgICAgICAgICAgIGlkPSJwYXRoMTA1Ig0KICAgICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNjcuNjI3LDcxLjg1MiAwLDIuNjE1IGMgLTAuMDA4LDAuMDQ1IC0wLjAyMSwwLjA5IC0wLjAzNywwLjEzMyBsIDAsLTIuNjEzIGMgMC4wMTUsLTAuMDQ2IDAuMDI5LC0wLjA4OSAwLjAzNywtMC4xMzUiDQogICAgICAgICAgICAgICBpZD0icGF0aDEwNyINCiAgICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjxwYXRoDQogICAgICAgICAgICAgICBkPSJtIDY3LjU5LDcxLjk4NiAwLDIuNjE0IGMgLTAuMDI3LDAuMDY2IC0wLjA2NiwwLjEzMyAtMC4xMTEsMC4xOTkgbCAwLC0yLjYxNSBjIDAuMDQ0LC0wLjA2NyAwLjA4MywtMC4xMzEgMC4xMTEsLTAuMTk4Ig0KICAgICAgICAgICAgICAgaWQ9InBhdGgxMDkiDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48cGF0aA0KICAgICAgICAgICAgICAgZD0ibSA2Ny40NzksNzIuMTg0IDAsMi42MTUgYyAtMS40MDQsMS45OCAtOC44MjYsMy42NDMgLTE4LjQwOCwzLjY0MyAtMTAuMjk5LDAgLTE4LjYzNSwtMS43MjUgLTE4LjYzNSwtMy44NjcgTCAzMC4yOTUsNzAuOTMgYyAwLDIuMTQzIDguNDc3LDQuODk2IDE4Ljc3NSw0Ljg5NiA5LjU4MiwwIDE3LjAwNCwtMS42NiAxOC40MDksLTMuNjQyIg0KICAgICAgICAgICAgICAgaWQ9InBhdGgxMTEiDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PC9nPjxnDQogICAgICAgICAgIGlkPSJnMTEzIj48cGF0aA0KICAgICAgICAgICAgIGQ9Im0gNjIuNTgsNjQuNTIgMCw3LjMzMiA1Ljk3OSwtMy45NDUgLTAuOTIsMy44MyBjIDAsMi4xMzEgLTguMjY2LDQuMDkgLTE4LjU2OCw0LjA5IC0xMC4yOTksMCAtMTguNjM1LC0xLjcyNSAtMTguNjM1LC0zLjg2NyBsIC0xLjc0LC02LjU1MSA1LjY3NiwwIDAsNy4zNDYgMTEuNTc0LC03Ljc2MiAxNi42MzQsLTAuNDczIHoiDQogICAgICAgICAgICAgaWQ9InBhdGgxMTUiDQogICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojZTE1MzQzIiAvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4='
			});
		}
		
		
	}
}