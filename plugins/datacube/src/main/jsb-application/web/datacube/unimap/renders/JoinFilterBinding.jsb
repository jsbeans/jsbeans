{
	$name: 'Unimap.Render.JoinFilterBinding',
	$parent: 'Unimap.Render.Item',

	$require: ['JSB.Controls.Button',
	           'JSB.Controls.Select',
	           'JSB.Widgets.RendererRepository',
	           'css:JoinFilterBinding.css'],

    $alias: 'joinFilter',

    $client: {
        _sources: [],
        _comparisonOpts: ['$eq', '$gte', '$gt', '$lte', '$lt'],

        construct: function(){
            this.addClass('joinFilterBinding');

            var sources = this.getData();

            for(var i = 0; i < sources.length; i++){
                var fields = sources[i].extractFields(),
                    arr = [];

                for(var j in fields){
                    arr.push({
                        context: sources[i].getFullId(),
                        key: j,
                        value: j
                    });
                }

                arr.sort(function(a, b){
                    if (a.key > b.key) {
                        return 1;
                    }

                    if (a.key < b.key) {
                        return -1;
                    }

                    return 0;
                });

                this._sources.push(arr);
            }

            $base();

            // source 2
            this._name.after(RendererRepository.createRendererFor(sources[1], {showSource: true}).getElement());
            this._name.after('<div class="comparison">Условие</div>');
            // source 1
            this._name.after(RendererRepository.createRendererFor(sources[0], {showSource: true}).getElement());
        },

        addItem: function(values, itemIndex){
            if(!values){
                values = {};
                this._values.values.push(values);

	            if(!itemIndex){
	                itemIndex = this._values.values.length - 1;
	            }
            }

            var firstField = new Select({
                cssClass: 'firstField',
                clearBtn: !this._scheme.multiple,
                cloneOptions: true,
                options: this._sources[0],
                onchange: function(val){
                    values.firstField = {
                        $context: val.options.context,
                        $field: val.key
                    }

                    $this.onchange();
                }
            });

            values.comparison = '$eq';
            var comparison = new Select({
                cssClass: 'comparison',
                cloneOptions: true,
                options: this._comparisonOpts,
                value: values.comparison,
                onchange: function(val){
                    values.comparison = val.key;

                    $this.onchange();
                }
            });

            var secondField = new Select({
                cssClass: 'secondField',
                clearBtn: !this._scheme.multiple,
                cloneOptions: true,
                options: this._sources[1],
                onchange: function(val){
                    values.secondField = {
                        $context: val.options.context,
                        $field: val.key
                    }

                    $this.onchange();
                }
            });

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem" idx="' + itemIndex + '"></div>');

	            item.append(firstField.getElement());
	            item.append(comparison.getElement());
	            item.append(secondField.getElement());

                var removeButton = $this.$('<i class="btn btnDelete fas fa-times-circle" title="Удалить"></i>');
                removeButton.click(function(evt){
                    evt.stopPropagation();
                    $this._values.values.splice(itemIndex, 1);

                    item.remove();
                    firstField.destroy();
                    comparison.destroy();
                    secondField.destroy();
                    removeButton.remove();
                });
                item.append(removeButton);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(firstField);
	            this.append(comparison);
	            this.append(secondField);
	        }
        },

	    destroy: function(){
	        $base();

	        //todo: destroy beans
	    }
    }
}