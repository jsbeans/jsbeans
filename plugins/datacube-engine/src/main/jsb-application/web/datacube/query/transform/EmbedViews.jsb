{
	$name: 'DataCube.Query.Transforms.EmbedViews',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
	        'DataCube.Query.Transforms.QueryTransformer',
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',
		    'DataCube.Query.Visitors.ProxyVisitor',

		    'java:java.util.HashMap',
        ],

        $deprecated: 'код устарел относительно текущей версии движка',

        /**
        * Вставляет в запрос тела вьюх, удаляя $views - только простые запросы
        */
		transform: function(rootQuery, cube, arg){
//debugger
		    var config = JSB.merge({
                    embedDirectProviders:true,
                    embedDirectQueries:true,
                    embedSingleUsedViews:true,
                    embedAll:true,
                }, arg ? Config.get(arg) : {});

            function isSingleUsed(view) {
                QueryUtils.throwError(viewCount, 'Internal Error: EmbedProviderViewQueries: View count is undefined');
                return parseInt(viewCount.get(view)) == 1;
            }

		    function embedView(name, updateContext) {
                var view = this.getView(name);
                QueryUtils.throwError(view, 'EmbedProviderViewQueries: View not found: ' + name);
                if (config.embedAll
                    || view.$provider && config.embedDirectProviders
                    || isSingleUsed(view) && config.embedSingleUsedViews
                    || !QueryUtils.queryHasBody(view) && config.embedDirectQueries
                ) {
                    if (updateContext === false) {
                        return JSB.clone(view);
                    }
                    return QueryUtils.copyQuery(view, name);
                }
                return null;
		    }

            try {
                /// collect views usages count
                if (config.embedSingleUsedViews) {
                    var viewCount = new HashMap();
                    var viewsCounter = new ProxyVisitor({
                        query: {
                            before: function(query) {
                                if (JSB.isString(query.$from)) {
                                    var view = this.getView(query.$from);
                                    viewCount.put(view, parseInt(viewCount.get(view)||0) + 1);
                                }
                                if (query.$join && JSB.isString(query.$join.$left)) {
                                    var view = this.getView(query.$join.$left);
                                    viewCount.put(view, parseInt(viewCount.get(view)||0) + 1);
                                }
                                if (query.$join && JSB.isString(query.$join.$right)) {
                                    var view = this.getView(query.$join.$right);
                                    viewCount.put(view, parseInt(viewCount.get(view)||0) + 1);
                                }
                                if (query.$union) {
                                    for(var i = 0; i < query.$union.length; i++) {
                                        if (JSB.isString(query.$union[i])) {
                                            var view = this.getView(query.$union[i]);
                                            viewCount.put(view, parseInt(viewCount.get(view)||0) + 1);
                                        }
                                    }
                                }
                            }
                        }
                    });
                    viewsCounter.visit(rootQuery);
                }

                /// embed views
                var visitor = new ProxyVisitor({
                    query: {
                        before: function(query) {
                            if (JSB.isString(query.$from)) {
                                var view = embedView.call(this, query.$from);
                                if (view) {
                                    query.$from = view;
                                }
                            }
                            if (query.$join && JSB.isString(query.$join.$left)) {
                                var view = embedView.call(this, query.$join.$left);
                                if (view) {
                                    query.$join.$left = view;
                                }
                            }
                            if (query.$join && JSB.isString(query.$join.$right)) {
                                var view = embedView.call(this, query.$join.$right);
                                if (view) {
                                    query.$join.$right = view;
                                }
                            }
                            if (query.$union) {
                                for(var i = 0; i < query.$union.length; i++) {
                                    if (JSB.isString(query.$union[i])) {
                                        var view = embedView.call(this, query.$union[i], false);
                                        if (view) {
                                            query.$union[i] = view;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                visitor.visit(rootQuery);
		        return rootQuery;
            } finally{
                viewsCounter && viewsCounter.destroy();
                visitor && visitor.destroy();
            }
		},
	}
}