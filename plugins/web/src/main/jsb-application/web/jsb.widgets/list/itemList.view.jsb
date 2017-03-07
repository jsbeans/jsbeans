{
	name:'JSB.Widgets.ItemList.View',
	parent: 'JSB.Widgets.Actor',
	require: {},
	
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			JSB.merge(true, this.options, opts);
		},
		
		options: {},
		container: null,
		
		getContainer: function(){
			return this.container;
		},
		
		activate: function(c){
			this.container = c;
			this.container.css({
				height: ''
			});
		},
		
		deactivate: function(){
			this.container = null;
		},
		
		isActive: function(){
			return this.container !== null;
		},
		
		update: function(){}
	}
}