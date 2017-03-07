/*
{
	name:'JSB.Widgets.AjaxProvider',
	parent: 'JSB.AjaxProvider',
	singleton: true,
	require: {
		'JSB.Widgets.NetworkIndicator': 'NetworkIndicator'
	},
	client: {
		constructor: function(){
			this.curDeferTimeout = this.options.minDeferTimeout;
			var serverBase = JSB().getProvider().getServerBase();
			$base();
			this.setServerBase(serverBase);
		},

		options: {
			minDeferTimeout: 5000,	// 5 sec
			maxDeferTimeout: 60000	// 60 sec
		},
		ajax: function(url, params, callback){
			var self = this;
			if(this.crossDomain){
				this.xhr({
					url: url,
					data: params,
					dataType: 'jsonp',
					timeout: 600000,	// 600 secs
					success: function(data, status, xhr){
						if(self.indicatorEnabled){
							self.curDeferTimeout = self.options.minDeferTimeout;
							NetworkIndicator.jsb.getInstance().enable(false);
						}
						var respObj = data;
						self.decodeObject(respObj);
						callback('success', respObj);
					},
					error: function(xhr, status, err){
						if(xhr.status == 404 || xhr.status == 401){
							if(self.indicatorEnabled){
								self.curDeferTimeout = self.options.minDeferTimeout;
								NetworkIndicator.jsb.getInstance().enable(false);
							}
							callback(status, xhr);
						} else {
							self.indicatorEnabled = true;
							NetworkIndicator.jsb.getInstance().enable(true);
							self.curDeferTimeout *= 2;
							if(self.curDeferTimeout > self.options.maxDeferTimeout) {
								self.curDeferTimeout = self.options.maxDeferTimeout;
							}
							JSO().defer(function(){
								self.ajax(url, params, callback);
							}, self.curDeferTimeout);
						}
					}
				});

			} else {
				this.xhr({
					url: url,
					data: params,
					type: 'post',
					timeout: 60000,	// 60 secs
					success: function(data, status, xhr){
						if(self.indicatorEnabled){
							self.curDeferTimeout = self.options.minDeferTimeout;
							NetworkIndicator.jsb.getInstance().enable(false);
						}
						var respObj = eval('('+data+')');
						self.decodeObject(respObj);
						callback('success', respObj);
					},
					error: function(xhr, status, err){
						if(xhr.status == 404 || xhr.status == 401){
							if(self.indicatorEnabled){
								self.curDeferTimeout = self.options.minDeferTimeout;
								NetworkIndicator.jsb.getInstance().enable(false);
							}
							callback(status, xhr);
						} else {
							self.indicatorEnabled = true;
							NetworkIndicator.jsb.getInstance().enable(true);
							self.curDeferTimeout *= 2;
							if(self.curDeferTimeout > self.options.maxDeferTimeout) {
								self.curDeferTimeout = self.options.maxDeferTimeout;
							}
							JSO().defer(function(){
								self.ajax(url, params, callback);
							}, self.curDeferTimeout);
						}
					}
				});
			}
		}
	}
}
*/