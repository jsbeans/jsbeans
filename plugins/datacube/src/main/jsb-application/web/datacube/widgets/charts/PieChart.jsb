{
	$name: 'JSB.DataCube.Widgets.PieChart',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Круговая диаграмма',
		description: '',
		category: 'Highcharts',
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
            binding: 'field',
            key: 'source',
            items: [
            {
                type: 'group',
                name: 'Серии',
                key: 'series',
                items: [
                {
                    name: 'Имя',
                    type: 'item',
                    itemType: 'string',
                    itemValue: ''
                },
                {
                    name: 'Данные',
                    type: 'group',
                    key: 'data',
                    items: [
                    {
                        type: 'item',
                        name: 'Имена частей',
                        binding: 'field',
                        itemType: 'string',
                        itemValue: '$field',
                    },
                    {
                        type: 'item',
                        name: 'Размеры частей',
                        binding: 'field',
                        itemType: 'string',
                        itemValue: '$field',
                    }
                    ]
                }
                ]
            }
            ]
        }]
    },
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('pieChart');
			this.loadCss('PieChart.css');
			JSB().loadScript('tpl/highcharts/js/highcharts.js', function(){
				self.init();
			});
		},

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
                if($this.highcharts){
                    $this.highcharts.setSize(self.getElement().width(), $this.getElement().height(), false);
                }
            });

            this.isInit = true;
        },

        refresh: function(){
        return;
            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var seriesContext = this.getContext().find('series').values();
            var dataContext = this.getContext().find('data').values();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true}, function(){
                    var series = [];

                    while(source.next()){
                        for(var i = 0; i < seriesContext.length; i++){
                            if(!series[i]){
                                debugger;

                                series[i] = {
                                    name: seriesContext[i].get(0).value(),
                                    data: [
                                    {
                                        name: dataContext[0].get(0).value(),
                                        y: dataContext[0].get(1).value()
                                    }
                                    ],
                                    colorByPoint: true
                                };
                            }
/*
                            var data = [];

                            for(var i = 0; i < dataContext.length; i++){
                                data.push({
                                    name: dataContext[i].get(0).value(),
                                    y: dataContext[i].get(1).value()
                                });
                            }

                            series[i].data = data;
*/
                        }
                    }

                    $this.container.highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
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
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },

                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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