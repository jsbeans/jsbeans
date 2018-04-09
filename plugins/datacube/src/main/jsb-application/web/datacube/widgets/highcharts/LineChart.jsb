{
	$name: 'DataCube.Widgets.LineChart',
	$parent: 'DataCube.Widgets.AxisHighchart',
    $expose: {
        name: 'Линейная диаграмма',
        description: '',
        category: 'Диаграммы',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9jb21ib19jaGFydF8yNjM5NzkxLnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGEyNSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZSAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczIzIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzIxIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjMxLjQ2NjY2NiINCiAgICAgaW5rc2NhcGU6Y3g9IjIuOTU1NjUwNCINCiAgICAgaW5rc2NhcGU6Y3k9IjYuOTUzMjgzMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSINCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSINCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjQuMDA0MjM3NCwtOC42NzU4NDc2Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNi4wMzgxMzU3LC05LjE1MjU0MjUiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTYyIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI4Ljk5MzY0NDIsLTkuNTY1Njc4MSINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxNjQiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEwLjk5NTc2MywtOS43ODgxMzU4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuMDE0ODMxLC05Ljc4ODEzNTgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTY4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNS45ODUxNywtOS40MDY3Nzk4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE3MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMC45ODUxNjk1MSwtOS4zNDMyMjA1Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE3MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTkuMDA0MjM4LC0xLjMzNDc0NTgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTc0IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI0LjAwNDIzNzQsMTEuOTgwOTMyIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE3NiIgLz48L3NvZGlwb2RpOm5hbWVkdmlldz48cGF0aA0KICAgICBkPSJtIDE4Ljk5MTM0MSwxOS45NDgzODkgLTMuMDIwMjk3LDAgMCwtMTEuNzc4MzYxMyBjIDAsLTAuNTAwMTI3MyAwLjMzODI3NCwtMC45MDYwMjc4IDAuNzU1MDc1LC0wLjkwNjAyNzggbCAxLjUxMDE0OSwwIGMgMC40MTY4LDAgMC43NTUwNzMsMC40MDU5MDA1IDAuNzU1MDczLDAuOTA2MDI3OCBsIDAsMTEuNzc4MzYxMyB6Ig0KICAgICBpZD0icGF0aDMiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiIC8+PHBhdGgNCiAgICAgZD0ibSAxNC4wMzE4NywxOS45NDgzODkgLTMuMDIwMjk3LDAgMCwtOC4xNTQyNSBjIDAsLTAuNTAwMTI3IDAuMzM4MjczLC0wLjkwNjAyOCAwLjc1NTA3MywtMC45MDYwMjggbCAxLjUxMDE1LDAgYyAwLjQxNjgwMSwwIDAuNzU1MDc0LDAuNDA1OTAxIDAuNzU1MDc0LDAuOTA2MDI4IGwgMCw4LjE1NDI1IHoiDQogICAgIGlkPSJwYXRoNSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBkPSJtIDkuMDA4ODM4OSwxOS45NDgzODkgLTIuOTU2NzM4MywwIDAsLTkuOTY2MzA1NyBjIDAsLTAuNTAwMTI3MyAwLjMzMTE1NDcsLTAuOTA2MDI3OCAwLjczOTE4NDYsLTAuOTA2MDI3OCBsIDEuNDc4MzY5MiwwIGMgMC40MDgwMjk4LDAgMC43MzkxODQ1LDAuNDA1OTAwNSAwLjczOTE4NDUsMC45MDYwMjc4IGwgMCw5Ljk2NjMwNTcgeiINCiAgICAgaWQ9InBhdGg3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwYXRoDQogICAgIGQ9Im0gNC4wMTc1ODc4LDE5Ljk0ODM4OSAtMy4wMjAyOTgwNywwIDAsLTYuMzQyMTk0IGMgMCwtMC41MDAxMjggMC4zMzgyNzMzNywtMC45MDYwMjggMC43NTUwNzQ2NywtMC45MDYwMjggbCAxLjUxMDE0OSwwIGMgMC40MTY4MDEsMCAwLjc1NTA3NDQsMC40MDU5IDAuNzU1MDc0NCwwLjkwNjAyOCBsIDAsNi4zNDIxOTQgeiINCiAgICAgaWQ9InBhdGg5Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwb2x5bGluZQ0KICAgICBwb2ludHM9IiAgNiwxMiAxMiw4IDE4LDExIDI0LDYgIg0KICAgICBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojOWE3OTM3O3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icG9seWxpbmUxOSINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjEwNDYyOSwwLDAsMC44NDAwOTUwNSwtMi44ODk2MTkxLC0yLjg1NjA4MDUpIiAvPjxjaXJjbGUNCiAgICAgY3g9IjE3LjQ5NzA4MiINCiAgICAgY3k9IjIuMzY4MDg4MiINCiAgICAgcj0iMS40OTQyNTkiDQogICAgIGlkPSJjaXJjbGUxMSINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48Y2lyY2xlDQogICAgIGN4PSIxMi41NTM1MDEiDQogICAgIGN5PSI2LjExOTYyNDYiDQogICAgIHI9IjEuNTEwMTQ4OSINCiAgICAgaWQ9ImNpcmNsZTEzIg0KICAgICBzdHlsZT0iZmlsbDojODAzMzAwIiAvPjxjaXJjbGUNCiAgICAgY3g9IjcuNTE0NTc5OCINCiAgICAgY3k9IjQuMjc1NDgzMSINCiAgICAgaWQ9ImNpcmNsZTE1Ig0KICAgICBzdHlsZT0iZmlsbDojODAzMzAwIg0KICAgICByPSIxLjQ2MjQ3OTQiIC8+PGNpcmNsZQ0KICAgICBjeD0iMi41MDc0MzkxIg0KICAgICBjeT0iNi44NjQ2MzQ1Ig0KICAgICByPSIxLjUxMDE0ODgiDQogICAgIGlkPSJjaXJjbGUxNyINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48L3N2Zz4=`,
        thumb: 'data:image/png;base64,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'
    },
    $scheme: {
        series: {
            items: {
                seriesItem: {
                    items: {
                        name: {
                            render: 'dataBinding',
                            name: 'Имя серии или значения',
                            linkTo: 'source',
                            editor: 'input'
                        },
                        data: {
                            render: 'dataBinding',
                            name: 'Данные',
                            linkTo: 'source'
                        },
                        type: {
                            render: 'select',
                            name: 'Тип',
                            items: {
                                area: {
                                    name: 'Area'
                                },
                                bar: {
                                    name: 'Bar'
                                },
                                column: {
                                    name: 'Column'
                                },
                                line: {
                                    name: 'Line'
                                },
                                spline: {
                                    name: 'Spline'
                                }
                            }
                        },
                        colorType: {
                            render: 'select',
                            name: 'Источник цвета',
                            items: {
                                manualColor: {
                                    name: 'Заданный цвет',
                                    items: {
                                        manualColorValue: {
                                            render: 'item',
                                            name: 'Цвет',
                                            editor: 'JSB.Widgets.ColorEditor'
                                        }
                                    }
                                },
                                sourceColor: {
                                    name: 'Цвет из источника',
                                    items: {
                                        sourceColorValue: {
                                            render: 'dataBinding',
                                            name: 'Цвет',
                                            linkTo: 'source'
                                        }
                                    }
                                }
                            }
                        },
                        stack: {
                            render: 'item',
                            name: 'Имя стэка',
                            valueType: 'string'
                        },
                        step: {
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
                        yAxis: {
                            render: 'select',
                            name: 'Ось Y',
                            commonField: 'yAxisNames'
                        }
                    }
                }
            }
        },

        plotOptions: {
            items: {
                column: {
                    render: 'group',
                    name: 'Тип "Колонки"',
                    collapsable: true,
                    collapsed: true,
                    items: {
                        groupPadding: {
                            render: 'item',
                            name: 'Внутренний отступ группы',
                            valueType: 'number',
                            defaultValue: 0.2
                        },
                        pointPadding: {
                            render: 'item',
                            name: 'Внутренний отступ точки',
                            valueType: 'number',
                            defaultValue: 0.1
                        }
                    }
                }
            }
        }
    },
    $client: {
        _filterPropName: 'category',

        $constructor: function(opts){
            $base(opts);
            $this.setInitialized();
        },

        refresh: function(opts){
            if(!$base(opts)){
                return;
            }

            if(!this._schemeOpts){
                var xAxisContext = this.getContext().find('xAxis').values();

                this._schemeOpts = {
                    seriesContext: this.getContext().find('series').values(),
                    xAxisLinked: [],
                    xAxisIndividual: [],
                    xAxisFilterBinding: xAxisContext[0].find('categories').binding(),
                    series: []
                };

                for(var i = 0; i < xAxisContext.length; i++){
                    var linkedTo = xAxisContext[i].find('linkedTo').value();
                    var cat = {
                        categories: xAxisContext[i].find('categories'),
                        index: i
                    };

                    if(linkedTo){
                        this._schemeOpts.xAxisLinked.push(cat);
                    } else {
                        this._schemeOpts.xAxisIndividual.push(cat);
                    }
                }

                for(var i = 0; i < this._schemeOpts.seriesContext.length; i++){
                    this._schemeOpts.series[i] = {
                        colorType: this._schemeOpts.seriesContext[i].find('colorType').value()
                    }
                }
            }

            if(!this._resolvePointFilters(this._schemeOpts.xAxisFilterBinding)){
                return;
            }

            this.getElement().loader();
            this.fetchBinding(this._dataSource, { readAll: true, reset: true }, function(){
                try{
                    var seriesData = [],
                        xAxisLinkedData = {},
                        xAxisIndividual = [],
                        xAxisData = {};

                    while($this._dataSource.next()){
                        // xAxis

                        // связанные оси
                        var curCat = xAxisLinkedData,
                            filterCat = null;

                        for(var i = $this._schemeOpts.xAxisLinked.length - 1; i > -1 ; i--){
                            var cat = $this._schemeOpts.xAxisLinked[i].categories.value();

                            if(!curCat[cat]){
                                curCat[cat] = {};
                            }
                            curCat = curCat[cat];

                            if(i === 0){
                                filterCat = curCat;
                            }
                        }

                        // несвязанные оси
                        for(var i = 0; i < $this._schemeOpts.xAxisIndividual.length; i++){
                            if(!xAxisIndividual[i]){
                                xAxisIndividual[i] = {};
                            }
                            var val = $this._schemeOpts.xAxisIndividual.categories.value();

                            xAxisIndividual[i][val] = {};

                            if(!filterCat && i === 0){
                                filterCat = xAxisIndividual[i][val];
                            }
                        }

                        // series data
                        for(var i = 0; i < $this._schemeOpts.seriesContext.length; i++){
                            var name = $this._schemeOpts.seriesContext[i].find('name'),
                                data = $this._schemeOpts.seriesContext[i].find('data'),
                                color = $this._schemeOpts.series[i].colorType === 'manualColor' ? $this._schemeOpts.seriesContext[i].find('manualColorValue').value() : $this._schemeOpts.seriesContext[i].find('sourceColorValue').value();

                            if(!seriesData[i]){
                                seriesData[i] = {
                                    data: {}
                                };
                            }

                            if(!seriesData[i].data[name.value()]){
                                seriesData[i].data[name.value()] = [];
                            }

                            seriesData[i].data[name.value()].push({
                                datacube: {
                                    binding: $this._schemeOpts.xAxisFilterBinding,
                                    filterData: $this._addFilterData()
                                },
                                color: color,
                                x: filterCat || $this._schemeOpts.xAxisFilterBinding.value(),
                                y: data.value()
                            });
                        }
                    }

                    function resolveLinkedCategories(cats, result, index, max, curX){
                        var keys = Object.keys(cats).sort();

                        if(!result.categoriesArrays[index]){
                            result.categoriesArrays[index] = [];
                        }

                        result.categoriesArrays[index] = result.categoriesArrays[index].concat(keys);

                        if(index === max){
                            for(var i = 0; i < keys.length; i++){
                                cats[keys[i]].x = curX.x++;
                            }
                            return keys.length;
                        }

                        if(!result.tickPositions[index]){
                            result.tickPositions[index] = [];
                        }

                        var curTick = 0;
                        for(var i in cats){
                            curTick = curTick + resolveLinkedCategories(cats[i], result, index + 1, max, curX);
                            result.tickPositions[index].push(curTick);
                        }
                    }

                    if($this._schemeOpts.xAxisLinked.length > 0){
                        var xAxisLinkedCats = {
                            categoriesArrays: [],
                            tickPositions: []
                        };

                        resolveLinkedCategories(xAxisLinkedData, xAxisLinkedCats, 0, $this._schemeOpts.xAxisLinked.length - 1, {x: 0});

                        xAxisData.xAxisLinkedCats = xAxisLinkedCats;
                    }

                    if($this._schemeOpts.xAxisIndividual.length > 0){
                        var xAxisIndividualCats = [];

                        for(var i = 0; i < xAxisIndividual.length; i++){
                            xAxisIndividualCats[i] = Object.keys(xAxisIndividual[i]);
                        }

                        for(var j = 0; j < xAxisIndividualCats[0].length; j++){
                            xAxisIndividual[0][j].x = j;
                        }

                        xAxisData.xAxisIndividualCats = xAxisIndividualCats;
                    }
debugger;
                    function resolveData(data){
                        for(var i in data){
                            if(data[i].x){
                                data[i].x = data[i].x.x;
                            }
                        }
                        return data;
                    }

                    // resolve data
                    var data = [];
                    for(var i = 0; i < seriesData.length; i++){
                        var obj = seriesData[i].data;

                        for(var j in obj){
                            data.push({
                                color: obj[j][0].color,
                                data: resolveData(obj[j]),
                                index: i,
                                name: j
                            });
                        }
                    }

                    if(opts && opts.isCacheMod){
                        $this.storeCache({
                            data: data,
                            xAxisData: xAxisData
                        });
                    }

                    $this.buildChart({
                        data: data,
                        xAxisData: xAxisData
                    });
                } catch(ex){
                    console.log('LineChart load data exception');
                    console.log(ex);
                } finally {
                    $this.getElement().loader('hide');
                }
            });
        },

        _buildChart: function(data){
            var baseChartOpts;

            try{
                function includeData(chartOpts, seriesData, xAxisData){
                    chartOpts = JSB.clone(chartOpts);

                    var seriesContext = $this.getContext().find('series').values(),
                        chartOptsSeries = JSB.clone(chartOpts.series);

                    for(var j = 0; j < seriesData.length; j++){
                        var yAxis = chartOpts.yAxisNames.indexOf(seriesContext[seriesData[j].index].find('yAxis').value());

                        var series = {
                            name: seriesData[j].name,
                            data: seriesData[j].data,
                            datacube: {
                                binding: $this._schemeOpts.xAxisFilterBinding
                            },
                            type: seriesContext[seriesData[j].index].find('type').value(),
                            color: seriesData[j].color,
                            stack: seriesContext[seriesData[j].index].find('stack').value(),
                            step: $this.isNone(seriesContext[seriesData[j].index].find('step').value()),
                            yAxis: yAxis > -1 ? yAxis : undefined
                        };

                        chartOpts.series[j] = JSB.clone(chartOptsSeries[seriesData[j].index]);

                        JSB.merge(true, chartOpts.series[j], series);
                    }

                    if(xAxisData.xAxisLinkedCats){
                        for(var i = $this._schemeOpts.xAxisLinked.length - 1; i > -1 ; i--){
                            chartOpts.xAxis[$this._schemeOpts.xAxisLinked[i].index].categories = xAxisData.xAxisLinkedCats[i].categoriesArrays;
                            chartOpts.xAxis[$this._schemeOpts.xAxisLinked[i].index].tickPositions = xAxisData.xAxisLinkedCats[i].tickPositions;
                        }
                    }

                    if(xAxisData.xAxisIndividualCats){
                        for(var i = 0; i < $this._schemeOpts.xAxisIndividual.length; i++){
                            chartOpts.xAxis[$this._schemeOpts.xAxisIndividual[i].index].categories = xAxisData.xAxisIndividualCats[i];
                        }
                    }

                    return chartOpts;
                }

                if(this._styles){
                    baseChartOpts = includeData(this._styles, data.data, data.xAxisData);
                } else {
                    baseChartOpts = $base();
                    var columnPlotOptionsContext = this.getContext().find('plotOptions column');

                    var chartOpts = {
                        chart: {
                            events: {
                                //
                            }
                        },
                        plotOptions: {
                            column: {
                                groupPadding: columnPlotOptionsContext.find('groupPadding').value(),
                                pointPadding: columnPlotOptionsContext.find('pointPadding').value()
                            }
                        }
                    }

                    JSB.merge(true, baseChartOpts, chartOpts);

                    this._styles = baseChartOpts;

                    baseChartOpts = includeData(baseChartOpts, data.data, data.xAxisData);
                }
            } catch(ex){
                console.log('LineChart build chart exception');
                console.log(ex);
            } finally {
                return baseChartOpts;
            }
        }
    }
}