{
	$name: 'JSB.Workspace.EntryRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$require: ['JSB.Widgets.PrimitiveEditor'], 

	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('entryRenderer');
			$jsb.loadCss('EntryRenderer.css');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.attr('title', entry.getName());
			
			if(this.options.editable){
				this.editor = new PrimitiveEditor(JSB.merge({
					mode:'inplace',
					dblclick: false,
				}, opts));
				this.editor.setData(entry.getName());
				this.editor.addClass('title');
				this.append(this.editor);
			} else {
				this.append(this.$('<div class="title"></div>').text(entry.getName()));
			}
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender == entry){
					$this.update();
				}
			});
		},
		
		update: function(){
			this.attr('title', this.object.getName());
			if(this.editor){
				this.editor.setData(this.object.getName());
			} else {
				this.find('> .title').text(this.object.getName());
			}
		},
		
		beginEdit: function(){
			if(this.editor){
				this.editor.beginEdit();
			}
		},
		
		getEntry: function(){
			return this.object;
		}
	}
}