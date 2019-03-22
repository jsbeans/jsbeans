{
	$name: 'DataCube.Query.Renders.Select',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$select',

	$client: {
	    $require: ['css:Select.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectRender');

	        this.createHeader(false);

            var values = this.getValues(),
                fieldsArr = Object.keys(values).sort();

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
                var count = 1,
                    name = 'Столбец',
                    newName = name;

                while(values[newName]){
                    newName = name + '_' + count;
                    count++;
                }

                $this.addField(newName);
            });
	    },

	    addField: function(fieldName, hideEvent){
	        var values = this.getValues();

	        values[fieldName] = this.getDefaultValues();

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

	        children[oldName].rename(newName);
	    },

	    removeField: function(fieldName){
	        var children = this.getChildren();

	        children[fieldName].remove(true);
	    }
	}
}