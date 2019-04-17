{
	$name: 'DataCube.Query.Engine.SQL.StoreEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Console',
        ],

		produceLazyIterator: function(translatorInputQuery, translatedQuery, params, executor, mainProvider){
		    var vendor = mainProvider.getStore().getVendor();
		    var iterator = null;
            var it = {
                next: function(){
                    try {
                        if (!iterator) {
                            iterator = $this.executeQuery(translatedQuery, params, mainProvider);
                            var obj = iterator.next();
                            Console.message({
                                message: 'query.executed.first_row',
                                params:{
                                    executor: executor.getId(),
                                    fields: obj ? Object.keys(obj) : [],
                                    timestamp: Date.now(),
                                    iterator: this.meta.id,
                                    firstResultTime: (Date.now() - executor.startedTimestamp)/1000,
                                    //query: dcQuery,
                                },
                            });
                            return obj;
                        }
                        return iterator.next();
                    } catch(e) {
                        this.close();
                        throw e;
                    }
                },
                close:function(){
                    iterator && iterator.close();
                },
                meta: {
                    id: $this.getJsb().$name+'/'+vendor+'#'+JSB.generateUid(),
                    vendor: vendor,
                    params: params,
                    translatorName: $this.getJsb().$name,
                    translatorInputQuery: translatorInputQuery,
                    translatedQuery: '\n'+translatedQuery,
                }
            };
            return it;
		},

		executeQuery: function(translatedQuery, mainProvider){
		    QueryUtils.throwError(0, 'Not implemented: StoreEngine.executeQuery()');
        },
	}
}