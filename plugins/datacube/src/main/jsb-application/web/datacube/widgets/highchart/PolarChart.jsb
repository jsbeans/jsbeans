{
	$name: 'JSB.DataCube.Widgets.PolarChart',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Полярная диаграмма',
		description: '',
		category: 'Диаграммы',
		thumb: `data:image/png;base64,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
		gg==`
	},
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            binding: 'field',
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
                type: 'group',
                name: 'Серии',
                key: 'series',
                multiple: 'auto',
                items: [
                {
                    name: 'Имя поля',
                    type: 'item',
                    itemType: 'string',
                    itemValue: ''
                },
                {
                    name: 'Данные',
                    type: 'item',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },
                {
                    name: 'Тип отображения',
                    type: 'select',
                    items:[
                    {
                        name: 'column',
                        type: 'group',
                        items: [{
                            name: 'Положение точек',
                            key: 'pointPlacement',
                            type: 'select',
                            items: [
                            {
                                name: 'between',
                                type: 'item',
                            },
                            {
                                name: 'null',
                                type: 'item',
                            },
                            {
                                name: 'on',
                                type: 'item',
                            }
                            ]
                        }]
                    },
                    {
                        name: 'line',
                        type: 'item',
                    },
                    {
                        name: 'area',
                        type: 'item',
                    }
                    ]
                }
                ]
            }]
        }]
    },
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('polarChart');
			this.loadCss('PolarChart.css');
			JSB().loadScript('tpl/highcharts/js/highcharts.js', function(){
				JSB().loadScript('tpl/highcharts/js/highcharts-more.js', function(){
					self.init();	
				});
			});
		},

		init: function(){
			this.container = this.$('<div class="container"></div>');
			this.append(this.container);

			this.getElement().resize(function(){
            	if(!$this.getElement().is(':visible')){
            		return;
            	}

				if($this.highcharts){
					$this.highcharts.setSize(self.getElement().width(), $this.getElement().height(), false);
				}
			});

			this.isInit = true;
		},

		refresh: function(){
		    var source = this.getContext().find('source');
		    if(!source.bound()) return;

		    var seriesContext = this.getContext().find('series').values();

		    $this.getElement().loader();
		    JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var series = [];

                    while(source.next()){
                        for(var i = 0; i < seriesContext.length; i++){
                            if(!series[i]){
                                if(seriesContext[i].get(0).value() === 'column'){
                                    series[i] = {
                                        type: seriesContext[i].get(2).value().name(),
                                        name: seriesContext[i].get(0).value(),
                                        pointPlacement: $this.getContext().find("pointPlacement").value().name(),
                                        data: []
                                    };
                                } else {
                                    series[i] = {
                                        type: seriesContext[i].get(2).value().name(),
                                        name: seriesContext[i].get(0).value(),
                                        data: []
                                    };
                                }
                            }

                            var a = seriesContext[i].get(1).value();
                            if(JSB().isArray(a)){
                                series[i].data = a;
                            } else {
                                series[i].data.push(a);
                            }
                        }
                    }

                    $this.container.highcharts({
                        chart: {
                            polar: true
                        },

                        title: {
                            text: this.getContext().find('title').value()
                        },

                        pane: {
                            startAngle: 0,
                            endAngle: 360
                        },

                        xAxis: {
                            tickInterval: 45,
                            min: 0,
                            max: 360,
                            labels: {
                                formatter: function () {
                                    return this.value + '°';
                                }
                            }
                        },

                        yAxis: {
                            min: 0
                        },

                        plotOptions: {
                            series: {
                                pointStart: 0,
                                pointInterval: 45
                            },
                            column: {
                                pointPadding: 0,
                                groupPadding: 0
                            }
                        },

                        series: series
                    });

                    $this.chart =  $this.container.highcharts();
                });

                $this.getElement().loader('hide');
		    }, function(){
		        return $this.isInit;
		    });
		}
	}
}