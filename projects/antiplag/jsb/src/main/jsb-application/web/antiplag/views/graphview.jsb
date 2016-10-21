JSB({
	name:'Antiplag.GraphView',
	parent: 'JSB.Widgets.Widget',
	require: [],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('graphView');
			this.loadCss('graphview.css');
		}
		
	},
	
	server: {
		
	}
});