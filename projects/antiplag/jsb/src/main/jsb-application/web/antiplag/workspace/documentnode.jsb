JSB({
	name: 'Antiplag.DocumentNode',
	parent: 'Antiplag.WorkspaceNode',
	require: ['JSB.Widgets.Button'],
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentNode');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			this.icon.click(function(evt){
				if(self.options.onDblClick){
					self.options.onDblClick.call(self);
				}
			});
			
			var ontoName = this.descriptor.title || '(нет названия)';

			this.title = this.$('<div class="title"><span class="file"></span><span class="name"></span></title>').attr('title',ontoName);
			this.append(this.title);

			this.title.find('.name').text(ontoName);
			if(this.descriptor.file && this.descriptor.file.length > 0){
				this.title.find('.file').text(this.descriptor.file);
			} else {
				this.title.find('.file').addClass('hidden');
			}
			
			this.subtitle = this.$('<div class="subtitle"></div>').text(this.descriptor.name).attr('title', this.descriptor.name);
			this.append(this.subtitle);
			
			// add buttons
			var editBtn = new JSB.Widgets.Button({
				cssClass: 'roundButton btnEdit btn10',
				tooltip: 'Редактировать онтологию',
				onClick: function(evt){
					evt.stopPropagation();
					if(self.options.onDblClick){
						self.options.onDblClick.call(self);
					}
				}
			});
			this.append(editBtn);
			
			// generate user-friendly name from uri
			this.uri = this.descriptor.name.replace(/^(http(s)?\:\/\/)?(www\.)?/, '');;
			this.subtitle.text(this.uri);
			
			this.getElement().dblclick(function(){
				if(self.options.onDblClick){
					self.options.onDblClick.call(self);
				}
			});
		},
		
		getUri: function(){
			return this.uri;
		}
	}
});
