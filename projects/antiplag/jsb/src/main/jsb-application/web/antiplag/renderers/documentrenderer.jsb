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
				var hElt = self.activateHighlight(hid);
				if(hElt){
					self.publish('highlightActivated', hElt);
				}
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
				console.log(JSON.stringify(h));
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
//					this.append('<br />');
				} else {
					var pElt = this.$('<p></p>').append(pTxt);
					this.append(pElt);
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
			// prepare highlights
			var nArr = [];
			for(var i = 0; i < hArr.length; i++){
				var h = hArr[i];
				if(h.text && h.text.indexOf('\n') >= 0){
					var curOffset = h.offset;
					var hParts = h.text.split('\n');
					for(var j = 0; j < hParts.length; j++){
						if(hParts[j].length > 0){
							nArr.push({
								id: h.id,
								docId: h.docId,
								text: hParts[j],
								offset: curOffset,
								length: hParts[j].length
							});
						}
						curOffset += hParts[j].length + 1;
					}
				} else {
					nArr.push(h);
				}
			}
			
			this.highlights = nArr;
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
			return hElt;
		}
		
	},
	
	server: {
	}
});