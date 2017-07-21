{
	$name:'JSB.Widgets.MultiEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: 'JSB.Widgets.Value',
	
	$bootstrap: function(){
		this.lookupSingleton('JSB.Widgets.EditorRegistry', function(obj){
			obj.register([
			              'org.jsbeans.types.JavaScript',
			              'org.jsbeans.types.JsonObject',
			              'org.jsbeans.types.JsonArray',
			              'org.jsbeans.types.JsonElement',
			              'org.jsbeans.types.XQuery',
			              'org.jsbeans.types.Xml',
			              'org.jsbeans.types.SparqlString',
			              'org.jsbeans.types.Html',
			              'org.jsbeans.types.Css'], this);
		})
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			if(JSB.isNull(this.options.valueType)){
				this.options.valueType = 'org.jsbeans.types.JavaScript';
			}
			if(this.options.valueType == 'org.jsbeans.types.JsonObject'
				|| this.options.valueType == 'org.jsbeans.types.JsonArray'
				|| this.options.valueType == 'org.jsbeans.types.JsonElement'){
				this.data = new Value('', this.options.valueType);
			} else {
				this.data = new Value({value:''}, this.options.valueType);
			}
			
			this.ready = false;
			
			var mode = 'javascript';
			var theme = 'eclipse';
			if(this.options.valueType == 'org.jsbeans.types.SparqlString'){
				mode = 'application/x-sparql-query';
			}
			if(this.options.valueType == 'org.jsbeans.types.XQuery'){
				mode = 'xquery';
				theme = 'xq-light';
			}
			if(this.options.valueType == 'org.jsbeans.types.Html' 
				|| this.options.valueType == 'org.jsbeans.types.Xml'){
				mode = {
					name: 'htmlmixed',
					scriptTypes: [
						{matches: /\/x-handlebars-template|\/x-mustache/i, mode: null},
						{matches: /(text|application)\/(x-)?vb(a|script)/i, mode: "vbscript"}
					]
				};
			}
			if(this.options.valueType == 'org.jsbeans.types.Css'){
				mode = 'text/css';
			}
			/*
			if(this.options.valueType == 'org.jsbeans.types.JsonObject'){
                mode = 'application/json';
            }
            */
			JSB.loadCss('tpl/codemirror/lib/codemirror.css');
			JSB.loadCss('tpl/codemirror/theme/eclipse.css');
			JSB.loadCss('tpl/codemirror/theme/xq-light.css');
			JSB.loadCss('tpl/codemirror/addon/hint/show-hint.css');
			JSB.loadCss('tpl/codemirror/addon/dialog/dialog.css');
			this.loadCss('MultiEditor.css');
			this.getElement().addClass('multiEditor');
			
			JSB.loadScript('tpl/codemirror/lib/codemirror.js', function(){
				JSB.loadScript('tpl/codemirror/addon/search/search.js');
				JSB.loadScript('tpl/codemirror/addon/search/searchcursor.js');
				JSB.loadScript('tpl/codemirror/addon/dialog/dialog.js');

				if(mode == 'javascript'){
					JSB.loadCss('tpl/codemirror/addon/lint/lint.css');
					
					var scripts = ['tpl/codemirror/mode/javascript/javascript.js',
					               'tpl/codemirror/addon/mode/overlay.js'];
					
					if($this.options.showHints){
						scripts.push('tpl/codemirror/addon/hint/show-hint.js');
						scripts.push('tpl/codemirror/addon/hint/javascript-hint.js');
						scripts.push('tpl/jshint/jshint.js');
					}
					
					scripts.push('tpl/codemirror/addon/lint/lint.js');
					scripts.push('tpl/codemirror/addon/lint/javascript-lint.js');
					scripts.push('tpl/codemirror/addon/edit/matchbrackets.js');
					
					JSB.loadScript(scripts, function(){
//						window.CodeMirror.defineMode("jswithdot", function(config, parserConfig) {
//							var mustacheOverlay = {
//							  token: function(stream, state) {
//								var ch;
//								if (stream.match(/#dot\s*{{/)) {
//									console.log('matcheed 1')
//
//								  while ((ch = stream.next()) != null)
//									if (ch == "}" && stream.next() == "}") {
//									  stream.eat("}");
//									  console.log('matcheed 2');
//									  return "jswithdot";
//									}
//								}
//								while (stream.next() != null && !stream.match(/#dot\s*{{/, false)) {}
//								return null;
//							  }
//							};
//							return window.CodeMirror.overlayMode(window.CodeMirror.getMode(config, "text/javascript"), mustacheOverlay);
//						});
						$this.init(mode, theme, {
							lint: true,
							gutters: ['CodeMirror-lint-markers']
						});
						$this.ready = true;
					});
                }
                /*
                else if(mode === 'application/json'){
                    JSB.loadCss('tpl/codemirror/addon/lint/lint.css');
                    var scripts = ['tpl/jshint/jshint.js',
                        'tpl/codemirror/addon/lint/jsonlint.js',
                        'tpl/codemirror/addon/lint/json-lint.js',
                        'tpl/codemirror/addon/lint/lint.js',
                    ];
                    JSB.loadScript(scripts, function(){
                        $this.init(mode, theme, {
                            lint: true,
                            gutters: ['CodeMirror-lint-markers']
                        });
                        $this.ready = true;
                    });
				}
				*/
				else if(mode == 'application/x-sparql-query'){
					JSB.loadScript('tpl/codemirror/mode/sparql/sparql.js', function(){
						$this.init(mode, theme);
						$this.ready = true;
					});
				} else if(mode == 'xquery'){
					JSB.loadScript('tpl/codemirror/mode/xquery/xquery.js', function(){
						$this.init(mode, theme);
						$this.ready = true;
					});
				} else if($this.options.valueType == 'org.jsbeans.types.Html' || $this.options.valueType == 'org.jsbeans.types.Xml'){
					JSB.loadScript([
					                  'tpl/codemirror/mode/htmlmixed/htmlmixed.js',
					                  'tpl/codemirror/mode/xml/xml.js',
					                  'tpl/codemirror/mode/css/css.js',
					                  'tpl/codemirror/addon/hint/show-hint.js',
					                  'tpl/codemirror/addon/hint/html-hint.js',
					                  'tpl/codemirror/addon/hint/xml-hint.js',
					                  'tpl/codemirror/addon/hint/css-hint.js'
					                  ], function(){

						$this.init(mode, theme, {});
						$this.ready = true;
					});
				} else if($this.options.valueType == 'org.jsbeans.types.Css') {
					JSB.loadScript('tpl/codemirror/mode/css/css.js', function(){
						JSB.loadScript('tpl/codemirror/addon/hint/show-hint.js', function(){
							JSB.loadScript('tpl/codemirror/addon/hint/css-hint.js', function(){
								$this.init(mode, theme, {});
								$this.ready = true;
							});
						});
					});
				}
			});
		},
		
		options: {
			valueType: 'org.jsbeans.types.JavaScript',
			showHints: true,
			validation: true
		},
		
		behavior: {
			dimensions: {
				defaultWidth: 600,
				defaultHeight: 400
			}
		},

		init: function(mode, theme, opts){
			var self = this;
			var readonly = false;
			if(this.options.readOnly){
				readonly = this.options.readOnly;
			}
			var cmOpts = JSB.merge(true, {
				lineNumbers: JSB.isNull(self.options.lineNumbers) ? true : self.options.lineNumbers,
				mode: mode,
				smartIndent: true,
				autofocus: true,
				viewportMargin: 10,
				theme: theme,
				indentUnit: 4,
				tabMode: "spaces",
				matchBrackets: true,
				tabSize: 4,
				indentWithTabs: true,
				readOnly: readonly,
				extraKeys: {
					'Ctrl-Enter': function(){
						self.publish('editComplete');
					},
					'Ctrl-Space': 'autocomplete',
					'Ctrl-S': function(){
						self.publish('editSave');
					}
				}
			}, opts);

			self.editor = window.CodeMirror(this.getElement().get(0), cmOpts);
			
			if(this.options.valueType == 'org.jsbeans.types.JsonObject'
				|| this.options.valueType == 'org.jsbeans.types.JsonArray'
				|| this.options.valueType == 'org.jsbeans.types.JsonElement'){
				this.editor.getDoc().setValue(this.data.getValue());
			} else {
				this.editor.getDoc().setValue(this.data.getValue().value);
			}
			self.editor.on('change', function(cm, evt2){
				if(!JSB.isNull(self.options.onChange)){
					self.options.onChange(self.editor.getDoc().getValue());
				}
			});
			
			this.getElement().keydown(function(evt){
				if(evt.which != 27){
					evt.stopPropagation();
				}
			});

			this.getElement().keyup(function(evt){
				if(evt.which != 27){
					evt.stopPropagation();
				}
			});
			
			this.getElement().resize(function(){
				self.editor.refresh();
			});
			
		},
		
		setData: function(data){
			if(JSB.isInstanceOf(data, 'JSB.Widgets.Value')){
				this.data = data;
			} else {
				if(this.options.valueType == 'org.jsbeans.types.JsonObject'
					|| this.options.valueType == 'org.jsbeans.types.JsonArray'
					|| this.options.valueType == 'org.jsbeans.types.JsonElement'){
					this.data = new Value('', this.options.valueType);
					if(!JSB.isNull(data)){
						this.data.setValue(data);
					}

				} else {
					this.data = new Value({value:''}, this.options.valueType);
					if(!JSB.isNull(data)){
						if(!JSB.isNull(data.value)){
							this.data.setValue(data);
						} else {
							this.data.setValue({value: data});
						}
					}
				}
			}
			if(this.ready){
				if(this.options.valueType == 'org.jsbeans.types.JsonObject'
					|| this.options.valueType == 'org.jsbeans.types.JsonArray'
					|| this.options.valueType == 'org.jsbeans.types.JsonElement'){
					if(JSB.isNull(this.data.getValue())){
						this.data.setValue('');
					}
					var str = this.data.getValue();
					if(!JSB.isString(str)){
						str = JSON.stringify(str, null, 2);
					}
					this.editor.getDoc().setValue(str);
					
				} else {
					if(JSB.isNull(this.data.getValue())){
						this.data.setValue({value: ''});
					}
					this.editor.getDoc().setValue(this.data.getValue().value);
				}
			}
		},
		
		getData: function(){
			if(this.options.valueType == 'org.jsbeans.types.JsonObject'
				|| this.options.valueType == 'org.jsbeans.types.JsonArray'
				|| this.options.valueType == 'org.jsbeans.types.JsonElement'){
				this.data.setValue(eval('(' + this.editor.getDoc().getValue() + ')'));
			} else {
				this.data.setValue({value: this.editor.getDoc().getValue()});
			}
			return this.data;
		},
		
		setFocus: function(){
			var self = this;
			if(JSB.isNull(this.editor)){
				JSB.deferUntil(function(){
					self.editor.focus();
				},function(){
					return !JSB.isNull(self.editor);
				});
			} else {
				self.editor.focus();
			}
			
		}
			
	}
}