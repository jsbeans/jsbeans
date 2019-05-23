/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
    $name: 'DataCube.Widgets.PieChart',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $expose: {
        name: 'Круговая диаграмма',
        description: '',
        category: 'Диаграммы',
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9IndpZGdldHMuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNDEiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMzOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXczNyINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIyNC42Nzk3MzgiDQogICAgIGlua3NjYXBlOmN4PSIxOC45NTU3OTMiDQogICAgIGlua3NjYXBlOmN5PSIxMC43MjYzOTEiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz48Zw0KICAgICBpZD0iZzQyMTYiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDIuOTk1MDA4MywwLDAsMi45OTUwMDgzLC01LjIyNDg4MywtNzIuMzg5NTk0KSI+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ0NzgyMTtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDcuNjkwNjA1LDI1LjU1MTk2IGMgLTAuODE5NTkyLDAuNjEzNjc1IC0xLjYyODk5LDEuMjIxMjMzIC0yLjQ2Mjg1NCwxLjg0NTEwMSBsIDAsLTMuMTYyMTU3IGMgMC43NDYxOTYsLTAuMDczNCAyLjAyNjU1MywwLjYwNTUyIDIuNDYyODU0LDEuMzE3MDU2IHoiDQogICAgICAgaWQ9InBhdGg4LTctMiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzAwNjY4MDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDQuNzIzMDY2MywyNC41MDAyNDQgMCwxLjg2NTQ4OSBjIDAsMC4zODk0MDggLTAuMDA2MSwwLjc4MDg1NSAwLjAwNDEsMS4xNzAyNjMgMC4wMDIsMC4wOTc4NiAwLjAzMDU4LDAuMjA1OTE4IDAuMDgzNTksMC4yODc0NjkgMC40ODMxOTMsMC43NjI1MDYgMC45NzY1NzksMS41MTg4OTYgMS40NjM4NDksMi4yNzczMjQgbCAwLjE3NzM3NCwwLjI3NTIzNiBjIC0wLjg2ODUyMywwLjU1MjUxMSAtMi4yNzkzNjMsMC42MTU3MTQgLTMuMzcyMTUyLC0wLjE3NTMzNSAtMS4xMTExNiwtMC44MDMyODIgLTEuNTgyMTIsLTIuMjE2MTYxIC0xLjE3MDI4NSwtMy41MTA3OSAwLjM5NTUyNCwtMS4yNDk3NzYgMS41NzM5NDMsLTIuMTczMzQ2IDIuODEzNTI0LC0yLjE4OTY1NiB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItOSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjIg0KICAgICAgIHN0eWxlPSJmaWxsOiNhYTQ0MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgZD0ibSA3LjAyMTE5OTYsMzAuNDAyMzgzIGMgLTAuNTQ0MzU2LC0wLjg0NDA1NyAtMS4wODg3MTIsLTEuNjg4MTE1IC0xLjY0MTIyMywtMi41NDIzNjYgMC44NTgzMjksLTAuNjQyMjE4IDEuNzAyMzg3LC0xLjI3NDI0MSAyLjU0ODQ4MywtMS45MDgzMDQgMC44NjAzNjgsMS4yODY0NzQgMC41OTUzMjUsMy40MDA2OTUgLTAuOTA3MjYsNC40NTA2NyB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItNSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvZz48Zw0KICAgICBpZD0iZzciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9Imc5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzE1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PC9zdmc+'
    },
    $scheme: {
        series: {
	        linkedFields: {
	            name: {
	                type: 'string',
	                repeat: true
	            },
	            data: {
	                type: 'number',
	                repeat: true
	            }
	        },
            items: {
                seriesItem: {
                    items: {
                        name: {
                            render: 'dataBinding',
                            name: 'Имена частей',
                            linkTo: 'source'
                        },
                        data: {
                            render: 'dataBinding',
                            name: 'Размеры частей',
                            linkTo: 'source'
                        },
                        size: {
                            render: 'item',
                            name: 'Внешний диаметр',
                            valueType: 'string'
                        },
                        innerSize: {
                            render: 'item',
                            name: 'Внутренний диаметр',
                            valueType: 'string'
                        },
                        dataLabels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsible: true,
                            items: {
                                color: {
                                    render: 'item',
                                    name: 'Цвет',
                                    editor: 'JSB.Widgets.ColorEditor'
                                },
                                distance: {
                                    render: 'item',
                                    name: 'Расстояние от внешнего радиуса',
                                    valueType: 'number'
                                }
                            }
                        }
                    }
                }
            }
        },

        settings: {
	        render: 'group',
	        name: 'Общие настройки',
            collapsible: true,
            collapsed: true,
            items: {
                unionSeries: {
                    render: 'switch',
                    name: 'Объединить все серии',
                    items: {
                        unionSeriesName: {
                            render: 'item',
                            name: 'Имя объединенной серии',
                            valueType: 'string'
                        }
                    }
                }
            }
        },

        plotOptions: {
	        items: {
	            series: {
	                items: {
	                    stacking: {
	                        render: null
	                    },
	                    dataLabels: {
	                        items: {
	                            align: {
	                                render: null
	                            }
	                        }
	                    }
	                }
	            },
	            pie: {
                    render: 'group',
                    name: 'Тип "Круговая диаграмма"',
                    collapsible: true,
                    collapsed: true,
	                items: {
	                    dataLabels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsible: true,
	                        items: {
	                            connectorColor: {
                                    render: 'item',
                                    name: 'Цвет коннектора',
                                    editor: 'JSB.Widgets.ColorEditor',
                                    defaultValue: '{point.color}'
	                            },
	                            connectorPadding: {
                                    render: 'item',
                                    name: 'Внутренний отступ коннектора',
                                    valueType: 'number',
                                    defaultValue: 5
	                            },
	                            connectorWidth: {
                                    render: 'item',
                                    name: 'Толщина коннектора',
                                    valueType: 'number',
                                    defaultValue: 1
	                            },
                                distance: {
                                    render: 'item',
                                    name: 'Расстояние от внешнего радиуса',
                                    valueType: 'number',
                                    defaultValue: 30
                                }
	                        }
	                    }
	                }
	            }
	        }
        }
    },
    $client: {
        _filterPropName: 'name',

        $constructor: function(opts){
            $base(opts);
            $this.setInitialized();
        },

        onRefresh: function(opts){
            if(!$base(opts)){
                this.ready();
                return;
            }

            if(!this._schemeOpts){
                var seriesContext = this.getContext().find('series').values();

                this._schemeOpts = {
                    bindings: [],
                    series: []
                };

                for(var i = 0; i < seriesContext.length; i++){
                    var name = seriesContext[i].find('name');

                    this._schemeOpts.series.push({
                        nameSelector: seriesContext[i].find('name'),
                        dataSelector: seriesContext[i].find('data'),
                        seriesNameSelector: seriesContext[i].find('seriesName')
                    });

                    this._schemeOpts.bindings.push(name.binding());
                }
            }

            if(!this._resolvePointFilters(this._schemeOpts.bindings)){
                this.ready();
                return;
            }

            var widgetOpts = this._widgetOpts ? undefined : { styleScheme: this.getContext().find('chart colorScheme').value() };

            this.getElement().loader();

            var data = [];

            try {
                function fetch(isReset){
                    $this.fetch($this._dataSource, { batchSize: 150, reset: isReset, widgetOpts: isReset ? widgetOpts : undefined }, function(res, fail, widgetOpts){
                        if(fail){
                            $this.ready();
                            $this.getElement().loader('hide');
                            return;
                        }
/*
                        if(res.length === 0){
                            resultProcessing();
                            return;
                        }
*/
                        if(widgetOpts){
                            $this._widgetOpts = widgetOpts;
                        }

                        while($this._dataSource.next()){
                            for(var i = 0; i < $this._schemeOpts.series.length; i++){
                                if(!data[i]){
                                    data[i] = [];
                                }

                                data[i].push({
                                    name: $this._schemeOpts.series[i].nameSelector.value() || $this._schemeOpts.series[i].seriesNameSelector.value(),
                                    y: $this._schemeOpts.series[i].dataSelector.value(),
                                    datacube: {
                                        filterData: $this._addFilterData()
                                    }
                                });
                            }
                        }

                        resultProcessing();
                        //fetch();
                    });
                }

                function resultProcessing(){
                    $this.buildChart(data);

                    $this.getElement().loader('hide');
                }

                fetch(true);
            } catch (ex){
                console.log('PieChart load data exception');
                console.log(ex);
                $this.getElement().loader('hide');
            } finally {
            	
            }
        },

        _buildChart: function(data){
            var baseChartOpts,
                unionSeries = this.getContext().find('settings unionSeries').checked();

            try {
                function includeData(chartOpts, data){
                    chartOpts = JSB.clone(chartOpts);

                    var seriesContext = $this.getContext().find('series').values();

                    if(seriesContext.length > 1 && unionSeries){
                        var newData = [],
                            bindings = [],
                            series0 = JSB.clone(chartOpts.series[0]);

                        for(var i = 0; i < data.length; i++){
                            newData = newData.concat(data[i]);
                            bindings.push(seriesContext[i].find('data').binding());
                        }

                        var series = {
                            datacube: {
                                bindings: bindings
                            },
                            data: newData,
                            size: seriesContext[0].find('size').value(),
                            innerSize: seriesContext[0].find('innerSize').value(),
                            dataLabels: {
                                color: seriesContext[0].find('dataLabels color').value(),
                                distance: seriesContext[0].find('dataLabels distance').value()
                            },
                            name: $this.getContext().find('settings unionSeries unionSeriesName').value()
                        };

                        JSB.merge(true, series0, series);

                        chartOpts.series = [series0];
                    } else {
                        for(var i = 0; i < seriesContext.length; i++){
                            var series = {
                                datacube: {
                                    binding: seriesContext[i].find('name').binding() || seriesContext[i].find('data').binding()
                                },
                                data: data[i],
                                size: seriesContext[i].find('size').value(),
                                innerSize: seriesContext[i].find('innerSize').value(),
                                dataLabels: {
                                    color: seriesContext[i].find('dataLabels color').value(),
                                    distance: seriesContext[i].find('dataLabels distance').value()
                                }
                            };

                            JSB.merge(true, chartOpts.series[i], series);
                        }
                    }

                    return chartOpts;
                }

                if(this._styles){
                    baseChartOpts = includeData(this._styles, data);
                } else {
                    baseChartOpts = $base();

                    var plotOptionsContext = this.getContext().find('plotOptions pie'),
                        plotOptionsDataLabels = plotOptionsContext.find('dataLabels');

                    var chartOpts = {
                        chart: {
                            type: 'pie'
                        },

                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    connectorColor: plotOptionsDataLabels.find('connectorColor').value(),
                                    connectorPadding: plotOptionsDataLabels.find('connectorPadding').value(),
                                    connectorWidth: plotOptionsDataLabels.find('connectorWidth').value(),
                                    distance: plotOptionsDataLabels.find('distance').value()
                                },
                                showInLegend: this.getContext().find('legend enabled').checked()
                            }
                        }
                    }

                    JSB.merge(true, baseChartOpts, chartOpts);

                    this._styles = baseChartOpts;

                    baseChartOpts = includeData(baseChartOpts, data);
                }
            } catch(ex){
                console.log('PieChart build chart exception');
                console.log(ex);
            } finally {
                return baseChartOpts;
            }
        }
    }
}