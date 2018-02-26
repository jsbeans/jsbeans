{
    $name: 'DataCube.Widgets.PieChart',
    $parent: 'DataCube.Widgets.BaseHighchart',
    //$expose: {},
    $scheme: {

    },
    $client: {
        refresh: function(opts){
            var dataSource = $base(opts);
            if(!dataSource){
                return;
            }
        },

        _buildChart: function(data){
            var baseChartOpts = $base();
        }
    }
}