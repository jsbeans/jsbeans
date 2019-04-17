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

        /**
        * Вставляет в запрос тела вьюх согласно конфигу
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
                        : QueryUtils.copyQuery(view, updateContext);
                }
                usedViews.push(view);
                return null;
		    }

            /// collect views usages count
            if (config.embedSingleUsedViews && !config.embedAll) {
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
            var renameSourceContext = new HashMap();
            Visitors.visitProxy(rootQuery, {
                query: {
                    before: function(query) {
                        if (JSB.isString(query.$from)) {
                            var context = query.$from + '#' + JSB.generateUid().substr(0,4);
                            var view = embedView.call(this, query.$from, context);
                            if (view) {
                                query.$from = view;
                            }
                        }
                        if (query.$join && JSB.isString(query.$join.$left)) {
                            var context = query.$join.$left + '#' + JSB.generateUid().substr(0,4);
                            var view = embedView.call(this, query.$join.$left, context);
                            if (view) {
                                if (!renameSourceContext.get(query)) renameSourceContext.put(query, {});
                                JSB.merge(renameSourceContext.get(query), {oldLeft: query.$join.$left, newLeft:context});
                                query.$join.$left = view;
                            }
                        }
                        if (query.$join && JSB.isString(query.$join.$right)) {
                            var context = query.$join.$right + '#' + JSB.generateUid().substr(0,4);
                            var view = embedView.call(this, query.$join.$right, context);
                            if (view) {
                                if (!renameSourceContext.get(query)) renameSourceContext.put(query, {});
                                JSB.merge(renameSourceContext.get(query), {oldRight: query.$join.$right, newRight:context});
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
                        renameSourceContext.remove(query);

                        if (query.$views) {
                            for(var name in query.$views) {
                                if (usedViews.indexOf(query.$views[name]) == -1) {
                                    delete query.$views[name];
                                }
                            }
                        }
                    },
                },
                field: {
                    before: function(field, context, sourceContext) {

                        var targetQuery = this.getQuery(context);
                        if (renameSourceContext.get(targetQuery)) {
                            var rename = renameSourceContext.get(targetQuery);
                            if (rename.oldLeft == sourceContext) {
                                this.getCurrent().$sourceContext = rename.newLeft;
                            }
                            if (rename.oldRight == sourceContext) {
                                this.getCurrent().$sourceContext = rename.newRight;
                            }
                        }
                    }
                }
            });
            return rootQuery;
		},
	}
}