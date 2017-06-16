{
	$name: 'JSB.Workspace.Browser',
	$parent: 'JSB.Widgets.Widget',
	
	$sync: {
		updateCheckInterval: 0
	},
	
	explorer: null,
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('Browser.css');
			this.addClass('workspaceBrowser');
		},
		
		bindExplorer: function(e, callback){
			this.explorer = e;
			this.server().bindExplorer(w, function(){
				$this.refresh();
				
				if(callback){
					callback.call($this);
				}
			});
		},
		
		refresh: function(){},
	},
	
	$server: {
		$constructor: function(){
			$base();
		},
		
		bindExplorer: function(e){
			if(!e){
				return;
			}
			$this.explorer = e;
		}
		
	}
}