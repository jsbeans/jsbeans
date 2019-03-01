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
		_OUTPUT_FIELDS_NAME: 'Поля среза',

		$constructor: function(){
		    $base();

            function itemRender(itemElement, itemDesc){
                if(itemDesc.category === 'Срезы'){
                    itemElement.append(RendererRepository.createRendererFor(itemDesc.item));
                } else if(itemDesc.category === $this._SOURCE_FIELDS_NAME || itemDesc.category === $this._OUTPUT_FIELDS_NAME){
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
		        data = this.getData('data'),
		        key = this.getData('key'),
		        sliceId = this.getData('sliceId'),
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

            var allowItems = [],
                allowCategories = [];

            if(key === '$source'){
                allowCategories.push('Срезы');
            } else {
                allowItems = Syntax.getReplacements(key, caller && caller.getParent().getKey());
            }

            if(allowItems.indexOf('$field') > -1){
                var allowOutputFields = caller.isAllowOutputFields(),
                    allowSourceFields = caller.isAllowSourceFields();

                if(allowOutputFields){
                    allowCategories.push(this._OUTPUT_FIELDS_NAME);

                    this.itemList.clearCategory(this._OUTPUT_FIELDS_NAME);

                    var fields = Object.keys(query.getScope().$select),
                        context = query.getScope().$context;

                    fields.sort();

                    for(var i = 0; i < fields.length; i++){
                        if(true){   // i !== key
                            this.itemList.addItem({
                                context: context,
                                item: fields[i],
                                key: 'curSlice' + '|' + fields[i],
                                category: this._OUTPUT_FIELDS_NAME
                            });
                        }
                    }
                }

                if(allowSourceFields){
                    allowCategories.push(this._SOURCE_FIELDS_NAME);

                    this.itemList.clearCategory(this._SOURCE_FIELDS_NAME);

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
                                    context: slices[i].context,
                                    item: fields[j],
                                    key: sliceId + '|' + fields[j],
                                    category: $this._SOURCE_FIELDS_NAME,
                                    sourceContext: slices[i].sourceContext
                                });
                            }
                        }
                    });
                }
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