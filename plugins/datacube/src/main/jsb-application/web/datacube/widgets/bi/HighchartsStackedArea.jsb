{
	$name: 'DataCube.Widgets.HighchartsStackedArea',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Линейный с накоплением',
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
                    binding: 'field',
                    itemType: 'any',
                },
                {
                    type: 'group',
                    name: 'Заголовок',
                    items: [
                    {
                        type: 'item',
                        name: 'Текст',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
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
                multiple: 'true',
                items: [
                {
                    type: 'group',
                    name: 'Заголовок',
                    items: [
                    {
                        type: 'item',
                        name: 'Текст',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
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
                    items: [
                    {
                        type: 'item',
                        name: 'Формат',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
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
                    itemType: 'string',
                    itemValue: ''
                },
                {
                    name: 'Данные',
                    type: 'item',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },
                {
                    name: 'Тип отображения',
                    type: 'select',
                    items:[
                    {
                        name: 'area',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'areaspline',
                        type: 'item',
                        editor: 'none'
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Tooltip',
                    items: [
                    {
                        type: 'item',
                        name: 'Суффикс значения',
                        itemType: 'string'
                    }
                    ]
                },
                {
                    name: 'Индекс yAxis',
                    type: 'item',
                    itemType: 'string'
                },
                {
                    name: 'Тип линии',
                    type: 'select',
                    items:[
                    {
                        name: 'Solid',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDash',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDotDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'Dot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'Dash',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'LongDash',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'DashDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDotDot',
                        type: 'item',
                        editor: 'none'
                    }
                    ]
                },
                {
                    name: 'Цвет',
                    type: 'item',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    type: 'group',
                    name: 'Маркер',
	                items: [
	                {
	                    name: 'The fill color of the point marker',
	                    type: 'item',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor'
	                },
	                {
	                    name: 'The color of the point marker\'s outline',
	                    type: 'item',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
	                    itemValue: '#ffffff'
	                },
	                {
	                    name: 'The width of the point marker\'s outline',
	                    type: 'item',
	                    itemType: 'string',
	                    itemValue: '0'
	                },
	                {
	                    name: 'The radius of the point marker',
	                    type: 'item',
	                    itemType: 'string',
	                    itemValue: '4'
	                },
	                {
	                    name: 'A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)".',
	                    type: 'item',
	                    itemType: 'string'
	                }]
                }
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
                editor: 'none'
            },
            {
                name: '#2',
                type: 'item',
                editor: 'none'
            },
            {
                name: '#3',
                type: 'item',
                editor: 'none'
            },
            {
                name: '#4',
                type: 'item',
                editor: 'none'
            }
            ]
        },
        {
            name: 'Режим накопления',
            key: 'stacking',
            type: 'select',
            items:[
            {
                name: 'normal',
                type: 'item',
                editor: 'none'
            },
            {
                name: 'percent',
                type: 'item',
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
			this.loadCss('HighchartsStackedArea.css');
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
                                    marker: {
					                    // The fill color of the point marker
					                    fillColor: $this.isNull(seriesContext[i].get(7).value().get(0).value()),
					                    // The color of the point marker's outline
					                    lineColor: $this.isNull(seriesContext[i].get(7).value().get(1).value()),
					                    // The width of the point marker's outline
					                    lineWidth: (($this.isNull(seriesContext[i].get(7).value().get(2).value()) !== undefined) ? parseInt($this.isNull(seriesContext[i].get(7).value().get(2).value()),10) : undefined),
					                    // The radius of the point marker
					                    radius: (($this.isNull(seriesContext[i].get(7).value().get(3).value()) !== undefined) ? parseInt($this.isNull(seriesContext[i].get(7).value().get(3).value()),10) : undefined),
					                    // A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)".
					                    symbol: $this.isNull(seriesContext[i].get(7).value().get(4).value())
                                    },
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
                                    }
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
                            layout: 'horizontal',
                            floating: false,
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0,
                            itemDistance: 30,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },

                        plotOptions: {
                        	area: {
            					stacking: this.getContext().find('stacking').value().name().toString()
            				},
                        	areaspline: {
            					stacking: this.getContext().find('stacking').value().name().toString()
            				},
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
                    
                    try {
                    	$this.container.highcharts(chartOptions);
                    } catch(e) {
                    	console.log("Exception", e);
                    }

					console.log(chartOptions);

                    $this.getElement().loader('hide');
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