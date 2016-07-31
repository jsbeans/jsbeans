JSB({
	name: 'Ontoed.MissingOntologyNode',
	parent: 'Ontoed.WorkspaceNode',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('missingOntologyNode');
			
			this.icon = this.$('<div class="icon"><div class="warnIcon"></div></div>');
			this.append(this.icon);
			
			// generate user-friendly name from uri
			this.uri = this.descriptor.iri.replace(/^(http(s)?\:\/\/)?(www\.)?/, '');

			this.title = this.$('<div class="title"></title>').text(this.uri).attr('title', 'Онтология отсутствует в рабочем пространстве');
			this.append(this.title);
			
			this.append('<div class="message"><span>&mdash;</span>онтология отсутствует</div>');
		},
		
		getUri: function(){
			return this.uri;
		}
	}
});
