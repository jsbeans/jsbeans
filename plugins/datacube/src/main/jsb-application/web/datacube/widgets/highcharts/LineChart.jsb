/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Widgets.LineChart',
	$parent: 'DataCube.Widgets.AxisHighchart',
    $expose: {
        name: 'Линейная диаграмма',
        description: '',
        category: 'Диаграммы',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9jb21ib19jaGFydF8yNjM5NzkxLnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGEyNSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZSAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczIzIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzIxIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjMxLjQ2NjY2NiINCiAgICAgaW5rc2NhcGU6Y3g9IjIuOTU1NjUwNCINCiAgICAgaW5rc2NhcGU6Y3k9IjYuOTUzMjgzMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSINCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSINCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjQuMDA0MjM3NCwtOC42NzU4NDc2Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNi4wMzgxMzU3LC05LjE1MjU0MjUiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTYyIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI4Ljk5MzY0NDIsLTkuNTY1Njc4MSINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxNjQiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEwLjk5NTc2MywtOS43ODgxMzU4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuMDE0ODMxLC05Ljc4ODEzNTgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTY4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNS45ODUxNywtOS40MDY3Nzk4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE3MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMC45ODUxNjk1MSwtOS4zNDMyMjA1Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE3MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTkuMDA0MjM4LC0xLjMzNDc0NTgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTc0IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI0LjAwNDIzNzQsMTEuOTgwOTMyIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE3NiIgLz48L3NvZGlwb2RpOm5hbWVkdmlldz48cGF0aA0KICAgICBkPSJtIDE4Ljk5MTM0MSwxOS45NDgzODkgLTMuMDIwMjk3LDAgMCwtMTEuNzc4MzYxMyBjIDAsLTAuNTAwMTI3MyAwLjMzODI3NCwtMC45MDYwMjc4IDAuNzU1MDc1LC0wLjkwNjAyNzggbCAxLjUxMDE0OSwwIGMgMC40MTY4LDAgMC43NTUwNzMsMC40MDU5MDA1IDAuNzU1MDczLDAuOTA2MDI3OCBsIDAsMTEuNzc4MzYxMyB6Ig0KICAgICBpZD0icGF0aDMiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiIC8+PHBhdGgNCiAgICAgZD0ibSAxNC4wMzE4NywxOS45NDgzODkgLTMuMDIwMjk3LDAgMCwtOC4xNTQyNSBjIDAsLTAuNTAwMTI3IDAuMzM4MjczLC0wLjkwNjAyOCAwLjc1NTA3MywtMC45MDYwMjggbCAxLjUxMDE1LDAgYyAwLjQxNjgwMSwwIDAuNzU1MDc0LDAuNDA1OTAxIDAuNzU1MDc0LDAuOTA2MDI4IGwgMCw4LjE1NDI1IHoiDQogICAgIGlkPSJwYXRoNSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBkPSJtIDkuMDA4ODM4OSwxOS45NDgzODkgLTIuOTU2NzM4MywwIDAsLTkuOTY2MzA1NyBjIDAsLTAuNTAwMTI3MyAwLjMzMTE1NDcsLTAuOTA2MDI3OCAwLjczOTE4NDYsLTAuOTA2MDI3OCBsIDEuNDc4MzY5MiwwIGMgMC40MDgwMjk4LDAgMC43MzkxODQ1LDAuNDA1OTAwNSAwLjczOTE4NDUsMC45MDYwMjc4IGwgMCw5Ljk2NjMwNTcgeiINCiAgICAgaWQ9InBhdGg3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwYXRoDQogICAgIGQ9Im0gNC4wMTc1ODc4LDE5Ljk0ODM4OSAtMy4wMjAyOTgwNywwIDAsLTYuMzQyMTk0IGMgMCwtMC41MDAxMjggMC4zMzgyNzMzNywtMC45MDYwMjggMC43NTUwNzQ2NywtMC45MDYwMjggbCAxLjUxMDE0OSwwIGMgMC40MTY4MDEsMCAwLjc1NTA3NDQsMC40MDU5IDAuNzU1MDc0NCwwLjkwNjAyOCBsIDAsNi4zNDIxOTQgeiINCiAgICAgaWQ9InBhdGg5Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwb2x5bGluZQ0KICAgICBwb2ludHM9IiAgNiwxMiAxMiw4IDE4LDExIDI0LDYgIg0KICAgICBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojOWE3OTM3O3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icG9seWxpbmUxOSINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjEwNDYyOSwwLDAsMC44NDAwOTUwNSwtMi44ODk2MTkxLC0yLjg1NjA4MDUpIiAvPjxjaXJjbGUNCiAgICAgY3g9IjE3LjQ5NzA4MiINCiAgICAgY3k9IjIuMzY4MDg4MiINCiAgICAgcj0iMS40OTQyNTkiDQogICAgIGlkPSJjaXJjbGUxMSINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48Y2lyY2xlDQogICAgIGN4PSIxMi41NTM1MDEiDQogICAgIGN5PSI2LjExOTYyNDYiDQogICAgIHI9IjEuNTEwMTQ4OSINCiAgICAgaWQ9ImNpcmNsZTEzIg0KICAgICBzdHlsZT0iZmlsbDojODAzMzAwIiAvPjxjaXJjbGUNCiAgICAgY3g9IjcuNTE0NTc5OCINCiAgICAgY3k9IjQuMjc1NDgzMSINCiAgICAgaWQ9ImNpcmNsZTE1Ig0KICAgICBzdHlsZT0iZmlsbDojODAzMzAwIg0KICAgICByPSIxLjQ2MjQ3OTQiIC8+PGNpcmNsZQ0KICAgICBjeD0iMi41MDc0MzkxIg0KICAgICBjeT0iNi44NjQ2MzQ1Ig0KICAgICByPSIxLjUxMDE0ODgiDQogICAgIGlkPSJjaXJjbGUxNyINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48L3N2Zz4=`
    },
    $scheme: {
        series: {
	        linkedFields: {
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
                            name: 'Имена серий из источника',
                            linkTo: 'source'
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
                                    name: 'Column',
                                    items: {
                                        pointPadding: {
                                            render: 'item',
                                            name: 'Отступ колонки',
                                            valueType: 'number',
                                            defaultValue: 0.1,
                                            editorOpts: {
                                                min: 0,
                                                max: 0.5,
                                                step: 0.05,
                                                defaultValue: 0.1
                                            }
                                        },
                                        pointPlacement: {
                                            render: 'item',
                                            name: 'Положение колонки',
                                            valueType: 'number',
                                            defaultValue: 0,
                                            editorOpts: {
                                                min: 0,
                                                max: 0.5,
                                                step: 0.05,
                                                defaultValue: 0
                                            }
                                        }
                                    }
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
                    collapsible: true,
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

        onRefresh: function(opts){
            if(!$base(opts)){
                this.ready();
                return;
            }

            if(!this._schemeOpts){
                var xAxisContext = this.getContext().find('xAxis').values(),
                    linkMap = {};

                this._schemeOpts = {
                    seriesContext: this.getContext().find('series').values(),
                    xAxisLinked: [],
                    xAxisIndividual: [],
                    xAxisFilterBinding: xAxisContext[0].find('categories').binding(),
                    series: []
                };

                for(var i = 0; i < xAxisContext.length; i++){
                    var linkedTo = xAxisContext[i].find('linkedTo').value();

                    if(linkedTo){
                        linkMap[linkedTo] = true;
                        linkMap[xAxisContext[i].getName()] = true;
                    }
                }

                for(var i = 0; i < xAxisContext.length; i++){
                    var cat = {
                        categories: xAxisContext[i].find('categories'),
                        index: i
                    };

                    if(linkMap[xAxisContext[i].getName()]){
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
                this.ready();
                return;
            }

            var widgetOpts = this._widgetOpts ? undefined : { styleScheme: this.getContext().find('chart colorScheme').value() };

            this.getElement().loader();

            var seriesData = [],
                xAxisLinkedData = {},
                xAxisIndividual = [],
                xAxisData = {};

            try{
                function fetch(isReset){
                    $this.fetch($this._dataSource, { batchSize: 100, reset: isReset, widgetOpts: isReset ? widgetOpts : undefined }, function(res, fail, serverWidgetOpts){
                    	if(fail){
                            $this.ready();
                            $this.getElement().loader('hide');
                            return;
                        }

                        if(res.length === 0){
                            resultProcessing();
                            return;
                        }

                        if(serverWidgetOpts){
                            $this._widgetOpts = serverWidgetOpts;
                        }

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
                                var val = $this._schemeOpts.xAxisIndividual[i].categories.value();

                                if(!xAxisIndividual[i][val]){
                                    xAxisIndividual[i][val] = {};
                                }

                                if(!filterCat && i === 0){
                                    filterCat = xAxisIndividual[i][val];
                                }
                            }

                            // series data
                           for(var i = 0; i < $this._schemeOpts.seriesContext.length; i++){
                                var seriesName = $this._schemeOpts.seriesContext[i].find('name').value() || $this._schemeOpts.seriesContext[i].find('seriesName').value(),
                                    data = $this._schemeOpts.seriesContext[i].find('data'),
                                    color = $this._schemeOpts.series[i].colorType === 'manualColor' ? $this._schemeOpts.seriesContext[i].find('manualColorValue').value() : $this._schemeOpts.seriesContext[i].find('sourceColorValue').value();

                                if(!seriesData[i]){
                                    seriesData[i] = {
                                        data: {}
                                    };
                                }

                                if(!seriesData[i].data[seriesName]){
                                    seriesData[i].data[seriesName] = [];
                                }

                                seriesData[i].data[seriesName].push({
                                    color: color,
                                    x: filterCat,
                                    y: data.value(),
                                    datacube: {
                                        filterData: $this._addFilterData()
                                    }
                                });
                            }
                        }

                        if(seriesData.length <= 3000){
                            fetch();
                        } else {
                            resultProcessing();
                        }
                    });
                }

                function resultProcessing(){
                    function resolveLinkedCategories(cats, result, index, max, curX){
                        var keys = Object.keys(cats);

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

                        var curTick = -1;
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

                        for(var i = 0; i < xAxisLinkedCats.categoriesArrays.length - 1; i++){
                            var dummyCats = [],
                                cutCount = 0;

                            for(var j = 0; j < xAxisLinkedCats.tickPositions[i][xAxisLinkedCats.tickPositions[i].length - 1] + 1; j++){
                                if(xAxisLinkedCats.tickPositions[i].indexOf(j) > -1){
                                    dummyCats[j] = xAxisLinkedCats.categoriesArrays[i][cutCount];
                                    cutCount++;
                                } else {
                                    dummyCats[j] = 'dummy';
                                }
                            }

                            xAxisLinkedCats.categoriesArrays[i] = dummyCats;
                        }

                        xAxisData.xAxisLinkedCats = xAxisLinkedCats;
                    }

                    if($this._schemeOpts.xAxisIndividual.length > 0){
                        var xAxisIndividualCats = [];

                        for(var i = 0; i < xAxisIndividual.length; i++){
                            xAxisIndividualCats[i] = Object.keys(xAxisIndividual[i]);
                        }
                        if(xAxisIndividualCats[0]){
                            for(var j = 0; j < xAxisIndividualCats[0].length; j++){
                                xAxisIndividual[0][xAxisIndividualCats[0][j]].x = j;
                            }
                        }

                        xAxisIndividualCats.sort();

                        xAxisData.xAxisIndividualCats = xAxisIndividualCats;
                    }

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

                    // sort data for highcharts
                    for(var i = 0; i < data.length; i++){
                        data[i].data.sort(function(a, b){
                            return a.x < b.x ? -1 : 1;
                        });
                    }

                    $this.buildChart({
                        data: data,
                        xAxisData: xAxisData
                    });

                    $this.getElement().loader('hide');
                }

                fetch(true);
            } catch(ex){
                console.log('LineChart load data exception');
                console.log(ex);
                $this.getElement().loader('hide');
            }
        },

        _buildChart: function(data){
            var baseChartOpts;

            try{
                function centerLabels(chart){
                    for(var j = 0; j < $this._schemeOpts.xAxisLinked.length; j++){
                        var axis = chart.xAxis[$this._schemeOpts.xAxisLinked[j].index],
                            tickWidth = axis.width / axis.categories.length,
                            lastTick = -1;

                        for (var i = 0; i < axis.categories.length; i++) {
                            if (axis.ticks[i]) {
                                var left = axis.chart.plotLeft + ((lastTick + 1) * tickWidth),
                                    label = axis.ticks[i].label,
                                    newX = left + (((axis.ticks[i].pos - lastTick) / 2) * tickWidth),
                                    x = newX - (label ? label.xy.x : 0);

                                label && label.attr({
                                    translateX: x,
                                    translateY: 0
                                });

                                lastTick = i;
                            }
                        }
                    }
                }

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
                            pointPadding: seriesContext[seriesData[j].index].find('pointPadding').value(),
                            pointPlacement: seriesContext[seriesData[j].index].find('pointPlacement').value(),
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
                        for(var i = 0; i < $this._schemeOpts.xAxisLinked.length; i++){
                            chartOpts.xAxis[$this._schemeOpts.xAxisLinked[i].index].categories = xAxisData.xAxisLinkedCats.categoriesArrays[xAxisData.xAxisLinkedCats.categoriesArrays.length - 1 - i];
                            chartOpts.xAxis[$this._schemeOpts.xAxisLinked[i].index].tickPositions = xAxisData.xAxisLinkedCats.tickPositions[xAxisData.xAxisLinkedCats.categoriesArrays.length - 1 - i];
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
          	                    load: function(){
                                    centerLabels(this);
                                }, resize: function(){
                                    centerLabels(this);
                                }
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