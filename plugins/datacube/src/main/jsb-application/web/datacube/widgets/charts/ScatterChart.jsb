{
	$name: 'JSB.DataCube.Widgets.ScatterChart',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Разброс',
		description: '',
		category: 'Highcharts',
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
			var self = this;
			this.hc = this.$('<div class="container"></div>');
			this.getElement().append(this.hc);
			this.getElement().resize(function(){
				if(self.chart){
					self.chart.setSize(self.getElement().width(), self.getElement().height(), false);
				}
			});
			this.hc.highcharts({
				chart: {
			        type: 'scatter',
			        zoomType: 'xy'
			    },
			    title: {
			        text: 'Height Versus Weight of 507 Individuals by Gender'
			    },
			    subtitle: {
			        text: 'Source: Heinz  2003'
			    },
			    xAxis: {
			        title: {
			            enabled: true,
			            text: 'Height (cm)'
			        },
			        startOnTick: true,
			        endOnTick: true,
			        showLastLabel: true
			    },
			    yAxis: {
			        title: {
			            text: 'Weight (kg)'
			        }
			    },
			    legend: {
			        layout: 'vertical',
			        align: 'left',
			        verticalAlign: 'top',
			        x: 100,
			        y: 70,
			        floating: true,
			        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
			        borderWidth: 1
			    },
			    plotOptions: {
			        scatter: {
			            marker: {
			                radius: 5,
			                states: {
			                    hover: {
			                        enabled: true,
			                        lineColor: 'rgb(100,100,100)'
			                    }
			                }
			            },
			            states: {
			                hover: {
			                    marker: {
			                        enabled: false
			                    }
			                }
			            },
			            tooltip: {
			                headerFormat: '<b>{series.name}</b><br>',
			                pointFormat: '{point.x} cm, {point.y} kg'
			            }
			        }
			    },
			    series: [{
			        name: 'Female',
			        color: 'rgba(223, 83, 83, .5)',
			        data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
			            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
			            [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
			            [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
			            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
			            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
			            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
			            [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
			            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
			            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
			            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
			            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
			            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
			            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
			            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
			            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
			            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
			            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
			            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
			            [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
			            [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
			            [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
			            [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
			            [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
			            [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
			            [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
			            [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
			            [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
			            [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
			            [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
			            [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
			            [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
			            [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
			            [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
			            [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
			            [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
			            [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
			            [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
			            [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
			            [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
			            [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
			            [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
			            [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
			            [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
			            [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
			            [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
			            [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
			            [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
			            [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
			            [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
			            [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
			            [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]

			    }, {
			        name: 'Male',
			        color: 'rgba(119, 152, 191, .5)',
			        data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
			            [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
			            [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
			            [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
			            [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
			            [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
			            [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
			            [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
			            [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
			            [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
			            [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
			            [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
			            [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
			            [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
			            [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
			            [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
			            [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
			            [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
			            [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
			            [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
			            [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
			            [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
			            [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
			            [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
			            [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
			            [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
			            [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
			            [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
			            [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
			            [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
			            [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
			            [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
			            [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
			            [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
			            [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
			            [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
			            [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
			            [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
			            [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
			            [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
			            [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
			            [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
			            [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
			            [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
			            [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
			            [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
			            [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
			            [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
			            [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
			            [180.3, 83.2], [180.3, 83.2]]
			    }]
			});
			
			this.chart =  this.hc.highcharts();
		},
		
	},
	
	$server: {
	}
}