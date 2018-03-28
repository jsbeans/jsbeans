{
	$name: 'JSB.Workspace.SearchEditor',
	$parent: 'JSB.Widgets.Control',
	$require: {
		'Editor': 'JSB.Widgets.PrimitiveEditor'
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('searcheditor.css');
			this.addClass('searchEditor');
			
			this.editor = new Editor({
				onChange: function(txt){
					if(txt && txt.length > 0){
						$this.addClass('filled');
					} else {
						$this.removeClass('filled');
					}
					if(self.options.onChange){
						JSB.defer(function(){
							self.options.onChange.call(self, txt);
						}, 100, '_onChange' + self.getId());
					}
				}
			});
			this.append(this.editor);
			
			this.append(`#dot
				<div class="searchIcon"></div>
				<div class="clearBtn" title="Очистить поисковую строку"></div>
			`);
			
			this.find('.clearBtn').click(function(){
				self.clear();
			});
		},
		
		clear: function(){
			this.editor.setData('');
			$this.removeClass('filled');
			if(this.options.onChange){
				this.options.onChange.call(this, '');
			}
		}
	}
}