JSB({
	name:'JSB.Widgets.PrimitiveEditor',
	parent: 'JSB.Widgets.Editor',
	require: {
		'JSB.Widgets.Value': 'Value',
		'JSB.Widgets.ListBox': 'ListBox',
		'JQuery.Placeholder': 'Placeholder',
		'JSB.Widgets.DroplistTool': 'DroplistTool'
	},
	bootstrap: function(){
		this.lookupSingleton('JSB.Widgets.EditorRegistry', function(obj){
			obj.register([
			              'java.lang.Object', 
			              'java.lang.String', 
			              'java.lang.Integer',
			              'java.lang.Long',
			              'java.lang.Float',
			              'java.lang.Double',
			              'java.lang.Character',
			              'string',
			              'char',
			              'float',
			              'int',
			              'long',
			              'double'
			              ], this);
		})
	},
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('primitiveeditor.css');
			this.addClass('_dwp_primitiveEditor');
			this.addClass(this.options.mode);
			
			if(this.options.multiline && this.options.valueType != 'java.lang.Object' && this.options.valueType != 'java.lang.String' && this.options.valueType != 'string'){
				this.options.multiline = false;
			}
/*			
			this.applyBehavior({
				allowResize: {
					vertical: this.options.multiline,
					horizontal: true
				},
				dimensions: {
					aspect: (this.options.multiline ? 1.33: null),
					defaultWidth: (this.options.multiline ? 250: null),
					defaultHeight: (this.options.multiline ? 150: null),
				}
			});
*/			
			this.emptyData = this.data = new Value(null, this.options.valueType); 
			this.isMouseInside = false;
			if(this.options.multiline){
				this.editBoxElt = this.$('<textarea></textarea>');
				this.getElement().addClass('multiline');
				if(!JSO().isNull(this.options.rows)){
					this.editBoxElt.attr('rows', this.options.rows);
				}
				if(!JSO().isNull(this.options.cols)){
					this.editBoxElt.attr('cols', this.options.cols);
				}
			} else {
				this.editBoxElt = this.$('<input type="text" name=""></input>');
				if(this.options.password){
					this.editBoxElt.attr('type', 'password');
				}
			}
			if (!JSO().isString(this.options.title)) {
				this.getElement().attr('title', this.options.title);
			}
			if(!JSO().isNull(this.options.placeholder)){
				this.editBoxElt.attr('placeholder', this.options.placeholder);
				this.editBoxElt.placeholder();
			}
			if(this.options.readonly){
				this.editBoxElt.attr('readonly', true);
				this.editBoxElt.addClass('readonly');
			}
			this.getElement().append(this.editBoxElt);
			if(this.options.mode == 'inplace'){
				this.plainElt = this.$('<div class="_dwp_plain"></div>');
				this.getElement().append(this.plainElt);
				this.plainElt.dblclick(function(evt){
					self.beginEdit();
					evt.stopPropagation();
				});
				this.plainElt.click(function(evt){
					evt.stopPropagation();
					if(!JSO().isNull(self.clickKey)){
						JSO().Window.clearTimeout(self.clickKey);
						self.clickKey = null;
						return;
					}
					self.clickKey = JSO().Window.setTimeout(function(){
						self.clickKey = null;
						self.plainElt.parent().trigger(new JSO().$.Event('click'));
						
					}, 200);
				});
				this.editBoxElt.focusout(function(evt){
					self.endEdit();
				});
				
				this.editBoxElt.mouseleave(function(evt){
					self.isMouseInside = false;
				});

				this.editBoxElt.mouseenter(function(evt){
					self.isMouseInside = true;
				});

				this.$('body').click(function(evt){
					if(!self.isMouseInside && self.editing){
						if(self.isValid()){
							if(self.options.mode == 'inplace'){
								self.plainElt.text(self.getData().getValue());
							}
							self.trackChanging(evt);
						}
						self.endEdit();
					}
				});
			}
			
			this.editBoxElt.bind('input propertychange', function(evt) {
				if(JSO().isNull(self.options.mode) || self.options.mode != 'inplace'){
					self.trackChanging(evt);
				}
			});
			
			this.editBoxElt.keypress(function(evt){
				self.setMark(false);
				if((evt.which == 13 || evt.which == 10) && (!self.options.multiline || evt.ctrlKey)){
					// check valid
					if(self.isValid()){
						self.publish('editComplete');
						if(self.options.mode == 'inplace'){
							self.plainElt.text(self.getData().getValue());
							self.endEdit();
						}
						if(!JSO().isNull(self.options.onChange)){
							self.options.onChange.call(self, self.getData().getValue(), evt);
						}
					} 
				}
				
				evt.stopPropagation();
			});
			
			this.editBoxElt.keydown(function(evt){
				self.setMark(false);
				if(evt.which == 27){
					// ESC pressed
					if(self.options.mode == 'inplace'){
						evt.stopPropagation();
						self.endEdit();
					}
				} else if(evt.which == 40 && !JSO().isNull(self.autoBox) && self.autoBox.isVisible()) {
					// down arrow pressed
					self.autoBox.setFocus();
				} else {
					if(self.isFocused()){
						evt.stopPropagation();
					}
				}

				if(evt.which != 13 && evt.which != 27 && evt.which != 40 && evt.which != 38 && !self.keyPressedMap['key' + evt.which]){
					self.changed = true;
					self.trackChanging(evt);
					self.beginCheckAutocomplete();
				}
				self.keyPressedMap['key' + evt.which] = true;
				
				return true;
			});

			this.editBoxElt.keyup(function(evt){
				if(evt.which != 27){
					if(self.isFocused()){
						evt.stopPropagation();
					}
				}
				
				if((evt.which != 13 || self.options.multiline) && evt.which != 27 && evt.which != 40 && evt.which != 38){
					self.trackChanging(evt);
					self.endCheckAutocomplete();
				}
				
				delete self.keyPressedMap['key' + evt.which];

				return true;
			});
			
			this.editBoxElt.click(function(evt){
				evt.stopPropagation();
				self.editBoxElt.focus();
			});

			this.editBoxElt.focusout(function(evt){
				if(!JSO().isNull(self.options.onChange) && self.changed ){
					self.changed = false;
					self.trackChanging(evt);
				}
				if(self.options.onFocusOut){
					self.options.onFocusOut.call(self, evt);
				}
			});
			
			this.editBoxElt.focus(function(evt){
				if(self.options.onFocus){
					self.options.onFocus.call(self, evt);
				}
			});
		},
		
		keyPressedMap: {},
		
		options: {
			valueType: 'java.lang.String',
			mode: 'simple',	// simple | inplace	
			readonly: false,
			multiline: false,
			placeholder: '',
			title: '',
			password: false,
			autocomplete: null,
			
			valueType: 'string',
			
			onChange: null,
			onValidate: function(val){return true;},
			onContextMenu: function(evt){
				return true;
			},
			onFocus: null,
			onFocusOut: null,
			
		},
		setData: function(val){
			var self = this;
			this.setMark(false);
			if(JSO().isInstanceOf(val, 'JSB.Widgets.Value')){
				this.data = val;
			} else {
				this.data = new Value(val, this.options.valueType);
			}
			this.editBoxElt.val(this.data.getValue());
			if(this.options.mode == 'inplace'){
				this.plainElt.text(this.data.getValue());
			}
			this.lastVal = this.data.getValue();
		},
		
		setReadonly: function(b){
			if(b){
				this.editBoxElt.attr('readonly', true);
				this.editBoxElt.addClass('readonly');
			} else {
				this.editBoxElt.attr('readonly', false);
				this.editBoxElt.removeClass('readonly');
			}
			this.options.readonly = b;
		},
		
		isReadonly: function(){
			return this.options.readonly;
		},
		
		clear: function(){
			this.data = this.emptyData;
			this.editBoxElt.val('');
			this.lastVal = this.data.getValue();
		},
		
		setPlaceholderText: function(txt){
			this.editBoxElt.attr('placeholder', txt);
			this.editBoxElt.placeholder();
		},
		
		beginEdit: function(){
			if(this.options.readonly){
				return;
			}
			if(this.options.mode == 'inplace'){
				var elt = this.getElement(); 
				elt.css({
					width: elt.width(),
					height: elt.height()
				});
				elt.addClass('editing');
				this.editBoxElt.focus();
				this.editBoxElt.select();
			}
			this.editing = true;
		},
		
		endEdit: function(){
			if(this.options.mode == 'inplace'){
				var elt = this.getElement();
				elt.removeClass('editing');
				this.editBoxElt.val(this.plainElt.text());
				elt.css({
					width: '',
					height: ''
				});
			}
			this.editing = false;
		},
		
		setMark: function(enable){
			if(enable){
				if(!this.editBoxElt.hasClass('invalid')){
					this.editBoxElt.addClass('invalid');
				}
			} else {
				this.editBoxElt.removeClass('invalid');
			}
		}, 
		
		isValid: function(){
			var bValid = true;
			var val = this.editBoxElt.val();
			if(this.options.valueType == 'java.lang.Integer'
				|| this.options.valueType == 'java.lang.Long'
				|| this.options.valueType == 'int'
				|| this.options.valueType == 'long'){
				bValid = /^\s*[-+]?\d+\s*$/gi.test(val);
			} else if(this.options.valueType == 'java.lang.Float'
				|| this.options.valueType == 'java.lang.Double'
				|| this.options.valueType == 'float'
				|| this.options.valueType == 'double'){
				bValid = /^\s*[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?\s*$/gi.test(val);
			} else if(this.options.valueType == 'java.lang.Boolean'
				|| this.options.valueType == 'boolean'){
				bValid = /^\s*(true|false)\s*$/gi.test(val);
			} else if(this.options.valueType == 'java.lang.Character'
				|| this.options.valueType == 'char'){
				bValid = val.length == 1;
			}
			bValid = bValid && $base(); 
			bValid = bValid && this.options.onValidate(val);
			this.setMark(!bValid);
			return bValid;
		},
		
		getData: function(){
			var val = this.editBoxElt.val();
			
			if(JSO().isNull(val) ){
				this.data.setValue(null);
			} else if(this.options.valueType == 'java.lang.Object'){
				// detect value type
				if( /^\s*[-+]?\d+\s*$/gi.test(val) ){
					// test integer
					this.data.setValue(parseInt(val));
					this.data.setType('java.lang.Integer');
				} else if(/^\s*[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?\s*$/gi.test(val)){
					// test float
					this.data.setValue(parseFloat(val));
					this.data.setType('java.lang.Double');
				} else if(/^\s*(true|false)\s*$/gi.test(val)){
					// test bool
					if(/^\s*true\s*$/gi.test(val)){
						this.data.setValue(true);
					} else {
						this.data.setValue(false);
					}
					this.data.setType('java.lang.Boolean');
				} else {
					this.data.setValue(val);
					this.data.setType('java.lang.String');
				}
			} else if(this.options.valueType == 'java.lang.Integer'
				|| this.options.valueType == 'java.lang.Long'
				|| this.options.valueType == 'int'
				|| this.options.valueType == 'long'){
				
				this.data.setValue(parseInt(val));
			} else if(this.options.valueType == 'java.lang.Float'
				|| this.options.valueType == 'java.lang.Double'
				|| this.options.valueType == 'float'
				|| this.options.valueType == 'double'){
				this.data.setValue(parseFloat(val));
			} else if(this.options.valueType == 'java.lang.Boolean'
				|| this.options.valueType == 'boolean'){
				if(/^\s*true\s*$/gi.test(val)){
					this.data.setValue(true);
				} else {
					this.data.setValue(false);
				}
			} else if(this.options.valueType == 'java.lang.Character'
				|| this.options.valueType == 'char') {
				if(val.length > 0){
					this.data.setValue(val.charAt(0));
				} else {
					this.data.setValue(val);
				}
			} else {
				this.data.setValue(val);
			}
			
			return this.data;
		},
		
		setFocus: function(){
			this.editBoxElt.focus();
		},
		
		select: function(){
			this.editBoxElt.select();
		},
		
		trackChanging: function(evt){
			var self = this;
			var curVal = this.getData().getValue();
			if(curVal == this.lastVal) {
				return;
			}
			this.lastVal = curVal;
			
			if(JSO().isNull(this.options.mode) || this.options.mode != 'inplace'){
				if(!JSO().isNull(this.options.onChange)){
					this.options.onChange.call(this, curVal, evt);
				}
			}
		},
		
		beginCheckAutocomplete: function(){
			if(this.beginCheckCalled){
				return;
			}
			this.beginCheckCalled = true;
			this.autocompleteBeforeVal = this.getData().getValue();
		},
		
		endCheckAutocomplete: function(){
			var self = this;
			this.beginCheckCalled = false;
			
			if(!JSO().isNull(self.options.autocomplete)){
				JSO().defer(function(){
					if(JSO().isFunction(self.options.autocomplete)){
						var afterVal = self.getData().getValue();
						if(self.autocompleteBeforeVal == afterVal){
							return;
						}
						var res = self.options.autocomplete.call(self, self.getData().getValue(), function(arr, val){
							if(JSO().isNull(val) || val == self.getData().getValue()){
								self.setAutocomplete(arr);
							}
						});
						if(JSO().isArray(res)){
							self.setAutocomplete(res);
						}
					} else if(JSO().isArray(self.options.autocomplete)){
						self.setAutocomplete(self.options.autocomplete);
					}
					
				}, 100, '_autocomplete' + this.getId());
			}

		},
		
		setAutocomplete: function(list){
			var self = this;
			var toolMgr = JSO().getInstance('JSB.Widgets.ToolManager');
			if(!JSO().isNull(this.autoBox) && this.autoBox.isVisible()){
				if(JSO().isNull(list) || list.length == 0){
					this.autoBox.close();
					this.autoBox = null;
				} else {
					this.autoBox.setData({data: list, callback: function(val){
						self.changed = true;
						self.setData(val);
					}});
				}
				return;
			}
			if(!JSO().isNull(list) && list.length > 0){
				this.autoBox = toolMgr.activate({
					id: '_dwp_droplistTool',
					cmd: 'show',
					data: list,
					scope: this,
					target: {
						selector: this.getElement(),
						dock: 'bottom'
					},
					callback: function(val){
						self.changed = true;
						self.setData(val);
					}
				});
			}

		}
			
	}
});