JSB({
	name:'Antiplag.DocumentRenderer',
	parent: 'JSB.Widgets.Control',
	require: [],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentRenderer');
			this.loadCss('documentrenderer.css');
			
			this.document = this.options.document;
			this.load();
		},
		
		load: function(){
			var self = this;
			this.getElement().loader();
			this.document.server.getPlainText(function(txt){
				self.drawText(txt);
				self.getElement().loader('hide');
				if(self.options.onLoadText){
					self.options.onLoadText.call(self, txt);
				}
			});
		},
		
		drawText: function(txt){
			this.getElement().empty();
			var pArr = txt.split('\n');
			
			for(var i = 0; i < pArr.length; i++){
				var pTxt = pArr[i];
				if(pTxt.trim().length === 0){
					this.append('<br />');
				} else {
					var pElt = this.$('<p></p>').text(pTxt);
					this.append(pElt);
				}
			}
		}
		
	},
	
	server: {
	}
});