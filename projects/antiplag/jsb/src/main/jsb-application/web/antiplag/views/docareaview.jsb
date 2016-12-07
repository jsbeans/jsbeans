JSB({
	name:'Antiplag.DocAreaView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.SplitLayoutManager'],
	
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('docAreaView');
			this.loadCss('docareaview.css');
			this.document = opts.document;
			
			this.layoutManager = new JSB.Widgets.SplitLayoutManager({
				defaultLayout: 'doc',
				layouts: {
					doc: {
						split: 'vertical',
						panes: [{
							minSize: 300,
							size: 0.5,
							widgets: 'documentView',
						},{
							minSize: 300,
							size: 0.5,
							widgets: 'analyticsView',
						}]
					}
				},
				
				widgets: {
					documentView: {
						jsb: 'Antiplag.DocumentView',
						options: opts
					},
					analyticsView: {
						jsb: 'Antiplag.AnalyticsView',
						options: opts
					}
				}
			});
			
			this.append(this.layoutManager);
		}
	},
	
	server: {
		
	}
});