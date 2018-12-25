{
	$name: 'DataCube.Model.SettingsEntry',
	$parent: 'JSB.Workspace.Entry',
	
	$scheme: {
		
	},
	
	extractSettingsScheme: function(){
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
	
	$client: {
		_settings: null,
		
		loadSettings: function(callback){
			if($this._settings){
				callback.call($this, JSB.clone($this._settings));
			} else {
				this.server().getSettings(function(settings){
					$this._settings = settings;
					callback.call($this, JSB.clone(settings));
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
			if($this._settings && !JSB.isEqual($this._settings, settings)){
				$this._settings = settings;
				$this.publish('DataCube.Model.SettingsEntry.settingsUpdated', JSB.clone(settings));
			}
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'Unimap.ValueSelector'],
		_settingsContext: null,
	
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.SettingsNode',
				create: false,
				move: true,
				remove: false,
				share: false
			});
		},
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				if(opts.name){
					this.setName(opts.name);
				}
				if(opts.settings && JSB.isObject(opts.settings)){
					$this.property('_settings', opts.settings);
				} else {
					$this.property('_settings', {});
				}
			}
		},
		
		getSettingsContext: function(){
			if(!this._settingsContext){
				this._settingsContext = new ValueSelector({
					bootstrap: 'Datacube.Unimap.Bootstrap',
					values: this.getSettings(),
					scheme: this.extractSettingsScheme(),
					createDefaultValues: true,
					updateValues: true
				});
			}
			
			return this._settingsContext;
		},
		
		onChangeSettings: function(){
			// this method should be overriden
		},
		
		getSettings: function(){
			return $this.property('_settings');
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
			$this.client()._updateClientSettings(settings);
			$this.doSync();
		}
	}
}