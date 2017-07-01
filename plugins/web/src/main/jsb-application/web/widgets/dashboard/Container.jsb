{
	$name: 'JSB.Widgets.Dashboard.Container',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['JSB.Widgets.Dashboard.Placeholder',
		           'JSB.Widgets.WidgetContainer'],
		           
		widgetContainer: null,
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Container.css');
			this.addClass('_jsb_dashboardContainer');
			
			// create client container
			this.clientContainer = this.$('<div class="_jsb_clientContainer"></div>');
			this.append(this.clientContainer);

			// create placeholders
			var phArr = ['left', 'top', 'right', 'bottom'];
			
			for(var i = 0; i < phArr.length; i++){
				var phType = phArr[i];
				(function(phType){
					var ph = new Placeholder({
						onDragAccept: function(d){
							if($this.options.onDragAccept(d)){
								return true;
							}
							return false;
						},
						onDragDrop: $this.options.onDragDrop,
						onDropWidget: function(widget){
							
						}
					});
					ph.addClass(phType);
					$this.append(ph);
				})(phType);
			}
		},
		
		addWidget: function(widget){
			// create wodgetContainer if necessary
			if(!this.widgetContainer){
				this.widgetContainer = new WidgetContainer({
					caption: true
				});
				this.clientContainer.append(this.widgetContainer.getElement());
			}
			this.widgetContainer.attachWidget(widget);
		}
	}
}