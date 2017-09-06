{
	$name: 'DataCube.Query.SchemeEditor',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Query.QuerySyntax', 'JSB.Widgets.Button'],
	
	$client: {
		$constructor: function(opts){
			$base();
			this.loadCss('SchemeEditor.css')
			this.addClass('schemeEditor');
			
			$this.schemeEntry = opts.schemeEntry;
			$this.queryScope = opts.queryScope;
			
			$this.container = $this.$('<div class="container"></div>');
			$this.append($this.container);
			
			$this.btnAdd = new Button({
				cssClass: 'roundButton btn10 btnCreate',
				tooltip: 'Добавить поле',
				onClick: function(){
				}
			});
			$this.append($this.btnAdd);
			
			if($this.queryScope){
				$this.refresh();
			}
		},
		
		set: function(queryScope){
			$this.queryScope = queryScope;
			$this.refresh();
		},
		
		refresh: function(){
			$this.getElement().empty();
			$this.scheme = QuerySyntax.getSchema()[$this.schemeEntry];
			$this.attr('etype', $this.scheme.expressionType);
			if($this.scheme.expressionType == 'ComplexObject'){
				
			}
			debugger;
		}
	},
	
	$server: {
		
	}
}