{
	$name: 'DataCube.Query.QueryParser',

	$server: {
//		$require: [
//		    'DataCube.Query.Translators.TranslatorRegistry',
//		    'DataCube.Query.QueryUtils',
//		    'DataCube.Query.QuerySyntax',
//		    'DataCube.Query.Engine.H2Interpreter.QueryResultSet',
//		    'JSB.Store.Sql.JDBC',
//
//		    'java:org.jsbeans.datacube.RemoteQueryIterator',
//		    'java:java.util.concurrent.Callable',
//        ],
//
//        interpreterMode: false,
//		vendor: 'PostgreSQL',
//
//        path: [],
//        localPath:[],
//
//        $bootstrap: function(){
//        	TranslatorRegistry.register(this);
//        },
//
//		$constructor: function(providerOrProviders, cube){
//		    $base(providerOrProviders, cube);
//		    $this.config = {
//		    }
//		},
//
//		translatedQueryIterator: function(dcQuery, params){
//		    return $base(dcQuery, params);
//		},
//
//		executeQuery: function(translatedQuery){
//		    var store = this.providers[0].getStore();
//		    var iterator = store.asSQL().iteratedParametrizedQuery2(
//		        translatedQuery,
//		        function getValue(param) {
//		            return $this.params[param];
//		        },
//		        function getType(param) {
//		            var type = $this.getParamType(param);
//		            if (type) {
//		                return JDBC.toJdbcType(type);
//                    }
//		            return null;
//		        }
//		    );
//		    return iterator;
//        },
//
//		analyzeQuery: function(translatedQuery){
//		    var json = {
//		        translatedQuery: translatedQuery,
//		        preparedQuery: this.dcQuery,
//		        params: this.params
//		    };
//		    return {
//		        next: function(){
//                    try {
//                        return json;
//                    } finally {
//                        if (json) json = null;
//                    }
//		        },
//		        close: function(){
//		        }
//		    };
//		},
//
//		translatedQueryIterator: function(dcQuery, params){
//		    var it = $base(dcQuery, params);
//		    it.meta.id = $this.getJsb().$name+'/'+$this.vendor+'#'+JSB.generateUid();
//		    it.meta.vendor = $this.vendor;
//		    return it;
//		},
//		translateQuery: function(query) {
//
//		},
//
//		printQuery: function(query) {
//		    try {
//                $this.path.push(query);
//                $this.localPath = [];
//
//                var path = $this.path;
//
//                var info = {
//                    /// [query]
//                    isRoot: path.length == 1,
//                    /// [..., name]
//                    isAlias: !isRoot && JSB.isString(query),
//                    /// [.., name, $views, query]
//                    isView: !isRoot && path[path.length-2] == '$views' && JSB.isString(path[path.length-3],
//                    /// [.., $from, name, $views, query] or [.., $from, query]
//                    isInFrom: !isRoot && (isView ? path[path.length-4] == '$from' : path[path.length-2] == '$from'),
//                    /// [..., $union, name, $views, query] or [..., $union, query]
//                    isInUnion: !isRoot && (isView ? path[path.length-4] == '$union' : path[path.length-2] == '$union'),
//                    /// [..., $join, $left/$right, name, $views, query] or [..., $join, $left/$right, query]
//                    isInJoin: !isRoot && (isView ? path[path.length-5] == '$join': path[path.length-3] == '$join'),
//                    isLeft: isInJoin && (isView ? path[path.length-4] == '$left': path[path.length-2] == '$left'),
//                    isRight: isInJoin && (isView ? path[path.length-4] == '$right': path[path.length-2] == '$right'),
//                    /// [parentQuery, $select, ..., query]
//                    isExpression: (function(){
//                                for(var i = path.length-2; i--; i >= 0 && JSB.isString($this.path[i])) {
//                                    if (path[i] == '$select') {
//                                        return true
//                                    }
//                                }
//                            })(),
//                };
//
//                if (isAlias) {
//                    return $this.printViewName(query);
//                }
//
//                info.hasDistinct = !!query.$distinct;
//                info.hasWith     = query.$views && Object.keys(query.$views).length > 0;
//                info.hasGroupBy  = query.$groupBy && query.$groupBy.length > 0;
//                info.hasFilter   = query.$filter && Object.keys(query.$filter).length > 0 && !(query.$filter.$and && query.$filter.$and.length == 0);
//                info.hasHaving   = query.$groupBy && query.$groupBy.length > 0;
//                info.hasSort     = query.$sort && query.$sort.length > 0;
//                info.hasSort     = query.$sort && query.$sort.length > 0;
//
//
//                if (isRoot || isExpression) {
//                    return `#dot
//                    `;
//                }
//
//		    } finally {
//		        QueryUtils($this.path.pop() == query, 'Invalid query path');
//		    }
//		},
	}
}