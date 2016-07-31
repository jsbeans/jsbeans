JSB({
	name: 'Ontoed.FolderNode',
	parent: 'Ontoed.WorkspaceNode',
	require: {
		'JSB.Widgets.PrimitiveEditor': 'Editor',
		'JSB.Widgets.Button': 'Button'
	},
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('folderNode');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.editor = new self.Editor({
				mode:'inplace',
				onValidate: function(val){
					return val && val.trim().length >= 3;
				},
				onChange: function(val, evt){
					if(self.descriptor.name == val){
						return;
					}
					if(self.options.onChangeName){
						self.options.onChangeName.call(self, self.descriptor.name, val.trim(), evt);
					}
				}
			});
			this.editor.setData(this.descriptor.name);
			this.append(this.editor);
			
			// add buttons
			var editBtn = new JSB.Widgets.Button({
				cssClass: 'roundButton btnEdit btn10',
				tooltip: 'Изменить название',
				onClick: function(evt){
					evt.stopPropagation();
					self.editor.beginEdit();
				}
			});
			this.append(editBtn);
/*			
			this.title = this.$('<span class="title"></span>').text(this.descriptor.name).attr('title',this.descriptor.name);
			this.append(this.title);
*/			
		},
		
		setName: function(name){
			this.descriptor.name = name;
			this.editor.setData(this.descriptor.name);
		}
		
	}
	
});
