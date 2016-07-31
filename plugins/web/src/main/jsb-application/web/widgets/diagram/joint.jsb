JSB({
	name: 'JSB.Widgets.Diagram.Joint',
	parent: 'JSB.Widgets.Actor',
	require: {},
	
	client: {
		link: null,
		
		options: {
		},
		
		constructor: function(link, opts){
			var self = this;
			this.base();
			this.link = link;
			JSB().merge(true, this.options, opts);
		},
		
		getLink: function(){
			return this.link;
		},
		
		getPosition: function(){
			if(!this.options.position || !JSB().isFunction(this.options.position)){
				return null;
			}
			return this.options.position.call(this);
		}
		
	},
	
	server: {}
});