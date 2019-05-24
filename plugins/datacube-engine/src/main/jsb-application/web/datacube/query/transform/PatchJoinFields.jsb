/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.PatchJoinFields',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'java:java.util.HashMap',
		    'DataCube.Query.Visitors.Visitors',
        ],

		transform: function(rootQuery, cube){
		    var slices = new HashMap();
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name){
                    var slice = QueryUtils.getQuerySlice(name, cube);
                    QueryUtils.throwError(slice, 'Query slice or named view is undefined: ' + name);
                    slices.put(slice.getQuery(), true);
                    return slice.getQuery();
                },
                query: {
                    before: function(query){
                        if (slices.get(query)) {
                            this.skip = true;
                        }
                    }
                },
                field: {
                    before: function(field, context, sourceContext) {
//if (field == "Код ВМО" && (context == "a1f2f44103d7d846942093298e288643/8af3e43759ee6568935d7cd00e250540"
//|| context == "a1f2f44103d7d846942093298e288643/cb6598541b32e127c637ca3867612735"))
//debugger;
                        if (!sourceContext) {
                            var exp = this.getCurrent();
                            if (exp.$sourceContext) throw 'Illegal state';

                            if (!JSB.isObject(exp)) {
                                return;
                            }
                            QueryUtils.throwError(exp.$field, 'PatchJoinFields: Invalid field expression');

                            var callerQuery = this.getQuery();
                            var targetQuery = this.getQuery(context);

                            function patch(q, isForeign){
                                if (exp.$context) {
                                    exp.$sourceContext = exp.$context;
                                    if (!isForeign) {
                                        delete exp.$context;
                                    }
                                } else {
                                    /// если источник не указан явно, подбирается первый, где есть такое поле
                                    /// если не right join, то левый потом правый иначе наоборот
                                    if (q.$join.$joinType.indexOf('right') == -1 && this.getQuery(q.$join.$left).$select[field]) {
                                        exp.$sourceContext = JSB.isString(q.$join.$left) ? q.$join.$left : q.$join.$left.$context;
                                    } else if (this.getQuery(q.$join.$right).$select[field]) {
                                        exp.$sourceContext = JSB.isString(q.$join.$right) ? q.$join.$right : q.$join.$right.$context;
                                    } else if (this.getQuery(q.$join.$left).$select[field]) {
                                         exp.$sourceContext = JSB.isString(q.$join.$left) ? q.$join.$left : q.$join.$left.$context;
                                     }
                                }
                            }

                            /// if self fields in $join query
                            if (callerQuery.$join) {
                                if(callerQuery.$join.$left == context
                                    || callerQuery.$join.$left == targetQuery
                                    || callerQuery.$join.$right == context
                                    || callerQuery.$join.$right == targetQuery)
                                {
                                    patch.call(this, callerQuery);
                                }
                            }
                            /// if foreign field of $join query in sub-query
                            var parents = this.getNestedParentQueries();
                            for(var i = 0; i < parents.length; i++) {
                                var parent = parents[i];
                                if (parent.$join) {
                                    if(parent.$join.$left == context
                                        || parent.$join.$left == targetQuery
                                        || parent.$join.$right == context
                                        || parent.$join.$right == targetQuery)
                                    {
                                        patch.call(this, parent, true);
                                    }
                                }
                            }
                            /// if join field context is undefined
                            if(targetQuery == callerQuery && targetQuery.$join && !exp.$context) {
                                patch.call(this, callerQuery);
                            }
                        }
                    }
                }
            });
		    return rootQuery;
		},
	}
}