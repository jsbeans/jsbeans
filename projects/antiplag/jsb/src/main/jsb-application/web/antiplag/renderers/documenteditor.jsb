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
			
			this.document = this.options.document;
			this.editor = new JSB.Widgets.PrimitiveEditor({
				multiline: true,
				onChange: function(){
					self.publish('textChanged', self.getText() != self.originalText);
					if(self.options.onChangeText){
						self.options.onChangeText.call(self, self.getText(), self.originalText);
					}
				}
			});
			this.append(this.editor);
			this.load();
		},
		
		load: function(){
			var self = this;
			this.getElement().loader();
			this.document.server.getPlainText(function(txt){
				self.originalText = txt;
				self.editor.setData(txt);
				self.getElement().loader('hide');
				if(self.options.onLoadText){
					self.options.onLoadText.call(self, txt);
				}
			});
		},
		
		getText: function(){
			return this.editor.getData().getValue();
		},
		
		save: function(callback){
			this.document.server.saveText(this.getText(), callback);
		}
		
	},
	
	server: {
	}
});