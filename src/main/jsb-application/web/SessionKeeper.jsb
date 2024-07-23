{
	$name: 'JSB.SessionKeeper',
	$singleton: true,
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			this.server().isAuthenticated((res)=>{
				if(!res){
					return;
				}
				// handle session
				function _doCheck(){
					var pUrl = JSB.getProvider().getServerBase() + 'login.jsb';
					JSB.getProvider().xhr({
						url: pUrl,
						timeout: 100000,
						success: function(data, status, xhr){
							JSB.defer(_doCheck, 60000);
						},
						error: function(xhr, status, err){
							JSB.defer(_doCheck, 60000);
							/*
							var curUrl = window.location.href;
							window.location.href = pUrl + '?redirectURI=' + encodeURIComponent(curUrl);
							*/
						}
					});
				}
				/*_doCheck();*/
			})
		}
	},
	
	$server: {
		$require: ['JSB.Auth'],
		
		isAuthenticated: function(){
			return Auth.isSecurityEnabled() && Auth.isAuthenticated();
		}
	}
}