{
	$name: 'DataCube.Widgets.ColumnRangeSelector',
	//$parent: 'DataCube.Widgets.Widget',
    $scheme: {
        type: 'group',
        items: [
        {
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                name: 'Дата',
                type: 'item',
                key: 'date',
                binding: 'field',
                itemValue: '$field',
                description: 'Массив дат в формате Date или String'
            },
            {
                name: 'Количество',
                type: 'item',
                key: 'count',
                binding: 'field',
                itemValue: '$field',
                description: 'Количество значений для каждой даты'
            },
            {
                type: 'item',
                name: 'Автоподсчёт',
                key: 'autoCount',
                optional: true,
                editor: 'none',
                description: 'Автоматический подсчёт количества значений для каждой даты (считается количество одинаковых дат)'
            }
            ]
        },
        {
            type: 'group',
            name: 'Группировка данных',
            key: 'dataGrouping',
            multiple: 'true',
            optional: true,
            items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    key: 'timeUnit',
                    description: 'Группируемая диница измерения',
                    items: [
                    {
                        name: 'Миллисекунда',
                        type: 'item',
                        key: 'millisecond',
                        editor: 'none',
                        itemValue: 'millisecond'
                    },
                    {
                        name: 'Секунда',
                        type: 'item',
                        key: 'second',
                        editor: 'none',
                        itemValue: 'second'
                    },
                    {
                        name: 'Минута',
                        type: 'item',
                        key: 'minute',
                        editor: 'none',
                        itemValue: 'minute'
                    },
                    {
                        name: 'Час',
                        type: 'item',
                        key: 'hour',
                        editor: 'none',
                        itemValue: 'hour'
                    },
                    {
                        name: 'День',
                        type: 'item',
                        key: 'day',
                        editor: 'none',
                        itemValue: 'day'
                    },
                    {
                        name: 'Неделя',
                        type: 'item',
                        key: 'week',
                        editor: 'none',
                        itemValue: 'week'
                    },
                    {
                        name: 'Месяц',
                        type: 'item',
                        key: 'month',
                        editor: 'none',
                        itemValue: 'month'
                    },
                    {
                        name: 'Год',
                        type: 'item',
                        key: 'year',
                        editor: 'none',
                        itemValue: 'year'
                    }
                    ]
                },
                {
                    name: 'Группировка',
                    type: 'item',
                    key: 'grouping',
                    itemValue: '',
                    description: 'Массив допустимых группировок, через запятую (1, 2, 4)'
                }
            ]
        },
        {
            type: 'group',
            name: 'Фиксированное количество столбцов',
            key: 'fixedColumns',
            optional: true,
            items: [
            {
                name: 'Начальная дата',
                type: 'item',
                key: 'startDate'
            },
            {
                name: 'Конечная дата',
                type: 'item',
                key: 'endDate'
            },
            {
                name: 'Число столбцов',
                type: 'item',
                key: 'columnCount'
            }
            ]
        },
        {
            type: 'group',
            name: 'Ось Х',
            key: 'xAxis',
            optional: true,
            items: [
            {
                type: 'group',
                name: 'Формат дат',
                key: 'dateFormat',
                multiple: 'true',
                items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    key: 'timeUnit',
                    items: [
                    {
                        name: 'Миллисекунда',
                        type: 'item',
                        key: 'millisecond',
                        editor: 'none',
                        itemValue: 'millisecond'
                    },
                    {
                        name: 'Секунда',
                        type: 'item',
                        key: 'second',
                        editor: 'none',
                        itemValue: 'second'
                    },
                    {
                        name: 'Минута',
                        type: 'item',
                        key: 'minute',
                        editor: 'none',
                        itemValue: 'minute'
                    },
                    {
                        name: 'Час',
                        type: 'item',
                        key: 'hour',
                        editor: 'none',
                        itemValue: 'hour'
                    },
                    {
                        name: 'День',
                        type: 'item',
                        key: 'day',
                        editor: 'none',
                        itemValue: 'day'
                    },
                    {
                        name: 'Неделя',
                        type: 'item',
                        key: 'week',
                        editor: 'none',
                        itemValue: 'week'
                    },
                    {
                        name: 'Месяц',
                        type: 'item',
                        key: 'month',
                        editor: 'none',
                        itemValue: 'month'
                    },
                    {
                        name: 'Год',
                        type: 'item',
                        key: 'year',
                        editor: 'none',
                        itemValue: 'year'
                    }
                    ]
                },
                {
                    name: 'Формат',
                    type: 'item',
                    key: 'format',
                    itemValue: '',
                    description: 'Формат даты'
                }
                ]
            }
            ]
        }
        ]
    },
	$client: {
		$require: ['JQuery.UI.Loader', 'JSB.Tpl.Highcharts'],
		_currentFilters: {
		    min: null,
		    minId: null,
		    max: null,
		    maxId: null,
		    curFilterHash: null
		},
		_filterChanged: false,
		_widgetExtremes: {},

        refresh: function(opts){
return;

            var source = this.getContext().find('source');
            if(!source.hasBinding()) return;

            var fixedColumns = this.getContext().find('fixedColumns');
// filters section
            var globalFilters = source.getFilters(),
                binding = source.value().get(0).binding()[0],
                hasMin = false,
                hasMax = false,
                isReturn = false;

            if(globalFilters){
                var _bNeedExtremesUpdate = false;

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding){
                        switch(cur.op){
                        case '$eq':     // equal

                            break;
                        case '$gte':    // min filter
                            if(this._currentFilters.min && this._currentFilters.min <= cur.value || !this._currentFilters.min){
                                this._currentFilters.min = cur.value.getTime();
                                this._currentFilters.minId = cur.id;
                                _bNeedExtremesUpdate = true;
                            }
                            hasMin = true;
                            break;
                        case '$lte':    // max filter
                            if(this._currentFilters.max && this._currentFilters.max >= cur.value || !this._currentFilters.max){
                                this._currentFilters.max = cur.value.getTime();
                                this._currentFilters.maxId = cur.id;
                                _bNeedExtremesUpdate = true;
                            }
                            hasMax = true;
                            break;
                        }
                        delete globalFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length === 0) globalFilters = null;

                if(globalFilters && this.createFilterHash(globalFilters) === this._currentFilters.curFilterHash || !globalFilters && !this._currentFilters.curFilterHash){ // update data not require
                    if(_bNeedExtremesUpdate){
                        this._filterChanged = true;

                        var min = this._currentFilters.min ? this._currentFilters.min : this._widgetExtremes.min,
                            max = this._currentFilters.max ? this._currentFilters.max : this._widgetExtremes.max;

                        $this.chart.xAxis[0].setExtremes(min, max);

                        if(fixedColumns.used()){
                            this._loadFixedColumnData(min, max);
                        }
                    }
                    isReturn = true;
                } else {
                    this._currentFilters.curFilterHash = globalFilters ? this.createFilterHash(globalFilters) : undefined;
                }
            }

            if(!hasMin && this._currentFilters.minId){
                this._filterChanged = true;

                this._currentFilters.min = null;
                this._currentFilters.minId = null;

                this.chart.xAxis[0].setExtremes($this._widgetExtremes.min, $this._currentFilters.max ? $this._currentFilters.max : $this._widgetExtremes.max);

                if(fixedColumns.used()){
                    this._loadFixedColumnData($this._widgetExtremes.min, $this._currentFilters.max ? $this._currentFilters.max : $this._widgetExtremes.max);
                }
                isReturn = true;
            }

            if(!hasMax && this._currentFilters.maxId){
                this._filterChanged = true;

                this._currentFilters.max = null;
                this._currentFilters.maxId = null;

                this.chart.xAxis[0].setExtremes($this._currentFilters.min ? $this._currentFilters.min : $this._widgetExtremes.min, $this._widgetExtremes.max);

                if(fixedColumns.used()){
                    this._loadFixedColumnData($this._currentFilters.min ? $this._currentFilters.min : $this._widgetExtremes.min, $this._widgetExtremes.max);
                }
                isReturn = true;
            }
            if(isReturn) return;
// end filters section
            var seriesContext = this.getContext().find('series').value(),
                autoCount = source.value().get(2).used(),
                tooltip = this.getContext().find('tooltip').value(),
                value = source.value().get(0),
                count = source.value().get(1);

            if(fixedColumns.used()){
                var minFix = fixedColumns.value().get(0).value(),
                    maxFix = fixedColumns.value().get(1).value(),
                    columnCount = fixedColumns.value().get(2).value();

                var colWidth = (new Date(maxFix).getTime() - new Date(minFix).getTime()) / 1000 / columnCount;

                var fixedColumnsSelect = {
                    dateIntervalOrder: {
                        $dateIntervalOrder: {
                            $field: value.binding()[0],
                            $seconds: colWidth
                        }
                    },
                    dateCount: {
                        $count: 1
                    }
                };
                var fixedColumnsGroupBy = [
                    {
                        $dateIntervalOrder: {
                            $field: value.binding()[0],
                            $seconds: colWidth
                        }
                    }
                ];
            } else {
                var fixedColumnsSelect = undefined,
                    fixedColumnsGroupBy = undefined;
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true, select: fixedColumnsSelect, groupBy: fixedColumnsGroupBy}, function(queryResult){
                    try{
                        if(fixedColumns.used()){
                            if(!queryResult){
                                if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
                                return;
                            }

                            var data = [];

                            for(var i = 0; i < queryResult.length; i++){
                                data.push({
                                    x: queryResult[i].dateIntervalOrder * colWidth * 1000,
                                    y: queryResult[i].dateCount
                                });
                            }
                        } else {
                            var data = [];

                            while(source.next()){
                                var val = value.value();

                                if(JSB().isDate(val)){
                                    var dateValue = val.getTime();
                                    $this._dataFormat = 'datetime';
                                } else {
                                    if(typeof val === 'number'){
                                         var dateValue = val;
                                        $this._dataFormat = 'number';
                                    } else {
                                        return;
                                    }
                                }

                                if(autoCount){
                                    var e = null;
                                    for(var j = 0; j < data.length; j++){
                                        if(data[j].x === dateValue){
                                            e = data[j];
                                            break;
                                        }
                                    }

                                    if(e){
                                        e.y++;
                                    } else {
                                        data.push({ x: dateValue, y: 1 });
                                    }
                                } else {
                                    data.push({ x: dateValue, y: count.value() });
                                }
                            }
                        }

                        if(data.length === 0){
                            console.log('Временной диапазон: нет данных или неверный формат (поддерживается только объект Date)');
                            if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
                            return;
                        }

                        data.sort(function(a, b){
                            if(a.x < b.x) return -1;
                            if(a.x > b.x) return 1;
                            return 0;
                        });

                        if(opts && opts.isCacheMod){
                        	$this.storeCache(data);
                        }

                        $this._buildChart(data, _bNeedExtremesUpdate);
                    } catch(e){
                        console.log(e);
                    } finally{
                        $this.getElement().loader('hide');
                    }
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data, _bNeedExtremesUpdate){
        	var seriesContext = this.getContext().find('series').value(),
        		fixedColumns = this.getContext().find('fixedColumns');
        	
            try{
                var tooltipXDateFormat = this.getContext().find('tooltip').value().get(0).value();
                tooltipXDateFormat = tooltipXDateFormat === null ? undefined : tooltipXDateFormat;

                var dataGrouping = this.getContext().find('dataGrouping');
                if(dataGrouping.used()){
                    var units = [];
                    var values = dataGrouping.values();
                    for(var i = 0; i < values.length; i++){
                        units.push([values[i].get(0).value().get(0).value(), [values[i].get(1).value()]]);
                    }
                }

                var xAxis = this.getContext().find('xAxis');
                if(xAxis.used()){
                    var gr = xAxis.values(),
                        dateTimeLabelFormats = {};

                    for(var i = 0; i < gr.length; i++){
                        dateTimeLabelFormats[gr[i].value().get(0).value().get(0).value()] = gr[i].value().get(1).value();
                    }
                }
                
                if(fixedColumns.used()){
                    var scrollbar = {
                        liveRedraw: false
                    }

                    var rangeSelector = {
                        enabled: false
                    }
                    
                    var navigator = {
                        adaptToUpdatedData: false,
                        series: {
                            data: data
                        }
                    }                    
                }

                var chartOpts = {
                    chart: {
                        renderTo: $this.containerId
                    },

                    xAxis: {
                        type: 'datetime',
                        min: data[0].x,
                        max: data[data.length - 1].x,
                        events: {
                            afterSetExtremes: function(event){ $this._addIntervalFilter(event);}
                        }
                    },

                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    tooltip: {
                        xDateFormat: tooltipXDateFormat
                    }
                };

                chartOpts.series = [{
                    type: 'column',
                    name: seriesContext.get(0).value(),
                    data: data,
                    turboThreshold: 0,
                    dataGrouping: {
                        enabled: units !== undefined ? true : false,
                        units: units
                    }
                }];

                if(navigator){
                    chartOpts.navigator = navigator;
                }

                if(scrollbar){
                    chartOpts.scrollbar = scrollbar;
                }

                if(rangeSelector){
                    chartOpts.rangeSelector = rangeSelector;
                }

                if(dateTimeLabelFormats){
                    chartOpts.xAxis.dateTimeLabelFormats = dateTimeLabelFormats;
                }

                // create the chart
                $this.chart = new Highcharts.stockChart(chartOpts);

                var ex = $this.chart.navigator.xAxis.getExtremes();
                $this._widgetExtremes = {
                    min: ex.min,
                    max: ex.max
                };

                if(_bNeedExtremesUpdate){
                    $this.chart.xAxis[0].setExtremes($this._currentFilters.min ? $this._currentFilters.min : ex.dataMin, $this._currentFilters.max ? $this._currentFilters.max : ex.dataMax);
                }

                $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
            } catch(ex){
                console.log(ex);
                if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
            }
        },

        _addIntervalFilter: function(event){
            if(this._filterChanged){
                this._filterChanged = false;
                return;
            }

            JSB().defer(function(){
                if(event.min === $this._widgetExtremes.min && !$this._currentFilters.min && event.max === $this._widgetExtremes.max && !$this._currentFilters.max) return;

                var context = $this.getContext().find('source').binding();
                if(!context.source) return;

                var field = $this.getContext().find('source').value().get(0).binding(),
                    bNeedRefresh = false;

                // min filter
                if($this._currentFilters.min && $this._currentFilters.min !== event.min || !$this._currentFilters.min && event.min !== $this._widgetExtremes.min){  // change filter
                    if($this._currentFilters.min){
                        $this.removeFilter($this._currentFilters.minId);
                    }

                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$gte',
                        field: field,
                        value: $this._dataFormat === 'datetime' ? new Date(event.min) : event.min
                    };
                    $this._currentFilters.min = event.min;
                    $this._currentFilters.minId = $this.addFilter(fDesc);

                    bNeedRefresh = true;
                }
                if($this._currentFilters.min && event.min === event.dataMin){   // remove filter
                    $this.removeFilter($this._currentFilters.minId);
                    $this._currentFilters.min = null;
                    $this._currentFilters.minId = null;
                    bNeedRefresh = true;
                }

                // max filter
                if($this._currentFilters.max && $this._currentFilters.max !== event.max || !$this._currentFilters.max && event.max !== $this._widgetExtremes.max){  // change filter
                    if($this._currentFilters.max){
                        $this.removeFilter($this._currentFilters.maxId);
                    }

                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$lte',
                        field: field,
                        value: $this._dataFormat === 'datetime' ? new Date(event.max) : event.max
                    };
                    $this._currentFilters.max = event.max;
                    $this._currentFilters.maxId = $this.addFilter(fDesc);

                    bNeedRefresh = true;
                }
                if($this._currentFilters.max && event.max === event.dataMax){   // remove filter
                    $this.removeFilter($this._currentFilters.maxId);
                    $this._currentFilters.max = null;
                    $this._currentFilters.maxId = null;
                    bNeedRefresh = true;
                }

                if(bNeedRefresh){
                    $this.refreshAll();

                    var fixedColumns = $this.getContext().find('fixedColumns');
                    if(fixedColumns.used()){
                        $this._loadFixedColumnData(event.min, event.max);
                    }
                }
            }, 700, 'ColumnRangeSelector.xAxisFilterUpdate_' + this.containerId);
        },

        _loadFixedColumnData: function(min, max){
            var columnCount = this.getContext().find('fixedColumns').value().get(2).value(),
                field = this.getContext().find('source').value().get(0).binding()[0];
            var colWidth = Math.floor((max - min) / 1000 / columnCount);

            var fixedColumnsSelect = {
                dateIntervalOrder: {
                    $dateIntervalOrder: {
                        $field: field,
                        $seconds: colWidth
                    }
                },
                dateCount: {
                    $count: 1
                }
            };
            var fixedColumnsGroupBy = [
                {
                    $dateIntervalOrder: {
                        $field: field,
                        $seconds: colWidth
                    }
                }
            ];

            $this.chart.showLoading('Загрузка...');
            $this.getContext().find('source').fetch({readAll: true, reset: true, select: fixedColumnsSelect, groupBy: fixedColumnsGroupBy}, function(queryResult){
                if(!queryResult){
                    $this.chart.hideLoading();
                    return;
                }

                var data = [];

                for(var i = 0; i < queryResult.length; i++){
                    data.push({
                        x: queryResult[i].dateIntervalOrder * colWidth * 1000,
                        y: queryResult[i].dateCount
                    });
                }

                data.sort(function(a, b){
                    if(a.x < b.x) return -1;
                    if(a.x > b.x) return 1;
                    return 0;
                });

                $this.chart.series[0].setData(data);
                $this.chart.hideLoading();
            });
        }
	}
}