{
	$name: 'handsontable',
	$parent: 'JSB.Widgets.Control',
	$require: [],
	$client: {
	    $singleton: true,

        $bootstrap: function(){
            JSB().loadCss('tpl/handsontable/handsontable.min.css');
            JSB().loadScript('tpl/handsontable/handsontable.js');
        },
	}
}