{
	$name: 'JSB.Workspace.FolderNode',
	$parent: 'JSB.Workspace.ExplorerNode',
	$require: {
		Editor: 'JSB.Widgets.PrimitiveEditor',
		Button: 'JSB.Widgets.Button'
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('FolderNode.css');
			this.addClass('folderNode');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.editor = new Editor({
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
			var editBtn = new Button({
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
	
}