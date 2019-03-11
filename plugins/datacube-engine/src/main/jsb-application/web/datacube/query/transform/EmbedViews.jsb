{
	$name: 'DataCube.Query.Transforms.EmbedViews',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
	        'DataCube.Query.Transforms.QueryTransformer',
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',
		    'DataCube.Query.Visitors.Visitors',

		    'java:java.util.HashMap',
        ],

        $deprecated: 'код устарел относительно текущей версии движка',

        /**
        * Вставляет в запрос тела вьюх, удаляя $views - только простые запросы
        */
		transform: function(rootQuery, cube, arg){
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
                    || !QueryUtils.queryHasBody(view) && config.embedDirectQueries
                    || config.embedSingleUsedViews && isSingleUsed(view)
                ) {
                    return updateContext === false
                        ? JSB.clone(view)
                        : QueryUtils.copyQuery(view, name);
                }
                usedViews.push(view);
                return null;
		    }

            /// collect views usages count
            if (config.embedSingleUsedViews) {
                var viewCount = new HashMap();
                Visitors.visitProxy(rootQuery, {
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

            }

            /// embed views
            var usedViews = [];
            Visitors.visitProxy(rootQuery, {
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
                    },
                    after: function(query) {
                        if (query.$views) {
                            for(var name in query.$views) {
                                if (usedViews.indexOf(query.$views[name]) == -1) {
                                    delete query.$views[name];
                                }
                            }
                        }
                    },
                }
            });
            return rootQuery;
		},
	}
}