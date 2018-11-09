{
	$name: 'DataCube.Query.Transforms.EmbedViewQueries',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
	        'DataCube.Query.Transforms.QueryTransformer',
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        $deprecated: 'код устарел относительно текущей версии движка',

        /**
        * Вставляет в запрос тела вьюх, удаляя $views
        */
		transform: function(dcQuery, cubeOrDataProvider){

//            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before EmbedViewQueries: ' + JSON.stringify(dcQuery));

		    $this._embedViews(dcQuery);

		    return dcQuery;
		},


        _embedViews: function (dcQuery) {
            function walk(exp, views) {
                if (exp == null) {
                } else if (typeof exp === 'object') {
                    if (exp.$select) {
                        // if query has views
                        if (exp.$views && Object.keys(exp.$views).length) {
                            // add new views and remove field
                            views = JSB.merge({}, views||{}, exp.$views);
                            delete exp.$views;
                            // walk views
                            walk(exp.$views, views);
                        }

                        // if query to view
                        if (exp.$from && typeof exp.$from === 'string') {
                            // embed view query to $from
                            var view = views[exp.$from];
                            QueryUtils.throwError(view, 'Internal error: EmbedViewQueries: View not found: ' + exp.$from);
                            exp.$from = JSB.clone(view);
                        }
                    }
                    for(var i in exp) if (exp.hasOwnProperty(i)) {
                        walk(exp[i], views);
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i = 0; i < exp.length; i++){
                        walk(exp[i], views);
                    }
                }
            }

            walk(dcQuery, null);
        },
	}
}