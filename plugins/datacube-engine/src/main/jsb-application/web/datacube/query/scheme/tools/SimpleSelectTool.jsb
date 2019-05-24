/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.SimpleSelectTool',
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
				id: 'simpleSelectTool',
				jso: self,
				wrapperOpts: {
					exclusive: 'simpleSelectTool',
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					hideByEsc: true,
					cssClass: 'simpleSelectTool'
				}
			});
		},

		_key: null,

		$constructor: function(){
		    $base();

            function itemRender(itemElement, itemDesc){
                itemElement.append('<div class="key">' + itemDesc.item.displayName + '</div><div class="desc">' + itemDesc.item.desc + '</div>');
            }

		    this.itemList = new ItemList({
		        itemRender: itemRender,
		        onSelect: function(desc) {
		            $this.data.callback.call($this, desc);
		            $this.close();
		        }
		    });
		    this.append(this.itemList);
		},

		update: function(){
		    var values = this.getData('values'),
		        key = this.getData('key'),
		        selected = this.getData('selectedId');

            if(this._key !== key){
                this._key = key;

                this.itemList.clear();

		        for(var i = 0; i < values.length; i++){
                    this.itemList.addItem({
                        item: values[i],
                        key: values[i].key,
                        searchId: values[i].key + '|' + values[i].displayName
                    });
		        }
            }

            if(selected){
                this.itemList.selectItem(selected);
            }
		}
    }
}