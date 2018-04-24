{
    $name: 'DataCube.Widgets.HighstockAxis',
    $parent: 'DataCube.Widgets.YAxis',
    $scheme: {
        xAxis: {
	        render: 'group',
	        name: 'Ось Х',
            collapsable: true,
            items: {
                xAxisDate: {
                    render: 'dataBinding',
                    name: 'Дата',
                    linkTo: 'source'
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
                            //defaultValue: '{value}'
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
    },
    $client: {
	    _chartType: 'stockChart',
	    _filterPropName: 'category',

        _buildChart: function(){
            var baseChartOpts = $base();

            try{
                var xAxisContext = this.getContext().find('xAxis'),
                    xAxisLabels = xAxisContext.find('labels'),
                    xAxisTitle = xAxisContext.find('title')

                var chartOpts = {
                    xAxis:{
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
                        alternateGridColor: xAxisContext.find('alternateGridColor').value(),
                        crosshair: xAxisContext.find('crosshair').checked(),
                        events: {
                            afterSetExtremes: function(evt){
                                JSB.defer(function(){
                                    $this._changeRangeFilter(evt);
                                }, 300, 'highstockAxis.changeRangeFilter' + $this.getId());
                            }
                        },
                        lineColor: xAxisContext.find('lineColor').value(),
                        offset: xAxisContext.find('offset').value(),
                        opposite: xAxisContext.find('opposite').checked(),
                        reversed: xAxisContext.find('reversed').checked(),
                        tickColor: xAxisContext.find('tickColor').value(),
                        tickInterval: xAxisContext.find('tickInterval').value(),
                        type: xAxisContext.find('type').value(),
                        min: xAxisContext.find('minX').value(),
                        max: xAxisContext.find('maxX').value()
                    }
                };

                JSB.merge(true, baseChartOpts, chartOpts);
            } catch(e){
                console.log('HighstockAxis build chart exception');
                console.log(e);
            } finally{
                return baseChartOpts;
            }
        }
    }
}