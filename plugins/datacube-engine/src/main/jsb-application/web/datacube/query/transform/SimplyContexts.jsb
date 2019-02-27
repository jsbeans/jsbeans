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

		transform: function(dcQuery, cube){
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