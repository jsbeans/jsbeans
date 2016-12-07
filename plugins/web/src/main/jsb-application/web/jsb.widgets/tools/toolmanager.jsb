JSB({
	name:'JSB.Widgets.ToolManager',
	require: {
		'JQuery': 'JQuery', 
		'JSB.Widgets.EventBus': 'EventBus',
		'JSB.Widgets.ToolWrapper': 'ToolWrapper',
		'JSB.Widgets.MessageTool': 'JSB.Widgets.MessageTool',
		'JSB.Widgets.WidgetTool': 'JSB.Widgets.WidgetTool',
		'JSB.Widgets.Tooltip':'JSB.Widgets.Tooltip'
	},
	client: {
		singleton: true,
		constructor: function(){
			var self = this;
			this.loadCss('toolmanager.css');
			this.tools = {};
			this.visibleInstances = [];
			this.EventBus.subscribe(this, 'tool');
			
			// create tool area
			JSO().deferUntil(function(){
				self.toolArea = self.$('<div class="_dwp_toolManager_toolArea"></div>');
				self.$('body').prepend(self.toolArea);
				self.$('body').click(function(evt){
					self.handleMouseClick(evt.pageX, evt.pageY);
				});
				self.$('body').keydown(function(evt){
					if(evt.which == 27){	//ESC pressed
						self.handleEsc();
						evt.preventDefault();
					}
				});
				
			}, function(){
				return self.$('body').length > 0;
			});
		},
		
		registerTool: function(settings){
			var self = this;
			var toolId = settings.id;
			var toolJso = settings.jso;
			var opts = settings.toolOpts;
			var wrapOpts = settings.wrapperOpts;
			
			if( JSO().isNull(toolJso)){
				throw 'ToolManager.registerTool: Tool object has not been specified';
			}
			if(JSO().isNull(toolId)){
				throw 'ToolManager.registerTool: Invalid toolId specified';
			}
			if(!(toolJso instanceof JSO)){
				throw 'ToolManager.registerTool: Tool object being registered has invalid type';
			}
			
			if(!JSO().isNull(this.tools[toolId])) {
				return; // tool has already been registered	
			}
			
			this.tools[toolId] = {
				jso: toolJso,
				toolOpts: opts,
				wrapperOpts: wrapOpts,
				instances: []
			};
			
			if(settings.enforceInstance){
				var cls = toolJso.getClass();
				var obj = new cls(opts);
				var chosenInstance = new self.ToolWrapper(toolId, self, obj, wrapOpts);
				this.tools[toolId].instances.push(chosenInstance);
			}
		},
		
		unregisterTool: function(toolId){
			throw 'ToolManager.unregisterTool: Not implemented yet';
		},
		
		handleMouseClick: function(x, y){
			var self= this;
			if(JSO().isNull(self.visibleInstances) || self.visibleInstances.length == 0){
				return;
			}
			for(var i = self.visibleInstances.length - 1; i >= 0; i--){
				var inst = self.visibleInstances[i];
				if( inst.options.hideByOuterClick ){
					if(!inst.isMouseInside){
						inst.hide(false);
					} else {
						break;
					}
				}
				
			}
		},
		
		handleEsc: function(){
			if(this.visibleInstances.length > 0){
				var inst = this.visibleInstances[this.visibleInstances.length - 1];
				if(inst.options.hideByEsc){
					this.visibleInstances.pop();
					inst.hide(true);
				}
			}
		},
		
		showMessage: function(params, scope){
			if(JSO().isNull(scope)){
				scope = this;
			}
			this.activate({
				id: '_dwp_messageTool',
				cmd: 'show',
				data: params,
				scope: scope,
				target: params.target,
				constraints: params.constraints,
				callback: params.callback
			});

		},
		
		showTip: function(params) {
			this.activate({
				id: '_dwp_standardTooltip',
				cmd: 'show',
				data: params.data,
				scope: this,
				target: params.target,
				constraints: params.constraints,
				callback: params.callback
			});
		},
		
		showWidget: function(params){
			if(JSO().isNull(params.scope)){
				params.scope = this;
			}
			
			this.activate(JSO().merge({
				id: '_dwp_widgetTool',
				cmd: 'show',
			},params));
		},
		
		resolveScope: function(scope){
			if(!scope){
				return scope;
			}
			if(JSO().isFunction(scope)){
				scope = scope.call(this);
				return this.resolveScope(scope);
			}
			if(JSO().isString(scope)){
				scope = this.$(scope);
			}
			if(JSO().isInstanceOf(scope, 'JSB.Widgets.Control')){
				scope = scope.getElement();
			}
			return scope;
		},
		
		activate: function(params){
			var self = this;
			var scope = this.resolveScope(params.scope);
			var toolEntry = this.tools[params.id];

			if(JSO().isNull(toolEntry)){
				return;
			}
			
			if(params.cmd == 'show'){
				// perform exclusive logic
				if(toolEntry.wrapperOpts && toolEntry.wrapperOpts.exclusive){
					// hide all subscopes
					for(var i = self.visibleInstances.length - 1; i >= 0; i--){
						var inst = self.visibleInstances[i];
						if(JSO().isString(toolEntry.wrapperOpts.exclusive )){
							if(JSO().isString(inst.options.exclusive) && inst.options.exclusive == toolEntry.wrapperOpts.exclusive){
								inst.hide();
							}
						} else if(toolEntry.wrapperOpts.exclusive && (JSO().isNull(scope) || self.isSubScopeOf(this.resolveScope(inst.getScope()), scope))){
							inst.hide();
						}
					}
				}
			}
			
			// check for existing instances
			var chosenInstance = null;
			for(var i in toolEntry.instances){
				var inst = toolEntry.instances[i];
				if(!inst.isVisible() || params.cmd == 'update'){
					chosenInstance = inst;
					break;
				}
			}
			
			if(JSO().isNull(chosenInstance)){
				// create new instance
				var cls = toolEntry.jso.getClass();
				var obj = new cls(toolEntry.toolOpts);
				chosenInstance = new self.ToolWrapper(params.id, self, obj, JSO().merge(toolEntry.wrapperOpts, params));
				toolEntry.instances[toolEntry.instances.length] = chosenInstance;
			}
			
			// set data
			chosenInstance.setData({data: params.data, callback: params.callback});
			chosenInstance.compCntr = 0;
			
			JSO().deferUntil(function(){
				chosenInstance.show(JSO().merge({
					scope: scope 
				}, params));
				if(!JSO().isNull(params.onShow)){
					params.onShow.call(self);
				}
			},function(){
				var bRet = true;
				if(JSO().isNull(chosenInstance.oldW)){
					chosenInstance.oldW = chosenInstance.getElement().outerWidth(true);
					bRet = false;
				}
				if(JSO().isNull(chosenInstance.oldH)){
					chosenInstance.oldH = chosenInstance.getElement().outerHeight(true);
					bRet = false;
				}
				if(chosenInstance.getElement().outerWidth(true) != chosenInstance.oldW || chosenInstance.getElement().outerHeight(true) != chosenInstance.oldH){
					chosenInstance.oldW = chosenInstance.getElement().outerWidth(true);
					chosenInstance.oldH = chosenInstance.getElement().outerHeight(true);
					chosenInstance.compCntr = 0;
					bRet = false;
				} else {
					chosenInstance.compCntr++;
					if(chosenInstance.compCntr < 5){
						bRet = false;
					}
				}
				if( chosenInstance.getElement().width() == 0 || chosenInstance.getElement().height() == 0 ){
					bRet = false;
				}
				return bRet;
			}, 50);
			
			return chosenInstance;
		},
		
		onMessage: function(sender, msg, params){
			var self = this;
			if(JSO().isNull(params)){
				return;
			}
			if(msg != 'tool'){
				throw 'ToolManager.onMessage: Wrong message received';
			}
			if(JSO().isNull(params.cmd) || JSO().isNull(params.id)){
				throw 'ToolManager.onMessage: Message malformed';
			}
			
			// find entry
			if(JSO().isNull(sender) || JSO().isNull(sender.getJsb()) || !sender.getJsb().isSubclassOf('JSB.Widgets.Control')){
				throw 'ToolManager.onMessage: invalid sender';
			}

			self.activate(params);
		},
		
		getToolArea: function(){
			return this.toolArea;
		},
		
		isSubScopeOf: function(childScope, parentScope){
			var self = this;
			if(parentScope == null){
			    return true;
			}
			if(childScope == null){
			    return false;
			}
			var toElt = function(scope){
				if(!JSO().isNull(scope.getElement)){
					return scope.getElement();
				}
				return self.$(scope);
			};
			var childElt = toElt(childScope);
			var parentElt = toElt(parentScope);
			var curElt = childElt;
			while(curElt && curElt.length > 0){
				if(curElt == parentElt){
					return true;
				}
				curElt = curElt.parent();
			}
			
			return false;
		}
	}
});

JSB({
	name:'JSB.Widgets.Tool',
	parent: 'JSB.Widgets.Widget',
	client: {
		constructor: function(opts){
			$base(opts);
		},
		
		setData: function(data){
			this.data = data;
			this.update();
		},
		
		update: function(){
			// do update when overrides
		},
		
		close: function(bCanceled){
			if(this.wrapper){
				this.wrapper.close(bCanceled);
			}
		},
		
		setWrapper: function(wrapper){
			this.wrapper = wrapper;
		},
		
		getWrapper: function(){
			return this.wrapper;
		},
		
		onHide: function(bCanceled){}
	}
});

JSB({
	name:'JSB.Widgets.ToolWrapper',
	parent:'JSB.Widgets.Control',
	client: {
		constructor: function(toolId, toolMgr, w, opts){
			var self = this;
			$base(opts);
			this.loadCss('toolwrapper.css');
			this.toolId = toolId;
			this.toolManager = toolMgr;
			this.embeddedWidget = w;
			JSO().loadScript('tpl/d3/d3.min.js');
			JSO().waitForObjectExist('window.d3',function(){
				self.init();	
			});
		},
		
		options: {
			hideByEsc: true
		},
		init: function(){
			var elt = this.getElement();
			elt.addClass('_dwp_toolWrapper');
			if(!JSO().isNull(this.options.cssClass)){
				elt.addClass(this.options.cssClass);
			}
			this.clientContainer = this.$('<div class="clientContainer"></div>');
			
			this.initSvg();
			elt.append(this.clientContainer);
			this.rect = {x: 0, y: 0, w: 0, h: 0};
			
			this.visible = false;
			this.isMouseInside = false;
			this.scope = null;
			this.clientContainer.append(this.embeddedWidget.getElement());
			this.embeddedWidget.setWrapper(this);
			elt.css({
				'left': 0,
				'top': 0,
				'visibility': 'hidden'
			});			
			this.toolManager.getToolArea().append(elt);
			this.initHandlers();
		},
		
		initSvg: function(){
			var elt = this.getElement();
			this.svgContainer = d3.select(elt.get(0)).append("svg");
			this.svgContainer.attr('class','svgContainer');
			this.svgContainer.attr('width',0);
			this.svgContainer.attr('height',0);
			var defs = this.svgContainer.append('defs');
			
			// add left gradient
			this.leftGradientId = JSO().generateUid();
			var leftGradient = defs.append('linearGradient')
				.attr('id', this.leftGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '100%')
				.attr('y2', '0%');
			leftGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'left transparent');
			leftGradient.append('stop')
			.attr('offset', '100%')
			.attr('class', 'left opaque');

			// add right gradient
			this.rightGradientId = JSO().generateUid();
			var rightGradient = defs.append('linearGradient')
				.attr('id', this.rightGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '100%')
				.attr('y2', '0%');
			rightGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'right opaque');
			rightGradient.append('stop')
				.attr('offset', '100%')
				.attr('class', 'right transparent');

			// add top gradient
			this.topGradientId = JSO().generateUid();
			var topGradient = defs.append('linearGradient')
				.attr('id', this.topGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '0')
				.attr('y2', '100%');
			topGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'top transparent');
			topGradient.append('stop')
				.attr('offset', '100%')
				.attr('class', 'top opaque');

			// add bottom gradient
			this.bottomGradientId = JSO().generateUid();
			var bottomGradient = defs.append('linearGradient')
				.attr('id', this.bottomGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '0')
				.attr('y2', '100%');
			bottomGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'bottom opaque');
			bottomGradient.append('stop')
				.attr('offset', '100%')
				.attr('class', 'bottom transparent');
			
		},
		
		initHandlers: function(){
			var self = this;
			this.getElement().mouseover(function(){
				self.isMouseInside = true;
				if(self.options.hideInterval > 0){
					JSO().cancelDefer('_toolHideInterval_');
				}
			});
			this.getElement().mouseout(function(){
				self.isMouseInside = false;
				if(self.options.hideInterval > 0){
					JSO().defer(function(){
						self.close();
					}, self.options.hideInterval, '_toolHideInterval_');
				}
			});
		},
		
		getScope: function(){
			return this.scope;
		},
		
		showModalBackground: function(pt){
			var scope = this.getScope();
			var scopeEl = null;
			var rect = null;
			if(JSO().isInstanceOf(scope, 'JSB.Widgets.Control')){
				scopeEl = scope.getElement();
			} else if(JSO().isInstanceOf(scope, 'Bean')) {
				scopeEl = this.$('body');
			} else if(JSO().isNull(scope)){
				scopeEl = this.$('body');
			} else if(JSO().isWindow(scope)){
				scopeEl = null;
			} else {
				scopeEl = this.$(scope);
			}
			
			if(scopeEl){
				// construct modal background
				rect = scopeEl.get(0).getBoundingClientRect();
			}
			if(!rect || rect.width == 0 || rect.height == 0){
				// take a whole window rect
				rect = {
					left: 0,
					top: 0,
					width: this.$(window).width(),
					height: this.$(window).height()
				};
			}

			this.modalBack = this.$('<div class="_dwp_toolWrapperModalBack"></div>');
			this.modalHighlighter = this.$('<div class="_dwp_toolWrapperModalHighlighter"></div>');
			this.modalBack.append(this.modalHighlighter);
			this.modalBack.css({
				left: 0,
				top: 0,
				width: rect.width,
				height: rect.height
			});
			this.modalHighlighter.css({
				width: rect.width * 2, 
				height: rect.height * 2,
				left: -rect.width + pt.x - rect.left,
				top: -rect.height + pt.y - rect.top
			});
			scopeEl.append(this.modalBack);
			this.modalBack.fadeIn();
		},
		
		show: function(params){
			var self = this;
			for(var i in this.toolManager.visibleInstances){
				if(this.toolManager.visibleInstances[i] == this){
					return;	// already showing
				}
			}
			this.toolManager.visibleInstances.push(this);
			var elt = this.getElement();
			this.visible = true;
			this.params = params;
			this.scope = null;
			if(!JSO().isNull(this.options.scope)){
				this.scope = this.options.scope;
			}
			if(!JSO().isNull(params.scope)){
				this.scope = params.scope;
			}
			
			this.onHide = params.onHide;
			
			this.publish('toolShow', params);
			
			this.updatePosition();

			if(this.options.modal){
				this.addClass('_dwp_modal');
				this.showModalBackground(this.affinityPoint);
			} else {
				this.removeClass('_dwp_modal');
			}
			
			elt.css({
				'visibility': 'visible',
				'opacity': 0
			});
			elt.animate({
				'opacity': 1
			}, 200);
			if( !JSO().isNull(this.embeddedWidget)){
				this.embeddedWidget.setFocus();
			}
			
			if(self.options.hideInterval > 0){
				// track target's mouse over and out
				var elt = params.target;
				this.trackProcs = {
					over: function(){
						JSO().cancelDefer('_toolHideInterval_');
					},
					out: function(){
						JSO().defer(function(){
							self.close();
						}, self.options.hideInterval, '_toolHideInterval_');
					}
				};
				params.target.selector.bind({
					mouseover: this.trackProcs.over,
					mouseout: this.trackProcs.out
				});
				if(params.handle && params.handle.selector){
					params.handle.selector.bind({
						mouseover: this.trackProcs.over,
						mouseout: this.trackProcs.out
					});
				}
			}
		},
		
		resolveConstraints: function(cArr){
			var constraints = [];
			if(!JSO().isNull(cArr)){
				for(var i in cArr){
					var c = cArr[i];
					var newC = {
						weight: c.weight,
						left: c.left,
						top: c.top,
						width: c.width,
						height: c.height
					};
					
					var sel = JSO().$(c.selector);
					if(!JSO().isNull(c.selector) && sel.length > 0){
						var selRect = sel.get(0).getBoundingClientRect();
//							var offs = c.selector.offset();
						newC.left = selRect.left;
						newC.top = selRect.top;
						newC.width = selRect.width;
						newC.height = selRect.height;
					}
					
					if(JSO().isNull(newC.left) || JSO().isNull(newC.top) || JSO().isNull(newC.width) || JSO().isNull(newC.height)){
						continue;	// ignore constraint
					}
					
					if(!JSO().isNull(c.margin)){
						if(!JSO().isNull(c.margin.left)){
							newC.left -= c.margin.left;
							newC.width += c.margin.left;
						}
						if(!JSO().isNull(c.margin.right)){
							newC.width += c.margin.right;
						}
						if(!JSO().isNull(c.margin.top)){
							newC.top -= c.margin.top;
							newC.height += c.margin.top;
						}
						if(!JSO().isNull(c.margin.bottom)){
							newC.height += c.margin.bottom;
						}
					}
					constraints.push(newC);
				}
			}
			
			return constraints;
		},
		
		resolveAffinityPoint: function(){
			var ap = {x: 0, y: 0};
			var ptCnt = 0;
			for(var i in this.targets){
				var t = this.targets[i];
				var selRect = null;
				if(!JSO().isNull(t.selector)){
					var sel = this.$(t.selector);
					if(JSO().isNull(sel) || sel.length == 0){
						throw 'ToolWrapper.show: invalid selector specified';
						return;
					}
					selRect = sel.get(0).getBoundingClientRect();
					
				} else {
					selRect = {
						left: 0,
						right: this.$(window).width(),
						width: this.$(window).width(),
						top: 0,
						bottom: this.$(window).height(),
						height: this.$(window).height()
					};
				}
				var tRect = {
					left: selRect.left,
					top: selRect.top,
					right: selRect.right,
					bottom: selRect.bottom
				};
				var pt = {
					x: ( tRect.left + tRect.right ) / 2,
					y: ( tRect.top + tRect.bottom ) / 2
				};
				if(t.pivotHorz == 'left'){
					pt.x = tRect.left;
				} else if(t.pivotHorz == 'right'){
					pt.x = tRect.right;
				}
				if(t.pivotVert == 'top'){
					pt.y = tRect.top;
				} else if(t.pivotVert == 'bottom'){
					pt.y = tRect.bottom;
				}
				if(!JSO().isNull(t.offsetHorz)){
					pt.x += t.offsetHorz;
				}
				if(!JSO().isNull(t.offsetVert)){
					pt.y += t.offsetVert;
				}
				t.pt = pt;
				ap.x += pt.x;
				ap.y += pt.y;
				ptCnt++;
			}
			
			ap.x /= ptCnt;
			ap.y /= ptCnt;
			
			return ap;
		},
		
		updatePosition: function(bUpdate){
			var self = this;
			var elt = this.getElement();
			if(JSO().isNull(this.params.distWeight)){
				this.params.distWeight = 0.1;
			}
			if(JSO().isNull(this.targets)){
				this.targets = [];
			}

			// merge targets
			var newTargets = [];
			if(JSO().isArray(this.params.target)){
				newTargets = this.params.target;
			} else {
				newTargets.push( this.params.target ); 
			}
			
			// remove old non-existed targets
			var idsToRemove = [];
			for(var i in this.targets){
				var t = this.targets[i];
				var bExisted = false;
				for(var j in newTargets){
					nT = newTargets[j];
					if(this.$(nT.selector).get(0) == this.$(t.selector).get(0)){
						bExisted = true;
						break;
					}
				}
				if(!bExisted){
					this.removeSvgCallout(t)
					idsToRemove.push(i);
				}
			}
			for(var i in idsToRemove){
				this.targets.splice(idsToRemove[i], 1);
			}
			
			// append new targets
			var targetsToAppend = [];
			for(var i in newTargets){
				var nT = newTargets[i];
				var bExisted = false;
				for(var j in this.targets){
					var t = this.targets[j];
					if(this.$(nT.selector).get(0) == this.$(t.selector).get(0)){
						bExisted = true;
						break;
					}
				}
				if(!bExisted){
					targetsToAppend.push(nT);
				}
			}
			for(var i in targetsToAppend){
				this.targets.push(targetsToAppend[i]);
			}

			if(this.targets.length > 0 && !JSO().isNull(this.targets[0].dock)){
				// perform docking
				var tgt = this.targets[0].selector;
				var xOffs = this.targets[0].offsetHorz || 0;
				var yOffs = this.targets[0].offsetVert || 0;
				var selRect = tgt.get(0).getBoundingClientRect();
				var posObj = {
					top: {
						x: selRect.left + xOffs, 
						y: selRect.top - this.getElement().outerHeight() + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					topRight: {
						x: selRect.left + selRect.width - this.getElement().outerWidth() + xOffs, 
						y: selRect.top - this.getElement().outerHeight() + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					bottom: {
						x: selRect.left + xOffs, 
						y: selRect.top + selRect.height + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					bottomRight: {
						x: selRect.left + selRect.width - this.getElement().outerWidth() + xOffs, 
						y: selRect.top + selRect.height + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					left: {
						x: selRect.left - this.getElement().outerWidth() + xOffs,
						y: selRect.top + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					leftCenter: {
						x: selRect.left - this.getElement().outerWidth() + xOffs,
						y: selRect.top + selRect.height / 2 - this.getElement().outerHeight() / 2 + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					leftBottom: {
						x: selRect.left - this.getElement().outerWidth() + xOffs,
						y: selRect.top + selRect.height - this.getElement().outerHeight() + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					right: {
						x: selRect.left + selRect.width + xOffs,
						y: selRect.top + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					rightCenter: {
						x: selRect.left + selRect.width + xOffs,
						y: selRect.top + selRect.height / 2 - this.getElement().outerHeight() / 2 + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					rightBottom: {
						x: selRect.left + selRect.width + xOffs,
						y: selRect.top + selRect.height - this.getElement().outerHeight() + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					}


				};
				if(this.targets[0].align){
					switch(this.targets[0].align){
					case 'left':
						break;
					case 'right':
						break;
					case 'center':
						posObj.top.x = selRect.left - (this.getElement().outerWidth() - selRect.width) / 2;
						posObj.bottom.x = selRect.left - (this.getElement().outerWidth() - selRect.width) / 2;
						break;
					case 'top':
						break;
					case 'bottom':
						break;
					}
				}
				var priorityList = [];
				switch(this.targets[0].dock){
				case 'top':
					priorityList = [posObj.top, posObj.topRight, posObj.bottom, posObj.bottomRight, posObj.right, posObj.left];
					break;
				case 'bottom':
					priorityList = [posObj.bottom, posObj.bottomRight, posObj.top, posObj.topRight, posObj.right, posObj.left];
					break;
				case 'left':
					priorityList = [posObj.left, posObj.leftCenter, posObj.leftBottom, posObj.right, posObj.rightCenter, posObj.rightBottom, posObj.bottom, posObj.top];
					break;
				case 'right':
					priorityList = [posObj.right, posObj.rightCenter, posObj.rightBottom, posObj.left, posObj.leftCenter, posObj.leftBottom, posObj.bottom, posObj.top];
					break;
				}
				for(var i in priorityList){
					var rect = priorityList[i];
					var testR = this.test(rect.x, rect.y, rect.w, rect.h);
					if(testR > 0){
						continue;
					}
					this.rect = rect;
					elt.css({
						'left': this.rect.x,
						'top': this.rect.y,
						'min-width': this.rect.w
					});
					break;
				}
				this.affinityPoint = {x:selRect.left + selRect.width / 2, y:selRect.top + selRect.height / 2};
			} else {
				// find out affinity point
				var ap = this.resolveAffinityPoint();
				this.affinityPoint = ap;
				
				// resolve constraints
				var constraints = this.resolveConstraints(this.params.constraints);
				
				// resolve containment
				if(this.params.containment){
					this.containmentBox = JSO().$(this.params.containment).get(0).getBoundingClientRect();
				}

				// lookup best position via whirl algorithm
				var width = this.getElement().outerWidth();
				var height = this.getElement().outerHeight();
				this.minPt = {x: 0, y: 0, w: null};
				var whirlStep = 20;
				if(this.params.whirlStep){
					whirlStep = this.params.whirlStep; 
				}
				var sz = Math.max(width, height);
				var maxWhirlVal = Math.ceil(sz / whirlStep) * 2 + 1;
				this.whirl(ap.x - width / 2, ap.y - height / 2, whirlStep, function(x, y, val){
					x = Math.round(x);
					y = Math.round(y);

					// find distance between window position and target
					var cx = ap.x;
					var cy = ap.y;
					if(ap.x < x || ap.x > x + width || ap.y < y || ap.y > y + height){
						// calc the nearest point to the ap
						if(ap.x < x){
							cx = x;
						}
						if(ap.x > x + width){
							cx = x + width;
						}
						if(ap.y < y){
							cy = y;
						}
						if(ap.y > y + height){
							cy = y + height;
						}
					}
					var dist = (ap.x - cx) * (ap.x - cx) + (ap.y - cy) * (ap.y - cy);
					
					var w = Math.round(this.test(x, y, width, height, constraints) + dist * self.params.distWeight);
					if(this.minPt.w == null || w < this.minPt.w){
						this.minPt.w = w;
						this.minPt.x = x;
						this.minPt.y = y;
					}
					if(val > maxWhirlVal){
						return false;
					}
					
					return true;
				});
				this.rect = {
					x: this.minPt.x, 
					y: this.minPt.y, 
					w: width, 
					h: height
				};
				
				if(bUpdate){
					this.getElement().find('svg.svgContainer').css('display','none');
					elt.animate({
						'left': this.minPt.x,
						'top': this.minPt.y
					}, function(){
						// update svg callouts
						self.updateSvgCallouts();
						self.trackPosition();
						self.getElement().find('svg.svgContainer').fadeIn(200);
					});
				} else {
					elt.css({
						'left': this.minPt.x,
						'top': this.minPt.y
					});
					
					// update svg callouts
					this.updateSvgCallouts();
					
					this.trackPosition();
				}
			}
		},
		
		trackPosition: function(){
			var self = this;
			if(self.visible){
				var width = this.getElement().outerWidth();
				var height = this.getElement().outerHeight();
				var x = this.rect.x;
				var y = this.rect.y;
				var ap = this.resolveAffinityPoint();
				var cx = ap.x;
				var cy = ap.y;
				if(ap.x < x || ap.x > x + width || ap.y < y || ap.y > y + height){
					// calc the nearest point to the ap
					if(ap.x < x){
						cx = x;
					}
					if(ap.x > x + width){
						cx = x + width;
					}
					if(ap.y < y){
						cy = y;
					}
					if(ap.y > y + height){
						cy = y + height;
					}
				}
				
				var dist = (ap.x - cx) * (ap.x - cx) + (ap.y - cy) * (ap.y - cy);
				var w1 = this.test(this.rect.x, this.rect.y, width, height, this.resolveConstraints(this.params.constraints));
				var w2 = dist * self.params.distWeight;
				var w = Math.round(w1 + w2);
				if(Math.abs(w - this.minPt.w) > ((w + this.minPt.w) / 2) * 0.3){
					self.updatePosition(true);
				} else {
					JSO().defer(function(){
						self.trackPosition();
					});
				}
			}
		},
		
		whirl: function(x, y, step, iteratorCallback){
			this.whirlAgg = [];
			var curPos = {
				x: x,
				y: y
			};
			var r = iteratorCallback.call(this, curPos.x, curPos.y, 0 );
			if(!r){
				return;
			}
			var dirVec = {
				x: step,
				y: 0
			};
			for(var curVal = 1; ; curVal++ ){
				for(var j = 0; j < 2; j++ ){
					for(var i = 0; i < curVal; i++ ){
						curPos.x += dirVec.x;
						curPos.y += dirVec.y;
						var r = iteratorCallback.call(this, curPos.x, curPos.y, curVal );
						if(!r){
							return;
						}
					}
					if(dirVec.x > 0){
						dirVec.x = 0;
						dirVec.y = step;
					} else if(dirVec.y > 0){
						dirVec.y = 0;
						dirVec.x = -step;
					} else if(dirVec.x < 0){
						dirVec.x = 0;
						dirVec.y = -step;
					} else {
						dirVec.y = 0;
						dirVec.x = step;
					}
				}
			}
		},

		
		test: function(x, y, w, h, cArr){
			var weight = 0.0;
			
			// check offScreen
			var offScreenCoff = 1000.0;
			var selfRect = {
				x: x,
				y: y,
				w: w,
				h: h
			};
			
			var sRect = {
				x: 0.0,
				y: 0.0,
				w: this.$( window ).width(),
				h: this.$( window ).height()
			};
			
			if(this.containmentBox){
				sRect = {
					x: this.containmentBox.left,
					y: this.containmentBox.top,
					w: this.containmentBox.right - this.containmentBox.left,
					h: this.containmentBox.bottom - this.containmentBox.top
				};
			} else {	// chrome optimization bug
				sRect.x = 0.0;
				sRect.y = 0.0;
			}
			
			var screenS = this.calcIntersectionSquare(selfRect,sRect);
			weight += ( w * h - screenS ) * offScreenCoff;
			// check constraints
			if(cArr){
				for(var i in cArr){
					var c = cArr[i];
					var cS = this.calcIntersectionSquare(selfRect, {
						x: c.left,
						y: c.top,
						w: c.width,
						h: c.height
					});
					weight += cS * c.weight;
				}
			}
			
			return weight;
		},
		
		calcIntersectionSquare: function(r1, r2){
			var left = Math.max(r1.x, r2.x);
			var top = Math.max(r1.y, r2.y);
			var right = Math.min(r1.x + r1.w, r2.x + r2.w);
			var bottom = Math.min(r1.y + r1.h, r2.y + r2.h);
			if(right < left || bottom < top){
				return 0;
			}
			return (right - left) * (bottom - top);
		},
		
		removeSvgCallout: function(target){
			if(!JSO().isNull(target.calloutElt)){
				target.calloutElt.remove();
				target.calloutElt = undefined;
			}
		},
		
		updateSvgCallouts: function(){
			// calculate SVG bound rect
			var minPt = {
				x: this.rect.x, 
				y: this.rect.y
			};
			var maxPt = {
				x: this.rect.x + this.rect.w, 
				y: this.rect.y + this.rect.h
			};
			
			for(var i in this.targets){
				var t = this.targets[i];
				minPt.x = Math.min(minPt.x, t.pt.x);
				minPt.y = Math.min(minPt.y, t.pt.y);
				maxPt.x = Math.max(maxPt.x, t.pt.x);
				maxPt.y = Math.max(maxPt.y, t.pt.y);
			}
			
			// update svg canvas
			var leftOffset = minPt.x - this.rect.x;
			var topOffset = minPt.y - this.rect.y;
			var svgWidth = maxPt.x - minPt.x;
			var svgHeight = maxPt.y - minPt.y;
			
			this.getElement().find('svg').css({
				left: leftOffset,
				top: topOffset,
				position: 'absolute'
			});
			this.svgContainer.attr('width', svgWidth);
			this.svgContainer.attr('height', svgHeight);
			
			// update callouts
			var sideOffset = 10;
			var minWdist = 20;
			for(var i in this.targets){
				var t = this.targets[i];
				
				// choose other two points to draw callout
				var side = null;
				if(t.pt.x < this.rect.x){
					if(t.pt.y < this.rect.y){  
						// left top corner
						if(this.rect.x - t.pt.x > this.rect.y - t.pt.y){
							side = 'left';
						} else {
							side = 'top'
						}
					} else if(t.pt.y > this.rect.y + this.rect.h){
						// left bottom corner
						if(this.rect.x - t.pt.x > t.pt.y - (this.rect.y + this.rect.h)){
							side = 'left';
						} else {
							side = 'bottom'
						}
					} else {
						// left side
						side = 'left';
					}
				} else if(t.pt.x > this.rect.x + this.rect.w){
					if(t.pt.y < this.rect.y){  
						// right top corner
						if(t.pt.x - (this.rect.x + this.rect.w) > this.rect.y - t.pt.y){
							side = 'right';
						} else {
							side = 'top'
						}
					} else if(t.pt.y > this.rect.y + this.rect.h){
						// right bottom corner
						if(t.pt.x - (this.rect.x + this.rect.w) > t.pt.y - (this.rect.y + this.rect.h)){
							side = 'right';
						} else {
							side = 'bottom'
						}
					} else {
						// right side
						side = 'right';
					}
					
				} else { // between left and right
					if(t.pt.y < this.rect.y){  
						// top side
						side = 'top';
					} else if(t.pt.y > this.rect.y + this.rect.h){
						// bottom size
						side = 'bottom';
					} else {
						// middle
					}
				}
				
				var pt1 = {x: 0, y: 0}, 
					pt2 = {x: 0, y: 0};
				var gradientId = null;
				if(side == 'top'){
					var wDist = (this.rect.y - t.pt.y) / 2;
					if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.x = t.pt.x - wDist / 2;
					pt1.y = this.rect.y;
					if(pt1.x < this.rect.x + sideOffset){
						pt1.x = this.rect.x + sideOffset;
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.x = pt1.x + wDist;
					pt2.y = pt1.y;
					if(pt2.x > this.rect.x + this.rect.w - sideOffset){
						pt2.x = this.rect.x + this.rect.w - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.x = pt2.x - wDist;  
					}
					gradientId = this.topGradientId;
				} else if(side == 'bottom'){
					var wDist = (t.pt.y - (this.rect.y + this.rect.h)) / 2;
					if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.x = t.pt.x - wDist / 2;
					pt1.y = this.rect.y + this.rect.h - 2;
					if(pt1.x < this.rect.x + sideOffset){
						pt1.x = this.rect.x + sideOffset;
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.x = pt1.x + wDist;
					pt2.y = pt1.y;
					if(pt2.x > this.rect.x + this.rect.w - sideOffset){
						pt2.x = this.rect.x + this.rect.w - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.x = pt2.x - wDist;  
					}
					gradientId = this.bottomGradientId;
				} else if(side == 'left'){
					var wDist = (this.rect.x - t.pt.x) / 2;
					if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.y = t.pt.y - wDist / 2;
					pt1.x = this.rect.x;
					if(pt1.y < this.rect.y + sideOffset){
						pt1.y = this.rect.y + sideOffset;
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.y = pt1.y + wDist;
					pt2.x = pt1.x;
					if(pt2.y > this.rect.y + this.rect.h - sideOffset){
						pt2.y = this.rect.y + this.rect.h - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.y = pt2.y - wDist;  
					}
					gradientId = this.leftGradientId;
				} else if(side == 'right'){
					var wDist = (t.pt.x - (this.rect.x + this.rect.w)) / 2;
					if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.y = t.pt.y - wDist / 2;
					pt1.x = this.rect.x + this.rect.w - 2;
					if(pt1.y < this.rect.y + sideOffset){
						pt1.y = this.rect.y + sideOffset
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.y = pt1.y + wDist;
					pt2.x = pt1.x;
					if(pt2.y > this.rect.y + this.rect.h - sideOffset){
						pt2.y = this.rect.y + this.rect.h - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.y = pt2.y - wDist;  
					}
					gradientId = this.rightGradientId;
				} else {
					// no callout
					this.removeSvgCallout(t);
					return;
				}
				
				
				if(JSO().isNull(t.calloutElt)){
					t.calloutElt = this.svgContainer.append('polyline');
				}
				
				var pointsStr = '' + (pt1.x - minPt.x) + ',' + (pt1.y - minPt.y)+ ' ' + (t.pt.x - minPt.x) + ',' + (t.pt.y - minPt.y) + ' ' + (pt2.x - minPt.x) + ',' + (pt2.y - minPt.y);
				t.calloutElt.attr('points', pointsStr);
				t.calloutElt.style('fill', 'url(#'+gradientId+')');

			}
			this.svgContainer.attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
		},
		
		
		close: function(){
			this.hide();
		},
		
		hideModalBackground: function(){
			var self = this;
			this.modalBack.fadeOut(function(){
				self.modalBack.remove();
				self.modalBack = null;
			});
		},
		
		hide: function(bCanceled){
			var self = this;
			if(this.frozen){
				return;
			}
			for(var i in this.toolManager.visibleInstances){
				if(this.toolManager.visibleInstances[i] == this){
					this.toolManager.visibleInstances.splice(i, 1);
					break;
				}
			}
			this.getElement().animate({
				opacity: 0
			}, 100, function(){
				self.visible = false;
				self.getElement().css({
					'visibility': 'hidden'
				});
				self.embeddedWidget.onHide(bCanceled);
				if(!JSO().isNull(self.onHide)){
					self.onHide(bCanceled);
				}
				if(self.options.hideInterval > 0){
					// unbind handlers
					self.params.target.selector.unbind({
						mouseover: self.trackProcs.over,
						mouseout: self.trackProcs.out
					});
					if(self.params.handle && self.params.handle.selector){
						self.params.handle.selector.unbind({
							mouseover: self.trackProcs.over,
							mouseout: self.trackProcs.out
						});
					}
				}
			});
			
			if(this.options.modal){
				this.hideModalBackground();
			}
			
			this.publish('toolHide', this.params);
		},
		
		getToolId: function(){
			return this.toolId;
		},
		
		isVisible: function(){
			return this.visible;
		},
		
		setData: function(data){
			this.embeddedWidget.setData(data);
		},
		
		updateBehavior: function(b){
//				debugger;
		},
		
		getClientContainer: function(){
			return this.clientContainer;
		},
		
		setFocus: function(){
			this.embeddedWidget.setFocus();
		},
		
		freeze: function(b){
			var self = this;
			if(JSO().isNull(b)){
				b = true;
			}
			this.frozen = b;
			if(!this.frozen && !self.isMouseInside){
				if(this.options.hideInterval > 0){
					JSO().defer(function(){
						self.close();
					}, self.options.hideInterval, '_toolHideInterval_');
				}
			}
		}
	}
});