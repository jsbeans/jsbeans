{
	$name: 'JSB.DataCube.Widgets.ScatterChart',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Разброс',
		description: '',
		category: 'Диаграммы',
		thumb: `data:image/png;base64,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
		AAAAAElFTkSuQmCC`
	},
	
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('scatterChart');
			this.loadCss('ScatterChart.css');
			JSB().loadScript('tpl/highcharts/js/highcharts.js', function(){
				self.init();
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

            var dataValue = this.getContext().find('data').value();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

                    while(source.next()){
                        var name = dataValue.get(0).value();
                        var y = dataValue.get(1).value();

                        if(JSB().isArray(name)){
                            for(var j = 0; j < name.length; j++){
                                data.push({
                                    name: name[j],
                                    y: y[j]
                                });
                            }
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

                        series: [{
                            data: data,
                            colorByPoint: true
                        }]
                    });

                    $this.getElement().loader('hide');

                    $this.chart =  $this.container.highcharts();
                });


            }, function(){
                return $this.isInit;
            });
        }
	}
}