{
	$name: 'Unimap.Render.Select',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Select'],
	$client: {
	    _selectors: [],

	    construct: function(){
	        this.addClass('selectRender');
	        $jsb.loadCss('Select.css');

	        this.createOptionsList();

	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        values.value = values.value ? values.value : !this._scheme.allowEmpty && this._optionsList && this._optionsList.length > 0 ? this._optionsList[0].key : undefined;

	        var item = this.$('<div class="item"></div>');

            var select = new Select({
                clearBtn: this._scheme.allowEmpty,
                options: this._optionsList,
                value: values.value,
                onchange: function(val){
                    values.value = val.key;
                    $this.createInnerScheme(item, val.key, itemIndex);

                    $this.onchange();
                }
            });
            item.append(select.getElement());

            this._selectors.push(select);

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
	        this.createOptionsList();

	        for(var i = 0; i < this._selectors.length; i++){
	            this._selectors[i].setOptions(this._optionsList, true);
	            //this._selectors[i].setValue(this._optionsList[0].value, true);
	        }
	    },

	    changeLinkTo: function(values){
	        if($base(values)){
	            return;
	        }

	        this.createOptionsList(values);

	        for(var i = 0; i < this._selectors.length; i++){
	            this._selectors[i].setOptions(this._optionsList, true);

	            if(!this._scheme.allowEmpty){
	                this._selectors[i].setValue(this._optionsList[0].value, true);
	            }
	        }
	    },

	    createOptionsList: function(linkToValue, commonGroupValues){
	        var opList = [];

	        if(this._scheme.linkTo || this._scheme.commonField){
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
            } else {
                for(var i in this._scheme.items){
                    opList.push({
                        key: i,
                        value: this._scheme.items[i].name
                    });
                }
	        }

	        this._optionsList = opList;
	    },

	    createInnerScheme: function(item, value, itemIndex){
	        function findItems(key){
	            var linkedOpts = [];

	            for(var i = 0; i < $this._linkToValue.values.length; i++){
	                if($this._linkToValue.values[i].value){
	                    linkedOpts.push($this._linkToValue.values[i].value);
	                }
	            }

	            for(var i = 0; i < linkedOpts.length; i++){
                    for(var j in $this._scheme.itemsGroups){
                        if($this._scheme.itemsGroups[j].forFields.indexOf(linkedOpts[i]) > -1){
                            return $this._scheme.itemsGroups[j].items;
                        }
                    }
	            }
	        }

	        var scheme = this._scheme.items || this._linkToValue && findItems(this._linkToValue),
	            innerScheme = this.find('.innerScheme');

	        if(!scheme || !scheme[value] || !scheme[value].items){
	            innerScheme.remove();
	            return;
	        }

	        if(innerScheme.length == 0){
	            innerScheme = this.$('<div class="innerScheme"></div>');
	            this.append(innerScheme);
	        }

	        innerScheme.empty();

            if(!this._values.values[itemIndex].items){
                this._values.values[itemIndex].items = {};
            }

	        for(var i in scheme[value].items){
	            if(!scheme[value].items[i].render){
	                continue;
	            }

	            if(!this._values.values[itemIndex].items[i]){
	                this._values.values[itemIndex].items[i] = {};
	            }

	            var render = this.createRender(i, scheme[value].items[i], this._values.values[itemIndex].items[i]);
	            if(render){
	                innerScheme.append(render.getElement());
	            }
	        }
	    },

	    destroy: function(){
	        for(var i = 0; i < this._selectors.length; i++){
	            this._selectors[i].destroy();
	        }

	        $base();
	    }
	}
}