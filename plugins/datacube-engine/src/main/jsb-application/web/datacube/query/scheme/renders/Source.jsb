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

            this.construct();
        },

        addItem: function(index){
            var item = this.$('<div class="item" idx="' + index + '"></div>');
            this.items.append(item);

	        var value,
	            isMultiple = this.getScheme().multiple;

	        if(isMultiple){
	            value = this._values[index];

                item.append(`#dot
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);
            } else {
                value = this._values;
            }

	        var source = this.$('<div class="source"></div>');
	        item.append(source);

	        if(isMultiple){
                var removeBtn = this.$('<div class="removeBtn fas fa-trash-alt"></div>');
                item.append(removeBtn);
                removeBtn.click(function(){
                    $this.removeItem(item);
                });
	        }

	        this.createSource(value, source, function(newSourceType, source){
	            var val;

                switch(newSourceType){
                    case 'slice':
                        val = source.getFullId();
                }

	            if(isMultiple){
	                var index = Number(item.attr('idx'));
	                $this._values[index] = val;
	            } else {
                    $this._values = val;
                    $this.getParent().replaceValue($this.getKey(), $this.getKey(), val);
	            }

	            $this.onChange();
	        });
        },

	    changeTo: function(newKey){
	        var newValue,
	            curKey = this.getKey();

            if(newKey === '$cube'){
                newValue = this.getSlice().getCube().getFullId();

                $base(newKey, newValue);

                return;
            }

	        if(curKey === '$join'){
	            if(newKey === '$from'){
	                newValue = this._values.$left;
	            }

	            if(newKey === '$union'){
	                newValue = [this._values.$left, this._values.$right];
	            }
	        }

	        if(curKey === '$from'){
	            if(newKey === '$join'){
	                newValue = {
	                    $left: this._values
	                };
	            }

	            if(newKey === '$union'){
	                newValue = [this._values];
	            }
	        }

	        if(curKey === '$union'){
	            if(newKey === '$from'){
	                newValue = this._values[0];
	            }

	            if(newKey === '$join'){
	                newValue = {
	                    $left: this._values[0],
	                    $right: this._values[1]
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
	        this.items = this.$('<div class="items"></div>');
	        this.append(this.items);

	        if(this.getScheme().multiple){
	            for(var i = 0; i < this._values.length; i++){
	                $this.addItem(i);
	            }

	            // multiple
                this.addBtn = this.$('<i class="addBtn fas fa-plus-circle"></i>');
                this.addBtn.click(function(){
                    $this.addItem($this._values.length);
                    $this.onChange();
                });
                this.append(this.addBtn);

                // sortable
                this.items.sortable({
                    handle: '.sortableHandle',
                    update: function(){
                        $this.reorderValues();
                    }
                });
	        } else {
	            this.addItem(0);
	        }
	    },

	    createHeader: function(){
            this._header = this.$('<header>' + this._scheme.category + ': ' + this._scheme.displayName + '</header>');
            this.append(this._header);

            this._header.hover(function(){
                JSB.cancelDefer('DataCube.Query.hideMenu' + $this.getId());

                JSB.defer(function(){
                    $this.showMenu();
                }, 300, 'DataCube.Query.showMenu' + $this.getId());
            }, function(){
                JSB.cancelDefer('DataCube.Query.showMenu' + $this.getId());

                JSB.defer(function(){
                    $this.hideMenu();
                }, 300, 'DataCube.Query.hideMenu' + $this.getId());
            });

	        return this._header;
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

	        function createDefault(){
                var source = this.$('<div>Источник не задан</div>');

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
                    createDefault();
	        }
	    },

	    getSourceFields: function(callback){
	        var sources;

	        switch(this.getKey()){
	            case '$from':
	                sources = [this._values];
	                break;
                case '$join':
                    sources = [this._values.$left, this._values.$right];
                    break;
                case '$union':
                    sources = this._values;
                    break;
	        }

	        this.server().getSourceFields(sources, function(res, fail){
	            if(fail){
	                return;
	            }

	            callback.call($this, res);
	        });
	    },

	    removeItem: function(item){
	        var items = this.items.find('>.item'),
	            itemIndex = Number(item.attr('idx'));

	        for(var i = 0; i < items.length; i++){
	            if(i === itemIndex){
	                items[i].remove();
	                this._values.splice(i, 1);
	                continue;
	            }

	            if(i > itemIndex){
	                this.$(items[i]).attr('idx', i - 1);
	            }
	        }

	        $this.onChange();
	    },

	    reorderValues: function(){
	        var items = this.items.find('>.item');

	        for(var i = 0; i < items.length; i++){
	            var idx = Number(this.$(items[i]).attr('idx'));
	            if(idx !== i){
	                this.$(items[i]).attr('idx', i);

	                if(idx > i){
	                    var el = this._values.splice(idx, 1);
	                    this._values.splice(i, 0, el[0]);
	                }
	            }
	        }

	        $this.onChange();
	    }
    },

    $server: {
        $require: ['JSB.Workspace.WorkspaceController'],

        getEntry: function(id){
	        return WorkspaceController.getEntryByFullId(id);
        },

        getSourceFields: function(ids){
            var sources = [];

            for(var i = 0; i < ids.length; i++){
                var entry = WorkspaceController.getEntryByFullId(ids[i]);

                if(entry){
                    sources.push({
                        entry: entry,
                        fields: entry.extractFields()
                    });
                }
            }

            return sources;
        }
    }
}