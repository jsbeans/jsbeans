{
	$name:'JSB.Widgets.EnumEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: {
		ListBox: 'JSB.Widgets.ListBox',
		Value: 'JSB.Widgets.Value'
	},
	$bootstrap: function(){
		this.lookupSingleton('JSB.Widgets.EditorRegistry', function(obj){
			obj.register(['java.lang.Enum',
			              'java.lang.Boolean',
			              'boolean'
			              ], this);
		})
	},
	$client: {
		$constructor: function(opts){
			$base(opts);
			$jsb.loadCss('enumEditor.css');
			this.getElement().addClass('_dwp_enumEditor');
			this.init();
		},
		
		behavior: {
			dimensions: {
				defaultWidth: 200,
				defaultHeight: 200
			}
		},
		
		init: function(){
			var self = this;
			this.data = new Value(null, this.options.valueType);
			if(this.options.valueType == 'java.lang.Boolean' || this.options.valueType == 'boolean'){
				// create editor for boolean
				self.createEnumForBoolean();
			} else if(this.options.valueType == 'java.lang.Enum') {
				self.createEnumForList(this.options.enum);
			} else {
				// obtain type information
				JSB().lookupSingleton('JSB.TypeInfoRegistry', function(tir){
					tir.lookup(self.options.valueType, function(desc){
						self.desc = desc;
						self.createEnumForType(desc);
					});
				});
			}
		},
		
		createEnumForBoolean: function(){
			var self = this;
			this.listBox = new ListBox({
				onSelectionChanged: function(key){
					self.changeSelection(key);
				}
			});
			this.getElement().append(self.listBox.getElement());
			
			self.listBox.addItem('true');
			self.listBox.addItem('false');
			
			if(!JSB().isNull(this.data.getValue())){
				if(this.data.getValue()){
					self.listBox.selectItem('true');
				} else {
					self.listBox.selectItem('false');
				}
			}
		},
		
		createEnumForType: function(desc){
			var self = this;
			this.listBox = new ListBox({
				onSelectionChanged: function(key){
					self.changeSelection(key);
				}
			});
			this.getElement().append(self.listBox.getElement());
			for(var i in desc.enumConstants){
				var val = desc.enumConstants[i];
				self.listBox.addItem(val);
			}
			if(!JSB().isNull(this.data.getValue())){
				this.dontComplete = true;
				self.listBox.selectItem(this.data.getValue());
				this.dontComplete = false;
			}
		},
		
		createEnumForList: function(items){
			var self = this;
			this.listBox = new ListBox({
				onSelectionChanged: function(key){
					self.changeSelection(key);
				}
			});
			this.getElement().append(self.listBox.getElement());
			for(var i in items){
				var val = items[i];
				self.listBox.addItem(val);
			}
			if(!JSB().isNull(this.data.getValue())){
				this.dontComplete = true;
				self.listBox.selectItem(this.data.getValue());
				this.dontComplete = false;
			}
		},
		
		setData: function(val){
			var self = this;
			if(JSB().isInstanceOf(val, 'JSB.Widgets.Value')){
				this.data = val;
			} else {
				this.data = new Value(val, this.options.valueType);
			}
			
			this.dontComplete = true;
			if(!JSB().isNull(this.listBox) && !JSB().isNull(this.data.getValue())){
				if(this.options.valueType == 'java.lang.Boolean' || this.options.valueType == 'boolean') {
					if(this.data.getValue()){
						self.listBox.selectItem('true');
					} else {
						self.listBox.selectItem('false');
					}
				} else {
					this.listBox.selectItem(this.data.getValue());
				}
			}
			this.dontComplete = false;
		},
		
		getData: function(){
			return this.data;
		},
		
		changeSelection: function(val){
			if(this.options.valueType == 'java.lang.Boolean' || this.options.valueType == 'boolean') {
				if(val == 'true') {
					this.data.setValue(true);
				} else {
					this.data.setValue(false);
				}
			} else {
				this.data.setValue(val);
				this.data.setType(this.options.valueType);
			}
			if(!this.dontComplete){
				this.publish('editComplete');
			}
		},
		
		setFocus: function(){
		}
	}
}