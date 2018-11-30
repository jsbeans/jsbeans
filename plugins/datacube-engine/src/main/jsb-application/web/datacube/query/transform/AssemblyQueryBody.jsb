{
	$name: 'DataCube.Query.Transforms.AssemblyQueryBody',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Weight.QueryWeigher',
        ],

        $constructor: function(){
            $base();
        },

        /** Формирует основное тело запроса в полной форме. Встраивает в запрос все внешние источники (срезы и кубы),
            в частности:
            1) заменяет ссылку на срез в $from/$left/$right/$union на локальную вью в $views
            2) вместо $cube подставляет подходящую вьюху в $views
            3) подбор запроса для новой вью выполяется с учетом:
                а) перечня использьзуемых полей в запросе, ссылающемся на срез - все используемые поля должны быть в $select среза
                б) перечня используемых в глобальном срезе измерений - выбираются срезы с максимальным числом совпавших измерений
        */
		transform: function(dcQuery, cube){
//debugger;
            $this.assemblyQuery(dcQuery, cube);
            return dcQuery;
		},


		assemblyQuery: function(dcQuery, cube){
            var queryStack = [];
            var allUsedDimensions = {};
            dcQuery.$views = dcQuery.$views || {};
            var embeddedSlices = {};
		    QueryUtils.walkQueries(dcQuery, {
		            dcQuery: dcQuery,
		            getExternalView: function(name) {
                        /// использовать срез и его заменители
                        var slice = QueryUtils.getQuerySlice(name, cube);
                        var slices = JSB.merge({}, QueryUtils.extractReplacementSlices(slice));
                        slices[slice.getId()] = slice;

                        /// найти лучший срез встроить в запрос
                        var usedDimensions = $this._collectUsedDimensions(queryStack);
                        JSB.merge(allUsedDimensions, usedDimensions);
                        var usedSliceFields = QueryUtils.extractInputFields(this.query);
                        var context = // контекст, который должен быть у полей данного среза
                                this.query.$join && (
                                    this.query.$join.$left == name || this.query.$join.$right == name ||
                                    JSB.isObject(this.query.$join.$left) && this.query.$join.$left.$context == name ||
                                    JSB.isObject(this.query.$join.$right) && this.query.$join.$right.$context == name
                                )
                                ? name
                                : this.query.$context;
                        dcQuery.$views[name] = $this.assemblyBestSlice(slices, context, usedSliceFields, usedDimensions, cube);
                        embeddedSlices[name] = name;

                        return dcQuery.$views[name];
		            }
		        },
		        function _enter(query) {
		            queryStack.push(query);
                    //
                    var usedDimensions = $this._collectUsedDimensions(queryStack);
                    JSB.merge(allUsedDimensions, usedDimensions);

                    /// если запрос к кубу
		            if (query.$cube || !query.$from && !query.$provider && !query.$join && !query.$union && !query.$recursive) {
                        var queryCube = QueryUtils.getQueryCube(query.$cube || cube.getId(), cube);
                        /// на случай, если запрос-однострочник
		                if (!query.$cube) {
                            var usedFields = QueryUtils.extractInputFields(query);

                            if (usedFields.length == 0) {
                                query.$from = {};
                                return;
                            }
		                }

		                /// подобрать лучший подходящий срез
                        var usedSliceFields = QueryUtils.extractInputFields(query);
                        var body = $this.assemblyBestSlice(queryCube.getSlices(), query.$context, usedSliceFields, usedDimensions, queryCube);
                        /// заменить в запросе источник - установить $from вместо $cube и добавить вью
                        delete query.$cube;
                        var name = query.$from = body.$context;
                        if (!dcQuery.$views[name]) {
                            embeddedSlices[name] = name;
                            dcQuery.$views[name] = body;
                        }
                    }

		        },
		        function _leave(query){
		            queryStack.pop();
                }
            );

            QueryUtils.logDebug('Embedded {} slices, used dimensions {}', embeddedSlices, JSON.stringify(Object.keys(allUsedDimensions)));
        },


		assemblyBestSlice: function(slices, context, usedSliceFields, usedDimensions, cube){
		    var matchedSlices = $this._filterMatchedSlices(slices, context, usedSliceFields, usedDimensions);
		    var bestSlice = $this._selectTheEasiestSlice(slices, cube);
		    var query = JSB.clone(bestSlice.getQuery());
		    return query;
		},

        _collectUsedDimensions: function(queryStack){
		    var usedDimensions = {};

		    for(var i = queryStack.length - 1; i >= 0; i--) {
		        var query = queryStack[i];
                if (query.$cubeFilter && Object.keys(query.$cubeFilter).length > 0) {
                    QueryUtils.walkExpressionFields(query.$cubeFilter, query, true, function(name, context){
                        usedDimensions[field] = field;
                    });
                }
		    }
            return usedDimensions;
        },

		_filterMatchedSlices: function(slices, context, usedSliceFields, usedDimensions) {
		    var resultSlices = {};
		    var resultDimensions = {};
		    var maxDimensions = 0;

            for(var sid in slices) {
		        var slice = slices[sid];
		        var sliceQuery = slice.getQuery();
		        var sliceFields = QueryUtils.extractOutputFields(sliceQuery);
		        /// проверка, чтобы срез имел все используемые поля
		        var allFields = true;
		        for(var i = 0; i < usedSliceFields.length; i++) {
		            var field = usedSliceFields[i];
		            /// проверяется только относящиеся к данному источнику
		            if (!field.$context || field.$context == context) {
                        if (!sliceFields[field.$field]) {
                            allFields = false;
                            break;
                        }
		            }
		        }

		        // если все поля найдены
		        if (allFields) {
		            /// высчитать число соваввших измерений
                    var countDimensions = 0;
                    var sliceDimensions = QueryUtils.extractSliceDimensions(slice);
                    for(var field in usedDimensions) {
                        if (sliceDimensions[field]) {
                            countDimensions ++;
                        }
                    }
                    if (maxDimensions < countDimensions) {
                        maxDimensions = countDimensions;
                    }

                    /// сохранить
                    resultDimensions[slice.getId()] = countDimensions;
		            resultSlices[slice.getId()] = slice;
		        }
		    }

		    if (Object.keys(usedDimensions).length > maxDimensions && Object.keys(resultSlices).length > 0) {
		        QueryUtils.logDebug("Лучший срез экспортирует меньше змерений, чем используется в запросе: {}", JSON.stringify());
            }

            /// оставить только срезы с максимальным числом совпавших измерений
		    for(var sid in resultDimensions) {
		        var count = resultDimensions[sid];
		        if (count != maxDimensions) {
		            delete resultSlices[sid];
		        }
            }

		    QueryUtils.throwError(
		        Object.keys(resultSlices).length > 0,
		        "Не найдено подходящего среза c используемыми выходными полями: {}"
            );
		    return resultSlices;
		},

		_selectTheEasiestSlice: function(slices, cube){
		    var weights = {};
		    var array = [];
		    for(var id in slices) {
		        var slice = slices[id];
                var id = slice.getId();
                weights[id] = $this._calculateSliceWeight(slice);
                array.push(slice);
		    }

		    array.sort(function min2max(a,b){
		        var aId = a.getId();
		        var bId = b.getId();
		        var aW = weights[aId];
		        var bW = weights[bId];
		        if (aW > bW) return 1;
		        if (aW < bW) return -1;
		        return 0;
		    });
            return array[0];
		},

		_calculateSliceWeight: function(slice) {
            var w = QueryWeigher.calculateSliceWeight(slice);
            return w;
		},
	}
}