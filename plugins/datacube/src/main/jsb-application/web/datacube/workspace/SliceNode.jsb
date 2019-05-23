/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.SliceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('sliceNode');
/*
			this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(sender, msg, obj){
			    if(obj.entry.getFullId() !== $this.getTargetEntry().getFullId()){
			        return;
			    }

			    $this.treeNode.tree.selectItem($this.treeNode.key);
			});

			this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(sender, msg, obj){
			    if(obj.entry.getFullId() !== $this.getTargetEntry().getFullId()){
			        return;
			    }

			    if($this.isSelected()){
			        $this.treeNode.tree.selectItem($this.treeNode.key);
			    }
			});
*/
		}
	}
}