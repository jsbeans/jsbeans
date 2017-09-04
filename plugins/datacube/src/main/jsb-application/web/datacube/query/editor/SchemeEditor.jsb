{
	$name: 'DataCube.Query.SchemeEditor',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Query.QuerySyntax'],
	
	$client: {
		$constructor: function(opts){
			$base();
			
			$this.schemeEntry = opts.schemeEntry;
			$this.queryScope = opts.queryScope;
			if($this.queryScope){
				$this.refresh();
			}
		},
		
		set: function(queryScope){
			$this.queryScope = queryScope;
			$this.refresh();
		},
		
		refresh: function(){
			$this.scheme = QuerySyntax.getSchema()[$this.schemeEntry];
			debugger;
		}
	},
	
	$server: {
		
	}
}