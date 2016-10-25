JSB({
	name:'Antiplag.DocumentEditor',
	parent: 'JSB.Widgets.Control',
	require: ['JSB.Widgets.PrimitiveEditor'],
	
	client: {
		originalText: null,
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentEditor');
			this.loadCss('documenteditor.css');
			
			this.editor = new JSB.Widgets.PrimitiveEditor({
				multiline: true,
				onChange: function(){
					if(self.getText() != self.originalText && self.options.onChangeText){
						self.options.onChangeText.call(self, self.getText(), self.originalText);
					}
				}
			});
			this.append(this.editor);
		},
		
		setText: function(txt){
			this.originalText = txt;
			this.editor.setData(txt);
		},
		
		getText: function(){
			return this.editor.getData().getValue();
		},
		
		isTextChanged: function(){
			return this.getText() != this.originalText;
		},
		
		updateOriginal: function(){
			this.originalText = this.getText();
		}
		
	},
	
	server: {
	}
});