{
	$name: 'DataCube.Renderers.WidgetRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: 'JSB.Widgets.RendererRepository',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			opts.editable = false;
			$base(entry, opts);
			this.addClass('widgetRenderer');
			this.loadCss('WidgetRenderer.css');
			
			if(opts.showDashboard){
				this.server().getDashboard(entry, function(dashboardEntry){
					$this.append('<div class="leftParen">(</div>');
					$this.append(RendererRepository.createRendererFor(dashboardEntry).getElement());
					$this.append('<div class="rightParen">)</div>');
				});
			}
			
			JSB.lookup(entry.getWidgetType(), function(wCls){
				var expose = wCls.jsb.getDescriptor().$expose;
				if(expose){
                    var icon = expose.icon || expose.thumb;
                    $this.icon.css('background-image', 'url(' + icon + ')');
                }
			});
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.Widget');
		},
		
		getDashboard: function(entry){
			return entry.workspace.entry(entry.parent);
		}
	}
}