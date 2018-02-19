{
	$name: 'DataCube.Widgets.PieChart',
	//$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Круговая диаграмма',
		description: '',
		category: 'Диаграммы',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9IndpZGdldHMuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNDEiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMzOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXczNyINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIyNC42Nzk3MzgiDQogICAgIGlua3NjYXBlOmN4PSIxOC45NTU3OTMiDQogICAgIGlua3NjYXBlOmN5PSIxMC43MjYzOTEiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz48Zw0KICAgICBpZD0iZzQyMTYiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDIuOTk1MDA4MywwLDAsMi45OTUwMDgzLC01LjIyNDg4MywtNzIuMzg5NTk0KSI+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ0NzgyMTtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDcuNjkwNjA1LDI1LjU1MTk2IGMgLTAuODE5NTkyLDAuNjEzNjc1IC0xLjYyODk5LDEuMjIxMjMzIC0yLjQ2Mjg1NCwxLjg0NTEwMSBsIDAsLTMuMTYyMTU3IGMgMC43NDYxOTYsLTAuMDczNCAyLjAyNjU1MywwLjYwNTUyIDIuNDYyODU0LDEuMzE3MDU2IHoiDQogICAgICAgaWQ9InBhdGg4LTctMiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6IzAwNjY4MDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDQuNzIzMDY2MywyNC41MDAyNDQgMCwxLjg2NTQ4OSBjIDAsMC4zODk0MDggLTAuMDA2MSwwLjc4MDg1NSAwLjAwNDEsMS4xNzAyNjMgMC4wMDIsMC4wOTc4NiAwLjAzMDU4LDAuMjA1OTE4IDAuMDgzNTksMC4yODc0NjkgMC40ODMxOTMsMC43NjI1MDYgMC45NzY1NzksMS41MTg4OTYgMS40NjM4NDksMi4yNzczMjQgbCAwLjE3NzM3NCwwLjI3NTIzNiBjIC0wLjg2ODUyMywwLjU1MjUxMSAtMi4yNzkzNjMsMC42MTU3MTQgLTMuMzcyMTUyLC0wLjE3NTMzNSAtMS4xMTExNiwtMC44MDMyODIgLTEuNTgyMTIsLTIuMjE2MTYxIC0xLjE3MDI4NSwtMy41MTA3OSAwLjM5NTUyNCwtMS4yNDk3NzYgMS41NzM5NDMsLTIuMTczMzQ2IDIuODEzNTI0LC0yLjE4OTY1NiB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItOSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjIg0KICAgICAgIHN0eWxlPSJmaWxsOiNhYTQ0MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgZD0ibSA3LjAyMTE5OTYsMzAuNDAyMzgzIGMgLTAuNTQ0MzU2LC0wLjg0NDA1NyAtMS4wODg3MTIsLTEuNjg4MTE1IC0xLjY0MTIyMywtMi41NDIzNjYgMC44NTgzMjksLTAuNjQyMjE4IDEuNzAyMzg3LC0xLjI3NDI0MSAyLjU0ODQ4MywtMS45MDgzMDQgMC44NjAzNjgsMS4yODY0NzQgMC41OTUzMjUsMy40MDA2OTUgLTAuOTA3MjYsNC40NTA2NyB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTItNSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvZz48Zw0KICAgICBpZD0iZzciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9Imc5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzE1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PC9zdmc+`,
		thumb: `data:image/png;base64,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
		32D87wCdIs7XaNuRKgAAAABJRU5ErkJggg==`
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
            type: 'group',
            name: 'Источник',
            binding: 'array',
            key: 'source',
            collapsable: true,
            items: [
            {
                name: 'Имя',
                type: 'item',
                key: 'name',
                itemType: 'string',
                itemValue: ''
            },
            {
                name: 'Данные',
                type: 'group',
                key: 'data',
                multiple: 'true',
                items: [
                {
                    type: 'item',
                    name: 'Имена частей',
                    key: 'partName',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field',
                },
                {
                    type: 'item',
                    name: 'Размеры частей',
                    key: 'partSize',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field',
                }
                ]
            }
            ]
        },
        // Легенда
        {
            name: 'Легенда',
            type: 'group',
            key: 'legend',
            items: [
            {
                name: 'Расположение',
                type: 'select',
                key: 'layout',
                items: [
                {
                    name: 'Горизонтальное',
                    type: 'item',
                    key: 'horizontal',
                    editor: 'none',
                    itemValue: 'horizontal'
                },
                {
                    name: 'Вертикальное',
                    type: 'item',
                    key: 'vertical',
                    editor: 'none',
                    itemValue: 'vertical'
                }
                ]
            },
            {
                name: 'Горизонтальное выравнивание',
                type: 'select',
                key: 'align',
                items: [
                {
                    name: 'По центру',
                    type: 'item',
                    key: 'center',
                    editor: 'none',
                    itemValue: 'center'
                },
                {
                    name: 'По левому краю',
                    type: 'item',
                    key: 'left',
                    editor: 'none',
                    itemValue: 'left'
                },
                {
                    name: 'По правому краю',
                    type: 'item',
                    key: 'right',
                    editor: 'none',
                    itemValue: 'right'
                }
                ]
            },
            {
                name: 'Вертикальное выравнивание',
                type: 'select',
                key: 'verticalAlign',
                items: [
                {
                    name: 'По нижнему краю',
                    type: 'item',
                    key: 'bottom',
                    editor: 'none',
                    itemValue: 'bottom'
                },
                {
                    name: 'По центру',
                    type: 'item',
                    key: 'middle',
                    editor: 'none',
                    itemValue: 'middle'
                },
                {
                    name: 'По верхнему краю',
                    type: 'item',
                    key: 'top',
                    editor: 'none',
                    itemValue: 'top'
                }
                ]
            }
            ]
        },
        // Подписи
        {
            type: 'group',
            name: 'Подписи',
            key: 'dataLabels',
            collapsable: true,
            collapsed: true,
            items: [
            {
                name: 'Включить подпись',
                type: 'item',
                key: 'enabled',
                optional: true,
                editor: 'none'
            },
            {
                name: 'Формат подписи',
                type: 'item',
                key: 'format',
                itemType: 'string',
                itemValue: '{y}',
                description: 'В качестве переменных в строке можно использовать имя {point.name} и значение {y}'
            },
            {
                name: 'Расстояние от окружности',
                type: 'item',
                key: 'distance',
                itemType: 'string',
                itemValue: '30',
                description: 'Положительное значение указывает расстояние снаружи окружности, отрицательное - внутри'
            }
            ]
        },
        {
            name: 'Диаметр внутреннего круга',
            type: 'item',
            key: 'innerSize',
            itemType: 'string',
            itemValue: '0',
            description: 'Диаметр внутреннего круга. По умолчанию 0. Диаметр больше 0 делает диаграмму вида бублика. Указывается числовое или процентное значение'
        }
        ]
    },
	$client: {
	    $require: ['JQuery.UI.Loader', 'JSB.Tpl.Highstock'],

	    _series: {},
	    _curFilters: {},
	    _removedFiltersCnt: 0,
	    _curFilterHash: null,

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
                }, 500, 'hcResize' + $this.getId());
            });

            this.isInit = true;
            $this.setInitialized();
        },

        refresh: function(opts){
return;
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.hasBinding()) return;
            
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

// filters section
            var globalFilters = source.getFilters();

            if(globalFilters){
                var binding = source.value().get(1).value().get(0).binding()[0],
                    newFilters = {};

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding && cur.op === '$eq'){
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
/*
                if(Object.keys(globalFilters).length === 0) globalFilters = null;

                if(globalFilters && this.createFilterHash(globalFilters) === this._curFilterHash || !globalFilters && !this._curFilterHash){ // update data not require
                    return;
                } else {
                    this._curFilterHash = globalFilters ? this.createFilterHash(globalFilters) : undefined;
                }
*/
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
// end filters section
            var dataValues = this.getContext().find('data').values(),
                dataSource = [];
            for(var i = 0; i < dataValues.length; i++){
                dataSource.push({
                    name: dataValues[i].get(0),
                    bName: dataValues[i].get(0).binding()[0],
                    y: dataValues[i].get(1),
                    bY: dataValues[i].get(1).binding()[0]
                });
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

                    while(source.next()){
                        for(var i = 0; i < dataSource.length; i++){
                            var d = {
                                name: dataSource[i].name.value(),
                                y: dataSource[i].y.value(),
                                sortField: dataSource[i].bName ? dataSource[i].bName : dataSource[i].bY ? dataSource[i].bY : null,
                                sortValue: dataSource[i].bName ?  dataSource[i].name.value() : dataSource[i].bY ? dataSource[i].y.value() : null
                            }

                            if(JSB().isArray(d.name)){
                                for(var j = 0; j < d.name.length; j++){
                                    data.push({
                                        name: d.name[j],
                                        y: d.y[j],
                                        sortField: d.bName ? d.bName : d.bY ? d.bY : null,
                                        sortValue: d.bName ? d.name[j] : d.bY ? d.y[j] : null,
                                    });
                                }
                            } else {
                                data.push(d);
                            }
                        }
                    }

                    $this._series = data.reduce(function(arr, el, i){
                        arr[el.name] = i;
                        return arr;
                    }, {});

                    if(opts && opts.isCacheMod){
                        $this.storeCache(data);
                    }

                    $this._buildChart(data);

                    var points = $this.chart.series[0].points;
                    for(var i in $this._curFilters){
                        for(var j = 0; j < points.length; j++){
                            if(i === points[j].name){
                                points[j].select(true, true);
                                break;
                            }
                        }
                    }
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data){
            var chartOptions = {
                chart: {
                    type: 'pie'
                },

                title: {
                    text: this.getContext().find('title').value()
                },

                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: this.getContext().find('dataLabels').find('enabled').used(),
                            format: this.getContext().find('dataLabels').find('format').value(),
                            distance: Number(this.getContext().find('dataLabels').find('distance').value())
                        },
                        showInLegend: true
                    }
                },

                credits: {
                    enabled: false
                },

                legend: {
                    layout: this.getContext().find('legend').find('layout').value().value(),
                    align: this.getContext().find('legend').find('align').value().value(),
                    verticalAlign: this.getContext().find('legend').find('verticalAlign').value().value()
                },

                series: [{
                    data: data,
                    colorByPoint: true,
                    innerSize: this.getContext().find('innerSize').value(),
                    point: {
                        events: {
                            click: function(evt) {
                                $this._clickEvt = evt;

                                if(JSB().isFunction($this.options.onClick)){
                                    $this.options.onClick.call(this, evt);
                                }
                            },
                            select: function(evt) {
                                var flag = false;

                                if(JSB().isFunction($this.options.onSelect)){
                                    flag = $this.options.onSelect.call(this, evt);
                                }

                                if(!flag && $this._clickEvt){
                                    $this._addPieFilter(evt);
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
                }]
            };

            // todo: distance after resize
            /*
            var dataLabelsDistance = this.getContext().find('dataLabels').find('distance').value();
            if(dataLabelsDistance.indexOf('%') > -1){
                dataLabelsDistance = Number(dataLabelsDistance.slice(0, dataLabelsDistance.indexOf('%')));

                var w = $this.getElement().width(),
                    h = $this.getElement().height();

                dataLabelsDistance = w <= h ? dataLabelsDistance * w / 100 : dataLabelsDistance * h / 100;
            } else {
                dataLabelsDistance = Number(dataLabelsDistance);
            }
            chartOptions.plotOptions.pie.dataLabels.distance = dataLabelsDistance;
            */

            $this.container.highcharts(chartOptions);

            $this.getElement().loader('hide');

            $this.chart =  $this.container.highcharts();
        },

        _addPieFilter: function(evt){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var fDesc = {
            	sourceId: context.source,
            	type: '$or',
            	op: '$eq',
            	field: evt.target.options.sortField,
            	value: evt.target.options.sortValue
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
        }
	}
}