{
	$name: 'DataCube.Widgets.HighchartsStackedColumn',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Тип#1, столбики с накоплением',
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
                        name: 'column',
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
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
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
        /**
        The total value for each bar in a stacked column or bar chart.
        stackLabels
			0	enabled: false
			1	align: undefined
			2	format: "{total}"
			3	rotation: 0
			4	textAlign: undefined
			5	useHTML: false
			6	verticalAlign: undefined
			7	x: undefined
			8	y: undefined        
         
        **/
        ,{
            type: 'group',
            key: 'yAxisStackLabels',
            name: 'yAxis.stackLabels: the total value for each bar in a stacked column or bar chart',
            items: [
			{
				// 0	enabled: false
				type: 'item',
				name: 'Включено',
				optional: true
			},
			{
				// 1	align: undefined
                type: 'item',
				name: 'align',
                itemType: 'string'
			},
			{
				// 2	format: "{total}"
                type: 'item',
				name: 'format',
                itemType: 'string',
                itemValue: '{total}'
			},
			{
				// 3	rotation: 0
                type: 'item',
				name: 'rotation',
                itemType: 'number',
                itemValue: '0'
			},
			{
				// 4	textAlign: undefined
                type: 'item',
				name: 'textAlign',
                itemType: 'string'
			},
			{
				// 5	useHTML: false
				type: 'item',
				name: 'useHTML',
				optional: true
			},
			{
				// 6	verticalAlign: undefined	
                type: 'item',
				name: 'verticalAlign',
                itemType: 'string'
			},
			{
				// 7	x: undefined	
                type: 'item',
				name: 'x',
                itemType: 'number'
			},
			{
				// 8	y: undefined	
                type: 'item',
				name: 'y',
                itemType: 'number'
			},
			{
				//	9	color**: undefined
				type: 'item',
				name: 'color',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			}			
            ]
        }        
        /**
        Options for the series data labels, appearing next to each data point.
        plotOptions.column.dataLabels
			0	enabled: false
			1	align: "center"
			2	allowOverlap: false
			3	backgroundColor: undefined
			4	borderColor: undefined
			5	borderRadius: 0
			6	borderWidth: 0
			7	color: undefined
			8	crop: true
			9	format: "{y}"
			10	inside: undefined
			11	overflow: "justify"
			12	padding: 5
			13	rotation: 0
			14	shadow: false
			15	shape: "square"
			16	useHTML: false
			17	verticalAlign: undefined
			18	x: 0
			19	y: -6
			20	zIndex: 6        
        **/
        ,{
            type: 'group',
            key: 'plotOptionsColumnDataLabels',
            name: 'plotOptions.column.dataLabels: options for the series data labels, appearing next to each data point',
            items: [
			{
				// 0	enabled: false
				type: 'item',
				name: 'Включено',
				optional: true
			},
			{
				// 1	align: "center"
                type: 'item',
				name: 'align',
                itemType: 'string',
				itemValue: "center"
			},
			{
				// 2	allowOverlap: false
				type: 'item',
				name: 'allowOverlap',
				optional: true
			},
			{
				//	3	backgroundColor: undefined
				type: 'item',
				name: 'backgroundColor',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			},
			{
				//	4	borderColor: undefined
				type: 'item',
				name: 'borderColor',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			},
			{
				//	5	borderRadius: 0
				type: 'item',
				name: 'borderRadius',
                itemType: 'number',
				itemValue: '0'
			},
			{
				//	6	borderWidth: 0
				type: 'item',
				name: 'borderWidth',
                itemType: 'number',
				itemValue: '0'
			},
			{
				//	7	color: undefined
				type: 'item',
				name: 'color',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			},
			{
				// 8	crop: true
				type: 'item',
				name: 'crop',
				optional: true
			},
			{
				// 9	format: "{y}"
                type: 'item',
				name: 'format',
                itemType: 'string',
                itemValue: '{y}'
			},
			{
				// 10	inside: undefined
                type: 'item',
				name: 'inside',
                itemType: 'string'
			},
			{
				//	11	overflow: "justify"
				type: 'item',
				name: 'overflow',
                itemType: 'string',
				itemValue: 'justify'
			},
			{
				//	12	padding: 5
				type: 'item',
				name: 'padding',
                itemType: 'number',
				itemValue: '5'
			},
			{
				// 13	rotation: 0
                type: 'item',
				name: 'rotation',
                itemType: 'number',
                itemValue: '0'
			},
			{
				// 14	shadow: false
				type: 'item',
				name: 'shadow',
				optional: true
			},
			{
				// 15	shape: "square"
                type: 'item',
				name: 'shape',
                itemType: 'string',
                itemValue: 'square'
			},
			{
				// 16	useHTML: false
				type: 'item',
				name: 'useHTML',
				optional: true
			},
			{
				// 17	verticalAlign: undefined	
                type: 'item',
				name: 'verticalAlign',
                itemType: 'string'
			},
			{
				// 18	x: 0	
                type: 'item',
				name: 'x',
                itemType: 'number',
				itemValue: '0'
			},
			{
				// 19	y: -6	
                type: 'item',
				name: 'y',
                itemType: 'number',
				itemValue: '-6'
			},
			{
				// 20	zIndex: 6
                type: 'item',
				name: 'zIndex',
                itemType: 'number',
				itemValue: '6'
			}
            ]
        }        
        ]
    },
	$client: {
	    $require: ['JQuery.UI.Loader'],
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			this.loadCss('HighchartsStackedColumn.css');
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
            	if(!$this.getElement().is(':visible')){
            		return;
            	}
                JSB.defer(function(){
                    if($this.highcharts){
                        $this.highcharts.setSize($this.getElement().width(), $this.getElement().height(), false);
                    }
                }, 300, 'hcResize' + $this.getId());

            });

            this.isInit = true;
		},

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var seriesContext = this.getContext().find('series').values();
            var yAxisContext = this.getContext().find('yAxis').values();
            var xAxisContext = this.getContext().find('xAxis').values();
			var yAxisStackLabels = this.getContext().find('yAxisStackLabels').values();
			var plotOptionsColumnDataLabels = this.getContext().find('plotOptionsColumnDataLabels').values();

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
								stackLabels: {
            						enabled: yAxisStackLabels[0].get(0).used(),
									align:  $this.isNull(yAxisStackLabels[0].get(1).value()),
									format: $this.isNull(yAxisStackLabels[0].get(2).value()),
									rotation: parseInt($this.isNull(yAxisStackLabels[0].get(3).value()), 10),
									textAlign: $this.isNull(yAxisStackLabels[0].get(4).value()),
									useHTML: yAxisStackLabels[0].get(5).used(),
									verticalAlign: $this.isNull(yAxisStackLabels[0].get(6).value()),
									x: parseInt($this.isNull(yAxisStackLabels[0].get(7).value()), 10),
									y: parseInt($this.isNull(yAxisStackLabels[0].get(8).value()), 10),
						            style: {
						                color: $this.isNull(yAxisStackLabels[0].get(9).value()) || (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
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
                        	column: {
								stacking: this.getContext().find('stacking').value().name().toString(),
								dataLabels: {
                					enabled: plotOptionsColumnDataLabels[0].get(0).used(),
									align: $this.isNull(plotOptionsColumnDataLabels[0].get(1).value()),
									allowOverlap: plotOptionsColumnDataLabels[0].get(2).used(),
									backgroundColor: $this.isNull(plotOptionsColumnDataLabels[0].get(3).value()),
									borderColor: $this.isNull(plotOptionsColumnDataLabels[0].get(4).value()),
									borderRadius: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(5).value()), 10),
									borderWidth: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(6).value()), 10),
									color: $this.isNull(plotOptionsColumnDataLabels[0].get(7).value()) || (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
									crop: plotOptionsColumnDataLabels[0].get(8).used(),
									format: $this.isNull(plotOptionsColumnDataLabels[0].get(9).value()),
									inside: $this.isNull(plotOptionsColumnDataLabels[0].get(10).value()),
									overflow: $this.isNull(plotOptionsColumnDataLabels[0].get(11).value()),
									padding: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(12).value()), 10),
									rotation: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(13).value()), 10),
									shadow: plotOptionsColumnDataLabels[0].get(14).used(),
									shape: $this.isNull(plotOptionsColumnDataLabels[0].get(15).value()),
									useHTML: plotOptionsColumnDataLabels[0].get(16).used(),
									verticalAlign: $this.isNull(plotOptionsColumnDataLabels[0].get(17).value()),
									x: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(18).value()), 10),
									y: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(19).value()), 10),
									zIndex: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(20).value()), 10)
            					}								
                        	}
                        	/*
							bar: {
					            dataLabels: {
					                enabled: true
					            }
					        }
					        */
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