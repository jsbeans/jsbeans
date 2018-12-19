{
	$name: 'DataCube.Query.Transforms.OrderQueryViews',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cube){
		    QueryUtils.walkQueries(dcQuery, {}, null, function(query){
		        $this.orderViews(query, dcQuery);
		    });
		    return dcQuery;
		},

        /** Упорядочить запросы в $views */
        orderViews: function(query, rootQuery) {
            if (query.$views) {
                var orderedViews = {};
                QueryUtils.walkQueries(query, {rootQuery:rootQuery}, null, function(q){
                    if (this.isView && query.$views[this.isView] == q) {
                        orderedViews[this.isView] = q;
                    }
                });
                query.$views = orderedViews;
            }
        },
	}
}