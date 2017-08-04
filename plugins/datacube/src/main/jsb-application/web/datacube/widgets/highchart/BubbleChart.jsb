{
	$name: 'DataCube.Widgets.BubbleChart',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Пузыри',
		description: '',
		category: 'Диаграммы',
		thumb: `data:image/png;base64,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
		AAAAAElFTkSuQmCC`
	},
	
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('bubbleChart');
			this.loadCss('BubbleChart.css');
			JSB().loadScript('tpl/highcharts/js/highcharts.js', function(){
				JSB().loadScript('tpl/highcharts/js/highcharts-more.js', function(){
					self.init();	
				});
			});
		},
		init: function(){
			var self = this;
			this.hc = this.$('<div class="container"></div>');
			this.getElement().append(this.hc);
			this.getElement().resize(function(){
            	if(!$this.getElement().is(':visible')){
            		return;
            	}

				if(self.chart){
					self.chart.setSize(self.getElement().width(), self.getElement().height(), false);
				}
			});
			this.hc.highcharts({
				chart: {
			        type: 'bubble',
			        plotBorderWidth: 1,
			        zoomType: 'xy'
			    },

			    legend: {
			        enabled: false
			    },

			    title: {
			        text: 'Sugar and fat intake per country'
			    },

			    subtitle: {
			        text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
			    },

			    xAxis: {
			        gridLineWidth: 1,
			        title: {
			            text: 'Daily fat intake'
			        },
			        labels: {
			            format: '{value} gr'
			        },
			        plotLines: [{
			            color: 'black',
			            dashStyle: 'dot',
			            width: 2,
			            value: 65,
			            label: {
			                rotation: 0,
			                y: 15,
			                style: {
			                    fontStyle: 'italic'
			                },
			                text: 'Safe fat intake 65g/day'
			            },
			            zIndex: 3
			        }]
			    },

			    yAxis: {
			        startOnTick: false,
			        endOnTick: false,
			        title: {
			            text: 'Daily sugar intake'
			        },
			        labels: {
			            format: '{value} gr'
			        },
			        maxPadding: 0.2,
			        plotLines: [{
			            color: 'black',
			            dashStyle: 'dot',
			            width: 2,
			            value: 50,
			            label: {
			                align: 'right',
			                style: {
			                    fontStyle: 'italic'
			                },
			                text: 'Safe sugar intake 50g/day',
			                x: -10
			            },
			            zIndex: 3
			        }]
			    },

			    tooltip: {
			        useHTML: true,
			        headerFormat: '<table>',
			        pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
			            '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
			            '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
			            '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
			        footerFormat: '</table>',
			        followPointer: true
			    },

			    plotOptions: {
			        series: {
			            dataLabels: {
			                enabled: true,
			                format: '{point.name}'
			            }
			        }
			    },

			    series: [{
			        data: [
			            { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
			            { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
			            { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
			            { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
			            { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
			            { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
			            { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
			            { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
			            { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
			            { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
			            { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
			            { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
			            { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
			            { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
			            { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
			        ]
			    }]
			});
			
			this.chart =  this.hc.highcharts();
		}
		
	},
	
	$server: {
	}
}