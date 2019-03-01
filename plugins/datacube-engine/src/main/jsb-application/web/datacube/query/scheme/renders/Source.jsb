{
	$name: 'DataCube.Query.Renders.Source',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$source',

	$client: {
	    $require: ['JSB.Widgets.RendererRepository',
	               'css:Source.css'],

        $constructor: function(opts){
            $base(opts);

            this.addClass('sourceRender');

            // create header
            var header = this.$('<header>' + this._scheme.category + ': ' + this._scheme.displayName + '</header>');
            this.append(header);

            this.installMenuEvents({ element: header });

            this.construct();
        },

        addItem: function(index){
            var item = this.$('<div class="item" idx="' + index + '"></div>');
            this.items.append(item);

	        var value = this.getValues(index),
	            isMultiple = this.isMultiple();

	        if(isMultiple){
                item.append(`#dot
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);
            }

	        var source = this.$('<div class="source"></div>');
	        item.append(source);

	        if(isMultiple){
                var removeBtn = this.$('<div class="removeBtn fas fa-trash-alt"></div>');
                item.append(removeBtn);
                removeBtn.click(function(){
                    $this.removeItem($this.items.find('>.item'), item);
                });
	        }

	        this.createSource(value, source, function(newSourceType, source){
	            var val;

                switch(newSourceType){
                    case 'slice':
                        val = source.getFullId();
                }

                $this.setValues(val, Number(item.attr('idx')));

	            $this.onChange();
	        });
        },

	    changeTo: function(newKey){
	        var newValue,
	            values = this.getValues(),
	            curKey = this.getKey();

            if(newKey === '$cube'){
                newValue = this.getSlice().getCube().getFullId();

                $base(newKey, newValue);

                return;
            }

	        if(curKey === '$join'){
	            if(newKey === '$from'){
	                newValue = values.$left;
	            }

	            if(newKey === '$union'){
	                newValue = [values.$left, values.$right];
	            }
	        }

	        if(curKey === '$from'){
	            if(newKey === '$join'){
	                newValue = {
	                    $left: values
	                };
	            }

	            if(newKey === '$union'){
	                newValue = [values];
	            }
	        }

	        if(curKey === '$union'){
	            if(newKey === '$from'){
	                newValue = values[0];
	            }

	            if(newKey === '$join'){
	                newValue = {
	                    $left: values[0],
	                    $right: values[1]
	                }
	            }
	        }

	        if(curKey === '$cube'){
	            if(newKey === '$join'){
	                newValue = {}
	            }

	            if(newKey === '$union'){
	                newValue = [];
	            }
	        }

	        $base(newKey, newValue || null);
	    },

	    construct: function(){
            // create item list
	        this.items = this.$('<div class="items"></div>');
	        this.append(this.items);

	        // fill items
	        if(this.isMultiple()){
	            for(var i = 0; i < this.getValues().length; i++){
	                $this.addItem(i);
	            }

	            // multiple
                this.addBtn = this.$('<i class="addBtn fas fa-plus-circle"></i>');
                this.addBtn.click(function(){
                    $this.addItem($this.getValues().length);
                    $this.onChange();
                });
                this.append(this.addBtn);

                // sortable
                this.items.sortable({
                    handle: '.sortableHandle',
                    update: function(){
                        $this.reorderValues($this.items.find('>.item'));
                    }
                });
	        } else {
	            this.addItem(0);
	        }
	    },

	    createSource: function(value, appendElement, changeCallback){
	        function click(selectedId){
	            $this.showTool({
	                element: appendElement,
                    key: '$source',
	                selectedId: selectedId,
	                callback:function(desc){
                        switch(desc.category){
                            case 'Срезы':
                                var slice = desc.item;

                                appendElement.empty().append(RendererRepository.createRendererFor(slice));

                                if(changeCallback){
                                    changeCallback.call($this, 'slice', slice);
                                }
                                break;
                        }
                    }
	            });
	        }

	        function createDefault(text){
                var source = this.$('<div>' + text + '</div>');

                if(isEditable){
                    appendElement.click(function(){
                        click();
                    });
                }

                appendElement.append(source);
	        }

	        var isEditable = this.getScheme().editable;

	        if(!isEditable){
	            appendElement.addClass('notEditable');
	        }

	        if(value === null){
	            createDefault();
	            return;
	        }

	        switch(typeof value){
	            case 'object':  // query
	                createDefault('Независимый срез');
	                break;
                case 'string':  // slice/provider id
                    this.server().getEntry(value, function(res, fail){
                        var source = RendererRepository.createRendererFor(res);
                        appendElement.append(source);

                        if(isEditable){
                            appendElement.click(function(){
                                click(appendElement.children().jsb().getObject().getFullId());
                            });
                        }
                    });
                    break;
                default:
                    createDefault('Источник не задан');
	        }
	    },

	    extractFields: function(source, callback){
	        if(JSB.isInstanceOf('DataCube.Model.QueryableEntry', source)){
	            source.server().extractFields(function(res, fail){
	                if(fail){
	                    // todo: error
	                    return;
	                }

	                callback.call($this, res);
	            });
	        } else if(JSB.isObject(source)){
	            callback.call(this, source.$select || {});
	        } else if(JSB.isString(source)){
                this.server().getSourceFields([{id: source}], function(res, fail){
                    if(fail){
                        // todo: error
                        return;
                    }

                    callback.call($this, res[0].fields);
                });
	        } else {
	            debugger;
	        }
	    },

	    getSourceFields: function(callback){
	        var sources,
	            values = this.getValues();

	        switch(this.getKey()){
	            case '$from':
	                sources = [{
	                    id: values,
	                    context: values
	                }];
	                break;
                case '$join':
                    sources = [
                    {
                        id: values.$left,
                        context: values.$left,
                        sourceContext: '$left'
                    },
                    {
                        id: values.$right,
                        context: values.$right,
                        sourceContext: '$right'
                    }
                    ];
                    break;
                case '$union':
                    for(var i = 0; i < values.length; i++){
                        sources.push({
                            id: values[i],
                            context: values[i]
                        });
                    }
                    break;
	        }

	        this.server().getSourceFields(sources, function(res, fail){
	            if(fail){
	                return;
	            }

	            callback.call($this, res);
	        });
	    },

        /**
        * Возвращает значения из скопа для текущего рендера
        * @params {number} index - индекс нужного значения
        *
        * @return {object} значения
        */
	    getValues: function(index){
	        if(this.isMultiple() && JSB.isDefined(index)){
	            return $base()[index];
	        }

	        return $base();
	    },

        /**
        * Устанавливает новое значение для текущего ключа
        * @param {*} новое значение
        */
	    setValues: function(val, index){
	        if(this.isMultiple() && JSB.isDefined(index)){
	            this._scope[this.getKey()][index] = val;
	        } else {
	            $base(val);
            }
	    },
    },

    $server: {
        $require: ['JSB.Workspace.WorkspaceController'],

        getEntry: function(id){
	        return WorkspaceController.getEntryByFullId(id);
        },

        getSourceFields: function(sources){
            var result = [];

            for(var i = 0; i < sources.length; i++){
                try{
                    var entry = WorkspaceController.getEntryByFullId(sources[i].id);

                    if(entry){
                        result.push(sources[i]);
                        result[i].entry = entry;
                        result[i].fields = entry.extractFields();
                    }
                } catch(ex){
                    JSB.getLogger().error('DataCube.Query.Renders.Source: invalid entry full id.');
                }
            }

            return result;
        }
    }
}