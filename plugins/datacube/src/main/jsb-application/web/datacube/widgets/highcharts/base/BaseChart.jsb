{
    $name: 'DataCube.Widgets.BaseHighchart',
    $parent: 'DataCube.Widgets.Widget',
    $scheme: {
	    source: {
	        render: 'sourceBinding',
	        name: 'Источник'
	    },
	    
	    common: {
	    	collapsible: true,
            collapsed: true
	    },

	    filterFields: {
            render: 'dataBinding',
            name: 'Фильтрующие поля',
            linkTo: 'source',
            multiple: true,
            optional: true,
            advancedRender: true
	    },

	    series: {
	        render: 'autocompleteGroup',
	        name: 'Серии',
            collapsible: true,
            multiple: true,
            linkTo: 'source',
            items: {
                seriesItem: {
                    render: 'group',
                    name: 'Серия',
                    collapsible: true,
                    items: {
                        seriesName: {
                            render: 'namesBinding',
                            name: 'Имя серии',
                            linkTo: 'source',
                            localLink: {
                                linkGroup: 'seriesItem',
                                linkedFields: 'seriesItem'
                            }
                        },
                        name: {},
                        data: {},
                        date: {},
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
                        tooltip: {
                            render: 'group',
                            name: 'Всплывающая подсказка',
                            collapsible: true,
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
                        }
                    }
                }
            }
	    },

        xAxis: {},

        yAxis: {},

        // Авторская подпись
	    credits: {
	        render: 'group',
	        name: 'Авторская подпись',
            collapsible: true,
            collapsed: true,
            advancedRender: true,
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
	    },

	    // Всплывающая подсказка
	    mainTooltip: {
	        render: 'group',
	        name: 'Всплывающая подсказка',
            collapsible: true,
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
                color: {
                    render: 'item',
                    name: 'Цвет текста',
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
                pointFormat: {
                    render: 'formatter',
                    name: 'Формат значений',
                    formatterOpts: {
                        basicSettings: {
                            type: 'number',
                            value: 'y'
                        },
                        variables: [
                            {
                                alias: 'Процентное соотношение',
                                title: 'Только для круговой диаграммы и стеков',
                                type: 'number',
                                value: 'point.percentage'
                            },
                            {
                                alias: 'Общее значение стека',
                                title: 'Только для стеков',
                                type: 'number',
                                value: 'point.total'
                            },
                            {
                                alias: 'Координаты точки(X)',
                                type: 'number',
                                value: 'point.x'
                            },
                            {
                                alias: 'Значение точки(Y)',
                                type: 'number',
                                value: 'point.y'
                            },
                            {
                                alias: 'Имя серии',
                                type: 'string',
                                value: 'series.name'
                            }
                        ]
                    },
                    valueType: 'string',
                    defaultValue: '<span style="font-size: 10px">{category}</span><br/><span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b>'
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

	    // Заголовок
	    header: {
	        render: 'group',
	        name: 'Заголовок',
            collapsible: true,
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

	    // Легенда
	    legend: {
	        render: 'group',
	        name: 'Легенда',
            collapsible: true,
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
                    collapsible: true,
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
                    render: 'formatter',
                    name: 'Формат подписей',
                    formatterOpts: {
                        variables: [
                            {
                                alias: 'Имя серии',
                                type: 'string',
                                value: 'name'
                            }
                        ]
                    },
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

	    // Настройки диаграммы
	    chart: {
	        render: 'group',
	        name: 'Настройки диаграммы',
            collapsible: true,
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

	    // Настройки серий
        plotOptions: {
	        render: 'group',
	        name: 'Настройки серий',
            collapsible: true,
            collapsed: true,
            items: {
                series: {
                    render: 'group',
                    name: 'Общие',
                    collapsible: true,
                    collapsed: true,
                    items: {
                        connectNulls: {
                            render: 'item',
                            name: 'Соединять пустые значения',
                            optional: true,
                            editor: 'none'
                        },
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
                            collapsible: true,
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
                                    render: 'formatter',
                                    name: 'Форматирование',
                                    formatterOpts: {
                                        basicSettings: {
                                            type: 'number',
                                            value: 'y'
                                        },
                                        variables: [
                                            {
                                                alias: 'Процентное соотношение',
                                                title: 'Только для круговой диаграммы и стеков',
                                                type: 'number',
                                                value: 'percentage'
                                            },
                                            {
                                                alias: 'Общее значение стека',
                                                title: 'Только для стеков',
                                                type: 'number',
                                                value: 'total'
                                            },
                                            {
                                                alias: 'Координаты точки(X)',
                                                type: 'number',
                                                value: 'x'
                                            },
                                            {
                                                alias: 'Значение точки(Y)',
                                                type: 'number',
                                                value: 'y'
                                            },
                                            {
                                                alias: 'Имя серии',
                                                type: 'string',
                                                value: 'series.name'
                                            }
                                        ]
                                    },
                                    valueType: 'string',
                                    defaultValue: '{y}'
                                },
                                style: {
                                    render: 'group',
                                    name: 'Стиль подписей',
                                    collapsible: true,
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
        }
    },
    $client: {
        $require: ['JSB.Tpl.Highcharts'],

        // point filters
	    _curFilters: {},
	    _curFilterHash: null,

	    // range filters
	    _curRangeFilters: {},

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

        onRefresh: function(opts){
            // if filter source is current widget
            if(opts && this == opts.initiator && !opts.filterData){
                return false;
            }

            if(opts && opts.updateStyles){
                this._styles = null;
                this._dataSource = null;
                this._schemeOpts = null;
                this._filterFields = null;
                this._widgetOpts = null;
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
            var chartOpts = this._buildChart(data);

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

                if($this._chartType === 'stockChart'){
                    $this._selectRange();
                }

                $this._resolvePointContextFilters();

                $this.ready();
            }

            buildWidget(chartOpts);
        },

        setInitialized: function(){
            Highcharts.setOptions();
            $base();
        },

        setStyles: function(styles){
            if(!this._styles){ return; }

            var styleSelector = $base(styles);

            this._styles.colors = styleSelector.find('widgetSettings colorScheme').values();

            this.refresh();
        },

        _buildChart: function(data){
            var chartOpts = {};

            try{
                var chartContext = this.getContext().find('chart'),
                    creditsContext = this.getContext().find('credits'),
                    legendContext = this.getContext().find('legend'),
                    plotOptionsContext = this.getContext().find('plotOptions series'),
                    seriesContext = this.getContext().find('series').values(),
                    titleContext = this.getContext().find('header'),
                    tooltipContext = this.getContext().find('mainTooltip'),

                    plotOptionsDataLabels = plotOptionsContext.find('dataLabels'),

                    series = [],
                    legend;

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
                        name: seriesContext[i].find('seriesName').value(),
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

                    colors: this._widgetOpts && this._widgetOpts.styleScheme || undefined,

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

                    plotOptions: {
                        series: {
                            connectNulls: plotOptionsContext.find('connectNulls').checked(),
                            dataLabels: {
                                enabled: plotOptionsDataLabels.find('enabled').checked(),
                                align: plotOptionsDataLabels.find('align').value(),
                                verticalAlign: plotOptionsDataLabels.find('verticalAlign').value(),
                                backgroundColor: plotOptionsDataLabels.find('backgroundColor').value(),
                                borderColor: plotOptionsDataLabels.find('borderColor').value(),
                                borderRadius: plotOptionsDataLabels.find('borderRadius').value(),
                                borderWidth: plotOptionsDataLabels.find('borderWidth').value(),
                                format: plotOptionsDataLabels.find('format').value(),
                                useHTML: true,
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
                                        evt.stopPropagation();

                                        if(evt.point.series.options.datacube.filtration){
                                            if(evt.point.selected){
                                                $this._removePointFilter(evt.point, evt.ctrlKey || evt.shiftKey);
                                            } else {
                                                $this._addPointFilter(evt.point, evt.ctrlKey || evt.shiftKey, $this._chartType === 'stockChart');
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
                            },
                            turboThreshold: 0
                        }
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
                        useHTML: true,
                        headerFormat: null,
                        pointFormat: tooltipContext.find('pointFormat').value(),
                        footerFormat: null,
                        padding: tooltipContext.find('padding').value(),
                        shadow: tooltipContext.find('shadow').checked(),
                        style: {
                            color: tooltipContext.find('color').value()
                        },
                        valueDecimals: tooltipContext.find('valueDecimals').value(),
                        valuePrefix: tooltipContext.find('valuePrefix').value(),
                        valueSuffix: tooltipContext.find('valueSuffix').value()
                    }
                }

                if(legendContext.find){
                    var legendItemStyle = legendContext.find('itemStyle');

                    chartOpts.legend = {
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

        _resolveFilters: function(binding){
            var f1 = true, f2;

            if($this._chartType === 'stockChart'){
                f1 = this._resolveRangeFilters(binding);
            }

            f2 = this._resolvePointFilters(binding);

            return f1 && f2;
        },

        _resolveRangeFilters: function(binding){
            var globalFilters = this.getSourceFilters(this._dataSource);

            if(globalFilters){
                var isChanged = false,
                    isgte = false,
                    islte = false;

                for(var i in globalFilters){
                    // min
                    if(globalFilters[i].op === '$gte'){
                        if(this._curRangeFilters.min !== globalFilters[i].value){
                            this._curRangeFilters.min = globalFilters[i].value;
                            isChanged = true;
                        }

                        isgte = true;

                        delete globalFilters[i];
                        continue;
                    }

                    // max
                    if(globalFilters[i].op === '$lte'){
                        if(this._curRangeFilters.max !== globalFilters[i].value){
                            this._curRangeFilters.max = globalFilters[i].value;
                            isChanged = true;
                        }

                        islte = true;

                        delete globalFilters[i];
                    }
                }

                if(this._curRangeFilters.min && !isgte){
                    delete this._curRangeFilters.min;
                    delete this._curRangeFilters.minFilter;
                    isChanged = true;
                }

                if(this._curRangeFilters.max && !islte){
                    delete this._curRangeFilters.max;
                    delete this._curRangeFilters.maxFilter;
                    isChanged = true;
                }

                if(isChanged){
                    this.setSourceFilters(this._dataSource, globalFilters);
                    this._selectRange();
                    return false;
                }
            } else {
                if(this._curRangeFilters.max || this._curRangeFilters.min){
                    this._curRangeFilters = {};
                    this._selectRange();

                    return false;
                } else {
                    this._curRangeFilters = {};
                }
            }

            return true;
        },

        _resolvePointFilters: function(bindings){
            if(!JSB.isArray(bindings)){
                bindings = [bindings];
            }

            var globalFilters = this.getSourceFilters(this._dataSource);

            if(globalFilters && Object.keys(globalFilters).length > 0){
                var newFilters = {},
                    curFilters = {};

                for(var i in globalFilters){
                    if(this._curFilters[i]){
                        curFilters[i] = globalFilters[i];
                        delete globalFilters[i];
                        continue;
                    }

                    var cur = globalFilters[i];

                    if(bindings.indexOf(cur.field) > -1 && (cur.op === '$eq' || cur.op === '$range')){
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
            if(!this._filterFields || !this._filterFields.checked() || this._filterFields.values().length === 0){
                return;
            }

            return {
                bindings: this._filterFields.bindings(),
                values: this._filterFields.values()
            };
        },

        _addPointFilter: function(point, accumulate, isRange){
            var context = this.getContext().find('source').binding(),
                datacubeOpts = point.series.options.datacube,
                isFilterData = point.options.datacube && point.options.datacube.filterData || point.dataGroup && point.series.userOptions.data[point.dataGroup.start].datacube.filterData,
                binding = point.series.options.datacube.binding || point.options.datacube.binding,
                curFiltersCount = Object.keys(this._curFilters).length,
                refreshOpts = {},
                gLength;

            if(!context.source) {
                return;
            }

            if(isRange){
                if(point.dataGroup){
                    gLength = point.dataGroup.length;
                } else {
                    gLength = 1;
                }
            }

            if(!accumulate && curFiltersCount > 0){
                this._select(this._curFilters, false, true);

                for(var i in this._curFilters){
                    this.removeFilter(i);
                }

                this._curFilters = {};
            }

            if(isFilterData){  // not widget filters
                if(isRange){
                    // todo: isRange
                } else {
                    var datacubePointOpts = point.options.datacube;

                    for(var i = 0; i < datacubePointOpts.filterData.bindings.length; i++){
                        var fDesc = {
                            sourceId: context.source,
                            type: '$and',
                            op: '$eq',
                            field: datacubePointOpts.filterData.bindings[i],
                            value: datacubePointOpts.filterData.values[i]
                        };

                        if(datacubePointOpts.filterData.bindings[i] === binding){
                            this._curFilters[this.addFilter(fDesc)] = fDesc;
                        } else {
                            this.addFilter(fDesc);
                            refreshOpts.filterData = true;
                        }
                    }
                }
            } else {    // widget filters
                if(isRange){
                    var startRangeValue,
                        endRangeValue;

                    if(this._schemeOpts.dataGrouping && this._schemeOpts.dataGrouping.isGrouped){   // user grouping
                        var groupConst = this._schemeOpts.dataGrouping.groupConst || 1,
                            units = this._schemeOpts.dataGrouping.units || 1;

                        switch(this._schemeOpts.dataGrouping.groupBy){
                            case 'millisecond':
                                startRangeValue = point.x;
                                break;
                            default:
                                startRangeValue = Math.floor(point.x / groupConst) * groupConst;
                                break;
                        }

                        endRangeValue = startRangeValue + gLength * groupConst * units;
                    } else {    // highcharts grouping
                        var startIndex = point.dataGroup && point.dataGroup.start || point.index,
                            endIndex = point.dataGroup && (point.dataGroup.start + point.dataGroup.length) || (point.index + 1);

                        startRangeValue = point.series.xData[startIndex];
                        endRangeValue = point.series.xData[endIndex];
                    }
                }

                var fDesc = {
                    sourceId: context.source,
                    type: isRange ? '$and' : (accumulate ? '$or' : '$and'),
                    op: isRange ? '$range' : '$eq',
                    field: binding,
                    value: isRange ? [startRangeValue, endRangeValue] : point[this._filterPropName]
                };

                this._curFilters[this.addFilter(fDesc)] = fDesc;
            }

            this._select(this._curFilters, true, true);
            this.refreshAll(refreshOpts);
        },

        _changeRangeFilter: function(evt){
            var binding = evt.datacube.binding,
                valueType = evt.datacube.valueType,
                context = this.getContext().find('source').binding();

            function createFilter(type){
                var value = type === 'min' ? evt.min : evt.max;

                if($this._curRangeFilters[type] === value){
                    return;
                }

                $this._curRangeFilters[type] = value;

                var filterValue = value;

                if(valueType === 'date'){
                    filterValue = new Date(value);
                }

                var fDesc = {
                    sourceId: context.source,
                    type: '$and',
                    op: type === 'min' ? '$gte' : '$lte',
                    field: binding,
                    value: filterValue
                };

                $this._curRangeFilters[type + 'Filter'] = $this.addFilter(fDesc);
            }

            function resolveFilter(type){
                if(JSB.isDefined($this._curRangeFilters[type])){
                    if($this._curRangeFilters[type + 'Filter'] && $this._curRangeFilters[type] !== evt[type]){
                        $this.removeFilter($this._curRangeFilters[type + 'Filter']);
                    }
                }

                if(evt[type] !== evt['dataM' + type.substring(1)]){
                    // add filter
                    createFilter(type);
                }
            }

            resolveFilter('min');
            resolveFilter('max');

            this.refreshAll();
        },

        _removePointFilter: function(point, accumulate){
            var contextFilters = this.getContextFilter(),
                binding = point.series.options.datacube.binding || point.options.datacube.binding;

            if(accumulate){
                // remove context filter
                // todo: test isRange
                for(var i in contextFilters){
                    if(i === binding && contextFilters[i].$eq.$const === point[this._filterPropName]){
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
                    if(this._curFilters[i].field === binding && this._curFilters[i].value === point[this._filterPropName]){
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
                            if(filters[i].value === this.chart.series[j].points[k][this._filterPropName] ||
                               JSB.isArray(filters[i].value) && (filters[i].value[0] === this.chart.series[j].points[k][this._filterPropName] ||
                               (filters[i].value[0] <= this.chart.series[j].points[k][this._filterPropName]) && (filters[i].value[1] > this.chart.series[j].points[k][this._filterPropName]))){
                                this.chart.series[j].points[k].select(b1, b2);
                                break;
                            }
                        }
                    }
                }
            }
        },

        _selectRange: function(){
            var extremes = this.chart.xAxis[0].getExtremes();
            this.chart.xAxis[0].setExtremes(this._curRangeFilters.min || extremes.dataMin, this._curRangeFilters.max || extremes.dataMax);
        }
    }
}