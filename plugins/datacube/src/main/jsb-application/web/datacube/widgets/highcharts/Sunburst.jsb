{
    $name: 'DataCube.Widgets.Sunburst',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $expose: {
        name: 'Солнечные лучи',
        description: '',
        category: 'Диаграммы',
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB3aWR0aD0iMjc3MS44NTg2IiBoZWlnaHQ9IjI3NzEuODU4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxkZWZzPgogIDxmaWx0ZXIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBoZWlnaHQ9IjEuNjg1NzE0IiB5PSItMC4zNDI4NTciIHdpZHRoPSIxLjY4NTcxNCIgeD0iLTAuMzQyODU3IiBpZD0iZmlsdGVyNTQ5OCI+CiAgIDxmZUdhdXNzaWFuQmx1ciBpZD0iZmVHYXVzc2lhbkJsdXI1NTAwIiBzdGREZXZpYXRpb249Ijg2LjEyMjQ0NSIvPgogIDwvZmlsdGVyPgogIDxyYWRpYWxHcmFkaWVudCByPSIxIiBjeT0iMC41IiBjeD0iMC41IiBzcHJlYWRNZXRob2Q9InBhZCIgaWQ9InN2Z183Ij4KICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmZjAwIi8+CiAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0ibm9uZSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiA8L2RlZnM+CiA8bWV0YWRhdGEgaWQ9Im1ldGFkYXRhNDc2OCI+aW1hZ2Uvc3ZnK3htbDwvbWV0YWRhdGE+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDg5MSIgZD0ibTEyNzIuNzkyMjM2LDI3NzEuODU4ODg3bDIyNi4yNzQxNywwbC0xMTMuMTM3MDg1LC0xNDM2Ljg0MDgybC0xMTMuMTM3MDg1LDE0MzYuODQwODJ6bTAsLTI3NzEuODU4NjQzbDIyNi4yNzQxNywwbC0xMTMuMTM3MDg1LDE0MzYuODQxMDY0bC0xMTMuMTM3MDg1LC0xNDM2Ljg0MTA2NHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0ODk1IiBkPSJtOTE3Ljk0MjM4MywyNjk1LjM1MjA1MWwyMTguNTYzOTY1LDU4LjU2Mzk2NWwyNjIuNTk5ODU0LC0xNDE3LjE2NDA2M2wtNDgxLjE2MzgxOCwxMzU4LjYwMDA5OHptNzE3LjQwOTc5LC0yNjc3LjQwOTkxMmwyMTguNTY0MDg3LDU4LjU2NDIwOWwtNDgxLjE2Mzk0LDEzNTguNTk5NjA5bDI2Mi41OTk4NTQsLTE0MTcuMTYzODE4eiIvPgogIDxwYXRoIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0idXJsKCNzdmdfNykiIHN0cm9rZT0iI2ZmZmZmZiIgaWQ9InVzZTQ4OTkiIGQ9Im01OTQuOTg0OTg1LDI1MjkuNjEwODRsMTk1Ljk1OTIyOSwxMTMuMTM3MjA3bDYyMC40NDA5MTgsLTEzMDAuOTA5NjY4bC04MTYuNDAwMTQ2LDExODcuNzcyNDYxem0xMzg1LjkyOTMyMSwtMjQwMC41bDE5NS45NTkyMjksMTEzLjEzNzIwN2wtODE2LjQwMDE0NiwxMTg3Ljc3MjQ2MWw2MjAuNDQwOTE4LC0xMzAwLjkwOTY2OHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTAzIiBkPSJtMzI1LjkyOTMyMSwyMjg1LjkyOTE5OWwxNjAsMTYwbDkzNi4wMDAxMjIsLTEwOTZsLTEwOTYuMDAwMTIyLDkzNnptMTk1OS45OTk4NzgsLTE5NjBsMTYwLDE2MGwtMTA5NS45OTk4NzgsOTM2bDkzNS45OTk4NzgsLTEwOTZ6Ii8+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDkwNyIgZD0ibTEyOS4xMTMxNTksMTk4MC45MTQwNjNsMTEzLjEzMDEyNywxOTUuOTU5OTYxbDExODcuNzc5OTA3LC04MTYuNDAwMzkxbC0xMzAwLjkxMDAzNCw2MjAuNDQwNDN6bTI0MDAuNDk4MTY5LC0xMzg1LjkzMDE3NmwxMTMuMTM2NDc1LDE5NS45NTk5NjFsLTEzMDAuOTA0NjYzLDYyMC40Mzk5NDFsMTE4Ny43NjgxODgsLTgxNi4zOTk5MDJsMCwweiIvPgogIDxwYXRoIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0idXJsKCNzdmdfNykiIHN0cm9rZT0iI2ZmZmZmZiIgaWQ9InVzZTQ5MTEiIGQ9Im0xNy45NDMyMzcsMTYzNS4zNTQwMDRsNTguNTYwMDU5LDIxOC41NjAwNTlsMTM1OC41OTk4NTQsLTQ4MS4xNjAxNTZsLTE0MTcuMTU5OTEyLDI2Mi42MDAwOTh6bTI2NzcuNDA5MDU4LC03MTcuNDEwMTU2bDU4LjU2MzcyMSwyMTguNTYwMDU5bC0xNDE3LjE2Mjg0MiwyNjIuNTk5NjA5bDEzNTguNTk4ODc3LC00ODEuMTU5NjY4bDAuMDAwMjQ0LDB6Ii8+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDkxNSIgZD0ibTAuMDAzMjk2LDEyNzIuNzkzOTQ1bDAsMjI2LjI3MDAybDE0MzYuODM5ODQ0LC0xMTMuMTMwMzcxbC0xNDM2LjgzOTg0NCwtMTEzLjEzOTY0OHptMjc3MS44NTUxMDMsMGwwLDIyNi4yNzAwMmwtMTQzNi44NDUyMTUsLTExMy4xMzAzNzFsMTQzNi44NDUyMTUsLTExMy4xMzk2NDhsMCwweiIvPgogIDxwYXRoIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0idXJsKCNzdmdfNykiIHN0cm9rZT0iI2ZmZmZmZiIgaWQ9InVzZTQ5MTkiIGQ9Im03Ni41MDMyOTYsOTE3Ljk0Mzg0OGwtNTguNTYwMDU5LDIxOC41NjAwNTlsMTQxNy4xNTk5MTIsMjYyLjU5OTYwOWwtMTM1OC41OTk4NTQsLTQ4MS4xNTk2Njh6bTI2NzcuNDEyOTY0LDcxNy40MTAxNTZsLTU4LjU2NDIwOSwyMTguNTYwMDU5bC0xMzU4LjU5ODg3NywtNDgxLjE2MDE1NmwxNDE3LjE2MzA4NiwyNjIuNjAwMDk4bDAsMHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTIzIiBkPSJtMjQyLjI0MzI4Niw1OTQuOTgzODg3bC0xMTMuMTMwMTI3LDE5NS45NTk5NjFsMTMwMC45MTAwMzQsNjIwLjQzOTk0MWwtMTE4Ny43Nzk5MDcsLTgxNi4zOTk5MDJ6bTI0MDAuNTA0NTE3LDEzODUuOTMwMTc2bC0xMTMuMTM2NDc1LDE5NS45NTk5NjFsLTExODcuNzY4MTg4LC04MTYuNDAwMzkxbDEzMDAuOTA0NjYzLDYyMC40NDA0M2wwLDB6Ii8+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDkyNyIgZD0ibTQ4NS45MzMyMjgsMzI1LjkzMzgzOGwtMTYwLDE2MGwxMDk2LDkzNi4wMDAyNDRsLTkzNiwtMTA5Ni4wMDAyNDR6bTE5NTkuOTk1OTcyLDE5NjAuMDAwMjQ0bC0xNjAsMTYwbC05MzUuOTk1OTcyLC0xMDk2LjAwMDQ4OGwxMDk1Ljk5NTk3Miw5MzYuMDAwNDg4bDAsMHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTMxIiBkPSJtNzkwLjk0NDMzNiwxMjkuMTEwODRsLTE5NS45NTkxMDYsMTEzLjEzNzIwN2w4MTYuNDAwMDI0LDExODcuNzcyNDYxbC02MjAuNDQwOTE4LC0xMzAwLjkwOTY2OHptMTM4NS45MjkxOTksMjQwMC41bC0xOTUuOTU4OTg0LDExMy4xMzcyMDdsLTYyMC40NDEwNCwtMTMwMC45MDk2NjhsODE2LjQwMDAyNCwxMTg3Ljc3MjQ2MXoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTM1IiBkPSJtMTEzNi41MDY0NywxNy45NDIzODNsLTIxOC41NjQwODcsNTguNTYzOTY1bDQ4MS4xNjM5NCwxMzU4LjYwMDA5OGwtMjYyLjU5OTg1NCwtMTQxNy4xNjQwNjN6bTcxNy40MDk3OSwyNjc3LjQxMDE1NmwtMjE4LjU2NDA4Nyw1OC41NjM5NjVsLTI2Mi41OTk4NTQsLTE0MTcuMTY0MDYzbDQ4MS4xNjM5NCwxMzU4LjYwMDA5OHoiLz4KICA8cGF0aCBmaWxsPSIjZjhmNmFlIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iNCIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZpbHRlcj0idXJsKCNmaWx0ZXI1NDk4KSIgaWQ9InBhdGg0NzczIiBkPSJtMTY4Ny4zNTc5MSwxMzUwLjQ3MzI2N2MwLDE2Ni40NzQzNjUgLTEzNC45NTQyMjQsMzAxLjQyODU4OSAtMzAxLjQyODU4OSwzMDEuNDI4NTg5Yy0xNjYuNDc0MzY1LDAgLTMwMS40Mjg0NjcsLTEzNC45NTQyMjQgLTMwMS40Mjg0NjcsLTMwMS40Mjg1ODljMCwtMTY2LjQ3NDQ4NyAxMzQuOTU0MTAyLC0zMDEuNDI4NTg5IDMwMS40Mjg0NjcsLTMwMS40Mjg1ODljMTY2LjQ3NDM2NSwwIDMwMS40Mjg1ODksMTM0Ljk1NDEwMiAzMDEuNDI4NTg5LDMwMS40Mjg1ODl6Ii8+CiA8L2c+Cjwvc3ZnPg==',
        thumb: 'data:image/png;base64,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'
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
                    render: 'group',
                    name: 'Серия',
                    collapsible: true,
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
                        /*
                        parent: {
                            render: 'dataBinding',
                            name: 'Родитель',
                            linkTo: 'source'
                        },
                        */
                        autoSize: {
                            render: 'item',
                            name: 'Автоматически считать размеры',
                            optional: true,
                            editor: 'none'
                        },
                        isSum: {
                            render: 'item',
                            name: 'Суммировать количество',
                            optional: true,
                            editor: 'none'
                        },
                        tooltip: {
                            items: {
                                pointFormat: {
                                    formatterOpts: {
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
                                                alias: 'Значение точки',
                                                type: 'number',
                                                value: 'point.value'
                                            },
                                            {
                                                alias: 'Имя точки',
                                                type: 'string',
                                                value: 'point.name'
                                            },
                                            {
                                                alias: 'Имя серии',
                                                type: 'string',
                                                value: 'point.seriesName'
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        dataLabels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsible: true,
                            items: {
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
                                                alias: 'Значение точки',
                                                type: 'number',
                                                value: 'point.value'
                                            },
                                            {
                                                alias: 'Имя точки',
                                                type: 'string',
                                                value: 'point.name'
                                            },
                                            {
                                                alias: 'Имя серии',
                                                type: 'string',
                                                value: 'point.seriesName'
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

	    mainTooltip: {
            items: {
                pointFormat: {
                    formatterOpts: {
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
                                alias: 'Имя точки',
                                type: 'string',
                                value: 'point.name'
                            },
                            {
                                alias: 'Значение точки',
                                type: 'number',
                                value: 'point.value'
                            },
                            {
                                alias: 'Имя серии',
                                type: 'string',
                                value: 'point.seriesName'
                            }
                        ]
                    }
                }
            }
	    },

        plotOptions: {
            items: {
                series: {
                    items: {
                        dataLabels: {
                            render: 'group',
                            name: 'Подписи',
                            collapsible: true,
                            items: {
                                format: {
                                    formatterOpts: {
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
                                                alias: 'Имя точки',
                                                type: 'string',
                                                value: 'point.name'
                                            },
                                            {
                                                alias: 'Имя серии',
                                                type: 'string',
                                                value: 'point.seriesName'
                                            }
                                        ]
                                    }
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
	        JSB.loadScript('tpl/highcharts/modules/sunburst.js', function(){
	            $this.setInitialized();
	        });
        },

        onRefresh: function(opts){
            if(!$base(opts)){
                this.ready();
                return;
            }

            if(!this._schemeOpts){
                var seriesContext = this.getContext().find('series').values();

                this._schemeOpts = {
                    series: []
                };

                for(var i = 0; i < seriesContext.length; i++){
                    var name = seriesContext[i].find('name');

                    this._schemeOpts.series.push({
                        nameSelector: seriesContext[i].find('name'),
                        dataSelector: seriesContext[i].find('data'),
                        //parentSelector: seriesContext[i].find('parent'),
                        seriesNameSelector: seriesContext[i].find('seriesName'),
                        autoSize: seriesContext[i].find('autoSize').checked(),
                        isSum: seriesContext[i].find('isSum').checked()
                    });
                }
            }
// todo: исправить отображение фильтров
/*
            if(!this._resolvePointFilters(this._schemeOpts.bindings)){
                this.ready();
                return;
            }
*/
            var widgetOpts = this._widgetOpts ? undefined : { styleScheme: this.getContext().find('chart colorScheme').value() },
                data = {},
                colorCount = 0;

            this.getElement().loader();

            function fetch(isReset){
                $this.fetch($this._dataSource, { batchSize: 100, reset: isReset, widgetOpts: isReset ? widgetOpts : undefined }, function(res, fail, serverWidgetOpts){
                    try{
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
                            var prevId = undefined;
                            for(var i = 0; i < $this._schemeOpts.series.length; i++){
                                var name = $this._schemeOpts.series[i].nameSelector.value(),
                                    binding = $this._schemeOpts.series[i].nameSelector.binding(),
                                    value = $this._schemeOpts.series[i].dataSelector.value(),
                                    parent = null; // = $this._schemeOpts.series[i].parentSelector.value();

                                var id = name + '|' + binding;

                                if(parent){
                                    //parent += '|' + $this._schemeOpts.series[i].parentSelector.binding();
                                } else if(prevId){
                                    parent = prevId;
                                }

                                if($this._schemeOpts.series[i].skipEmptyNamedGroups && (!name || name.length === 0)){
                                    break;
                                }

                                if(data[id]){
                                    if($this._schemeOpts.series[i].autoSize){
                                        data[id].value++;
                                    } else if($this._schemeOpts.series[i].isSum){
                                        data[id].value += value;
                                    }
                                } else {
                                    var color;

                                    if(i === 0){
                                        if($this._widgetOpts.styleScheme){
                                            color = $this._widgetOpts.styleScheme[colorCount%$this._widgetOpts.styleScheme.length];
                                        } else {
                                            color = Highcharts.getOptions().colors[colorCount%10];
                                        }
                                    }

                                    data[id] = {
                                        datacube: {
                                            binding: binding,
                                        },
                                        color: color,
                                        id: id,
                                        name: name,
                                        parent: parent,
                                        seriesName: $this._schemeOpts.series[i].seriesNameSelector.value(),
                                        value: $this._schemeOpts.series[i].autoSize ? 0 : value
                                    };

                                    i === 0 && colorCount++;
                                }

                                prevId = id;
                            }
                        }

                        fetch();
                    }catch(ex){
                        console.log('Sunburst load data exception');
                        console.log(ex);
                        $this.getElement().loader('hide');
                    }
                });
            }

            function resultProcessing(){
                try{
                    var seriesData = [];

                    for(var i in data){
                        seriesData.push(data[i]);
                    }

                    $this.buildChart(seriesData);
                } catch(ex){
                    console.log('Sunburst processing data exception');
                    console.log(ex);
                } finally{
                    $this.getElement().loader('hide');
                }
                $this.getElement().loader('hide');
            }

            fetch(true);
        },

        _buildChart: function(data){
            var baseChartOpts;

            try{
                if(this._styles){
                    baseChartOpts = this._styles;
                } else {
                    baseChartOpts = $base(data);

                    var levels = baseChartOpts.series;

                    delete baseChartOpts.series;
                    baseChartOpts.series = [levels[0]];

                    this._styles = baseChartOpts;
                }

                var chartOpts = {
                    series: [{
                        type: "sunburst",
                        allowDrillToNode: true,
                        data: data
                    }]
                };

                JSB.merge(true, baseChartOpts, chartOpts);

                for(var i = 0; i < chartOpts.series.length; i++){
                    for(var j in chartOpts.series[i]){
                        baseChartOpts.series[i][j] = chartOpts.series[i][j];
                    }
                }
            } catch(ex){
                console.log('Sunburst build chart exception');
                console.log(ex);
            } finally {
                return baseChartOpts;
            }
        }
    }
}