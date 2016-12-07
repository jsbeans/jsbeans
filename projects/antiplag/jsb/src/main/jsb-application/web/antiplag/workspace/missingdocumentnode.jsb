JSB({
	name: 'Antiplag.MissingDocumentNode',
	parent: 'Antiplag.WorkspaceNode',
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('missingDocumentNode');
			
			this.icon = this.$('<div class="icon"><div class="warnIcon"></div></div>');
			this.append(this.icon);
			
			// generate user-friendly name from uri
			this.uri = this.descriptor.iri.replace(/^(http(s)?\:\/\/)?(www\.)?/, '');

			this.title = this.$('<div class="title"></title>').text(this.uri).attr('title', 'Документ отсутствует в рабочем пространстве');
			this.append(this.title);
			
			this.append('<div class="message"><span>&mdash;</span>документ отсутствует</div>');
		},
		
		getUri: function(){
			return this.uri;
		}
	}
});
