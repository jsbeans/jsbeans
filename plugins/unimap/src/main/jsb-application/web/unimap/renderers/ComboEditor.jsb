{
	$name: 'Unimap.Render.ComboEditor',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.ComboEditor'],
	$client: {
	    _editors: [],

	    construct: function(){
	        this.addClass('comboEditor');
	        this.loadCss('ComboEditor.css');

	        this.createOptionsList();

	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

            var editor = new ComboEditor({
                options: this._optionsList,
                value: values.value,
                onchange: function(val){
                    values.value = val.key;

                    $this.onchange();
                }
            });
            item.append(editor.getElement());

            this._editors.push(editor);

	        if(this._scheme.multiple){
	            item.addClass('.multipleItem');

	            if(!itemIndex){
	                itemIndex = this.multipleContainer.find('.multipleItem').length;
	            }
	            item.attr('idx', itemIndex);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(item);
	        }

            if(values.value){
                this.createInnerScheme(item, values.value, itemIndex);
            }
	    },

	    changeCommonGroup: function(values){
	        //
	    },

	    createOptionsList: function(linkToValue, commonGroupValues){
	        var opList = [];

	        // code from Select.jsb
	        /*
	        if(this._scheme.linkTo){
	            this._linkToValue = linkToValue || this.getValueByKey(this._scheme.linkTo),
	                linkedOpts = [];

	            for(var i = 0; i < this._linkToValue.values.length; i++){
	                if(this._linkToValue.values[i].value){
	                    linkedOpts.push(this._linkToValue.values[i].value);
	                }
	            }

	            for(var i = 0; i < linkedOpts.length; i++){
                    for(var j in this._scheme.itemsGroups){
                        if(this._scheme.itemsGroups[j].forFields.indexOf(linkedOpts[i]) > -1){
                            for(var k in this._scheme.itemsGroups[j].items){
                                opList.push({
                                    key: k,
                                    value: this._scheme.itemsGroups[j].items[k].name
                                });
                            }
                        }
                    }
	            }
	        }
	        */
	        if(this._scheme.commonField){
	            this._commonGroupValues = commonGroupValues || this.getCommonGroupValues(this._scheme.commonField);

	            if(this._commonGroupValues){
                    for(var i = 0; i < this._commonGroupValues.length; i++){
                        opList.push({
                            key: this._commonGroupValues[i],
                            value: this._commonGroupValues[i]
                        });
                    }
	            }
	        }

	        this._optionsList = opList;
	    },

	    destroy: function(){
	        for(var i = 0; i < this._editors.length; i++){
	            this._editors[i].destroy();
	        }

	        $base();
	    }
	}
}