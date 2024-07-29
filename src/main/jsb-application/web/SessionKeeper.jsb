{
	$name: 'JSB.SessionKeeper',
	$singleton: true,
	
	$client: {
		_paused: false,
		_interval: 60000,
		
		$constructor: function(opts){
			$base(opts);
			
			this.server().isAuthenticated((res)=>{
				if(!res){
					return;
				}
				// handle session
				function _doCheck(){
					if($this._paused){
						JSB.defer(_doCheck, $this._interval);
					} else {
						var pUrl = JSB.getProvider().getServerBase() + 'login.jsb';
						JSB.getProvider().xhr({
							url: pUrl,
							timeout: 100000,
							silent: true,
							success: function(data, status, xhr){
								JSB.defer(_doCheck, $this._interval);
							},
							error: function(xhr, status, err){
								JSB.defer(_doCheck, $this._interval);
/*								if($this._paused){
									JSB.defer(_doCheck, $this._interval);
								} else {
									var curUrl = window.location.href;
									window.location.href = pUrl + '?redirectURI=' + encodeURIComponent(curUrl);
								}*/
							}
						});
					}
				}
				
				this.subscribe('JSB.AjaxProvider.xhrStatus', (sender, msg, status)=>{
					if(status == 200){
						if($this._paused){
							$this._paused = false;
						}
					} else {
						if($this._paused){
							return;
						}
						$this._paused = true;
					}
				});
				
				_doCheck();
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