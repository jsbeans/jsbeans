{
	$name: 'DataCube.Widgets.LineCharts',
	$parent: 'DataCube.Widgets.BaseHighchart',
	//$expose: {},
	$scheme: {
        series: {
	        render: 'group',
	        name: 'Серии',
            collapsable: true,
            multiple: true,
            items: {
                seriesItem: {
                    render: 'group',
                    name: 'Серия',
                    collapsable: true,
                    items: {
                        name: {
                            render: 'dataBinding',
                            name: 'Имя серии или значения',
                            linkTo: 'source'
                        },
                        data: {
                            render: 'dataBinding',
                            name: 'Данные',
                            linkTo: 'source'
                        },
                        type: {
                            render: 'select',
                            name: 'Тип',
                            items: {
                                area: {
                                    name: 'Area'
                                },
                                line: {
                                    name: 'Line'
                                },
                                column: {
                                    name: 'Column'
                                },
                                spline: {
                                    name: 'Spline'
                                }
                            }
                        }
                    }
                }
            }
        }
	},
	$client: {
	    refresh: function(opts){
            var dataSource = $base(opts);
            if(!dataSource){
                return;
            }

            // todo: globalFilters

            this.getElement().loader();
            this.fetchBinding(dataSource, { readAll: true, reset: true }, function(res){
                try{

                } catch(ex){
                    console.log('Load data exception!');
                    console.log(ex);
                } finally{
                    $this.getElement().loader('hide');
                }
            });
	    },

	    _buildChart: function(data){
	        var baseChartOpts = $base();

	        try{
	            var chartOpts = {
	                chart: {
	                    polar: true
	                }
	            }

	            chartOpts = JSB.merge(true, baseChartOpts, chartOpts);

                if(this.chart){
                    this.chart.update(chartOpts);
                } else {
                    this.chart = Highcharts.chart(this.container.get(0), chartOpts);
                }
	        } catch(ex){
                console.log('Build chart exception!');
                console.log(ex);
	        }
	    }
	}
}