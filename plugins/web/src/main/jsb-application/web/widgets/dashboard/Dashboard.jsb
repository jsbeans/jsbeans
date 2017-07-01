{
	$name: 'JSB.Widgets.Dashboard.Dashboard',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['JSB.Widgets.Dashboard.Container',
		           'JSB.Widgets.Dashboard.Placeholder'],
		           
	    placeholder: null,
	    container: null,
	    
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Dashboard.css');
			this.addClass('_jsb_dashboard');
			
			// setup initial placeholder
			this.placeholder = new Placeholder(JSB.merge({
				emptyText: opts.emptyText,
				onDragDrop: opts.onDragDrop,
				onDragAccept: opts.onDragAccept,
				onDropWidget: function(widget){
					$this.placeWidget(widget);
				}
			}, opts.placeholder || {}));
			this.append(this.placeholder);
			this.placeholder.getElement().css({
				width: '100%',
				height: '100%'
			});
		},
		
		placeWidget: function(widget){
			if(!this.container){
				this.container = new Container($this.options);
				this.append(this.container);
				this.placeholder.getElement().css('display', 'none');
			}
			this.container.addWidget(widget);
		}
	}
}