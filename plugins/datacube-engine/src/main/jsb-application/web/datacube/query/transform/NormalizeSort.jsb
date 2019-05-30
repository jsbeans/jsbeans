/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.NormalizeSort',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(executor, queryTask){
            var dcQuery = queryTask.query;
            // standardize $sort
            $this.unwrapSort(dcQuery);
		    return dcQuery;
		},


        /** Преобразует $sort: [{"field":-1}] -> $sort: [{$expr: "field", $type: -1}]
        */
        unwrapSort: function(dcQuery) {
		    QueryUtils.walkQueries(dcQuery, {getExternalView:function(){return {};}}, null, function(query){
                if (query.$sort) {
                    for(var i = 0; i < query.$sort.length; i++) {
                        var e = query.$sort[i];
                        if (!e.$expr) {
                            if(Object.keys(e).length !== 1) {
                                throw new Error('Invalid $sort definition: ' + JSON.stringify(e));
                            }
                            query.$sort[i] = {
                                $expr : Object.keys(e)[0],
                                $type: e[Object.keys(e)[0]]
                            };
                        }
                    }
                }
            });
        },
	}
}