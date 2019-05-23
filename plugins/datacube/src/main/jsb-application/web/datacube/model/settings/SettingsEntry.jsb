/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.SettingsEntry',
	$parent: 'JSB.Workspace.Entry',
	$require: ['Unimap.Selector'],
	
	$expose: {
		priority: 0.5, 
		nodeType:'DataCube.SettingsNode',
		create: false,
		move: true,
		remove: false,
		share: false,
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDI5OS41OTIgMjk5LjU5MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk5LjU5MiAyOTkuNTkyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzMzM0U0ODsiIGQ9Ik0xNS42NzcsNjMuMDJjLTcuMTQ2LDAtMTIuOTM5LTUuNzkxLTEyLjk0My0xMi45MzhDMi43MjksNDIuOTM0LDguNTIxLDM3LjEzNiwxNS42NywzNy4xMzEKCQlsMjY4LjEyOC0wLjE0OWMwLjAwMiwwLDAuMDA2LDAsMC4wMDgsMGM3LjE0NSwwLDEyLjkzOSw1Ljc5LDEyLjk0MywxMi45MzdjMC4wMDQsNy4xNDgtNS43ODksMTIuOTQ3LTEyLjkzNiwxMi45NTFMMTUuNjg0LDYzLjAyCgkJQzE1LjY4Myw2My4wMiwxNS42NzksNjMuMDIsMTUuNjc3LDYzLjAyeiIvPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzAwOTYzODsiIGQ9Ik0yMzEuNDY2LDAuMDAxbC0xMi4wMjEsMC4wMDZjLTI3LjU3MiwwLjAxNi00OS45MTIsMjIuMzgtNDkuODk2LDQ5Ljk1NAoJCQljMC4wMTYsMjcuNTcyLDIyLjM4MSw0OS45MTIsNDkuOTUxLDQ5Ljg5NmwxMi4wMjEtMC4wMDZMMjMxLjQ2NiwwLjAwMXoiLz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMEJENUU7IiBjeD0iMjMxLjQ5MyIgY3k9IjQ5LjkyNiIgcj0iNDkuOTI2Ii8+Cgk8L2c+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMzMzRTQ4OyIgZD0iTTE1Ljc4NywyNjIuNzJjLTcuMTQ2LDAtMTIuOTM5LTUuNzktMTIuOTQ0LTEyLjkzN2MtMC4wMDMtNy4xNDksNS43ODgtMTIuOTQ4LDEyLjkzNy0xMi45NTEKCQlsMjY4LjEyNy0wLjE1YzAuMDAyLDAsMC4wMDYsMCwwLjAwOCwwYzcuMTQ3LDAsMTIuOTQsNS43OTEsMTIuOTQzLDEyLjkzOGMwLjAwNiw3LjE1LTUuNzg3LDEyLjk0Ny0xMi45MzYsMTIuOTUxbC0yNjguMTI4LDAuMTQ4CgkJQzE1Ljc5MiwyNjIuNzIsMTUuNzg5LDI2Mi43MiwxNS43ODcsMjYyLjcyeiIvPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0JGNTM0RjsiIGQ9Ik0yMDIuOTM1LDE5OS43MzVsLTEyLjAyMSwwLjAwOGMtMjcuNTcsMC4wMTQtNDkuOTEyLDIyLjM3Ny00OS44OTcsNDkuOTUxCgkJCWMwLjAxNiwyNy41NzQsMjIuMzgxLDQ5LjkxMyw0OS45NTMsNDkuODk4bDEyLjAyLTAuMDA3TDIwMi45MzUsMTk5LjczNXoiLz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRjZENjg7IiBjeD0iMjAyLjk2MSIgY3k9IjI0OS42NjEiIHI9IjQ5LjkyNSIvPgoJPC9nPgoJPHBhdGggc3R5bGU9ImZpbGw6IzMzM0U0ODsiIGQ9Ik0xNS43MzQsMTY2LjMxNGMtNy4xNDYsMC0xMi45NC01Ljc5LTEyLjk0NC0xMi45MzdjLTAuMDA0LTcuMTQ5LDUuNzg4LTEyLjk0OCwxMi45MzctMTIuOTUxCgkJbDI2OC4xMjgtMC4xNDljMC4wMDIsMCwwLjAwNiwwLDAuMDA4LDBjNy4xNDcsMCwxMi45NCw1Ljc5LDEyLjk0MywxMi45MzdjMC4wMDQsNy4xNDktNS43ODksMTIuOTQ4LTEyLjkzOCwxMi45NTFsLTI2OC4xMjcsMC4xNDkKCQlDMTUuNzM5LDE2Ni4zMTQsMTUuNzM2LDE2Ni4zMTQsMTUuNzM0LDE2Ni4zMTR6Ii8+Cgk8Zz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojMDA1RkFEOyIgZD0iTTEwMS43MDMsMTAzLjM5Mkw4OS42ODIsMTAzLjRjLTI3LjU3MiwwLjAxNC00OS45MTMsMjIuMzc4LTQ5Ljg5Nyw0OS45NTEKCQkJYzAuMDE1LDI3LjU3MywyMi4zODEsNDkuOTE0LDQ5Ljk1Myw0OS44OTlsMTIuMDIxLTAuMDA4TDEwMS43MDMsMTAzLjM5MnoiLz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDcxQ0U7IiBjeD0iMTAxLjczIiBjeT0iMTUzLjMxNyIgcj0iNDkuOTI1Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=='
	},
	
	$scheme: {},
	
	createContext: function(settings, scheme){
		return new Selector({
			values: settings,
			scheme: scheme,
			createDefaultValues: true,
			updateValues: true
		});
	},
	
	$client: {
		_settings: null,
		_settingsScheme: null,
		_settingsContext: null,
		
		loadSettingsContext: function(c){
			if(this._settingsContext){
				if(c){
					c.call($this, this._settingsContext);
				}
				return;
			}
			this.loadSettings(function(settings, fail){
				if(fail){
					if(c){
						c.call($this, null, fail);
					}
					return;
				}
				$this.loadSettingsScheme(function(scheme, fail){
					$this._settingsContext = $this.createContext(settings, scheme);
					if(c){
						$this._settingsContext.ensureInitialized(function(){
							c.call($this, $this._settingsContext);	
						});
					}
				});
			});
		},
		
		loadSettings: function(callback){
			if($this._settings){
				callback.call($this, JSB.clone($this._settings));
			} else {
				this.server().getSettings(function(settings, fail){
					if(fail){
						callback.call($this, null, fail);
						return;
					}
					$this._settings = settings;
					callback.call($this, JSB.clone(settings));
				});
			}
		},
		
		loadSettingsScheme: function(callback){
			if($this._settingsScheme){
				callback.call($this, $this._settingsScheme);
			} else {
				this.server().getSettingsScheme(function(scheme, fail){
					if(fail){
						callback.call($this, null, fail);
						return;
					}
					$this._settingsScheme = scheme;
					callback.call($this, $this._settingsScheme);
				});
			}
		},
		
		saveSettings: function(settings, callback){
			if(!$this._settings || !JSB.isEqual($this._settings, settings)){
				$this._settings = JSB.clone(settings);
				this.server().applySettings(settings, function(){
					if(callback){
						callback.call($this);
					}
				});
			} else {
				if(callback){
					callback.call($this);
				}
			}
		},
		
		_updateClientSettings: function(settings){
			if(!$this._settings || !JSB.isEqual($this._settings, settings)){
				$this._settings = settings;
				$this.publish('DataCube.Model.SettingsEntry.settingsUpdated', JSB.clone(settings));
				
				if($this._settingsContext){
					// renew context
					$this._settingsContext = $this.createContext(settings, $this._settingsScheme);
					
					$this.publish('DataCube.Model.SettingsEntry.settingsContextUpdated', $this._settingsContext);
				}
				
			}
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		_settingsContext: null,
	
		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				if(opts.name){
					this.setName(opts.name);
				}
				var settings = {};
				if(opts.settings && JSB.isObject(opts.settings)){
					settings = opts.settings;
				}
				$this.getSettingsContext(settings);
				this.storeSettings();
			}
		},
		
		getSettingsContext: function(settings){
			if(!this._settingsContext){
				this._settingsContext = this.createContext(settings || this.getSettings(), this.getSettingsScheme());
			}
			
			return this._settingsContext;
		},
		
		onChangeSettings: function(){
			// this method should be overridden
		},
		
		getSettings: function(){
			return $this.property('_settings');
		},
		
		getSettingsScheme: function(){
			var scheme = {},
            curJsb = this.getJsb(),
            schemesArray = [];

	        while(curJsb){
	            if(!curJsb.isSubclassOf('DataCube.Model.SettingsEntry')){
	                break;
	            }
	            var wScheme = curJsb.getDescriptor().$scheme;
	            if(wScheme && Object.keys(wScheme).length > 0){
	                schemesArray.push(wScheme);
	            }
	            curJsb = curJsb.getParent();
	        }
	
	        for(var i = schemesArray.length - 1; i > -1; i--){
	            JSB.merge(true, scheme, schemesArray[i]);
	        }
	
	        return scheme;
		},
		
		applySettings: function(settings){
			var curSettings = $this.property('_settings');
			if(curSettings && JSB.isEqual(curSettings, settings)){
				return;
			}
			this.property('_settings', settings);
			if(this._settingsContext){
				this._settingsContext.destroy();
				this._settingsContext = null;
			}
			$this.onChangeSettings();
			$this.publish('DataCube.Model.SettingsEntry.settingsUpdated', settings);
			$this.updateClientSettings();
			$this.doSync();
		},
		
		storeSettings: function(){
			var settings = this.getSettingsContext().getValues();
			$this.property('_settings', settings);
			$this.publish('DataCube.Model.SettingsEntry.settingsUpdated', settings);
			$this.updateClientSettings();
		},
		
		ensureSettings: function(){
			if(!this.getSettings()){
				this.storeSettings();
			}
		},
		
		updateClientSettings: function(){
			JSB.defer(function(){
				$this.client()._updateClientSettings($this.property('_settings'));
			}, 100, '_updateClientSettings_' + this.getId());
		}
	}
}