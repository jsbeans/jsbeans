{
	$name: 'JSB.DataCube.Widgets.ColumnRangeSelector',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Диапазон дат',
		description: '',
		category: 'Диаграммы',
		thumb: 'data:image/png;base64,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'
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
                items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    editor: 'none',
                    items:[
                    {
                        name: 'millisecond',
                        type: 'item',
                    },
                    {
                        name: 'second',
                        type: 'item',
                    },
                    {
                        name: 'minute',
                        type: 'item',
                    },
                    {
                        name: 'hour',
                        type: 'item',
                    },
                    {
                        name: 'day',
                        type: 'item',
                    },
                    {
                        name: 'week',
                        type: 'item',
                    },
                    {
                        name: 'month',
                        type: 'item',
                    },
                    {
                        name: 'year',
                        type: 'item',
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
        }
        ]
    },
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			// this.loadCss('Highcharts.css');
			JSB().loadScript(['tpl/highstock/highstock.js'], function(){
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

        refresh: function(){
            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var seriesContext = this.getContext().find('series').value(),
                dataGrouping = this.getContext().find('dataGrouping').values(),
                autoCount = source.value().get(2).used();

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

                    $this.getElement().loader('hide');

                    // create the chart
                    Highcharts.stockChart(this.containerId, {
                        chart: {
                            alignTicks: false
                        },

                        rangeSelector: {
                            selected: 1,
                        },

                        navigator: {
                            xAxis: {
                                events: {
                                    afterSetExtremes: function(event){ $this._addIntervalFilter(event);}
                                }
                            }
                        },

                        title: {
                            text: this.getContext().find('title').value()
                        },

                        subtitle: {
                            text: this.getContext().find('subtitle').value()
                        },

                        series: [series]
                    });
                });

            }, function(){
                return $this.isInit;
            });
        },

        _addIntervalFilter: function(event){
            var context = $this.getContext().find('source').binding();
            if(!context.source) return;

            var field = $this.getContext().find("source").value().get(0).binding();
            $this.addFilter(context.source, 'and', [{ field: field, value: event.min, op: '>=' }, { field: field, value: event.min, op: '<=' }]);
        }
	}
}