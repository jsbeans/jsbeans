{
	$name: 'JSB.Widgets.Renderer',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$constructor: function(obj, opts){
			this.object = obj;
			$base(opts);
			this.addClass('renderer');
			this.loadCss('Renderer.css');
		},
		
		getObject: function(){
			return this.object;
		}
	}
}