JSB({
	name: 'Antiplag.RelevantDocItem',
	parent: 'JSB.Widgets.ListItem',
	require: ['Antiplag.DocumentRenderer'],
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			
			this.title = this.$('<div class="title"></div>');
			this.append(this.title);
			this.title.text(this.getTitle());
			
			this.distance = this.$('<div class="distance">Близость: <span class="value"></span></div>');
			this.append(this.distance);
			this.distance.find('span').text('' + (1 - this.options.info.distance).toFixed(2));
			
			this.docRenderer = new Antiplag.DocumentRenderer();
			this.append(this.docRenderer);
			
			this.errorMessage = this.$('<div class="error"></div>');
			this.append(this.errorMessage);
			
			this.subscribe('relevantDocChanged', function(sender, msg, params){
				if(self.list != sender){
					return;
				}
				if(params.key == self.key){
					self.expand(params.document, params.view);
				} else {
					self.collapse();
				}
			});
			
			this.subscribe('highlightActivated', function(sender, msg, hElt){
				if(sender != self.docRenderer){
					return;
				}
				self.list.scrollTo(hElt);
			});
		},
		
		getTitle: function(){
			var title = this.options.info.title;
			if(title && title.length > 0 && (title[0] == '"' || title[0] == '\'')){
				title = JSON.parse(title);
			}
			return title;
		},
		
		collapse: function(){
			if(!this.expanded){
				return;
			}
			this.expanded = false;
			this.docRenderer.getElement().slideUp();
			this.errorMessage.slideUp();
		},
		
		cleanDocBody: function(txt){
			var curTxt = txt;
			if(curTxt && curTxt.length > 0){
				while((curTxt[0] == '"' && curTxt[curTxt.length - 1] == '"') ||(curTxt[0] == '\'' && curTxt[curTxt.length - 1] == '\'')){
					curTxt = curTxt.substr(1, curTxt.length - 2);
				}
			}
			return curTxt;
		},
		
		expand: function(doc, view){
			var self = this;
			if(this.expanded){
				return;
			}
			this.expanded = true;
			this.getElement().loader();
			view.server().compareDocs(doc, this.key, function(res){
				self.getElement().loader('hide');
				if(res.success){
					var compareDocBody = res.result.Body;//self.cleanDocBody(res.result.Body);
					self.docRenderer.setText(compareDocBody);
					self.docRenderer.getElement().slideDown();
					
					// prepare highlights
					var hArr1 = [], hArr2 = [];
					for(var i = 0; i < res.result.CommonParts.length; i++){
						var cEntry = res.result.CommonParts[i];
						if(cEntry.Length < 3 || cEntry.HitLength < 3){
							continue;
						}
						var id = JSB.generateUid();
						hArr1.push({
							id: id,
							offset: cEntry.Offset,
							length: cEntry.Length,
							docId: res.result.DocID,
							text: cEntry.Text
						});
						hArr2.push({
							id: id,
							offset: cEntry.HitOffset,
							length: cEntry.HitLength,
							text: cEntry.HitText
						});
					}
					self.publish('relDocHighlight',{
						document: self.options.document,
						originalHighlight: hArr1
					});
					self.docRenderer.highlight(hArr2);
				} else {
					// show error message
					self.errorMessage.text(res.error);
					self.errorMessage.slideDown();
				}
			});
		}
	}
});

JSB({
	name:'Antiplag.RelevantDocsView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.ItemList', 'Antiplag.RelevantDocItem', 'JQuery.UI'],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('relevantDocsView');
			this.loadCss('relevantdocsview.css');
			
			this.toolbar = this.options.toolbar;
			
			this.toolbar.addItem({
				key: 'checkDocument',
				tooltip: 'Проверить документ',
				element: '<div class="icon"></div><span class="caption">Проверить</span>',
				click: function(){
					self.checkDocument();
				}
			});
			
			this.toolbar.addSeparator();
			
			this.toolbar.addItem({
				allowHover: false,
				key: 'checkThreshold',
				tooltip: 'Порог близости',
				element: '<div class="slider"><div class="ui-slider-handle"></div></div>'
			});
			
			var handle = this.toolbar.find('.slider .ui-slider-handle');
			this.toolbar.find('.slider').slider({
				min: 0,
				max: 1,
				step: 0.01,
				value: 0.1,
				create: function() {
					var val = self.$( this ).slider( "value" ).toFixed(2);
					handle.text( val );
		        },
		        slide: function( event, ui ) {
		        	var val = ui.value.toFixed(2);
		        	handle.text( val );
		        },
		        change: function( event, ui ){
		        	self.checkDocument();
		        }
			});
			
			this.docsElt = new JSB.Widgets.ItemList({
				onSelectionChanged: function(key, item, evt){
					self.docsElt.publish('relevantDocChanged', {key: key, item: item, document: self.options.document, view: self});
				}
			});
			this.docsElt.addClass('docList');
			this.append(this.docsElt);
			
			this.errMsgElt = this.$('<div class="message hidden"></div>');
			this.append(this.errMsgElt);
			
			this.checkDocument();
		},
		
		checkDocument: function(){
			var self = this;
			this.getElement().loader();
			this.server().findSimilarDocs(this.options.document, this.toolbar.find('.slider').slider('value'), function(res){
				self.getElement().loader('hide');
				self.drawItems(res);
			});
		},
		
		drawItems: function(desc){
			if(!desc.success){
				this.errMsgElt.removeClass('hidden');
				this.docsElt.addClass('hidden');
				this.errMsgElt.text(desc.error);
				return;
			} 
			
			this.errMsgElt.addClass('hidden');
			this.docsElt.removeClass('hidden');
			
			// fill item list
			this.docsElt.clear();
			
			desc.result.sort(function(a,b){
				return a.distance - b.distance;
			});
			
			for(var i = 0; i < desc.result.length; i++){
				var entry = desc.result[i];
				var item = new Antiplag.RelevantDocItem({info: entry, close: false, document: this.options.document});
				this.docsElt.addItem(item, entry.id);
			}
			
		}
		
	},
	
	server: {
		findSimilarDocs: function(doc, threshold){
			var text = doc.getPlainText();
			
			try {
				var res = Http.request('POST', Config.get('antiplag.externals.nearest'), {
					text: text,
					threshold: 1 - threshold
				});
				
				if(res.responseCode == 200){
					var obj = JSON.parse(res.body);
					if(JSB.isString(obj)){
						obj = JSON.parse(obj)
					}
					return {result: obj, success: true};
				}
				
				return {success: false, error: '' + res.responseCode + ': ' + res.responseMessage};
			} catch(e){
				return {success: false, error: e.message}
			}
		},
		
		compareDocs: function(doc, compareDocId){
			var text = doc.getPlainText();
			try {
				var res = Http.request('POST', Config.get('antiplag.externals.diff'), {
					text: text,
					id: compareDocId
				});
				
				if(res.responseCode == 200){
					var obj = JSON.parse(res.body);
					if(JSB.isString(obj)){
						obj = JSON.parse(obj)
					}
					return {result: obj, success: true};
				}
				
				return {success: false, error: '' + res.responseCode + ': ' + res.responseMessage};
			} catch(e){
				return {success: false, error: e.message}
			}
		}
	}
});