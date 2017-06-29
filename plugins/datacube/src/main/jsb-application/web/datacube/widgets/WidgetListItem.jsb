{
	$name: 'JSB.DataCube.Widgets.WidgetListItem',
	$parent: 'JSB.Widgets.ListItem',
	
	$client: {
		descriptor: null,

		$constructor: function(opts, desc){
			$base(opts);
			this.loadCss('WidgetListItem.css');
			this.addClass('widgetListItem');
			this.descriptor = desc;
			this.attr('key', this.descriptor.jsb);
			
			this.append(`#dot
				<img class="icon" src="{{=$this.descriptor.thumb}}"></img>
				<div class="title">{{=$this.descriptor.name}}</div>
			`);
		}
	},
	
	$server: {}
}