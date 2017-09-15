{
	$name: 'DataCube.Widgets.Highcharts',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Гистограмма',
		description: '',
		category: 'Диаграммы',
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
                    name: 'Катагории',
                    type: 'item',
                    key: 'category',
                    binding: 'field',
                    itemType: 'any',
                }
                ]
            },
            {
                type: 'group',
                name: 'Ось Y',
                key: 'yAxis',
                multiple: 'true',
                items: [
                {
                    type: 'group',
                    key: 'title',
                    name: 'Заголовок',
                    items: [
                    {
                        type: 'item',
                        key: 'text',
                        name: 'Текст',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        key: 'style',
                        name: 'Стиль',
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
                multiple: 'true',
                items: [
                {
                    name: 'Имя поля',
                    type: 'item',
                    key: 'fieldName',
                    itemType: 'string',
                    itemValue: ''
                },
                {
                    name: 'Данные',
                    type: 'item',
                    key: 'data',
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
                        name: 'column',
                        type: 'item',
                        key: 'column',
                        editor: 'none'
                    },
                    {
                        name: 'spline',
                        type: 'item',
                        key: 'spline',
                        editor: 'none'
                    },
                    {
                        name: 'area',
                        type: 'item',
                        key: 'area',
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
                        itemType: 'string',
                    }
                    ]
                },
                {
                    name: 'yAxis',
                    type: 'item',
                    key: 'yAxis',
                    itemType: 'string',
                },
                {
                    name: 'Тип линии',
                    type: 'select',
                    key: 'dashStyle',
                    items:[
                    {
                        name: 'Solid',
                        type: 'item',
                        key: 'solid',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDash',
                        type: 'item',
                        key: 'shortDash',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDot',
                        type: 'item',
                        key: 'shortDot',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDot',
                        type: 'item',
                        key: 'shortDashDot',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDotDot',
                        type: 'item',
                        key: 'shortDashDotDot',
                        editor: 'none'
                    },
                    {
                        name: 'Dot',
                        type: 'item',
                        key: 'dot',
                        editor: 'none'
                    },
                    {
                        name: 'Dash',
                        type: 'item',
                        key: 'dash',
                        editor: 'none'
                    },
                    {
                        name: 'LongDash',
                        type: 'item',
                        key: 'longDash',
                        editor: 'none'
                    },
                    {
                        name: 'DashDot',
                        type: 'item',
                        key: 'dashDot',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDot',
                        type: 'item',
                        key: 'longDashDot',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDotDot',
                        type: 'item',
                        key: 'longDashDotDot',
                        editor: 'none'
                    }
                    ]
                },
                {
                    name: 'Цвет',
                    type: 'item',
                    key: 'color',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Стек',
                    type: 'item',
                    key: 'stack',
                    itemType: 'string',
                    description: 'Имя стека. Для объединения серий в один столбец следет указать одинаковые имена стеков. Работает только при отмеченном поле "Стек".'
                }
                ]
            },
            {
                name: 'Стек',
                key: 'isStacking',
                type: 'item',
                optional: true,
                editor: 'none'
            }
            ]
        }
        ]
    },
	$client: {
	    $require: ['JQuery.UI.Loader'],

        _curFilters: {},
        _deselectCategoriesCount: 0,
        _curFilterHash: null,

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			this.loadCss('Highcharts.css');
			JSB().loadScript('tpl/highstock/highstock.js', function(){
				self.init();
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

// filters section
            var globalFilters = source.getFilters();

            if(globalFilters){
                var binding = this.getContext().find("xAxis").get(0).value().binding()[0],
                    newFilters = {};

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding && cur.op === '$eq'){
                        if(!this._curFilters[cur.value]){
                            this._curFilters[cur.value] = cur.id;
                            this._selectAllCategory(cur.value);
                        }

                        newFilters[cur.value] = true;

                        delete globalFilters[i];
                    }
                }

                for(var i in this._curFilters){
                    if(!newFilters[i]){
                        this._deselectAllCategory(i);
                        delete this._curFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length === 0) globalFilters = null;

                if(globalFilters && this.createFilterHash(globalFilters) === this._curFilterHash || !globalFilters && !this._curFilterHash){ // update data not require
                    return;
                } else {
                    this._curFilterHash = globalFilters ? this.createFilterHash(globalFilters) : undefined;
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    for(var i in this._curFilters){
                        this._deselectAllCategory(i);
                    }
                    this._curFilters = {};
                    this._curFilterHash = null;
                    return;
                }
            }
// end filters section

            var seriesContext = this.getContext().find('series').values();
            var yAxisContext = this.getContext().find('yAxis').values();
            var xAxisContext = this.getContext().find('xAxis').values();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var series = [];
                    var yAxis = [];
                    var xAxis = [];

                    try{
                        while(source.next()){
                            for(var i = 0; i < seriesContext.length; i++){
                                if(!series[i]){
                                    series[i] = {
                                        name: seriesContext[i].get(0).value(),
                                        data: [],
                                        type: seriesContext[i].get(2).value().name(),
                                        tooltip: {
                                            valueSuffix: seriesContext[i].get(3).value().get(0).value()
                                        },
                                        yAxis: $this.isNull(seriesContext[i].get(4).value(), true),
                                        dashStyle: seriesContext[i].get(5).value().name(),
                                        color: $this.isNull(seriesContext[i].get(6).value()),
                                        point: {
                                            events: {
                                                click: function(evt) {
                                                    $this._clickEvt = evt;

                                                    if(JSB().isFunction($this.options.onClick)){
                                                        $this.options.onClick.call(this, evt);
                                                    }
                                                },
                                                select: function(evt) {
                                                    var flag = false;

                                                    if(JSB().isFunction($this.options.onSelect)){
                                                        flag = $this.options.onSelect.call(this, evt);
                                                    }

                                                    if(!flag && $this._clickEvt){
                                                        evt.preventDefault();
                                                        $this._clickEvt = null;
                                                        $this._addNewFilter(evt);
                                                    }
                                                },
                                                unselect: function(evt) {
                                                    var flag = false;

                                                    if(JSB().isFunction($this.options.onUnselect)){
                                                        flag = $this.options.onUnselect.call(this, evt);
                                                    }

                                                    if(!flag && $this._deselectCategoriesCount === 0){
                                                        if(Object.keys($this._curFilters).length > 0){
                                                            evt.preventDefault();

                                                            if(evt.accumulate){
                                                                $this.removeFilter($this._curFilters[evt.target.category]);
                                                                $this._deselectAllCategory(evt.target.category);
                                                                delete $this._curFilters[evt.target.category];
                                                                $this.refreshAll();
                                                            } else {
                                                                for(var i in $this._curFilters){
                                                                    $this.removeFilter($this._curFilters[i]);
                                                                    $this._deselectAllCategory(i);
                                                                }
                                                                $this._curFilters = {};
                                                                $this.refreshAll();
                                                            }
                                                        }
                                                    } else {
                                                        $this._deselectCategoriesCount--;
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
                                        },
                                        stack: seriesContext[i].get(7).value()
                                    };
                                }

                                var a = seriesContext[i].get(1).value();
                                if(JSB().isArray(a)){
                                    series[i].data = a;
                                } else {
                                    series[i].data.push(a);
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

                            for(var i = 0; i < yAxisContext.length; i++){
                                yAxis[i] = {
                                    title: {
                                        text: yAxisContext[i].get(0).value().get(0).value(),
                                        style: {
                                            color: $this.isNull(yAxisContext[i].get(0).value().get(1).value().get(0).value())
                                        }
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
                        }

                        var chart = {
                            chart: {
                                zoomType: 'x'
                            },

                            title: {
                                text: this.getContext().find('title').value()
                            },

                            subtitle: {
                                text: this.getContext().find('subtitle').value()
                            },

                            xAxis: [{
                                categories: xAxis,
                                crosshair: true
                            }],

                            yAxis: yAxis,

                            tooltip: {
                                shared: true
                            },

                            legend: {
                                layout: 'vertical',
                                align: 'left',
                                x: 80,
                                verticalAlign: 'top',
                                y: 55,
                                floating: true,
                                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
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

                        if($this.getContext().find('isStacking').used()){
                            chart.plotOptions.column = {
                                stacking: 'normal'
                            }
                        }
                    } catch(e){
                        console.log(e);
                        return;
                    } finally {
                        $this.getElement().loader('hide');
                    }

                    $this.container.highcharts(chart);

                    $this.chart =  $this.container.highcharts();
                });

            }, function(){
                return $this.isInit;
            });
        },

        _addNewFilter: function(evt){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var field = this.getContext().find("xAxis").get(0).value().binding()[0];
            if(!field[0]) return;

            var fDesc = {
                sourceId: context.source,
                type: '$or',
                op: '$eq',
                field: field,
                value: evt.target.category
            };

            if(!evt.accumulate && Object.keys(this._curFilters).length > 0){
                for(var i in this._curFilters){
                    this._deselectAllCategory(i);
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};
            }

            if(!this.hasFilter(fDesc)){
                this._selectAllCategory(evt.target.category);
                this._curFilters[evt.target.category] = this.addFilter(fDesc);
                this.refreshAll();
            }
        },

        // utils
        isNull: function(a, b){
            if(b) return a === null ? undefined : parseInt(a);
            return a === null ? undefined : a;
        },

        _selectAllCategory: function(cat){
            var series = this.chart.series;

            for(var i = 0; i < series.length; i++){
                for(var j = 0; j < series[i].points.length; j++){
                    if(series[i].points[j].category === cat && !series[i].points[j].selected){
                        series[i].points[j].select(true, true);
                        break;
                    }
                }
            }
        },

        _deselectAllCategory: function(cat){
            var series = this.chart.series;

            for(var i = 0; i < series.length; i++){
                for(var j = 0; j < series[i].points.length; j++){
                    if(series[i].points[j].category === cat && series[i].points[j].selected){
                        this._deselectCategoriesCount++;
                        series[i].points[j].select(false, true);
                        break;
                    }
                }
            }
        }
	}
}