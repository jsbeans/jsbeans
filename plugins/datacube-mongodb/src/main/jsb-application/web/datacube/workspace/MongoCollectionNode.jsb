{
	$name: 'DataCube.MongoCollectionNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			$jsb.loadCss('MongoCollectionNode.css');
			this.addClass('mongoCollectionNode');
			this.suffix = this.$('<div class="suffix"></div>');
			this.append(this.suffix);
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			$this.update();
		},
		
		update: function(){
			var count = this.getTargetEntry().getItemCount();
			this.suffix.text(count);
			if(count === 0){
				this.suffix.addClass('empty');
			} else {
				this.suffix.removeClass('empty');
			}
		}
	}
}