{
	$name: 'DataCube.Widgets.Text',
	$parent: 'DataCube.Widgets.Widget',
	$require: ['JSB.Widgets.Button', 'JQuery.UI.Loader'],
	$expose: {
    		name: 'Текст',
    		description: '',
    		category: 'Основные',
    		thumb: `data:image/png;base64,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
    		AQYAfuYBOy79e7sAAAAASUVORK5CYII=`
    	},
    $scheme: {
        source: {
            render: 'sourceBinding',
            name: 'Источник',
        },
        text: {
            render: 'dataBinding',
            name: 'Текст',
            linkTo: 'source'
        },
        annotations: {
            render: 'dataBinding',
            name: 'Разметка',
            linkTo: 'source'
        },
        hideWithoutAnnotations: {
            render: 'item',
            name: 'Скрывать абзацы без выделений',
            optional: true,
            editor: 'none'
        },
        cssText: {
            render: 'switch',
            name: 'Использовать CSS стиль текста',
            items: {
                cssStyle: {
                    render: 'item',
                    name: 'CSS стиль',
                    editor: 'JSB.Widgets.MultiEditor',
                    editorOpts: {
                        valueType: 'org.jsbeans.types.Css'
                    },
                    value: `/* Заполните объект CSS значениями */`
                }
            }
        },
        cssMark: {
            render: 'switch',
            name: 'Использовать CSS стиль выделений',
            items: {
                cssStyle: {
                    render: 'item',
                    name: 'CSS стиль',
                    editor: 'JSB.Widgets.MultiEditor',
                    editorOpts: {
                        valueType: 'org.jsbeans.types.Css'
                    },
                    value: `/* Заполните объект CSS значениями */`
                }
            }
        }
    },
	$client: {
		highlights: [],

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('textWidget');
			this.loadCss('text.css');
			$this.setInitialized();
		},

		refresh: function(opts){
		    var dataSource = this.getContext().find('source');
            if(!dataSource.hasBinding || !dataSource.hasBinding()){
                return;
            }
            
			$base();

            this.getElement().loader();

            if(opts && opts.refreshFromCache){
                this.redraw();
                return;
            }

            this.fetchBinding(dataSource, {batchSize: 1}, function(){
                source.next();
                $this.update();
            });
        },

        update: function(){
            this.text = this.getContext().find('text').value();
            this.text = this.text.replace(/_x000D_/g , ' ');

            var annot = this.getContext().find('annotations').value();
            if(!JSB().isArray(annot)) annot = [annot];

            if(annot.length > 0){
                try{
                    this.highlights = [];

                    for(var i = 0; i < annot.length; i++){
                        var h = JSON.parse(annot[i]);

                        this.highlights.push({
                            id: h.id,
                            docId: h.document_id,
                            offset: h.start,
                            length: h.end - h.start
                        });
                    }

                    this.highlights.sort(function(a, b){
                        return a.offset - b.offset;
                    });

                    var fObj = {};
                    this.highlights = this.highlights.filter(function(el){
                        for(var i = el.offset; i < el.offset + el.length; i++){
                            if(fObj[i]){
                                return false;
                            }
                        }

                        for(var i = el.offset; i < el.offset + el.length; i++){
                            fObj[i] = true;
                        }

                        return true;
                    });

                } catch(ex){
                    console.log(ex);
                }
            }

            this.redraw();

            var cssSelector = this.getContext().find('cssText');
            if(cssSelector.checked()){
                this.getElement().attr("style", this.prepareCss(cssSelector.find('cssStyle').value()));
            }

            $this.getElement().loader('hide');
        },

        prepareCss: function(cssText){
            if(!cssText) return "";
            if(cssText.indexOf('{') >= 0){
                var m = cssText.match(/\{([^\}]*)\}/i);
                if(m && m.length > 1){
                    cssText = m[1];
                }
            }
            return cssText.replace(/\r/g,'').replace(/\n/g,'').trim();
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
				var fromIdx = h.offset + deltaOffset;
				var toIdx = fromIdx + h.length;
				// do replace
				var prefix = html.substr(0, fromIdx);
				var postfix = html.substr(toIdx);
				var highlightStr = html.substr(fromIdx, toIdx - fromIdx);
				html = prefix + '<span class="highlight" hid="'+h.id+'">' + highlightStr + '</span>' + postfix;
				var newSize = html.length;
				var oddSize = newSize - lastSize;
				lastSize = newSize;
				deltaOffset += oddSize;
			}

			var pArr = html.split('\n');

			if(this.getContext().find('hideWithoutAnnotations').checked()){
                var collStr = '';
                for(var i = 0; i < pArr.length; i++){
                    var pTxt = pArr[i];
                    if(pTxt.trim().length !== 0){
                        var pElt = '<p>' + pTxt + '</p>';

                        if(pTxt.indexOf('<span class="highlight"') < 0){
                            collStr += pElt;
                        } else {
                            if(collStr.length > 0){
                                this.append(`#dot
                                    <div class="collapseBlock">
                                    <div jsb="JSB.Widgets.Button"
                                         caption="* * *"
                                         onclick="{{=this.callbackAttr(function(evt){ this.getElement().addClass('hidden'); })}}" >
                                    </div>
                                    <div class="pointCollapse">
                                        {{=collStr}}
                                    </div>
                                    </div>
                                `);
                                collStr = '';
                            }

                            this.append(pElt);
                        }
                    }
                }
			} else {
                for(var i = 0; i < pArr.length; i++){
                    var pTxt = pArr[i];
                    if(pTxt.trim().length !== 0){
                        var pElt = this.$('<p></p>').append(pTxt);
                        this.append(pElt);
                    }
                }
			}

            var cssSelector = this.getContext().find('cssMark');
            if(cssSelector.checked()){
                this.find('span.highlight').attr("style", this.prepareCss(cssSelector.find('cssStyle').value()));
            }
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
	}
}