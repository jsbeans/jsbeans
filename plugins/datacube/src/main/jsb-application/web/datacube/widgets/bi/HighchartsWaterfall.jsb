{
	$name: 'DataCube.Widgets.HighchartsWaterfall',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Водопад',
		description: '',
		category: 'BI',
		thumb: 'data:image/png;base64,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'
	},
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            itemType: 'string',
            itemValue: ''
        },
        {
            name: 'Подзаголовок',
            type: 'item',
            key: 'subtitle',
            itemType: 'string',
            itemValue: ''
        },
        {
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                type: 'group',
                name: 'Ось Х',
                key: 'xAxis',
                items: [
                {
                    name: 'Категории',
                    type: 'item',
                    key: 'category',
                    binding: 'field',
                    itemType: 'any',
                },
                {
                    type: 'group',
                    name: 'Заголовок',
                    key: 'title',
                    items: [
                    {
                        type: 'item',
                        name: 'Текст',
                        key: 'text',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        key: 'style',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
                            key: 'color',
                            binding: 'field',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor'
                        }
                        ]
                    }
                    ]
                }]
            },
            {
                type: 'group',
                name: 'Ось Y',
                key: 'yAxis',
                items: [
                {
                    type: 'group',
                    name: 'Заголовок',
                    key: 'title',
                    items: [
                    {
                        type: 'item',
                        name: 'Текст',
                        key: 'text',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        key: 'style',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
                            key: 'color',
                            binding: 'field',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor'
                        }
                        ]
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Значения',
                    key: 'labels',
                    items: [
                    {
                        type: 'item',
                        name: 'Формат',
                        key: 'format',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        key: 'style',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
                            key: 'color',
                            binding: 'field',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor'
                        }
                        ]
                    }
                    ]
                },
                {
                    type: 'item',
                    name: 'Справа',
                    key: 'opposite',
                    optional: true
                }
                ]
            },
            {
                type: 'group',
                name: 'Серии',
                key: 'series',
                items: [
                {
                    name: 'Имя поля',
                    type: 'item',
                    key: 'seriesName',
                    itemType: 'string',
                    itemValue: ''
                },
                {
                    name: 'Данные',
                    type: 'item',
                    key: 'seriesData',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },
                {
                    name: 'isIntermediateSum',
                    type: 'item',
                    key: 'isIntermediateSum',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },
                {
                    name: 'isSum',
                    type: 'item',
                    key: 'isSum',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },
                {
                    name: 'Тип отображения',
                    type: 'select',
                    key: 'type',
                    items:[
                    {
                        name: 'waterfall',
                        type: 'item',
                        key: 'waterfall',
                        editor: 'none'
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Tooltip',
                    key: 'tooltip',
                    items: [
                    {
                        type: 'item',
                        name: 'Суффикс значения',
                        key: 'valueSuffix',
                        itemType: 'string'
                    }
                    ]
                },
                {
                    name: 'Индекс yAxis',
                    type: 'item',
                    key: 'yAxisIndex',
                    description: 'В случаях использования двух или более Y-осей, данный параметр определяет с какой из осей должна быть связана данная серия. Значением данного параметра должен быть индекс (порядковый номер) требуемой оси в массиве осей. При этом, нумерация осей начинается с 0. Значение по умолчанию: 0.'
                },
                {
                    name: 'Тип линии',
                    type: 'select',
                    key: 'dashStyle',
                    items:[
                    {
                        name: 'Solid',
                        type: 'item',
                        key: 'Solid',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDash',
                        type: 'item',
                        key: 'ShortDash',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDot',
                        type: 'item',
                        key: 'ShortDot',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDot',
                        type: 'item',
                        key: 'ShortDashDot',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDotDot',
                        type: 'item',
                        key: 'ShortDashDotDot',
                        editor: 'none'
                    },
                    {
                        name: 'Dot',
                        type: 'item',
                        key: 'Dot',
                        editor: 'none'
                    },
                    {
                        name: 'Dash',
                        type: 'item',
                        key: 'Dash',
                        editor: 'none'
                    },
                    {
                        name: 'LongDash',
                        type: 'item',
                        key: 'LongDash',
                        editor: 'none'
                    },
                    {
                        name: 'DashDot',
                        type: 'item',
                        key: 'DashDot',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDot',
                        type: 'item',
                        key: 'LongDashDot',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDotDot',
                        type: 'item',
                        key: 'LongDashDotDot',
                        editor: 'none'
                    }
                    ]
                },
                {
                    name: 'Цвет (color)',
                    type: 'item',
                    key: 'color',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Цвет (upColor)',
                    type: 'item',
                    key: 'upColor',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Цвет (isIntermediateSum)',
                    type: 'item',
                    key: 'isIntermediateSumColor',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Цвет (isSum)',
                    type: 'item',
                    key: 'isSumColor',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                ]
            }
            ]
        },
        {
            name: 'Цветовая схема по умолчанию',
            key: 'colorScheme',
            type: 'select',
            items:[
            {
                name: '#1',
                type: 'item',
                key: 'color1',
                editor: 'none'
            },
            {
                name: '#2',
                type: 'item',
                key: 'color2',
                editor: 'none'
            },
            {
                name: '#3',
                type: 'item',
                key: 'color3',
                editor: 'none'
            },
            {
                name: '#4',
                type: 'item',
                key: 'color4',
                editor: 'none'
            }
            ]
        }        
        
        ]
    },
	$client: {
	    $require: ['JQuery.UI.Loader'],
		$constructor: function(opts){
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			this.loadCss('HighchartsBasicArea.css');
			JSB().loadScript('tpl/highstock/highstock.js', function(){
			    JSB().loadScript('tpl/highstock/highcharts-more.js', function(){
			        $this.init();
			    });
			});
		},

        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

		init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
            	if(!$this.getElement().is(':visible') || !$this.chart){
                    return;
                }

                JSB.defer(function(){
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 300, 'hcResize' + $this.getId());
            });

            this.isInit = true;
		},

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;

            $base();

            if(opts && opts.refreshFromCache){
                JSB().deferUntil(function(){
                    var cache = $this.getCache();
                    if(!cache) return;
                    $this._buildChart(cache.seriesData, cache.xAxis);
                }, function(){
                    return $this.isInit;
                });
                return;
            }

            var seriesContext = this.getContext().find('series').values(),
                xAxisContext = this.getContext().find('xAxis').values();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var seriesData = [],
                        xAxis = [];

                    try{
                        while(source.next()){
                            for(var i = 0; i < seriesContext.length; i++){
                                var a = seriesContext[i].get(1).value(),
                                    isIntermediateSum = seriesContext[i].get(2).value() !== 0,
                                    isSum = seriesContext[i].get(3).value() !== 0,
                                    isIntermediateSumColor = $this.isNull(seriesContext[i].get(10).value()),
                                    isSumColor = $this.isNull(seriesContext[i].get(11).value());
                                if(JSB().isArray(a)){
                                    seriesData[i] = a;
                                } else {
                                    if(!seriesData[i]){
                                        seriesData[i] = [];
                                    }
                                    if( isIntermediateSum ) {
                                        seriesData[i].push({
                                            //y: a,
                                            isIntermediateSum: true,
                                            color: isIntermediateSumColor
                                        });
                                    } else if( isSum ) {
                                        seriesData[i].push({
                                            //y: a,
                                            isSum: true,
                                            color: isSumColor
                                        });
                                    } else {
                                        seriesData[i].push({
                                            y: a
                                        });
                                    }
                                }
                            }

                            for(var i = 0; i < xAxisContext.length; i++){
                                var a = xAxisContext[i].get(0).value();
                                if(JSB().isArray(a)){
                                    xAxis = a;
                                } else {
                                    xAxis.push(a);
                                }
                            }
                        }

                        if(opts && opts.isCacheMod){
                            $this.storeCache({
                                seriesData: seriesData,
                                xAxis: xAxis
                            });
                        }

                        $this._buildChart(seriesData, xAxis);
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

        _buildChart: function(seriesData, xAxis){
            var seriesContext = this.getContext().find('series').values(),
                yAxisContext = this.getContext().find('yAxis').values(),
                xAxisContext = this.getContext().find('xAxis').values(),
                yAxis = [],
                series = [];
            try{
                for(var i = 0; i < seriesContext.length; i++){
                    if(!series[i]){
                        series[i] = {
                            name: seriesContext[i].get(0).value(),
                            data: seriesData[i],
                            //type: seriesContext[i].get(4).value().name(),
                            tooltip: {
                                valueSuffix: seriesContext[i].get(5).value().get(0).value()
                            },
                            yAxis: $this.isNull(seriesContext[i].get(6).value(), true),
                            dashStyle: seriesContext[i].get(7).value().name(),
                            color: $this.isNull(seriesContext[i].get(8).value()),
                            upColor: $this.isNull(seriesContext[i].get(9).value()),
                            point: {
                                events: {
                                    click: function(evt) {
                                        if(JSB().isFunction($this.options.onClick)){
                                            $this.options.onClick.call(this, evt);
                                        }
                                    },
                                    select: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onSelect)){
                                            flag = $this.options.onSelect.call(this, evt);
                                        }

                                        if(!flag){
                                            $this._addNewFilter(evt.target.series.index, evt.target.category);
                                        }
                                    },
                                    unselect: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onUnselect)){
                                            flag = $this.options.onUnselect.call(this, evt);
                                        }

                                        if(!flag && $this._currentFilter && !$this._notNeedUnselect){
                                            $this._notNeedUnselect = false;
                                            $this.removeFilter($this._currentFilter);
                                            $this.refreshAll();
                                        }
                                    },
                                    mouseOut: function(evt) {
                                        if(JSB().isFunction($this.options.mouseOut)){
                                            $this.options.mouseOut.call(this, evt);
                                        }
                                    },
                                    mouseOver: function(evt) {
                                        if(JSB().isFunction($this.options.mouseOver)){
                                            $this.options.mouseOver.call(this, evt);
                                        }
                                    }
                                }
                            }
                        };
                    }
                }

                for(var i = 0; i < yAxisContext.length; i++){
                    yAxis[i] = {
                        title: {
                            text: yAxisContext[i].get(0).value().get(0).value(),
                            style: {
                                color: $this.isNull(yAxisContext[i].get(0).value().get(1).value().get(0).value())
                            },
                            align: 'high'
                        },
                        labels: {
                            format: $this.isNull(yAxisContext[i].get(1).value().get(0).value()),
                            style: {
                                color: $this.isNull(yAxisContext[i].get(1).value().get(1).value().get(0).value())
                            }
                        },
                        opposite: yAxisContext[i].get(2).used()
                    };
                }

                var colors = [
                    ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                    ['#110C08', '#35312F', '#626A7A', '#9A554B', '#D88A82', '#BBBBBB', '#E0DFDE', '#EEEDEB', '#F4F4F4'],
                    ['#1C3E7E', '#006DA9', '#B2D3E5', '#BFC6D9', '#EFB9BF', '#CA162A'],
                    ['#1C3E7E', '#FF553E', '#FFCCC5', '#D0D0D0', '#8E8E8E', '#636363'],
                    ['#4FBDE2', '#CAEBF6', '#89CBC6', '#DBEFEE', '#8A5C91', '#DCCEDE', '#4F3928', '#CAC3BE', '#FFF3D9']
                ], colorSchemeIdx = parseInt(this.getContext().find('colorScheme').value().name().toString().replace(/\D/g,''), 10);

                var chartOptions = {

                    colors: !colors.hasOwnProperty(colorSchemeIdx) ? colors[0] : colors[colorSchemeIdx],

                    chart: {
                        //zoomType: 'x'
                        type: 'waterfall'
                    },

                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    xAxis: [{
                        categories: xAxis,
                        crosshair: false,
                        title: {
                            text: xAxisContext[0].get(1).value().get(0).value(),
                            style: {
                                color: $this.isNull(xAxisContext[0].get(1).value().get(1).value().get(0).value())
                            },
                            align: 'high'
                        }
                    }],

                    yAxis: yAxis,

                    tooltip: {
                        shared: true
                    },

                    legend: {
                        enabled: false
                    },

                    plotOptions: {
                        series: {
                            allowPointSelect: true,
                            states: {
                                select: {
                                    color: null,
                                    borderWidth: 5,
                                    borderColor: 'Blue'
                                }
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },

                    series: series
                };

                console.log(chartOptions);
                $this.container.highcharts(chartOptions);
                $this.chart =  $this.container.highcharts();
            } catch(e){
                console.log(e);
            }
        },

        _addNewFilter: function(index, value){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var field = this.getContext().find("xAxis").get(0).value().binding();
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
        isNull: function(a, b){
            if(b) return a === null ? undefined : parseInt(a);
            return a === null ? undefined : a;
        }
	}
}