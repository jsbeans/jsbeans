{
	$name: 'DataCube.Query.ViewsExtractor',

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        views: {},
        viewIdsOrder: [],


        getViews: function () {
            return this.views;
        },

        getViewIdsOrder: function () {
            return this.viewIdsOrder;
        },

        /** Поиск в запросах одинаковых шаблонов, и замена запросами к шаблонной вью.
        * Выносятся повторно используемые фильтры и группировки.
        *
        * 1) Рассматривается лобой тип запроса: к кубу, к подзапросу.
        * 2) Шаблон должен включать хотя бы что-то одно:
        *    - $groupBy без использования полей родительского запроса;
        *    - $filter без использования полей родительского запроса.
        *  3) Если $filter содержит условия на поля чужого запроса (по И по отношению к остальным условиям),
        *     эти условия удаляются и в шаблон не попадают.
        *  4) Для каждого шаблона сохраняется:
        *     - тело самого шаблона (подзапроса)
        *     - выражения, оформленные в виде выходных полей с новыми названиями
        *     - число использований шаблона
        *
        *  Алгоритм:
        *  1) Сначала собрать все шаблоны, удовлетворяющие условиям, сохраняя порядок.
        *  2) Заменить тела запросов запросами к своей вью/шаблону.
        *  3) Начиная с первого найти вхождения шаблона в шаблон (подзапрос к подзапросу) только,
        *     если индекс родительского больше индекса дочернего (чтобы не нарушался порядок).
        *  4) Для каждого вхождения заменить тело шаблона запросом к подзапросу (предыдущему шаблону).
        */
        extractViews: function (dcQuery) {
            dcQuery = JSB.merge(true, {}, dcQuery);

            var views = $this.views;
            var viewIdsOrder = $this.viewIdsOrder;

            ///
            $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                if (query.$sql) {
                    return; // skip embedded SQL query
                }
                if (!$this._hasView(query)) {
                    return; // skip no view query
                }

                // build view body
                var view = $this._buildViewBody(query);
                // add view fields with used expressions
                $this._addViewFields(view, query);
                // update existed view
                views[view.id] = $this._mergeViews(views[view.id], view);
                views[view.id].uses++;
                if (viewIdsOrder.indexOf(view.id) == -1) viewIdsOrder.push(view.id);

                // rebuild query (2)
                var newQuery = $this._rebuildQueryFromView(query, view);
                $this._replace(query, newQuery);
            });

            // optimize views
            for(var i in viewIdsOrder) {
                var vid = viewIdsOrder[i];
                var view = views[vid];

                for(var j = i+1; j < viewIdsOrder.length; i++) {
                    var nextVid = viewIdsOrder[j];
                    var nextView = viewIdsOrder[nextVid];
                    if($this._isQueryContainsView(nextView.query, view)) {
                        // add view fields with used expressions
                        $this._addViewFields(view, nextView.query);

                        // rebuild query (2)
                        var newQuery = $this._rebuildQueryFromView(nextView.query, view);
                        $this._replace(nextView.query, newQuery);
                        view.uses++;
                    }
                }
            }

            return dcQuery;
        },

        /** Возвращает true, если из запроса может быть извлечена view*/
        _hasView: function (query) {
            // если не содержит $groupBy или $filter
            if (!(query.$groupBy && query.$groupBy.length > 0)
                    && !(query.$filter && Object.keys(query.$filter).length ==1)
                    /**&& !query.$from*/) {
                return false;
            }
            // есди $groupBy включает поля внешнего запроса
            if (query.$groupBy && query.$groupBy.length > 0) {
                var fields = QueryUtils.extractFields(query.$groupBy, false);
                for (var name in fields) {
                    var field = fields[name];
                    if (field.$context && field.$context != query.$context) {
                        return false;
                    }
                }
            }
//            if (query.$filter && query.$filter.length > 0) {
//                var fields = QueryUtils.extractFields(query.$filter, false);
//                for (var name in fields) {
//                    var field = fields[name];
//                    if (field.$context && field.$context != query.$context) {
//                        return false;
//                    }
//                }
//            }

            return true;
        },

        /** Возвращает true, если запрос содержит вью (query.$filter через И включает view.$filter)
        */
        _isQueryContainsView: function (query, view) {
            function checkQueryAnd(cond){
                if(cond.$and) {
                    for(var i in cond.$and) {
                        if (JSB.isEqual(cond.$and[i], view.$filter)) {
                            return true;
                        }
                        if (cond.$and[i].$and) {
                            if(checkQueryAnd(cond.$and[i].$and)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            if (!JSB.isEqual(view.query.$groupBy, query.$groupBy)) {
                return false;
            }
            if (view.query.$filter == query.$filter || JSB.isEqual(view.query.$filter, query.$filter)) {
                return true;
            }
            // works only with standardized filters
            if (view.query.$filter == null && query.$filter != null || view.query.$filter != null && query.$filter == null) {
                return false;
            }
            if (checkQueryAnd(view.query.$filter)) {
                return true;
            }


            return false;
        },

        /** Проходит рекурсивно по левому объекту и удаляет из него правый объект -
        * если все поля правого объекта рекурсивно соответствуют полям левого объекта
        * или какого-либо его дочернего, они удаляются.
        */
        _extractDifferObject: function(left, right) {
            // null - is left not match/contains right
            // {... } - difference [left] - [right]

            if (!JSB.isObject(left) && !JSB.isArray(left) || !JSB.isObject(right)) {
                throw new Error('Invalid comparable objects types');
            }

            left = JSB.isArray(left) ? JSB.merge(true, [], left) : JSB.merge(true, {}, left);

            function walkMatchedObject(obj) {
                var matched = true;
                for (var k in right) {
                    if (typeof obj[k] === 'undefined' || !JSB.isEqual(obj[k], right[k])) {
                        matched = false;
                    }
                }
                if (matched) {
                    for (var k in right) {
                        delete obj[k];
                    }
                }
                return matched;
            }

            function walk(obj) {
                var contains = false;
                if (JSB.isObject(obj)) {
                    // try match
                    var matched = walkMatchedObject(obj);
                    if (matched) {
                        contains = true;
                    } else {
                        // try contains
                        for (var k in obj) {
                            var cont = walk(obj[k]);
                            if(cont) {
                                if (JSB.isObject(obj[k]) && Object.keys(obj[k])).length == 0) {
                                    delete obj[k];
                                } else if (JSB.isArray(obj[k]) && obj[k]).length == 0) {
                                    delete obj[k];
                                }
                                contains = true;
                            }
                        }
                    }
                } else if (JSB.isArray(obj)) {
                    for (var i in obj) {
                        contains = walk(obj[i]) || contains;
                    }
                }
                return contains;
            }

            var matched = walk(left);
            return matched ? left : null;
        },

        _extractId: function (obj) {
            return MD5.md5(/**sorted stringify*/JSB.stringify(obj));
        },

        _extractViewId: function (viewQuery) {
            var obj = {
                $groupBy: viewQuery.$groupBy,
                $filter: QueryUtils.subFilterByContext(
                        viewQuery, /**includeCurrent=*/true, /**includeForeign=*/false),
            };
            return $this._extractId(obj);
        },

        _buildViewBody: function (query) {
            var view = {
                query: {
                    $groupBy: query.$groupBy,
                    $filter: query.$filter, // TODO remove foreign field
                },
                name: 'v'+$this._extractId(obj).substring(0,4),
                fieldAliases: {},
                fieldExpressions: {},
            };
            view.id = $this._extractViewId(view.query);
            return view;
        },

        _addViewFields: function (view, query) {
            // для всех подзапросов собрать выражения из текущего запроса
            // TODO + фильтр, который не попал во вью
            //  TODO исключить поля с подзапросами
            $this._walkValueExpressions(query, function callback(exp, alias) {
                var expId = $this._extractId(exp);
                view.fieldAliases[expId] = view.fieldAliases[expId] || alias;
                view.fieldExpressions[expId] = view.fieldExpressions[expId] || exp;
            });
        },

        /** Заменяет тело запроса запросом к вью
        */
        _rebuildQueryFromView: function (query, view) {
            function rebuildValue(value){
                for(var expId in view.fieldExpressions) {
                    var viewExp = view.fieldExpressions[expId];
                    if (JSB.isEqual(value, viewExp)) {
                        var alias = view.fieldAliases[expId];
                        // return view field
                        return alias;
                    }
                }
                return value;
            }
            function buildSelect(){
                var $select = {};
                for(var alias in query.$select) {
                    // TODO skip if contains subquery
                    $select[alias] = rebuildValue(query.$select[alias]);
                }
                return $select;
            }

            var viewQuery = JSB.merge(true, {}, query, {
                $select: buildSelect(),
                $filter: $this.buildFilter(query.$filter.$and, view),
            });
            return viewQuery;
        },


        _buildFilter: function (filterAnd, view){
            // TODO
            function filterWithoutViewFilter($and) {
                if (!$and || $and.length < 1){
                    return {};
                }
                for(var i in $and) {
                    if (JSB.isEqual($and[i], view.$filter)) {
                        return $and.slice(0,i).concat($and.slice(i+1))
                    }
                    if ($and[i].$and) {
                        walkAnd($and); // TODO
                    }
                }
                throw Error('Query filter without view filter');
            }
            function rebuildFilterValues(filter) {
                for (var op in filter) {
                    switch(op) {
                        case '$or':
                            var $or = [];
                            for (var i in exps[op]) {
                                rebuildFilterValues(filter[op][i]);
                            }
                            $and.push({$or: $or});
                            break;
                        case '$and':
                            for (var i in exps[op]) {
                                rebuildFilterValues(filter[op][i]);
                            }
                            break;
                        default:
                            // $op: [left, right] expression
                            var values = [];
                            for (var i in filter[op]) {
                                var value = rebuildValue(filter[op][i]);
                                values.push(value);
                            }
                            filter[op] = values;
                    }
                }
            }

            var $filter = filterWithoutViewFilter(filterAnd);
            rebuildFilterValues($filter);
            return $filter;
        },

        _mergeViews: function (targetView, sourceView) {
            if (!targetView) {
                return sourceView;
            }

            for (var eid in sourceView.fieldExpressions) {
                var contains = false;
                var alias = sourceView.fieldAliases[eid].startsWith('__')
                        ? null
                        : sourceView.fieldAliases[eid];
                for (var eid2 in targetView.fieldExpressions) {
                    if (JSB.isEqual(targetView.fieldExpressions[eid2], sourceView.fieldExpressions[eid])) {
                        contains = true;
                        // update generated alias
                        if (alias) targetView.fieldAliases[eid2] = alias;
                        sourceView.fieldAliases[eid]
                        break;
                    }
                }
                if (!contains) {
                    targetView.fieldAliases[eid]     = sourceView.fieldAliases[eid];
                    targetView.fieldExpressions[eid] = sourceView.fieldExpressions[eid];
                }
            }
            return targetView;
        },

        _walkValueExpressions: function (dcQuery, callback/**(exp, alias)*/){
            // обход так же будет со всеми подзапросами, чтобы захватить используемые поля заданного запроса в подзапросах
            var oldCallback = callback;
            callback = function(exps, alias){
                if (this == dcQuery) {
                    return oldCallback.call(this, exps, alias);
                }
            };

            function walkQuery(query){
                // walk $select
                for(var alias in query.$select) {
                    var replace = callback.call(query, query.$select[alias], alias);
                    if (replace) {
                        query.$select[alias] = replace;
                    }
                }

                // walk $sort
                for (var i in query.$sort) {
                    var val = query.$sort[i];
                    var exp;
                    if (val.$expr && val.$type) {
                        exp = val.$expr;
                    } else {
                        exp = Object.keys(val)[0];
                    }
                    var replace = callback.call(query, exp);
                    if (replace) {
                        query.$sort[i] = {
                            $expr: replace,
                            $type: val.$type == null ? val.$type : val[exp]
                        }
                    }
                }
            }

            $this.walkSubQueries(dcQuery, walkQuery);
        },

        _replace: function (target, source) {
            var keys = Object.keys(target);
            for(var i in keys) {
                delete target[keys[i]];
            }
            var keys = Object.keys(source);
            for(var i in keys) {
                target[keys[i]] = source[keys[i]];
            }
        },


/*
{
  "$groupBy": [
    "date"
  ],
  "$context": "main",
  "$select": {
    "Дата": "date",
    "Количество": {
      "$count": 1
    },
    "sub_date1": {
      "$select": {
        "date": "date"
        }
      },
      "$filter": {
        "date": {
          "$eq": {
            "$field": "Дата",
            "$context": "main"
          }
        }
      }
    },
    "sub_date2": {
      "$groupBy": [
        "date"
      ],
      "$select": {
          "date": "date"
        }
      },
      "$filter": {
        "date": {
          "$eq": {
            "$field": "Дата",
            "$context": "main"
          }
        }
      }
    },
    "Столбец_2": {
      "$select": {
        "max": {
          "$max": {
            "$field": "count"
          }
        }
      },
      "$from": {
        "$select": {
          "count": {
            "$count": 1
          }
        },
        "$groupBy": [
          "date"
        ]
      }
    },
    "Столбец_3": {
      "$select": {
        "max": {
          "$max": {
            "$field": "sum"
          }
        }
      },
      "$from": {
        "$select": {
          "sum": {
            "$sum": 1
          }
        },
        "$groupBy": [
          "date"
        ]
      }
    }
  }
}
*/

//        /** Обходит выражения со значением для указанного запроса и заменяет их, если callback вернул новое выражение*/
//        updateValueExpressions: function (dcQuery, callback/**(exp, alias)*/){
//            // обход так же будет со всеми подзапросами, чтобы захватить используемые поля заданного запроса в подзапросах
//            var oldCallback = callback;
//            callback = function(exps, alias){
//                if (this == dcQuery) {
//                    return oldCallback.call(this, exps, alias);
//                }
//            };
//
////            function walkMultiFilter(exps){
////                var replaceFields = {};
////                for (var field in exps) if (exps.hasOwnProperty(field)) {
////                    if (field.startsWith('$')) {
////                        var op = field;
////                        switch(op) {
////                            case '$or':
////                            case '$and':
////                                for (var i in exps[op]) {
////                                    walkMultiFilter(exps[op][i]);
////                                }
////                                break;
////                            default:
////                                // $op: [left, right] expression
////                                for(var i in exps[op]) {
////                                    var replace = callback.call(query, exps[op][i]);
////                                    if (replace) {
////                                        exps[op][i] = replace;
////                                    }
////                                }
////                        }
////                    } else {
////                        // field: {$eq: expr}
////                        var e = exps[field];
////                        var op = Object.keys(e)[0];
////                        var replaceField = callback.call(query, field);
////                        var replaceValue = callback.call(query, e[op]);
////                        if (replaceField && replaceValue) {
////                            var newExp = {};
////                            newExp[op] = [{$field: replaceField}, replaceValue];
////                            replaceFields[field] = newExp;
////                        }
////                    }
////                }
////
////                for (var rf in replaceFields) {
////                    delete exps[rf];
////                    if(!exps.$and) exps.$and = [];
////                    exps.$and.push(replaceFields[rf]);
////                }
////            }
//            function walkQuery(query){
//                // walk $select
//                for(var alias in query.$select) {
//                    var replace = callback.call(query, query.$select[alias], alias);
//                    if (replace) {
//                        query.$select[alias] = replace;
//                    }
//                }
////
////                // walk $filter
////                walkMultiFilter(query.$filter);
////
////                // walk $groupBy
////                for(var i in query.$groupBy) {
////                    var replace = callback.call(query, query.$groupBy[i], alias);
////                    if (replace) {
////                        query.$groupBy[i] = replace;
////                    }
////                }
//
//                // walk $sort
//                for (var i in query.$sort) {
//                    var val = query.$sort[i];
//                    var exp;
//                    if (val.$expr && val.$type) {
//                        exp = val.$expr;
//                    } else {
//                        exp = Object.keys(val)[0];
//                    }
//                    var replace = callback.call(query, exp);
//                    if (replace) {
//                        query.$sort[i] = {
//                            $expr: replace,
//                            $type: val.$type == null ? val.$type : val[exp]
//                        }
//                    }
//                }
//            }
//
//            this.walkSubQueries(dcQuery, walkQuery);
//        },
//
//        subFilterByContext: function (query, includeCurrent, includeForeign){
//            var skipFields = $this.collectSubQueryJoinFields(
//                query.$filter|| {},
//                function isSkipped(context) {
//                    var isForeignContext = !!context && context != query.$context;
//                    return !includeCurrent && !includeForeign ||
//                            isForeignContext ? !includeForeign : !includeCurrent;
//                }
//            );
//            var filter = $this.filterFilterByFields(query.$filter, function(filteredField, filteredExpr, path){
//                return skipFields.indexOf(filteredField) == -1;
//            });
//            return filter;
//        },
//
//        /** Формирует для запроса $with*/
//        buildWithViews: function (dcQuery){
//            function extractViewBody(query){
//                var key = {
//                    $groupBy: query.$groupBy,
//                    $filter: $this.subFilterByContext(query, true, false),
//                    $from: query.$from
//                };
//                return key;
//            }
//            function extractExtFilter(query){
//                return subFilter(query, true);
//            }
//            function extractViewId(query){
//                return MD5.md5(JSON.stringify(extractViewBody(query)));
//            }
//            function extractExpId(exp){
//                return MD5.md5(JSON.stringify(exp));
//            }
//            function hasView(query){
//                if (!(query.$groupBy && query.$groupBy.length > 0)
//                        && !(query.$filter && Object.keys(query.$filter).length ==1)
//                        && !query.$from) {
//                    return false;
//                }
//                // TODO если $sort или $groupBy содержит подзапрос со ссылкой на чужое поле: return false
////                // ViewBody имеется хотя бы в одном подзапросе
////                var viewId = extractViewId(query);
////                var count = 0;
////                $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
////                    if (extractViewId(query) == viewId) {
////                        count++;
////                    }
////                });
////                return count > 1;
//                return true;
//
//            }
//            function ensureView(query, name){
//                var id = extractViewId(query);
//                if (views[id]) {
//                    return views[id];
//                }
//                viewOrder.push(id);
//                return views[id] = {
//                    id: id,
//                    body: extractViewBody(query),
//                    fieldExpressions:{},
//                    fieldAliases:{},
//                    name: name || ('view_' + Object.keys(views).length)
//                };
//            }
//
//            function rebuildViewQuery(query){
//                delete query.$groupBy;
//                delete query.$from;
//                query.$from = view.name;
//                query.$filter = $this.subFilterByContext(query, false, true);
//                var select = query.$select;
//                query.$select = {};
//            }
//
//            var views = {};
//            var viewOrder = [];
//debugger;
//            // load existed $with
//            dcQuery.$with = dcQuery.$with || {};
//            for (var name in dcQuery.$with) {
//                var view = ensureView(dcQuery.$with[name], name);
//                for(var alias in dcQuery.$with[name].$select) {
//                    var exp = dcQuery.$with[name].$select[alias];
//                    var expId = extractExpId(exp);
//                    view.fieldAliases[expId] = view.fieldAliases[expId] || alias;
//                    view.fieldExpressions[expId] = view.fieldExpressions[expId] || exp;
//                }
//            }
//
//            $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
//                if (query.$sql) {
//                    return; // skip embedded SQL query
//                }
//
//                if (!hasView(query)) {
//                    return; // no view
//                }
//                var view = ensureView(query);
//                // для всех подзапросов собрать выражения из текущего запроса
//                $this.walkValueExpressions(query, function callback(valueExp, alias) {
//                    var expId = extractExpId(exp);
//                    view.fieldAliases[expId] = view.fieldAliases[expId] || alias;
//                    view.fieldExpressions[expId] = view.fieldExpressions[expId] || exp;
//
//                });
//                // заменить $from, удалить $groupBy,
//                rebuildViewQuery(query);
////                // transform query: replace values by view`s fields
////                $this.updateValueExpressions(query, function callback(exp, alias) {
////                    var expId = extractExpId(exp);
////                    var fieldAlias = view.fieldAliases[expId] = view.fieldAliases[expId] || expId;
////                    return {$field: fieldAlias, $context: view.name};
////                });
//
//            });
//
//            for (var i in viewOrder) {
//                var id = viewOrder[i];
//                var view = views[id];
//                dcQuery.$with[views.name] = JSB.merge({
//                    $select: (function(){
//                        var select = {};
//                        for (var fid in fieldAliases) {
//                            var fieldAlias = view.fieldAliases[expId];
//                            var fieldExpr = view.fieldExpressions[expId];
//                            select[fieldAlias] = fieldExpr;
//                        }
//                        return select;
//                    })()
//                }, view.body);
//            }
//
//            // TODO build $with and replace value expressions and $from
//        },
	}
}