JSB({
	name: 'testwidget',
	parent: 'JSB.Widgets.Widget',
	expose: {
		displayName: 'TestWidget',
		description: 'This is a first widget in our mega-system created for the test purposes',
		category: 'Widgets',
		input: {
			'data': { type: ['java.lang.Object'] }
		},
		output: {
			'sig': { type: 'org.jsbeans.types.JsonObject' }
		}
	},
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('testwidget');
			this.loadCss('testwidget.css');
			JSO().loadScript('http://code.highcharts.com/highcharts.js', function(){
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
					backgroundColor: null,
	                type: 'line',
	                marginRight: 130,
	                marginBottom: 25,
		            events:{
		            	click: function(){
							self.rpc('getSerie',['Tokyo'], function(arg){
								debugger;
							})
		            	}
		            }

	            },
	            title: {
	                text: 'Monthly Average Temperature',
	                x: -20 //center
	            },
	            subtitle: {
	                text: 'Source: WorldClimate.com',
	                x: -20
	            },
	            xAxis: {
	                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	            },
	            yAxis: {
	                title: {
	                    text: 'Temperature (°C)'
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 1,
	                    color: '#808080'
	                }]
	            },
	            tooltip: {
	                valueSuffix: '°C'
	            },
	            legend: {
	                layout: 'vertical',
	                align: 'right',
	                verticalAlign: 'top',
	                x: -10,
	                y: 100,
	                borderWidth: 0
	            },
	            series: [{
	                name: 'Tokyo',
	                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
	            }, {
	                name: 'New York',
	                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
	            }, {
	                name: 'Berlin',
	                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
	            }, {
	                name: 'London',
	                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	            }],
			});
			
			this.chart =  this.hc.highcharts();
		},
		
		onReceive: function(resp){
			debugger;
		}
	
	},
	
	server: {
		series: {
			'Tokyo': [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
			'New York': [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
			'Berlin': [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0],
			'London': [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		},
		
		getSerie: function(name){
			return this.series[name];
		}
	}
});
