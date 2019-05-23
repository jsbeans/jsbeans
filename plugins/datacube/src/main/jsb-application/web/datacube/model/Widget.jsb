/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.Widget',
	$parent: 'JSB.Workspace.Entry',
	
	$expose: {
		priority:0.5, 
		nodeType:'DataCube.WidgetNode',
		create: false,
		move: false,
		remove: true,
		rename: true,
		share: false,
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaWQ9IkxheWVyXzEiCiAgIHZlcnNpb249IjEuMSIKICAgdmlld0JveD0iMCAwIDI0IDI0IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSIKICAgc29kaXBvZGk6ZG9jbmFtZT0id2lkZ2V0cy5zdmciCiAgIHdpZHRoPSIyNCIKICAgaGVpZ2h0PSIyNCI+PG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMjUiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnMyMyIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTEzOCIKICAgICBpZD0ibmFtZWR2aWV3MjEiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjI5LjUiCiAgICAgaW5rc2NhcGU6Y3g9IjEzLjU1NzA0MSIKICAgICBpbmtzY2FwZTpjeT0iOC42NjE4NTgzIgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIgogICAgIHNob3dndWlkZXM9InRydWUiCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMTAuNjQ0MDY4LDE5LjAxNjk0OSIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MjAzIiAvPjxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjEzLjM4OTgzMSwyNC4zMDUwODUiCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDIwNSIgLz48c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIyOC41MDg0NzUsMTMuMzg5ODMxIgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQyMDciIC8+PHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMjYuNDQwNjc4LDEwLjU3NjI3MSIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MjA5IiAvPjxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjEyLDkuOTY2MTAxNyIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MjExIiAvPjxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjE3Ljc5NjYxLDEyIgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQyMTMiIC8+PC9zb2RpcG9kaTpuYW1lZHZpZXc+PHN0eWxlCiAgICAgdHlwZT0idGV4dC9jc3MiCiAgICAgaWQ9InN0eWxlMyI+Cgkuc3Qwe2ZpbGw6IzVDQjhDRDt9Cgkuc3Qxe2ZpbGw6I0ZCOEE1Mjt9Cgkuc3Qye2ZpbGw6IzE1MkQzOTt9Cgkuc3Qze2ZpbGw6I0JCMEQ0ODt9Cgkuc3Q0e2ZpbGw6IzAwQUFCQzt9Cgkuc3Q1e2ZpbGw6I0Y3NzIzNzt9Cgkuc3Q2e2ZpbGw6IzA3MUMyMzt9Cgkuc3Q3e2ZpbGw6Izk2MEM0MTt9Cgkuc3Q4e2ZpbGw6I0RFRTJFMjt9Cjwvc3R5bGU+PHBhdGgKICAgICBjbGFzcz0ic3Q0IgogICAgIGQ9Im0gMTIuMDE2NTMsMjIuMjk4OTMxIGMgLTEuMDMyNDM2LDAgLTIuMDI0NjQ3MywtMC4yMjEyMzYgLTIuODAyMzI2MSwtMC42MjM0ODYgQyA4Ljc0NDkxNDYsMjEuNDI3MzkzIDguMTIxNDMwNiwyMC45OTE2MjQgNy44NTMyNjUyLDIwLjMwNzgwMiA3LjUzMTQ2NjcsMTkuNDg5ODk5IDcuNjg1NjYxOSwxOC4zOTcxMjYgOC4zMDI0NDIsMTcuMDQyODkxIGMgMC43MDM5MzM4LC0xLjUzNTI0NyAxLjk1MDkwMiwtMy4yNDQ4IDMuNzE0MDg4LC01LjA4ODQzNyAxLjc2MzE4OCwxLjg0MzYzNyAzLjAxMDE1NiwzLjU1MzE5IDMuNzE0MDksNS4wODg0MzcgMC42MTY3OCwxLjM0NzUzIDAuNzY0MjcxLDIuNDQ3MDA4IDAuNDQ5MTc2LDMuMjY0OTExIC0wLjI2ODE2MywwLjY5MDUyNiAtMC44OTE2NSwxLjEyNjI5NCAtMS4zNjA5MzksMS4zNjc2NDMgLTAuNzc3Njc4LDAuNDAyMjUgLTEuNzY5ODg5LDAuNjIzNDg2IC0yLjgwMjMyNywwLjYyMzQ4NiB6IgogICAgIGlkPSJYTUxJRF8zNDcwXyIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOiMwMGFhYmM7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz48cGF0aAogICAgIGNsYXNzPSJzdDUiCiAgICAgZD0iTSAxMS45OTE2NTksMTIuMTI1NjMyIEMgMTAuMjA5NjI0LDEwLjI2MjI4NiA4Ljk0OTMyNTMsOC41MzQ0NTc2IDguMjM3ODY2Niw2Ljk4Mjc5OTYgNy42MTQ0OTMxLDUuNjIwODYzOSA3LjQ2NTQyNTUsNC41MDk2MzI4IDcuNzgzODg4LDMuNjgyOTg1MyA4LjA1NDkxOTksMi45ODUwNzggOC42ODUwNjkyLDIuNTQ0NjUxMSA5LjE1OTM3NTMsMi4zMDA3MjI0IDkuOTQ1MzY5MSwxLjg5NDE3NDMgMTAuOTQ4MTg2LDEuNjcwNTczMSAxMS45OTE2NTksMS42NzA1NzMxIGMgMS4wNDM0NzMsMCAyLjA0NjI5MiwwLjIyMzYwMTIgMi44MzIyODUsMC42MzAxNDkzIDAuNDc0MzA1LDAuMjUwNzA0NCAxLjEwNDQ1MywwLjY5MTEzMTQgMS4zNzU0ODYsMS4zODIyNjI5IDAuMzI1MjM5LDAuODI2NjQ3NSAwLjE2OTM5NSwxLjkzMTEwMjggLTAuNDUzOTc4LDMuMjk5ODE0MyAtMC43MTE0NTksMS41NTE2NTggLTEuOTcxNzU3LDMuMjc5NDg2NCAtMy43NTM3OTMsNS4xNDI4MzI0IHoiCiAgICAgaWQ9IlhNTElEXzM0NzNfIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2Y3NzIzNztzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPjxwYXRoCiAgICAgY2xhc3M9InN0NiIKICAgICBkPSJtIDQuNjI4Mzc0MiwxNi4zNjkxMzIgYyAtMC4zNDU2NDc1LDAgLTAuNjU3NDA3OSwtMC4wNTQyMyAtMC45MzUyODE2LC0wLjE2MjY1OSBDIDIuOTk1MDIwMSwxNS45MzUzNzcgMi41NTQ0ODksMTUuMzA1MDc5IDIuMzEwNTAyNSwxNC44MzA2NjEgMS45MDM4NTg0LDE0LjA0NDQ4MyAxLjY4MDIwNDIsMTMuMDQxNDI1IDEuNjgwMjA0MiwxMS45OTc3MDYgYyAwLC0xLjA0MzcyMSAwLjIyMzY1NDEsLTIuMDQ2Nzc0MSAwLjYzMDI5ODMsLTIuODMyOTU0MSBDIDIuNTYxMjY2Myw4LjY5MDMzMzggMy4wMDE3OTc4LDguMDYwMDM1MyAzLjY5MzA5MjYsNy43ODg5MzkzIDMuOTcwOTY2Myw3LjY4MDUwMDUgNC4yODI3MjY3LDcuNjI2MjgxNyA0LjYyODM3NDIsNy42MjYyODE3IGMgMC42Nzc3NDA0LDAgMS40NzA2OTY0LDAuMjEwMDk5MyAyLjM2NTMxMzgsMC42MTY3NDM1IDEuNTUyMDI1MiwwLjcxMTYyNzMgMy4yODAyNjMsMS45NzIyMjI4IDUuMTQ0MDQ5LDMuNzU0NjgwOCAtMS44NjM3ODYsMS43ODI0NTggLTMuNTkyMDIzOCwzLjA0MzA1NCAtNS4xNDQwNDksMy43NTQ2ODEgLTAuODk0NjE3NCwwLjQwNjY0NCAtMS42ODc1NzM0LDAuNjE2NzQ1IC0yLjM2NTMxMzgsMC42MTY3NDUgbCAwLDAgeiIKICAgICBpZD0iWE1MSURfMzQ3Nl8iCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDojMDcxYzIzO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+PHBhdGgKICAgICBjbGFzcz0ic3Q3IgogICAgIGQ9Im0gMTkuNTA1MzY1LDE2LjMyNDI3MSBjIC0wLjY3MzE4OCwwIC0xLjQ2MDgyMSwtMC4yMDg2ODYgLTIuMzQ5NDMxLC0wLjYxMjYwMSAtMS41NDE2MDQsLTAuNzA2ODUgLTMuMjU4MjM4LC0xLjk1ODk4MiAtNS4xMDk1MDcsLTMuNzI5NDcxIDEuODUxMjY5LC0xLjc3MDQ4OCAzLjU2NzkwMywtMy4wMjI2MjA5IDUuMTA5NTA3LC0zLjcyOTQ2OTkgMC44ODg2MSwtMC40MDM5MTM4IDEuNjc2MjQzLC0wLjYxMjYwMjYgMi4zNDk0MzEsLTAuNjEyNjAyNiAwLjM0MzMyOSwwIDAuNjUyOTk0LDAuMDUzODUzIDAuOTI5MDA0LDAuMTYxNTY1NSAwLjY5MzM4MywwLjI2OTI3NTggMS4xMzA5NTYsMC44OTUzNDIzIDEuMzczMzA2LDEuMzY2NTc1IDAuNDAzOTE0LDAuNzgwOTAwNiAwLjYyNjA2NCwxLjc3NzIyMSAwLjYyNjA2NCwyLjgxMzkzMiAwLDEuMDM2NzE0IC0wLjIyMjE1LDIuMDMzMDMxIC0wLjYyNjA2NCwyLjgxMzkzMiAtMC4yNDkwOCwwLjQ3MTIzMiAtMC42ODY2NTUsMS4wOTczMDEgLTEuMzczMzA2LDEuMzY2NTc1IC0wLjI3NjAxLDAuMTAwOTc2IC0wLjU4NTY3NSwwLjE2MTU2NSAtMC45MjkwMDQsMC4xNjE1NjUgbCAwLDAgeiIKICAgICBpZD0iWE1MSURfMzQ3OV8iCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDojOTYwYzQxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPjwvc3ZnPg=='
	},
	
	$require: ['Unimap.Selector'],

	dataVersion: 0,
	dashboard: null,
	wType: null,
	unused: false,
	
	getDashboard: function(){
		return this.dashboard;
	},
	
	getWidgetType: function(){
		return this.wType;
	},
	
	isUnused: function(){
		return this.unused;
	},

    extractWidgetScheme: function(){
        var scheme = {},
            curWidgetJsb = JSB.get(this.wType),
            schemesArray = [];

        while(curWidgetJsb){
            if(!curWidgetJsb.isSubclassOf('DataCube.Widgets.Widget')){
                break;
            }
            var wScheme = curWidgetJsb.getDescriptor().$scheme;
            if(wScheme && Object.keys(wScheme).length > 0){
                schemesArray.push(wScheme);
            }
            curWidgetJsb = curWidgetJsb.getParent();
        }

        for(var i = schemesArray.length - 1; i > -1; i--){
            JSB.merge(true, scheme, schemesArray[i]);
        }

        return scheme;
    },
    
    createContext: function(settings, scheme){
		return new Selector({
			values: settings,
			scheme: scheme,
			createDefaultValues: true,
			updateValues: true
		});
	},

    $client: {
        _clientDataVersion: -1,
        _data: null,

        getData: function(callback){
	        if(this._clientDataVersion !== this.dataVersion){
	            this.server().getData(function(result, fail){
	                if(fail){ return; }

	                $this._data = result;
	                $this._clientDataVersion = $this.dataVersion;

	                callback(result);
	            });
	        } else {
	            callback(this._data);
	        }
        },
        
		_values: null,
		_scheme: null,
		_context: null,
		
		loadContext: function(c){
			if(this._context){
				if(c){
					c.call($this, this._context);
				}
				return;
			}
			this.loadValues(function(values, fail){
				if(fail){
					if(c){
						c.call($this, null, fail);
					}
					return;
				}
				$this.loadScheme(function(scheme, fail){
					$this._context = $this.createContext(values, scheme);
					if(c){
						$this._context.ensureInitialized(function(){
							c.call($this, $this._context);	
						});
					}
				});
			});
		},
		
		loadValues: function(callback){
			if($this._values){
				callback.call($this, JSB.clone($this._values));
			} else {
				this.server().getValues(function(values, fail){
					if(fail){
						callback.call($this, null, fail);
						return;
					}
					$this._values = values;
					callback.call($this, JSB.clone(values));
				});
			}
		},
		
		loadScheme: function(callback){
			if($this._scheme){
				callback.call($this, $this._scheme);
			} else {
				this.server().getScheme(function(scheme, fail){
					if(fail){
						callback.call($this, null, fail);
						return;
					}
					$this._scheme = scheme;
					callback.call($this, $this._scheme);
				});
			}
		},
		
		_updateClient: function(values){
			if(!$this._values || !JSB.isEqual($this._values, values)){
				$this._values = values;
				$this.publish('DataCube.Model.Widget.valuesUpdated', values);
				
				if($this._context){
					// renew context
					$this._context = $this.createContext(values, $this._scheme);
				}
				
			}
		}
    },

	$server: {
        sources: {},
        sourcesIds: null,
        values: null,
        _context: null,

		$require: ['DataCube.Query.Query',
		           'JSB.Workspace.WorkspaceController'],
		
		$constructor: function(id, workspace, dashboard, name, wType, values){
			$base(id, workspace);

            var valueSelector = new Selector();

			if(dashboard){  // create new
				this.dashboard = dashboard;
				this.property('dashboard', this.dashboard.getId());
				this.setName(name);
				this.wType = wType;
				this.property('wType', wType);

				this.values = values;
				if(!this.values){
				    this.values = valueSelector.createDefaultValues(this.extractWidgetScheme());
				}

				this.property('values', this.values);
			} else {    // load from entry
				var bNeedSave = false,
				    dashboard = this.property('dashboard'),
				    wType = this.property('wType'),
				    values = this.property('values'),
				    sourcesIds = this.property('sourcesIds'),
				    unused = this.property('unused');

				if(dashboard){
					this.dashboard = this.getWorkspace().entry(dashboard);
				}

				if(wType){
					this.wType = wType;
				}

                if(values){
                    this.values = values;
                }

				if(sourcesIds){
				    this.sourcesIds = sourcesIds;
				}
				
				if(unused){
					this.unused = true;
				}

				this.updateSources();
				
				var wasUpdated = valueSelector.updateValues(this.extractWidgetScheme(), this.values);
				if(wasUpdated){
				    this.property('values', this.values);

				    bNeedSave = wasUpdated || bNeedSave;
				}

				if(bNeedSave){
					this.getWorkspace().store();
				}
			}

			valueSelector.destroy();
		},
		
		getContext: function(){
			if(!this._context){
				this._context = this.createContext(this.getValues(), this.extractWidgetScheme());
			}
			
			return this._context;
		},

		getDataSchemeSource: function(ds){
			if(!ds || !ds.source){
				throw new Error('Invalid datascheme passed');
			}
			return this.getWorkspace().entry(ds.source);
		},
		
		getData: function(){
		    return {
                sources: this.sources,
                sourcesIds: this.sourcesIds,
		        values: this.values
		    }
		},

		getSourcesIds: function(){
		    return this.sourcesIds;
		},

		getValues: function(){
		    return this.values;
		},
		
		getScheme: function(){
			return this.extractWidgetScheme();
		},

		setName: function(name, notSave){
			if($base(name) && !notSave){
			    this.getWorkspace().store();
			}
		},
		
		storeValues: function(opts){    //name, values, linkedFields, sourcesIds
			this.values = opts.values;
			this.sourcesIds = opts.sourcesIds;
			this.property('values', opts.values);
			this.property('sourcesIds', opts.sourcesIds);
			this._context = null;

			if(opts && opts.name){
				this.setName(opts.name, true);
			}
/*
			this.getDashboard().load(); // todo: update only after change source
			// update interoperation maps in all widgets of current dashboard
			var widgets = this.getDashboard().getWrappers();
			this.getDashboard().store();
*/			
			this.dataVersion++;
			
			this.updateSources();
			
			JSB.defer(function(){
				$this.client()._updateClient($this.property('values'));
			}, 100, '_updateClient_' + this.getId());
			
			return {sources: this.sources};
		},
		
		updateSources: function(){
			this.sources = {};
			if(this.sourcesIds){
				for(var i = 0; i < this.sourcesIds.length; i++){
					try {
						this.sources[this.sourcesIds[i]] = this.getWorkspace().entry(this.sourcesIds[i]);
					} catch(e){}
				}
			}
		}
	}
}