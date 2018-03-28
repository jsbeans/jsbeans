{
	$name: 'DataCube.Model.StyleSettings',
	$parent: 'JSB.Workspace.Entry',

	stylesVersion: 0,

	scheme: {
	    // todo: dashboard style settings
	    widgetSettings: {
	        render: 'group',
	        name: 'Параметры виджета',
	        collapsable: true,
	        items: {
	            colorScheme: {
	                render: 'item',
	                name: 'Цветовая схема',
	                multiple: true,
	                editor: 'JSB.Widgets.ColorEditor'
	            }
	        }
	    }
	},

	$client: {
	    _styles: null,
	    _clientStylesVersion: -1,

	    getStyles: function(callback){
	        if(this._clientStylesVersion !== this.stylesVersion){
	            this.server().getStyles(function(result, fail){
	                if(fail){ return; }

	                $this._styles = result;
	                $this._clientStylesVersion = this.stylesVersion;

	                callback(result);
	            });
	        } else {
	            callback(this._styles);
	        }
	    }
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'Unimap.ValueSelector'],

        $bootstrap: function(){
        	WorkspaceController.registerExplorerNode(null, this, 0.5, 'DataCube.StyleSettingsNode');
        },

        $constructor: function(id, workspace, opts){
            $base(id, workspace);

            this._styles = this.property('styles');

            if(!this._styles){
                var valueSelector = new ValueSelector({
                    bootstrap: 'Datacube.Unimap.Bootstrap'
                });

                this._styles = valueSelector.createDefaultValues(this.scheme);

                valueSelector.destroy();
            }
        },

        _styles: null,

        getStyles: function(){
            return this._styles;
        },

        setStyles: function(styles){
            this._styles = styles;
            this.property('styles', styles);

            this.stylesVersion++;

            this._workspace.store();
        }
    }
}