{
	$name: 'JSB.DataCube.Widgets.ColumnRangeSelector',
	$parent: 'JSB.DataCube.Widgets.Widget',
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
                binding: 'field',
                itemType: 'string',
                itemValue: '$field'
            },
            {
                name: 'Количество',
                type: 'item',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field'
            },
            {
                type: 'item',
                name: 'Автоподсчёт',
                optional: true,
                editor: 'none'
            }
            ]
        },
        {
            type: 'group',
            name: 'Серии',
            key: 'series',
            items: [
            {
                name: 'Имя поля',
                type: 'item',
                itemType: 'string',
                itemValue: ''
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
                    items:[
                    {
                        name: 'millisecond',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'second',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'minute',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'hour',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'day',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'week',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'month',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'year',
                        type: 'item',
                        editor: 'none'
                    }
                    ]
                },
                {
                    name: 'Группировка',
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
            name: 'Всплывающая подсказка',
            key: 'tooltip',
            items: [
                {
                    name: 'Формат даты',
                    type: 'item',
                }
            ]
        }
        ]
    },
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			// this.loadCss('Highcharts.css');
			JSB().loadScript(['tpl/highstock/highstock.js'], function(){
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

				$this._init();
			});
		},

		_init: function(){
		    this.containerId = JSB().generateUid();
            this.container = this.$('<div class="container" id="' + this.containerId + '"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
                if($this.highcharts){
                    $this.highcharts.setSize($this.getElement().width(), $this.getElement().height(), false);
                }
            });

            this.isInit = true;
		},

        refresh: function(opts){
            if(opts && this == opts.initiator) return;
            if(opts && opts.type === 'removeFilter' && this._currentFilter.indexOf(opts.fItemIds[0]) >= 0) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var seriesContext = this.getContext().find('series').value(),
                isdataGrouping = this.getContext().find('dataGrouping').used(),
                autoCount = source.value().get(2).used(),
                tooltip = this.getContext().find('tooltip').value();

            if(isdataGrouping)
                var dataGrouping = this.getContext().find('dataGrouping').values();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

                    while(source.next()){
                        var dateValue = new Date(source.value().get(0).value()).getTime();

                        if(dateValue !== dateValue) continue;

                        if(autoCount){
                            var e = data.find(function(el){
                                return el.x === dateValue;
                            });

                            if(e){
                                e.y++;
                            } else {
                                data.push({ x: dateValue, y: 1 });
                            }
                        } else {
                            var countValue = source.value().get(1).value();

                            data.push({ x: dateValue, y: countValue });
                        }
                    }

                    data.sort(function(a, b){
                        if(a.x < b.x) return -1;
                        if(a.x > b.x) return 1;
                        return 0;
                    });

                    var units = [];
                    if(isdataGrouping)
                        for(var i = 0; i < dataGrouping.length; i++){
                            units.push([
                                dataGrouping[i].get(0).value(), dataGrouping[i].get(1).value()
                            ]);
                        }

                    var series = {
                        type: 'column',
                        name: seriesContext.get(0).value(),
                        data: data,
                        turboThreshold: 0,
                        dataGrouping: {
                            units: units
                        }
                    };

                    if(tooltip){
                        var tooltipXDateFormat = this.getContext().find('tooltip').value().get(0).value();
                        tooltipXDateFormat = tooltipXDateFormat.length === 0 ? undefined : tooltipXDateFormat;
                    } else {
                        var tooltipXDateFormat;
                    }

                    $this.getElement().loader('hide');

                    // create the chart
                    Highcharts.stockChart(this.containerId, {
                        chart: {
                            alignTicks: false
                        },

                        rangeSelector: {
                            selected: 1,
                        },

                        xAxis: {
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
                        },

                        series: [series]
                    });
                });

            }, function(){
                return $this.isInit;
            });
        },

        _addIntervalFilter: function(event){
            JSB().defer(function(){
                var context = $this.getContext().find('source').binding();
                if(!context.source) return;

                var field = $this.getContext().find("source").value().get(0).binding();
                $this._currentFilter = $this.addFilter(context.source, 'and', [{ field: field, value: event.min, op: '$gte' }, { field: field, value: event.max, op: '$lte' }], $this._currentFilter);
            }, 500, 'ColumnRangeSelector.xAxisFilterUpdate_' + this.containerId);
        }
	}
}