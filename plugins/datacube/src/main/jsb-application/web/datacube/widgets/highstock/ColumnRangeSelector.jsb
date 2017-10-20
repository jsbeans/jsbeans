{
	$name: 'DataCube.Widgets.ColumnRangeSelector',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Временной диапазон',
		description: '',
		category: 'Диаграммы',
		thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAACcJJREFUeF7tXPlz28YZ1d+e/tJ2mnTSJE2PND1+6LQZp5nWsRsn1n1SokRSlMRbPMWbIAkQF0np9Xsr0pZt6LJoC3LxZr4BsPvtfsfbXSwASnPj8RiB+Efm8EBg6F0Mx2fQNA2m0UepciJluqprNWrQBxbO1NU5DMM4P+oGTkcubHeIs7NTDIyBKvcrHgwhy8+fYDO8j6+//Axrq+tYDoURDYdV3c7GGuYXnmFvP45IJIbd3V0sL8yjUKmhUytgYXkdsXgc8WgEPzz+D2KHaeyFt7G2uIiV1TWsbIRUP37AgyGkUCggHtlBvaVhbWkFzimwt70F2xmiXi1gZ3cHR6kUDg+TODo8QDKZQDZXlJZnCG3v4DiXQSqZxF5oS4iNSX95ZOU6GouidFI7N+IDPBhC/l8QEOIzBIT4DAEhPkNAiM8QEOIzBIT4DAEhPkNAiM8wNxqNEIh/JJghPkNAiM8QEOIzBIT4DAEhPkNAiM8QEOIzBIT4DAEhgsWMBYPfhH2AgBDBb9d6aA3Gk6v3j9MLP5cJXp2IfLHaRb3neta9D/l4UUPPPLcfzBDBfc+QTxa7GLjnS2ZAiCAgxGcICPEZHjwhffsUo4tbgweO+yJkOWsh1x5eTchofHatc3/a7KPSG02uHi5OJIZU0703Qr7bNxCvuoqQttjfytuYI0tT1PQxyt0Rfrfem5R4ww+EcILao7vN0nDJwZPDgS8IYT5/s9zF3K+XukjUXWRbQ3wliY5UHN8R4sqsLWqv2uP1X0L9ydXtQCIZp28JmU+ZWD+2b03IZbcRRwLmfWZWYLKYtIuYErIiM3w193KWX4Yz8ZVCdMwxPl/p3oiQP2xcnYu3gfo7F/PUm5BP5Cnxp4SB1ayJP4rxcNHEl2vdF0+R1f4IzvDVJ8uvRK/YcfDRs84r5VOJVSw8iuiedddJtevgeWoAyxnCndjlUzSfpg9rttg9f6I9bjn481YPC6K7mB6oxA3s4St9XRTqUNfkny/0HHy2rGG7YOJxXFd9V8UGk2LYI7SMl+0++sE7xrsIc8ccfhvVES1b6kmdZZ8uaZfPkCNZxjiCyFpD7i3P0y9H4XSGkBAvHNRcfBsz1M5hLBPlNrOl0Bnir9t9fBMx1FJKTGcIRzN9WpJZQf84Q5Yyltqt/HJegz28/J5CHeqyDWN8fYYwnl8815RN2t4q2OiIXRKSbg6xKdezAm0xh7dasujQj0lTKVH5Y2nEAFjvRQj1S7Ih4HFKyNdbfbVJYFCcpr0bEHMTQj6XEU0/3iUh9IG+0PfdsoPvRY+7Ms0aq/OboiNLEwfPRcyMkAWZJVyvLxLCZNHRf+zpqu2vFjRPQvIS3N92ZBmTGw/vPUzQ+LWbEG/edyGkpo/w911dbWXpX6oxVPczYhaEPIoaqu3PRY8+7Z84ars6teGFlMwu5uYiaOudERISvR8S5o0J+afoJRuuCop6TMgU1LsLIfTpi9Uenh4NsFOy1XnTGKMkG4BZE8IYGAtjYmwDj+8pv5c8RoU05oarB5d+9klbviSE+gxyCi9CPhX/aOttCWEZ6941IdTThRQmeArmgvrMDXPEXP1MckZbvibkiSRwT869CGGSaOshEMJYGXOoeH4/fbCEMFgG/aEQwtiZg4AQ0QsICQgJCPmgCUnXHVS7Luq9IXJNB83+EIkTCw25PtFcsL5nyp5+olfruUqPZUdVW+lVRK/QPm+bqtuoyXWp7eKYeoNzva4c8y1H6XWMIZI1W+kXRa8s+jyf6vG1SFb6aevnerSVbTjKDvUycs4j+1c+iUz1WJdvil8TPZaxjjrUZZuLfbBP9j3Vo036lK5Zyhf6RD36yHKeU48xMBbGNNVjrOyfsbOfg7Kl9KlHO8xVgnpiizksdVy0RI+5ZRlz7fmBynHv9ubzru2Ju/Rx3/aneJs+XhAyHjlYWdtU59FoFMeZJPLFirq+KfL5PKKhTRjOCOVSAalUBrFY7JX/0nMdRq6FTDavXs1GozFEI5FJzfWg/VQirv4fSrVSRjaVQrZQntTeDAcHccQjIfQtiaGYQzKdQ7lyMqm9HsfiQzmbRE/aNyoFrIfCKOWzSGQKE42r8coMsW0bjm1JMstotlowretfa18E22vtFixbpme9jnq9gW63O6m9GYaOhY7WhWkOUJFENFveLzC9QPsDvQ/dMNFoNNBs1DGwbvdSsNPpQBNx3aHEUFMx2LYzqb0e9KHf1VQOHMeB3u+i1azjKJWdaFyNt/qmHuDdISDEZwgI8RnmuOZxzX0bMQamWjO9xJL7j1f5u5T7sEmZpV01Q5LHLcTSnVtL8URTrHqBnyqJ4Wh239avw9Tm+8Ys7c4NBgPEDnOeCb9K9hINpLJF2U2c72J2Ey11nGLq5Hqsro7vAx8EIS3Z3u6E97AaqXkm/jLZihaQy+WwvptDPNvBfzdKcIdjHMj56emZcnI0PsXKXnVi6u4Yj69+ormYGPrwvjBTQhLZMvbjB/j3UgHz2yd4slbC9kHzReIjyfYLsp5tlBFJtfFss4wnS0mUy2WEYnn8FKrgu8U8DnMaloWAUt1AutjF0/US9pItHB1rKkHV5kDVncpDn2ENVV89w0W9ffnzDtsTKemPfkxRbZmTs5eYJqbds5EsXP78cx2xt8WsCOGvRue03gDbsZwEW8dzIWRjvyHJLeCpEPN4pYh/LTDhJ/hxs4LvV0syE8rqelP0ood5SaiNTt9BW2Q1WkPfHEpdHdmyhrQ8ce/EUkjlyupY7Vgo1oSsUk/IaGFgjxBNt5GQ5LFsP9NRsy1X0RWJvKZsH8oAybRVknOVvqoPHTSQr+pCVA+Hosv28YzM9v08NvZS4lsW0UQR8UROkVdrm8p2VAYB21ZkcLDt8Ykuy+5IkWiI730ZICTMlLJ9sclBlhedVtdW9nhPdIenqEssLGtqFrS+hf2jPNZ29pGQWBPJY9Uv++NAZH8xiYM22NZ2x3BkNeFvCjo9R/kWliWfsc8xKfvphgTdulJCHmXpQlsl9XXpDVx0+wYqtTZKJw20uzpqjTZ0603dy0SXGcRZ5FU3ldfru7qFWrONelNDq9NFo9NHWXzQdFcNGg6W/uC8TVcSb4g/tJOT5GXKotsYKPKYzJKcsw112KYpye/ojtLNyqAoCLksq0oyS3W5LjfU/wkuVTuoVNtSZ6nVgP1ysDSEOOqzHYmljUy5h6LosG5K8JyuG4gfHCK8u/eGrG9sYX5hybOOkkimwPbeonuUvWu5D5uU2dkVQnTE43GEw+E3ZH5+Ho8ePfKsoyQSCemEzgQyK5lzXRfcadXVy8DbCV/EsX0gs5Pg1YnPMGeaJgLxi5j4H8LGs7paWCGzAAAAAElFTkSuQmCC'
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
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                name: 'Дата',
                type: 'item',
                key: 'date',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field',
                description: 'Массив дат в формате Date или String'
            },
            {
                name: 'Количество',
                type: 'item',
                key: 'count',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field',
                description: 'Количество значений для каждой даты'
            },
            {
                type: 'item',
                name: 'Автоподсчёт',
                key: 'autoCount',
                optional: true,
                editor: 'none',
                description: 'Автоматический подсчёт количества значений для каждой даты (считается количество одинаковых дат)'
            }
            ]
        },
        {
            type: 'group',
            name: 'Серии',
            key: 'series',
            items: [
            {
                name: 'Имя серии',
                type: 'item',
                key: 'seriesName',
                itemType: 'string',
                itemValue: '',
                description: 'Имя серии. Выводится во всплывающей подсказке'
            }
            ]
        },
        {
            type: 'group',
            name: 'Всплывающая подсказка',
            key: 'tooltip',
            description: 'Тултип, всплывающий при наведении на значение',
            items: [
                {
                    name: 'Формат даты',
                    type: 'item',
                    key: 'dateFormat',
                    description: 'Формат даты во всплывающей подсказке (%d - день, %m - месяц, %y - год)'
                }
            ]
        },
        {
            type: 'group',
            name: 'Группировка данных',
            key: 'dataGrouping',
            multiple: 'true',
            optional: true,
            items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    key: 'timeUnit',
                    description: 'Группируемая диница измерения',
                    items: [
                    {
                        name: 'Миллисекунда',
                        type: 'item',
                        key: 'millisecond',
                        editor: 'none',
                        itemValue: 'millisecond'
                    },
                    {
                        name: 'Секунда',
                        type: 'item',
                        key: 'second',
                        editor: 'none',
                        itemValue: 'second'
                    },
                    {
                        name: 'Минута',
                        type: 'item',
                        key: 'minute',
                        editor: 'none',
                        itemValue: 'minute'
                    },
                    {
                        name: 'Час',
                        type: 'item',
                        key: 'hour',
                        editor: 'none',
                        itemValue: 'hour'
                    },
                    {
                        name: 'День',
                        type: 'item',
                        key: 'day',
                        editor: 'none',
                        itemValue: 'day'
                    },
                    {
                        name: 'Неделя',
                        type: 'item',
                        key: 'week',
                        editor: 'none',
                        itemValue: 'week'
                    },
                    {
                        name: 'Месяц',
                        type: 'item',
                        key: 'month',
                        editor: 'none',
                        itemValue: 'month'
                    },
                    {
                        name: 'Год',
                        type: 'item',
                        key: 'year',
                        editor: 'none',
                        itemValue: 'year'
                    }
                    ]
                },
                {
                    name: 'Группировка',
                    type: 'item',
                    key: 'grouping',
                    itemType: 'string',
                    itemValue: '',
                    description: 'Массив допустимых группировок, через запятую (1, 2, 4)'
                }
            ]
        },
        {
            type: 'group',
            name: 'Фиксированное количество столбцов',
            key: 'fixedColumns',
            optional: true,
            items: [
            {
                name: 'Начальная дата',
                type: 'item',
                key: 'startDate',
                itemType: 'string'
            },
            {
                name: 'Конечная дата',
                type: 'item',
                key: 'endDate',
                itemType: 'string'
            },
            {
                name: 'Число столбцов',
                type: 'item',
                key: 'columnCount',
                itemType: 'string'
            }
            ]
        },
        {
            type: 'group',
            name: 'Ось Х',
            key: 'xAxis',
            optional: true,
            items: [
            {
                type: 'group',
                name: 'Формат дат',
                key: 'dateFormat',
                multiple: 'true',
                items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    key: 'timeUnit',
                    items: [
                    {
                        name: 'Миллисекунда',
                        type: 'item',
                        key: 'millisecond',
                        editor: 'none',
                        itemValue: 'millisecond'
                    },
                    {
                        name: 'Секунда',
                        type: 'item',
                        key: 'second',
                        editor: 'none',
                        itemValue: 'second'
                    },
                    {
                        name: 'Минута',
                        type: 'item',
                        key: 'minute',
                        editor: 'none',
                        itemValue: 'minute'
                    },
                    {
                        name: 'Час',
                        type: 'item',
                        key: 'hour',
                        editor: 'none',
                        itemValue: 'hour'
                    },
                    {
                        name: 'День',
                        type: 'item',
                        key: 'day',
                        editor: 'none',
                        itemValue: 'day'
                    },
                    {
                        name: 'Неделя',
                        type: 'item',
                        key: 'week',
                        editor: 'none',
                        itemValue: 'week'
                    },
                    {
                        name: 'Месяц',
                        type: 'item',
                        key: 'month',
                        editor: 'none',
                        itemValue: 'month'
                    },
                    {
                        name: 'Год',
                        type: 'item',
                        key: 'year',
                        editor: 'none',
                        itemValue: 'year'
                    }
                    ]
                },
                {
                    name: 'Формат',
                    type: 'item',
                    key: 'format',
                    itemType: 'string',
                    itemValue: '',
                    description: 'Формат даты'
                }
                ]
            }
            ]
        }
        ]
    },
	$client: {
		$require: ['JQuery.UI.Loader'],
		_currentFilters: {
		    min: null,
		    minId: null,
		    max: null,
		    maxId: null,
		    curFilterHash: null
		},
		_filterChanged: false,
		_widgetExtremes: {},
	    
		$constructor: function(opts){
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			JSB().loadCss('tpl/highstock/css/highcharts.css');
			JSB().loadScript(['tpl/highstock/highstock.js'], function(){ // 'tpl/highstock/adapters/standalone-framework.js'
			    Highcharts.setOptions({
			        lang: {
                        contextButtonTitle: "Меню виджета",
                        decimalPoint: ".",
                        downloadJPEG: "Скачать в формате JPEG",
                        downloadPDF: "Скачать в формате PDF",
                        downloadPNG: "Скачать в формате PNG",
                        downloadSVG: "Скачать в формате SVG",
                        invalidDate: undefined,
                        loading: "Загрузка...",
                        months: [ "Январь" , "Февраль" , "Март" , "Апрель" , "Май" , "Июнь" , "Июль" , "Август" , "Сентябрь" , "Октябрь" , "Ноябрь" , "Декабрь"],
                        numericSymbolMagnitude: 1000,
                        numericSymbols: [ "k" , "M" , "G" , "T" , "P" , "E"],
                        printChart: "Печать виджета",
                        rangeSelectorFrom: "От",
                        rangeSelectorTo: "До",
                        rangeSelectorZoom: "Зум",
                        resetZoom: "Сбросить зум",
                        resetZoomTitle: "Масштаб 1:1",
                        shortMonths: [ "Янв" , "Фев" , "Мар" , "Апр" , "Май" , "Июн" , "Июл" , "Авг" , "Сен" , "Окт" , "Ноя" , "Дек"],
                        shortWeekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
                        thousandsSep: " ",
                        weekdays: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
                    }
			    });

				$this.init();
			});
		},

		init: function(){
		    this.containerId = JSB().generateUid();
            this.container = this.$('<div class="container" id="' + this.containerId + '"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
                if(!$this.getElement().is(':visible') || !$this.chart){
                    return;
                }
                JSB.defer(function(){
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 300, 'hcResize' + $this.getId());
            });

            this.isInit = true;
		},

        refresh: function(opts){
            if(opts && this == opts.initiator) {
                return;
            }
            
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

            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var fixedColumns = this.getContext().find('fixedColumns');
// filters section
            var globalFilters = source.getFilters(),
                binding = source.value().get(0).binding()[0],
                hasMin = false,
                hasMax = false,
                isReturn = false;

            if(globalFilters){
                var _bNeedExtremesUpdate = false;

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding){
                        switch(cur.op){
                        case '$eq':     // equal

                            break;
                        case '$gte':    // min filter
                            if(this._currentFilters.min && this._currentFilters.min <= cur.value || !this._currentFilters.min){
                                this._currentFilters.min = cur.value.getTime();
                                this._currentFilters.minId = cur.id;
                                _bNeedExtremesUpdate = true;
                            }
                            hasMin = true;
                            break;
                        case '$lte':    // max filter
                            if(this._currentFilters.max && this._currentFilters.max >= cur.value || !this._currentFilters.max){
                                this._currentFilters.max = cur.value.getTime();
                                this._currentFilters.maxId = cur.id;
                                _bNeedExtremesUpdate = true;
                            }
                            hasMax = true;
                            break;
                        }
                        delete globalFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length === 0) globalFilters = null;

                if(globalFilters && this.createFilterHash(globalFilters) === this._currentFilters.curFilterHash || !globalFilters && !this._currentFilters.curFilterHash){ // update data not require
                    if(_bNeedExtremesUpdate){
                        this._filterChanged = true;

                        var min = this._currentFilters.min ? this._currentFilters.min : this._widgetExtremes.min,
                            max = this._currentFilters.max ? this._currentFilters.max : this._widgetExtremes.max;

                        $this.chart.xAxis[0].setExtremes(min, max);

                        if(fixedColumns.used()){
                            this._loadFixedColumnData(min, max);
                        }
                    }
                    isReturn = true;
                } else {
                    this._currentFilters.curFilterHash = globalFilters ? this.createFilterHash(globalFilters) : undefined;
                }
            }

            if(!hasMin && this._currentFilters.minId){
                this._filterChanged = true;

                this._currentFilters.min = null;
                this._currentFilters.minId = null;

                this.chart.xAxis[0].setExtremes($this._widgetExtremes.min, $this._currentFilters.max ? $this._currentFilters.max : $this._widgetExtremes.max);

                if(fixedColumns.used()){
                    this._loadFixedColumnData($this._widgetExtremes.min, $this._currentFilters.max ? $this._currentFilters.max : $this._widgetExtremes.max);
                }
                isReturn = true;
            }

            if(!hasMax && this._currentFilters.maxId){
                this._filterChanged = true;

                this._currentFilters.max = null;
                this._currentFilters.maxId = null;

                this.chart.xAxis[0].setExtremes($this._currentFilters.min ? $this._currentFilters.min : $this._widgetExtremes.min, $this._widgetExtremes.max);

                if(fixedColumns.used()){
                    this._loadFixedColumnData($this._currentFilters.min ? $this._currentFilters.min : $this._widgetExtremes.min, $this._widgetExtremes.max);
                }
                isReturn = true;
            }
            if(isReturn) return;
// end filters section
            var seriesContext = this.getContext().find('series').value(),
                autoCount = source.value().get(2).used(),
                tooltip = this.getContext().find('tooltip').value(),
                value = source.value().get(0),
                count = source.value().get(1);

            if(fixedColumns.used()){
                var minFix = fixedColumns.value().get(0).value(),
                    maxFix = fixedColumns.value().get(1).value(),
                    columnCount = fixedColumns.value().get(2).value();

                var colWidth = (new Date(maxFix).getTime() - new Date(minFix).getTime()) / 1000 / columnCount;

                var fixedColumnsSelect = {
                    dateIntervalOrder: {
                        $dateIntervalOrder: {
                            $field: value.binding()[0],
                            $seconds: colWidth
                        }
                    },
                    dateCount: {
                        $count: 1
                    }
                };
                var fixedColumnsGroupBy = [
                    {
                        $dateIntervalOrder: {
                            $field: value.binding()[0],
                            $seconds: colWidth
                        }
                    }
                ];
            } else {
                var fixedColumnsSelect = undefined,
                    fixedColumnsGroupBy = undefined;
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true, select: fixedColumnsSelect, groupBy: fixedColumnsGroupBy}, function(queryResult){
                    try{
                        if(fixedColumns.used()){
                            if(!queryResult){
                                if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
                                return;
                            }

                            var data = [];

                            for(var i = 0; i < queryResult.length; i++){
                                data.push({
                                    x: queryResult[i].dateIntervalOrder * colWidth * 1000,
                                    y: queryResult[i].dateCount
                                });
                            }
                        } else {
                            var data = [];

                            while(source.next()){
                                var val = value.value();

                                if(JSB().isDate(val)){
                                    var dateValue = val.getTime();
                                    $this._dataFormat = 'datetime';
                                } else {
                                    if(typeof val === 'number'){
                                         var dateValue = val;
                                        $this._dataFormat = 'number';
                                    } else {
                                        return;
                                    }
                                }

                                if(autoCount){
                                    var e = null;
                                    for(var j = 0; j < data.length; j++){
                                        if(data[j].x === dateValue){
                                            e = data[j];
                                            break;
                                        }
                                    }

                                    if(e){
                                        e.y++;
                                    } else {
                                        data.push({ x: dateValue, y: 1 });
                                    }
                                } else {
                                    data.push({ x: dateValue, y: count.value() });
                                }
                            }
                        }

                        if(data.length === 0){
                            console.log('Временной диапазон: нет данных или неверный формат (поддерживается только объект Date)');
                            if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
                            return;
                        }

                        data.sort(function(a, b){
                            if(a.x < b.x) return -1;
                            if(a.x > b.x) return 1;
                            return 0;
                        });

                        if(opts && opts.isCacheMod){
                        	$this.storeCache(data);
                        }

                        $this._buildChart(data, _bNeedExtremesUpdate);
                    } catch(e){
                        console.log(e);
                    } finally{
                        $this.getElement().loader('hide');
                    }
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data, _bNeedExtremesUpdate){
        	var seriesContext = this.getContext().find('series').value(),
        		fixedColumns = this.getContext().find('fixedColumns');
        	
            try{
                var tooltipXDateFormat = this.getContext().find('tooltip').value().get(0).value();
                tooltipXDateFormat = tooltipXDateFormat === null ? undefined : tooltipXDateFormat;

                var dataGrouping = this.getContext().find('dataGrouping');
                if(dataGrouping.used()){
                    var units = [];
                    var values = dataGrouping.values();
                    for(var i = 0; i < values.length; i++){
                        units.push([values[i].get(0).value().get(0).value(), [values[i].get(1).value()]]);
                    }
                }

                var xAxis = this.getContext().find('xAxis');
                if(xAxis.used()){
                    var gr = xAxis.values(),
                        dateTimeLabelFormats = {};

                    for(var i = 0; i < gr.length; i++){
                        dateTimeLabelFormats[gr[i].value().get(0).value().get(0).value()] = gr[i].value().get(1).value();
                    }
                }
                
                if(fixedColumns.used()){
                    var scrollbar = {
                        liveRedraw: false
                    }

                    var rangeSelector = {
                        enabled: false
                    }
                    
                    var navigator = {
                        adaptToUpdatedData: false,
                        series: {
                            data: data
                        }
                    }                    
                }

                var chartOpts = {
                    chart: {
                        renderTo: $this.containerId
                    },
                    xAxis: {
                        type: 'datetime',
                        min: data[0].x,
                        max: data[data.length - 1].x,
                        events: {
                            afterSetExtremes: function(event){ $this._addIntervalFilter(event);}
                        }
                    },

                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    tooltip: {
                        xDateFormat: tooltipXDateFormat
                    }
                };

                chartOpts.series = [{
                    type: 'column',
                    name: seriesContext.get(0).value(),
                    data: data,
                    turboThreshold: 0,
                    dataGrouping: {
                        enabled: units !== undefined ? true : false,
                        units: units
                    }
                }];

                if(navigator){
                    chartOpts.navigator = navigator;
                }

                if(scrollbar){
                    chartOpts.scrollbar = scrollbar;
                }

                if(rangeSelector){
                    chartOpts.rangeSelector = rangeSelector;
                }

                if(dateTimeLabelFormats){
                    chartOpts.xAxis.dateTimeLabelFormats = dateTimeLabelFormats;
                }

                // create the chart
                $this.chart = new Highcharts.stockChart(chartOpts);

                var ex = $this.chart.navigator.xAxis.getExtremes();
                $this._widgetExtremes = {
                    min: ex.min,
                    max: ex.max
                };

                if(_bNeedExtremesUpdate){
                    $this.chart.xAxis[0].setExtremes($this._currentFilters.min ? $this._currentFilters.min : ex.dataMin, $this._currentFilters.max ? $this._currentFilters.max : ex.dataMax);
                }

                $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
            } catch(ex){
                console.log(ex);
                if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
            }
        },

        _addIntervalFilter: function(event){
            if(this._filterChanged){
                this._filterChanged = false;
                return;
            }

            JSB().defer(function(){
                if(event.min === $this._widgetExtremes.min && !$this._currentFilters.min && event.max === $this._widgetExtremes.max && !$this._currentFilters.max) return;

                var context = $this.getContext().find('source').binding();
                if(!context.source) return;

                var field = $this.getContext().find('source').value().get(0).binding(),
                    bNeedRefresh = false;

                // min filter
                if($this._currentFilters.min && $this._currentFilters.min !== event.min || !$this._currentFilters.min && event.min !== $this._widgetExtremes.min){  // change filter
                    if($this._currentFilters.min){
                        $this.removeFilter($this._currentFilters.minId);
                    }

                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$gte',
                        field: field,
                        value: $this._dataFormat === 'datetime' ? new Date(event.min) : event.min
                    };
                    $this._currentFilters.min = event.min;
                    $this._currentFilters.minId = $this.addFilter(fDesc);

                    bNeedRefresh = true;
                }
                if($this._currentFilters.min && event.min === event.dataMin){   // remove filter
                    $this.removeFilter($this._currentFilters.minId);
                    $this._currentFilters.min = null;
                    $this._currentFilters.minId = null;
                    bNeedRefresh = true;
                }

                // max filter
                if($this._currentFilters.max && $this._currentFilters.max !== event.max || !$this._currentFilters.max && event.max !== $this._widgetExtremes.max){  // change filter
                    if($this._currentFilters.max){
                        $this.removeFilter($this._currentFilters.maxId);
                    }

                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$lte',
                        field: field,
                        value: $this._dataFormat === 'datetime' ? new Date(event.max) : event.max
                    };
                    $this._currentFilters.max = event.max;
                    $this._currentFilters.maxId = $this.addFilter(fDesc);

                    bNeedRefresh = true;
                }
                if($this._currentFilters.max && event.max === event.dataMax){   // remove filter
                    $this.removeFilter($this._currentFilters.maxId);
                    $this._currentFilters.max = null;
                    $this._currentFilters.maxId = null;
                    bNeedRefresh = true;
                }

                if(bNeedRefresh){
                    $this.refreshAll();

                    var fixedColumns = $this.getContext().find('fixedColumns');
                    if(fixedColumns.used()){
                        $this._loadFixedColumnData(event.min, event.max);
                    }
                }
            }, 700, 'ColumnRangeSelector.xAxisFilterUpdate_' + this.containerId);
        },

        _loadFixedColumnData: function(min, max){
            var columnCount = this.getContext().find('fixedColumns').value().get(2).value(),
                field = this.getContext().find('source').value().get(0).binding()[0];
            var colWidth = Math.floor((max - min) / 1000 / columnCount);

            var fixedColumnsSelect = {
                dateIntervalOrder: {
                    $dateIntervalOrder: {
                        $field: field,
                        $seconds: colWidth
                    }
                },
                dateCount: {
                    $count: 1
                }
            };
            var fixedColumnsGroupBy = [
                {
                    $dateIntervalOrder: {
                        $field: field,
                        $seconds: colWidth
                    }
                }
            ];

            $this.chart.showLoading('Загрузка...');
            $this.getContext().find('source').fetch({readAll: true, reset: true, select: fixedColumnsSelect, groupBy: fixedColumnsGroupBy}, function(queryResult){
                if(!queryResult){
                    $this.chart.hideLoading();
                    return;
                }

                var data = [];

                for(var i = 0; i < queryResult.length; i++){
                    data.push({
                        x: queryResult[i].dateIntervalOrder * colWidth * 1000,
                        y: queryResult[i].dateCount
                    });
                }

                data.sort(function(a, b){
                    if(a.x < b.x) return -1;
                    if(a.x > b.x) return 1;
                    return 0;
                });

                $this.chart.series[0].setData(data);
                $this.chart.hideLoading();
            });
        }
	}
}