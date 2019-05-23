/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.DefineContexts',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'java:java.util.HashMap',
        ],

		transform: function(rootQuery, cubeOrDataProvider){

            // ensure queries has defined $context
            $this.defineContexts(rootQuery);
		    return rootQuery;
		},

		defineContexts: function(rootQuery) {

            var contextDuplicates = {/**"context": []*/};
            var queries = [];
            var queryParents = new HashMap();
            function registerQuery(q) {
                if(!contextDuplicates[q.$context]) {
                    contextDuplicates[q.$context] = [];
                    queries.push(q);
                }
                if (contextDuplicates[q.$context].indexOf(q) == -1) {
                    contextDuplicates[q.$context].push(q);
                }
            }
            function printDuplicates(){
                var s = '{';
                for(var c in contextDuplicates) {
                    '\n\t' + c + ': ' + contextDuplicates[c].length;
                }
                return s + '}\n';
            }

		    QueryUtils.walkQueries(rootQuery, {getExternalView:function(){return {};}}, null,
                function leaveCallback(query){
                    if (!query.$context) {
                        query.$context = JSB.generateUid();
                    }
                    var parent = this.path[this.path.length-1] == query
                        ? this.path[this.path.length-2]
                        : this.path[this.path.length-1];
                    queryParents.put(query, parent);
                    registerQuery(query);
                }
            );

            /// порядок важен - от листьев к корню
            for(var i = 0; i < queries.length; i++) {
                var query = queries[i];
                if (contextDuplicates[query.$context].length > 1){
                    var oldContext = query.$context;
                    var newContext = oldContext + '##' + JSB.generateUid();

                    /// замена контекста в самом запросе (все упоминания $context)
                    QueryUtils.updateContext(query, oldContext, newContext);

                    var parent = queryParents.get(query);

                    /// update parent ($join, $recursive)
                    if (parent) {
                        if (parent.$join && parent.$join.$left == query
                            || parent.$join && parent.$join.$right == query
                            || parent.$recursive && parent.$recursive.$start == query
                            || parent.$recursive && parent.$recursive.$joinedNext == query
                        ) {
                            QueryUtils.updateContext(parent, oldContext, newContext, function(e){
                                return e != query;
                            });
                        }
                    }


                }

            }
		},
	}
}