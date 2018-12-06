{
	$name:'JSB.Widgets.ComplexEditor',
	$parent: 'JSB.Widgets.Editor',
	
	$client: {
		$require: ['css:complexEditor.css'],
		data: null,
		options: {
			readonly: false,
			scheme: {},
			
			onChange: null,
		},
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('_jsb_complexEditor');
		},
		
		setData: function(data){
			this.getElement().empty();
			var editorStack = [];
			if(!this.options.scheme){
				throw 'Schemeless editing is not supported yet';
			}
			this._construct(data, this.options.scheme, editorStack, this.getElement(), $this, 'data');
		},
		
		getData: function(){
			return $this.data;
		},
		
		setScheme: function(scheme){
			this.options.scheme = scheme;
			
		},
		
		_construct: function(data, scheme, editorStack, parentElt, scope, key){
			var needPopEditors = false;
			if(scheme.editors){
				editorStack.push(scheme.editors);
				needPopEditors = true;
			}

			var dataObj = data;
			var wrap = this.$('<div class="_jsb_ceValueWrapper"></div>');
			parentElt.append(wrap);
			
			if(scheme.editor){
				this._constructEditor(dataObj, scheme.editor, editorStack, wrap, scope, key);
			} else {
				switch(scheme.type){
				case 'object':
					if(dataObj && !JSB.isObject(dataObj)){
						throw 'Specified data is not corresponded to scheme';
					}
					this._constructObject(dataObj, scheme, editorStack, wrap);
					break;
				case 'array':
					if(dataObj && !JSB.isArray(dataObj)){
						dataObj = [dataObj];
					}
					this._constructArray(dataObj, scheme, editorStack, wrap);
					break;
				case 'value':
					break;
				}
			}
			
			//
			if(needPopEditors){
				editorStack.pop();
			}
		},
		
		_constructEditor: function(data, editor, editorStack, parentElt, scope, key){
			var editorDesc = null;
			scope[key] = {
				type: 'editor'
			};
			// search for editor
			if(JSB.isString(editor)){
				// lookup editor desc in editorStack
				for(var i = editorStack.length - 1; i >= 0; i--){
					var editorMap = editorStack[i];
					if(editorMap[editor]){
						editorDesc = editorMap[editor];
						break;
					}
				}
			} else {
				editorDesc = editor;
			}
			if(!editorDesc){
				throw 'Unresolved reference for editor bean: ' + editor;
			}
			if(!editorDesc.jsb){
				throw 'Invalid bean reference declaration: ' + JSON.stringify(editorDesc);
			}
			
			function _constructEditorClass(editorCls, opts){
				var editorInst = new editorCls(opts || {});
				parentElt.append(editorInst.getElement());
				scope[key].editor = editorInst;
				if(data){
					editorDesc.set.call(editorInst, data);
				}
			}
			
			scope[key].editorDesc = editorDesc;
			if(!scope[key].editorDesc.get){
				scope[key].editorDesc.get = function(){ return this.getData.call(this); };
			} else if(JSB.isString(scope[key].editorDesc.get)){
				var getPropName = scope[key].editorDesc.get;
				scope[key].editorDesc.get = function(){ return this[getPropName].call(this); };
			}
			if(!scope[key].editorDesc.set){
				scope[key].editorDesc.set = function(val){ return this.setData.call(this, val); };
			} else if(JSB.isString(scope[key].editorDesc.set)){
				var setPropName = scope[key].editorDesc.set;
				scope[key].editorDesc.set = function(val){ return this[setPropName].call(this, val); };
			}
			
			
			if(JSB.isString(editorDesc.jsb)){
				JSB.lookup(editorDesc.jsb, function(cls){
					_constructEditorClass(cls, editorDesc.options);
				});
			} else if(JSB.isFunction(editorDesc.jsb)){
				_constructEditorClass(editorDesc.jsb, editorDesc.options);
			} else if(editorDesc.jsb.getClass){
				_constructEditorClass(editorDesc.jsb.getClass(), editorDesc.options);
			} else {
				throw 'Invalid bean reference declaration: ' + JSON.stringify(editorDesc);
			}
		},
		
		_constructObject: function(data, scheme, editorStack, parentElt, scope, key){
			parentElt.addClass('object');
			scope[key] = {
				type: 'object',
				fields: []
			};
			for(var i = 0; i < scheme.fields.length; i++){
				
			}
		},
		
		_constructArray: function(data, scheme, editorStack, parentElt, scope, key){
			parentElt.addClass('array');
		}
	}
}