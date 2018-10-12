{
	$name: 'Unimap.Render.Formatter',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Widgets.ToolManager', 'DataCube.Formatter.AddTool', 'DataCube.Formatter.EditMenuTool', 'DataCube.Formatter.EditTool'],

	    construct: function(){
	        this.addClass('formatter');
	        $jsb.loadCss('Formatter.css');

            this._name = this.$('<span class="name">' + this._scheme.name + '</span>');
            this.append(this._name);

            this._editor = this.$('<div class="editor"></div>');
            this.append(this._editor);

            this._editor.sortable({
                update: function(){
                    $this.updateValue();
                }
            });

            this._addBtn = this.$('<i class="btn btnMultiple addVar fas fa-plus-circle"></i>');
            this.append(this._addBtn);
            this._addBtn.click(function(){
                $this.openAddTool();
            });

            if(!this._values.values[0]){
                this._values.values.push({});
            }

            this.restoreValues();
	    },

	    changeLinkTo: function(linkedValues){
	        this.createItemsList(linkedValues);
	    },

	    createItem: function(desc){
	        var item = this.$('<span class="item"></span>');

	        item.text(desc.value || desc.key);

	        for(var i in desc){
	            if(i === 'value'){
	                continue;
	            }

	            item.attr(i, desc[i]);
	        }

	        item.on({
	            mouseover: function(evt){
	                JSB.cancelDefer('DataCube.Formatter.outItemEvt');

	                JSB.defer(function(){
	                    $this.openEditMenuTool($this.$(evt.target));
	                }, 200, 'DataCube.Formatter.overItemEvt');
	            },
	            mouseout: function(evt){
	                JSB.cancelDefer('DataCube.Formatter.overItemEvt');
	                JSB.defer(function(){
	                    if($this.editMenuTool){
	                        $this.editMenuTool.close();
	                    }
	                }, 200, 'DataCube.Formatter.outItemEvt');
	            }
	        })

	        this._editor.append(item);
	    },

	    createItemsList: function(linkedValues){
            this._itemsList = [];

            // create linked fields (bindings)
            /**********/
            if(this._scheme.linkTo){
                if(!linkedValues){
                    linkedValues = this.getValueByKey(this._scheme.linkTo);
                }

                function collectFields(desc, path){
                    if(!desc){
                        return;
                    }
                    if(desc.type == 'array'){
                        collectFields(desc.arrayType, path);
                    } else if(desc.type == 'object'){
                        var fieldArr = Object.keys(desc.record);
                        fieldArr.sort(function(a, b){
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        });
                        for(var i = 0; i < fieldArr.length; i++){
                            var f = fieldArr[i];
                            var rf = desc.record[f];
                            var curPath = (path ? path + '.' : '') + f;
                            var schemeRef = JSB.merge({field: f}, rf);
                            var item = {
                                key: 'binding$' + curPath,
                                type: schemeRef.type,
                                value: schemeRef.field
                            };

                            $this._itemsList.push(item);
                            collectFields(rf, curPath);
                        }
                    }
                }

                collectFields(linkedValues.values[0].binding, '');
            }
            /**********/

            // create variables from scheme
            if(this._scheme.formatterOpts.variables){
                for(var i = 0; i < this._scheme.formatterOpts.variables.length; i++){
                    this._itemsList.push({
                        key: this._scheme.formatterOpts.variables[i].value,
                        type: this._scheme.formatterOpts.variables[i].type,
                        title: this._scheme.formatterOpts.variables[i].title,
                        value: this._scheme.formatterOpts.variables[i].alias
                    });
                }
            }
	    },

	    openAddTool: function(){
	        if(!this._itemsList){
	            this.createItemsList();
	        }

            ToolManager.activate({
				id: 'formatterAddTool',
				cmd: 'show',
				data: {
				    variables: this._itemsList
				},
				scope: null,
				target: {
					selector: this._addBtn,
					dock: 'bottom',
					offsetVert: -1
				},
				constraints: [{
					selector: this._addBtn,
					weight: 10.0
				}],
				callback: function(desc){
				    $this.createItem(desc);
				    $this.updateValue();
				}
			});
	    },

	    openEditMenuTool: function(target){
	        this.editMenuTool = ToolManager.activate({
                id: 'formatterEditMenuTool',
                cmd: 'show',
                data: {
                    dataType: target.attr('dataType')
                },
                scope: null,
                target: {
                    selector: target,
                    dock: 'top',
                    offsetVert: 1
                },
                constraints: [{
                    selector: target,
                    weight: 10.0
                }],
                callback: function(cmd){
                    if(cmd === 'delete'){
                        target.remove();
                        $this.updateValue();
                    } else {
                        $this.openEditTool(target);
                    }
                }
            });
	    },

	    openEditTool: function(target){
	        this.editTool = ToolManager.activate({
                id: 'formatterEditTool',
                cmd: 'show',
                data: {
                    key: target.attr('key'),
                    type: target.attr('type'),
                    dataType: target.attr('dataType'),

                    // numbers format only
                    decimals: target.attr('decimals'),
                    isThousandSeparate: target.attr('isThousandSeparate'),
                    // date format only
                    dateFormat: target.attr('dateFormat'),

                    value: target.text()
                },
                scope: null,
                target: {
                    selector: target,
                    dock: 'top',
                    offsetVert: 1
                },
                constraints: [{
                    selector: target,
                    weight: 10.0
                }],
                callback: function(desc){
                    for(var i in desc){
                        if(i === 'value'){
                            target.text(desc[i]);
                            continue;
                        }

                        target.attr(i, desc[i]);
                    }

                    $this.updateValue();
                }
            });
	    },

	    restoreValues: function(){
	        if(!this._values.values[0].valElements){
	            return;
            }

	        for(var i = 0; i < this._values.values[0].valElements.length; i++){
	            this.createItem(this._values.values[0].valElements[i]);
	        }
	    },

	    updateValue: function(){
            var elements = this._editor.find('>span'),
                valElements = [],
                value = '';

            for(var i = 0; i < elements.length; i++){
                var el = this.$(elements[i]);

                var desc = {
                    key: el.attr('key'),
                    type: el.attr('type'),
                    dataType: el.attr('dataType'),

                    // numbers format only
                    decimals: el.attr('decimals'),
                    isThousandSeparate: el.attr('isThousandSeparate'),
                    // date format only
                    dateFormat: el.attr('dateFormat'),

                    value: el.text()
                };

                if(desc.type === 'variable'){
                    value += '{' + desc.key;

                    switch(desc.dataType){
                        case 'number':
                        case 'integer':
                        case 'float':
                            value += ':';

                            if(!JSB.isDefined(desc.isThousandSeparate) || desc.isThousandSeparate){
                                desc.isThousandSeparate = true;
                                value += ',';

                                el.attr('isThousandSeparate', desc.isThousandSeparate);
                            }

                            if(JSB.isDefined(desc.decimals)){
                                value += '.' + desc.decimals + 'f';
                            } else {
                                if(desc.type === 'float'){
                                    desc.decimals = 2;

                                    value += '.2f';
                                } else {
                                    desc.decimals = 0;

                                    value += '.0f';
                                }

                                el.attr('decimals', desc.decimals);
                            }

                            break;
                        case 'date':
                            value += ':';

                            if(!JSB.isDefined(desc.dateFormat)){
                                desc.dateFormat = '%d-%m-%Y';

                                el.attr('dateFormat', desc.dateFormat);
                            }

                            value += desc.dateFormat;
                            break;
                    }

                    value += '}';
                } else {
                    value += desc.key;
                }

                valElements.push(desc);
            }

            this._values.values[0] = {
                value: value,
                valElements: valElements
            }

	        this.onchange();
	    }
	}
}