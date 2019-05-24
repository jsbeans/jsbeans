/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.SqlTableNode',
	$parent: 'DataCube.DatabaseTableNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('sqlTableNode');
		}
	}
}