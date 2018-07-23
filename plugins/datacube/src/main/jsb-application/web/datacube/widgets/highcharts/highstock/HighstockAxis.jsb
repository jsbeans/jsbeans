{
    $name: 'DataCube.Widgets.HighstockAxis',
    $parent: 'DataCube.Widgets.YAxis',
    $scheme: {
        xAxis: {
	        render: 'group',
	        name: 'Ось Х',
            collapsible: true,
            items: {
                xAxisDate: {
                    render: 'dataBinding',
                    name: 'Дата',
                    linkTo: 'source',
                    autocomplete: {
                        type: 'date'
                    }
                },
                labels: {
                    render: 'group',
                    name: 'Подписи',
                    collapsible: true,
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
                                basicSettings: {
                                    type: 'date',
                                    value: 'value'
                                },
                                variables: [
                                    {
                                        alias: 'Значение',
                                        type: 'date',
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
                    collapsible: true,
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
        },

        rangeSelector: {
	        render: 'group',
	        name: 'Селектор диапазона',
            collapsible: true,
            collapsed: true,
            items: {
                enabled: {
                    render: 'item',
                    name: 'Активен',
                    optional: 'checked',
                    editor: 'none'
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
                floating: {
                    render: 'item',
                    name: 'Обтекание',
                    optional: true,
                    editor: 'none'
                },
                height: {
                    render: 'item',
                    name: 'Высота',
                    valueType: 'number',
                    defaultValue: undefined
                },
                color: {
                    render: 'item',
                    name: 'Цвет подписей',
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
                    valueType: 'number',
                    defaultValue: 0
                },
                buttonSettings: {
                    render: 'group',
                    name: 'Настройки кнопок',
                    collapsible: true,
                    items: {
                        allButtonsEnabled: {
                            render: 'item',
                            name: 'Включить все кнопки',
                            optional: true,
                            editor: 'none'
                        },
                        buttonPosition: {
                            render: 'group',
                            name: 'Расположение кнопок',
                            items: {
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
                                    defaultValue: 0
                                }
                            }
                        },
                        buttons: {
                            render: 'group',
                            name: 'Кнопки',
                            multiple: true,
                            collapsible: true,
                            collapsed: true,
                            items: {
                                type: {
                                    render: 'select',
                                    name: 'Единица измерения',
                                    items: {
                                        millisecond: {
                                            name: 'Миллисекунда'
                                        },
                                        second: {
                                            name: 'Секунда'
                                        },
                                        minute: {
                                            name: 'Минута'
                                        },
                                        hour: {
                                            name: 'Час'
                                        },
                                        day: {
                                            name: 'День'
                                        },
                                        week: {
                                            name: 'Неделя'
                                        },
                                        month: {
                                            name: 'Месяц'
                                        },
                                        year: {
                                            name: 'Год'
                                        }
                                    }
                                },
                                count: {
                                    render: 'item',
                                    name: 'Количество',
                                    valueType: 'number',
                                    defaultValue: 1
                                },
                                text: {
                                    render: 'item',
                                    name: 'Текст на кнопке',
                                    valueType: 'string',
                                    defaultValue: undefined
                                },
                                offsetMin: {
                                    render: 'item',
                                    name: 'Отступ диапазона слева',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                offsetMax: {
                                    render: 'item',
                                    name: 'Отступ диапазона справа',
                                    valueType: 'number',
                                    defaultValue: 0
                                },
                                dataGrouping: {
                                    render: 'switch',
                                    name: 'Группировка данных',
                                    items: {
                                        approximation: {
                                            render: 'select',
                                            name: 'Аппроксимация',
                                            items: {
                                                none: {
                                                    name: 'По умолчанию'
                                                },
                                                average: {
                                                    name: 'average'
                                                },
                                                averages: {
                                                    name: 'averages'
                                                },
                                                open: {
                                                    name: 'open'
                                                },
                                                high: {
                                                    name: 'high'
                                                },
                                                low: {
                                                    name: 'low'
                                                },
                                                close: {
                                                    name: 'close'
                                                },
                                                sum: {
                                                    name: 'sum'
                                                }
                                            }
                                        },
                                        forced: {
                                            render: 'item',
                                            name: 'Принудительно',
                                            optional: 'checked',
                                            editor: 'none'
                                        },
                                        groupAll: {
                                            render: 'item',
                                            name: 'Группировать все',
                                            optional: true,
                                            editor: 'none'
                                        },
                                        smoothed: {
                                            render: 'item',
                                            name: 'Сгладить границы',
                                            optional: true,
                                            editor: 'none'
                                        },
                                        groupBy: {
                                            render: 'select',
                                            name: 'Группировка по',
                                            items: {
                                                millisecond: {
                                                    name: 'Миллисекунда'
                                                },
                                                second: {
                                                    name: 'Секунда'
                                                },
                                                minute: {
                                                    name: 'Минута'
                                                },
                                                hour: {
                                                    name: 'Час'
                                                },
                                                day: {
                                                    name: 'День'
                                                },
                                                week: {
                                                    name: 'Неделя'
                                                },
                                                month: {
                                                    name: 'Месяц'
                                                },
                                                year: {
                                                    name: 'Год'
                                                }
                                            }
                                        },
                                        groupUnits: {
                                            render: 'item',
                                            name: 'Единица группировки'
                                        }
                                    }
                                }
                            }
                        },
                        buttonSpacing: {
                            render: 'item',
                            name: 'Расстояние между кнопками',
                            valueType: 'number',
                            defaultValue: 0
                        },
                        buttonTheme: {
                            render: 'group',
                            name: 'Стиль кнопок',
                            collapsible: true,
                            items: {
                                height: {
                                    render: 'item',
                                    name: 'Высота кнопок',
                                    valueType: 'number',
                                    defaultValue: 18
                                },
                                width: {
                                    render: 'item',
                                    name: 'Длина кнопок',
                                    valueType: 'number',
                                    defaultValue: 28
                                },
                                padding: {
                                    render: 'item',
                                    name: 'Внутренний отступ',
                                    valueType: 'number',
                                    defaultValue: 2
                                }
                            }
                        }
                    }
                },
                inputSettings: {
                    render: 'group',
                    name: 'Настройки полей ввода',
                    collapsible: true,
                    items: {
                        inputEnabled: {
                            render: 'item',
                            name: 'Активны',
                            optional: 'checked',
                            editor: 'none'
                        },
                        inputBoxHeight: {
                            render: 'item',
                            name: 'Высота полей',
                            valueType: 'number',
                            defaultValue: 17
                        },
                        inputBoxWidth: {
                            render: 'item',
                            name: 'Ширина полей',
                            valueType: 'number',
                            defaultValue: 90
                        },
                        inputBoxBorderColor: {
                            render: 'item',
                            name: 'Цвет границ',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#cccccc'
                        },
                        inputDateFormat: {
                            render: 'item',
                            name: 'Формат отображений даты',
                            valueType: 'string',
                            defaultValue: '%b %e %Y'
                        },
                        inputEditDateFormat: {
                            render: 'item',
                            name: 'Формат редактирования даты',
                            valueType: 'string',
                            defaultValue: '%Y-%m-%d'
                        },
                        inputPosition: {
                            render: 'group',
                            name: 'Расположение полей',
                            items: {
                                align: {
                                    render: 'select',
                                    name: 'Горизонтальное выравнивание',
                                    items: {
                                        right: {
                                            name: 'По правому краю'
                                        },
                                        left: {
                                            name: 'По левому краю'
                                        },
                                        center: {
                                            name: 'По центру'
                                        }
                                    }
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
                                    defaultValue: 0
                                }
                            }
                        }
                    }
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
                    xAxisTitle = xAxisContext.find('title'),

                    rangeSelector = this.getContext().find('rangeSelector'),
                    buttonSettings = rangeSelector.find('buttonSettings'),
                    buttonsContext = buttonSettings.find('buttons').values(),
                    buttons = [],

                    inputSettings = rangeSelector.find('inputSettings');

                for(var i = 0; i < buttonsContext.length; i++){
                    var dataGroupingSel = buttonsContext[i].find('dataGrouping'),
                        units = dataGroupingSel.find('groupUnits').value(),
                        dataGrouping;

                    if(dataGroupingSel.checked()){
                        dataGrouping = {
                            approximation: dataGroupingSel.find('approximation').value(),
                            forced: dataGroupingSel.find('forced').checked(),
                            groupAll: dataGroupingSel.find('groupAll').checked(),
                            smoothed: dataGroupingSel.find('smoothed').checked(),
                            units: [[dataGroupingSel.find('groupBy').value(), units ? units.split(',') : 1]]
                        }
                    }

                    buttons.push({
                        type: buttonsContext[i].find('type').value(),
                        count: buttonsContext[i].find('count').value(),
                        text: buttonsContext[i].find('text').value(),
                        offsetMin: buttonsContext[i].find('offsetMin').value(),
                        offsetMax: buttonsContext[i].find('offsetMax').value(),
                        dataGrouping: dataGrouping
                    });
                }

                var chartOpts = {
                    rangeSelector: {
                        enabled: rangeSelector.find('enabled').checked(),
                        verticalAlign: rangeSelector.find('verticalAlign').value(),
                        floating: rangeSelector.find('floating').checked(),
                        height: rangeSelector.find('height').value(),
                        labelStyle: {
                            color: rangeSelector.find('color').value(),
                        },
                        x: rangeSelector.find('x').value(),
                        y: rangeSelector.find('y').value(),

                        // buttons
                        allButtonsEnabled: buttonSettings.find('allButtonsEnabled').checked(),
                        buttonPosition: {
                            align: buttonSettings.find('buttonPosition align').value(),
                            x: buttonSettings.find('buttonPosition x').value(),
                            y: buttonSettings.find('buttonPosition y').value()
                        },
                        buttons: buttons,
                        buttonSpacing: buttonSettings.find('buttonSpacing').value(),
                        buttonTheme: {
                            height: buttonSettings.find('height').value(),
                            width: buttonSettings.find('width').value(),
                            padding: buttonSettings.find('padding').value()
                        },

                        // input
                        inputEnabled: inputSettings.find('inputEnabled').checked(),
                        inputBoxHeight: inputSettings.find('inputBoxHeight').value(),
                        inputBoxWidth: inputSettings.find('inputBoxWidth').value(),
                        inputBoxBorderColor: inputSettings.find('inputBoxBorderColor').value(),
                        inputDateFormat: inputSettings.find('inputDateFormat').value(),
                        inputEditDateFormat: inputSettings.find('inputEditDateFormat').value(),
                        inputPosition: {
                            align: inputSettings.find('inputPosition align').value(),
                            x: inputSettings.find('inputPosition x').value(),
                            y: inputSettings.find('inputPosition y').value()
                        }
                    },

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
                            setExtremes: function(evt){
                                if(evt.trigger === 'navigator' && evt.DOMEvent && evt.DOMEvent.type == 'mouseup' || evt.trigger === 'rangeSelectorInput' || evt.trigger === 'rangeSelectorButton') {
                                    var extremes = this.getExtremes();

                                    $this._changeRangeFilter({
                                        datacube: evt.target.series[0].options.datacube,
                                        dataMax: extremes.dataMax,
                                        dataMin: extremes.dataMin,
                                        max: evt.max,
                                        min: evt.min
                                    });
                                }
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