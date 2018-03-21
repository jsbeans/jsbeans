{
	$name: 'DataCube.Query.Transforms.LinkedNestedQueryOptimization',
	$parent: 'DataCube.Query.Transforms.NestedQueryOptimization',

	$server: {
		$require: [
	        'DataCube.Query.Transforms.QueryTransformer',
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

        /**
        * В отличии от базового NestedQueryOptimization при формировании вьюхи выкусывает из запроса внешние поля,
        * с их выносом в новый запрос к вьюхе
        */
		transform: function(dcQuery, cubeOrDataProvider){
            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before LinkedNestedQueryOptimization: ' + JSON.stringify(dcQuery, 0, 2));

		    var resultQuery = $this._buildViews(dcQuery);
		    return resultQuery;
		},

        _checkQueryHasView: function(query, isFromQuery){
            if (!isFromQuery && !query.$filter && !query.$groupBy /*&& !query.$from*/ && !query.$sort && !query.$distinct) {
                return false; // skip simple cube
            }

            // если в запросе внешние поля не используются или используются только в $filter
            var isIsolated = QueryUtils.checkQueryIsIsolated(JSB.merge({},query, {$filter:{}}));
            if (!isIsolated) {
                return false;
            }
            return true;
        },

        _extractViewQuery: function(query){
            var viewQuery = JSB.merge(true, {}, query, {$filter:{}});
            delete viewQuery.$select;
            delete viewQuery.$context;
            delete viewQuery.$id;
            delete viewQuery.$views;
            viewQuery.$filter = QueryUtils.extractSelfQueryFilter(query);
            if (!query.$filter) delete query.$filter;
            return viewQuery;
        },

	}
}