JSB({
	name: 'Ontoed.MessageRenderer',
	parent: 'Ontoed.Renderer',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('messageRenderer');
			this.loadCss('messagerenderer.css');
			
			this.icon = this.$('<div class="icon"></div>');
			this.value = this.$('<div class="value"></div>');
			this.append(this.icon).append(this.value);
			this.value.append(opts.message);
		}
		
		
	}
});
