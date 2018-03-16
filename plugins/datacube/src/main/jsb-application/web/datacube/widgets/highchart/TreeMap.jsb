{
	$name: 'DataCube.Widgets.TreeMap',
	$parent: 'DataCube.Widgets.Widget',
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Алгоритм построения',
            type: 'select',
            key: 'layoutAlgorithm',
            items:[
            {
                name: 'sliceAndDice',
                type: 'item',
                key: 'sliceAndDice',
                editor: 'none'
            },
            {
                name: 'squarified',
                type: 'item',
                key: 'squarified',
                editor: 'none'
            },
            {
                name: 'stripes',
                type: 'item',
                key: 'stripes',
                editor: 'none'
            },
            {
                name: 'strip',
                type: 'item',
                key: 'strip',
                editor: 'none'
            }
            ]
        },
        {
            type: 'item',
            key: 'autoSize',
            name: 'Автоматически считать размеры',
            optional: true,
            editor: 'none'
        },
        {
            type: 'item',
            key: 'skipSmallGroups',
            name: 'Опускать группы с одним элементом',
            optional: true,
            editor: 'none'
        },
        {
            type: 'item',
            key: 'skipEmptyNamedGroups',
            name: 'Опускать группы с пустыми именами',
            optional: true,
            editor: 'none'
        },
        {
            type: 'group',
            name: 'Источник',
            binding: 'array',
            key: 'source',
            items: [
            {
                type: 'group',
                name: 'Серии',
                key: 'series',
                multiple: 'true',
                items: [
                {
                    name: 'Имя поля',
                    type: 'item',
                    key: 'fieldName',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },{
                    name: 'Вес',
                    type: 'item',
                    key: 'fieldWeight',
                    binding: 'field',
                    itemType: 'number',
                    itemValue: ''
                }
                ]
            }
            ]
        }]
    },
	$client: {
		$require: ['JQuery.UI.Loader', 'JSB.Tpl.Highcharts'],
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('highchartsWidget');
			JSB().loadScript(['tpl/highstock/adapters/standalone-framework.js'], function(){
				JSB().loadScript('tpl/highstock/modules/treemap.js', function(){
					$this.init();	
				});
			});
		},

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
            	JSB.defer(function(){
                	if(!$this.getElement().is(':visible') || !$this.chart){
                        return;
                    }
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 500, 'hcResize' + $this.getId());
            });

            this.isInit = true;
            $this.setInitialized();
        },

        refresh: function(opts){
return;
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.hasBinding()) return;

			$base();

			if(opts && opts.refreshFromCache){
            	JSB().deferUntil(function(){
            		var cache = $this.getCache();
            		if(!cache) return;
            		$this._buildChart(cache);
            	}, function(){
            		return $this.isInit;
            	});
            	return;
            }

            var data = [],
                series = this.getContext().find('series').values(),
                autoSize = this.getContext().find('autoSize').used(),
                skipSmallGroups = this.getContext().find('skipSmallGroups').used(),
                skipEmptyNamedGroups = this.getContext().find('skipEmptyNamedGroups').used();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    while(source.next()){
                        var el = data;

                        for(var i = 0; i < series.length; i++){
                            var label = series[i].get(0).value();
                            var weight = series[i].get(1).value();

                            var e = null;
                            for(var j = 0; j < el.length; j++){
                                if(el[j].label === label){
                                    e = el[j];
                                    break;
                                }
                            }

                            if(!e){
                                el.push({
                                    label: label,   //name
                                    weight: parseInt(weight),   //value
                                    groups: []
                                });

                                el = el[el.length - 1].groups;
                            } else {
                                el = e.groups;
                            }
                        }
                    }

                    data = $this.procData(data, autoSize, skipSmallGroups, skipEmptyNamedGroups);

                    data = $this.convertToTreemapFormat(data);

                    if(opts && opts.isCacheMod){
                    	$this.storeCache(data);
                    }

                    $this._buildChart(data);

                    $this.getElement().loader('hide');
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data){
            var chartOpts = {
                title: {
                    text: this.getContext().find('title').value()
                },
                subtitle: {
                    text: this.getContext().find('subtitle').value()
                },
                /*
                plotOptions: {
                    treemap: {
                        allowPointSelect: true,
                        point: {
                            events: {
                                select: function(evt) {
                                    this.update({
                                        borderColor: 'green',
                                        borderWidth: 4
                                    });

                                    debugger;

                                    // $this._addNewFilter(evt.target.series.index, evt.target.name);
                                },
                                unselect: function(evt) {
                                    this.update({
                                        borderColor: '#E0E0E0',
                                        borderWidth: 1
                                    });
                                    if(!$this._notNeedUnselect){
                                        $this._notNeedUnselect = false;
                                        $this.removeFilter($this._currentFilter);
                                        $this.refreshAll();
                                    }
                                }
                            }
                        }
                    }
                },
                */

                credits: {
                    enabled: false
                },

                series: [{
                    type: 'treemap',
                    layoutAlgorithm: this.getContext().find('layoutAlgorithm').value().name(),
                    allowDrillToNode: true,
                    animationLimit: 1000,
                    dataLabels: {
                        enabled: true
                    },
                    levelIsConstant: false,
                    data: data,
                    turboThreshold: 0
                }]
            };

            $this.container.highcharts(chartOpts);
            $this.chart =  $this.container.highcharts();
        },

        _addNewFilter: function(level, value){
            if(!level || !value) return;

            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var field = this.getContext().find("series").values()[level].get(0).binding();
            if(!field[0]) return;

            var fDesc = {
            	sourceId: context.source,
            	type: '$and',
            	op: '$eq',
            	field: field,
            	value: value
            };
            if(!this.hasFilter(fDesc)){
            	if(this._currentFilter){
                    this.removeFilter(this._currentFilter);
                    this._currentFilter = null;
                    this._notNeedUnselect = true;
                }

            	this._currentFilter = this.addFilter(fDesc);
            	this.refreshAll();
            }
        },

        // utils
        procData: function(data, autoSize, skipSmallGroups, skipEmptyNamedGroups){
            if(!data) return;

            var newData = [];

            for(var i = 0; i < data.length; i++){
                if((skipEmptyNamedGroups && data[i].label === "") || (skipSmallGroups && data[i].groups.length === 1)){
                    newData = newData.concat(this.procData(data[i].groups, autoSize, skipSmallGroups));
                    continue;
                }

                if((data[i].weight !== data[i].weight) && autoSize){
                    data[i].weight = this.countWeight(data[i]);
                }

                data[i].groups = this.procData(data[i].groups, autoSize, skipSmallGroups);

                newData.push(data[i]);
            }

            newData = newData.filter(function(el){
                return el !== undefined;
            });

            return newData;
        },

        countWeight: function(a){
            if(a.weight === a.weight) return a.weight;

            if(a.groups.length !== 0){
                var b = 0;
                for(var i = 0; i < a.groups.length; i++){
                    b += countWeight(a.groups[i]);
                }
                return b;
            } else {
                return 1;
            }
        },

        convertToTreemapFormat: function(data, array, parent){
            if(!array) array = [];
            for(var i = 0; i < data.length; i++){
                var id = JSB().generateUid();

                array.push({
                    id: id,
                    name: data[i].label,
                    parent: parent,
                    value: data[i].weight
                });

                this.convertToTreemapFormat(data[i].groups, array, id);
            }

            return array;
        }
	}
}