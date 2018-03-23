{
	$name: 'DataCube.Model.StyleSettings',
	$parent: 'JSB.Workspace.Entry',

	stylesVersion: 0,

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
        },

        _styles: null,

        getStyles: function(){
            return this._styles;
        },

        setStyles: function(styles){
            this._styles = styles;
            this.stylesVersion++;
            this.doSync();
        }
    }
}