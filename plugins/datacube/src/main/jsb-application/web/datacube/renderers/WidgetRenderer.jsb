{
	$name: 'DataCube.Renderers.WidgetRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: ['JSB.Widgets.RendererRepository','DataCube.Widgets.WidgetRegistry'],
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			//opts.editable = false;
			$base(entry, opts);
			this.addClass('widgetRenderer');
			$jsb.loadCss('WidgetRenderer.css');
			
			if(opts.showDashboard){
				this.server().getDashboard(entry, function(dashboardEntry){
					$this.append('<div class="leftParen">(</div>');
					$this.append(RendererRepository.createRendererFor(dashboardEntry).getElement());
					$this.append('<div class="rightParen">)</div>');
				});
			}
			
			WidgetRegistry.lookupWidgetAttr(entry.getWidgetType(), 'icon', function(icon){
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
		}
	}
}