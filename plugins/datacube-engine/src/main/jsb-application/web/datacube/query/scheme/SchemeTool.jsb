{
	$name: 'DataCube.Query.SchemeTool',
	$parent: 'JSB.Widgets.Tool',

	$client: {
	    $require: ['JSB.Widgets.ToolManager',
	               'JSB.Widgets.RendererRepository',
	               'DataCube.Query.ItemList',
	               'DataCube.Query.Syntax',
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
		_slices: [],

		$constructor: function(){
		    $base();

            function itemRender(itemElement, itemDesc){
                if(itemDesc.category === 'Срезы'){
                    itemElement.append(RendererRepository.createRendererFor(itemDesc.item));
                } else {
                    itemElement.append('<div class="key">' + itemDesc.key + '</div><div class="desc">' + itemDesc.desc + '</div>');
                }
            }

		    this.itemList = new ItemList({
		        items: Syntax.getToolItems(),
		        itemRender: itemRender,
		        onSelect: function(desc){
		            $this.data.callback.call($this, desc);
		            $this.close();
		        }
		    });
		    this.append(this.itemList);
		},

		update: function(){
		    var data = this.getData('data'),
		        key = this.getData('key'),
		        sliceId = this.getData('sliceId'),
		        selected = this.getData('selectedId'),
		        showSlices = this.getData('showSlices');

		    // fill slices
		    if(this._sliceId !== sliceId){
		        this._sliceId = sliceId;
		        this._slices = [];

		        this.itemList.clearCategory('Срезы');

		        for(var i in data.cubeSlices){
		            if(i !== this._sliceId){
		                this.itemList.addItem({
		                    item: data.cubeSlices[i],
		                    key: i,
		                    category: 'Срезы'
		                });

		                this._slices.push(i);
                    }
		        }
            }

            var allowItems = [];
            switch(key){
                case '$source':
                    // todo: query, view
                    allowItems = this._slices;
                    break;
                default:
                    allowItems = Syntax.getReplacements(this.getData('key'));
            }

            this.itemList.allowItems(allowItems);

            if(selected){
                this.itemList.selectItem(selected);
            }
		}
    }
}