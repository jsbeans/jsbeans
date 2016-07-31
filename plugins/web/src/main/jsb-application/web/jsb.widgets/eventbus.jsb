JSB({
	name:'JSB.Widgets.EventBus',
	client: {
		singleton: true,
		constructor: function(){
			this.subs = {};
			this.calls = {};
			this.emissions = {};
		},
		
		/* methods */
		subscribe: function(w, msg, callback){
			if(JSO().isNull(callback)){
				if(JSO().isNull(this.subs[msg])){
					this.subs[msg] = [];
				}
				this.subs[msg].push(w);
			} else {
				if(JSO().isNull(this.calls[msg])){
					this.calls[msg] = [];
				}
				this.calls[msg].push({c: callback, w: w});
			}
		},
		
		unsubscribe: function(w, msg){
			if(!msg){
				return;
			}
			if(!JSO().isNull(this.subs[msg])){
				var idxToRemove = [];
				var wArr = this.subs[msg];
				for(var i in wArr){
					if(wArr[i] == w){
						idxToRemove.push(i);
					}
				}
				for(var i in idxToRemove){
					wArr.splice(idxToRemove[i], 1);
				}
			}

			if(!JSO().isNull(this.calls[msg])){
				var idxToRemove = [];
				var wArr = this.calls[msg];
				for(var i in wArr){
					if(wArr[i].w == w){
						idxToRemove.push(i);
					}
				}
				for(var i in idxToRemove){
					wArr.splice(idxToRemove[i], 1);
				}
			}
		},

		
		publish: function(w, msg, params, callback){
			var self = this;
			var wList = this.subs[msg];
			if(JSO().isNull(callback)){
				if(!JSO().isNull(wList)){
					for(var i in wList){
						var tgt = wList[i];
						if(!JSO().isNull(tgt.onMessage)){
							tgt.onMessage(w, msg, params);
						}
					}
				}
				if(!JSO().isNull(this.calls[msg])){
					for(var i in this.calls[msg]) {
						var c = this.calls[msg][i];
						if(!JSO().isNull(c)){
							c.c(w, msg, params);
						}
					}
				}
			} else {
				var emissionUid = JSO().generateUid();
				self.emissions[emissionUid] = {
					startTime: new Date().getTime(),
					responseArr: [],
					cnt: 1
				};
				self.emissions[emissionUid].responseArr.length = wList.length;
				
				for(var i in wList){
					var tgt = wList[i];
					var willRespond = tgt.onMessage(w, msg, params, (function(idx){ return function(resp){
						self.emissions[emissionUid].responseArr[idx] = resp;
						self.emissions[emissionUid].cnt--;
						if(self.emissions[emissionUid].cnt == 0){
							callback(wList, self.emissions[emissionUid].responseArr);
							delete self.emissions[emissionUid];
						}
					}})(i));
					if(!willRespond){
						self.emissions[emissionUid].cnt--;
					}
				}
				self.emissions[emissionUid].cnt--;
				if(self.emissions[emissionUid].cnt == 0){
					callback(wList, self.emissions[emissionUid].responseArr);
					delete self.emissions[emissionUid];
				}
			}
		}

	}
});