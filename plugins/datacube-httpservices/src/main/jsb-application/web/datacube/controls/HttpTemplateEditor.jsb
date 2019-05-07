{
	$name: 'DataCube.Controls.HttpTemplateEditor',
	$parent: 'JSB.Widgets.Editor',

	$client: {
	    $require: ['JSB.Widgets.ToolManager', 
	               'JSB.Widgets.PrimitiveEditor',
	               'DataCube.HttpTemplate',
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
	        		$this.updatePreview();
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
	        
	        this.unimapRender = this.options.unimapRender;
	        this.updatePreview();
	    },
	    
	    updatePreview: function(){
	    	if(!this.unimapRender){
	    		return;
	    	}
    		var pMap = {};
	    	var pNameRenders = this.unimapRender.findRendersByKey(this.options.paramNameKey);
	    	var pValueRenders = this.unimapRender.findRendersByKey(this.options.paramValueKey);
	    	if(pNameRenders && pNameRenders.length > 0 && pValueRenders && pValueRenders.length > 0){
	    		for(var i = 0; i < pNameRenders.length; i++){
	    			var keyArr = pNameRenders[i] && pNameRenders[i].getValues() && pNameRenders[i].getValues().values;
	    			var key = null;
	    			var val = null;
	    			if(keyArr && keyArr.length > 0){
	    				key = keyArr[0] && keyArr[0].value;
	    			}
	    			var valArr = pValueRenders[i] && pValueRenders[i].getValues() && pValueRenders[i].getValues().values;
	    			if(valArr && valArr.length > 0){
	    				val = valArr[0] && valArr[0].value;
	    			}
	    			if(key){
	    				pMap[key] = val;
	    			}
	    		}
	    	}
	    	previewStr = this._templateEditor.getData().getValue();
	    	try {
	    		previewStr = HttpTemplate.execute(this._templateEditor.getData().getValue(), pMap);
	    	} catch(e){
	    	}
	    	if(this.options.prefix){
	    		previewStr = this.options.prefix + previewStr;
	    	}
	    	this._resultContainer.text(previewStr);
	    }

	}
}