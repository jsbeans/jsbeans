JSB({
	name:'Antiplag.DocumentRenderer',
	parent: 'JSB.Widgets.Control',
	require: [],
	
	client: {
		highlights: [],
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentRenderer');
			this.loadCss('documentrenderer.css');
		},
		
		setText: function(txt){
			this.text = txt;
			this.redraw();
		},
		
		redraw: function(){
			this.getElement().empty();

			// inject highlight marks
			var html = this.text;
			
			for(var i = 0; i < this.highlights.length; i++){
				var h = this.highlights[i];
				var keyword = h.text;
/*				
				html = html.toLowerCase().replace(new RegExp(keyword, 'g'), '<span class="highlight" id="'+h.id+'">' + keyword + '</span>');
*/				
//				console.log(keyword);
				var lastIdx = 0;
				while(true){
					var fromIdx = html.toLowerCase().indexOf(keyword.toLowerCase(), lastIdx);
					if(fromIdx == -1){
						break;
					}
					var toIdx = fromIdx + h.length;
					// do replace
					var prefix = html.substr(0, fromIdx);
					var postfix = html.substr(toIdx, html.length - toIdx);
					var highlightStr = html.substr(fromIdx, toIdx - fromIdx);
					html = prefix + '<span class="highlight" id="'+h.id+'">' + highlightStr + '</span>' + postfix;
					lastIdx = toIdx + 77;
				}
				
			}
			
			var pArr = html.split('\n');
			
			for(var i = 0; i < pArr.length; i++){
				var pTxt = pArr[i];
				if(pTxt.trim().length === 0){
					this.append('<br />');
				} else {
//					var pElt = this.$('<p></p>').text(pTxt);
					this.append(pTxt);
				}
			}
		},
		
		highlight: function(hArr){
			this.highlights = hArr;
			this.redraw();
		}
		
	},
	
	server: {
	}
});