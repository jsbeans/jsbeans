{
	$name: 'Unimap.Render.Formatter',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Controls.Select', 'JSB.Controls.Editor', 'JSB.Controls.Checkbox', 'JSB.Controls.Switch', 'DataCube.Controls.SchemeSelector'],

	    _beans: [],
	    _selectors: [],
	    _basicVariablesList: [],
	    _formatterVariablesList: [],

	    _editorValue: '',

	    construct: function(){
	        this.addClass('formatter');
	        this.loadCss('Formatter.css');

	        this._scheme.formatterOpts = this._scheme.formatterOpts || {};

            this._name = this.$('<span class="name">' + this._scheme.name + '</span>');
            this.append(this._name);

            this.createRequireDesc(this._name);
            this.createDescription(this._name);

            if(!this._values.values[0]){
                this._values.values.push({});
            }

	        this.createBasicVariablesList();
	        this.createFormatterVariablesList();

	        if(this._scheme.formatterOpts.basicSettings && this._basicVariablesList.length > 0){
                // settings type switch
                this._settingsTypeSwitch = new Switch({
                    checked: this._values.values[0].isAdvancedSettings,
                    cssClass: 'settingsTypeSwitch',
                    label: 'Расширенные настройки',
                    leftLabel: true,
                    onchange: function(b){
                        if(b){
                            $this._basicSettings.addClass('hidden');
                            $this._advancedSettings.removeClass('hidden');
                        } else {
                            $this._basicSettings.removeClass('hidden');
                            $this._advancedSettings.addClass('hidden');
                        }

                        $this._values.values[0].isAdvancedSettings = b;
                    }
                });
                this.append(this._settingsTypeSwitch);
	        }

            if(this._scheme.formatterOpts.basicSettings){
                // basic settings
                /*********/
                this._basicSettings = this.$('<div class="basicSettings ' + (this._values.values[0].isAdvancedSettings ? 'hidden' : '') + '"></div>');
                this.append(this._basicSettings);

                this.createBasicSettings();
                /*********/
            }

            // advanced settings
            /*********/
            if(this._basicVariablesList.length > 0){
                var hidden = (this._scheme.formatterOpts.basicSettings && !this._values.values[0].isAdvancedSettings) ? 'hidden' : '';

                this._advancedSettings = this.$('<div class="advancedSettings ' + hidden + '"></div>');
                this.append(this._advancedSettings);

                this.createAdvancedSettings();
            }
            /*********/
	    },

	    addFormatterVariableItem: function(obj){
	        var value = obj.value;

	        if(value instanceof jQuery){
	            value = value.clone();
	        }

            var item = this.$('<li key="' + obj.key + '" title="' + (obj.title ? obj.title : '') + '">' + value + '</li>');
            item.click(function(evt){
                $this.addVariableToText(obj.value);
                $this._dropDownList.addClass('hidden');
                $this.$(document).off('click.formatter_closeDD');
                evt.stopPropagation();
            });

            this._dropDownList.append(item);
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

	    changeLinkTo: function(linkedValues){
	        this._dropDownList.empty();

	        this.createBasicVariablesList(linkedValues);
	        this.createFormatterVariablesList();

	        for(var i = 0; i < this._selectors.length; i++){
	            this._selectors[i].setOptions(this._basicVariablesList);
	        }
	    },

	    changeValue: function(){
	        if(this._values.values[0].isAdvancedSettings || !this._scheme.formatterOpts.basicSettings){
                var editBlockCopy = this._editBlock.clone(),
                    variables = editBlockCopy.find('>span.variable');

                for(var i = 0; i < variables.length; i++){
                    var key = this.$(variables[i]).attr('key'),
                        index = this._findInArray(this._formatterVariablesList, 'value', key),
                        valIndex = this._findInArray(this._values.values[0].variables, 'alias', key);

                    if(index > -1){
                        var typeSettings = '';

                        if(valIndex > -1 && this._values.values[0].variables[valIndex].typeSettings){
                            typeSettings = ':' + this._values.values[0].variables[valIndex].typeSettings.formatPart;
                        }
                        this.$(variables[i]).replaceWith('{' + $this._formatterVariablesList[index].innerValue + typeSettings + '}');
                    }
                }

                var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox');

                if(isFirefox > -1 && Number(navigator.userAgent.substring(isFirefox + 8)) < 60){ // for astralinux firefox ver. 44.0.2
                    var editableValue = this._editBlock.html().replace(/&nbsp;/g, ' ')
                                                              .replace(/&lt;/g, '<')
                                                              .replace(/&gt;/g, '>')
                                                              .replace(/&amp;/g, '&'),
                        advancedValue = editBlockCopy.html().replace(/&nbsp;/g, ' ')
                                                            .replace(/&lt;/g, '<')
                                                            .replace(/&gt;/g, '>')
                                                            .replace(/&amp;/g, '&');

                    this._values.values[0].editableValue = editableValue === '<br> ' ? '' : editableValue;
                    this._values.values[0].advancedValue = advancedValue === '<br> ' ? '' : advancedValue;
                } else {
                    this._values.values[0].editableValue = this._editBlock.html().replace(/&nbsp;/g, ' ')
                                                                                 .replace(/&lt;/g, '<')
                                                                                 .replace(/&gt;/g, '>')
                                                                                 .replace(/&amp;/g, '&');

                    this._values.values[0].advancedValue = editBlockCopy.html().replace(/&nbsp;/g, ' ')
                                                                               .replace(/&lt;/g, '<')
                                                                               .replace(/&gt;/g, '>')
                                                                               .replace(/&amp;/g, '&');
                }
	        } else {
	            this._values.values[0].baseValue = ('{' + this._values.values[0].basicSettings.value + (this._values.values[0].basicSettings.typeSettings ? (':' + this._values.values[0].basicSettings.typeSettings.formatPart) : '') + '} ').trim();
            }

            this.onchange();
	    },

	    createBasicVariablesList: function(linkedValues){
	        this._basicVariablesList = [];

	        if(!linkedValues){
	            linkedValues = this.getValueByKey(this._scheme.linkTo);
	        }

            if(linkedValues){
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
                                innerValue: 'binding$' + curPath,
                                key: 'binding$' + curPath,
                                child: [],
                                scheme: schemeRef,
                                type: schemeRef.type,
                                parent: parent,
                                value: schemeRef.field
                            };

                            $this._basicVariablesList.push(item);
                            collectFields(rf, curPath);
                        }
                    }
                }

                collectFields(linkedValues.values[0].binding, '');
            }

            if(this._scheme.formatterOpts.variables){
                for(var i = 0; i < this._scheme.formatterOpts.variables.length; i++){
                    this._basicVariablesList.push({
                        innerValue: this._scheme.formatterOpts.variables[i].value,
                        key: this._scheme.formatterOpts.variables[i].alias,
                        scheme: {
                            type: this._scheme.formatterOpts.variables[i].type,
                            field: this._scheme.formatterOpts.variables[i].alias
                        },
                        type: this._scheme.formatterOpts.variables[i].type,
                        title: this._scheme.formatterOpts.variables[i].title,
                        value: this._scheme.formatterOpts.variables[i].alias
                    });
                }
            }
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
	    },

	    createBasicVariableItem: function(variable){
	        if(!variable){
	            variable = {}
	            this._values.values[0].variables.push(variable);
	        }

	        function createDefaultAlias(item){
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

	        var varItem = this.$('<div class="variableItem"></div>');

            // select basic variable for formatting
            /*********/
	        var selectLabel = this.$('<div class="selectLabel">Переменная</div>');
	        varItem.append(selectLabel);

            var select = new SchemeSelector({
                items: this._basicVariablesList,
                value: variable.value,
                selectNodes: false,
                onChange: function(key, val){
                    if(editor.getValue() === ''){
                        createDefaultAlias(val);
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

                    if(variable.type){
                        var typeSettings = $this.createTypeSettings(variable)
                        if(typeSettings){
                            varItem.append(typeSettings);
                        }
                    }
                }
            });

	        /*
	        var select = new Select({
                options: this._basicVariablesList,
                value: variable.value,
                onchange: function(val){
                    if(editor.getValue() === ''){
                        createDefaultAlias(val);
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

                    if(variable.type){
                        var typeSettings = $this.createTypeSettings(variable)
                        if(typeSettings){
                            varItem.append(typeSettings);
                        }
                    }
                }
	        });
	        */
	        selectLabel.append(select.getElement());
	        this._selectors.push(select);
            /*********/

            // alias editor
            /*********/
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
            /*********/

            // remove btn
            /*********/
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
            /*********/

            // type settings
            /*********/
            if(variable.type){
                var typeSettings = this.createTypeSettings(variable)
                if(typeSettings){
                    varItem.append(typeSettings);
                }
            }
            /*********/

            return varItem;
	    },

	    createBasicSettings: function(){
	        if(!this._values.values[0].basicSettings){
	            this._values.values[0].basicSettings = {
	                type: this._scheme.formatterOpts.basicSettings.type,
	                value: this._scheme.formatterOpts.basicSettings.value
	            }
	        }

	        var typeSettings = this.createTypeSettings(this._values.values[0].basicSettings);
	        this._basicSettings.append(typeSettings);
	    },

	    createAdvancedSettings: function(){
            /* variables */
            if(this._basicVariablesList.length > 0){
                this._advancedSettings.append('<h3>Переменные</h3>');

                var variablesBlock = this.$('<div class="variablesBlock"></div>');
                this._advancedSettings.append(variablesBlock);

                var addVarBtn = this.$('<i class="btn btnMultiple addVar fas fa-plus-circle"></i>');
                addVarBtn.click(function(){
                    if(!$this._values.values[0].variables){
                        $this._values.values[0].variables = [];
                    }

                    variablesBlock.append($this.createBasicVariableItem());
                });
                this._advancedSettings.append(addVarBtn);

                if(this._values.values[0].variables){
                    for(var i = 0; i < this._values.values[0].variables.length; i++){
                        variablesBlock.append(this.createBasicVariableItem(this._values.values[0].variables[i]));
                    }
                }
	        }

	        /* editor */
	        this._advancedSettings.append('<h3>Формат</h3>');

	        this._editBlock = this.$('<div class="editBlock" contenteditable></div>');
	        this._editBlock.keyup(function(evt){
	            $this.changeEvent();
	        });
	        this._advancedSettings.append(this._editBlock);

	        /* format variables btn */
	        var addButton = this.$('<i class="btn btnMultiple addVarToTextBtn fas fa-plus-circle"></i>');
	        addButton.click(function(evt){
	            evt.stopPropagation();

                if($this._dropDownList.hasClass('hidden')){
                    $this._dropDownList.removeClass('hidden');

                    var top = $this.getElement().offset().top,
                        elementHeight = $this.getElement().height(),
                        ddHeight = $this._dropDownList.outerHeight(),
                        bodyHeight = $this.$(window).height(),
                        btnLeft = addButton.position().left;

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
	        this._advancedSettings.append(addButton);

	        /* format variables dd */
	        this._dropDownList = this.$('<ul class="dropDown hidden"></ul>');
	        this._advancedSettings.append(this._dropDownList);

	        for(var i = 0; i < this._formatterVariablesList.length; i++){
	            this.addFormatterVariableItem(this._formatterVariablesList[i]);
	        }

	        if(this._values.values[0].editableValue){
	            this.restoreValue(this._values.values[0].editableValue);
	            this._editorValue = this._values.values[0].editableValue;
	        }
	    },

	    createTypeSettings: function(variable){
            var settingsItem = this.$('<div class="typeSettings"></div>');

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
                    var desc = '<b>Форматирование даты</b><br/>%Y - год<br/>%m - месяц<br/>%d - день<br/><a href="http://php.net/manual/en/function.strftime.php" target="_blank">Больше форматов</a>',
                        description = this.$('<div class="description hidden">' + desc + '</div>'),
                        msgIcon = this.createMsgIcon(description, 'desc fas fa-question-circle');

                    var dateLabel = this.$('<label class="label dateLabel">Формат даты</label>');
                    dateLabel.append(msgIcon);
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
	                settingsItem.append(description);
	                this._beans.push(dateFormat);
                    break;
                default:
                    delete variable.typeSettings;
                    return;
	        }

	        return settingsItem;
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
	        var splitter = '<span',
                isInside = false,
                segment,
                index;

	        while (str) {
	            index = str.indexOf(splitter);

                if (index === -1) {
                    break;
                }

                segment = str.slice(0, index);

                if (isInside) { // we're on the closing bracket looking back
                    this._editBlock.append(this.$(segment + '</span>'));
                    str = str.slice(index + 7);
                } else {
                    this._editBlock.append(document.createTextNode(segment));
                    str = str.slice(index);
                }

                isInside = !isInside; // toggle
                splitter = isInside ? '</span>' : '<span'; // now look for next matching bracket
	        }

	        this._editBlock.append(document.createTextNode(str));
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