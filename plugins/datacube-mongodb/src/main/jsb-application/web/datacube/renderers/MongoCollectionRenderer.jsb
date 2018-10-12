{
	$name: 'DataCube.Renderers.MongoCollectionRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: 'JSB.Widgets.RendererRepository',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			opts.editable = false;
			$base(entry, opts);
			this.addClass('mongoCollectionRenderer');
			$jsb.loadCss('MongoCollectionRenderer.css');
			entry.ensureSynchronized(function(){
				var e = $this.getEntry();
				$this.updateAdditional();
				
				if(opts.showSource && e.getParentId()){
					$this.addClass('showSource');
					$this.server().getSource(e, function(sourceEntry){
						$this.append('<div class="leftParen">(</div>');
						$this.append(RendererRepository.createRendererFor(sourceEntry).getElement());
						$this.append('<div class="rightParen">)</div>');
					});
				} else {
					$this.removeClass('showSource');
				}
			});
		},
		
		update: function(){
			$base();
			this.updateAdditional();
		},
		
		updateAdditional: function(){
			var e = $this.getEntry();
			if(e.isMissing()){
				$this.addClass('missing');
				$this.attr('title', this.getEntry().getName() + ' - удален из базы');
			} else {
				$this.removeClass('missing');
				$this.attr('title', this.getEntry().getName());
			}
			if(e.isView()){
				$this.addClass('view');
			} else {
				$this.removeClass('view');
			}
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.MongoCollection');
		},
		
		getSource: function(entry){
			return entry.getWorkspace().entry(entry.getParentId());
		}
	}
}