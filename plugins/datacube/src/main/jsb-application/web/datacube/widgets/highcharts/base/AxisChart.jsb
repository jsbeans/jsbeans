{
    $name: 'DataCube.Widgets.AxisHighchart',
    $parent: 'DataCube.Widgets.YAxis',
    $scheme: {
        xAxis: {
	        render: 'group',
	        name: 'Ось Х',
            collapsable: true,
            multiple: {
                createDefault: true,
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
                            allowEmpty: true,
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
                                    render: 'formatter',
                                    name: 'Формат',
                                    formatterOpts: {
                                        variables: [
                                            {
                                                alias: 'Значение',
                                                type: 'string',
                                                value: 'value'
                                            }
                                        ]
                                    },
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
                            defaultValue: undefined
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
        }
    },
    $client: {
        _buildChart: function(){
            var baseChartOpts = $base();

            try{
                var xAxisContext = this.getContext().find('xAxis').values();

                var chartOpts = {
                    xAxisNames: []
                };

                if(xAxisContext.length > 0){
                    chartOpts.xAxis = [];
                }

                for(var i = 0; i < xAxisContext.length; i++){
                    chartOpts.xAxisNames.push(xAxisContext[i].find('item').getName());
                }

                for(var i = 0; i < xAxisContext.length; i++){
                    var xAxisLabels = xAxisContext[i].find('labels'),
                        xAxisTitle = xAxisContext[i].find('title'),
                        linkedToIndex = chartOpts.xAxisNames.indexOf(xAxisContext[i].find('linkedTo').value());

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
                        linkedTo: linkedToIndex > -1 ? linkedToIndex : undefined,
                        offset: xAxisContext[i].find('offset').value(),
                        opposite: xAxisContext[i].find('opposite').checked(),
                        reversed: xAxisContext[i].find('reversed').checked(),
                        tickColor: xAxisContext[i].find('tickColor').value(),
                        tickInterval: xAxisContext[i].find('tickInterval').value(),
                        type: xAxisContext[i].find('type').value(),
                        minX: xAxisContext[i].find('minX').value(),
                        maxX: xAxisContext[i].find('maxX').value()
                    });
                }

                JSB.merge(true, baseChartOpts, chartOpts);
            } catch(e){
                console.log('AxisChart build chart exception');
                console.log(e);
            } finally{
                return baseChartOpts;
            }
        }
    }
}