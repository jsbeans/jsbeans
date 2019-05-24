/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.SchemeTool',
	$parent: 'JSB.Widgets.Tool',

	$client: {
	    $require: ['JSB.Widgets.ToolManager',
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

		$constructor: function(){
		    $base();

		    this.itemList = new ItemList({
		        categories: Syntax.getCategories(),
		        items: Syntax.getToolItems(),
		        itemRender: function(itemElement, itemDesc) {
		            var item = Syntax.createRender(itemDesc);

		            if(!item) {
		                item = '<div class="key">' + itemDesc.key + '</div><div class="desc">' + itemDesc.desc + '</div>';
		            }

		            itemElement.append(item);
		        },
		        onSelect: function(desc) {
		            $this.data.callback.call($this, desc);
		            $this.close();
		        }
		    });
		    this.append(this.itemList);
		},

		update: function(){
		    var caller = this.getData('caller'),
		        extendControllers = this.getData('extendControllers'),
		        key = this.getData('key'),
		        showSlices = this.getData('showSlices'),

		        replacements = Syntax.getReplacements(key, caller && caller.getParent().getKey());

            var allowItems = replacements.items || [],
                allowCategories = replacements.categories || [];

            this.itemList.showAll();

            for(var i = 0; i < allowCategories.length; i++) {
                (function(category) {
                    Syntax.fillCategory(category, {
                        data: $this.getData('data'),
                        extendControllers: extendControllers,
                        render: caller
                    }, function(result) {
                        if(result.categoryItems.length > 0) {
                            var context = caller.getContext();

                            $this.itemList.clearCategory(category);

                            for(var j = 0; j < result.categoryItems.length; j++) {
                                $this.itemList.addItem(JSB.merge(result.categoryItems[j], {
                                    category: category
                                }));
                            }
                        } else {
                            $this.itemList.hideCategory(category, true);
                        }
                    });
                })(allowCategories[i]);
            }

            this.itemList.allowItems(allowItems, allowCategories);
/*
            if(key){
                this.itemList.selectItem(key);
            }
*/
		}
    }
}