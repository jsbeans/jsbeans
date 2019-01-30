{
	$name: 'DataCube.Query.SchemeTool',
	$parent: 'JSB.Widgets.Tool',

	$client: {
	    $require: ['JSB.Widgets.ToolManager',
	               'JSB.Widgets.RendererRepository',
	               'DataCube.Query.ItemList',
	               'css:SchemeTool.css'],

		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'querySchemeTool',
				jso: self,
				wrapperOpts: {
					exclusive: 'querySchemeTool',
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					hideByEsc: true,
					cssClass: 'querySchemeTool'
				}
			});
		},

		_sliceId: null,

		$constructor: function(){
		    $base();

		    this.itemList = new ItemList({
		        categories: ['Срезы'],
		        onSelect: function(desc){
		            $this.data.callback.call($this, desc);
		            $this.close();
		        }
		    });
		    this.append(this.itemList);
		},

		update: function(){
		    var data = this.data.data.data,
		        sliceId = this.data.data.sliceId,
		        selected = this.data.data.selectedId;

		    // fill slices
		    if(this._sliceId !== sliceId){
		        this._sliceId = sliceId;

		        this.itemList.clearCategory('Срезы');

		        for(var i in data.cubeSlices){
		            if(i !== this._sliceId){
		                this.itemList.addItem(RendererRepository.createRendererFor(data.cubeSlices[i]), i, 'Срезы');
                    }
		        }
            }

            if(selected){
                this.itemList.selectItem(selected);
            }
		}
    }
}