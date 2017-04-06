{
	$name: 'UserLogout',
	$parent: 'UserMenuItem',

	expose: {
		path: 'User/Menu',
		displayName: 'Выход',
		order: 1000,
		group: 'exit'
	},
	$client: {
		$constructor: function(){
		},
		execute: function(){
			var self = this;
			var serverBase = JSB().getProvider().getServerBase();
			JSB().getProvider().ajax(serverBase + 'logout', {mode: 'json'}, function(status, res){
				self.publish('userLogout');
			});
		}
	},
	
	$server: {}
}