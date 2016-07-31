JSB({
	name: 'Ontoed.LiteralRenderer',
	parent: 'Ontoed.Renderer',
	require: ['JSB.Widgets.Button', 'JSB.Widgets.ToolManager'],
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('literalRenderer');
			this.loadCss('literalrenderer.css');
			this.info = opts.info;
			
			this.iconContainer = this.$('<div class="iconContainer"></div>');
			this.append(this.iconContainer);
			this.icon = this.$('<div class="icon"></div>');
			this.iconContainer.append(this.icon);

			this.valueContainer = this.$('<div class="valueContainer"></div>');
			this.append(this.valueContainer);
			
			this.fixupType();
			
			if(this.options.allowEdit){
				if(!this.info.plain && this.info.type != 'IRI'){
					this.iconContainer.addClass('changeable');
					// construct dropdown type list
					var types = [{
						type: 'typename',
						value: 'xsd:string'
					},{
						type: 'typename',
						value: 'xsd:int'
					},{
						type: 'typename',
						value: 'xsd:float'
					},{
						type: 'typename',
						value: 'xsd:double'
					},{
						type: 'typename',
						value: 'xsd:boolean'
					},{
						type: 'typename',
						value: 'xsd:dateTime'
					}];
					
					var items = [];
					
					for(var i in types){
						var node = Ontoed.RendererRepository.createRendererFor(types[i], {allowNavigate: false});
						items.push({
							key: types[i].value,
							element: node
						});
					}
					
					this.iconContainer.append('<span class="menu">&#x25be;</span>');
					this.iconContainer.click(function(evt){
						if(!self.getElement().is('.editing')){
							return;
						}
						evt.stopPropagation();
						
						JSB.Widgets.ToolManager.activate({
							id: '_dwp_droplistTool',
							cmd: 'show',
							data: items,
							target: {
								selector: self.iconContainer,
								dock: 'bottom'
							},
							callback: function(key, item, evt){
								var oldVal = self.getEditingValue();
								self.editingType = key;
								self.getElement().attr('type', self.editingType);
								self.icon.attr('title', self.editingType);
								self.tryAssignEditingValue(oldVal);
								self.validationCheck();
							}
						});
	
					});
				}
				
				this.editContainer = this.$('<div class="editContainer"></div>');
				this.append(this.editContainer);
				
				// string editor
				this.stringEditor = new JSB.Widgets.PrimitiveEditor({
					multiline: true,
					placeholder: 'Введите текст',
					rows: 1,
				});
				this.editContainer.append(this.stringEditor.getElement());
				this.stringEditor.addClass('stringEditor');

				// value editor
				this.valueEditor = new JSB.Widgets.PrimitiveEditor({
					placeholder: 'Введите значение',
					onChange: function(){
						self.validationCheck();
					}
				});
				this.editContainer.append(this.valueEditor.getElement());
				this.valueEditor.addClass('valueEditor');

				// boolean editor
				this.booleanEditor = this.$('<div class="booleanEditor"><span class="value"></span><span class="menu">&#x25be;</span></div>');
				this.editContainer.append(this.booleanEditor);
				this.booleanEditor.addClass('booleanEditor');
				this.booleanEditor.click(function(evt){
					evt.stopPropagation();
					
					JSB.Widgets.ToolManager.activate({
						id: '_dwp_droplistTool',
						cmd: 'show',
						data: [{
							key: 'true',
							element: 'true'
						},{
							key: 'false',
							element: 'false'
						}],
						target: {
							selector: self.booleanEditor,
							dock: 'bottom'
						},
						callback: function(key, item, evt){
							self.booleanEditor.find('> .value').text(key).removeClass('true').removeClass('false').addClass(key);
						}
					});

				});

				this.okBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnOk btn10',
					tooltip: 'Сохранить',
					onClick: function(evt){
						evt.stopPropagation();
						self.info.datatype = self.editingType;
						self.info.value = self.getEditingValue();
						if(self.options.onChange){
							self.options.onChange.call(self,{
								datatype: self.info.datatype,
								value: self.info.value
							})
						}
						self.fixupType();
						self.removeClass('editing');
						self.construct();
					}
				});
				this.editContainer.append(this.okBtn.getElement());

				this.cancelBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnCancel btn10',
					tooltip: 'Отменить',
					onClick: function(evt){
						evt.stopPropagation();
						self.fixupType();
						self.removeClass('editing');
					}
				});
				this.editContainer.append(this.cancelBtn.getElement());

				
				this.editBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnEdit btn10',
					tooltip: 'Редактировать',
					onClick: function(evt){
						evt.stopPropagation();
						self.beginEdit();
					}
				});
				this.append(this.editBtn);
			}

			this.construct();
		},
		
		beginEdit: function(){
			this.addClass('editing');
			this.editingType = this.info.datatype;
			this.tryAssignEditingValue(this.info.value);
			this.validationCheck();
		},
		
		validationCheck: function(){
			var val = this.getEditingValue();
			if(JSB().isNull(val)){
				// deny
				this.okBtn.enable(false);
			} else {
				// allow
				if(this.editingType == 'IRI' && val.trim().length === 0){
					this.okBtn.enable(false);
				} else {
					this.okBtn.enable(true);
				}
			}
			
			if(this.editingType == 'IRI' && (!this.info.value || this.info.value.trim().length === 0)){
				this.cancelBtn.enable(false);
			} else {
				this.cancelBtn.enable(true);
			}
		},
		
		tryAssignEditingValue: function(val){
			switch(this.editingType){
			case 'IRI':
				this.valueEditor.setData('' + val);
				this.valueEditor.setFocus();
				break;
			case 'xsd:string':
				this.stringEditor.setData('' + val);
				this.stringEditor.setFocus();
				break;
			case 'xsd:boolean':
				if(JSB().isBoolean(val)){
					if(val){
						this.booleanEditor.find('> .value').text('true').addClass('true').removeClass('false');
					} else {
						this.booleanEditor.find('> .value').text('false').addClass('false').removeClass('true');
					}
				} else if(JSB().isString(val)){
					if(val == 'true'){
						this.booleanEditor.find('> .value').text('true').addClass('true').removeClass('false');
					} else {
						this.booleanEditor.find('> .value').text('false').addClass('false').removeClass('true');
					}
				} else if(JSB().isNumber(val)){
					if(val > 0 || val < 0){
						this.booleanEditor.find('> .value').text('true').addClass('true').removeClass('false');
					} else {
						this.booleanEditor.find('> .value').text('false').addClass('false').removeClass('true');
					}
				} else {
					this.booleanEditor.find('> .value').text('false').addClass('false').removeClass('true');
				}
				break;
			case 'xsd:int':
				if(JSB().isNull(val)){
					this.valueEditor.setData('');
				}
				if(JSB().isString(val)){
					var intVal = parseInt(val);
					if(isNaN(intVal)){
						this.valueEditor.setData('0');
					} else {
						this.valueEditor.setData('' + intVal);
					}
				}
				if(JSB().isNumber(val)){
					this.valueEditor.setData('' + parseInt('' + val));
				} else if(JSB().isBoolean(val)){
					if(val){
						this.valueEditor.setData('1');
					} else {
						this.valueEditor.setData('0');
					}
				} else {
					this.valueEditor.setData('');
				}
				this.valueEditor.setFocus();
				break;
			case 'xsd:float':
			case 'xsd:double':
				if(JSB().isNull(val)){
					this.valueEditor.setData('');
				}
				if(JSB().isString(val)){
					var floatVal = parseFloat(val);
					if(isNaN(floatVal)){
						this.valueEditor.setData('0.0');
					} else {
						this.valueEditor.setData('' + floatVal);
					}
				}
				if(JSB().isNumber(val)){
					this.valueEditor.setData('' + parseFloat('' + val));
				} else if(JSB().isBoolean(val)){
					if(val){
						this.valueEditor.setData('1.0');
					} else {
						this.valueEditor.setData('0.0');
					}
				} else {
					this.valueEditor.setData('');
				}
				this.valueEditor.setFocus();
				break;
			case 'xsd:dateTime':
				this.valueEditor.setData('' + val);
				this.valueEditor.setFocus();
				break;
			default:
				throw 'Unknown value: ' + val;
			}
		},
		
		getEditingValue: function(){
			switch(this.editingType){
			case 'xsd:string':
				return this.stringEditor.getData().getValue();
			case 'xsd:boolean':
				return (this.booleanEditor.find('> .value').text() == 'true' ? true: false);
			case 'xsd:int':
				var intVal = parseInt(this.valueEditor.getData().getValue());
				if(isNaN(intVal)){
					return null;
				}
				return intVal;
			case 'xsd:float':
			case 'xsd:double':
				var floatVal = parseFloat(this.valueEditor.getData().getValue());
				if(isNaN(floatVal)){
					return null;
				}
				return floatVal;
			case 'xsd:dateTime':
				return this.valueEditor.getData().getValue();
			case 'IRI':
				return this.valueEditor.getData().getValue();
			}
			return null;
		},
		
		fixupType: function(){
			// resolve literal type
			var dataType = this.info.datatype;
			if(!JSB().isString(dataType)){
				dataType = 'xsd:string';
			}
			if(this.info.isRDFPlainLiteral){
				dataType = 'xsd:string';
			}
			if(this.info.type.toLowerCase() == 'iri'){
				dataType = 'IRI';
			}
			
			if(dataType == 'String'){
				dataType = 'xsd:string';
			}
			
			if(dataType == 'boolean' || dataType == 'xsd:boolean'){
				dataType = 'xsd:boolean';
				if(this.info.value && this.info.value != 'false'){
					this.info.value = true;
				} else {
					this.info.value = false;
				}
			}
			
			if(dataType == 'int' || dataType == 'decimal' || dataType == 'xsd:decimal'){
				dataType == 'xsd:int';
			} else if(dataType == 'float'){
				dataType == 'xsd:float';
			} else if(dataType == 'double'){
				dataType == 'xsd:double';
			}
			
			this.info.datatype = dataType;
			this.editingType = dataType;
			this.getElement().attr('type', this.info.datatype);
			this.icon.attr('title', this.info.datatype);

		},
		
		construct: function(){
			var self = this;
			
			this.icon.attr('title', this.info.datatype);
			
			var value = this.info.value;
			
			this.getElement().attr('originalString', this.info.string);
			
			
			switch(this.info.datatype){
			case 'IRI':
				value = this.$('<span class="value" ></span>').text(this.info.value);
				value.attr('title', this.info.value);
				break;
			case 'xsd:string':
				value = this.$('<div class="value collapsed"></div>');
				value.attr('title', this.info.value);
				value.css({
					height: '16px'
				});
				
				var rsContainer = this.$('<div class="rsContainer"></div>');
				value.append(rsContainer);
				
				var toggle = this.$('<div class="expander hidden" title="Развернуть">&#9660;</div>');
				value.append(toggle);
				
				// process string value
				var maxLength = 256;
				var totalLength = 0;
				var str = this.info.value;
				var strArr = str.split('\n');
				var bNeedToggle = false;
				
				// clear empty strings
				for(var i = strArr.length - 1; i >= 0; i-- ){
					if(strArr[i].trim().length === 0){
						strArr.splice(i, 1);
					}
				}
				
				for(var i = 0; i < strArr.length; i++ ){
					var pStr = strArr[i].trim();
					var p = this.$('<p></p>').append(pStr);
					rsContainer.append(p);
					
					totalLength += pStr.length;
				}
				
				this.getElement().resize(function(){
					if(!value.is('.collapsed')){
						return;
					}
					if(rsContainer.height() > value.height()){
						toggle.removeClass('hidden');
					} else {
						toggle.addClass('hidden');
					}
				});
				
				toggle.click(function(evt){
					evt.stopPropagation();
					if(value.is('.collapsed')){
						value.animate({
							height: rsContainer.height()
						});
						value.removeClass('collapsed');
						value.addClass('expanded');
						toggle.empty();
						toggle.append('&#9650;');
						toggle.attr('title', "Свернуть");
					} else {
						value.animate({
							height: '16px'
						});

						value.removeClass('expanded');
						value.addClass('collapsed');
						toggle.empty();
						toggle.append('&#9660;');
						toggle.attr('title', "Развернуть");
					}
				});
				break;
			default:
				value = this.$('<div class="value"></div>');
				value.append('' + this.info.value);
				value.addClass('' + this.info.value);
			}
			
			this.valueContainer.empty();
			this.valueContainer.append(value);

		}
		
		
	}
});
