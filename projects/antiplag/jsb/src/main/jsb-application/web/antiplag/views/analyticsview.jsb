JSB({
	name:'Antiplag.AnalyticsView',
	parent: 'JSB.Widgets.Widget',
	require: [],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('analyticsView');
			this.loadCss('analyticsview.css');
			
		}
		
	},
	
	server: {
		
	}
});