{
	$name: 'DataCube.Query.Translators.SQLViewsTranslator',
	$parent: 'DataCube.Query.Translators.SQLTranslator',

	$server: {
		vendor: 'PostgreSQL',
		
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.QuerySyntax',
        ],

		$bootstrap: function(){
//			TranslatorRegistry.register(this, 'DataCube.Providers.SqlTableDataProvider');
		},

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    $base(providerOrProviders, cubeOrQueryEngine);
		},

        _translateField: function(field, context, forceFieldNotAlias) {
            var sourceField = this.view.getField(field);
            var contextField = this.view.lookupField(field);

            var currentField = forceFieldNotAlias && sourceField ? sourceField : contextField;

            if (!currentField) {
                // unknown field: print as-is
                return this._quotedName(field);
            }

            if (currentField.provider) {
                return this._printTableName(currentField.provider.getTableFullName()) +
                    '.' + this._quotedName(currentField.providerField);
            }


            var query = this._getQueryByContext(context);
            var viewField = this.view.getField(field);
            // is allow use aliases
            if (!forceFieldNotAlias) {
                // is alias and not cube field as-is expression return quoted alias
                var isAlias = !!query.$select[field];
                if (isAlias && !viewField) {
                    // print alias
                    return this._quotedName(field);
                }
            }
            if (!viewField){
            }

            var nameSql = this._translateCubeField(field, context);
            // is not cube field and is alias print as is
            if (!nameSql) {
                if (forceFieldNotAlias) {
                    var query = this._getQueryByContext(context);
                    if (!!query.$select[field]) {
                        nameSql = this._quotedName(field);
                    }
                }
            }
            if (!nameSql) {
                throw new Error('Cube or provider has no field or query has no definition for alias ' + field);
            }
            return nameSql;
        },

        _translateCubeField: function(field, context){
            var viewField = this.view.getField(field);
            if (!viewField.provider) {
                throw new Error('TODO: no provider fields')
            }


            if (this.cube) {
            	var managedFields = this.cube.getManagedFields();
                if (!managedFields[field]) {
                    return null;
                }
                var fieldsMap = this.contextFieldsMap[context];
                if (!fieldsMap) {
                    throw new Error('Fields map is not defined for context ' + context);
                }
                var fieldDesc = fieldsMap[field];
                if (!fieldsMap) {
                    throw new Error('Field descriptor is not defined for context ' + context);
                }
                if (fieldDesc.tableAlias && fieldDesc.fieldAlias) {
                    return this._quotedName(fieldDesc.tableAlias) + '.' + this._quotedName(fieldDesc.fieldAlias);
                } else if (fieldDesc.providerTable && fieldDesc.providerField) {
                    return this._printTableName(fieldDesc.providerTable) + '.' + this._quotedName(fieldDesc.providerField);
                } else {
                    throw new Error('Field descriptor is wrong ' + JSON.stringify(fieldDesc));
                }
            } else {
                for(var i in this.providers){
                    if(this.providers[i].extractFields()[field]) {
                        return this._quotedName(context) + '.' + this._quotedName(field);
                    }
                }
            }
            return null;
        },

        _translateFrom: function(query) {
            // is select from sub-query
            if (query.$from) {
                return '(' + this.translateQueryExpression(query.$from) + ') AS ' + this._quotedName(query.$context);
            }

            if (this.cube) {
                return this._translateQueryCubeView(query);
            } else {
                return this._translateQueryDataProviderView(query);
            }

        },

        _translateQueryCubeView: function(query) {
            function collectProvidersAndFields(allFields, providers) {
                QueryUtils.walkCubeFields(
                    query, /**includeSubQueries=*/false, $this.cube,
                    function (cubeField, context, fieldQuery, binding) {
                        // пропустить поля из других запросов
                        if (fieldQuery == query) {
                            allFields[cubeField] = false;
                            var foundProvider = false;
                            for (var i in binding) {
                                if ($this.providers.indexOf(binding[i].provider) != -1) {
                                    foundProvider = true;
                                    var id = binding[i].provider.id;
                                    var prov = providers[id] = providers[id] || {
                                        provider: binding[i].provider,
                                        isJoinedProvider: (binding[i].provider.getMode()||'union') == 'join',
                                        cubeFields: {/**hasOtherBinding*/},
                                        providerFields: {/**providerField: cubeField*/}
                                    };
                                    var hasOtherBinding = binding.length > 1;
                                    prov.cubeFields[cubeField] = hasOtherBinding;
                                    prov.providerFields[binding[i].field] = cubeField;
                                }
                            }
                            if (!foundProvider) throw Error('Illegal iterator provider ' + binding[i].provider.name + ' for field ' + cubeField);
                        }
                    }
                );
            }
            function buildSingleTableAndFieldsMap(allFields, providers, fieldsMap){
                var singleProv = providers[Object.keys(providers)[0]];
                forEachCubeFieldBinding(allFields, function(cubeField, binding){
                    // if current provider build fieldsMap
                    if (singleProv.provider == binding.provider) {
                        fieldsMap[cubeField] = {
                            context: query.$context,
                            cubeField: cubeField,

                            providerField: binding.field,
                            providerTable: binding.provider.getTableFullName(),

                            tableAlias: query.$context,
                            fieldAlias: binding.field
                        };
                        return true;
                    }
                });
                var sql = $this._printTableName(singleProv.provider.getTableFullName()) + ' AS ' + $this._quotedName(query.$context);
                return sql;
            }
            function addJoinOnFields(allFields, providers){
                var managedFields = $this.cube.getManagedFields();
                for(var cubeField in managedFields){
                    var binding = managedFields[cubeField].binding;
                    if (binding.length > 1) {
                        // TODO: оставить только поля, участвующие в JOIN
                        var hasJoin = false;
                        for(var r = 0; r < binding.length; r++) {
                            if ($this.providers.indexOf(binding[r].provider) != -1
                                    && binding[r].provider.getMode() == 'join') {
                                hasJoin = true;
                                break;
                            }
                        }
                        if (hasJoin) {
                            for(var r = 0; r < binding.length; r++) {
                                if ($this.providers.indexOf(binding[r].provider) != -1) {
                                    allFields[cubeField] = false;
                                    var hasOtherBinding = binding.length > 1;
                                    providers[binding[r].provider.id].cubeFields[cubeField] = hasOtherBinding;
                                    providers[binding[r].provider.id].providerFields[binding[r].field] = cubeField;
                                }
                            }
                        }
                    }
                }
            }
            function forEachCubeFieldBinding(allFields, callback){
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var binding = $this.cube.getManagedFields()[cubeField].binding;
                    for (var i in binding) {
                        if(callback(cubeField, binding[i])) {
                            break;
                        }
                    }
                }

            }
            function setIsJoinedFields(allFields) {
                var managedFields = $this.cube.getManagedFields();
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var isJoined = true;
                    var managedField = managedFields[cubeField];
                    var binding = managedField.binding;
                    for (var i in binding) {
                        if ($this.providers.indexOf(binding[i].provider) != -1) {
                            if (binding[i].provider.getMode() != 'join') {
                                isJoined = false;
                            }
                        }
                    }
                    allFields[cubeField] = isJoined;
                }
            }
            function isProviderHasCubeField(providerFields, cubeField) {
                for(var f in providerFields) if(providerFields.hasOwnProperty(f)) {
                    if (providerFields[f] == cubeField) return true;
                }
                return false;
            }
            function forEachViewColumn(allFields, prov, visitField){
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var isNull = !isProviderHasCubeField(prov.providerFields, cubeField);
                    var visited = false;
                    var binding = $this.cube.getManagedFields()[cubeField].binding;
                    for (var i in binding) {
                        if (binding[i].provider == prov.provider) {
                            visitField(cubeField, isNull, binding[i]);
                            visited = true;
                            break;
                        }
                    }
                    if (!visited) {
                        visitField(cubeField, isNull, null);
                    }
                }

            }
            function buildUNIONsSqlAndFieldsMap(allFields, providers, unionsAlias, unionsFields) {
                var sqlUnions = '';
                var unionsCount = 0;
                var lastProv;
                for(var id in providers) if(providers.hasOwnProperty(id)) {
                    var prov = providers[id];
                    if ((prov.provider.getMode()||'union') != 'union') continue;
                    unionsCount++;
                    lastProv = prov;
                }
                if (unionsCount == 1) {
                    forEachCubeFieldBinding(allFields, function(cubeField, binding){
                        // if current provider build fieldsMap
                        if (lastProv.provider == binding.provider) {
                            fieldsMap[cubeField] = {
                                context: query.$context,
                                cubeField: cubeField,

                                providerField: binding.field,
                                providerTable: binding.provider.getTableFullName(),

                                tableAlias: unionsAlias,
                                fieldAlias: binding.field
                            };
                            unionsFields[cubeField] = binding.field;
                            return true;
                        }
                    });
                    sqlUnions += $this._printTableName(lastProv.provider.getTableFullName());

                } else {

                    for(var id in providers) if(providers.hasOwnProperty(id)) {
                        var prov = providers[id];
                        if ((prov.provider.getMode()||'union') != 'union') continue;
                        if (sqlUnions .length > 0) sqlUnions  += ' UNION ALL ';

                        // print unions view columns and build fieldsMap
                        var fieldsSql = '';
                        var skipNulls = false;
                        forEachViewColumn(allFields, prov,
                            function visitField(cubeField, isNull, binding){
                                if (skipNulls && isNull) {
                                    // skip field if skipNulls
                                    return;
                                }
                                if (allFields[cubeField]) {
                                    // skip isJoined fields
                                    return;
                                }

                                if (fieldsSql.length > 0) fieldsSql += ', ';
                                if (isNull) {
                                    var fieldType = $this.cube.getManagedFields()[cubeField].type;
                                    fieldsSql += 'CAST(NULL AS ' + JDBC.translateType(fieldType, $this.vendor) + ')';
                                } else {
                                    fieldsSql += $this._quotedName(binding.field);
                                }
                                fieldsSql += ' AS ' + $this._quotedName(cubeField);

                                fieldsMap[cubeField] = isNull && fieldsMap[cubeField] || {
                                    context: query.$context,
                                    cubeField: cubeField,

                                    providerField: binding && binding.field || null,
                                    providerTable: binding && binding.provider.getTableFullName() || null,

                                    tableAlias: unionsAlias,
                                    fieldAlias: cubeField
                                };
                                unionsFields[cubeField] = cubeField;
                            }
                        );

                        sqlUnions += '(SELECT ' + fieldsSql + ' FROM '+
                            $this._printTableName(prov.provider.getTableFullName()) + ')';
                    }
                }
                if (unionsCount > 1) {
                    var sql = '(' + sqlUnions + ') AS ' + $this._quotedName(unionsAlias);
                } else if (unionsCount > 0) {
                    var sql = sqlUnions + ' AS ' + $this._quotedName(unionsAlias);
                } else {
                    var sql = '';
                }
                return sql;
            }
            function extractJoinOnCubeFields(provider) {
                var fields = {};
                var managedFields = $this.cube.getManagedFields();
                for(var f in managedFields){
                    var binding = managedFields[f].binding;
                    if (binding.length > 1) {
                        for(var r = 0; r < binding.length; r++) {
                            if (binding[r].provider == provider) {
                                fields[f] = true;
                            }
                        }
                    }
                }
                return Object.keys(fields);
            }
            function buildJOINsSqlAndFieldsMap(allFields, providers, unionsAlias, hasUnions, unionsFields) {
                var sqlJoins = '';
                var firstProv;
                for(var p in providers) if(providers.hasOwnProperty(p)) {
                    var prov = providers[p];
                    if (prov.provider.getMode() != 'join') continue;
                    firstProv = firstProv || prov;

                    if (sqlJoins.length > 0) sqlJoins += ' LEFT JOIN ';

                    var joinedViewAlias = query.$context + '_joined_' + $this.providers.indexOf(prov.provider);

                    sqlJoins += $this._printTableName(prov.provider.getTableFullName());
                    sqlJoins += ' AS ' + $this._quotedName(joinedViewAlias);

                    forEachViewColumn(allFields, prov,
                        function visitField(cubeField, isNull, binding){
                            if (isNull) {
                                // skip null fields
                                return;
                            }

                            var isJoinedField = allFields[cubeField];
                            fieldsMap[cubeField] = {
                                context: query.$context,
                                cubeField: cubeField,

                                providerField: binding && binding.field || null,
                                providerTable: binding && binding.provider.getTableFullName() || null,

                                tableAlias: isJoinedField ? joinedViewAlias : unionsAlias,
                                fieldAlias: isJoinedField ? binding.field : unionsFields[cubeField],

                                joinOn: fieldsMap[cubeField] && fieldsMap[cubeField].joinOn || binding && {
                                        tableAlias: joinedViewAlias,
                                        fieldAlias: binding.field
                                    } || null
                            };
                        }
                    );

                    var sqlOn = '';
                    var joinOnFields = extractJoinOnCubeFields(prov.provider);
                    for (var i in joinOnFields) {
                        var cubeField = joinOnFields[i];
                        // is joined and without UNIONs - skip first ON
                        if (!unionsFields[cubeField] && firstProv == prov) continue;

                        if (sqlOn.length > 0) sqlOn  += ' AND ';
                        var providerField = fieldsMap[cubeField].providerField;
                        sqlOn += unionsFields[cubeField]
                                ? $this._quotedName(unionsAlias) + '.' + $this._quotedName(unionsFields[cubeField])
                                : $this._quotedName(fieldsMap[cubeField].joinOn.tableAlias) + '.' + $this._quotedName(fieldsMap[cubeField].joinOn.fieldAlias);
                        sqlOn += ' = ';
                        sqlOn += $this._quotedName(joinedViewAlias) + '.' + $this._quotedName(providerField);
                    }
                    if (sqlOn) {
                        sqlJoins += ' ON ' + sqlOn;
                    }
                }

                var sql = '';
                if (sqlJoins.length > 0) {
                    if (hasUnions) {
                        sql += ' LEFT JOIN ' + sqlJoins;
                    } else {
                        sql += sqlJoins;
                    }
                }
                return sql;
            }
// debugger;
            //      begin ...

            this.contextFieldsMap = this.contextFieldsMap || {/**queryContext: {}*/};
            var fieldsMap = this.contextFieldsMap[query.$context] = this.contextFieldsMap[query.$context] || {};

            //      collect providers and fields
            var providers = {/**providerId: {provider, providerFields:{providerField: cubeField}, cubeFields: {hasOtherBinding}}*/};
            var allFields = {/**cubeField: isJoined*/}; /**isJoined=true when field from only joined provider*/
            collectProvidersAndFields(allFields, providers);

            //      if single provider - simple SELECT from provider`s table
            if (Object.keys(providers).length == 1) {
                var sql = buildSingleTableAndFieldsMap(allFields, providers, fieldsMap);
                return sql;
            }

            //      if some providers - build UNION view and JOIN ON tables

            // and add joinOn (join keys) fields to allFields, providers.(providerFields, cubeFields)
            addJoinOnFields(allFields, providers);

            // set isJoined for allFields
            setIsJoinedFields(allFields);

            // build UNIONs
            var unionsAlias = query.$context + '_unions';
            var unionsFields = {};
            var sqlUnions = buildUNIONsSqlAndFieldsMap(allFields, providers, unionsAlias, unionsFields);

            // build JOINs
            var sqlJoins = buildJOINsSqlAndFieldsMap(allFields, providers, unionsAlias, sqlUnions.length > 0, unionsFields);

            var sql = sqlUnions + sqlJoins;
            return sql.match(/^\s+$/) ? '' : sql;
        },

        _translateQueryDataProviderView: function(query) {
            this.contextFieldsMap = this.contextFieldsMap || {/**queryContext: {}*/};
            var fieldsMap = this.contextFieldsMap[query.$context] = this.contextFieldsMap[query.$context] || {};

            if (this.providers.length != 1) {
                throw new Error('Multiple or not defined provider');
            }
            var allFields = {/**cubeField: true*/};
		    QueryUtils.walkDataProviderFields(
		        query, /**includeSubQueries=*/false, this.providers[0],
		        function(field, context, fieldQuery){
		            if (fieldQuery == query) {
                        allFields[field] = (allFields[field]||0) + 1;
                    }
                }
            );
            var sql = '(SELECT ';
            var fieldsSql = '';
            for(var providerField in allFields) if(allFields.hasOwnProperty(providerField)) {
                if (fieldsSql.length > 0) fieldsSql += ', ';
                fieldsSql += this._quotedName(providerField);
                fieldsSql += ' AS ' + this._quotedName(providerField);
                fieldsMap[providerField] = {
                    context: query.$context,
                    cubeField: providerField,

                    providerField: providerField,
                    providerTable: this.providers[0].getTableFullName(),

                    tableAlias: query.$context,
                    fieldAlias: providerField
                };
            }
            if (fieldsSql.length == 0) fieldsSql += 'NULL';

            sql += fieldsSql + ' FROM ' + $this._printTableName(this.providers[0].getTableFullName());
            sql += ') AS ' + this._quotedName(query.$context);
            return sql;
        },
	}
}