{
	$name: 'DataCube.Widgets.HighchartsBasicArea',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Линейный с заливкой',
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
                    type: 'group',
                    name: 'Данные осей',
                    key: 'categories',
                    multiple: 'true',
                    items: [
                        {
                            name: 'Категории',
                            type: 'item',
                            key: 'categoriesItem',
                            binding: 'field',
                            itemType: 'any'
                        },
                        {
                            name: 'Фильтрующие поля',
                            type: 'item',
                            key: 'isFilterField',
                            optional: true,
                            editor: 'none'
                        }
                    ]
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
                        itemType: 'string'
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
                    name: 'Подписи',
                    key: 'labels',
                    items: [
                    {
                        type: 'item',
                        name: 'Показывать подписи',
                        key: 'enabled',
                        optional: 'checked',
                        editor: 'none'
                    },
                    {
                        type: 'item',
                        name: 'Поворот',
                        key: 'rotation',
                        itemType: 'string'
                    }
                    ]
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
						description: 'Например, {value:.2f}'
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
                    key: 'name',
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
                    key: 'displayType',
                    items:[
                    {
                        name: 'area',
                        type: 'item',
                        key: 'area',
                        editor: 'none'
                    },
                    {
                        name: 'areaspline',
                        type: 'item',
                        key: 'areaspline',
                        editor: 'none'
                    },      
                    {
                        name: 'column',
                        type: 'item',
                        key: 'column',
                        editor: 'none'
                    },
                    {
                        name: 'line',
                        type: 'item',
                        key: 'line',
                        editor: 'none'
                    },
                    {
                        name: 'spline',
                        type: 'item',
                        key: 'spline',
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
                    },
                    {
                        type: 'item',
                        name: 'Формат',
                        key: 'format',
                        itemType: 'string',
						description: 'The HTML of the point\'s line in the tooltip. Variables are enclosed by curly brackets. Available variables are point.x, point.y, series.name and series.color and other properties on the same form. Defaults to <code>&lt;span style="color:{point.color}"&gt;\u25CF&lt;/span&gt; {series.name}: &lt;b&gt;{point.y}&lt;/b&gt;&lt;br/&gt;</code>.'
                    }
                    ]
                },
                {
                    name: 'Индекс yAxis',
                    type: 'item',
                    key: 'iAxisIndex',
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
                    name: 'Цвет',
                    type: 'item',
                    key: 'color',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Цветовая схема',
                    type: 'group',
                    key: 'colorScheme',
                    optional: true,
                    items: [
                    {
                        name: 'Уровень оси Х',
                        type: 'item',
                        key: 'xLevel',
                        itemType: 'string'
                    },
                    {
                        name: 'Схема',
                        type: 'select',
                        key: 'scheme',
                        items: [
                        {
                            name: '#1',
                            type: 'item',
                            key: 'color1',
                            editor: 'none',
                            itemValue: 0
                        },
                        {
                            name: '#2',
                            type: 'item',
                            key: 'color2',
                            editor: 'none',
                            itemValue: 1
                        },
                        {
                            name: '#3',
                            type: 'item',
                            key: 'color3',
                            editor: 'none',
                            itemValue: 2
                        },
                        {
                            name: '#4',
                            type: 'item',
                            key: 'color4',
                            editor: 'none',
                            itemValue: 3
                        }
                        ]
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Маркер',
                    key: 'marker',
	                items: [
	                {
	                    name: 'The fill color of the point marker',
	                    type: 'item',
	                    key: 'pointColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor'
	                },
	                {
	                    name: 'The color of the point marker\'s outline',
	                    type: 'item',
	                    key: 'outlineColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
	                    itemValue: '#ffffff'
	                },
	                {
	                    name: 'The width of the point marker\'s outline',
	                    type: 'item',
	                    key: 'pointWidth',
	                    itemType: 'string',
	                    itemValue: '0'
	                },
	                {
	                    name: 'The radius of the point marker',
	                    type: 'item',
	                    key: 'pointRadius',
	                    itemType: 'string',
	                    itemValue: '4'
	                },
	                {
	                    name: 'A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)".',
	                    type: 'item',
	                    key: 'markerSymbol',
	                    itemType: 'string'
	                }]
                },
                /*,
                
                {
                    name: 'Стек',
                    type: 'item',
                    itemType: 'string',
                    description: 'Имя стека. Для объединения серий в один столбец следет указать одинаковые имена стеков. Работает только при отмеченном поле "Стек".'
                }*/
                {
                    name: 'Показывать по умолчанию',
                    type: 'item',
                    key: 'visible',
                    editor: 'none',
                    optional: 'checked',
                    description: 'Показывать по умолчанию указанную серию на графике.'
                },
                {
                    type: 'group',
                    name: 'Drilldown',
                    key: 'drilldown',
	                items: [
						{
                            name: 'Виджет',
                            type: 'item',
                            key: 'widget',
                            editor: 'none',
                            binding: 'readyWidget'
						}
					]
				}
                ]
            }
            ]
        },
        {
            type: 'group',
            name: 'Легенда',
            key: 'legend',
            items: [
            {
                name: 'Активна',
                type: 'item',
                key: 'enabled',
                optional: true,
                editor: 'none'
            }
            ]
        },
        /*
        {
            name: 'Стек',
            key: 'isStacking',
            type: 'item',
            optional: true,
            editor: 'none'
        },
        */
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
        },
		{
			name: 'Использовать Drilldown',
			type: 'item',
			key: 'useDrilldown',
			editor: 'none',
			optional: true
		}
        ]
    },
	$client: {
	    $require: ['JQuery.UI.Loader', 'JSB.Crypt.MD5'],
	    
        _curFilters: {},
        _deselectCategoriesCount: 0,
        _curFilterHash: null,
        _widgetFilters: [],
        	    
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			this.loadCss('HighchartsBasicArea.css');
			JSB().loadScript('tpl/highstock/highstock.js', function(){
			    JSB().loadScript('tpl/highstock/plugins/grouped-categories.js', function(){
			        self.init();
			    });
			});
		},

		colors: [
            ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
            ["#626a7a", "#9a554b", "#adadad", "#738299", "#d88a82", "#d1d1d1", "#110c08", "#b5cce2", "#e5e5e5"],
            ["#1c3e7e", "#ca162a", "#006da9", "#b2d3e5", "#efb9bf", "#bfc6d9"],
            ["#1c3e7e", "#ff553e", "#8e8e8e", "#ffccc5", "#d0d0d0", "#636363"],
            ["#4fbde2", "#ffd682", "#89cbc6", "#8a5c91", "#cac3be", "#caebf6", "#fff3d9", "#dbefee", "#dccede", "#4f3928"]
        ],

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

// filters section
/**
Не используем globalFilters, если требуется drilldown
**/
if( !(this.hasOwnProperty('useInDrilldown') && this.useInDrilldown) ) {
            var globalFilters = source.getFilters();

            if(globalFilters){
                var categories = this.getContext().find("xAxis").find('categories').values(),
                    binding = categories[categories.length - 1].binding()[0],
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
}
// end filters section

            var seriesContext = this.getContext().find('series').values(),
                xAxisContext = this.getContext().find('xAxis').find('categories').values();

            var colorSettings = [];
            for(var i = 0; i < seriesContext.length; i++){
                var seriesColorScheme = seriesContext[i].find('colorScheme');
                if(seriesColorScheme.used()){
                    colorSettings[i] = {
                        xLevel: seriesColorScheme.value().get(0).value() - 1,
                        scheme: seriesColorScheme.value().get(1).value().value(),
                        k: 0
                    }
                }
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var seriesData = [],
                        xAxisCategories = [],
                        colorMap = {};

                    function rec(i, length){
                        if(i === length){
                            return undefined;
                        }
                        return [{
                            name: xAxisContext[i].get(0).value(),
                            categories: rec(i + 1, length)
                        }];
                    }

                    function merge(obj1, obj2){
                        for(var i = 0; i < obj2.length; i++){
                            var f = false;
                            for(var j = 0; j < obj1.length; j++){
                                if(obj2[i].name === obj1[j].name){
                                    f = true;
                                    if(obj1[j].categories){
                                        obj1[j].categories = merge(obj1[j].categories, obj2[i].categories);
                                    } else {
                                        obj1[j].categories = obj2[i].categories;
                                    }
                                }
                            }
                            if(!f){
                                obj1.push(obj2[i]);
                            }
                        }
                        return obj1;
                    }

                    try {
                        while(source.next()){
                            for(var i = 0; i < seriesContext.length; i++){
                                var a = seriesContext[i].get(1).value();

                                if(!seriesData[i]){
                                    seriesData[i] = [];
                                }

                                if(colorSettings[i]){
                                    if(!colorMap[xAxisContext[colorSettings[i].xLevel].get(0).value()]){
                                        if(colorSettings[i].k === $this.colors[colorSettings[i].scheme].length){
                                            colorSettings[i].k = 0;
                                        }
                                        colorMap[xAxisContext[colorSettings[i].xLevel].get(0).value()] = $this.colors[colorSettings[i].scheme][colorSettings[i].k];
                                        colorSettings[i].k++;
                                    }
                                }

                                if(JSB().isArray(a)){
                                    seriesData[i] = a;
                                } else {
                                    if(colorSettings[i]){
                                        seriesData[i].push({
                                            y: a,
                                            color: colorMap[xAxisContext[colorSettings[i].xLevel].get(0).value()]
                                        });
                                    } else {
                                        seriesData[i].push(a);
                                    }
                                }
                            }

                            if(xAxisContext.length > 1){
                                xAxisCategories = merge(xAxisCategories, rec(0, xAxisContext.length));
                            } else {
                                var a = xAxisContext[0].get(0).value();
                                xAxisCategories.push(a ? a : 'Null');
                            }
                        }

                        if(opts && opts.isCacheMod){
                            $this.storeCache({
                                seriesData: seriesData,
                                xAxis: xAxisCategories
                            });
                        }

                        $this._buildChart(seriesData, xAxisCategories);
                    } catch(ex) {
                        console.log(ex);
                    } finally {
                        $this.getElement().loader('hide');
                    }
                });

            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(seriesData, xAxisData){
            try{
                var seriesContext = this.getContext().find('series').values(),
                    yAxisContext = this.getContext().find('yAxis').values(),
                    xAxisContext = this.getContext().find('xAxis').values(),
                    xAxisCategories = this.getContext().find('xAxis').find('categories').values(),
                    yAxis = [],
                    series = [],
					that = this;

                var filterFields = [];
                for(var i = 0; i < xAxisCategories.length ; i++){
                    if(xAxisCategories[i].get(1).used()){
                        filterFields.push({
                            index: xAxisCategories.length - i - 1,
                            binding: xAxisCategories[i].get(0).binding()[0]
                        });
                    }
                }

                for(var i = 0; i < seriesContext.length; i++){
                    if(!series[i]){
                        var drilldown = seriesContext[i].find('widget').value();

                        series[i] = {
                            name: seriesContext[i].get(0).value(),
                            data: seriesData[i],
                            type: seriesContext[i].get(2).value().name(),
                            tooltip: {
                                valueSuffix: seriesContext[i].get(3).value().get(0).value()
                            },
                            yAxis: $this.isNull(seriesContext[i].get(4).value(), true),
                            dashStyle: seriesContext[i].get(5).value().name(),
                            color: $this.isNull(seriesContext[i].get(6).value()),
                            marker: {
                                // The fill color of the point marker
                                fillColor: $this.isNull(seriesContext[i].get(8).value().get(0).value()),
                                // The color of the point marker's outline
                                lineColor: $this.isNull(seriesContext[i].get(8).value().get(1).value()),
                                // The width of the point marker's outline
                                lineWidth: (($this.isNull(seriesContext[i].get(8).value().get(2).value()) !== undefined) ? parseInt($this.isNull(seriesContext[i].get(8).value().get(2).value()),10) : undefined),
                                // The radius of the point marker
                                radius: (($this.isNull(seriesContext[i].get(8).value().get(3).value()) !== undefined) ? parseInt($this.isNull(seriesContext[i].get(8).value().get(3).value()),10) : undefined),
                                // A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)".
                                symbol: $this.isNull(seriesContext[i].get(8).value().get(4).value())
                            },
                            visible: seriesContext[i].find('visible').used(),
							widgetWsid: drilldown ? drilldown.widgetWsid : undefined,
							widgetWid: drilldown ? drilldown.widgetWid : undefined,
							widgetFilter: filterFields,
                            point: {
                                events: {
                                    click: function(evt) {
										/**
										Пользователь явно отметил "Использовать Drilldown", 
										иначе используется "штатный" функционал
										**/
										if( that.getContext().find('useDrilldown').used() ) {
											/**
											**/
											if(this.series.hasOwnProperty('options') && 
												this.series.options.hasOwnProperty('widgetWsid') && this.series.options.widgetWsid && this.series.options.widgetWsid.length && 
												this.series.options.hasOwnProperty('widgetWid') && this.series.options.widgetWid && this.series.options.widgetWid.length && 
												this.series.options.hasOwnProperty('widgetFilter')) {

												var wsid = this.series.options.widgetWsid,
													wid = this.series.options.widgetWid,
													/**
													Идентификатор установленного в результате drilldown-а фильтра
													**/
													myFilterId = null,
													/**
													Контейнер, в котором находится текущий виджет
													**/
													el = $this.container[0].parentNode.parentNode, 
													/**
													Идентификатор создаваемого виджета
													**/
													id = ['drilldownWidgetContainer', wsid, wid].join("_"),
													prevId = ['prevDrilldownWidgetContainer', wsid, wid].join("_"),
													/**
													Контейнер, в который будет помещён новый widget
													**/
													div = document.createElement('div'), 
													/**
													Контейнер для кнопки "Назад"
													**/
													back = document.createElement('div');

                                                var catArr = [];
                                                function findCategories(categories){
                                                    catArr.push(categories.name);
                                                    if(categories.parent){
                                                        catArr.push(findCategories(categories.parent));
                                                    }
                                                }
                                                findCategories(this.category);

                                                var filters = [];
                                                for(var i = 0; i < this.series.options.widgetFilter.length; i++){
                                                    filters.push({
                                                        binding: this.series.options.widgetFilter[i].binding,
                                                        value: catArr[this.series.options.widgetFilter[i].index]
                                                    })
                                                }

												/**
												Скрываем текущий виджет
												**/
												el.style.display = 'none';
												
												/**
												Кнопка "назад"
												**/
												back.setAttribute('class', 'drilldown-back-container');
												back.innerHTML = '<a href="#" class="drilldown-back-button">&larr;&nbsp;Назад</a>';
												back.addEventListener("click", function(e) {
													/**
													Отображаем "родительский" виджет
													**/
													document.getElementById(back.parentNode.getAttribute('prev')).style.display = 'block';
													/**
													Удалить ранее установленный фильтр...
													**/
													try {
														JSB.getInstance('DataCube.Api.WidgetController')
														.lookupWidget(wid, function(widget){
															widget.removeFilter(myFilterId);
															widget.refresh();
														});		
													} catch(e) {
														console.log(e);
													}
													/**
													Удаляем контейнер текущего виджета вместе со всем содержимым
													**/
													back.parentNode.parentNode.removeChild(back.parentNode);
												});
												div.appendChild(back);

												/**
												Если el.id нету - создать его
												**/
												if( !el.hasOwnProperty('id') ) {
													el.setAttribute('id', prevId);
												}
												/**
												**/
												div.setAttribute('id', id);
												div.setAttribute('prev', el.getAttribute('id'));
												el.parentNode.insertBefore(div,el.nextSibling);
												 
												/**
												**/
												JSB.create('DataCube.Api.Widget', {
													wsid: wsid, 
													wid: wid,
													onCreateWidget: function(widget){
														this.$('#' + id).append(widget.getElement());
														widget.useInDrilldown = true;
														widget.refresh();
														//console.log(that.getFilterManager());
														//console.log(that.getFilters());
													}
												});
												
												/**
												Если указано фильтрующее поле и есть значение по оси Х - применям фильтр
												**/
												if(filters) {
													try {
														JSB.deferUntil(function() {	
															JSB.getInstance('DataCube.Api.WidgetController')
															.lookupWidget(wid, function(widget){
																/**
																Дожидаемся загрузеки виджета
																**/
																JSB.deferUntil(function() {
                                                                    /**
																	Прменяем drilldown-фильтр
																	**/
																    for(var i = 0; i < filters.length; i++){
                                                                        var filterDesc = {
                                                                            type: '$and',
                                                                            op: '$eq',
                                                                            field: filters[i].binding,
                                                                            value: filters[i].value
                                                                        };

                                                                        myFilterId = widget.addFilter(filterDesc);
																    }
																	/**
																	Применяем "родительские" фильтры, хотя они вроде как уже должны бы быть применены
																	**/
																	var parentWidgetFilters = that.getFilters();
																	for(var i in parentWidgetFilters){
																		if(parentWidgetFilters.hasOwnProperty(i)) {
																			if(parentWidgetFilters[i].hasOwnProperty('type') && 
																				parentWidgetFilters[i].hasOwnProperty('op') && 
																				parentWidgetFilters[i].hasOwnProperty('field') && 
																				parentWidgetFilters[i].hasOwnProperty('value') ) {
																				
																				filterDesc = {
																					type: parentWidgetFilters[i].type,
																					op: parentWidgetFilters[i].op,
																					field: parentWidgetFilters[i].field,
																					value: parentWidgetFilters[i].value
																				};		
	
																				if(!widget.hasFilter(filterDesc)) {
																					widget.addFilter(filterDesc);
																				}
																			}
																		}
																	}
																	/**
																	**/
																	widget.refresh();	
	
																	/*
																	console.log('fmt', that.getFilterManager());
																	console.log('ft', that.getFilters());
																	console.log('fmw', widget.getFilterManager());
																	console.log('fw', widget.getFilters());
																	*/
																	
																}, function() {
																	return widget.isInit;
																});
															});		
														}, function() {
															return (JSB.getInstance('DataCube.Api.WidgetController') !== undefined);
														}); 
													} catch(e) {
														console.log(e);
													}
												}
												
											} else {
												/**
												Нет необходимых настроек - серия не поддерживает drilldown
												**/
											}
											
											/**
											**/
											return false;
										
										} else {
											$this._clickEvt = evt;

											if(JSB().isFunction($this.options.onClick)){
												$this.options.onClick.call(this, evt);
											}
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
										/**
										Если используется drilldown, то на поддерживающих его объектах курсор меняется на "лапку"
										**/
                                    	if( that.getContext().find('useDrilldown').used() && this.series.hasOwnProperty('options') && 
											this.series.options.hasOwnProperty('widgetWsid') && this.series.options.widgetWsid && this.series.options.widgetWsid.length && 
											this.series.options.hasOwnProperty('widgetWid') && this.series.options.widgetWid && this.series.options.widgetWid.length && 
											this.series.options.hasOwnProperty('widgetFilter')) {
												this.graphic.element.style.cursor = 'pointer';
                                    	}
                                    	
                                        if(JSB().isFunction($this.options.mouseOver)){
                                            $this.options.mouseOver.call(this, evt);
                                        }
                                    }
                                }
                            }
                            //,stack: seriesContext[i].get(8).value()
                        };

                        /**
                        **/
                        var tooltipPointFormat = $this.safeGetValue(seriesContext[i], [3,1]);
                        if( tooltipPointFormat ) {
                            series[i].tooltip.pointFormat = tooltipPointFormat;
                        }
                        /**
                        **/
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

                xAxis = {
                    categories: xAxisData,
                    title: {
                        text: xAxisContext[0].get(1).value().get(0).value(),
                        style: {
                            color: $this.isNull(xAxisContext[0].get(1).value().get(1).value().get(0).value())
                        },
                        align: 'high'
                    },
                    labels: {
                        enabled: xAxisContext[0].get(2).value().get(0).used(),
                        rotation: xAxisContext[0].get(2).value().get(1).value()
                    }
                }

                var colors = [
                    ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                    ["#626a7a", "#9a554b", "#adadad", "#738299", "#d88a82", "#d1d1d1", "#110c08", "#b5cce2", "#e5e5e5"],
                    ["#1c3e7e", "#ca162a", "#006da9", "#b2d3e5", "#efb9bf", "#bfc6d9"],
                    ["#1c3e7e", "#ff553e", "#8e8e8e", "#ffccc5", "#d0d0d0", "#636363"],
                    ["#4fbde2", "#ffd682", "#89cbc6", "#8a5c91", "#cac3be", "#caebf6", "#fff3d9", "#dbefee", "#dccede", "#4f3928"]
                ],
                colorSchemeIdx = parseInt(this.getContext().find('colorScheme').value().name().toString().replace(/\D/g,''), 10);

                var chartOptions = {
                    HighchartsBasicArea: {
                    	version: 'v-2017-10-11-01'
                    },

                    colors: !colors.hasOwnProperty(colorSchemeIdx) ? colors[0] : colors[colorSchemeIdx],

                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    xAxis: xAxis,

                    yAxis: yAxis,

                    tooltip: {
                        shared: true
                    },

                    legend: {
                        enabled: this.getContext().find('legend').find('enabled').used(),
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
                var wTypeName = $this.hasOwnProperty('wrapper') && $this.wrapper.hasOwnProperty('widgetEntry') && $this.wrapper.widgetEntry.hasOwnProperty('wType') ? $this.wrapper.widgetEntry.wType : '';
                console.log("Exception", [wTypeName, e]);
            }
        },

        _addNewFilter: function(evt){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var categories = this.getContext().find("xAxis").find('categories').values();
            var field = categories[categories.length - 1].binding()[0];
            if(!field) return;

            var fDesc = {
                sourceId: context.source,
                type: '$or',
                op: '$eq',
                field: field,
                value: evt.target.category.name
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
		
		safeGetValue: function(context, args) {
			if( context !== null && typeof context === 'object') {
				if( args !== null && (!!args && args.constructor === Array) && args.length) {
					if(context.get(args[0]) !== null) {
						var value = context.get(args[0]).value();
						return (((args.length === 1) || (value === null)) ? value : this.safeGetValue(value, args.slice(1)));
					}
				}
			}
			
			return;
		},

        _selectAllCategory: function(cat){
            var series = this.chart.series;

            for(var i = 0; i < series.length; i++){
                for(var j = 0; j < series[i].points.length; j++){
                    if(series[i].points[j].category.name === cat && !series[i].points[j].selected){
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
                    if(series[i].points[j].category.name === cat && series[i].points[j].selected){
                        this._deselectCategoriesCount++;
                        series[i].points[j].select(false, true);
                        break;
                    }
                }
            }
        }
	}
}