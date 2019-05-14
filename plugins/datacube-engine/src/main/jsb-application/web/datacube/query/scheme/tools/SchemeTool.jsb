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

		_dataId: null,

		_SLICES_NAME: '$slices',
		_SOURCE_FIELDS_NAME: '$sourceFields',
		_OUTPUT_FIELDS_NAME: '$outputFields',
		_VIEWS_NAME: '$views',

		$constructor: function(){
		    $base();

            function itemRender(itemElement, itemDesc){
                if(itemDesc.category === $this._SLICES_NAME){
                    itemElement.append(RendererRepository.createRendererFor(itemDesc.item));
                } else if(itemDesc.category === $this._SOURCE_FIELDS_NAME || itemDesc.category === $this._OUTPUT_FIELDS_NAME){

                    if(itemDesc.isHeader){

                        if(JSB.isInstanceOf(itemDesc.item, 'DataCube.Model.Slice')){
                            itemElement.append(RendererRepository.createRendererFor(itemDesc.item));
                        } else {
                            itemElement.append('<div class="contextName">Подзапрос ' + itemDesc.item + '</div>');
                        }

                    } else {
                        itemElement.append('<div class="fieldName cubeFieldIcon sliceField">' + itemDesc.item + '</div>');
                    }

                } else if(itemDesc.category === $this._VIEWS_NAME) {
                    itemElement.append('<div class="key">' + itemDesc.item + '</div>');
                } else {
                    itemElement.append('<div class="key">' + itemDesc.key + '</div><div class="desc">' + itemDesc.desc + '</div>');
                }
            }

		    this.itemList = new ItemList({
		        categories: Syntax.getCategories(),
		        items: Syntax.getToolItems(),
		        itemRender: itemRender,
		        onSelect: function(desc){
		            if(desc.category === $this._SOURCE_FIELDS_NAME || desc.category === $this._OUTPUT_FIELDS_NAME){
		                desc.value = desc.item;
		                desc.key = '$field';
		            }

		            $this.data.callback.call($this, desc);
		            $this.close();
		        }
		    });
		    this.append(this.itemList);
		},

		update: function(){
		    var caller = this.getData('caller'),
		        dataId = this.getData('dataId'),
		        extendControllers = this.getData('extendControllers'),
		        key = this.getData('key'),
		        showSlices = this.getData('showSlices'),

		        replacements = Syntax.getReplacements(key, caller && caller.getParent().getKey());

            var allowItems = replacements.items || [],
                allowCategories = replacements.categories || [],
                isNewData = false;

            this.itemList.showAll();

            if(dataId !== this._dataId) {
                isNewData = true;

                this._dataId = dataId;
            }

            for(var i = 0; i < allowCategories.length; i++) {
                (function(category) {
                    Syntax.fillCategory(category, {
                        data: $this.getData('data'),
                        extendControllers: extendControllers,
                        isNewData: isNewData,
                        render: caller
                    }, function(result) {
                        if(result.notUpdate) {
                            return;
                        }

                        if(result.categoryItems.length > 0) {
                            var context = caller.getContext();

                            $this.itemList.clearCategory(category);

                            for(var j = 0; j < result.categoryItems.length; j++) {
                                $this.itemList.addItem(result.categoryItems[j]);
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