{
	$name: 'DataCube.Widgets.WidgetRegistry',
	$parent: 'JSB.Widgets.Registry',
	$singleton: true,
	
	$server: {
		$constructor: function(){
			$base();
			JSB.onLoad(function(){
				if(this.isSubclassOf('DataCube.Widgets.Widget') && JSB.isDefined(this.$expose)){
					$this.register(this);
				}
			});
		}
	}
}