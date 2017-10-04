{
	$name: 'DataCube.WidgetNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('WidgetNode.css');
			this.addClass('widgetNode');
		}
	}
}