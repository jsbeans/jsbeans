JSB({
	name:'Antiplag.StorylineView',
	parent: 'JSB.Widgets.Widget',
	require: [],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('storylineView');
			this.loadCss('storylineview.css');
		}
		
	},
	
	server: {
		
	}
});