{
	$name: 'DataCube.Query.Renders.Select',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$select',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'css:Select.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectRender');

	        this.createHeader(false);

            var values = this.getValues(),
                fieldsArr = Object.keys(values);//.sort();

            for(var i = 0; i < fieldsArr.length; i++){
                var render = this.createRender({
                    key: fieldsArr[i],
                    renderName: '$selectItem',
                    scope: this.getValues()
                });

                if(render){
                    render.subscribeToChanges(this.getId(), function(changeDesc){
                        $this.changeEvent(changeDesc);
                    });

                    this.append(render);
                }
            }

            this._addBtn = this.$('<i class="addBtn"></i>');
            this.append(this._addBtn);
            this._addBtn.click(function(){
                $this.showTool({
                    element: $this._addBtn,
                    key: '$const',
                    callback: function(desc){
                        var count = 1,
                            name = 'Столбец',
                            newName = name;

                        if(desc.key === '$field'){
                            name = desc.value;
                            newName = desc.value;
                        }

                        while(values[newName]){
                            newName = name + '_' + count;
                            count++;
                        }

                        $this.addField(newName, desc);
                    }
                });
            });
	    },

	    addField: function(fieldName, desc, hideEvent){
	        var values = this.getValues();

	        if(desc){
	            values[fieldName] = Syntax.constructDefaultValues(desc);
	        } else {
	            values[fieldName] = this.getDefaultValues();
	        }

            var render = $this.createRender({
                key: fieldName,
                renderName: '$selectItem',
                scope: values
            });

            if(render){
                render.subscribeToChanges(this.getId(), function(changeDesc){
                    $this.changeEvent(changeDesc);
                });

                this._addBtn.before(render);

                if(!hideEvent){
                    $this.onChange({
                        name: 'addField',
                        fieldDesc: desc,
                        fieldName: fieldName
                    });
                }
            }
	    },

	    changeEvent: function(changeDesc){
            var subscribers = this.getSubscribers();

            for(var i in subscribers){
                subscribers[i].call(this, changeDesc);
            }
	    },

	    renameField: function(oldName, newName){
	        var children = this.getChildren();

	        for(var i in children){
	            if(children[i].getKey() === oldName){
	                children[i].rename(newName);
	            }
	        }
	    },

	    removeField: function(fieldName){
	        var children = this.getChildren();

	        children[fieldName].remove(true);
	    }
	}
}