{
	$name: 'DataCube.Widgets.HighchartsBasicBar',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Барчарт',
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
                    key: 'categories',
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
                    key: 'type',
                    items:[
                    {
                        name: 'bar',
                        type: 'item',
                        key: 'bar',
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
                    key: 'yAxisIndex',
                    description: 'В случаях использования двух или более Y-осей, данный параметр определяет с какой из осей должна быть связана данная серия. Значением данного параметра должен быть индекс (порядковый номер) требуемой оси в массиве осей. При этом, нумерация осей начинается с 0. Значение по умолчанию: 0.'
                },
                /*
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
                */
                {
                    name: 'Цвет',
                    type: 'item',
                    key: 'color',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                }
                ,{
                    type: 'group',
                    key: 'labelOptions',
                    name: 'Options for the series data labels, appearing next to each data point',
	                items: [
	                {
	                    name: 'Включить отображение',
	                    type: 'item',
	                    key: 'enable',
	                    optional: true,
						editor: 'none'
					},
	                {
	                    name: 'Формат',
	                    type: 'item',
	                    key: 'format',
	                    itemType: 'string',
	                    itemValue: '',
						description: 'Например, {y:,.2f}'
					}
					]
				}
                /*,
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
                }*/
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
	    
        _curFilters: {},
        _deselectCategoriesCount: 0,
        _curFilterHash: null,
	    
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			this.loadCss('HighchartsBasicBar.css');
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
                    
                    try {
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
										dataLabels: {
											enabled: false,
											format: '{y:,.0f}'
										},
										yAxis: $this.isNull(seriesContext[i].get(4).value(), true),
										//dashStyle: seriesContext[i].get(5).value().name(),
										color: $this.isNull(seriesContext[i].get(5).value()),
										/*
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
										*/
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
									/**
									**/
									var tooltipPointFormat = $this.safeGetValue(seriesContext[i], [3,1]);
									if( tooltipPointFormat ) {
										series[i].tooltip.pointFormat = tooltipPointFormat;
									}
									var showDataLabes = seriesContext[i].get(6).value().get(0).used();
									if( showDataLabes ) {
										series[i].dataLabels.enabled = true;
										series[i].dataLabels.format = $this.safeGetValue(seriesContext[i], [6,1]) || '{y:,.0f}';
									}
									/**
									**/
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
							["#626a7a", "#9a554b", "#adadad", "#738299", "#d88a82", "#d1d1d1", "#110c08", "#b5cce2", "#e5e5e5"],
							["#1c3e7e", "#ca162a", "#006da9", "#b2d3e5", "#efb9bf", "#bfc6d9"],
							["#1c3e7e", "#ff553e", "#8e8e8e", "#ffccc5", "#d0d0d0", "#636363"],
							["#4fbde2", "#ffd682", "#89cbc6", "#8a5c91", "#cac3be", "#caebf6", "#fff3d9", "#dbefee", "#dccede", "#4f3928"]							
						], colorSchemeIdx = parseInt(this.getContext().find('colorScheme').value().name().toString().replace(/\D/g,''), 10);
						
						var chartOptions = {
						
								HighchartsBasicBar: {
									version: 'v-2017-09-21-03'
								},                    

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
								shared: false
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
								/*,                        
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
								*/
							},
							
							credits: {
								enabled: false
							},                        

							series: series
						};
						
						$this.container.highcharts(chartOptions);

						console.log(chartOptions);

						$this.chart =  $this.container.highcharts();
						
					} catch(e) {
						var wTypeName = $this.hasOwnProperty('wrapper') && $this.wrapper.hasOwnProperty('widgetEntry') && $this.wrapper.widgetEntry.hasOwnProperty('wType') ? $this.wrapper.widgetEntry.wType : '';
						console.log("Exception", [wTypeName, e]);
					} finally {
						$this.getElement().loader('hide');
					}
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