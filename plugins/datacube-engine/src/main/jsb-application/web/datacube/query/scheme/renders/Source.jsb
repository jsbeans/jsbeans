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
            var header = this.$('<header>Источник запроса: ' + this.getScheme().displayName + '</header>'); //this.getScheme().category
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
                        break;
                    case 'view':
                        val = source.item;
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

	            if(newKey === '$recursive'){
	                var leftContext = this.getController().generateContext(),
	                    rightContext = this.getController().generateContext();

	                newValue = {
	                    $start: {
	                        $context: leftContext,
	                        $select: {},
	                        $from: values.$left
	                    },
	                    $joinedNext: {
	                        $context: rightContext,
	                        $select: {},
	                        $from: values.$right
	                    }
	                };
	            }
	        }

	        if(curKey === '$from'){
	            if(newKey === '$join'){
	                newValue = {
	                    $left: values,
	                    $right: {}
	                };
	            }

	            if(newKey === '$union'){
	                newValue = [values];
	            }

	            if(newKey === '$recursive'){
	                newValue = {
	                    $start: {
	                        $select: {},
	                        $from: values
	                    },
	                    $joinedNext: {
	                        $select: {},
	                        $from: values
	                    },
	                    $filter: {}
	                };
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

	            if(newKey === '$recursive'){
	                newValue = {
	                    $start: {
	                        $select: {},
	                        $from: values[0]
	                    },
	                    $joinedNext: {
	                        $select: {},
	                        $from: values[1]
	                    },
	                    $filter: {}
	                };
	            }
	        }

	        if(curKey === '$cube'){
	            if(newKey === '$join'){
	                newValue = {}
	            }

	            if(newKey === '$union'){
	                newValue = [];
	            }

	            if(newKey === '$recursive'){
	                newValue = {
	                    $start: {
	                        $select: {},
	                        $from: {}
	                    },
	                    $joinedNext: {
	                        $select: {},
	                        $from: {}
	                    },
	                    $filter: {}
	                };
	            }
	        }

	        if(curKey === '$provider'){
	            newValue = {};

	            if(newKey === '$recursive'){
	                newValue = {
	                    $start: {
	                        $select: {},
	                        $from: {}
	                    },
	                    $joinedNext: {
	                        $select: {},
	                        $from: {}
	                    },
	                    $filter: {}
	                };
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
                            case '$slices':
                                var slice = desc.item;

                                appendElement.empty().append(RendererRepository.createRendererFor(slice));

                                if(changeCallback){
                                    changeCallback.call($this, 'slice', slice);
                                }
                                break;
                            case '$views':
                                appendElement.empty().append('<div class="viewElement">' + desc.item + '</div>');

                                if(changeCallback){
                                    changeCallback.call($this, 'view', desc);
                                }
                                break;
                        }
                    }
	            });
	        }

	        function createDefault(text){
                var source = $this.$('<div>' + text + '</div>');

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
                case 'string':  // slice/provider id || view
                    var views = this.getViews();

                    if(views[value]) {
                        appendElement.append('<div class="viewElement">' + value + '</div>');

                        if(isEditable) {
                            appendElement.click(function() {
                                click(value);
                            });
                        }
                    } else {
                        this.server().getEntry(value, function(res, fail){
                            var source = RendererRepository.createRendererFor(res);
                            appendElement.append(source);

                            if(isEditable){
                                appendElement.click(function(){
                                    click(appendElement.children().jsb().getObject().getFullId());
                                });
                            }
                        });
                    }
                    break;
                default:
                    createDefault('Источник не задан');
	        }
	    },

	    extractFields: function(sources, callback){
	        if(!JSB.isArray(sources)){
	            sources = [sources];
	        }

	        var isNeedServer = false,
	            res = [];

	        for(var i = 0; i < sources.length; i++){
	            res.push({
	                source: sources[i]
	            });

	            if(!JSB.isBean(sources[i]) && JSB.isObject(sources[i])){
	                res[i].fields = sources[i].$select || {};
	            } else {
	                isNeedServer = true;
	            }
	        }

	        if(isNeedServer){
	            this.server().getSourceFields(res, function(res, fail){
	                if(fail){
	                    // todo: error ?
	                    return;
	                }

	                callback.call($this, res);
	            })
	        } else {
	            callback.call(this, res);
	        }
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
	    }
    },

    $server: {
        $require: ['JSB.Workspace.WorkspaceController'],

        getEntry: function(id){
	        return WorkspaceController.getEntryByFullId(id);
        },

        getSourceFields: function(result){
            for(var i = 0; i < result.length; i++){
                try{
                    var entry = null;

                    if(JSB.isString(result[i].source)){
                        entry = WorkspaceController.getEntryByFullId(result[i].source);
                    } else if(JSB.isInstanceOf('DataCube.Model.QueryableEntry', result[i].source)){
                        entry = result[i].source;
                    }

                    if(entry){
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