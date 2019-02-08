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

		_SOURCE_FIELDS_NAME: 'Поля источника',
		_CURRENT_SLICE_FIELDS_NAME: 'Поля среза',

		$constructor: function(){
		    $base();

            function itemRender(itemElement, itemDesc){
                if(itemDesc.category === 'Срезы'){
                    itemElement.append(RendererRepository.createRendererFor(itemDesc.item));
                } else if(itemDesc.category === $this._SOURCE_FIELDS_NAME || itemDesc.category === $this._CURRENT_SLICE_FIELDS_NAME){
                    if(JSB.isInstanceOf(itemDesc.item, 'DataCube.Model.Slice')){
                        itemElement.append(RendererRepository.createRendererFor(itemDesc.item));
                    } else {
                        itemElement.append('<div class="fieldName cubeFieldIcon sliceField">' + itemDesc.item + '</div>')
                    }
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
		        showSlices = this.getData('showSlices'),
		        query = this.getData('query');

		    // fill slices
		    if(this._sliceId !== sliceId){
		        this._sliceId = sliceId;

		        this.itemList.clearCategory('Срезы');

		        for(var i in data.cubeSlices){
		            if(i !== this._sliceId){
		                this.itemList.addItem({
		                    item: data.cubeSlices[i],
		                    key: i,
		                    category: 'Срезы'
		                });
                    }
		        }
            }

            var allowItems = Syntax.getReplacements(key),
                allowCategories = [];

            if(key === '$source'){
                allowCategories.push('Срезы');
            }

            if(allowItems.indexOf('$field') > -1){
                allowCategories.push(this._SOURCE_FIELDS_NAME);
                allowCategories.push(this._CURRENT_SLICE_FIELDS_NAME);

                this.itemList.clearCategory(this._SOURCE_FIELDS_NAME);
                this.itemList.clearCategory(this._CURRENT_SLICE_FIELDS_NAME);

                var fields = Object.keys(query.getValues().$select),
                    context = query.getValues().$context;

                fields.sort();

                for(var i = 0; i < fields.length; i++){
                    if(true){   // i !== selected
		                this.itemList.addItem({
		                    context: context,
		                    item: fields[i],
		                    key: 'curSlice' + '|' + fields[i],
		                    category: this._CURRENT_SLICE_FIELDS_NAME
		                });
                    }
                }

                query.getSourceFields(function(slices){
                    // slice: slices[i].entry
                    // fields: slices[i].fields
                    for(var i = 0; i < slices.length; i++){
		                $this.itemList.addItem({
		                    allowSelect: false,
		                    item: slices[i].entry,
		                    key: i,
		                    category: $this._SOURCE_FIELDS_NAME
		                });

		                var sliceId = slices[i].entry.getFullId();

                        var fields = Object.keys(slices[i].fields);
                        fields.sort();

		                for(var j = 0; j < fields.length; j++){
                            $this.itemList.addItem({
                                context: sliceId,
                                item: fields[j],
                                key: sliceId + '|' + fields[j],
                                category: $this._SOURCE_FIELDS_NAME
                            });
		                }
                    }
                });
            }

            this.itemList.allowItems(allowItems, allowCategories);
/*
            if(selected){
                this.itemList.selectItem(selected);
            }
*/
		}
    }
}