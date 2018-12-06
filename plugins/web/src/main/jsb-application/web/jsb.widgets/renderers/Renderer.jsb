{
	$name: 'JSB.Widgets.Renderer',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['css:Renderer.css'],
		$constructor: function(obj, opts){
			this.object = obj;
			$base(opts);
			this.addClass('renderer');
		},
		
		getObject: function(){
			return this.object;
		}
	}
}