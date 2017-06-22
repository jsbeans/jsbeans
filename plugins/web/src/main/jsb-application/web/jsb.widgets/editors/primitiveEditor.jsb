{
	$name:'JSB.Widgets.PrimitiveEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: {
		Value: 'JSB.Widgets.Value',
		ListBox: 'JSB.Widgets.ListBox',
		Placeholder: 'JQuery.Placeholder',
		DroplistTool: 'JSB.Widgets.DroplistTool'
	},
	$bootstrap: function(){
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
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('primitiveEditor.css');
			this.addClass('_dwp_primitiveEditor');
			this.addClass(this.options.mode);
			
			if(this.options.multiline && this.options.valueType != 'java.lang.Object' && this.options.valueType != 'java.lang.String' && this.options.valueType != 'string'){
				this.options.multiline = false;
			}
			
			this.emptyData = this.data = new Value(null, this.options.valueType); 
			this.isMouseInside = false;
			if(this.options.multiline){
				this.editBoxElt = this.$('<textarea></textarea>');
				this.getElement().addClass('multiline');
				if(!JSB().isNull(this.options.rows)){
					this.editBoxElt.attr('rows', this.options.rows);
				}
				if(!JSB().isNull(this.options.cols)){
					this.editBoxElt.attr('cols', this.options.cols);
				}
			} else {
				this.editBoxElt = this.$('<input type="text" name=""></input>');
				if(this.options.password){
					this.editBoxElt.attr('type', 'password');
				}
			}
			if (!JSB().isString(this.options.title)) {
				this.getElement().attr('title', this.options.title);
			}
			if(!JSB().isNull(this.options.placeholder)){
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
				if(this.options.dblclick){
					this.plainElt.dblclick(function(evt){
						self.beginEdit();
						evt.stopPropagation();
					});
				}
				this.plainElt.click(function(evt){
					evt.stopPropagation();
					if(!JSB().isNull(self.clickKey)){
						JSB().Window.clearTimeout(self.clickKey);
						self.clickKey = null;
						return;
					}
					self.clickKey = JSB().Window.setTimeout(function(){
						self.clickKey = null;
						self.plainElt.parent().trigger(new JSB().$.Event('click'));
						
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
				if(JSB().isNull(self.options.mode) || self.options.mode != 'inplace'){
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
						if(!JSB().isNull(self.options.onChange)){
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
				} else if(evt.which == 40 && !JSB().isNull(self.autoBox) && self.autoBox.isVisible()) {
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
					$this.updateAutocomplete($this.editBoxElt);
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
					$this.updateAutocomplete($this.editBoxElt);
				}
				
				delete self.keyPressedMap['key' + evt.which];

				return true;
			});
			
			this.editBoxElt.click(function(evt){
				evt.stopPropagation();
				$this.editBoxElt.focus();
			});

			this.editBoxElt.focusout(function(evt){
				if(!JSB().isNull(self.options.onChange) && self.changed ){
					self.changed = false;
					self.trackChanging(evt);
				}
				if($this.autoBox)
					$this.autoBox.close();
				if(self.options.onFocusOut){
					self.options.onFocusOut.call(self, evt);
				}
			});
			
			this.editBoxElt.focus(function(evt){
				$this.updateAutocomplete($this.editBoxElt);
				
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
			dblclick: true,
			
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
			if(JSB().isInstanceOf(val, 'JSB.Widgets.Value')){
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
			
			if(JSB().isNull(val) ){
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
		
		select: function(start, end){
			function createSelection(field, start, end) {
				if( field.createTextRange ) {
					var selRange = field.createTextRange();
					selRange.collapse(true);
					selRange.moveStart('character', start);
					selRange.moveEnd('character', end);
					selRange.select();
					field.focus();
				} else if( field.setSelectionRange ) {
					field.focus();
					field.setSelectionRange(start, end);
			    } else if( typeof field.selectionStart != 'undefined' ) {
			    	field.selectionStart = start;
			    	field.selectionEnd = end;
			    	field.focus();
			    }
			}
			
			if($jsb.isNull(start) && $jsb.isNull(end)){
				this.editBoxElt.select();
			} else {
				var val = this.editBoxElt.val();
				if($jsb.isNull(start)){
					start = 0;
				}
				if($jsb.isNull(end)){
					end = val.length;
				}
				createSelection(this.editBoxElt.get(0), start, end);
			}
		},
		
		trackChanging: function(evt){
			var self = this;
			var curVal = this.getData().getValue();
			if(curVal == this.lastVal) {
				return;
			}
			this.lastVal = curVal;
			
			if(JSB().isNull(this.options.mode) || this.options.mode != 'inplace'){
				if(!JSB().isNull(this.options.onChange)){
					this.options.onChange.call(this, curVal, evt);
				}
			}
		},
		
		updateAutocomplete: function(editor){
			if(!this.options.autocomplete)
				return;
			
			var t = editor[0].value,
				s = this.getSelectionStart(editor[0]),
				e = this.getSelectionEnd(editor[0]);
			
			this.beforeCaret = t.substring(0, s).replace(/ /g, '\xa0') || '\xa0';
			this.beforeCaret = this.beforeCaret.trim();
			this.afterCaret = t.substring(s).replace(/ /g, '\xa0') || '\xa0';
			this.afterCaret = this.afterCaret.trim();
			
			if(this.afterCaret){
				if(this.autoBox)
					this.autoBox.close();
				return;
			}
			
			var val = this.beforeCaret.split(',');
			val = val[val.length - 1].trim();
			var data = this.getData().getValue().split(',').map(function(e){ return e.trim(); });
			
			var list = [];
			if(val == '')
				for(var i in this.options.autocomplete){
					if(!data.includes(this.options.autocomplete[i]))
						list.push(this.options.autocomplete[i]);
				}
			else{
				for(var i in this.options.autocomplete){
					if(this.options.autocomplete[i].match(val) && !data.includes(this.options.autocomplete[i]))
						list.push(this.options.autocomplete[i]);
				}
			}
			
			this.setAutocomplete(list);
		},
		
		getSelectionStart: function(o) {
			if(!o){
				o = this.editBoxElt.get(0);
			}
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate();
				r.moveEnd('character', o.value.length);
				if (r.text == '') return o.value.length;
				return o.value.lastIndexOf(r.text);
			} else return o.selectionStart;
		},

		getSelectionEnd: function(o) {
			if(!o){
				o = this.editBoxElt.get(0);
			}
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate();
				r.moveStart('character', -o.value.length);
				return r.text.length;
			} else return o.selectionEnd;
		},
		
		getCaretPosition: function(){
			return this.getSelectionEnd();
		},
		
		setAutocomplete: function(list){
			var toolMgr = JSB().getInstance('JSB.Widgets.ToolManager');
			if(!JSB().isNull(this.autoBox) && this.autoBox.isVisible()){
				if(JSB().isNull(list) || list.length == 0){
					this.autoBox.close();
					this.autoBox = null;
				} else {
					this.autoBox.setData({data: list, callback: function(val){
						$this.changed = true;
						var oldVal = $this.beforeCaret.split(',');
						if(!JSB().isArray(oldVal))
							oldVal = [oldVal];
						oldVal.pop();
						oldVal = oldVal.toString();
						if(oldVal.length > 0)
							oldVal += ', ';
						$this.setData(oldVal + val);
						$this.setFocus();
					}});
				}
				return;
			}
			if(!JSB().isNull(list) && list.length > 0){
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
						$this.changed = true;
						var oldVal = $this.beforeCaret.split(',');
						if(!JSB().isArray(oldVal))
							oldVal = [oldVal];
						oldVal.pop();
						oldVal = oldVal.toString();
						if(oldVal.length > 0)
							oldVal += ', ';
						$this.setData(oldVal + val);
						$this.setFocus();
					}
				});
			}
		}
	}
}