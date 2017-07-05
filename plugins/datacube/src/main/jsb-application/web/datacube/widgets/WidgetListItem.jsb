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
			this.attr('title', this.descriptor.name);
			
			this.append(`#dot
				<img class="icon" src="{{=$this.descriptor.thumb}}"></img>
				<div class="title">{{=$this.descriptor.name}}</div>
			`);
			
			this.getElement().draggable({
				start: function(evt, ui){
					evt.originalEvent.preventDefault();
					evt.stopPropagation();
				},
				helper: function(evt, ui){
					this.draggingItems = [$this];
					
					// create drag container
					var helper = $this.$('<div class="dragHelper"></div>');
					helper.append($this.$('<div class="dragItem"></div>').append($this.getElement().clone()));
					return helper.get(0);
				},
				stop: function(evt, ui){
					
				},
				revert: false,
				scroll: false,
				zIndex: 100000,
				distance: 10,
				appendTo: 'body'
			});
		}
	},
	
	$server: {}
}