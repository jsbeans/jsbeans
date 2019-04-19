{
	$name: 'DataCube.Query.Visitors.SQLLoopbackTranslatorVisitor',
	$parent: 'DataCube.Query.Visitors.SQLTranslatorVisitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
			'Datacube.Types.DataTypes',
		    'java:java.util.HashMap',
        ],

		$constructor: function(query, params, cube, executor, mainDataProvider, loopbackProvider){
		    $base(query, params, cube, executor);
		    $this.mainDataProvider = mainDataProvider;
		    $this.loopbackProvider = loopbackProvider;
		    $this.loopbackQueries = new HashMap();
		},

		translate: function(){
		    return $base();
		},

		destroy: function(){
		    $this.loopbackQueries = null;
		    $this.loopbackProvider && $this.loopbackProvider.destroy();
		    $base();
		},

        visitQuery: function(query) {
            if ($this.isLoopbackGroup(query)) {
                $this.visitLoopback(query);
            } else {
                $base(query);
            }
        },

        visitField: function(field, context, sourceContext) {
            var targetQuery = $this.getQuery(context);
            $base(field, context, sourceContext);
        },

        visitLoopback: function(query) {
            if (!$this.loopbackProvider) {
                $this.breakTranslator('Loopback provider is undefined for DB vendor ' + $this.vendor);
            }

            var subQuery = $this._generateSubQuery(query);
            $this.loopbackQueries.put(query, subQuery);
            $this.printedQueries.put(query, true);
            var desc = {};
		    var queryTask = {
                remote: desc,
                cube: $this.cube,
                query: subQuery,
                params: $this.params,
                startEngine: ($this.engineConfig ? $this.engineConfig.loopbackStart : null),
            };

            switch($this.vendor) {
                case 'ClickHouse':
                    /// prepare translated sql
                    var clickhouseColumns = '';
                    for(var alias in subQuery.$select) {
                        var type = $this.getType(query.$select[alias]);
                        var jdbcType = type.nativeType || DataTypes.toVendor($this.vendor, type.type);
//                        var nativeType = QueryUtils.extractNativeType(subQuery.$select[alias], subQuery, $this.cube);
//                        var type = DataTypes.fromAny(nativeType);
//                        var jdbcType = DataTypes.toVendor($this.vendor, type);
                        if (clickhouseColumns.length > 0) {
                            clickhouseColumns += ', ';
                        }
                        clickhouseColumns += alias + ' ' + jdbcType;
                    }
                    /** URL 'Datacube.Query.Engine.ClickHouse.ClickHouseLoopbackApi' */
                    var serverUrl = Kernel.serverUrl();
                    desc.uid = $this.loopbackProvider.register(queryTask);
                    desc.sql = "url('"+serverUrl+"/datacube/query/engine/ClickHouse/ClickHouseLoopbackApi.jsb?uid=" + desc.uid + "', JSONEachRow, '" + clickhouseColumns + "')";

                    $this.print('(');
                        $this.indentInc();
                        $this.printNewLineIndent();
                        $this.print('SELECT');
                            var count = 0;
                            // print fields sql and drop nulls
                            for(var alias in subQuery.$select) {
                                if (count++ > 0) $this.print(',');
                                if (subQuery.$select[alias].$const === null) {
                                    $this.visit(subQuery.$select[alias]);
                                    $this.print('AS');
                                    $this.printQuoted(alias);
                                    delete subQuery.$select[alias];
                                } else {
                                    $this.printQuoted(alias);
                                }
                            }
                        $this.printNewLineIndent();
                        $this.print('FROM', desc.sql);
                        $this.indentDec();
                    $this.printNewLineIndent();
                    $this.print(')');
                    $this.print(' AS');
                    return $this.printDeclareContext(query.$context);

                case 'H2' :
                    desc.uid = $this.loopbackProvider.register(queryTask);
                    desc.sql = "datacube('"+desc.uid+"')";
                    var isRoot = $this.isRoot();
                    var inUnion = $this.getExpressionKey(-2) == '$union';
                    if (inUnion || isRoot) {
                        $this.print('SELECT * FROM');
                    }
                    $this.print(desc.sql);
                    $this.print(' AS');
                    return $this.printDeclareContext(query.$context);

                default:
                    $this._breakTranslator( 'Unsupported vendor "'+$this.vendor+'" for remote SQL tables');
            }
        },

        isLoopbackGroup: function(query){
            var providers = QueryUtils.extractProviders(query, $this.cube,
                function(name){
                    return $this.getQuery(name);
                }
            );
            var mainKey = $this.mainDataProvider.getStore().getJsb().$name + '/' + $this.mainDataProvider.getStore().getName();
            var singleKey;
            for(var i = 0; i < providers.length; i++) {
                var provider = providers[i];
                var key = provider.getStore().getJsb().$name + '/' + provider.getStore().getName();
                if (!singleKey) {
                    singleKey = key;
                }
                if (key != singleKey) {
                    return false;
                }
            }
            // is remote
            return singleKey != mainKey;
        },

        _generateSubQuery: function(query) {
            var subQuery = JSB.clone(query);
            subQuery.$views = subQuery.$views || {};
            for(var i = 0, len = $this.path.length; i < len; i++) {
                if (JSB.isObject($this.path[i]) && $this.path[i].$views) {
                    for(var name in $this.path[i].$views) {
                        if (!subQuery.$views[name]) {
                            subQuery.$views[name] = $this.path[i].$views[name];
                        }
                    }
                }
            }
            if (!subQuery.$limit && Config.get('datacube.query.engine.loopbackQuery.limit')) {
                var limit = 0+Config.get('datacube.query.engine.loopbackQuery.limit')
                if (limit > 0) {
                    subQuery.$limit = limit;
                }
            }
            return subQuery;
        },
    }
}