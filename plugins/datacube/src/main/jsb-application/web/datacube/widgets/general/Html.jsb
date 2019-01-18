{
	$name: 'DataCube.Widgets.Html',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Html',
		description: '',
		category: 'Основные',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiDQogICBoZWlnaHQ9IjIwIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB3aWR0aD0iMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9odG1sXzE2OTc3NS5zdmciPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE5Ij48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzNyIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXc1Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjI5LjUiDQogICAgIGlua3NjYXBlOmN4PSI1LjYxNDczMDgiDQogICAgIGlua3NjYXBlOmN5PSIxMS44MTEwMDYiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiIC8+PHBhdGgNCiAgICAgZD0iTSA3LjAyNzE4NzYsMTMuOTQyNzIzIDAsMTAuMjg1NzkxIDAsOC42ODU4MjQxIGwgNy4wMjcxODc2LC0zLjY3MTkwNiAwLDIuMDcwMDY3OCAtNC45MTQzODMzLDIuNDI2MzA4OSA0LjkxNDM4MzMsMi4zNjA4MDEyIDAsMi4wNzE2MjcgeiBNIDEyLjM1NzA4MiwzLjA1MDg0NzUgOS4zNzUxOTg0LDE2LjE1MjU0MiBsIC0xLjc0MDAyOTcsMCAyLjk4MTg4MzMsLTEzLjEwMTY5NDUgMS43NDAwMywwIHogbSA1LjQ5NTIyNSw2LjQ1OTQ0NzMgLTQuOTE1MDA3LC0yLjQyNTk5NyAwLC0yLjA3MDA2NzggNy4wMjcxODgsMy42NzE1OTQxIDAsMS41OTk5NjY5IC03LjAyNzE4OCwzLjY1NjkzMiAwLC0yLjA3MTYyNyA0LjkxNTAwNywtMi4zNjA4MDEyIHoiDQogICAgIGlkPSJwYXRoMyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzU1MjIwMCIgLz48L3N2Zz4=`
	},
	$scheme: {
	    record: {
            render: 'sourceBinding',
            name: 'Записи'
	    },
	    args: {
	        render: 'group',
	        name: 'Аргументы',
	        multiple: true,
	        items: {
	            key: {
                    render: 'item',
                    name: 'Ключ'
	            },
                value: {
                    render: 'dataBinding',
                    name: 'Ключ',
                    linkTo: 'record'
                }
	        }
	    },
	    template: {
            render: 'item',
            name: 'Шаблон',
            editor: 'JSB.Widgets.MultiEditor',
            editorOpts: {
                valueType: 'org.jsbeans.types.Html'
            },
            value: `<ul style="padding-left:20px; list-style-type: disc;">
                   {{for(var f in it) { }}
                   	<li>
                   		<strong style="font-style:italic;">{{=f}}</strong>:
                   		<span>{{=it[f]}}</span>
                   	</li>
                   {{ } }}
                   </ul>`
	    },
	    useIframe: {
	        render: 'item',
	        name: 'Использовать iframe',
            optional: true,
            editor: 'none'
	    },
	    propagateMouseEvents: {
	    	render: 'item',
	    	name: 'Пробрасывать события мыши контейнеру',
            optional: true,
            editor: 'none'
	    },
	    userSelect: {
	    	render: 'item',
	    	name: 'Разрешать выделять текст',
            optional: true,
            editor: 'none'
	    }
	},
	$client: {
		$require: ['css:Html.css'],
		
		$constructor: function(opts){
			var doT = {
				version: "1.0.3",
				templateSettings: {
					evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
					interpolate: /\{\{=([\s\S]+?)\}\}/g,
					encode:      /\{\{!([\s\S]+?)\}\}/g,
					use:         /\{\{#([\s\S]+?)\}\}/g,
					useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
					define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
					defineParams:/^\s*([\w$]+):([\s\S]+)/,
					conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
					iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
					varname:	"it",
					strip:		false,
					append:		true,
					selfcontained: false,
					doNotSkipEncoded: false
				},
				template: undefined, //fn, compile template
				compile:  undefined  //fn, for express
			}, _globals;

			doT.encodeHTMLSource = function(doNotSkipEncoded) {
				var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
					matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
				return function(code) {
					return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
				};
			};

			_globals = (function(){ return this || (0,eval)("this"); }());

			if (typeof module !== "undefined" && module.exports) {
				module.exports = doT;
			} else if (typeof define === "function" && define.amd) {
				define(function(){return doT;});
			} else {
				_globals.doT = doT;
			}

			var startend = {
				append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
				split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
			}, skip = /$^/;

			function resolveDefs(c, block, def) {
				return ((typeof block === "string") ? block : block.toString())
				.replace(c.define || skip, function(m, code, assign, value) {
					if (code.indexOf("def.") === 0) {
						code = code.substring(4);
					}
					if (!(code in def)) {
						if (assign === ":") {
							if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
								def[code] = {arg: param, text: v};
							});
							if (!(code in def)) def[code]= value;
						} else {
							new Function("def", "def['"+code+"']=" + value)(def);
						}
					}
					return "";
				})
				.replace(c.use || skip, function(m, code) {
					if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
						if (def[d] && def[d].arg && param) {
							var rw = (d+":"+param).replace(/'|\\/g, "_");
							def.__exp = def.__exp || {};
							def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
							return s + "def.__exp['"+rw+"']";
						}
					});
					var v = new Function("def", "return " + code)(def);
					return v ? resolveDefs(c, v, def) : v;
				});
			}

			function unescape(code) {
				return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
			}

			doT.template = function(tmpl, c, def) {
				c = c || doT.templateSettings;
				var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
					str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

				str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
							.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
					.replace(/'|\\/g, "\\$&")
					.replace(c.interpolate || skip, function(m, code) {
						return cse.start + unescape(code) + cse.end;
					})
					.replace(c.encode || skip, function(m, code) {
						needhtmlencode = true;
						return cse.startencode + unescape(code) + cse.end;
					})
					.replace(c.conditional || skip, function(m, elsecase, code) {
						return elsecase ?
							(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
							(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
					})
					.replace(c.iterate || skip, function(m, iterate, vname, iname) {
						if (!iterate) return "';} } out+='";
						sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
						return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
							+vname+"=arr"+sid+"["+indv+"+=1];out+='";
					})
					.replace(c.evaluate || skip, function(m, code) {
						return "';" + unescape(code) + "out+='";
					})
					+ "';return out;")
					.replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
					.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
					//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

				if (needhtmlencode) {
					if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
					str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
						+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
						+ str;
				}
				try {
					return new Function(c.varname, str);
				} catch (e) {
					if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
					throw e;
				}
			};
			
			doT.compile = function(tmpl, def) {
				return doT.template(tmpl, null, def);
			};

			$this.doT = doT;
			
			$base(opts);
			
			this.addClass('htmlWidget');
			$this.setInitialized();
		},

		refresh: function(opts){
		    this.onRefresh(opts);
		},
		
		onRefresh: function(opts){
			$base();

			var recordContext = this.getContext().find('record');

			if(opts && opts.refreshFromCache){
                var cache = this.getCache();
                if(!cache) return;

                if(this.getContext().find('useIframe').checked()){
                    this.renderIframe(cache);
                } else {
                    this.renderSimple(cache);
                }
			} else {
			    if(recordContext.hasBinding && recordContext.hasBinding()){
/*			    	
			    	var loaderShown = false;
			    	JSB.defer(function(){
			    		$this.getElement().loader();
			    		loaderShown = true;
			    	}, 100, 'fetchDefer_' + $this.getId());
*/			    	
                    $this.fetch(recordContext, {batchSize: 1, reset:true}, function(data, fail){
/*                    	JSB.cancelDefer('fetchDefer_' + $this.getId());
                    	if(loaderShown){
	                    	try {
	                    		$this.getElement().loader('hide');
	                    	} catch(e){}
                    	}
*/                    	
                    	if(fail){
                    		return;
                    	}
                        recordContext.next();
                        $this.draw(opts ? opts.isCacheMod : false);
                        $this.ready();
                    });
			    } else {
			        $this.draw(opts ? opts.isCacheMod : false, true);
			        $this.ready();
			    }
			}
		},
		
		draw: function(isCacheMod, ignoreData){
		    var data = {};

		    if(!ignoreData){
                var args = this.getContext().find('args').values();
                var template = this.getContext().find('template').value();
                for(var i = 0; i < args.length; i++){
                	var key = args[i].find('key').value();
                	var val = args[i].find('value').value();
                	if(!JSB.isDefined(val)){
                		val = args[i].find('value').value('back');
                	}
                    data[key] = val;
                }
		    }
			
			try {
				var templateProc = this.doT.template(template);
				var html = templateProc(data);
	
				if(isCacheMod){
				    this.storeCache(html);
				}
				this.html = html;
				
				if(this.getContext().find('useIframe').checked()){
					this.renderIframe(html);
				} else {
					this.renderSimple(html);
				}
			} catch(e){
				JSB.getLogger().error(e);
			}
		},
		
		setIframeMode: function(callback){
			var self = this;
			if(this.currentRender == 'iframe'){
				var iframeNode = this.iframe.get(0); 
				iframeNode.contentDocument.designMode = "on";
				callback(this.iframe);
				iframeNode.contentDocument.designMode = "off";
			} else {
				this.currentRender = 'iframe';
				if(JSB.isNull(this.iframe)){
					this.iframe = this.$('<iframe class="innerDoc"></iframe>');
					this.getElement().append(this.iframe);
					
					JSB.deferUntil(function(){
						// enable content editing
						var iframeNode = self.iframe.get(0); 
						iframeNode.contentDocument.designMode = "on";
						callback(self.iframe);
						iframeNode.contentDocument.designMode = "off";
					},function(){
						return self.iframe.width() > 0 && self.iframe.height() > 0; 
					});
/*					
					this.iframe.resize(function(){
						var iframeNode = $this.iframe.get(0);
						var doc = iframeNode.contentDocument;
						doc.designMode = "on";
						doc.open();
						doc.write($this.html);
						doc.close();
						doc.designMode = "off";
					});
*/					
				} else {
					var iframeNode = this.iframe.get(0); 
					iframeNode.contentDocument.designMode = "on";
					callback(self.iframe);
					iframeNode.contentDocument.designMode = "off";
				}
			}
			this.attr('mode', this.currentRender);
		},
		
		setSimpleMode: function(callback){
			if(this.currentRender != 'simple'){
				this.currentRender = 'simple';
				if(JSB.isNull(this.simpleContainer)){
					this.simpleContainer = this.$('<div class="simpleContainer"></div>');
					this.getElement().append(this.simpleContainer);
					this.simpleContainer.on({
						mousedown: function(evt){
							if(!$this.getContext().find('propagateMouseEvents').checked()){
								evt.stopPropagation();
							}
						},
						mouseup: function(evt){
							if(!$this.getContext().find('propagateMouseEvents').checked()){
								evt.stopPropagation();
							}
						}
					});
				}
				this.attr('mode', this.currentRender);
			}
			
			if(this.getContext().find('userSelect').checked()){
				this.simpleContainer.addClass('userSelect');
			} else {
				this.simpleContainer.removeClass('userSelect');
			}

			callback(this.simpleContainer);
		},
		
		renderIframe: function(html){
			var self = this;
			this.setIframeMode(function(iframe){
				var doc = iframe.get(0).contentDocument;
				doc.open();
				doc.write(html);
				doc.close();
			});
		},
		
		renderSimple: function(html){
			var self = this;
			this.setSimpleMode(function(container){
				container.empty();
				container.html(html);
			});
		}
	}
}