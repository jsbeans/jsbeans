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
			
			this.subscribe('activateHighlight', function(sender, msg, hid){
				if(sender == self){
					return;
				}
				self.activateHighlight(hid);
			});
		},
		
		setText: function(txt){
			this.text = txt;
			this.redraw();
		},
		
		redraw: function(){
			var self = this;
			this.getElement().empty();

			// inject highlight marks
			var html = this.text;
			var deltaOffset = 0;
			var lastSize = html.length;
			
			for(var i = 0; i < this.highlights.length; i++){
				var h = this.highlights[i];
				var keyword = h.text;
				var fromIdx = h.offset + deltaOffset;
				var toIdx = fromIdx + h.length;
				// do replace
				var prefix = html.substr(0, fromIdx);
				var postfix = html.substr(toIdx, html.length - toIdx);
				var highlightStr = html.substr(fromIdx, toIdx - fromIdx);
				html = prefix + '<span class="highlight" hid="'+h.id+'">' + highlightStr + '</span>' + postfix;
				var newSize = html.length;
				var oddSize = newSize - lastSize;
				lastSize = newSize;
				deltaOffset += oddSize;
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
			
			this.find('span.highlight').click(function(evt){
				var hElt = self.$(evt.currentTarget);
				var hid = hElt.attr('hid');
				self.publish('activateHighlight', hid);
				self.activateHighlight(hid);
			});
		},
		
		highlight: function(hArr){
			this.highlights = hArr;
			this.highlights.sort(function(a, b){
				return a.offset - b.offset;
			});
			this.redraw();
		},
		
		activateHighlight: function(hid){
			var hElt = this.find('span.highlight[hid="'+hid+'"]');
			if(hElt.length === 0){
				return;
			}
			this.find('span.highlight').removeClass('active');
			hElt.addClass('active');
		}
		
	},
	
	server: {
	}
});