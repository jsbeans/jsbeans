{
	$name: 'DataCube.Controls.HttpTemplateEditor',
	$parent: 'JSB.Widgets.Editor',

	$client: {
	    $require: ['JSB.Widgets.ToolManager', 
	               'JSB.Widgets.PrimitiveEditor',
	               'css:HttpTemplateEditor.css'],

	    $constructor: function(opts){
	    	$base(opts);
	        this.addClass('httpTemplateEditor');
	        
	        this._templateContainer = this.$('<div class="container template"></div>');
	        this.append(this._templateContainer);
	        
	        if(this.options.prefix){
	        	this._templateContainer.append(this.$('<span class="prefix">' + this.options.prefix + '</span>'));	
	        }
	        
	        var editorOpts = {};
	        
	        if(this.options.multiline){
	        	editorOpts.multiline = true;
	        	editorOpts.resizable = true;
	        	editorOpts.rows = 3;
	        	editorOpts.cols = 50;
	        }
	        
	        this._templateEditor = new PrimitiveEditor(JSB.merge(editorOpts, {
	        	onChange: function(val){
	        		if($this.options.onChange){
	        			$this.options.onChange.call($this, val);
	        		}
	        	}
	        }));
	        
	        this._templateContainer.append(this._templateEditor.getElement());

	        this._resultContainer = this.$('<div class="container result"></div>');
	        this.append(this._resultContainer);
	        
	        if(this.options.value){
	        	this._templateEditor.setData(this.options.value);
	        }
	    }

	}
}