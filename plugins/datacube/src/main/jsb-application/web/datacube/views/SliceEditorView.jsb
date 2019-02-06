{
	$name: 'DataCube.SliceEditorView',
	$parent: 'JSB.Workspace.BrowserView',
	$require: ['JSB.Widgets.SplitBox', 
	           'DataCube.GridView', 
	           'JSB.Controls.ScrollBox',
	           'JSB.Widgets.PrimitiveEditor', 
	           'JSB.Widgets.Button',
	           'JSB.Widgets.MultiEditor', 
	           'DataCube.Query.QueryEditor',
	           'JSB.Widgets.ToolManager',
	           'DataCube.Export.ExportManager',
	           'JSB.Widgets.RendererRepository',
	           'DataCube.Query.SchemeController',
	           'css:SliceEditorView.css'],

	$client: {
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('sliceEditorView');

			this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);

            this.titleEditor = new PrimitiveEditor();
            this.titleBlock.append(this.titleEditor.getElement());

            this.saveBtn = new Button({
                cssClass: "btnOk",
                caption: "Сохранить",
                onClick: function(){
                	$this.getElement().loader({message:'Сохранение...', onShow: function(){
                	    $this.slice.server().setSliceParams({
                            name: $this.titleEditor.getData().getValue(),
                            query: $this.collectQuery()
                        }, function(){
                            $this.getElement().loader('hide');
                        });
                	}});
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());

            this.updateBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Обновить",
                onClick: function(){
                	$this.updateGrid();
                }
            });
            this.titleBlock.append(this.updateBtn.getElement());

            this.analyzeBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Анализировать",
                onClick: function(){
                	var q = JSB.clone($collectQuery());
                	q['$analyze'] = true;
                	$this.updateGrid(q);
                }
            });
            this.titleBlock.append(this.analyzeBtn.getElement());

            var exportBtn = new Button({
                cssClass: 'btnUpdate',
                caption: "Экспорт",
                onClick: function(evt){
                    ExportManager.ensureSynchronized(function(){
                        var exporters = ExportManager.listExporters();
                        var keys = [];

                        for(var eKey in exporters){
                            var eDesc = exporters[eKey];
                            keys.push({
                                key: eKey,
                                element: eDesc.name
                            });
                        }

                        ToolManager.activate({
                            id: '_dwp_droplistTool',
                            cmd: 'show',
                            data: keys,
                            target: {
                                selector: exportBtn.getElement(),
                                dock: 'bottom'
                            },
                            callback: function(key, item, evt){
                                exportBtn.getElement().loader();
                                $this.gridView.exportData(key, $this.slice && $this.slice.getName(), function(){
                                    exportBtn.getElement().loader('hide');
                                });
                            }
                        });
                    });
                }
            });
            this.titleBlock.append(exportBtn.getElement());
			
			var hSplitBox = new SplitBox({
				type: 'horizontal',
				position: 0.5
			});
			this.append(hSplitBox);
			
			// add editor split
			var vSplitBox = new SplitBox({
				type: 'vertical',
				position: 0.6
			});
			hSplitBox.addToPane(0, vSplitBox);
			
			var scrollBox = new ScrollBox();
			vSplitBox.addToPane(0, scrollBox);

/***/
            this.newEditor = new SchemeController({
                onChange: function(){
                    $this.updateTextQuery($this.collectQuery());
                }
            });
            scrollBox.append(this.newEditor);

            this.oldEditor = new QueryEditor({
                cssClass: 'queryEditor',
                editorView: $this,
                onChange: function(values){
                    $this.updateTextQuery($this.collectQuery());
                }
            });
            scrollBox.append(this.oldEditor);
/***/
			
			this.textQueryEditor = new MultiEditor({
				valueType: "org.jsbeans.types.JsonObject",
				showHints: false,
				readOnly: false,
				onChange: function(q){
					if($this.ignoreHandlers){
						return;
					}

					JSB.defer(function(){
						$this.updateQuery($this.sliceQuery(q).oldEditor);
					}, 600, 'textQueryChanged_' + $this.getId());
				}
			});
			vSplitBox.addToPane(1, this.textQueryEditor);
			
			// add grid view
			this.gridView = new GridView({
				noDataMessage: 'Сформируйте запрос в конструкторе и нажмите кнопку "Обновить"'
			});
			hSplitBox.addToPane(1, this.gridView);
		},

		// временная функция пока не полностью реализован новый редактор
		collectQuery: function(){
		    return JSB.merge({}, this.oldEditor.getValue(), this.newEditor.getValues());
		},

		getSourceFields: function(callback){
            this.newEditor.getSourceFields(callback);
		},
		
		refresh: function(){
			this.slice = this.getCurrentEntry();
			this.titleEditor.setData(this.slice.getName());
			if(!JSB.isInstanceOf(this.slice, 'DataCube.Model.Slice')){
				return;
			}

			this.titleEditor.setData(this.slice.getName());

			this.query = JSB.clone(this.slice.getQuery());

            this.oldEditor.setOption('cube', this.slice.getCube());

			this.slice.server().getEditorData(function(data, fail){
			    if(fail){
			        // todo: error
			        return;
			    }

			    var slicedQuery = $this.sliceQuery($this.query);

                $this.newEditor.refresh({
                    data: data,
                    slice: $this.slice,
                    values: slicedQuery.newEditor
                });

			    // old
                var sliceSelectOptions = [];

                for(var i in data.cubeSlices){
                    if($this.slice.getId() === data.cubeSlices[i].getId()){
                        continue;
                    }

                    sliceSelectOptions.push({
                        entry: data.cubeSlices[i],
                        key: i,
                        value: RendererRepository.createRendererFor(data.cubeSlices[i], {showSource: true}).getElement()
                    });
                }

                $this.oldEditor.setOption('cubeFields', data.cubeFields);
                $this.oldEditor.setOption('cubeSlices', data.cubeSlices);
                $this.oldEditor.setOption('sliceSelectOptions', sliceSelectOptions);

                $this.updateQuery(slicedQuery.oldEditor);


                $this.updateTextQuery($this.query);
                $this.updateGrid();
			});
		},

		// временная функция пока не полностью реализован новый редактор
		sliceQuery: function(query){
		    var slicedQuery = {
		        newEditor: {},
		        oldEditor: {}
		    };

		    var newKeys = ['$join', '$from', '$union', '$cube', '$provider'];

		    for(var i in query){
		        if(newKeys.indexOf(i) > -1){
		            slicedQuery.newEditor[i] = query[i];
		        } else {
		            slicedQuery.oldEditor[i] = query[i];
		        }
		    }

		    return slicedQuery;
		},
		
		updateGrid: function(query){
		    query = query || this.collectQuery();
			$this.gridView.updateData($this.slice, query);
		},
		
		updateTextQuery: function(query){
			$this.ignoreHandlers = true;
			$this.textQueryEditor.setData(query);
			$this.ignoreHandlers = false;
		},
		
		updateQuery: function(query) {
			$this.ignoreHandlers = true;

			try {
				$this.oldEditor.set(query);
			} catch(e) {
			    console.log('queryEditor set error');
            }

			$this.ignoreHandlers = false;
		}
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 0.5,
				acceptNode: ['DataCube.SliceNode'],
				acceptEntry: ['DataCube.Model.Slice'],
				caption: 'Редактирование',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIC0tPg0KDQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgdmVyc2lvbj0iMS4xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIg0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlkPSJzdmcyIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJzbGljZV9lZGl0LnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxkZWZzDQogICAgIGlkPSJkZWZzMTQiIC8+PHNvZGlwb2RpOm5hbWVkdmlldw0KICAgICBwYWdlY29sb3I9IiNmZmZmZmYiDQogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2Ig0KICAgICBib3JkZXJvcGFjaXR5PSIxIg0KICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIg0KICAgICBncmlkdG9sZXJhbmNlPSIxMCINCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIg0KICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCINCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTM4Ig0KICAgICBpZD0ibmFtZWR2aWV3MTIiDQogICAgIHNob3dncmlkPSJmYWxzZSINCiAgICAgaW5rc2NhcGU6em9vbT0iMTUuMTA0Ig0KICAgICBpbmtzY2FwZTpjeD0iLTMuMDE1NzMxNyINCiAgICAgaW5rc2NhcGU6Y3k9Ii00Ljc2OTM1OTkiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIiAvPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE0Ij4gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gPHJkZjpSREY+PGNjOldvcmsNCiAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSA2LjA1MzU4NDgsOC41OTMxODAxIDAsLTEuMzEwODQ0MiAxLjk2NjI2NjMsMCAxLjk2NjI2NiwwIDAsMS4zMTA4NDQyIDAsMS4zMTA4NDQxIC0xLjk2NjI2NiwwIC0xLjk2NjI2NjMsMCAwLC0xLjMxMDg0NDEgeiINCiAgICAgaWQ9InBhdGg0MTUzIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gNi4wNTM1ODQ4LDExLjkxNzEwNiAwLC0xLjMxMDg0NCAxLjk2NjI2NjMsMCAxLjk2NjI2NiwwIDAsMS4zMTA4NDQgMCwxLjMxMDg0NCAtMS45NjYyNjYsMCAtMS45NjYyNjYzLDAgMCwtMS4zMTA4NDQgeiINCiAgICAgaWQ9InBhdGg0MTY5Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gNi4wNTM1ODQ4LDE1LjI0MTAzMyAwLC0xLjMxMDg0NSAxLjk2NjI2NjMsMCAxLjk2NjI2NiwwIDAsMS4zMTA4NDUgMCwxLjMxMDg0NCAtMS45NjYyNjYsMCAtMS45NjYyNjYzLDAgMCwtMS4zMTA4NDQgeiINCiAgICAgaWQ9InBhdGg0MTcxIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gMTAuNjg4MzU1LDguNTkzMTgwMSAwLC0xLjMxMDg0NDIgMS45NjYyNjYsMCAxLjk2NjI2NywwIDAsMS4zMTA4NDQyIDAsMS4zMTA4NDQxIC0xLjk2NjI2NywwIC0xLjk2NjI2NiwwIDAsLTEuMzEwODQ0MSB6Ig0KICAgICBpZD0icGF0aDQxNzMiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAxMC43MTg0MzIsMTIuOTQwMTg4IGMgLTAuMDE2NTQsLTAuMTU4MjcgLTAuMDMwMDgsLTAuNzQ4MTUgLTAuMDMwMDgsLTEuMzEwODQ0IGwgMCwtMS4wMjMwODIgMS45NjYyNjYsMCAxLjk2NjI2NywwIDAsMS4zMTA4NDQgMCwxLjMxMDg0NCAtMS45MzYxOSwwIC0xLjkzNjE4OSwwIC0wLjAzMDA4LC0wLjI4Nzc2MiB6Ig0KICAgICBpZD0icGF0aDQxNzUiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAxMC43MTg0MzIsMTYuMjY0MTE0IGMgLTAuMDE2NTQsLTAuMTU4MjY5IC0wLjAzMDA4LC0wLjc0ODE0OSAtMC4wMzAwOCwtMS4zMTA4NDQgbCAwLC0xLjAyMzA4MiAxLjk2NjI2NiwwIDEuOTY2MjY3LDAgMCwxLjMxMDg0NSAwLDEuMzEwODQ0IC0xLjkzNjE5LDAgLTEuOTM2MTg5LDAgLTAuMDMwMDgsLTAuMjg3NzYzIHoiDQogICAgIGlkPSJwYXRoNDE3NyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDE1LjMyMzEyNSw4LjU5MzE4MDEgMCwtMS4zMTA4NDQyIDEuOTg5Njc1LDAgMS45ODk2NzQsMCAwLDEuMzEwODQ0MiAwLDEuMzEwODQ0MSAtMS45ODk2NzQsMCAtMS45ODk2NzUsMCAwLC0xLjMxMDg0NDEgeiINCiAgICAgaWQ9InBhdGg0MTc5Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gMTUuMzIzMTI1LDExLjkxNzEwNiAwLC0xLjMxMDg0NCAxLjk4OTY3NSwwIDEuOTg5Njc0LDAgMCwxLjMxMDg0NCAwLDEuMzEwODQ0IC0xLjk4OTY3NCwwIC0xLjk4OTY3NSwwIDAsLTEuMzEwODQ0IHoiDQogICAgIGlkPSJwYXRoNDE4MSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDE1LjMyMzEyNSwxNS4yNDEwMzMgMCwtMS4zMTA4NDUgMS45ODk2NzUsMCAxLjk4OTY3NCwwIDAsMS4zMTA4NDUgMCwxLjMxMDg0NCAtMS45ODk2NzQsMCAtMS45ODk2NzUsMCAwLC0xLjMxMDg0NCB6Ig0KICAgICBpZD0icGF0aDQxODMiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6IzMzODAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAwLjYyMjUyNzg2LDEwLjM4MTg0MiAwLC02LjQ4NzUxOTUgMi40MzMxMzAzNCwwIDIuNDMzMTMwMywwIDAsNi40ODc1MTk1IDAsNi40ODc1MiAtMi40MzMxMzAzLDAgLTIuNDMzMTMwMzQsMCAwLC02LjQ4NzUyIHoiDQogICAgIGlkPSJwYXRoNDI1MyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojMzM4MDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDUuNzUzNjE5MSw1LjI4MjcxMjEgMCwtMS40MDA4NDMgNi44NDUxNTI5LDAgNi44NDUxNiwwIDAsMS40MDA4NDMgMCwxLjQwMDg0MyAtNi44NDUxNiwwIC02Ljg0NTE1MjksMCAwLC0xLjQwMDg0MyB6Ig0KICAgICBpZD0icGF0aDQyNTkiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSA1LjcyNzgwNDQsMTEuNzg2MTQzIDAsLTQuODQzNjM5NyA2Ljg1NDU4NzYsMCA2Ljg1NDU4MSwwIDAsNC44NDM2Mzk3IDAsNC44NDM2MzkgLTYuODU0NTgxLDAgLTYuODU0NTg3NiwwIDAsLTQuODQzNjM5IHoiDQogICAgIGlkPSJwYXRoNDI4MyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48Zw0KICAgICBpZD0iZzYiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDIwMzIyNDQsMCwwLDAuMDIwMzIyNDQsLTAuMTQ5NzQ0MTEsMC4wOTk1ODM0OSkiDQogICAgIHN0eWxlPSJmaWxsOiMwMDJiMDA7ZmlsbC1vcGFjaXR5OjEiPjxnDQogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMCwxOTUyKSINCiAgICAgICBpZD0iZzgiDQogICAgICAgc3R5bGU9ImZpbGw6IzAwMmIwMDtmaWxsLW9wYWNpdHk6MSI+PHBhdGgNCiAgICAgICAgIGQ9Im0gOTkwLDExNDEuNyAwLDYyMC43IGMgMCwxOCAtMTQuNiwzMi43IC0zMi43LDMyLjcgbCAtOTE0LjYsMCBjIC0xOCwwIC0zMi43LC0xNC42IC0zMi43LC0zMi43IGwgMCwtNjIwLjcgYyAwLC0xOCAxNC42LC0zMi43IDMyLjcsLTMyLjcgbCA5MTQuNywwIGMgMzQuMywwIDMyLjYsMzIuNyAzMi42LDMyLjcgeiBtIC03MTguNywwIC0yMjguNiwwIDAsMTMwLjcgMjI4LjcsMCAwLC0xMzAuNyB6IG0gMCwxNjMuMyAtMjI4LjYsMCAwLDEzMC43IDIyOC43LDAgMCwtMTMwLjcgeiBtIDAsMTYzLjMgLTIyOC42LDAgMCwxMzAuNyAyMjguNywwIDAsLTEzMC43IHogbSAwLDE2My40IC0yMjguNiwwIDAsMTMwLjcgMjI4LjcsMCAwLC0xMzAuNyB6IG0gMjI3LjcsLTQ5MCAtMTk1LDAgMCwxMzAuNyAxOTYsMCB6IG0gMCwxNjMuMyAtMTk1LDAgMCwxMzAuNyAxOTYsMCB6IG0gLTE5NSwxNjMuMyAwLDEzMC43IDE5NSwwIDEsLTEzMC43IC0xOTYsMCB6IG0gMTk2LDE2My40IC0xOTYsMCAwLDEzMC43IDE5NiwwIHogbSAyMjguNywtNDkwIC0xOTUsMCAtMiwxMzAuNyAxOTcsMCAwLC0xMzAuNyB6IG0gMCwxNjMuMyAtMTk1LDAgLTIsMTMwLjcgMTk3LDAgMCwtMTMwLjcgeiBtIDAsMTYzLjMgLTE5NiwwIC0xLDEzMC43IDE5NywwIDAsLTEzMC43IHogbSAwLDE2My40IC0xOTYsMCAtMSwxMzAuNyAxOTcsMCAwLC0xMzAuNyB6IG0gMjI4LjYsLTQ5MCAtMTk2LDAgLTEsMTMwLjcgMTk3LDAgMCwtMTMwLjcgeiBtIDAsMTYzLjMgLTE5NiwwIC0xLDEzMC43IDE5NywwIDAsLTEzMC43IHogbSAwLDE2My4zIC0xOTcsMCAwLDEzMC43IDE5NywwIDAsLTEzMC43IHogbSAwLDE2My40IC0xOTYsMCAtMSwxMzAuNyAxOTcsMCAwLC0xMzAuNyB6Ig0KICAgICAgICAgaWQ9InBhdGgxMCINCiAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICBzdHlsZT0iZmlsbDojMDAyYjAwO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjc3Nzc3Nzc2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjIiAvPjwvZz48L2c+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2FhNDQwMDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MS4xMTYyODIyMjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icGF0aDQxNTAiDQogICAgIGQ9Ik0gMTMuNjUyOTYsNy44NTgwNDkgMTYuNTAwMjQ2LDEwLjcwNTMwOCA5LjI5Mjk4MDMsMTcuOTEyNTc1IDYuNDQ3MzA5LDE1LjA2NTMxNiBaIE0gMTguNjYwNzg2LDcuMTcxMzU1OSAxNy4zOTEwMDUsNS45MDE1NzYxIGMgLTAuNDkwNzI2LC0wLjQ5MDcyNjEgLTEuMjg3NTY0LC0wLjQ5MDcyNjEgLTEuNzc5OTU3LDAgbCAtMS45NTA5NjUsMS45NTA5NjQzIDIuODQ3Mjg2LDIuODQ3Mjg2NiAyLjE1MzQxNywtMi4xNTM0MTY1IGMgMC4zODA2MDcsLTAuMzgwNjM1IDAuMzgwNjA3LC0wLjk5NDQ0NjIgMCwtMS4zNzUwNTQ2IHogTSA0Ljk5ODA4MDksMTguMzczNTM4IGMgLTAuMDUxODE3LDAuMjMzMjAzIDAuNjg5MzA3NywwLjg5MTExMyAwLjkyMjUzNjksMC44MzQ0IEwgOS4yMTU4OCwxNy44MjY0NDcgNi4zNzAyMDg5LDE0Ljk3OTE4OCBaIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2Njc3NjY2Njc2NjY2NjIiAvPjwvc3ZnPg=='
			});
		}
	}
}