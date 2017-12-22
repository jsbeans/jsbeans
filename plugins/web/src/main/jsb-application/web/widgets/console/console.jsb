{
	$name:'Console',
	$parent: 'JSB.Widgets.Widget',
	$require: {
		UiEffects: 'JQuery.UI.Effects',
		FloatingContainer: 'JSB.Widgets.FloatingContainer',
		UiInteractions: 'JQuery.UI.Interactions',
		Loader: 'JQuery.UI.Loader'
		
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			
			JSB().loadCss('tpl/codemirror/lib/codemirror.css');
			JSB().loadCss('tpl/codemirror/theme/eclipse.css');
			this.loadCss('console.css');
			JSB().loadScript('tpl/codemirror/lib/codemirror.js', function(){
				JSB().loadScript('tpl/codemirror/mode/javascript/javascript.js', function(){
					JSB().loadScript('tpl/codemirror/addon/edit/matchbrackets.js', function(){
						self.init();
					});
					
				});
			});
			
			this.preloadImages();
		},
		
		widgets: [],
		items: [],
		embeddedObjects:[],
		
		init: function(){
			var self = this;
			this.element.addClass('dwpConsole');
			this.cmdWindow = this.$('<div class="cmdWindow"></div>');
			this.logWindow = this.$('<div class="logWindow"></div>');
			this.element.append(this.logWindow);
			this.element.append(this.cmdWindow);
			
			JSB().deferUntil(function(){
				self.initCmdWindow();
				self.initLogWindow();
				self.initToolbars();
				self.updateLayout();
			}, function(){
				return self.cmdWindow.height() > 0;
			});
		},
		
		initCmdWindow: function(){
			var self = this;
			this.editor = CodeMirror(this.cmdWindow.get(0),{
				lineNumbers: false,
				gutters: ['cmdBar'],
				mode: 'javascript',
				viewportMargin: 10,
				theme: 'eclipse',
				indentUnit: 4,
				matchBrackets: false,
				indentWithTabs: true,
				extraKeys: {
					'Ctrl-Enter': function(){
						self.post();
					}
				}
			});
			
			this.editor.setGutterMarker( 0, 'cmdBar', this.$('<div class="gutterMarker">>></div>').get(0));
			this.editor.on('change', function(){
				self.removeHints();
			});
		},
		
		initLogWindow: function(){
			var self = this;
			this.canvas = this.$('<div class="canvas"></div>');
			this.logWindow.append(this.canvas);
			this.canvas.css('top', this.logWindow.height());
			
			this.logWindow.bind('mousewheel', function(e, delta, deltaX, deltaY){
				if(self.allowScroll) {
					self.addWheelDelta(delta);
					if(!self.scrollBarWindow.is(':visible')){
						if(self.scrollBarWindow.width() > self.logWindow.width()){
							self.scrollBarWindow.css('width', self.logWindow.width());
						}
						if(self.scrollBarWindow.height() > self.logWindow.height()){
							self.scrollBarWindow.css('height', self.logWindow.height());
						}
						var logWindowRect = self.logWindow.get(0).getBoundingClientRect();
						var x = e.pageX - self.scrollBarWindow.width() / 2 - logWindowRect.left;
						var y = e.pageY - self.scrollBarWindow.height() / 2 - logWindowRect.top;
						if(x < 0){
							x = 0;
						}
						if(x + self.scrollBarWindow.width() > self.logWindow.width()){
							x = self.logWindow.width() - self.scrollBarWindow.width(); 
						}
						if(y < 0){
							y = 0;
						}
						if(y + self.scrollBarWindow.height() > self.logWindow.height()){
							y = self.logWindow.height() - self.scrollBarWindow.height(); 
						}
						self.scrollBarWindow.css({
							left: x,
							top: y
						});
						self.scrollBarWindow.fadeIn();
					}
				}
			});

			this.canvas.resize(function(evt){
				if(evt.target != self.canvas.get(0)){
					return;
				}
				self.updateLayout();
			});
			this.logWindow.resize(function(evt){
				if(evt.target != self.logWindow.get(0)){
					return;
				}
				self.updateLayout();
			});
			this.scrollBar = this.$('<div class="scrollBar"></div>');
			this.scrollBarWindow = this.$('<div class="scrollBarWindow"></div>').append(this.scrollBar);
			this.logWindow.append(this.scrollBarWindow);
			this.scrollBar.draggable({
				axis:'y',
				containment: this.scrollBarWindow,
				drag: function(evt, data){
					self.isScrollbarDragging = true;
					JSB().cancelDefer('scrollBar_fadeOut');
					self.scrollBarWindow.show();
					self.canvas.css('top', -self.canvas.height() * data.position.top / self.scrollBarWindow.height());
				},
				stop: function(){
					self.isScrollbarDragging = false;
					if(!self.isScrolling){
						self.scrollBarWindow.fadeOut();
					}
				}
			});
			this.scrollBar.mousemove(function(){
				JSB().cancelDefer('scrollBar_fadeOut');
			});
			this.scrollBar.mouseout(function(){
				if(self.isScrollbarDragging || self.isScrolling){
					return;
				}
				JSB().defer(function(){
					self.scrollBarWindow.fadeOut();
				}, 500, 'scrollBar_fadeOut')
			});
		},
		
		addItemPair: function(token, cmd, result, val, isError){
			var self = this;
			var idx = null;
			
			var logItem = this.canvas.find('.logItem[token="'+token+'"]');
			if(logItem.length > 0){

				// modify existing item
				idx = parseInt(logItem.attr('idx'));
				this.items[idx].resultSheet.find('.resultWrap').remove();
				this.items[idx].resultSheet.prepend(this.$('<div class="resultWrap"></div>').append(result));
				this.items[idx].item.loader('hide');
				
				return idx;
			}
			
			// create new item
			idx = this.items.length;
			this.scrollAnchor = 'bottom';
			var evenOddCls = (idx & 1 == 1) ? 'odd' : 'even';
			logItem = this.$('<div class="logItem commandItem '+evenOddCls+'" idx="'+idx+'" token="'+token+'"></div>');
			if(isError){
				logItem.addClass('error');
			}
			var cmdSheet = this.$('<div class="itemSheet cmdSheet"></div>');
			logItem.append(cmdSheet.append(cmd));
			var resultSheet = this.$('<div class="itemSheet resultSheet"></div>'); 
			logItem.append(resultSheet.append(this.$('<div class="resultWrap"></div>').append(result)));
			var splitterBox = this.$('<div class="splitterBox"></div>'); 
			logItem.append(splitterBox);
			var splitter = this.$('<div class="itemSplitter"><div class="gripIcon"></div></div>');
			logItem.append(splitter);
			logItem.append('<div class="itemFader"></div>');
			this.canvas.append(logItem);
			
			// append toolbars
			var cmdToolbar = this.toolbarCmd.clone();
			cmdSheet.append(cmdToolbar);
			var resultToolbar = this.toolbarResult.clone();
			resultSheet.append(resultToolbar);
			
			cmdToolbar.find('li').click(function(evt){
				var target = self.$(evt.currentTarget);
				var toolIdx = parseInt(target.attr('idx'));
				self.toolbarCmdCfg[toolIdx].onClick.call(self, target, self.items[idx], idx);
			});
			resultToolbar.find('li').click(function(evt){
				var target = self.$(evt.currentTarget);
				var toolIdx = parseInt(target.attr('idx'));
				self.toolbarResultCfg[toolIdx].onClick.call(self, target, self.items[idx], idx);
			});

			logItem.on({
				mouseenter: function(evt){
					var entry = self.items[parseInt(self.$(evt.currentTarget).attr('idx'))];
					if(entry == null || entry == undefined){
						return;
					}
					entry.toolbarShowTimeout = setTimeout(function(){
						entry.cmdToolbar.fadeIn(200);
						entry.resultToolbar.fadeIn(200);
						entry.toolbarShowTimeout = null;
					},300);
				},
				mouseleave: function(evt){
					var entry = self.items[parseInt(self.$(evt.currentTarget).attr('idx'))];
					if(entry == null || entry == undefined){
						return;
					}
					if(entry.toolbarShowTimeout != null){
						clearTimeout(entry.toolbarShowTimeout);
					} else {
						entry.cmdToolbar.fadeOut(150);
						entry.resultToolbar.fadeOut(150);
					}
				}
			});
			
			
			this.items[idx] = {
				item: logItem,
				cmdSheet: cmdSheet,
				resultSheet: resultSheet,
				splitter: splitter,
				cmdToolbar: cmdToolbar,
				resultToolbar: resultToolbar,
				originalCmd: val
			};
			splitter.draggable({ 
				axis: "x",
				containment: splitterBox,
				drag: function(evt, data){
					var splitter = data.helper;
					var parent = splitter.parent();
					var idx = parseInt(parent.attr('idx'));
					var triple = self.items[idx];
					var cmdSheet = triple.cmdSheet;
					var resultSheet = triple.resultSheet;
					
					var deltaX = data.position.left - splitter.position().left;
					var leftPercent = ( cmdSheet.width() + deltaX ) * 100 / parent.width();
					cmdSheet.css('width', '' + leftPercent + '%');
					
					var rightPercent = ( resultSheet.width() - deltaX ) * 100 / parent.width();
					resultSheet.css('width', '' + rightPercent + '%');
					 
					var percent = data.position.left * 100 / parent.width();
					splitter.css('left', '' + percent + '%');
				},
				stop: function(evt, data){
					var splitter = data.helper;
					var parent = splitter.parent();
					var percent = data.position.left * 100 / parent.width();
					splitter.css('left', '' + percent + '%');
				}
			});
//				this.scrollBottom();
			
			return idx;
		},
		
		addWheelDelta: function(delta){
			var boundaryPenetrationAllowed = 0;
			var self = this;
			if(this.scrollDelta == null){
				this.scrollDelta = 0;
				this.scrollPos = this.canvas.position().top;
			}
			this.scrollStartTime = new Date().getTime();
			var prevDelta = this.canvas.position().top - this.scrollPos; 
			self.scrollDelta += delta * 60 - prevDelta;
			this.scrollPos = this.canvas.position().top;
			
			// check for bounds
			if(self.scrollDelta > 0 && this.scrollPos + self.scrollDelta > boundaryPenetrationAllowed){
				self.scrollDelta = boundaryPenetrationAllowed - this.scrollPos;
				this.scrollAnchor = 'top'; 
			} else if(self.scrollDelta < 0 && this.scrollPos + self.scrollDelta + this.canvas.height() - this.logWindow.height() < -boundaryPenetrationAllowed){
				self.scrollDelta = this.logWindow.height() - boundaryPenetrationAllowed - this.canvas.height() - this.scrollPos;
				this.scrollAnchor = 'bottom';
			} else {
				this.scrollAnchor = 'center';
			}
			
			if(self.wheelScrollInterval == null ) {
				JSB().deferUntil(function(){
					self.isScrolling = true;
					self.wheelScrollInterval = setInterval(function(){
						self.updateWheelScrollPosition();
					},1);
				}, function(){
					return !self.isScrolling;
				});
			}
		},
		
		ease: function (t, b, c, d) {
			return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
		},
		
		updateWheelScrollPosition: function(){
			var self = this;
			var dur = 800;
			var curTime = new Date().getTime() - this.scrollStartTime;
			if(curTime > dur){
				this.scrollDelta = null;
				clearInterval(this.wheelScrollInterval);
				this.wheelScrollInterval = null;
				this.isScrolling = false;
				this.saveScrollState();
				if(!this.isScrollbarDragging){
					JSB().defer(function(){
						self.scrollBarWindow.fadeOut();
					}, 100, 'scrollBar_fadeOut');
				}
				return;
			} else {
				JSB().cancelDefer('scrollBar_fadeOut');
			}
			var newY = this.ease(curTime, this.scrollPos, this.scrollDelta, dur);
			this.canvas.css('top', newY);
			var scrollHeight = this.scrollBarWindow.height() * this.logWindow.height() / this.canvas.height();
			var topOffset = this.scrollBarWindow.height() * (-this.canvas.position().top) / this.canvas.height();
			this.scrollBar.css({
				top: topOffset,
				height: scrollHeight 
			});
		},
		
		scrollBottom: function(){
			var toY = this.logWindow.height() - this.canvas.height();
			this.scrollTo(toY);
			this.scrollAnchor = 'bottom'; 
		},
		
		scrollTop: function(){
			this.scrollTo(0);
			this.scrollAnchor = 'top';
		},
		
		scrollTo: function(y){
			var self = this;
			this.scrollAnchor = 'center';
			this.isScrolling = true;
			this.canvas.animate({
				'top': y
			}, {
				duration: 300,
				complete: function(){
					self.isScrolling = false;
					self.saveScrollState();
				}
			});
		},
		
		saveScrollState: function(){
			
		},
		
		restoreScrollState: function(){
			if(this.scrollAnchor == 'top'){
				this.scrollTop();
			} else if(this.scrollAnchor == 'bottom') {
				this.scrollBottom();
			} else {
				// nothing to do now
			}
		},
		
		updateLayout: function(){
			var self = this;
			this.allowScroll = this.canvas.height() > this.logWindow.height();
			JSB().defer(function(){
				if(!self.allowScroll){
					self.scrollBottom();
				} else {
					self.restoreScrollState();
				}
			}, 200, 'updateLayout');
			var aspect = this.canvas.height() / this.canvas.width();
			var sbHeight = this.scrollBarWindow.width() * aspect;
			if(sbHeight > 400){
				sbHeight = 400;
			}
			if( sbHeight < 100){
				sbHeight = 100;
			}
			var sbWidth = sbHeight / aspect;
			if(sbWidth < 30){
				sbWidth = 30;
			}
			if(sbWidth > 100){
				sbWidth = 100;
			}
			this.scrollBarWindow.css({
				'width': sbWidth,
				'height': sbHeight
			});
		},
		
		removeHints: function(){
			var self = this;
			if(self.widgets.length == 0){
				return;
			}
			this.editor.operation(function(){
				for ( var i = 0; i < self.widgets.length; ++i) {
					self.editor.removeLineWidget(self.widgets[i]);
				}
				self.widgets.length = 0;
			});
		},

		updateHints: function(err, line){
			var self = this;
			this.editor.operation(function() {
				for ( var i = 0; i < self.widgets.length; ++i) {
					self.editor.removeLineWidget(self.widgets[i]);
				}
				self.widgets.length = 0;

				var msg = document.createElement("div");
				var icon = msg.appendChild(document.createElement("span"));
				icon.innerHTML = "!!";
				icon.className = "lint-error-icon";
				msg.appendChild(document.createTextNode(err));
				msg.className = "lint-error";
				self.widgets.push(self.editor.addLineWidget(line - 1, msg, {
					coverGutter : false,
					noHScroll : true
				}));
			});
			var info = self.editor.getScrollInfo();
			var after = self.editor.charCoords({
				line : self.editor.getCursor().line + 1,
				ch : 0
			}, "local").top;
			if (info.top + info.clientHeight < after) {
				self.editor.scrollTo(null, after - info.clientHeight + 3);
			}
			
		},
		
		post: function(itemEntry){
			var self = this;
			var val = null;
			var code = null;
			var token = null;
			if(itemEntry == null || itemEntry == undefined){
				val = this.editor.getDoc().getValue().trim();
				if(val.length == 0){
					return;
				}
				code = this.cmdWindow.find('div.CodeMirror-code pre').clone();
			} else {
				itemEntry.item.loader();
				token = itemEntry.item.attr('token');
				val = itemEntry.originalCmd;
			}
			var params = {
				type: 'execute',
				data: val
			};
			if(token != null){
				params['token'] = token;
			}
			this.ajax('jspoint', params, function(result, obj){
				// ready
				if(result == 'success'){
					self.trackTask(obj.token, code);
				} else {
					// communication error. retry in 5 secs
					JSB().defer(function(){
						self.post();
					},5000);
				}
			});
		},
		
		trackTask: function(token, cmd){
			var self = this;
			this.ajax('jspoint',{
				type: 'check',
				token: token
			}, function(result, obj){
				// ready
				if(result == 'success'){
					if(obj.status == 'MISSING') {
						obj.status = 'FAIL';
						obj.error = 'Command expired';
						self.completeTask(token, cmd, obj);
					} else if(obj.status == 'SUCCESS' || obj.status == 'FAIL'){
						self.completeTask(token, cmd, obj);
					} else {
						window.setTimeout( function(){
							self.trackTask(token, cmd);
						}, 300 );
					}
				} else {
					// communication error. retry in 5 secs
					JSB().defer( function(){
						self.trackTask(token, cmd);
					}, 5000 );
				}
			});
		},
		
		completeTask: function(token, cmd, res){
			var self = this;
			if(res.status == 'FAIL'){
				// parse errors and show on editor
				console.log("JS Error: " + res.error);
				var arr = /([^\:]+)\:\s*(.+?)\s*\(\<[^\>]+\>\#(\d+)\)/gi.exec(res.error);
				if(arr != null && /\<cmd\:[0-9a-f\-]+\>/gi.test(res.error) && /EvaluatorException/gi.test(res.error)){
					var errType = arr[1];
					var errMsg = arr[2];
					var line = parseInt(arr[3]);
					self.updateHints(errMsg, line);
				} else {
					var val = this.editor.getDoc().getValue().trim();
					this.editor.getDoc().setValue(''); // clear editor field
					var err = res.error;
					this.addItemPair(token, cmd, err, val, true);
				}
			} else {
				var val = this.editor.getDoc().getValue().trim();
				this.editor.getDoc().setValue(''); // clear editor field
				var retObj = res.result;
				
				var exItem = this.canvas.find('.logItem[token="'+token+'"]');
				if(exItem.length > 0){
					var existedIdx = parseInt(exItem.attr('idx'));
					if(self.items[existedIdx].embeddedObject != null && self.items[existedIdx].embeddedObject != undefined){
						self.items[existedIdx].embeddedObject.destroy();
						self.items[existedIdx].embeddedObject = null;
					}
				}
				
				if(JSB().isNull(retObj)){
					this.addItemPair(token, cmd, retObj == null ? '<div class="null">null</null>' : '<div class="null">undefined</null>', val);
				} else if(typeof(retObj) === 'string'){
					this.addItemPair(token, cmd, retObj, val);
				} else if(typeof(retObj) === 'object' || typeof(retObj) == 'function'){
					
					var eltContent = this.$('<div class="embeddedObject"></div>');
					var idx = this.addItemPair(token, cmd, eltContent, val);
					JSB().deferUntil(function(){
						self.renderEmbeddedObject(token, retObj, eltContent, idx);
					},function(){
						return eltContent.width() > 0;
					});
					
				} else {
					this.addItemPair(token, cmd, '' + retObj, val);
				}
			}
		},
		
		renderEmbeddedObject: function(token, obj, container, idx){
			var self = this;
			var widgetToLoad = '';
			var embeddedField = '_embeddedType_';
			var dataField = '_embeddedData_';
			var contextField = '_embeddedContext_';
			var widgetData = null;
			var widgetContext = null;
			
			if(!obj){
				container.append('<div class="null">null</div>');
				return;
			}
			if( !JSB().isNull(obj[embeddedField])) {
				widgetToLoad = obj[embeddedField];
				widgetData = obj[dataField];
				widgetContext = obj[contextField];


				JSB().lookup(widgetToLoad, function(f){
					var embeddedWidget = new f(JSB.merge({
						contextKey: widgetContext
					}, widgetData));
					self.items[idx].embeddedObject = embeddedWidget;
					
					if(JSB.isInstanceOf(embeddedWidget, 'JSB.Widgets.Widget')){
						var fc = new FloatingContainer({
							position: 'fixed',
							suggested: {
								width: container.width() / 2,
								height: container.width() / 2,
							}
						});

						var containerElt = fc.getElement();
						containerElt.addClass('embedded');
						container.append(containerElt);
						container.addClass('widget');
						
						container.resize(function(evt, w, h){
							if(container.get(0) != evt.target){
								return;
							}
							fc.updateArea(w - containerElt.position().left, 0);
						});
						fc.attachWidget(embeddedWidget);
						
					} else if(JSB.isInstanceOf(embeddedWidget, 'JSB.Widgets.Control') || JSB.isInstanceOf(embeddedWidget, 'JSB.Controls.Control')){
						container.addClass('control');
						container.append(embeddedWidget.getElement());
					} else {
//						container.append(embeddedWidget);
					}
				}, {
					forceUpdate: true
				});
			} else {
				widgetToLoad = 'JsonView';

				JSB().lookup(widgetToLoad, function(f){
					var embeddedWidget = new f({
						container: container,
						data: obj,
						context: widgetContext
					});
					self.items[idx].embeddedObject = embeddedWidget;
				});
			}
		},
		
		generateToolbar: function(toolbarCfg){
			var self = this;
			var toolBar = this.$('<div class="toolbar"></div>');
			var ul = this.$('<ul></ul>');
			toolBar.append(ul);
			for(var i in toolbarCfg){
				var cfgEntry = toolbarCfg[i];
				if(cfgEntry.name == 'separator'){
					ul.append('<li class="'+cfgEntry.name+'" idx="'+i+'"></li>');
				} else {
					ul.append('<li class="'+cfgEntry.name+'" title="'+cfgEntry.hint+'" idx="'+i+'"></li>');
				}
			}
			
			return toolBar;
		},
		
		initToolbars: function(){
			var self = this;
			this.toolbarCmdCfg = [{
				name: 'edit',
				hint: 'Copy to editor',
				onClick: function(tool, itemEntry){
					self.editor.getDoc().setValue(itemEntry.originalCmd);
				}
			},{
				name: 'copy',
				hint: 'Copy to clipboard',
				onClick: function(tool, itemEntry){
					debugger;
				}
			},{
				name: 'run',
				hint: 'Retry command',
				onClick: function(tool, itemEntry){
					self.post(itemEntry);
				}
			}];

			this.toolbarResultCfg = [{
				name: 'copy',
				hint: 'Copy to clipboard',
				onClick: function(tool, itemEntry){
					debugger;
				}
			},{
				name: 'separator'
			},{
				name: 'toggle',
				hint: 'Toggle expand/collapse',
				onClick: function(tool, itemEntry){
					var item = itemEntry.item;
					if(item.hasClass('collapsed')){
						// expand item
						item.animate({
							'height': '100%',
						});
						item.removeClass('collapsed');
						tool.removeClass('expand');
					} else {
						// collapse item
						item.animate({
							'height': '30px',
						});
						item.addClass('collapsed');
						tool.addClass('expand');
					}
				}
			},{
				name: 'close',
				hint: 'Close entry',
				onClick: function(tool, itemEntry, idx){
					// check for embedded object in result sheet
					var item = itemEntry.item;
					if(itemEntry.embeddedObject){
						itemEntry.embeddedObject.destroy();
					}
					self.items[idx] = null;
					item.slideUp(function(){
						item.remove();
					});
				}
			}];

			this.toolbarCmd = this.generateToolbar(this.toolbarCmdCfg);
			this.toolbarResult = this.generateToolbar(this.toolbarResultCfg);
		}
	},
	
	$server: {
		$bootstrap: function(){
			widget = function(widget, data){
				var d = data;
				if(d == null || d == undefined){
					d = {};
				}
				return {
					_embeddedType_:widget,
					_embeddedData_:d
				};
			}
		}
	}

}