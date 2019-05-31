/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
        ],

		transform: function(executor, queryTask){
            var dcQuery = queryTask.query;
		    return dcQuery;
		},
	}
}