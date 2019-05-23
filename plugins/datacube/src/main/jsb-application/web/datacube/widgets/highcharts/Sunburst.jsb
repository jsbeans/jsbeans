/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
    $name: 'DataCube.Widgets.Sunburst',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $expose: {
        name: 'Солнечные лучи',
        description: '',
        category: 'Диаграммы',
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB3aWR0aD0iMjc3MS44NTg2IiBoZWlnaHQ9IjI3NzEuODU4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxkZWZzPgogIDxmaWx0ZXIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBoZWlnaHQ9IjEuNjg1NzE0IiB5PSItMC4zNDI4NTciIHdpZHRoPSIxLjY4NTcxNCIgeD0iLTAuMzQyODU3IiBpZD0iZmlsdGVyNTQ5OCI+CiAgIDxmZUdhdXNzaWFuQmx1ciBpZD0iZmVHYXVzc2lhbkJsdXI1NTAwIiBzdGREZXZpYXRpb249Ijg2LjEyMjQ0NSIvPgogIDwvZmlsdGVyPgogIDxyYWRpYWxHcmFkaWVudCByPSIxIiBjeT0iMC41IiBjeD0iMC41IiBzcHJlYWRNZXRob2Q9InBhZCIgaWQ9InN2Z183Ij4KICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmZjAwIi8+CiAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0ibm9uZSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiA8L2RlZnM+CiA8bWV0YWRhdGEgaWQ9Im1ldGFkYXRhNDc2OCI+aW1hZ2Uvc3ZnK3htbDwvbWV0YWRhdGE+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDg5MSIgZD0ibTEyNzIuNzkyMjM2LDI3NzEuODU4ODg3bDIyNi4yNzQxNywwbC0xMTMuMTM3MDg1LC0xNDM2Ljg0MDgybC0xMTMuMTM3MDg1LDE0MzYuODQwODJ6bTAsLTI3NzEuODU4NjQzbDIyNi4yNzQxNywwbC0xMTMuMTM3MDg1LDE0MzYuODQxMDY0bC0xMTMuMTM3MDg1LC0xNDM2Ljg0MTA2NHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0ODk1IiBkPSJtOTE3Ljk0MjM4MywyNjk1LjM1MjA1MWwyMTguNTYzOTY1LDU4LjU2Mzk2NWwyNjIuNTk5ODU0LC0xNDE3LjE2NDA2M2wtNDgxLjE2MzgxOCwxMzU4LjYwMDA5OHptNzE3LjQwOTc5LC0yNjc3LjQwOTkxMmwyMTguNTY0MDg3LDU4LjU2NDIwOWwtNDgxLjE2Mzk0LDEzNTguNTk5NjA5bDI2Mi41OTk4NTQsLTE0MTcuMTYzODE4eiIvPgogIDxwYXRoIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0idXJsKCNzdmdfNykiIHN0cm9rZT0iI2ZmZmZmZiIgaWQ9InVzZTQ4OTkiIGQ9Im01OTQuOTg0OTg1LDI1MjkuNjEwODRsMTk1Ljk1OTIyOSwxMTMuMTM3MjA3bDYyMC40NDA5MTgsLTEzMDAuOTA5NjY4bC04MTYuNDAwMTQ2LDExODcuNzcyNDYxem0xMzg1LjkyOTMyMSwtMjQwMC41bDE5NS45NTkyMjksMTEzLjEzNzIwN2wtODE2LjQwMDE0NiwxMTg3Ljc3MjQ2MWw2MjAuNDQwOTE4LC0xMzAwLjkwOTY2OHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTAzIiBkPSJtMzI1LjkyOTMyMSwyMjg1LjkyOTE5OWwxNjAsMTYwbDkzNi4wMDAxMjIsLTEwOTZsLTEwOTYuMDAwMTIyLDkzNnptMTk1OS45OTk4NzgsLTE5NjBsMTYwLDE2MGwtMTA5NS45OTk4NzgsOTM2bDkzNS45OTk4NzgsLTEwOTZ6Ii8+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDkwNyIgZD0ibTEyOS4xMTMxNTksMTk4MC45MTQwNjNsMTEzLjEzMDEyNywxOTUuOTU5OTYxbDExODcuNzc5OTA3LC04MTYuNDAwMzkxbC0xMzAwLjkxMDAzNCw2MjAuNDQwNDN6bTI0MDAuNDk4MTY5LC0xMzg1LjkzMDE3NmwxMTMuMTM2NDc1LDE5NS45NTk5NjFsLTEzMDAuOTA0NjYzLDYyMC40Mzk5NDFsMTE4Ny43NjgxODgsLTgxNi4zOTk5MDJsMCwweiIvPgogIDxwYXRoIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0idXJsKCNzdmdfNykiIHN0cm9rZT0iI2ZmZmZmZiIgaWQ9InVzZTQ5MTEiIGQ9Im0xNy45NDMyMzcsMTYzNS4zNTQwMDRsNTguNTYwMDU5LDIxOC41NjAwNTlsMTM1OC41OTk4NTQsLTQ4MS4xNjAxNTZsLTE0MTcuMTU5OTEyLDI2Mi42MDAwOTh6bTI2NzcuNDA5MDU4LC03MTcuNDEwMTU2bDU4LjU2MzcyMSwyMTguNTYwMDU5bC0xNDE3LjE2Mjg0MiwyNjIuNTk5NjA5bDEzNTguNTk4ODc3LC00ODEuMTU5NjY4bDAuMDAwMjQ0LDB6Ii8+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDkxNSIgZD0ibTAuMDAzMjk2LDEyNzIuNzkzOTQ1bDAsMjI2LjI3MDAybDE0MzYuODM5ODQ0LC0xMTMuMTMwMzcxbC0xNDM2LjgzOTg0NCwtMTEzLjEzOTY0OHptMjc3MS44NTUxMDMsMGwwLDIyNi4yNzAwMmwtMTQzNi44NDUyMTUsLTExMy4xMzAzNzFsMTQzNi44NDUyMTUsLTExMy4xMzk2NDhsMCwweiIvPgogIDxwYXRoIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0idXJsKCNzdmdfNykiIHN0cm9rZT0iI2ZmZmZmZiIgaWQ9InVzZTQ5MTkiIGQ9Im03Ni41MDMyOTYsOTE3Ljk0Mzg0OGwtNTguNTYwMDU5LDIxOC41NjAwNTlsMTQxNy4xNTk5MTIsMjYyLjU5OTYwOWwtMTM1OC41OTk4NTQsLTQ4MS4xNTk2Njh6bTI2NzcuNDEyOTY0LDcxNy40MTAxNTZsLTU4LjU2NDIwOSwyMTguNTYwMDU5bC0xMzU4LjU5ODg3NywtNDgxLjE2MDE1NmwxNDE3LjE2MzA4NiwyNjIuNjAwMDk4bDAsMHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTIzIiBkPSJtMjQyLjI0MzI4Niw1OTQuOTgzODg3bC0xMTMuMTMwMTI3LDE5NS45NTk5NjFsMTMwMC45MTAwMzQsNjIwLjQzOTk0MWwtMTE4Ny43Nzk5MDcsLTgxNi4zOTk5MDJ6bTI0MDAuNTA0NTE3LDEzODUuOTMwMTc2bC0xMTMuMTM2NDc1LDE5NS45NTk5NjFsLTExODcuNzY4MTg4LC04MTYuNDAwMzkxbDEzMDAuOTA0NjYzLDYyMC40NDA0M2wwLDB6Ii8+CiAgPHBhdGggc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSJ1cmwoI3N2Z183KSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0idXNlNDkyNyIgZD0ibTQ4NS45MzMyMjgsMzI1LjkzMzgzOGwtMTYwLDE2MGwxMDk2LDkzNi4wMDAyNDRsLTkzNiwtMTA5Ni4wMDAyNDR6bTE5NTkuOTk1OTcyLDE5NjAuMDAwMjQ0bC0xNjAsMTYwbC05MzUuOTk1OTcyLC0xMDk2LjAwMDQ4OGwxMDk1Ljk5NTk3Miw5MzYuMDAwNDg4bDAsMHoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTMxIiBkPSJtNzkwLjk0NDMzNiwxMjkuMTEwODRsLTE5NS45NTkxMDYsMTEzLjEzNzIwN2w4MTYuNDAwMDI0LDExODcuNzcyNDYxbC02MjAuNDQwOTE4LC0xMzAwLjkwOTY2OHptMTM4NS45MjkxOTksMjQwMC41bC0xOTUuOTU4OTg0LDExMy4xMzcyMDdsLTYyMC40NDEwNCwtMTMwMC45MDk2NjhsODE2LjQwMDAyNCwxMTg3Ljc3MjQ2MXoiLz4KICA8cGF0aCBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjc3ZnXzcpIiBzdHJva2U9IiNmZmZmZmYiIGlkPSJ1c2U0OTM1IiBkPSJtMTEzNi41MDY0NywxNy45NDIzODNsLTIxOC41NjQwODcsNTguNTYzOTY1bDQ4MS4xNjM5NCwxMzU4LjYwMDA5OGwtMjYyLjU5OTg1NCwtMTQxNy4xNjQwNjN6bTcxNy40MDk3OSwyNjc3LjQxMDE1NmwtMjE4LjU2NDA4Nyw1OC41NjM5NjVsLTI2Mi41OTk4NTQsLTE0MTcuMTY0MDYzbDQ4MS4xNjM5NCwxMzU4LjYwMDA5OHoiLz4KICA8cGF0aCBmaWxsPSIjZjhmNmFlIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iNCIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZpbHRlcj0idXJsKCNmaWx0ZXI1NDk4KSIgaWQ9InBhdGg0NzczIiBkPSJtMTY4Ny4zNTc5MSwxMzUwLjQ3MzI2N2MwLDE2Ni40NzQzNjUgLTEzNC45NTQyMjQsMzAxLjQyODU4OSAtMzAxLjQyODU4OSwzMDEuNDI4NTg5Yy0xNjYuNDc0MzY1LDAgLTMwMS40Mjg0NjcsLTEzNC45NTQyMjQgLTMwMS40Mjg0NjcsLTMwMS40Mjg1ODljMCwtMTY2LjQ3NDQ4NyAxMzQuOTU0MTAyLC0zMDEuNDI4NTg5IDMwMS40Mjg0NjcsLTMwMS40Mjg1ODljMTY2LjQ3NDM2NSwwIDMwMS40Mjg1ODksMTM0Ljk1NDEwMiAzMDEuNDI4NTg5LDMwMS40Mjg1ODl6Ii8+CiA8L2c+Cjwvc3ZnPg=='
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