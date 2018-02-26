{
    $name: 'DataCube.Widgets.PieChart',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $expose: {
        name: 'Круговая диаграмма',
        description: '',
        category: 'Диаграммы',
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9IndpZGdldHMuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNDEiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMzOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXczNyINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIyNC42Nzk3MzgiDQogICAgIGlua3NjYXBlOmN4PSIxOC45NTU3OTMiDQogICAgIGlua3NjYXBlOmN5PSIxMC43MjYzOTEiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz48Zw0KICAgICBpZD0iZzQyMTYiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDIuOTk1MDA4MywwLDAsMi45OTUwMDgzLC01LjIyNDg4MywtNzIuMzg5NTk0KSI+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ0NzgyMTtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDcuNjkwNjA1LDI1LjU1MTk2IGMgLTAuODE5NTkyLDAuNjEzNjc1IC0xLjYyODk5LDEuMjIxMjMzIC0yLjQ2Mjg1NCwxLjg0NTEwMSBsIDAsLTMuMTYyMTU3IGMgMC43NDYxOTYsLTAuMDczNCAyLjAyNjU1MywwLjYwNTUyIDIuNDYyODU0LDEuMzE3MDU2IHoiDQogICAgICAgaWQ9InBhdGg4LTctMiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzAwNjY4MDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDQuNzIzMDY2MywyNC41MDAyNDQgMCwxLjg2NTQ4OSBjIDAsMC4zODk0MDggLTAuMDA2MSwwLjc4MDg1NSAwLjAwNDEsMS4xNzAyNjMgMC4wMDIsMC4wOTc4NiAwLjAzMDU4LDAuMjA1OTE4IDAuMDgzNTksMC4yODc0NjkgMC40ODMxOTMsMC43NjI1MDYgMC45NzY1NzksMS41MTg4OTYgMS40NjM4NDksMi4yNzczMjQgbCAwLjE3NzM3NCwwLjI3NTIzNiBjIC0wLjg2ODUyMywwLjU1MjUxMSAtMi4yNzkzNjMsMC42MTU3MTQgLTMuMzcyMTUyLC0wLjE3NTMzNSAtMS4xMTExNiwtMC44MDMyODIgLTEuNTgyMTIsLTIuMjE2MTYxIC0xLjE3MDI4NSwtMy41MTA3OSAwLjM5NTUyNCwtMS4yNDk3NzYgMS41NzM5NDMsLTIuMTczMzQ2IDIuODEzNTI0LC0yLjE4OTY1NiB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItOSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjIg0KICAgICAgIHN0eWxlPSJmaWxsOiNhYTQ0MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgZD0ibSA3LjAyMTE5OTYsMzAuNDAyMzgzIGMgLTAuNTQ0MzU2LC0wLjg0NDA1NyAtMS4wODg3MTIsLTEuNjg4MTE1IC0xLjY0MTIyMywtMi41NDIzNjYgMC44NTgzMjksLTAuNjQyMjE4IDEuNzAyMzg3LC0xLjI3NDI0MSAyLjU0ODQ4MywtMS45MDgzMDQgMC44NjAzNjgsMS4yODY0NzQgMC41OTUzMjUsMy40MDA2OTUgLTAuOTA3MjYsNC40NTA2NyB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItNSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvZz48Zw0KICAgICBpZD0iZzciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9Imc5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzE1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PC9zdmc+',
        thumb: 'data:image/png;base64,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'
    },
    $scheme: {
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
                        partNames: {
                            render: 'dataBinding',
                            name: 'Имена частей',
                            linkTo: 'source'
                        },
                        partData: {
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
                            valueType: 'string',
                            defaultValue: '0'
                        },
                        dataLabels: {
                            render: 'group',
                            name: 'Подпись',
                            collapsable: true,
                            items: {
                                color: {
                                    render: 'item',
                                    name: 'Цвет',
                                    editor: 'JSB.Widgets.ColorEditor'
                                },
                                distance: {
                                    render: 'item',
                                    name: 'Расстояние от центра',
                                    valueType: 'number',
                                    defaultValue: 30
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
                        allowPointSelect: {
                            render: 'item',
                            name: 'Разрешить события',
                            optional: true,
                            editor: 'none'
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
        }
    },
    $client: {
	    _series: {},
	    _curFilters: {},
	    _removedFiltersCnt: 0,
	    _curFilterHash: null,

        refresh: function(opts){
            var dataSource = $base(opts);
            if(!dataSource){
                return;
            }

            // filters section
            var globalFilters = this.getSourceFilters(dataSource),
                seriesContext = this.getContext().find('series').values();
//debugger;
            if(globalFilters){
                var binding = [],
                    newFilters = {};

                for(var i = 0; i < seriesContext.length; i++){
                    binding.push(seriesContext[i].find('partNames').binding());
                }

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(binding.indexOf(cur.field) > -1  && cur.op === '$eq'){
                        if(!this._curFilters[cur.value]){
                            this._curFilters[cur.value] = cur.id;
                            this.chart.series[0].data[this._series[cur.value]].select(true, true);
                        }

                        newFilters[cur.value] = true;

                        delete globalFilters[i];
                    }
                }

                for(var i in this._curFilters){
                    if(!newFilters[i]){
                        this._removedFiltersCnt++;
                        this.chart.series[0].data[this._series[i]].select(false, true);
                        delete this._curFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length > 0 && this.createFilterHash(globalFilters) === this._curFilterHash || Object.keys(globalFilters).length === 0 && !this._curFilterHash){ // update data not require
                    return;
                } else {
                    this._curFilterHash = Object.keys(globalFilters).length > 0 ? this.createFilterHash(globalFilters) : undefined;
                    source.setFilters(globalFilters);
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    this._removedFiltersCnt = Object.keys(this._curFilters).length;
                    for(var i in this._curFilters){
                        this.chart.series[0].data[this._series[i]].select(false, true);
                    }
                    this._curFilters = {};
                    return;
                }
                this._curFilterHash = null;
            }

            var series = [];

            for(var i = 0; i < seriesContext.length; i++){
                series.push({
                    partNames: seriesContext[i].find('partNames'),
                    partData: seriesContext[i].find('partData'),
                    data: []
                });
            }

            this.getElement().loader();
            this.fetchBinding(dataSource, { readAll: true, reset: true }, function(res){
                try {
                    while(dataSource.next()){
                        for(var i = 0; i < series.length; i++){
                            series[i].data.push({
                                binding: series[i].partNames.binding(),
                                name: series[i].partNames.value(),
                                y: series[i].partData.value()
                            });
                        }
                    }

                    if(opts && opts.isCacheMod){
                        $this.storeCache(series);
                    }

                    $this.buildChart(series);

                    for(var i in $this._curFilters){
                        for(var j = 0; j < $this.chart.series.length; j++){
                            for(var k = 0; k < $this.chart.series[j].points.length; k++){
                                if(i === $this.chart.series[j].points[k].name){
                                    $this.chart.series[j].points[k].select(true, true);
                                    break;
                                }
                            }
                        }
                    }
                } catch (ex){
                    console.log('PieChart load data exception');
                    console.log(ex);
                } finally {
                    $this.getElement().loader('hide');
                }
            });
        },

        _buildChart: function(data){
            var baseChartOpts = $base();

            try {
                var seriesContext = this.getContext().find('series').values()
                    plotOptionsContext = this.getContext().find('plotOptions pie'),
                    series = [];

                for(var i = 0; i < seriesContext.length; i++){
                    series.push({
                        data: data[i].data,
                        size: seriesContext[i].find('size').value(),
                        innerSize: seriesContext[i].find('innerSize').value(),
                        dataLabels: {
                            color: seriesContext[i].find('dataLabels color').value(),
                            distance: seriesContext[i].find('dataLabels distance').value()
                        },
                        tooltip: {
                            valueDecimals: seriesContext[i].find('tooltip valueDecimals').value(),
                            valuePrefix: seriesContext[i].find('tooltip valuePrefix').value(),
                            valueSuffix: seriesContext[i].find('tooltip valueSuffix').value()
                        },
                        cursor: seriesContext[i].find('allowPointSelect').checked() ? 'pointer' : undefined,
                        allowPointSelect: seriesContext[i].find('allowPointSelect').checked(),
                        visible: seriesContext[i].find('visible').checked()
                    });
                }

                var chartOpts = {
                    chart: {
                        type: 'pie'
                    },

                    plotOptions: {
                        pie: {
                            showInLegend: this.getContext().find('legend enabled').checked()
                        },
                        series: {
                            point: {
                                events: {
                                    select: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onSelect)){
                                            flag = $this.options.onSelect.call(this, evt);
                                        }

                                        if(!flag && $this._clickEvt){
                                            $this._addNewFilter(evt);
                                            $this._clickEvt = null;
                                        }
                                    },
                                    unselect: function(evt) {
                                        $this._clickEvt = null;
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onUnselect)){
                                            flag = $this.options.onUnselect.call(this, evt);
                                        }

                                        if(!flag && $this._removedFiltersCnt === 0){
                                            if(Object.keys($this._curFilters).length > 0){
                                                if(evt.accumulate){
                                                    $this.removeFilter($this._curFilters[evt.target.options.sortValue]);
                                                    delete $this._curFilters[evt.target.options.sortValue];
                                                    $this.refreshAll();
                                                } else {
                                                    for(var i in $this._curFilters){
                                                        $this.removeFilter($this._curFilters[i]);
                                                    }
                                                    $this._curFilters = {};
                                                    $this.refreshAll();
                                                }
                                            }
                                        } else {
                                            $this._removedFiltersCnt--;
                                        }
                                    }
                                }
                            }
                        }
                    },

                    series: series
                }

                JSB.merge(true, baseChartOpts, chartOpts);
            } catch(ex){
                console.log('PieChart build chart exception');
                console.log(ex);
            } finally {
                return baseChartOpts;
            }
        },

        _addNewFilter: function(evt){
            var context = this.getContext().find('source').binding();
            if(!context.source) {
                return;
            }

            var fDesc = {
            	sourceId: context.source,
            	type: '$or',
            	op: '$eq',
            	field: evt.target.options.binding,
            	value: evt.target.options.name
            };

            if(!evt.accumulate && Object.keys(this._curFilters).length > 0){
                this._removedFiltersCnt = Object.keys(this._curFilters).length;

                for(var i in this._curFilters){
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};
            }

            this._curFilters[evt.target.options.sortValue] = this.addFilter(fDesc);
            this.refreshAll();
        },

        _select: function(val, b1, b2){
            for(var j = 0; j < this.chart.series.length; j++){
                for(var k = 0; k < this.chart.series[j].points.length; k++){
                    if(val === this.chart.series[j].points[k].name){
                        this.chart.series[j].points[k].select(b1, b2);
                        break;
                    }
                }
            }
        }
    }
}