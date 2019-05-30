/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.NormalizeViewsContext',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

        /** приведение контекстов и названий в $views к равенству */
		transform: function(executor, queryTask){
            var dcQuery = queryTask.query;
            var cube = queryTask.cube;
            var count = 0;
		    QueryUtils.walkQueries(dcQuery, {getExternalView:function(){return {};}}, null, function(query){
                if (query.$views) {
                    for(var name in query.$views) {
                        if (!query.$views[name].$context) {
                            query.$views[name].$context = 'view' + count++;
                        }
                        QueryUtils.updateContext(query.$views[name], query.$views[name].$context, name);
                    }
                }
		    });
		    return dcQuery;
		},
	}
}