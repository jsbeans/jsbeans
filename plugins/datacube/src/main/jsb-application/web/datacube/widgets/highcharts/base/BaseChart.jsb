{
    $name: 'DataCube.Widgets.BaseHighchart',
    $parent: 'DataCube.Widgets.Widget',
    $scheme: {
	    source: {
	        render: 'sourceBinding',
	        name: 'Источник'
	    },

	    filterFields: {
            render: 'dataBinding',
            name: 'Фильтрующие поля',
            linkTo: 'source',
            multiple: true
	    },

	    series: {
	        render: 'group',
	        name: 'Серии',
            collapsable: true,
            multiple: true,
            items: {
                seriesItem: {
                    render: 'group',
                    name: 'Серия',
                    collapsable: true,
                    items: {
                        seriesName: {},
                        name: {},
                        data: {},
                        tooltip: {
                            render: 'group',
                            name: 'Всплывающая подсказка',
                            collapsable: true,
                            items: {
                                valueDecimals: {
                                    render: 'item',
                                    name: 'Число знаков после запятой',
                                    valueType: 'number',
                                    defaultValue: 2
                                },
                                valuePrefix: {
                                    render: 'item',
                                    name: 'Префикс значения',
                                    valueType: 'string'
                                },
                                valueSuffix: {
                                    render: 'item',
                                    name: 'Суффикс значения',
                                    valueType: 'string'
                                }
                            }
                        },
                        visible: {
                            render: 'item',
                            name: 'Показывать по-умолчанию',
                            optional: 'checked',
                            editor: 'none'
                        },
                        allowPointSelect: {
                            render: 'switch',
                            name: 'Разрешить события',
                            optional: 'checked',
                            items: {
                                filtration: {
                                    render: 'item',
                                    name: 'Фильтрация',
                                    optional: 'checked',
                                    editor: 'none'
                                },
                                drilldown: {
                                    render: 'switch',
                                    name: 'Вложенный виджет',
                                    items: {
                                        widget: {
                                            render: 'completeWidget',
                                            name: 'Виджет'
                                        }
                                    }
                                }
                            }
                        },
                    }
                }
            }
	    },

        xAxis: {},

        yAxis: {},

	    chart: {
	        render: 'group',
	        name: 'Настройки диаграммы',
            collapsable: true,
            collapsed: true,
            items: {
                animation: {
                    render: 'item',
                    name: 'Анимация',
                    optional: 'checked',
                    editor: 'none'
                },
                inverted: {
                    render: 'item',
                    name: 'Инвертировать оси',
                    optional: true,
                    editor: 'none'
                },
                colorScheme: {
                    render: 'styleBinding',
                    name: 'Цветовая схема'
                },
                /*
                backgroundColor: {
                    render: 'item',
                    name: 'Анимация',
                }
                */
            }
	    },

	    header: {
	        render: 'group',
	        name: 'Заголовок',
            collapsable: true,
            collapsed: true,
            items: {
                text: {
                    render: 'item',
                    name: 'Текст',
                    valueType: 'string',
                    defaultValue: ''
                },
                align: {
                    render: 'select',
                    name: 'Горизонтальное выравнивание',
                    items: {
                        center: {
                            name: 'По центру'
                        },
                        left: {
                            name: 'По левому краю'
                        },
                        right: {
                            name: 'По правому краю'
                        }
                    }
                },
                verticalAlign: {
                    render: 'select',
                    name: 'Вертикальное выравнивание',
                    items: {
                        none: {
                            name: 'Нет'
                        },
                        top: {
                            name: 'По верхнему краю'
                        },
                        middle: {
                            name: 'По центру'
                        },
                        bottom: {
                            name: 'По нижнему краю'
                        }
                    }
                },
                floating: {
                    render: 'item',
                    name: 'Обтекание',
                    optional: true,
                    editor: 'none'
                },
                margin: {
                    render: 'item',
                    name: 'Отступ',
                    valueType: 'number',
                    defaultValue: 15
                },
                fontColor: {
                    render: 'item',
                    name: 'Цвет шрифта',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#333333'
                },
                fontSize: {
                    render: 'item',
                    name: 'Размер шрифта',
                    valueType: 'number',
                    defaultValue: 18
                },
                x: {
                    render: 'item',
                    name: 'X',
                    valueType: 'number',
                    defaultValue: 0
                },
                y: {
                    render: 'item',
                    name: 'Y',
                    valueType: 'number',
                    defaultValue: 10
                }
            }
	    },

	    legend: {
	        render: 'group',
	        name: 'Легенда',
            collapsable: true,
            collapsed: true,
            items: {
                enabled: {
                    render: 'item',
                    name: 'Активна',
                    optional: 'checked',
                    editor: 'none'
                },
                layout: {
                    render: 'select',
                    name: 'Расположение',
                    items: {
                        horizontal: {
                            name: 'Горизонтальное'
                        },
                        vertical: {
                            name: 'Вертикальное'
                        }
                    }
                },
                align: {
                    render: 'select',
                    name: 'Горизонтальное выравнивание',
                    items: {
                        center: {
                            name: 'По центру'
                        },
                        left: {
                            name: 'По левому краю'
                        },
                        right: {
                            name: 'По правому краю'
                        }
                    }
                },
                verticalAlign: {
                    render: 'select',
                    name: 'Вертикальное выравнивание',
                    items: {
                        bottom: {
                            name: 'По нижнему краю'
                        },
                        middle: {
                            name: 'По центру'
                        },
                        top: {
                            name: 'По верхнему краю'
                        }
                    }
                },
                backgroundColor: {
                    render: 'item',
                    name: 'Цвет фона',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                borderColor: {
                    render: 'item',
                    name: 'Цвет границы',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                borderRadius: {
                    render: 'item',
                    name: 'Радиус границы',
                    valueType: 'number',
                    defaultValue: 0
                },
                borderWidth: {
                    render: 'item',
                    name: 'Толщина границы',
                    valueType: 'number',
                    defaultValue: 0
                },
                floating: {
                    render: 'item',
                    name: 'Обтекание',
                    optional: true,
                    editor: 'none'
                },
                itemDistance: {
                    render: 'item',
                    name: 'Интервал между элементами легенды',
                    valueType: 'number',
                    defaultValue: 20
                },
                itemWidth: {
                    render: 'item',
                    name: 'Ширина подписей',
                    valueType: 'number'
                },
                itemMarginTop: {
                    render: 'item',
                    name: 'Отступ сверху',
                    valueType: 'number',
                    defaultValue: 0
                },
                itemMarginBottom: {
                    render: 'item',
                    name: 'Отступ снизу',
                    valueType: 'number',
                    defaultValue: 0
                },
                itemStyle: {
                    render: 'group',
                    name: 'Стиль подписей',
                    collapsable: true,
                    items: {
                        color: {
                            render: 'item',
                            name: 'Цвет',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#333333'
                        },
                        fontSize: {
                            render: 'item',
                            name: 'Размер шрифта',
                            valueType: 'number',
                            defaultValue: 12
                        },
                        fontWeight: {
                            render: 'item',
                            name: 'Полнота шрифта',
                            valueType: 'string',
                            defaultValue: 'bold'
                        }
                    }
                },
                labelFormat: {
                    render: 'item',
                    name: 'Формат подписей',
                    valueType: 'string',
                    defaultValue: '{name}'
                },
                reversed: {
                    render: 'item',
                    name: 'Обратный порядок',
                    optional: true,
                    editor: 'none'
                },
                shadow: {
                    render: 'item',
                    name: 'Тень',
                    optional: true,
                    editor: 'none'
                },
                width: {
                    render: 'item',
                    name: 'Ширина',
                    valueType: 'number'
                },
                x: {
                    render: 'item',
                    name: 'Расположение по оси Х',
                    valueType: 'number',
                    defaultValue: 0
                },
                y: {
                    render: 'item',
                    name: 'Расположение по оси Y',
                    valueType: 'number',
                    defaultValue: 0
                }
            }
	    },

	    mainTooltip: {
	        render: 'group',
	        name: 'Всплывающая подсказка',
            collapsable: true,
            collapsed: true,
            items: {
                enabled: {
                    render: 'item',
                    name: 'Активна',
                    optional: 'checked',
                    editor: 'none'
                },
                backgroundColor: {
                    render: 'item',
                    name: 'Цвет фона',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#f8f8f8'
                },
                borderColor: {
                    render: 'item',
                    name: 'Цвет границы',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                borderRadius: {
                    render: 'item',
                    name: 'Радиус границы',
                    valueType: 'number',
                    defaultValue: 3
                },
                borderWidth: {
                    render: 'item',
                    name: 'Толщина границы',
                    valueType: 'number',
                    defaultValue: 1
                },
                useHTML: {
                    render: 'item',
                    name: 'Использовать HTML',
                    optional: true,
                    editor: 'none'
                },
                headerFormat: {
                    render: 'item',
                    name: 'Формат верхнего колонтитула',
                    valueType: 'string',
                    editor: 'JSB.Widgets.MultiEditor',
                    options: {
                        valueType: 'org.jsbeans.types.Html'
                    },
                    defaultValue: '<span style="font-size: 10px">{point.key}</span><br/>'
                },
                pointFormat: {
                    render: 'item',
                    name: 'Формат точек',
                    valueType: 'string',
                    editor: 'JSB.Widgets.MultiEditor',
                    options: {
                        valueType: 'org.jsbeans.types.Html'
                    },
                    defaultValue: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
                },
                footerFormat: {
                    render: 'item',
                    name: 'Формат нижнего колонтитула',
                    valueType: 'string',
                    editor: 'JSB.Widgets.MultiEditor',
                    options: {
                        valueType: 'org.jsbeans.types.Html'
                    }
                },
                padding: {
                    render: 'item',
                    name: 'Внутренний отступ',
                    valueType: 'number',
                    defaultValue: 8
                },
                shadow: {
                    render: 'item',
                    name: 'Тень',
                    optional: 'checked',
                    editor: 'none'
                },
                valueDecimals: {
                    render: 'item',
                    name: 'Количество символов после запятой',
                    valueType: 'number'
                },
                valuePrefix: {
                    render: 'item',
                    name: 'Префикс значения',
                    valueType: 'string'
                },
                valueSuffix: {
                    render: 'item',
                    name: 'Суффикс значения',
                    valueType: 'string'
                }
            }
	    },

        plotOptions: {
	        render: 'group',
	        name: 'Опции точек',
            collapsable: true,
            collapsed: true,
            items: {
                series: {
                    render: 'group',
                    name: 'Общие',
                    collapsable: true,
                    collapsed: true,
                    items: {
                        stacking: {
                            render: 'select',
                            name: 'Тип стека',
                            items: {
                                none: {
                                    name: 'Нет'
                                },
                                normal: {
                                    name: 'Нормальный'
                                },
                                percent: {
                                    name: 'Процентный'
                                }
                            }
                        },
                        dataLabels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsable: true,
                            items: {
                                enabled: {
                                    render: 'item',
                                    name: 'Активны',
                                    optional: true,
                                    editor: 'none'
                                },
                                align: {
                                    render: 'select',
                                    name: 'Горизонтальное выравнивание',
                                    items: {
                                        center: {
                                            name: 'По центру'
                                        },
                                        left: {
                                            name: 'По левому краю'
                                        },
                                        right: {
                                            name: 'По правому краю'
                                        }
                                    }
                                },
                                verticalAlign: {
                                    render: 'select',
                                    name: 'Вертикальное выравнивание',
                                    items: {
                                        bottom: {
                                            name: 'По нижнему краю'
                                        },
                                        middle: {
                                            name: 'По центру'
                                        },
                                        top: {
                                            name: 'По верхнему краю'
                                        }
                                    }
                                },
                                backgroundColor: {
                                    render: 'item',
                                    name: 'Цвет фона',
                                    editor: 'JSB.Widgets.ColorEditor'
                                },
                                borderColor: {
                                    render: 'item',
                                    name: 'Цвет границы',
                                    editor: 'JSB.Widgets.ColorEditor'
                                },
                                borderRadius: {
                                    render: 'item',
                                    name: 'Радиус границы',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                borderWidth: {
                                    render: 'item',
                                    name: 'Толщина границы',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                format: {
                                    render: 'item',
                                    name: 'Формат',
                                    valueType: 'string',
                                    defaultValue: '{y}'
                                },
                                useHTML: {
                                    render: 'item',
                                    name: 'Использовать HTML',
                                    optional: true,
                                    editor: 'none'
                                },
                                style: {
                                    render: 'group',
                                    name: 'Стиль подписей',
                                    collapsable: true,
                                    items: {
                                        color: {
                                            render: 'item',
                                            name: 'Цвет',
                                            editor: 'JSB.Widgets.ColorEditor',
                                            defaultValue: '#333333'
                                        },
                                        fontSize: {
                                            render: 'item',
                                            name: 'Размер шрифта',
                                            valueType: 'number',
                                            defaultValue: 11
                                        },
                                        fontWeight: {
                                            render: 'item',
                                            name: 'Полнота шрифта',
                                            valueType: 'string',
                                            defaultValue: 'bold'
                                        }
                                    }
                                },
                                padding: {
                                    render: 'item',
                                    name: 'Внутренний отступ',
                                    valueType: 'number',
                                    defaultValue: 5
                                },
                                rotation: {
                                    render: 'item',
                                    name: 'Поворот',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                shadow: {
                                    render: 'item',
                                    name: 'Тень',
                                    optional: true,
                                    editor: 'none'
                                },
                                x: {
                                    render: 'item',
                                    name: 'Расположение по оси Х',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                y: {
                                    render: 'item',
                                    name: 'Расположение по оси Y',
                                    valueType: 'number',
                                    defaultValue: -6
                                }
                            }
                        }
                    }
                }
            }
        },

	    credits: {
	        render: 'group',
	        name: 'Авторская подпись',
            collapsable: true,
            collapsed: true,
            items: {
                enabled: {
                    render: 'item',
                    name: 'Активна',
                    optional: true,
                    editor: 'none'
                },
                text: {
                    render: 'item',
                    name: 'Текст',
                    valueType: 'string',
                    defaultValue: 'Highcharts.com'
                },
                href: {
                    render: 'item',
                    name: 'Ссылка',
                    valueType: 'string',
                    defaultValue: 'http://www.highcharts.com'
                },
                fontColor: {
                    render: 'item',
                    name: 'Цвет шрифта',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#999999'
                },
                fontSize: {
                    render: 'item',
                    name: 'Размер шрифта',
                    valueType: 'number',
                    defaultValue: 9
                },
                align: {
                    render: 'select',
                    name: 'Горизонтальное выравнивание',
                    items: {
                        left: {
                            name: 'По левому краю'
                        },
                        center: {
                            name: 'По центру'
                        },
                        right: {
                            name: 'По правому краю'
                        }
                    }
                },
                verticalAlign: {
                    render: 'select',
                    name: 'Вертикальное выравнивание',
                    items: {
                        top: {
                            name: 'По верхнему краю'
                        },
                        middle: {
                            name: 'По центру'
                        },
                        bottom: {
                            name: 'По нижнему краю'
                        }
                    }
                },
                x: {
                    render: 'item',
                    name: 'X',
                    valueType: 'number',
                    defaultValue: -10
                },
                y: {
                    render: 'item',
                    name: 'Y',
                    valueType: 'number',
                    defaultValue: -5
                }
            }
	    }
    },
    $client: {
        $require: ['JSB.Tpl.Highcharts'],

	    _curFilters: {},
	    _curFilterHash: null,

	    _chartType: 'chart',
	    _filterPropName: null,

        $constructor: function(opts){
            $base(opts);

            $this.addClass('highchartsWidget');
            $this.container = $this.$('<div class="container"></div>');
            $this.append($this.container);

            $this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.chart){
                        return;
                    }
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height());
                }, 500, 'hcResize_' + $this.getId());
            });
        },

        // events
        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

        refresh: function(opts){
            // if filter source is current widget
            if(opts && this == opts.initiator && !opts.filterData){
                return false;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                var cache = this.getCache();
                if(cache){
                    this.buildChart(cache);
                    return false;
                }
            }

            if(opts && opts.updateStyles){
                this._styles = null;
                this._dataSource = null;
                this._schemeOpts = null;
                this._filterFields = null;
            }

            if(!this._dataSource){
                var dataSource = this.getContext().find('source');

                if(!dataSource.hasBinding()){
                    return false;
                }

                this._dataSource = dataSource;
            }

            if(!this._filterFields){
                this._filterFields = this.getContext().find('filterFields');
            }

            $base();

            return true;
        },

        buildChart: function(data){
            var chartOpts = this._buildChart(data),
                styleSelector = this.getContext().find('chart colorScheme');

            function buildWidget(chartOpts){
                /*
                if($this.chart){
                    $this.chart.update(chartOpts, true, true);
                } else {
                    $this.chart = (function(){return this}).call().Highcharts[$this._chartType]($this.container.get(0), chartOpts);
                }
                */
                if($this.chart){
                    $this.chart.destroy();
                }
                $this.chart = (function(){return this}).call().Highcharts[$this._chartType]($this.container.get(0), chartOpts);

                $this._select($this._curFilters, true, true);
                $this._resolvePointContextFilters();
            }

            if(styleSelector){
                styleSelector.value(function(widgetStyleSelector){
                    if(widgetStyleSelector){
                        chartOpts.colors = widgetStyleSelector.find('colorScheme').values();
                    }

                    buildWidget(chartOpts);
                });
            } else {
                buildWidget(chartOpts);
            }
        },

        setStyles: function(styles){
            if(!this._styles){ return; }

            var styleSelector = $base(styles);

            this._styles.colors = styleSelector.find('widgetSettings colorScheme').values();

            this.refresh();
        },

        _buildChart: function(){
            var chartOpts = {};

            try{
                var chartContext = this.getContext().find('chart'),
                    creditsContext = this.getContext().find('credits'),
                    legendContext = this.getContext().find('legend'),
                    plotOptionsContext = this.getContext().find('plotOptions series'),
                    seriesContext = this.getContext().find('series').values(),
                    titleContext = this.getContext().find('header'),
                    tooltipContext = this.getContext().find('mainTooltip'),

                    legendItemStyle = legendContext.find('itemStyle'),
                    plotOptionsDataLabels = plotOptionsContext.find('dataLabels'),

                    series = [];

                for(var i = 0; i < seriesContext.length; i++){
                    var allowPointSelect = seriesContext[i].find('allowPointSelect').checked(),
                        tooltip = seriesContext[i].find('tooltip'),
                        datacube = undefined;

                    if(allowPointSelect){
                        var isDrilldown = seriesContext[i].find('allowPointSelect drilldown').checked();

                        datacube = {
                            filtration: seriesContext[i].find('allowPointSelect filtration').checked()
                        }

                        if(isDrilldown){
                            datacube.drilldown = {
                                widget: seriesContext[i].find('allowPointSelect drilldown widget').value()
                            }
                        }
                    }

                    series.push({
                        allowPointSelect: allowPointSelect,
                        cursor: allowPointSelect ? 'pointer' : undefined,
                        datacube: datacube,
                        tooltip: {
                            valueDecimals: tooltip.find('valueDecimals').value(),
                            valuePrefix: tooltip.find('valuePrefix').value(),
                            valueSuffix: tooltip.find('valueSuffix').value()
                        },
                        visible: seriesContext[i].find('visible').checked()
                    });
                }

                chartOpts = {
                    chart: {
                        animation: chartContext.find('animation').checked(),
                        inverted: chartContext.find('inverted').checked()
                    },

                    credits: {
                        enabled: creditsContext.find('enabled').checked(),
                        text: creditsContext.find('text').value(),
                        href: creditsContext.find('href').value(),
                        style: {
                           color: creditsContext.find('fontColor').value(),
                           fontSize: creditsContext.find('fontSize').value() + 'px'
                        },
                        position: {
                            align: creditsContext.find('align').value(),
                            verticalAlign: creditsContext.find('verticalAlign').value(),
                            x: creditsContext.find('x').value(),
                            y: creditsContext.find('y').value()
                        }
                    },

                    legend: {
                        enabled: legendContext.find('enabled').checked(),
                        layout: legendContext.find('layout').value(),
                        align: legendContext.find('align').value(),
                        verticalAlign: legendContext.find('verticalAlign').value(),
                        backgroundColor: legendContext.find('backgroundColor').value(),
                        borderColor: legendContext.find('borderColor').value(),
                        borderRadius: legendContext.find('borderRadius').value(),
                        borderWidth: legendContext.find('borderWidth').value(),
                        floating: legendContext.find('floating').checked(),
                        itemDistance: legendContext.find('itemDistance').value(),
                        itemWidth: legendContext.find('itemWidth').value(),
                        itemMarginTop: legendContext.find('itemMarginTop').value(),
                        itemMarginBottom: legendContext.find('itemMarginBottom').value(),
                        itemStyle: {
                            color: legendItemStyle.find('color').value(),
                            fontSize: legendItemStyle.find('fontSize').value() + 'px',
                            fontWeight: legendItemStyle.find('fontWeight').value()
                        },
                        labelFormat: legendContext.find('labelFormat').value(),
                        reversed: legendContext.find('reversed').checked(),
                        shadow: legendContext.find('shadow').checked(),
                        width: legendContext.find('width').value(),
                        x: legendContext.find('x').value(),
                        y: legendContext.find('y').value()
                    },

                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: plotOptionsDataLabels.find('enabled').checked(),
                                align: plotOptionsDataLabels.find('align').value(),
                                verticalAlign: plotOptionsDataLabels.find('verticalAlign').value(),
                                backgroundColor: plotOptionsDataLabels.find('backgroundColor').value(),
                                borderColor: plotOptionsDataLabels.find('borderColor').value(),
                                borderRadius: plotOptionsDataLabels.find('borderRadius').value(),
                                borderWidth: plotOptionsDataLabels.find('borderWidth').value(),
                                format: plotOptionsDataLabels.find('format').value(),
                                useHTML: plotOptionsDataLabels.find('useHTML').checked(),
                                style: {
                                    color: plotOptionsDataLabels.find('style color').value(),
                                    fontSize: plotOptionsDataLabels.find('style fontSize').value(),
                                    fontWeight: plotOptionsDataLabels.find('style fontWeight').value()
                                },
                                padding: plotOptionsDataLabels.find('padding').value(),
                                rotation: plotOptionsDataLabels.find('rotation').value(),
                                shadow: plotOptionsDataLabels.find('shadow').checked(),
                                x: plotOptionsDataLabels.find('x').value(),
                                y: plotOptionsDataLabels.find('y').value()
                            },
                            stacking: this.isNone(plotOptionsContext.find('stacking').value()),
                            point: {
                                events: {
                                    click: function(evt) {
                                        evt.preventDefault();

                                        if(evt.point.series.options.datacube.filtration){
                                            if(evt.point.selected){
                                                $this._removePointFilter(evt.point, evt.ctrlKey || evt.shiftKey);
                                            } else {
                                                $this._addPointFilter(evt.point, evt.ctrlKey || evt.shiftKey);
                                            }
                                        }

                                        if(evt.point.series.options.datacube.drilldown){
                                            var filterOpts;

                                            if(!evt.point.series.options.datacube.filtration){
                                                filterOpts = {};
                                                filterOpts[evt.point.options.datacube.binding] = {
                                                    $eq: {
                                                        $const: evt.point[$this._filterPropName]
                                                    }
                                                }
                                            }

                                            $this.addDrilldownElement({
                                                filterOpts: filterOpts,
                                                widget: evt.point.series.options.datacube.drilldown.widget
                                            });
                                        }

                                        if(JSB().isFunction($this.options.onClick)){
                                            $this.options.onClick.call(this, evt);
                                        }
                                    },
                                    select: function(){
                                        if(JSB().isFunction($this.options.onSelect)){
                                            $this.options.onSelect.call(this, evt);
                                        }
                                    },
                                    unselect: function(evt){
                                        if(JSB().isFunction($this.options.onUnselect)){
                                            $this.options.onUnselect.call(this, evt);
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
                        },
                        turboThreshold: 0
                    },

                    series: series,

                    title: {
                        text: titleContext.find('text').value(),
                        align: titleContext.find('align').value(),
                        verticalAlign: this.isNone(titleContext.find('verticalAlign').value()),
                        floating: titleContext.find('floating').checked(),
                        margin: titleContext.find('margin').value(),
                        color: titleContext.find('fontColor').value(),
                        fontSize: titleContext.find('fontSize').value() + 'px',
                        x: titleContext.find('x').value(),
                        y: titleContext.find('y').value()
                    },

                    tooltip: {
                        enabled: tooltipContext.find('enabled').checked(),
                        backgroundColor: tooltipContext.find('backgroundColor').value(),
                        borderColor: tooltipContext.find('borderColor').value(),
                        borderRadius: tooltipContext.find('borderRadius').value(),
                        borderWidth: tooltipContext.find('borderWidth').value(),
                        useHTML: tooltipContext.find('useHTML').checked(),
                        headerFormat: tooltipContext.find('headerFormat').value(),
                        pointFormat: tooltipContext.find('pointFormat').value(),
                        footerFormat: tooltipContext.find('footerFormat').value(),
                        padding: tooltipContext.find('padding').value(),
                        shadow: tooltipContext.find('shadow').checked(),
                        valueDecimals: tooltipContext.find('valueDecimals').value(),
                        valuePrefix: tooltipContext.find('valuePrefix').value(),
                        valueSuffix: tooltipContext.find('valueSuffix').value()
                    }
                }
            } catch(e){
                console.log('BaseChart build chart exception');
                console.log(e);
            } finally {
                return chartOpts;
            }
        },

        isNone: function(val){
            return val === 'none' ? undefined : val;
        },

        _resolvePointContextFilters: function(){
            var contextFilters = this.getContextFilter(),
                filters = {};

            for(var i in contextFilters){
                filters[i] = {
                    field: i,
                    value: contextFilters[i].$eq.$const
                }
            }

            this._select(filters, true, true);
        },

        _resolvePointFilters: function(bindings){
            if(!JSB.isArray(bindings)){
                bindings = [bindings];
            }

            var globalFilters = this.getSourceFilters(this._dataSource);
            if(globalFilters){
                var newFilters = {},
                    curFilters = {};

                for(var i in globalFilters){
                    if(this._curFilters[i]){
                        curFilters[i] = globalFilters[i];
                        delete globalFilters[i];
                        continue;
                    }

                    var cur = globalFilters[i];

                    if(bindings.indexOf(cur.field) > -1 && cur.op === '$eq'){
                        curFilters[i] = cur;
                        newFilters[i] = cur;

                        delete globalFilters[i];
                    }
                }

                var oldFilters = {};

                for(var i in this._curFilters){
                    if(!globalFilters[i]){
                        oldFilters[i] = this._curFilters[i];
                    }
                }

                this._curFilters = curFilters;

                if(Object.keys(globalFilters).length > 0 && this.createFilterHash(globalFilters) === this._curFilterHash || Object.keys(globalFilters).length === 0 && !this._curFilterHash && this.chart){ // update data not require
                    if(this.chart){ // drilldown widgets may have filters, but not construct yet
                        this._select(newFilters, true, true);
                        this._select(oldFilters, false, true);
                    }

                    return false;
                } else {
                    this._curFilterHash = Object.keys(globalFilters).length > 0 ? this.createFilterHash(globalFilters) : undefined;
                    this.setSourceFilters(this._dataSource, globalFilters);
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    this._select(this._curFilters, false, true);
                    this._curFilters = {};
                    return false;
                }
                this._curFilterHash = null;
            }

            return true;
        },

        _addFilterData: function(){
            if(!this._filterFields || this._filterFields.values().length === 0){
                return;
            }

            return {
                bindings: this._filterFields.bindings(),
                values: this._filterFields.values()
            };
        },

        _addPointFilter: function(point, accumulate){
            var context = this.getContext().find('source').binding(),
                refreshOpts = {};

            if(!context.source) {
                return;
            }

            if(!accumulate && Object.keys(this._curFilters).length > 0){
                this._select(this._curFilters, false, true);

                for(var i in this._curFilters){
                    this.removeFilter(i);
                }

                this._curFilters = {};
            }

            if(point.datacube.filterData){  // not widget filters
                for(var i = 0; i < point.datacube.filterData.bindings.length; i++){
                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$eq',
                        field: point.datacube.filterData.bindings[i],
                        value: point.datacube.filterData.values[i]
                    };

                    if(point.datacube.filterData.bindings[i] === point.datacube.binding){
                        this._curFilters[this.addFilter(fDesc)] = fDesc;
                    } else {
                        this.addFilter(fDesc);
                        refreshOpts.filterData = true;
                    }
                }
            } else {    // widget filters
                var fDesc = {
                    sourceId: context.source,
                    type: '$or',
                    op: '$eq',
                    field: point.datacube.binding,
                    value: point[this._filterPropName]
                };

                this._curFilters[this.addFilter(fDesc)] = fDesc;
            }

            this._select(this._curFilters, true, true);
            this.refreshAll(refreshOpts);
        },

        _removePointFilter: function(point, accumulate){
            var contextFilters = this.getContextFilter();

            if(accumulate){
                // remove context filter
                for(var i in contextFilters){
                    if(i === point.options.datacube.binding && contextFilters[i].$eq.$const === point[this._filterPropName]){
                        var filter = {};
                        filter[i] = {
                            field: i,
                            value: contextFilters[i].$eq.$const
                        }
                        this._select(filter, false, true);
                        delete contextFilters[i];
                        this.setContextFilter(contextFilters);
                        break;
                    }
                }

                // remove global filter
                for(var i in this._curFilters){
                    if(this._curFilters[i].field === point.options.datacube.binding && this._curFilters[i].value === point[this._filterPropName]){
                        var filter = {};
                        filter[i] = this._curFilters[i];
                        this._select(filter, false, true);
                        this.removeFilter(i);
                        delete this._curFilters[i];
                        this.refreshAll();
                        break;
                    }
                }
            } else {
                // remove context filters
                for(var i in contextFilters){
                    var filter = {};
                    filter[i] = {
                        field: i,
                        value: contextFilters[i].$eq.$const
                    }

                    this._select(filter, false, true);
                }
                this.setContextFilter({});

                // remove global filters
                if(Object.keys(this._curFilters).length > 0){
                    this._select(this._curFilters, false, true);

                    for(var i in this._curFilters){
                        this.removeFilter(i);
                    }
                    this._curFilters = {};

                    this.refreshAll();
                }
            }
        },

        _select: function(filters, b1, b2){
            for(var i in filters){
                for(var j = 0; j < this.chart.series.length; j++){
                    if(this.chart.series[j].options.datacube.binding === filters[i].field ||
                       this.chart.series[j].options.datacube.bindings && this.chart.series[j].options.datacube.bindings.indexOf(filters[i].field) > -1){
                        for(var k = 0; k < this.chart.series[j].points.length; k++){
                            if(filters[i].value === this.chart.series[j].points[k][this._filterPropName]){
                                this.chart.series[j].points[k].select(b1, b2);
                            }
                        }
                    }
                }
            }
        }
    }
}