{
    $name: 'Datacube.ValueConverter',
    $singleton: true,
    $require: [],

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
        }
    },

    convert: function(widgetName, values){
        var oldSelector = new this.Selector(values);

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
                return {};
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
                        binding: oldArgs[i].find('value').binding()[0]
                    }]
                }
            })
        }

        return {
            values: {
                record: {
                    render: 'sourceBinding',
                    values: [{
                        binding: oldVal.find('record').binding()[0]
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
            oldSeries = oldVal.find('').values();

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
                        value: oldSeries[i].find('min').value(),
                        binding: oldSeries[i].find('min').binding()[0]
                    }]
                },
                max: {
                    render: 'dataBinding',
                    values: [{
                        value: oldSeries[i].find('max').value(),
                        binding: oldSeries[i].find('max').binding()[0]
                    }]
                },
                val: {
                    render: 'dataBinding',
                    values: [{
                        value: oldSeries[i].find('val').value(),
                        binding: oldSeries[i].find('val').binding()[0]
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
                        value: oldSeries[i].find('css').value()
                    }]
                },
                textCss: {
                    render: 'item',
                    checked: oldSeries[i].find('textCss').used(),
                    values: [{
                        value: oldSeries[i].find('textCss').value()
                    }]
                }
            })
        }

        return {
            values: {
                dataSource: {
                    render: 'sourceBinding',
                    values: [{
                        binding: oldVal.find('record').binding()[0]
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

    },

    convertText: function(oldVal){
        return {
            values: {
                source: {
                    render: 'sourceBinding',
                    values: [{
                        binding: oldVal.find('source').binding()[0]
                    }]
                },
                text: {
                    render: 'dataBinding',
                    values: [{
                        binding: oldVal.find('text').binding()[0]
                    }]
                },
                annotations: {
                    render: 'dataBinding',
                    values: [{
                        binding: oldVal.find('annotations').binding()[0]
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
                        value: oldVal.find('cssText').value()
                    }]
                },
                cssMark: {
                    render: 'item',
                    checked: oldVal.find('cssMark').used(),
                    values: [{
                        value: oldVal.find('cssMark').value()
                    }]
                }
            },

            linkedFields: {
                source: ['text', 'annotations']
            }
        }
    }
}