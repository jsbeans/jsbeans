/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.SimplyContexts',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

        $constructor: function(){
            $base();
        },

		transform: function(executor, queryTask){
            var dcQuery = queryTask.query;
		    var contexts = {};
            QueryUtils.walkQueries(dcQuery, {}, null, function(query){
                if (!contexts[query.$context]) {
                    contexts[query.$context] = '#'+Object.keys(contexts).length;
                }
            });

            for(var oldContext in contexts) {
                QueryUtils.updateContext(dcQuery, oldContext, contexts[oldContext]);
            }
            return dcQuery;
		},
	}
}