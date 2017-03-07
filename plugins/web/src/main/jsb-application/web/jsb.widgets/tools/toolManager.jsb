{
	name:'JSB.Widgets.ToolManager',
	require: {
		'JQuery': 'JQuery', 
		'JSB.Widgets.EventBus': 'EventBus',
		'JSB.Widgets.ToolWrapper': 'ToolWrapper',
		'JSB.Widgets.MessageTool': 'MessageTool',
		'JSB.Widgets.WidgetTool': 'WidgetTool',
		'JSB.Widgets.Tooltip':'Tooltip'
	},
	client: {
		singleton: true,
		constructor: function(){
			var self = this;
			this.loadCss('toolManager.css');
			this.tools = {};
			this.visibleInstances = [];
			EventBus.jsb.getInstance().subscribe(this, 'tool');
			
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
				var chosenInstance = new ToolWrapper(toolId, self, obj, wrapOpts);
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
			if(JSB.isNull(params.scope)){
				params.scope = this;
			}
			if(!JSB.isNull(scope)){
				params.scope = scope;
			}
			return this.activate({
				id: '_dwp_messageTool',
				cmd: 'show',
				data: params,
				scope: params.scope,
				target: params.target,
				constraints: params.constraints,
				callback: params.callback
			});

		},
		
		showTip: function(params) {
			if(JSB.isNull(params.scope)){
				params.scope = this;
			}
			return this.activate({
				id: '_dwp_standardTooltip',
				cmd: 'show',
				data: params.data,
				scope: params.scope,
				target: params.target,
				constraints: params.constraints,
				callback: params.callback
			});
		},
		
		showWidget: function(params){
			if(JSB.isNull(params.scope)){
				params.scope = this;
			}
			
			return this.activate(JSB.merge({
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
				chosenInstance = new ToolWrapper(params.id, self, obj, JSO().merge(toolEntry.wrapperOpts, params));
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
}