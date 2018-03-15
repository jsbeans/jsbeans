{
    $name: 'Datacube.ValueConverter',
    $singleton: true,
    $server: {
        $require: ['JSB.Workspace.WorkspaceController'],

        $constructor: function(){
            function traverse(src, val, callback){
                if(!src.used){
                    return;
                }
                var sCont = {bStop : false};
                var nVal = callback.call($this, src, val, function(){
                    sCont.bStop = true;
                });

                if(sCont.bStop){
                    return;
                }
                if(src.type == 'group'){
                    for(var i = 0; i < src.groups.length; i++){
                        var gDesc = src.groups[i];
                        for(var j = 0; j < gDesc.items.length; j++){
                            traverse(gDesc.items[j], nVal, callback);
                        }
                    }
                } else if(src.type == 'select'){
                    var iDesc = src.items[src.chosenIdx];
                    traverse(iDesc, nVal, callback);
                } else if(src.type == 'widget'){
                    var wDesc = src.values;
                    traverse(wDesc, nVal, callback);
                }
            }

            this.Selector = function(ref){
                if(ref instanceof $this.Selector){
                    this.selector = JSB.clone(ref.selector);
                } else {
                    this.selector = ref;
                    if(!JSB.isArray(this.selector)){
                        this.selector = [this.selector];
                    }
                }
            };

            this.Selector.prototype = {
                binding: function(){
                    if(this.selector.length == 0){
                        return;
                    }

                    var item = this.selector[0];
                    if(!item.used){
                        return;
                    }
                    if(item.type == 'group' || item.type == 'select'){
                        return item.binding;
                    } else if(item.type == 'item'){
                        var bArr = [];
                        for(var i = 0; i < item.values.length; i++){
                            bArr.push(item.values[i].binding);
                        }
                        return bArr;
                    } else if(item.type == 'widget'){
                        if(item.widget && item.widget.jsb){
                            return item.widget;
                        }
                    }
                },

                find: function(key){
                    var foundArr = [];
                    for(var i = 0; i < this.selector.length; i++){
                        var obj = this.selector[i];
                        traverse(obj, null, function(item, val, stop){
                            if(item.type == 'widget'){
                                stop();
                            }
                            if(item.key == key){
                                foundArr.push(item);
                            }
                        });
                    }
                    return new $this.Selector(foundArr);
                },

                get: function(idx){
                    if(this.selector.length == 0){
                        return null;
                    }
                    if(!JSB.isDefined(idx)){
                        idx = 0;
                    }
                    if(idx >= this.selector.length){
                        return null;
                    }
                    return new $this.Selector(this.selector[idx], this.ctxName);
                },

                key: function(){
                    if(this.selector.length == 0){
                        return null;
                    }

                    var item = this.selector[0];
                    return item.key;
                },

                length: function(){
                    return this.selector.length;
                },

                used: function(){
                    if(this.selector.length == 0){
                        return false;
                    }

                    var item = this.selector[0];
                    return item.used;
                },

                value: function(){
                    if(this.selector.length == 0){
                        return null;
                    }
                    var item = this.selector[0];
                    if(!item.used){
                        return null;
                    }
                    if(item.type == 'item'){
                        if(item.values && item.values.length > 0){
                            return item.values[0].value;
                        }
                        return null;
                    } else if(item.type == 'select'){
                        return new $this.Selector(item.items[item.chosenIdx]);
                    } else if(item.type == 'group'){
                        if(item.groups.length == 0){
                            return null;
                        }
                        var gDesc = item.groups[0];
                        var items = [];
                        for(var j = 0; j < gDesc.items.length; j++){
                            items.push(gDesc.items[j]);
                        }
                        return new $this.Selector(items)
                    } else if(item.type == 'widget'){
                        return new $this.Selector(item.values);
                    }
                },

                values: function(){
                    if(this.selector.length == 0){
                        return null;
                    }
                    var item = this.selector[0];
                    var vals = [];
                    if(item.type == 'item'){
                        if(item.values && item.values.length > 0){
                            for(var i = 0; i < item.values.length; i++){
                                vals.push(item.values[i].value);
                            }
                        }
                    } else if(item.type == 'group'){
                        for(var i = 0; i < item.groups.length; i++){
                            var gDesc = item.groups[i];
                            var items = [];
                            for(var j = 0; j < gDesc.items.length; j++){
                                items.push(gDesc.items[j]);
                            }
                            vals.push(new $this.Selector(items, this.ctxName));
                        }
                    } else if(item.type == 'select'){
                        vals.push(new $this.Selector(item.items[item.chosenIdx], this.ctxName));
                    } else if(item.type == 'widget'){
                        vals.push(new $this.Selector(item.values, this.ctxName));
                    }
                    return vals;
                },

                unwrap: function(){
                    if(this.selector.length == 0){
                        return;
                    }
                    return this.selector[0];
                }
            }
        },

        convert: function(widgetName, values){
            if(!this._workId){
                var wIt = WorkspaceController.workspaceIds();

                this._workId = wIt.next();
            }

            try{
                var oldSelector = new this.Selector(values);

                JSB.getLogger().debug('Converting ' + widgetName);

                switch(widgetName){
                    case 'DataCube.Widgets.Html':
                        return this.convertHtml(oldSelector);
                    case 'DataCube.Widgets.ProgressBar':
                        return this.convertProgressBar(oldSelector);
                    case 'DataCube.Widgets.Table':
                        return this.convertTable(oldSelector);
                    case 'DataCube.Widgets.Text':
                        return this.convertText(oldSelector);

                    default:
                        return {
                            values: values,
                            linkedFields: {}
                        };
                }
            } catch(ex){
                JSB.getLogger().error(ex);

                return {
                    values: values,
                    linkedFields: {}
                };
            }
        },

        // general widgets
        convertHtml: function(oldVal){
            var args = [],
                oldArgs = oldVal.find('args').values();

            for(var i = 0; i < oldArgs.length; i++){
                args.push({
                    key: {
                        render: 'item',
                        values: [{
                            value: oldArgs[i].find('key').value()
                        }]
                    },
                    value: {
                        render: 'dataBinding',
                        values: [{
                            value: oldArgs[i].find('value').value() || this._bindingCheck(oldArgs[i].find('value').binding()),
                            binding: this._bindingCheck(oldArgs[i].find('value').binding())
                        }]
                    }
                })
            }

            var source = oldVal.find('record').binding();
            source.workspaceId = this._workId;

            return {
                values: {
                    record: {
                        render: 'sourceBinding',
                        values: [{
                            binding: source
                        }]
                    },
                    args: {
                        render: 'group',
                        values: args
                    },
                    template: {
                        render: 'item',
                        values: [{
                            value: oldVal.find('template').value()
                        }]
                    },
                    useIframe: {
                        render: 'item',
                        checked: oldVal.find('useIframe').used(),
                        values: []
                    }
                },

                linkedFields: {
                   record: ['value']
                }
            }
        },

        convertProgressBar: function(oldVal){
            var series = [],
                oldSeries = oldVal.find('series').values();

            for(var i = 0; i < oldSeries.length; i++){
                series.push({
                    type: {
                        render: 'select',
                        values: [{
                            value: oldSeries[i].find('type').value().value()
                        }]
                    },
                    min: {
                        render: 'dataBinding',
                        values: [{
                            value: oldSeries[i].find('min').value() || this._bindingCheck(oldSeries[i].find('min').binding()),
                            binding: this._bindingCheck(oldSeries[i].find('min').binding())
                        }]
                    },
                    max: {
                        render: 'dataBinding',
                        values: [{
                            value: oldSeries[i].find('max').value() || this._bindingCheck(oldSeries[i].find('max').binding()),
                            binding: this._bindingCheck(oldSeries[i].find('max').binding())
                        }]
                    },
                    val: {
                        render: 'dataBinding',
                        values: [{
                            value: oldSeries[i].find('val').value() || this._bindingCheck(oldSeries[i].find('val').binding()),
                            binding: this._bindingCheck(oldSeries[i].find('val').binding())
                        }]
                    },
                    valueFormat: {
                        render: 'item',
                        checked: oldSeries[i].find('valueFormat').used(),
                        defaultValue: '0,0.[00]',
                        values: [{
                            value: oldSeries[i].find('valueFormat').value()
                        }]
                    },
                    colColor: {
                        render: 'item',
                        defaultValue: '#555',
                        values: [{
                            value: oldSeries[i].find('colColor').value()
                        }]
                    },
                    colWidth: {
                        render: 'item',
                        defaultValue: 4,
                        values: [{
                            value: oldSeries[i].find('colWidth').value()
                        }]
                    },
                    trailColor: {
                        render: 'item',
                        defaultValue: '#eee',
                        values: [{
                            value: oldSeries[i].find('trailColor').value()
                        }]
                    },
                    trailWidth: {
                        render: 'item',
                        defaultValue: 2,
                        values: [{
                            value: oldSeries[i].find('trailWidth').value()
                        }]
                    },
                    css: {
                        render: 'item',
                        checked: oldSeries[i].find('css').used(),
                        values: [{
                            cssStyle: {
                                render: 'item',
                                value: oldSeries[i].find('css').value()
                            }
                        }]
                    },
                    textCss: {
                        render: 'item',
                        checked: oldSeries[i].find('textCss').used(),
                        values: [{
                            cssStyle: {
                                render: 'item',
                                value: oldSeries[i].find('textCss').value()
                            }
                        }]
                    }
                })
            }

            var source = oldVal.find('record').binding();
            source.workspaceId = this._workId;

            return {
                values: {
                    dataSource: {
                        render: 'sourceBinding',
                        values: [{
                            binding: source
                        }]
                    },
                    series: {
                        render: 'group',
                        values: series
                    }
                },

                linkedFields: {
                    dataSource: ['min', 'max', 'val']
                }
            }
        },

        convertTable: function(oldVal){
            var columns = [],
                oldColumns = oldVal.find('columns').values();

            if(oldColumns){
                for(var i = 0; i < oldColumns.length; i++){
                    var viewSel = oldColumns[i].find('view').value(),
                        view;

                    if(viewSel.key() === 'widgetGroup'){
                        var widgetSelector = viewSel.find('widget'),
                            wType = widgetSelector.unwrap().widget.jsb,
                            widgetSortValues = [],
                            widgetSortSel = widgetSelector.find('widgetSort').binding();

                        if(!JSB.isArray(widgetSortSel)){
                            widgetSortSel = [widgetSortSel];
                        }

                        for(var j = 0; j < widgetSortSel.length; j++){
                            widgetSortValues.push({
                                value: widgetSortSel[j],
                                binding: widgetSortSel[j]
                            });
                        }

                        view = [{
                            value: 'widgetGroup',
                            items: {
                                widget: {
                                    render: 'embeddedWidget',
                                    values: [{
                                        binding: {
                                            name: widgetSelector.unwrap().widget.name,
                                            jsb: wType
                                        },
                                        value: this.convert(wType, widgetSelector.value())
                                    }]
                                },
                                widgetSort: {
                                    render: 'switch',
                                    checked: oldColumns[i].find('widgetSort').used(),
                                    values: [{
                                        widgetSortFields: {
                                            render: 'dataBinding',
                                            values: widgetSortValues
                                        }
                                    }]
                                },
                                widgetContextFilter: {
                                    render: 'switch',
                                    checked: oldColumns[i].find('widgetContextFilter').used(),
                                    values: [{
                                        widgetContextFilterField: {
                                            render: 'dataBinding',
                                            values: [{
                                                value: oldColumns[i].find('widgetContextFilterField').value() || this._bindingCheck(oldColumns[i].find('widgetContextFilterField').binding()),
                                                binding: this._bindingCheck(oldColumns[i].find('widgetContextFilterField').binding())
                                            }]
                                        },
                                        widgetСontextFilterFixed: {
                                            render: 'item',
                                            checked: oldColumns[i].find('widgetСontextFilterFixed').used(),
                                            values: []
                                        }
                                    }]
                                }
                            }
                        }]
                    } else {
                        view = [{
                            value: 'textGroup',
                            items: {
                                text: {
                                    render: 'dataBinding',
                                    values: [{
                                        value: oldColumns[i].find('text').value() || this._bindingCheck(oldColumns[i].find('text').binding()),
                                        binding: this._bindingCheck(oldColumns[i].find('text').binding())
                                    }]
                                },
                                textSort: {
                                    render: 'item',
                                    checked: oldColumns[i].find('textSort').used(),
                                    values: []
                                },
                                contextFilter: {
                                    render: 'switch',
                                    checked: oldColumns[i].find('contextFilter').used(),
                                    values: [{
                                        contextFilterFixed: {
                                            render: 'item',
                                            checked: oldColumns[i].find('contextFilterFixed').used(),
                                            values: []
                                        }
                                    }]
                                },
                                textFormat: {
                                    render: 'switch',
                                    checked: oldColumns[i].find('textFormat').used(),
                                    values: [{
                                        format: {
                                            render: 'item',
                                            values: [{
                                                value: oldColumns[i].find('textFormat').value() || '0,0.[00]'
                                            }]
                                        }
                                    }]

                                }
                            }
                        }]
                    }

                    var summarySel = oldColumns[i].find('summary').values(),
                        summary = [];

                    if(oldColumns[i].find('summary').used()){
                        for(var j = 0; j < summarySel.length; j++){
                            var summaryOp = summarySel[j].find('summaryOp').value();

                            if(summaryOp){
                                summary.push({
                                    summaryOp: {
                                        render: 'select',
                                        values: [{
                                            value: summaryOp.value()
                                        }]
                                    },
                                    summaryPrefix: {
                                        render: 'item',
                                        values: [{
                                            value: summarySel[j].find('summaryPrefix').value() || 'Итого'
                                        }]
                                    },
                                    summaryPostfix: {
                                        render: 'item',
                                        values: [{
                                            value: summarySel[j].find('summaryPostfix').value()
                                        }]
                                    }
                                });
                            }
                        }
                    }

                    var col = {
                        title: {
                            render: 'item',
                            values: [{
                                value: oldColumns[i].find('title').value() || this._bindingCheck(oldColumns[i].find('title').binding())
                            }]
                        },
                        view: {
                            render: 'select',
                            values: view
                        },
                        summary: {
                            render: 'switch',
                            checked: oldColumns[i].find('summary').used(),
                            values: [{
                                summaryOpts: {
                                    render: 'group',
                                    values: summary
                                }
                            }]
                        },
                        cellAlign: {
                            render: 'group',
                            values: [{
                                alignHorz: {
                                    render: 'select',
                                    values: [{
                                        value: oldColumns[i].find('alignHorz').value().key()
                                    }]
                                },
                                alignVert: {
                                    render: 'select',
                                    values: [{
                                        value: oldColumns[i].find('alignVert').value().key()
                                    }]
                                },
                                css: {
                                    render: 'switch',
                                    checked: oldColumns[i].find('css').used(),
                                    values: [{
                                        cssValue: {
                                            render: 'item',
                                            values: [{
                                                value: oldColumns[i].find('css').value()
                                            }]
                                        }
                                    }]
                                }
                            }]
                        },
                        headerAlign: {
                            render: 'group',
                            values: [{
                                hAlignHorz: {
                                    render: 'select',
                                    values: [{
                                        value: oldColumns[i].find('hAlignHorz').value().key()
                                    }]
                                },
                                hAlignVert: {
                                    render: 'select',
                                    values: [{
                                        value: oldColumns[i].find('hAlignVert').value().key()
                                    }]
                                },
                                hCss: {
                                    render: 'switch',
                                    checked: oldColumns[i].find('hCss').used(),
                                    values: [{
                                        hCssValue: {
                                            render: 'item',
                                            values: [{
                                                value: oldColumns[i].find('hCss').value()
                                            }]
                                        }
                                    }]
                                }
                            }]
                        },
                        colWidth: {
                            render: 'item',
                            values: [{
                                value: oldColumns[i].find('colWidth').value()
                            }]
                        }
                    };

                    columns.push(col);
                }
            }

            var source = oldVal.find('rows').binding();
            source.workspaceId = this._workId;

            return {
                values: {
                    showHeader: {
                        render: 'item',
                        checked: oldVal.find('showHeader').used(),
                        values: []
                    },
                    showGrid: {
                        render: 'item',
                        checked: oldVal.find('showGrid').used(),
                        values: []
                    },
                    rows: {
                        render: 'sourceBinding',
                        values: [{
                            binding: source
                        }]
                    },
                    rowSettings: {
                        render: 'group',
                        name: 'Строки',
                        collapsable: true,
                        values: [{
                            rowKey: {
                                render: 'dataBinding',
                                values: [{
                                    value: oldVal.find('rowKey').value() || this._bindingCheck(oldVal.find('rowKey').binding()),
                                    binding: this._bindingCheck(oldVal.find('rowKey').binding())
                                }]
                            },
                            rowFilter: {
                                render: 'dataBinding',
                                values: [{
                                    value: oldVal.find('rowFilter').value() || this._bindingCheck(oldVal.find('rowFilter').binding()),
                                    binding: this._bindingCheck(oldVal.find('rowFilter').binding())
                                }]
                            },
                            preserveFilteredRows: {
                                render: 'item',
                                checked: oldVal.find('preserveFilteredRows').used(),
                                values: []
                            },
                            hoverFilteredRows: {
                                render: 'item',
                                checked: oldVal.find('hoverFilteredRows').used(),
                                values: []
                            },
                            useTree: {
                                render: 'switch',
                                checked: oldVal.find('useTree').used(),
                                values: [{
                                    parentRowKey: {
                                        render: 'dataBinding',
                                        values: [{
                                            value: oldVal.find('parentRowKey').value() || this._bindingCheck(oldVal.find('parentRowKey').binding()),
                                            binding: this._bindingCheck(oldVal.find('parentRowKey').binding())
                                        }]
                                    }
                                }]
                            }
                        }]
                    },
                    columns: {
                        render: 'group',
                        values: columns
                    }
                },

                linkedFields: {
                    rows: ["rowKey", "rowFilter", "title", "text"]
                }
            }
        },

        convertText: function(oldVal){
            var source = oldVal.find('source').binding();
            source.workspaceId = this._workId;

            return {
                values: {
                    source: {
                        render: 'sourceBinding',
                        values: [{
                            binding: source
                        }]
                    },
                    text: {
                        render: 'dataBinding',
                        values: [{
                            value: oldVal.find('text').value() || this._bindingCheck(oldVal.find('text').binding()),
                            binding: this._bindingCheck(oldVal.find('text').binding())
                        }]
                    },
                    annotations: {
                        render: 'dataBinding',
                        values: [{
                            value: oldVal.find('annotations').value() || this._bindingCheck(oldVal.find('annotations').binding()),
                            binding: this._bindingCheck(oldVal.find('annotations').binding())
                        }]
                    },
                    hideWithoutAnnotations: {
                        render: 'item',
                        checked: oldVal.find('hideWithoutAnnotations').used()
                    },
                    cssText: {
                        render: 'item',
                        checked: oldVal.find('cssText').used(),
                        values: [{
                            cssStyle: {
                                render: 'item',
                                value: oldVal.find('cssText').value()
                            }
                        }]
                    },
                    cssMark: {
                        render: 'item',
                        checked: oldVal.find('cssMark').used(),
                        values: [{
                            cssStyle: {
                                render: 'item',
                                value: oldVal.find('cssMark').value()
                            }
                        }]
                    }
                },

                linkedFields: {
                    source: ['text', 'annotations']
                }
            }
        },

        _bindingCheck: function(binding){
            return binding ? binding[0] : undefined
        }
    }
}