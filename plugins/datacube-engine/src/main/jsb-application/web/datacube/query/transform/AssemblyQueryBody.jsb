{
	$name: 'DataCube.Query.Transforms.AssemblyQueryBody',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Cost.SliceCost',
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
            var sliceViews = {};
		    QueryUtils.walkQueries(dcQuery, {
		            dcQuery: dcQuery,
		            getExternalView: function(name) {
//debugger
                        /// использовать срез и его заменители
                        var slice = QueryUtils.getQuerySlice(name, cube);
                        var slices = JSB.merge({}, QueryUtils.extractReplacementSlices(slice));
                        slices[slice.getFullId()] = slice;

                        // удалить срезы, которые уже встроены как родители для текущего зпроса
                        $this._filterEmbeddedParentSlices(slices, sliceViews, this.path);

                        /// найти лучший срез встроить в запрос
                        var usedDimensions = $this._collectUsedDimensions(queryStack);
                        JSB.merge(allUsedDimensions, usedDimensions);
                        var isJoined = this.query.$join && (
                                this.query.$join.$left == name || this.query.$join.$right == name ||
                                JSB.isObject(this.query.$join.$left) && this.query.$join.$left.$context == name ||
                                JSB.isObject(this.query.$join.$right) && this.query.$join.$right.$context == name
                        );
                        var context = isJoined ? name : this.query.$context; /// контекст, который должен быть у полей данного среза
                        /// сбор используемых полей среза-источника
                        var usedSliceFields = QueryUtils.extractInputFields(this.query);
                        if (this.query.$union && this.query.$union.indexOf(name) !== -1) {
                            $this._filterUnionTargetFields(usedSliceFields, slice);
                        }
                        if (isJoined) {
                            $this._filterJoinedTargetFields(usedSliceFields, this.query, context);
                        }
                        /// непосредственно выбор среза по полям
                        var bestSlice = $this.selectBestSlice(slices, context, usedSliceFields, usedDimensions, cube);
                        if (bestSlice != slice) {
                            // TODO потенциально может возникнуть коллизия имен вьюх, соответствующиъ срезам-аналогам
                        }
                        var body = JSB.clone(bestSlice.getQuery());
                        embeddedSlices[name] = name;
                        dcQuery.$views[name] = body;
                        if(!sliceViews[bestSlice.getFullId()]) {
                            sliceViews[bestSlice.getFullId()] = [];
                        }
                        sliceViews[bestSlice.getFullId()].push(body);

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
//debugger
                        var queryCube = QueryUtils.getQueryCube(query.$cube || cube.getId(), cube);
                        /// на случай, если запрос-однострочник
		                if (!query.$cube) {
                            var usedFields = QueryUtils.extractInputFields(query);

                            if (usedFields.length == 0) {
                                query.$from = {};
                                return;
                            }
		                }

                        // удалить срезы, которые уже встроены как родители для текущего зпроса
                        var slices = queryCube.getSlices();
                        $this._filterEmbeddedParentSlices(slices, sliceViews, this.path);

		                /// подобрать лучший подходящий срез
                        var usedSliceFields = usedFields || QueryUtils.extractInputFields(query);
                        var bestSlice = $this.selectBestSlice(slices, query.$context, usedSliceFields, usedDimensions, queryCube);
                        var body = JSB.clone(bestSlice.getQuery());
                        /// заменить в запросе источник - установить $from вместо $cube и добавить вью
                        delete query.$cube;
                        var name = query.$from = bestSlice.getFullId();
                        if (!dcQuery.$views[name]) {
                            embeddedSlices[name] = name;
                            dcQuery.$views[name] = body;
                            if(!sliceViews[name]) {
                                sliceViews[name] = [];
                            }
                            sliceViews[name].push(body);
                        }
                    }

		        },
		        function _leave(query){
		            queryStack.pop();
                }
            );

            QueryUtils.logDebug('Embedded {} slices, used dimensions {}', Object.keys(embeddedSlices).length, JSON.stringify(Object.keys(allUsedDimensions)));
        },


		selectBestSlice: function(slices, context, usedSliceFields, usedDimensions, cube){
		    var matchedSlices = $this._filterMatchedSlices(slices, context, usedSliceFields, usedDimensions);
		    if(Object.keys(slices).length == 1 && Object.keys(matchedSlices).length == 0) {
		        matchedSlices = slices;
		    }
		    var bestSlice = $this._selectTheEasiestSlice(matchedSlices, cube);
		    return bestSlice;
		},

		_filterUnionTargetFields: function(usedSliceFields, slice) {
            var sliceFields = slice.getOutputFields();
            for (var i = 0; i < usedSliceFields.length; i++) {
                var f = usedSliceFields[i];
                if (!sliceFields[f.$field]) {
                    usedSliceFields.splice(i--, 1);
                }
            }
		},

		_filterJoinedTargetFields: function(usedSliceFields, query, context) {
            /// остаются только поля с целевым контекстом
            for(var i = 0; i < usedSliceFields.length; i++) {
                var field = usedSliceFields[i];
                 if (!field.$context || field.$context !== context) {
                    usedSliceFields.splice(i--, 1);
                 }
            }
		},

		_filterEmbeddedParentSlices: function(slices, sliceViews, path) {
            for (var sid in slices) {
                var slice = slices[sid];
                var slice = slices[sid];
                var sliceEmbedQueries = sliceViews[slice.getFullId()];
                if(sliceEmbedQueries && sliceEmbedQueries.length > 0) {
                    for(var j = 0; j < sliceEmbedQueries.length; j++) {
                        var sliceQuery = sliceEmbedQueries[j];
                        if(path.indexOf(sliceQuery) !== -1) {
                            /// исключить, если срез уже встроен в родителя
                            delete slices[sid];
                        }
                    }
                }
            }

		},


		_collectUsedDimensions: function(queryStack){
		    var usedDimensions = {};

		    for(var i = queryStack.length - 1; i >= 0; i--) {
		        var query = queryStack[i];
                if (query.$cubeFilter && Object.keys(query.$cubeFilter).length > 0) {
                    QueryUtils.walkExpressionFields(query.$cubeFilter, query, true, function(name, context,sourceContext){
                        usedDimensions[name] = name;
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
                    var sliceDimensions = QueryUtils.extractSliceDimensions(slice, true);
                    for(var field in usedDimensions) {
                        if (sliceDimensions[field]) {
                            countDimensions ++;
                        }
                    }
                    if (maxDimensions < countDimensions) {
                        maxDimensions = countDimensions;
                    }

                    /// сохранить
                    resultDimensions[sid] = countDimensions;
		            resultSlices[sid] = slice;
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

//		    QueryUtils.throwError(
//		        Object.keys(resultSlices).length > 0,
//		        "Не найдено подходящего среза cо всеми используемыми выходными полями: {}",
//		        (function(){
//		            var s = '';
//		            var a = {};
//                    for(var i = 0; i < usedSliceFields.length; i++) {
//                        var field = usedSliceFields[i];
//                        if(!a[field.$field]) {
//                            a[field.$field]=1;
//                            s += (i>0?', ':'') + field.$field;
//                        }
//                    }
//                    return s;
//		        })()
//            );
		    return resultSlices;
		},

		_selectTheEasiestSlice: function(slices, cube){
		    var array = [];
		    for(var id in slices) {
		        var slice = slices[id];
                array.push(slice);
		    }

		    array.sort(function (a,b){
		        return SliceCost.compareSlices(a, b);
		    });
            return array[0];
		},
	}
}