{
	$name: 'DataCube.Query.Engine.ItBuilder',

	$server: {
		$require: [
		    'DataCube.Providers.SqlTableDataProvider',

		    'DataCube.Query.Translators.TranslatorRegistry',

		    'DataCube.Query.Views.CubeView',
		    'DataCube.Query.Views.DataProviderView',
		    'DataCube.Query.Views.JoinView',
		    'DataCube.Query.Views.UnionsView',

		    'DataCube.Query.Engine.Cursors.EmptyCursor',
		    'DataCube.Query.Engine.Cursors.CachedCursor',
		    'DataCube.Query.Engine.Cursors.IteratorCursor',
		    'DataCube.Query.Engine.Cursors.QueryCursor',
		    'DataCube.Query.Engine.Cursors.PipeCursor',
		    'DataCube.Query.Engine.Cursors.UnionsCursor',
		    'DataCube.Query.Engine.Cursors.JoinCursor',

		    'DataCube.Query.Engine.RuntimeFunctions',

		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',

            'java:java.util.HashMap'
        ],

		$constructor: function(queryExecutor){
			$this.queryExecutor = queryExecutor;
            $this.query         = queryExecutor.query;
			$this.profiler = queryExecutor.profiler;
			$this.qid      = queryExecutor.qid;

            $this.useCache = false;
			$this.translateOnlyProviders = /*true; //*/Config.has('datacube.queryengine.translateOnlyProviders') && Config.get('datacube.queryengine.translateOnlyProviders');

            $this.profiler && $this.profiler.start();
		},

        /** Build root and nested cursor
        */
		build: function(){
		    $this.profiler && $this.profiler.profile('Build root cursor started');
		    return $this.rootCursor = $this.buildQueryCursor($this.query, /**root*/null);
		},

		buildEmptyCursor: function(callerCursor) {
		    return new EmptyCursor();
		},

		buildProviderCursor: function(providerId, callerCursor) {
		    return new EmptyCursor();
		},

		buildQueryCursor: function(query, callerCursor) {
		    if (JSB.isString(query)) {
		        QueryUtils.throwError($this.query.$views, 'Query $views is undefined');
		        var name = query;
		        query = $this.query.$views[name];
		        QueryUtils.throwError(query, 'View query is undefined: {}', name);
		    }

		    /// first: try translate whole query as-is
            if (!$this.translateOnlyProviders || query.$provider) {
                var translatedIt = $this.queryExecutor.tryTranslateQuery(query);
                if (translatedIt) {
                    var cursor = new IteratorCursor(function(){
                        if (translatedIt) {
                            // use pre-created
                            var it = translatedIt;
                            translatedIt = null;
                        } else {
                            // recreate
                            var it = $this.queryExecutor.tryTranslateQuery(query);
                        }
                        return it;
                    });
                    $this.profiler && $this.profiler.profile('DB translated cursor created for {}', query.$context);
                    return cursor;
                }
                QueryUtils.throwError(cursor || !query.$provider, 'Data provider cursor not translated for {}', query.$context);
            }

            /// second: build interpreted cursor

            var cursor = new QueryCursor(query);
            cursor.build($this);
            $this.profiler && $this.profiler.profile( 'Query interpreted cursor created for {}', query.$context);
            return cursor;
		},
	}
}