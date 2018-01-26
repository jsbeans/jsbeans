{
	$name: 'DataCube.Widgets.BubbleChart',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Пузыри',
		description: '',
		category: 'Диаграммы',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9ItCh0LvQvtC5XzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9idWJibGVjaGFydHNfMTQzMzM5Mi5zdmciDQogICB3aWR0aD0iMjAiDQogICBoZWlnaHQ9IjIwIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhMjUiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMyMyIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXcyMSINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBzaG93Z3VpZGVzPSJ0cnVlIg0KICAgICBpbmtzY2FwZTpndWlkZS1iYm94PSJ0cnVlIg0KICAgICBpbmtzY2FwZTp6b29tPSI0MS43MTkzIg0KICAgICBpbmtzY2FwZTpjeD0iMTEuMjYwNjU4Ig0KICAgICBpbmtzY2FwZTpjeT0iOS4yNzE2ODU0Ig0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSLQodC70L7QuV8xIj48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuMjg1OTU0LDE4Ljk4NDAxOSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQxNjgiIC8+PC9zb2RpcG9kaTpuYW1lZHZpZXc+PHN0eWxlDQogICAgIHR5cGU9InRleHQvY3NzIg0KICAgICBpZD0ic3R5bGUzIj4NCgkuc3Qwe2ZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDF7ZmlsbDojMjQ4MTM5O3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDojRjVCRTQwO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDN7ZmlsbDojMzJBOUI4O3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDR7ZmlsbDojQ0YzNzIyO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KPC9zdHlsZT48cG9seWxpbmUNCiAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6NztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJwb2x5bGluZTciDQogICAgIHBvaW50cz0iMzMuOSw1NC42IDMzLjksNDg1LjYgNDczLDQ4NS42ICAiDQogICAgIGNsYXNzPSJzdDAiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGNpcmNsZQ0KICAgICBzdHlsZT0iZmlsbDojMjQ4MTM5O3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjYxNDM4MjM5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMCINCiAgICAgaWQ9ImNpcmNsZTkiDQogICAgIHI9IjIuMTkzMzQ1MSINCiAgICAgY3k9IjE2LjkyODIzIg0KICAgICBjeD0iMi41MDM0Nzk3Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6I2Y1YmU0MDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42MDYzNjY1NztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGUxMSINCiAgICAgcj0iMy4zNDEwNzk3Ig0KICAgICBjeT0iMTEuMjIwMDAyIg0KICAgICBjeD0iNi44ODY0MjkzIg0KICAgICBjbGFzcz0ic3QyIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzMyYTliODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42MzU2ODM4MztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGUxMyINCiAgICAgcj0iMi4wNDY5MDIyIg0KICAgICBjeT0iMTYuMjE5MDk1Ig0KICAgICBjeD0iMTEuOTcxNzEzIg0KICAgICBjbGFzcz0ic3QzIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6I2NmMzcyMjtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42MjU3NDYzNztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGUxNSINCiAgICAgcj0iNC4xMjk5MjYyIg0KICAgICBjeT0iNC45OTkwMjQ5Ig0KICAgICBjeD0iMTIuNjg3ODY5Ig0KICAgICBjbGFzcz0ic3Q0IiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzI0ODEzOTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42NDgwNTYxNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGUxNyINCiAgICAgcj0iMi42Mzc1ODg3Ig0KICAgICBjeT0iMTEuNjgzMTg2Ig0KICAgICBjeD0iMTcuMDA4MTQyIg0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzMyYTliODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42MjI0NTQxNztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGUxOSINCiAgICAgcj0iMS40NDQwOTM3Ig0KICAgICBjeT0iNC45MTIyODcyIg0KICAgICBjeD0iMy41MTAwODM0Ig0KICAgICBjbGFzcz0ic3QzIiAvPjwvc3ZnPg==`,
		thumb: `data:image/png;base64,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`
	},
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            itemType: 'string',
            itemValue: ''
        },
        {
            name: 'Подзаголовок',
            type: 'item',
            key: 'subtitle',
            itemType: 'string',
            itemValue: ''
        },
        {
            type: 'item',
            name: 'Включить легенду',
            key: 'enableLegend',
            optional: true,
            editor: 'none',
        },
        {
            type: 'group',
            name: 'Ось Х',
            key: 'xAxis',
            optional: true,
            editor: 'none',
            items: [
            {
                name: 'Заголовок',
                key: 'header',
                type: 'item',
                itemType: 'string',
            },
            {
                name: 'Формат значений',
                key: 'valuesFormat',
                type: 'item',
                itemType: 'string',
            }
            ]
        },
        {
            type: 'group',
            name: 'Ось Y',
            key: 'yAxis',
            optional: true,
            editor: 'none',
            items: [
            {
                name: 'Заголовок',
                type: 'item',
                key: 'header',
                itemType: 'string'
            },
            {
                name: 'Формат значений',
                key: 'valueFormat',
                type: 'item',
                itemType: 'string',
            }
            ]
        },
        {
            type: 'group',
            name: 'Tooltip',
            key: 'tooltip',
            optional: true,
            editor: 'none',
            items: [
            {
                name: 'Использовать HTML',
                type: 'item',
                key: 'useHtml',
                optional: true,
                editor: 'none'
            },
            {
                name: 'HeaderFormat',
                key: 'headerFormat',
                type: 'item',
                itemType: 'string',
            },
            {
                name: 'PointFormat',
                key: 'pointFormat',
                type: 'item',
                itemType: 'string',
            },
            {
                name: 'FooterFormat',
                key: 'footerFormat',
                type: 'item',
                itemType: 'string',
            },
            {
                name: 'FollowPointer',
                key: 'followPointer',
                type: 'item',
                optional: true,
                editor: 'none'
            }
            ]
        },
        {
            type: 'group',
            name: 'plotOptions',
            key: 'plotOptions',
            optional: true,
            editor: 'none',
            items: [
            {
                type: 'group',
                name: 'series',
                key: 'series',
                items: [
                {
                    name: 'enable',
                    type: 'item',
                    key: 'enable',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'format',
                    key: 'format',
                    type: 'item',
                    itemType: 'string',
                    itemValue: ''
                }
                ]
            }
            ]
        },
        {
            type: 'group',
            name: 'Источник',
            binding: 'array',
            key: 'source',
            items: [
            {
                name: 'Данные',
                type: 'group',
                key: 'data',
                multiple: 'true',
                items: [
                {
                    type: 'select',
                    name: 'Имя поля',
                    key: 'fieldName',
                    itemType: 'string',
                    items: [
                        {
                            type: 'item',
                            name: 'x',
                            key: 'x',
                            editor: 'none'
                        },
                        {
                            type: 'item',
                            name: 'y',
                            key: 'y',
                            editor: 'none'
                        },
                        {
                            type: 'item',
                            name: 'z',
                            key: 'z',
                            editor: 'none'
                        },
                        {
                            type: 'item',
                            name: 'другое',
                            key: 'other',
                            itemType: 'string',
                            itemValue: ''
                        }
                    ]
                },
                {
                    type: 'item',
                    name: 'Поле',
                    key: 'field',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field',
                }
                ]
            }
            ]
        }]
    },
	$client: {
	    $require: ['JQuery.UI.Loader', 'JSB.Tpl.Highstock'],
        $constructor: function(opts){
            var self = this;
            $base(opts);
            this.addClass('highchartsWidget');
            $this.init();
        },

        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.chart){
                        return;
                    }
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 500, 'bcResize' + $this.getId());
            });

            this.isInit = true;
            $this.setInitialized();
        },

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;
            
			$base();

			if(opts && opts.refreshFromCache){
                JSB().deferUntil(function(){
                    var cache = $this.getCache();
                    if(!cache) return;
                    $this._buildChart(cache);
                }, function(){
                    return $this.isInit;
                });
			    return;
			}

            var dataValue = [];
            var dataVal = source.value().get(0).values();
            for(var i = 0; i < dataVal.length; i++){
                var n = dataVal[i].get(0).value().get(0);
                dataValue.push({
                   name: n.value() === null ? n.name() : n.value(),
                   value: dataVal[i].get(1)
                });
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

                    while(source.next()){
                        data.push(dataValue.reduce(function(newObj, el){
                            newObj[el.name] = el.value.value()
                            return newObj;
                        }, {}));
                    }

                    $this._buildChart(data);

                    if(opts && opts.isCacheMod){
                        $this.storeCache(data);
                    }
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data){
            try{
                var chart = {
                    chart: {
                        type: 'bubble',
                        plotBorderWidth: 1,
                        zoomType: 'xy'
                    },
                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    legend: {
                        enabled: this.getContext().find('enableLegend').used()
                    },

                    plotOptions: {
                        bubble: {
                            allowPointSelect: true,
                            point: {
                                events: {
                                    click: function(evt) {
                                        if(JSB().isFunction($this.options.onClick)){
                                            $this.options.onClick.call(this, evt);
                                        }
                                    },
                                    select: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onSelect)){
                                            flag = $this.options.onSelect.call(this, evt);
                                        }
                                        /*
                                        if(!flag){
                                            debugger;
                                            // $this._addNewFilter(evt.target.name);
                                        }
                                        */
                                    },
                                    unselect: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onUnselect)){
                                            flag = $this.options.onUnselect.call(this, evt);
                                        }
                                        /*
                                        if(!flag && $this._currentFilter && !$this._notNeedUnselect){
                                            $this._notNeedUnselect = false;
                                            $this.removeFilter($this._currentFilter);
                                            $this.refreshAll();
                                        }
                                        */
                                    },
                                    mouseOut: function(evt) {
                                        if(JSB().isFunction($this.options.mouseOut)){
                                            $this.options.mouseOut.call(this, evt);
                                        }
                                    },
                                    mouseOver: function(evt) {
                                        if(JSB().isFunction($this.options.mouseOver)){
                                            $this.options.mouseOver.call(this, evt);
                                        }
                                    }
                                }
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },

                    series: [{
                        data: data
                    }]
                };

                // xAxis
                var x = this.getContext().find('xAxis');
                if(x.used()){
                    x = x.value();

                    chart.xAxis = {
                        title: {
                          text: x.get(0).value()
                        },
                        labels: {
                          format: x.get(1).value()
                        }
                    }
                }

                // yAxis
                var x = this.getContext().find('yAxis');
                if(x.used()){
                    x = x.value();

                    chart.yAxis = {
                        title: {
                          text: x.get(0).value()
                        },
                        labels: {
                          format: x.get(1).value()
                        }
                    }
                }

                // tooltip
                var x = this.getContext().find('tooltip');
                if(x.used()){
                    x = x.value();

                    chart.tooltip = {
                        useHTML: x.get(0).used(),
                        headerFormat: x.get(1).value(),
                        pointFormat: x.get(2).value(),
                        footerFormat: x.get(3).value(),
                        followPointer: x.get(4).used()
                    };
                }

                // plotOptions
                var x = this.getContext().find('plotOptions');
                if(x.used()){
                    x = x.find('series').value();

                    chart.plotOptions.series = {
                            dataLabels: {
                                enabled: x.get(0).used(),
                                format: x.get(1).value()
                            }
                    };
                }
            } catch(ex){
                console.log(ex);
                return;
            } finally{
                $this.getElement().loader('hide');
            }

            $this.container.highcharts(chart);
            $this.chart =  $this.container.highcharts();
        },

        // events
        _addNewFilter: function(){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;
        }
	}
}