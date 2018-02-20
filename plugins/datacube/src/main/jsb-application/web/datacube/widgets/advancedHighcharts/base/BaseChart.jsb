{
    $name: 'DataCube.Widgets.BaseHighchart',
    $parent: 'DataCube.Widgets.Widget',
    $scheme: {
	    source: {
	        render: 'sourceBinding',
	        name: 'Источник'
	    },

	    series: {},

        xAxis: {},

        yAxis: {},

	    header: {
	        render: 'group',
	        name: 'Заголовок',
            collapsable: true,
            collapsed: true,
            items: {
                text: {
                    render: 'item',
                    name: 'Текст'
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

        plotOptions: {},

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
                    itemType: 'number',
                    defaultValue: -10
                },
                y: {
                    render: 'item',
                    name: 'Y',
                    itemType: 'number',
                    defaultValue: -5
                }
            }
	    }
    },
    $client: {
        $require: ['JQuery.UI.Loader', 'JSB.Tpl.Highstock'],

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

            $this.setInitialized();
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
            if(opts && this == opts.initiator){
                return;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                var cache = this.getCache();
                if(cache){
                    this.buildChart(cache);
                    return;
                }
            }

            var dataSource = this.getContext().find('source');
            if(!dataSource.hasBinding()){
                return;
            }

            $base();

            return dataSource;
        },

        // refresh after data and/or style changes
        buildChart: function(data){
            JSB.defer(function(){
                $this._buildChart(data);
            }, 300, '_buildChart_' + this.getId());
        },

        _buildChart: function(){
            var chartOpts = {};

            try{
                var creditsContext = this.getContext().find('credits'),
                    legendContext = this.getContext().find('legend'),
                    titleContext = this.getContext().find('header'),
                    tooltipContext = this.getContext().find('mainTooltip'),

                    legendItemStyle = legendContext.find('itemStyle');

                chartOpts = {
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

                    title: {
                        text: titleContext.find('text').value(),
                        align: titleContext.find('align').value(),
                        verticalAlign: titleContext.find('verticalAlign').value(),
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
                    },
                }
            } catch(e){
                console.log(e);
            } finally {
                return chartOpts;
            }
        },

        isNone: function(val){
            return val === 'none' ? undefined : val;
        }
    }
}