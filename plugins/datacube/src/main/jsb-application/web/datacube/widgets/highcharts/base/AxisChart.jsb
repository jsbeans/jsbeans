{
    $name: 'DataCube.Widgets.AxisHighchart',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $scheme: {
        xAxis: {
	        render: 'group',
	        name: 'Ось Х',
            collapsable: true,
            multiple: {
                uniqueNames: true
            },
            items: {
                item: {
                    render: 'group',
                    name: 'Ось X',
                    collapsable: true,
                    editableName: {
                        commonField: 'xAxisNames'
                    },
                    items: {
                        categories: {
                            render: 'dataBinding',
                            name: 'Категории',
                            linkTo: 'source'
                        },
                        linkedTo: {
                            render: 'select',
                            name: 'Привязка к оси',
                            commonField: 'xAxisNames'
                        },
                        labels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsable: true,
                            items: {
                                enabled: {
                                    render: 'item',
                                    name: 'Активны',
                                    optional: 'checked',
                                    editor: 'none'
                                },
                                rotation: {
                                    render: 'item',
                                    name: 'Поворот',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                step: {
                                    render: 'item',
                                    name: 'Шаг',
                                    valueType: 'number'
                                },
                                format: {
                                    render: 'item',
                                    name: 'Формат',
                                    valueType: 'string',
                                    defaultValue: '{value}'
                                },
                                fontColor: {
                                    render: 'item',
                                    name: 'Цвет шрифта',
                                    editor: 'JSB.Widgets.ColorEditor',
                                    defaultValue: '#666666'
                                },
                                fontSize: {
                                    render: 'item',
                                    name: 'Размер шрифта',
                                    valueType: 'number',
                                    defaultValue: 11
                                }
                            }
                        },
                        title: {
                            render: 'group',
                            name: 'Заголовок оси',
                            collapsable: true,
                            items: {
                                text: {
                                    render: 'item',
                                    name: 'Текст',
                                    valueType: 'string'
                                },
                                align: {
                                    render: 'select',
                                    name: 'Горизонтальное выравнивание',
                                    items: {
                                        low: {
                                            name: 'По левому краю'
                                        },
                                        middle: {
                                            name: 'По центру'
                                        },
                                        high: {
                                            name: 'По правому краю'
                                        }
                                    }
                                },
                                rotation: {
                                    render: 'item',
                                    name: 'Поворот',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                offset: {
                                    render: 'item',
                                    name: 'Отступ',
                                    valueType: 'number'
                                },
                                color: {
                                    render: 'item',
                                    name: 'Цвет',
                                    editor: 'JSB.Widgets.ColorEditor',
                                    defaultValue: '#666666'
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
                                    valueType: 'number'
                                }
                            }
                        },
                        alternateGridColor: {
                            render: 'item',
                            name: 'Чередующийся цвет',
                            editor: 'JSB.Widgets.ColorEditor'
                        },
                        crosshair: {
                            render: 'item',
                            name: 'Указатель',
                            optional: true,
                            editor: 'none'
                        },
                        lineColor: {
                            render: 'item',
                            name: 'Цвет оси',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#ccd6eb'
                        },
                        lineWidth: {
                            render: 'item',
                            name: 'Толщина оси',
                            valueType: 'number',
                            defaultValue: 1
                        },
                        offset: {
                            render: 'item',
                            name: 'Отступ оси',
                            valueType: 'number',
                            defaultValue: 0
                        },
                        opposite: {
                            render: 'item',
                            name: 'Напротив',
                            optional: true,
                            editor: 'none'
                        },
                        reversed: {
                            render: 'item',
                            name: 'Обратное направление',
                            optional: true,
                            editor: 'none'
                        },
                        /*
                        type: {
                            render: 'select',
                            name: 'Тип',
                            items: {
                                linear: {
                                    name: 'Линейная'
                                },
                                logarithmic: {
                                    name: 'Логарифмическая'
                                }
                            }
                        },
                        */
                        minX: {
                            render: 'dataBinding',
                            name: 'Минимум',
                            linkTo: 'source',
                            editor: 'input'
                        },
                        maxX: {
                            render: 'dataBinding',
                            name: 'Максимум',
                            linkTo: 'source',
                            editor: 'input'
                        },
                        tickInterval: {
                            render: 'item',
                            name: 'Интервал отметок',
                            valueType: 'number'
                        },
                        tickColor: {
                            render: 'item',
                            name: 'Цвет отметок',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#ccd6eb'
                        }
                    }
                }
            }
        },

        yAxis: {
	        render: 'group',
	        name: 'Оси Y',
            collapsable: true,
            multiple: {
                uniqueNames: true
            },
            items: {
                item: {
                    render: 'group',
                    name: 'Ось Y',
                    collapsable: true,
                    editableName: {
                        commonField: 'yAxisNames'
                    },
                    items: {
                        type: {
                            render: 'select',
                            name: 'Тип',
                            items: {
                                linear: {
                                    name: 'Линейная'
                                },
                                logarithmic: {
                                    name: 'Логарифмическая'
                                }
                            }
                        },
                        labels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsable: true,
                            items: {
                                enabled: {
                                    render: 'item',
                                    name: 'Активны',
                                    optional: 'checked',
                                    editor: 'none'
                                },
                                rotation: {
                                    render: 'item',
                                    name: 'Поворот',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                step: {
                                    render: 'item',
                                    name: 'Шаг',
                                    valueType: 'number'
                                },
                                format: {
                                    render: 'item',
                                    name: 'Формат',
                                    valueType: 'string',
                                    defaultValue: '{value}'
                                },
                                fontColor: {
                                    render: 'item',
                                    name: 'Цвет шрифта',
                                    editor: 'JSB.Widgets.ColorEditor',
                                    defaultValue: '#666666'
                                },
                                fontSize: {
                                    render: 'item',
                                    name: 'Размер шрифта',
                                    valueType: 'number',
                                    defaultValue: 11
                                }
                            }
                        },
                        title: {
                            render: 'group',
                            name: 'Заголовок оси',
                            collapsable: true,
                            items: {
                                text: {
                                    render: 'item',
                                    name: 'Текст',
                                    valueType: 'string'
                                },
                                align: {
                                    render: 'select',
                                    name: 'Вертикальное выравнивание',
                                    items: {
                                        high: {
                                            name: 'По верхнему краю'
                                        },
                                        middle: {
                                            name: 'По центру'
                                        },
                                        low: {
                                            name: 'По нижнему краю'
                                        }
                                    }
                                },
                                rotation: {
                                    render: 'item',
                                    name: 'Поворот',
                                    valueType: 'number',
                                    defaultValue: 270
                                },
                                offset: {
                                    render: 'item',
                                    name: 'Отступ',
                                    valueType: 'number'
                                },
                                color: {
                                    render: 'item',
                                    name: 'Цвет',
                                    editor: 'JSB.Widgets.ColorEditor',
                                    defaultValue: '#666666'
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
                                    valueType: 'number'
                                }
                            }
                        },
                        alternateGridColor: {
                            render: 'item',
                            name: 'Чередующийся цвет',
                            editor: 'JSB.Widgets.ColorEditor'
                        },
                        crosshair: {
                            render: 'item',
                            name: 'Указатель',
                            optional: true,
                            editor: 'none'
                        },
                        lineColor: {
                            render: 'item',
                            name: 'Цвет оси',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#ccd6eb'
                        },
                        lineWidth: {
                            render: 'item',
                            name: 'Толщина оси',
                            valueType: 'number',
                            defaultValue: 1
                        },
                        offset: {
                            render: 'item',
                            name: 'Отступ оси',
                            valueType: 'number',
                            defaultValue: 0
                        },
                        opposite: {
                            render: 'item',
                            name: 'Напротив',
                            optional: true,
                            editor: 'none'
                        },
                        reversed: {
                            render: 'item',
                            name: 'Обратное направление',
                            optional: true,
                            editor: 'none'
                        },
                        gridLineColor: {
                            render: 'item',
                            name: 'Цвет линий сетки',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#e6e6e6'
                        },
                        gridLineDashStyle: {
                            render: 'select',
                            name: 'Тип линии сетки',
                            items: {
                                Solid: {
                                    name: 'Solid'
                                },
                                ShortDash: {
                                    name: 'ShortDash'
                                },
                                ShortDot: {
                                    name: 'ShortDot'
                                },
                                ShortDashDot: {
                                    name: 'ShortDashDot'
                                },
                                ShortDashDotDot: {
                                    name: 'ShortDashDotDot'
                                },
                                Dot: {
                                    name: 'Dot'
                                },
                                Dash: {
                                    name: 'Dash'
                                },
                                LongDash: {
                                    name: 'LongDash'
                                },
                                DashDot: {
                                    name: 'DashDot'
                                },
                                LongDashDot: {
                                    name: 'LongDashDot'
                                },
                                LongDashDotDot: {
                                    name: 'LongDashDotDot'
                                }
                            }
                        },
                        gridLineWidth: {
                            render: 'item',
                            name: 'Толщина линии сетки',
                            valueType: 'number',
                            defaultValue: 1
                        },
                        minY: {
                            render: 'dataBinding',
                            name: 'Минимум',
                            linkTo: 'source',
                            editor: 'input'
                        },
                        maxY: {
                            render: 'dataBinding',
                            name: 'Максимум',
                            linkTo: 'source',
                            editor: 'input'
                        },
                        tickInterval: {
                            render: 'item',
                            name: 'Интервал отметок',
                            valueType: 'number'
                        },
                        tickColor: {
                            render: 'item',
                            name: 'Цвет отметок',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#ccd6eb'
                        }
                    }
                }
            }
        },
    },
    $client: {
        _buildChart: function(){
            var baseChartOpts = $base();

            try{
                var xAxisContext = this.getContext().find('xAxis').values(),
                    yAxisContext = this.getContext().find('yAxis').values();

                var chartOpts = {
                    xAxisNames: [],

                    yAxisNames: []
                };

                if(xAxisContext.length > 0){
                    chartOpts.xAxis = [];
                }

                for(var i = 0; i < xAxisContext.length; i++){
                    var xAxisLabels = xAxisContext[i].find('labels'),
                        xAxisTitle = xAxisContext[i].find('title');

                    chartOpts.xAxis.push({
                        labels: {
                            enabled: xAxisLabels.find('enabled').checked(),
                            rotation: xAxisLabels.find('rotation').value(),
                            step: xAxisLabels.find('step').value(),
                            format: xAxisLabels.find('format').value(),
                            color: xAxisLabels.find('fontColor').value(),
                            fontSize: xAxisLabels.find('fontSize').value() + 'px'
                        },
                        title: {
                            text: xAxisTitle.find('text').value(),
                            align: xAxisTitle.find('align').value(),
                            rotation: xAxisTitle.find('rotation').value(),
                            offset: xAxisTitle.find('offset').value(),
                            style: {
                                color: xAxisTitle.find('color').value(),
                            },
                            x: xAxisTitle.find('x').value(),
                            y: xAxisTitle.find('y').value()
                        },
                        alternateGridColor: xAxisContext[i].find('alternateGridColor').value(),
                        crosshair: xAxisContext[i].find('crosshair').checked(),
                        lineColor: xAxisContext[i].find('lineColor').value(),
                        offset: xAxisContext[i].find('offset').value(),
                        opposite: xAxisContext[i].find('opposite').checked(),
                        reversed: xAxisContext[i].find('reversed').checked(),
                        tickColor: xAxisContext[i].find('tickColor').value(),
                        tickInterval: xAxisContext[i].find('tickInterval').value(),
                        type: xAxisContext[i].find('type').value(),
                        minX: xAxisContext[i].find('minX').value(),
                        maxX: xAxisContext[i].find('maxX').value()
                    });

                    chartOpts.xAxisNames.push(xAxisContext[i].find('item').getName());
                }

                if(yAxisContext.length > 0){
                    chartOpts.yAxis = [];
                }

                for(var i = 0; i < yAxisContext.length; i++){
                    var yAxisLabels = yAxisContext[i].find('labels'),
                        yAxisTitle = yAxisContext[i].find('title');

                    chartOpts.yAxis.push({
                        labels: {
                            enabled: yAxisLabels.find('enabled').checked(),
                            rotation: yAxisLabels.find('rotation').value(),
                            step: yAxisLabels.find('step').value(),
                            format: yAxisLabels.find('format').value(),
                            color: yAxisLabels.find('fontColor').value(),
                            fontSize: yAxisLabels.find('fontSize').value() + 'px'
                        },
                        title: {
                            text: yAxisTitle.find('text').value(),
                            align: yAxisTitle.find('align').value(),
                            rotation: yAxisTitle.find('rotation').value(),
                            offset: yAxisTitle.find('offset').value(),
                            style: {
                                color: yAxisTitle.find('color').value(),
                            },
                            x: yAxisTitle.find('x').value(),
                            y: yAxisTitle.find('y').value()
                        },
                        alternateGridColor: yAxisContext[i].find('alternateGridColor').value(),
                        crosshair: yAxisContext[i].find('crosshair').checked(),
                        lineColor: yAxisContext[i].find('lineColor').value(),
                        offset: yAxisContext[i].find('offset').value(),
                        opposite: yAxisContext[i].find('opposite').checked(),
                        reversed: yAxisContext[i].find('reversed').checked(),
                        tickColor: yAxisContext[i].find('tickColor').value(),
                        tickInterval: yAxisContext[i].find('tickInterval').value(),
                        type: yAxisContext[i].find('type').value(),
                        gridLineColor: yAxisContext[i].find('gridLineColor').value(),
                        gridLineDashStyle: yAxisContext[i].find('gridLineDashStyle').value(),
                        gridLineWidth: yAxisContext[i].find('gridLineWidth').value(),
                        minY: yAxisContext[i].find('minY').value(),
                        maxY: yAxisContext[i].find('maxY').value()
                    });

                    chartOpts.yAxisNames.push(yAxisContext[i].find('item').getName());
                }

                JSB.merge(true, baseChartOpts, chartOpts);
            } catch(e){
                console.log('AxisChart build chart exception');
                console.log(e);
            } finally{
                return baseChartOpts;
            }
        },
    }
}