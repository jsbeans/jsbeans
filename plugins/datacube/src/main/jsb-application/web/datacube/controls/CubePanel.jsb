{
	$name: 'DataCube.CubePanel',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $constructor: function(opts){
            $base(opts);

            this.loadCss('CubePanel.css');
            this.addClass('cubePanel');
        }
    }
}