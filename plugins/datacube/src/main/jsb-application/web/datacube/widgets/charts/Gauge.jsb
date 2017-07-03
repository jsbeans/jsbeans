{
	$name: 'JSB.DataCube.Widgets.Gauge',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Измеритель',
		description: '',
		category: 'Highcharts',
		thumb: `data:image/png;base64,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
		dXbXrJ6IHlmvTm9an6Tvr39Gf9pA2IBsUG/wzlDUMMjwvOG8kbRRhFGr0WdjJWOKcZfxDxMdk0yT
		AVOMqYVpjumoGauZm1ml2RtzEfNQ8xbzFQt1iwyLAUucpY3lSctnVgJWgVbNVivWmtaZ1rdsGGxc
		bCpt3tnK2FJs++xQO2u7YrvX9uL2MfY9DuBg5VDsMOUo6Rjv2O+Ed3J0qnL64KzsvNd5xIXNxc/l
		gst3V2PXAtdXblJuSW5D7kzuu92b3X94mHoUeUx7Knpmet734vUK9+r1Jni7e5/3Xvcx8znlM7db
		ffeR3ZN7JPek7rnry+sb5XvNj8mP7Nfpj/P38L/g/5PsQK4nrwdYBVQHrASaBJYFLgUZBpUELQbr
		BRcFz4fohRSFLITqhRaHLoYZhJWGLYebhFeGr0ZYRtRG/Ih0iGyMpEZ5RLVH00T7R1+JYY2JjLkV
		KxibGjseJxt3JG46Xif+VPwKxYZyPgFJ2JPQm8ieGJf4IEkq6XDSTLJ+clXyRop7SmcqS2pM6oM0
		mbTjafPp5unnMrAZgRlDe4X37t87k2mUWZeFZAVkDWWLZh/Knttnsa9pP93+yP0PDygdKDrw7aDH
		wb5DAof2HZo9bHG45QjjEcqRZ0d1j9Yewx4LPzZ6XPV4xfGdnKCce7lKuaW5P/MC8+7lK+eX51NP
		hJwYLdAoqCnEF8YUTp40ONlUxFKUXjRbbFfcXUIqySn5dsrv1N1StdLaMrqypLLpctvy3gqxisKK
		n5VhlRNVxlXt1fzVx6t/nA46/bjGsOZirUBtbu3WmfAzz+ss6rrrJepLG/ANyQ0fzrqfHTmnda75
		PO/53PO/GmMap5ucm241azY3X+C/UNCCtiS1LLbubh1rM23rvSh/sa6dsz23AzqSOj5e8r80ednm
		8lCnVufFv8T/qu5i68rpRrrTuld6wnqme716x69YXxnq0+3r6lfob7wqfLXqGse1gut01w9dp95I
		v7E+EDewPBg6ODvkN/TqpufNp7ecbo3etrl9Z9h8+OaI0ciNO3p3rt7VuXvlnta9nvsa97sfqD/o
		eqj+sGtUY7T7keaj3jHtsb7xXePXHxs8Hnxi+mT4qdXT+xP2E+OTbpPPn+1+Nv086PnCi6gXqy+T
		X26/2vca9zpninmq9A3/m/q30m/bpzWmr82Yzjx45/Lu1Wzg7NL7hPc/5w59IH4onReab15QWbi6
		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
		Ch3wABYQPCKGmCLByFHkAjKKrKG8qAkajVaid9EtjCImBHMG8xYrjA3FXsYBzgU3hDfB3yW4ExZp
		DtKK0t6nS6WXpV9kaCMmM5oz8TH9YH7BMsTawXaBvZWji/M212vubV5hPjv+ZIEkwUShRFKicJJI
		smiqWIb4AYkcyXKpNumbMq9l1+UZFaQUjZR8lJNUClVb1UbV1zT5tMy1k3SadN/oceo7GZwwHDVm
		NNEzjTFrMH9pyW7lbF1s88xO0D7MocsJ5+zkUu360V3Po8Tzq7eHz6092r5d/jrk4UCdoNLg1VCb
		sIbwzUjbqKroxVi1uKz4kQSmRM+khuS1VIu0M+nUvUGZ49nm+24esDz45HDwke1jJceXc/XyivIX
		C8wKzxYRiqNLJkuNytorBCrzq3ZOx9aMn5GpO1Q/fVb/3OnzO03k5uEW+daStp328I7Jy6adnV2i
		3cW9uCvpfV+vRl37eCNy4MtQyi3kdsGI4J2Oe6b3XzzMfCQx9uhxylP+iWvPPJ4vvkx49W0q5s30
		tO3MpVnW97FzI/MsCy6LuR/7l54uz3x6+/nul+aV1FW91c2v59ac1758O7outN7yXeV73w+9H70b
		qhsXN0U2S7ZwWylbs9t2270/RX7m/Pzyy+VX7w7/TtbOG6o+tZZKBUgIUVUBAACEwRgA94ZKXZMA
		IBQB/DpJpW7XU6m/GgAwrwEGon7/VwAA4JkBqmsAAIZNDu3772+k/wGl4o3OXaPNYwAAACBjSFJN
		AABtmAAAc44AAPmcAACFlQAAfMgAAPa1AAAvyAAAE8yDj3SIAAAMbElEQVR42uycWXAb9RnABcm0
		QxN46LSE0gIF4iZpp5NOyZShk4GBPvSFhzIdaIcZ0gnphJC8JIU2xW184ZLUQ1JoCqEkZWzJui3L
		ti5HtmRbtg5LjrT739VpSZZ1WLdWq8u6drcPGzTGZJwUryOF8j1pdte7sz9/3///ncuivpJbFtZX
		CO48WKVSKZVKRSKR5eVlj8fj8XiWlpbC4XA8Hi8Wi1/BonAcR1FUo9EoFAoOhzM0NKRUKpVKpeJT
		UalUUqmUzWaPjY1NTk7abLZ0Ov3/BatUKkEQJJPJ+Hy+TCbTarVms9lms8EwDABAEMTpdLpcLgRB
		AAAwDNtsNovFMj09rVAohEKhVCo1GAwYhn3JYWWz2enpaYFAMDY2ptfrIQii0dAWl0wm8/l8sViM
		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`
	},
	
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('gauge');
			this.loadCss('Gauge.css');
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
				if(self.chart){
					self.chart.setSize(self.getElement().width(), self.getElement().height(), false);
				}
			});
			this.hc.highcharts({
				chart: {
			        type: 'gauge',
			        plotBackgroundColor: null,
			        plotBackgroundImage: null,
			        plotBorderWidth: 0,
			        plotShadow: false
			    },

			    title: {
			        text: 'Speedometer'
			    },

			    pane: {
			        startAngle: -150,
			        endAngle: 150,
			        background: [{
			            backgroundColor: {
			                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			                stops: [
			                    [0, '#FFF'],
			                    [1, '#333']
			                ]
			            },
			            borderWidth: 0,
			            outerRadius: '109%'
			        }, {
			            backgroundColor: {
			                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			                stops: [
			                    [0, '#333'],
			                    [1, '#FFF']
			                ]
			            },
			            borderWidth: 1,
			            outerRadius: '107%'
			        }, {
			            // default background
			        }, {
			            backgroundColor: '#DDD',
			            borderWidth: 0,
			            outerRadius: '105%',
			            innerRadius: '103%'
			        }]
			    },

			    // the value axis
			    yAxis: {
			        min: 0,
			        max: 200,

			        minorTickInterval: 'auto',
			        minorTickWidth: 1,
			        minorTickLength: 10,
			        minorTickPosition: 'inside',
			        minorTickColor: '#666',

			        tickPixelInterval: 30,
			        tickWidth: 2,
			        tickPosition: 'inside',
			        tickLength: 10,
			        tickColor: '#666',
			        labels: {
			            step: 2,
			            rotation: 'auto'
			        },
			        title: {
			            text: 'km/h'
			        },
			        plotBands: [{
			            from: 0,
			            to: 120,
			            color: '#55BF3B' // green
			        }, {
			            from: 120,
			            to: 160,
			            color: '#DDDF0D' // yellow
			        }, {
			            from: 160,
			            to: 200,
			            color: '#DF5353' // red
			        }]
			    },

			    series: [{
			        name: 'Speed',
			        data: [80],
			        tooltip: {
			            valueSuffix: ' km/h'
			        }
			    }]
			});
			
			this.chart =  this.hc.highcharts();
		}
		
	},
	
	$server: {
	}
}