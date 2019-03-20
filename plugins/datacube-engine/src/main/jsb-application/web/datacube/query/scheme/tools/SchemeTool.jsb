{
	$name: 'DataCube.Query.SchemeTool',
	$parent: 'JSB.Widgets.Tool',

	$client: {
	    $require: ['JSB.Widgets.ToolManager',
	               'JSB.Widgets.RendererRepository',
	               'DataCube.Query.ItemList',
	               'DataCube.Query.Syntax',
	               'DataCube.Query.Extractors.ExtractUtils',
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

		_SOURCE_FIELDS_NAME: 'Поля источника',
		_OUTPUT_FIELDS_NAME: 'Поля среза',

		$constructor: function(){
		    $base();

            function itemRender(itemElement, itemDesc){
                if(itemDesc.category === 'Срезы'){
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
		        dataId = this.getData('dataId'),
		        key = this.getData('key'),
		        showSlices = this.getData('showSlices');

		    // fill slices
		    if(this._dataId !== dataId){
		        this._dataId = dataId;

		        this.itemList.clearCategory('Срезы');

		        var data = this.getData('data'),
		            sliceId = this.getData('sliceId');

		        for(var i in data.cubeSlices){
		            if(i !== sliceId){
		                this.itemList.addItem({
		                    item: data.cubeSlices[i],
		                    key: i,
		                    category: 'Срезы',
		                    searchId: data.cubeSlices[i].getName()
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
                var context = caller.getContext();

                var allowOutputFields = caller.isAllowOutputFields(),
                    allowSourceFields = caller.isAllowSourceFields();

                if(allowOutputFields){
                    allowCategories.push(this._OUTPUT_FIELDS_NAME);

                    this.itemList.clearCategory(this._OUTPUT_FIELDS_NAME);

                    var fields = caller.getOutputFields();

                    for(var i = 0; i < fields.length; i++){
                        if(true){   // i !== key
                            this.itemList.addItem({
                                context: context,
                                item: fields[i],
                                key: 'curSlice' + '|' + fields[i],
                                category: this._OUTPUT_FIELDS_NAME,
                                searchId: fields[i]
                            });
                        }
                    }
                }

                if(allowSourceFields){
                    allowCategories.push(this._SOURCE_FIELDS_NAME);

                    this.itemList.clearCategory(this._SOURCE_FIELDS_NAME);

                    ExtractUtils.server().extractAllowedFields(caller.getQuery(), context, function(fields, fail){
                        if(fail){
                            throw new Error('Ошибка при загрузке доступных полей источников');
                        }

                        var cubeSlices = caller.getData('cubeSlices'),
                            curContext;

                        for(var i = 0; i < fields.length; i++){
                            if(JSB.isDefined(fields[i].$sourceContext)){
                                if(curContext !== fields[i].$sourceContext){
                                    curContext = fields[i].$sourceContext;

                                    $this.itemList.addItem({
                                        allowSelect: false,
                                        isHeader: true,
                                        item: cubeSlices[curContext],
                                        key: curContext,
                                        category: $this._SOURCE_FIELDS_NAME
                                    });
                                }
                            } else if(fields[i].$context !== curContext){
                                curContext = fields[i].$context;

                                $this.itemList.addItem({
                                    allowSelect: false,
                                    isHeader: true,
                                    item: curContext,
                                    key: curContext,
                                    category: $this._SOURCE_FIELDS_NAME
                                });
                            }

                            $this.itemList.addItem({
                                item: fields[i].$field,
                                key: curContext + '|' + fields[i].$field,
                                category: $this._SOURCE_FIELDS_NAME,

                                context: fields[i].$context,
                                sourceContext: fields[i].$sourceContext,
                                searchId: fields[i].$field
                            });
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