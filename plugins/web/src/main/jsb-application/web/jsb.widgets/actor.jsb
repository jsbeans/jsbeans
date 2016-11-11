JSB({
	name:'JSB.Widgets.Actor',
	require: ['JSB.Widgets.AjaxProvider'],
	client: {
		constructor: function(opts){
			this.base(opts);
		},
		
		eventBus: null,
		msgMap: {},
		
		/* methods */
		onMessage: function(sender, msg, params){
			
		},
		
		subscribe: function(msg, callback){
			var self = this;
			function _subscribe(msg, callback){
				
				if(JSO().isArray(msg)){
					for(var i in msg){
						self.eventBus.subscribe(self, msg[i], callback);
						self.msgMap[msg[i]] = true;
					}
				} else {
					self.eventBus.subscribe(self, msg, callback);
					self.msgMap[msg] = true;
				}
			} 
			
			if(!this.eventBus){
				JSO().lookupSingleton('JSB.Widgets.EventBus', function(obj){
					self.eventBus = obj;
					_subscribe(msg, callback);
				});
			} else {
				_subscribe(msg, callback);
			}
		},
		
		unsubscribe: function(msg){
			var self = this;
			if(!this.eventBus){
				return;
			}
			
			if(JSO().isArray(msg)){
				for(var i in msg){
					this.eventBus.unsubscribe(self, msg[i]);
					delete self.msgMap[msg[i]];
				}
			} else {
				this.eventBus.unsubscribe(self, msg);
				delete self.msgMap[msg];
			}
		},
		
		publish: function(msg, params){
			var self = this;
			if(!this.eventBus){
				JSO().lookupSingleton('JSB.Widgets.EventBus', function(obj){
					self.eventBus = obj;
					obj.publish(self, msg, params);
				})
			} else {
				self.eventBus.publish(self, msg, params);
			}
		},
		
		destroy: function(){
			// unsubscribe all
			var msgLst = [];
			for(var i in this.msgMap){
				msgLst.push(i);
			}
			
			var self = this;
			if(msgLst.length > 0){
				for(var i in msgLst){
					this.eventBus.unsubscribe(self, msgLst[i]);
					delete this.msgMap[msgLst[i]];
				}
				
			}
			this.base();
		},
		
		callbackAttr: function(proc){
			return JSO().callbackAttr(proc, this);
		}

		
	}
});