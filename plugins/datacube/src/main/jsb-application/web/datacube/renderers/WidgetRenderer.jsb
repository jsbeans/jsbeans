{
	$name: 'DataCube.Renderers.WidgetRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: ['JSB.Widgets.RendererRepository',
	           'DataCube.Widgets.WidgetRegistry',
	           'css:WidgetRenderer.css'],
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			//opts.editable = false;
			$base(entry, opts);
			this.addClass('widgetRenderer');
			
			if(opts.showDashboard){
				this.server().getDashboard(entry, function(dashboardEntry){
					$this.append('<div class="leftParen">(</div>');
					$this.append(RendererRepository.createRendererFor(dashboardEntry).getElement());
					$this.append('<div class="rightParen">)</div>');
				});
			}
			
			this.refresh();
		},
		
		refresh: function(){
			$this.server().getIcon($this.getEntry(), function(icon){
				$this.icon.css('background-image', 'url(' + icon + ')');
			});
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.Widget');
		},
		
		getDashboard: function(entry){
			return entry.getWorkspace().entry(entry.getParentId());
		},
		
		getIcon: function(entry){
			var ctx = entry.getContext();
			var iconStr = ctx.find('common icon').value();
			if(iconStr && iconStr.length > 0){
				return iconStr;
			}
			return WidgetRegistry.getItemAttr(entry.getWidgetType(), 'icon');
		}
	}
}