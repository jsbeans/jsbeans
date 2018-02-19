{
    $name: 'DataCube.Widgets.BaseHighchart',
    //$parent: 'DataCube.Widgets.Widget',
    $scheme: {
	    source: {
	        render: 'sourceBinding',
	        name: 'Источник'
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
                        allowPointSelect: {
                            render: 'item',
                            name: 'Разрешить события',
                            optional: true,
                            editor: 'none'
                        },
                        color: {
                            render: 'item',
                            name: 'Цвет',
                            editor: 'JSB.Widgets.ColorEditor'
                        },
                        stack: {
                            render: 'item',
                            name: 'Имя стэка',
                            valueType: 'string'
                        },
                        step: { // todo: check none
                            render: 'select',
                            name: 'Шаговая диаграмма',
                            items: {
                                none: {
                                    name: 'Нет'
                                },
                                left: {
                                    name: 'Левый'
                                },
                                center: {
                                    name: 'Центр'
                                },
                                right: {
                                    name: 'Правый'
                                }
                            }
                        },
                        tooltip: {
                            render: 'group',
                            name: 'Подпись',
                            collapsable: true,
                            items: {
                                valueDecimals: {
                                    render: 'item',
                                    name: 'Число знаков после запятой',
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
                        visible: {
                            render: 'item',
                            name: 'Показывать по-умолчанию',
                            optional: 'checked',
                            editor: 'none'
                        }
                    }
                }
            }
        },

        xAxis: {
	        render: 'group',
	        name: 'Ось Х',
            collapsable: true,
            items: {
                labels: {
                    render: 'group',
                    name: 'Подписи',
                    collapsable: true,
                    items: {

                    }
                }
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
                fontSize: { // todo: add px to value
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
                        fontSize: {     // todo: add px
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
                stacking: {
                    render: 'select',
                    name: 'Тип стека',
                    items: {
                        none: {
                            name: 'Нет' // todo: check none
                        },
                        normal: {
                            name: 'Нормальный'
                        },
                        percent: {
                            name: 'Процентный'
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
                fontSize: { // todo: add px
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

        _buildChart: function(){
            var chartOpts = {};

            try{

            } catch(e){

            } finally {
                return chartOpts;
            }
        }
    }
}