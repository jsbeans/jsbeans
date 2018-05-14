{
	$name: 'Unimap.Render.Formatter',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Controls.Select', 'JSB.Controls.Editor', 'JSB.Controls.Checkbox'],

	    _beans: [],
	    _selectors: [],
	    _basicVariablesList: [],
	    _formatterVariablesList: [],

	    _defaultOpts: {
	        variablesBlock: true
	    },
	    _editorValue: '',

	    construct: function(){
	        this.addClass('formatter');
	        this.loadCss('Formatter.css');

            this._name = this.$('<span class="name">' + this._scheme.name + '</span>');
            this.append(this._name);

            this.createRequireDesc(this._name);
            this.createDescription(this._name);

            JSB.merge(this._scheme.formatterOpts, this._defaultOpts);

            this.createBasicVariablesList();

            /* variables */
            if(this._scheme.formatterOpts.variablesBlock){
                this.append('<h3>Переменные</h3>');

                this._variablesBlock = this.$('<div class="variablesBlock"></div>');
                this.append(this._variablesBlock);

                var addVarBtn = this.$('<i class="btn btnMultiple addVarBtn fas fa-plus-circle"></i>');
                addVarBtn.click(function(){
                    $this.addVariable();
                });
                this.append(addVarBtn);
	        }

	        /* editor */
	        this.append('<h3>Формат</h3>');

	        this._editBlock = this.$('<div class="editBlock" contenteditable></div>');
	        this._editBlock.keyup(function(evt){
	            $this.changeEvent();
	        });
	        this.append(this._editBlock);

	        /* add btn */
	        this._addButton = this.$('<i class="btn btnMultiple addVarToTempBtn fas fa-plus-circle"></i>');
	        this._addButton.click(function(evt){
	            evt.stopPropagation();

                if($this._dropDownList.hasClass('hidden')){
                    $this._dropDownList.removeClass('hidden');

                    var top = $this.getElement().offset().top,
                        elementHeight = $this.getElement().height(),
                        ddHeight = $this._dropDownList.outerHeight(),
                        bodyHeight = $this.$(window).height(),
                        btnLeft = $this._addButton.position().left;

                    if(bodyHeight <= top + elementHeight + ddHeight){
                        $this._dropDownList.css('top', 'initial');
                        $this._dropDownList.css('bottom', elementHeight);
                    } else {
                        $this._dropDownList.css('top', elementHeight);
                        $this._dropDownList.css('bottom', 'initial');
                    }

                    $this._dropDownList.css('left', btnLeft + 16 - $this._dropDownList.outerWidth());

                    $this.$(document).on('click.formatter_closeDD', function(evt){
                        if(!$this._dropDownList.is(evt.target) && $this._dropDownList.has(evt.target).length === 0){
                            $this._dropDownList.addClass('hidden');
                            $this.$(document).off('click.formatter_closeDD');
                        }
                    });
                } else {
                    $this._dropDownList.addClass('hidden');
                }
	        });
	        this.append(this._addButton);

	        /* dropdown */
	        this._dropDownList = this.$('<ul class="dropDown hidden"></ul>');
	        this.append(this._dropDownList);

            if(!this._values.values[0]){
                this._values.values.push({});
            }

	        this.createFormatterVariablesList();

	        if(this._scheme.formatterOpts.variablesBlock){
                if(this._values.values[0].variables){
                    for(var i = 0; i < this._values.values[0].variables.length; i++){
                        this.addVariable(this._values.values[0].variables[i]);
                    }
                }
	        }

	        if(this._values.values[0].value){
	            this._editBlock.html(this.restoreValue(this._values.values[0].value));
	        }
	    },

	    addFormatterVariableItem: function(obj){
	        var value = obj.value;

	        if(value instanceof jQuery){
	            value = value.clone();
	        }

            var item = this.$('<li key="' + obj.key + '" title="' + (obj.title ? obj.title : '') + '">' + value + '</li>');
            item.click(function(evt){
                $this.addVariableToText(obj.key);
                $this._dropDownList.addClass('hidden');
                $this.$(document).off('click.formatter_closeDD');
                evt.stopPropagation();
            });

            this._dropDownList.append(item);
	    },

	    addVariable: function(variable){
	        if(!this._values.values[0].variables){
	            this._values.values[0].variables = [];
	        }

	        if(!variable){
	            variable = {}
	            this._values.values[0].variables.push(variable);
	        }

	        // functions
	        function createAlias(item){
	            var newAlias = item.options.value,
	                count = 1;

                while($this._findInArray($this._formatterVariablesList, 'value', newAlias) !== -1){
                    newAlias = item.options.value + '_' + count;
                    count++;
                }

                var newItem = {
                    innerValue: item.options.innerValue,
                    key: newAlias,
                    value: newAlias
                };

	            $this._formatterVariablesList.push(newItem);

                editor.setValue(newAlias);

                $this.addFormatterVariableItem(newItem);

                oldAlias = newAlias;
                variable.alias = newAlias;
	        }

	        /* create item */
	        var varItem = this.$('<div class="variableItem"></div>');

	        var selectLabel = this.$('<div class="selectLabel">Переменная</div>');
	        varItem.append(selectLabel);

	        var select = new Select({
                options: this._basicVariablesList,
                value: variable.value,
                onchange: function(val){
                    if(editor.getValue() === ''){
                        createAlias(val);
                    } else {
                        var itemIndex = $this._findInArray($this._formatterVariablesList, 'value', variable.alias);

                        if(itemIndex > -1){
                            $this._formatterVariablesList[itemIndex].value = val.key;
                            $this._formatterVariablesList[itemIndex].innerValue = val.options.innerValue;
                            $this._formatterVariablesList[itemIndex].type = val.options.type;
                        }
                    }

                    variable.innerValue = val.options.innerValue;
                    variable.type = val.options.type;
                    variable.value = val.key;

                    $this.createTypeSettings(typeSettings, variable);
                }
	        });
	        selectLabel.append(select.getElement());
	        this._selectors.push(select);

	        var editorLabel = this.$('<label class="editorLabel">Алиас</label>');
	        varItem.append(editorLabel);

	        var editor = new Editor({
                value: variable.alias,
                onchange: function(val){
	                var itemIndex = $this._findInArray($this._formatterVariablesList, 'value', variable.alias);

                    if(itemIndex > -1){
                        $this._formatterVariablesList[itemIndex].value = val;
                    }

                    $this._dropDownList.find('li[key="' + variable.alias + '"]').attr('key', val).text(val);

                    variable.alias = val;
                }
	        });
	        editorLabel.append(editor.getElement());
	        this._beans.push(editor);

	        var removeBtn = this.$('<i class="btn btnDelete fas fa-times"></i>');
	        removeBtn.click(function(){
	            var key = editor.getValue(),
	                itemIndex = $this._findInArray($this._formatterVariablesList, 'value', key),
	                valueIndex = $this._findInArray($this._values.values[0].variables, 'alias', key);

                if(itemIndex > -1){
                    $this._formatterVariablesList.splice(itemIndex, 1);
                }

                if(valueIndex > -1){
                    $this._values.values[0].variables.splice(valueIndex, 1);
                }

                $this._dropDownList.find('li[key="' + key + '"]').remove();

	            varItem.remove();
	        });
	        varItem.append(removeBtn);

	        // type settings
	        var typeSettings = this.$('<div class="typeSettings"></div>');
	        varItem.append(typeSettings);

	        if(variable.type){
	            this.createTypeSettings(typeSettings, variable);
	        }

	        this._variablesBlock.append(varItem);
	    },

	    addVariableToText: function(value){
            function pasteHtmlAtCaret(html) {
                var sel, range;
                if (window.getSelection) {
                    // IE9 and non-IE
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        // Range.createContextualFragment() would be useful here but is
                        // non-standard and not supported in all browsers (IE9, for one)
                        var el = document.createElement("div");
                        el.innerHTML = html;
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ( (node = el.firstChild) ) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);

                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                } else if (document.selection && document.selection.type != "Control") {
                    // IE < 9
                    document.selection.createRange().pasteHTML(html);
                }
            }

            this._editBlock.focus();
            pasteHtmlAtCaret('<span class="variable" key="' + value + '" contenteditable="false">' + value + '</span> ');

            this.changeEvent();
	    },

	    changeEvent: function(){
            var val = this._editBlock.html();
            if(val !==  this._editorValue){
                this._editorValue = val;

                JSB.defer(function(){
                    $this.changeValue();
                }, 1000, '_formatter.changeValue' + this.getId());
            }
	    },

	    changeLinkTo: function(){
	        this._dropDownList.empty();

	        this.createBasicVariablesList();
	        this.createFormatterVariablesList();

	        for(var i = 0; i < this._selectors.length; i++){
	            this._selectors[i].setOptions(this._basicVariablesList);
	        }
	    },

	    changeValue: function(){
	        var editBlockCopy = this._editBlock.clone(),
	            variables = editBlockCopy.find('>span.variable');

            // todo: bindings

            for(var i = 0; i < variables.length; i++){
                var key = this.$(variables[i]).attr('key'),
                    index = this._findInArray(this._formatterVariablesList, 'value', key),
                    valIndex = this._findInArray(this._values.values[0].variables, 'alias', key);

                if(index > -1){
                    var typeSettings = '';

                    if(valIndex > -1 && this._values.values[0].variables[valIndex].typeSettings){
                        typeSettings = ':' + this._values.values[0].variables[valIndex].typeSettings.formatPart;
                    }
                    variables[i].replaceWith('{' + $this._formatterVariablesList[index].innerValue + typeSettings + '}');
                }
            }

            this._values.values[0].value = editBlockCopy.html().replace(/&nbsp;/, ' ');

            this.onchange();
	    },

	    createFormatterVariablesList: function(){
	        this._formatterVariablesList = JSB.clone(this._basicVariablesList);

            if(this._values.values[0].variables){
                for(var i = 0; i < this._values.values[0].variables.length; i++){
                    this._formatterVariablesList.push({
                        innerValue: this._values.values[0].variables[i].innerValue,
                        key: this._values.values[0].variables[i].alias,
                        type: this._values.values[0].variables[i].type,
                        value: this._values.values[0].variables[i].alias
                    });
                }
            }

            for(var i = 0; i < this._formatterVariablesList.length; i++){
                this.addFormatterVariableItem(this._formatterVariablesList[i]);
            }
	    },

	    createBasicVariablesList: function(){
	        this._basicVariablesList = [];

	        var linkedValues = this.getValueByKey(this._scheme.linkTo);

            if(linkedValues){
                for(var i = 0; i < linkedValues.values.length; i++){
                    if(!linkedValues.values[i].binding){
                        continue;
                    }

                    for(var j in linkedValues.values[i].binding.arrayType.record){
                        this._basicVariablesList.push({
                            innerValue: 'binding.' + j,
                            key: 'binding.' + j,
                            type: linkedValues.values[i].binding.arrayType.record[j].type,
                            value: j
                        });
                    }
                }
            }

	        for(var i = 0; i < this._scheme.formatterOpts.variables.length; i++){
	            this._basicVariablesList.push({
	                innerValue: this._scheme.formatterOpts.variables[i].value,
	                key: this._scheme.formatterOpts.variables[i].alias,
	                type: this._scheme.formatterOpts.variables[i].type,
	                title: this._scheme.formatterOpts.variables[i].title,
	                value: this._scheme.formatterOpts.variables[i].alias
	            });
	        }
	    },

	    createTypeSettings: function(settingsItem, variable){
            settingsItem.empty();

            if(!variable.typeSettings){
                variable.typeSettings = {}
            }

	        switch(variable.type){
	            case 'number':
	            case 'integer':
	            case 'float':
	                if(!variable.typeSettings.formatPart){
	                    variable.typeSettings.formatPart = variable.type === 'float' ? ',.2f' : ',.0f';
	                }

	                var separator = new Checkbox({
	                    label: 'Разделение тысячных',
	                    checked: JSB.isDefined(variable.typeSettings.separator) ? variable.typeSettings.separator : true,
	                    onchange: function(b){
	                        variable.typeSettings.separator = b;

	                        variable.typeSettings.formatPart = variable.typeSettings.formatPart.replace(b ? /./ : /,/, b ? ',.' : '');

	                        $this.changeValue();
	                    }
	                });
	                settingsItem.append(separator.getElement());
	                this._beans.push(separator);

	                var decimalsLabel = this.$('<label class="label decimalsLabel">Число знаков после запятой</label>');
	                var decimals = new Editor({
                        value: JSB.isDefined(variable.typeSettings.decimals) ? variable.typeSettings.decimals : (variable.type === 'float' ? 2 : 0),
                        onchange: function(val){
                            variable.typeSettings.decimals = val;

                            variable.typeSettings.formatPart = variable.typeSettings.formatPart.replace(/[0-9]+/, val);

                            $this.changeValue();
                        }
	                });
	                decimalsLabel.append(decimals.getElement());
	                settingsItem.append(decimalsLabel);
	                this._beans.push(decimals);
	                break;
                case 'date':
                    var dateLabel = this.$('<label class="label dateLabel">Формат даты</label>');
                    var dateFormat = new Editor({
                        value: JSB.isDefined(variable.typeSettings.dateFormat) ? variable.typeSettings.dateFormat : '%d-%m-%Y',
                        onchange: function(val){
                            variable.typeSettings.dateFormat = val;

                            variable.typeSettings.formatPart = val;

                            $this.changeValue();
                        }
                    });
                    dateLabel.append(dateFormat.getElement());
	                settingsItem.append(dateLabel);
	                this._beans.push(dateFormat);
                    break;
	        }
	    },

	    destroy: function(){
	        for(var i = 0; i < this._beans.length; i++){
	            this._beans[i].destroy();
	        }

	        for(var i = 0; i < this._selectors.length; i++){
	            this._selectors[i].destroy();
	        }

	        $base();
	    },

	    restoreValue: function(str){
            var splitter = '{',
                isInside = false,
                segment,
                valueAndFormat,
                path,
                i,
                len,
                ret = [],
                index;

            while (str) {
                index = str.indexOf(splitter);
                if (index === -1) {
                    break;
                }

                segment = str.slice(0, index);
                if (isInside) { // we're on the closing bracket looking back
                    value= segment.split(':')[0];

                    var el = null;
                    for(var i = 0; i < this._formatterVariablesList.length; i++){
                        if(this._formatterVariablesList[i].innerValue === value){
                            el = '<span class="variable" key="' + this._formatterVariablesList[i].value + '" contenteditable="false">' + this._formatterVariablesList[i].value + '</span> '
                        }
                    }

                    // Push the result and advance the cursor
                    ret.push(el);
                } else {
                    ret.push(segment);

                }
                str = str.slice(index + 1); // the rest
                isInside = !isInside; // toggle
                splitter = isInside ? '}' : '{'; // now look for next matching bracket
            }
            ret.push(str);
            return ret.join('');
	    },

	    _findInArray: function(arr, key, value){
	        if(!arr){
	            return -1;
	        }

	        for(var i = 0; i < arr.length; i++){
	            if(arr[i][key] === value){
	                return i;
	            }
	        }

	        return -1;
	    }
	}
}