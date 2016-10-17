JSB({
	name:'Antiplag.DocAreaView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.SplitLayoutManager'],
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
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
						options: {document: this.document}
					},
					analyticsView: {
						jsb: 'Antiplag.AnalyticsView',
						options: {document: this.document}
					}
				}
			});
			
			this.append(this.layoutManager);
		}
	},
	
	server: {
		
	}
});