/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2020
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2020гг.
 */

{
	$name:'JSB.Widgets.ToolManager',
	$require: {
		JQuery: 'JQuery', 
		ToolWrapper: 'JSB.Widgets.ToolWrapper',
		MessageTool: 'JSB.Widgets.MessageTool',
		ListTool: 'JSB.Widgets.DroplistTool',
		ListLazyLoadTool: 'JSB.Widgets.DroplistLazyLoadTool',
		TreeTool: 'JSB.Widgets.DropTreeTool',
		WidgetTool: 'JSB.Widgets.WidgetTool',
		Tooltip: 'JSB.Widgets.Tooltip'
	},
	$client: {
		$require: ['css:toolManager.css'],
		$singleton: true,
		$constructor: function(){
			$base();
			var self = this;
			this.tools = {};
			this.visibleInstances = [];
			this.subscribe('tool');
			
			// create tool area
			JSB().deferUntil(function(){
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
			
			if( JSB().isNull(toolJso)){
				throw 'ToolManager.registerTool: Tool object has not been specified';
			}
			if(JSB().isNull(toolId)){
				throw 'ToolManager.registerTool: Invalid toolId specified';
			}
			if(!(toolJso instanceof JSB)){
				throw 'ToolManager.registerTool: Tool object being registered has invalid type';
			}
			
			if(!JSB().isNull(this.tools[toolId])) {
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
			if(JSB().isNull(self.visibleInstances) || self.visibleInstances.length == 0){
				return;
			}
			for(var i = self.visibleInstances.length - 1; i >= 0; i--){
				var inst = self.visibleInstances[i];
				if( inst.isHideByOuterClick() ){
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
				if(inst.isHideByEsc()){
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
				id: '_jsb_messageTool',
				cmd: 'show',
				data: params,
				scope: params.scope,
				target: params.target,
				constraints: params.constraints,
				callback: params.callback,
				toolOpts: params.toolOpts
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
			if(JSB().isFunction(scope)){
				scope = scope.call(this);
				return this.resolveScope(scope);
			}
			if(JSB().isString(scope)){
				scope = this.$(scope);
			}
			if(JSB().isInstanceOf(scope, 'JSB.Widgets.Control')){
				scope = scope.getElement();
			}
			return scope;
		},
		
		activate: function(params){
			var self = this;
			var scope = this.resolveScope(params.scope);
			var toolEntry = this.tools[params.id];
			toolEntry.toolOpts = params.toolOpts;

			if(JSB().isNull(toolEntry)){
				return;
			}

			if(params.cmd == 'show'){
				var exclusive = JSB.isDefined(params.exclusive) ? params.exclusive : (toolEntry.wrapperOpts && toolEntry.wrapperOpts.exclusive)
				// perform exclusive logic
				if(exclusive){
					// hide all subscopes
					for(var i = self.visibleInstances.length - 1; i >= 0; i--){
						var inst = self.visibleInstances[i];
						if(JSB().isString(exclusive)){
							if(JSB().isString(inst.options.exclusive) && inst.options.exclusive == exclusive){
								inst.hide();
							}
						} else if(exclusive && (JSB().isNull(scope) || self.isSubScopeOf(this.resolveScope(inst.getScope()), scope))){
							inst.hide();
						}
					}
				}
			}
			
			// check for existing instances
			var chosenInstance = null;
			for(var i in toolEntry.instances){
				var inst = toolEntry.instances[i];
				if((!inst.isVisible() || params.cmd == 'update') && (!params.bind || inst.options.bind == params.bind)){
					
					chosenInstance = inst;
					break;
				}
			}
			
			if(JSB().isNull(chosenInstance)){
				// create new instance
				var cls = toolEntry.jso.getClass();
				var obj = new cls(toolEntry.toolOpts);
				
				var oddWrapperOpts = {};
				if(params.bind){
					oddWrapperOpts.bind = params.bind;
				}
				if(params.cssClass){
					oddWrapperOpts.cssClass = params.cssClass;
				}
				if(JSB.isDefined(params.hideByOuterClick)){
					oddWrapperOpts.hideByOuterClick = params.hideByOuterClick;
				}
				if(JSB.isDefined(params.hideByEsc)){
					oddWrapperOpts.hideByEsc = params.hideByEsc;
				}
				if(JSB.isDefined(params.exclusive)){
					oddWrapperOpts.exclusive = params.exclusive;
				}

				var wrapperOpts = JSB.merge({}, toolEntry.wrapperOpts, oddWrapperOpts);
				chosenInstance = new ToolWrapper(params.id, self, obj, wrapperOpts);
				toolEntry.instances.push(chosenInstance);
			}
			
			// apply tool class
			if(params.key){
				chosenInstance.embeddedWidget.getElement().attr('key', params.key);
			} else {
				chosenInstance.embeddedWidget.getElement().removeAttr('key');
			}
			
			// set data
			chosenInstance.setData(params);
			chosenInstance.compCntr = 0;
			chosenInstance.prepareShow = true;
			
			function readyToShow(){
				var bFalse = false;
				if(JSB.isNull(chosenInstance.oldW)){
					chosenInstance.oldW = chosenInstance.getElement().outerWidth(true);
					bFalse = true;
				}
				if(JSB().isNull(chosenInstance.oldH)){
					chosenInstance.oldH = chosenInstance.getElement().outerHeight(true);
					bFalse = true;
				}
				if(bFalse){
					return false;
				}
				if(chosenInstance.getElement().outerWidth(true) != chosenInstance.oldW || chosenInstance.getElement().outerHeight(true) != chosenInstance.oldH){
					chosenInstance.oldW = chosenInstance.getElement().outerWidth(true);
					chosenInstance.oldH = chosenInstance.getElement().outerHeight(true);
					chosenInstance.compCntr = 0;
					return false;
				} else {
					chosenInstance.compCntr++;
					if(chosenInstance.compCntr < 20){
						return false;
					}
				}
				if( chosenInstance.getElement().width() == 0 || chosenInstance.getElement().height() == 0 ){
					return false;
				}
				return true;
			}
			
			if((params && params.showImmediately) || (params && params.target && params.target.dock) || readyToShow()){
				if(!chosenInstance.prepareShow){
					return;
				}
				JSB.defer(()=>{
					chosenInstance.show(JSB.merge({
						scope: scope 
					}, params));
				});
			} else {
				JSB().deferUntil(function(){
					if(!chosenInstance.prepareShow){
						return;
					}
					chosenInstance.show(JSB.merge({
						scope: scope 
					}, params));
				},function(){
					return readyToShow();
				}, 15);
			}
			
			return chosenInstance;
		},
		
		onMessage: function(sender, msg, params){
			var self = this;
			if(JSB().isNull(params)){
				return;
			}
			if(msg != 'tool'){
				throw 'ToolManager.onMessage: Wrong message received';
			}
			if(JSB().isNull(params.cmd) || JSB().isNull(params.id)){
				throw 'ToolManager.onMessage: Message malformed';
			}
			
			// find entry
			if(JSB().isNull(sender) || JSB().isNull(sender.getJsb()) || !sender.getJsb().isSubclassOf('JSB.Widgets.Control')){
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
				if(!JSB().isNull(scope.getElement)){
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