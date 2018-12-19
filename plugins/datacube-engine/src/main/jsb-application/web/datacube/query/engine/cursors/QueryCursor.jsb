{
	$name: 'DataCube.Query.Engine.Cursors.QueryCursor',
	$parent: 'DataCube.Query.Engine.Cursors.InterpretedCursor',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

        nested: {},
        nestedFactories: {},
        chain: [],
        state: {},
        stepState: {},
        globalSubQueries: {},

		$constructor: function(executor, query, params, parent, caller){
		    $base(executor, query, params, parent, caller);

        },

        setNestedQueryFactory: function(name, createNestedCursor){
            $this.nested[name] = null;
            $this.nestedFactories[name] = createNestedCursor;
        },

        getNested: function(){
            return $this.nested;
        },

		analyze: function(){
		    var json = $base();
		    json.chain = $this.chain;
		    return json;
		},

        reset: function(){
            var nested = $this.getNested();
            for(var name in nested) {
                nested[name] && nested[name].reset();
            }
            $base();
            $this.state = {};
            $this.stepState = {};
            $this.buildQueryBody();
        },

        destroy: function(){
            if ($this.closed) return;
            $this.globalSubQueries = null;
            $this.chain = null;
            $this.state = null;
            $this.stepState = null;
            $this.nested = null;
            $this.nestedFactories = null;
            $base();
        },

        next: function(){
             /// look $this.buildQueryBody
        },

        findRootCursor: function(){
            var parent = $this;
            while(parent.parent && parent.parent != parent) {
                parent = parent.parent;
            }
            return parent;
        },

        buildQueryBody: function(){

            // вход запроса
            $this.next = function inputNext(){
                return $this.object = $this.source.next();
            }
            $this.chain.push('input');

//debugger;

            // фильтрация  - только в отношении входных полей (условия с выходными игнорируются)
            $this.query.$filter
                    && $this._installFilter(
                        $this._extractSubFilter($this.query.$filter, true)
                    );
            // предварительная сортировка - по выражениям с входными полями (с выходными игнорируется)
            $this.query.$sort
                    && $this._installSort(
                        $this._extractSubSort($this.query.$sort, true)
                    );
            // группировка - формируются группы и итераторы по элементам группы
            $this.query.$groupBy
                    && $this.query.$groupBy.length > 0
                    && $this._installGroupBy($this.query.$groupBy);
            // построение объекта - выполняются выражения и агрегационные функции
            $this.query.$select
                    && $this._installSelect($this.query.$select);
            // фильтрация  - только в отношении выходных полей (условия с входными пропускаются)
            $this.query.$filter
                    && $this._installFilter(
                        $this._extractSubFilter($this.query.$filter, false)
                    );
            // сортировка результата - по выражениям с выходными полями (с входными пропускаются)
            $this.query.$sort
                    && $this._installSort(
                        $this._extractSubSort($this.query.$sort, false)
                    );
            // пропуск дубликатов
            $this.query.$distinct
                    && $this._installDistinct($this.query.$distinct);
            // пропуск N элементов
            $this.query.$offset
                    && $this._installOffset($this.query.$offset);
            // ограничение по кол-ву
            $this.query.$limit
                    && $this._installLimit($this.query.$limit);

            $this._installFinally();
        },

        _installFilter: function($filter){
            var inputNext = $this.next;

            $this.next = function filter(){
                var object = inputNext.call($this);
                while(object != null && !$this.Common.check.call($this, $filter)) {
                    object = inputNext.call($this);
                }
                return $this.object = object;
            };

            $this.chain.push('filter');
        },

        _installGroupBy: function ($select){
            var inputNext = $this.next;
            var objects = [];
            var currentPos = -1;
            $this.next = function groupBy(){
                if (currentPos == -1) {
                    $this.Aggregate.init.call($this);
                    var count = 0;
                    var object = inputNext.call($this);
                    while(object != null) {
                        count ++;
                        $this.Aggregate.map.call($this, object);

                        object = inputNext.call($this);
                    }
                    for(var id in $this.state.groups) {
                        objects.push($this.state.groups[id]);
                    }
                    $this.state.groups = {};
                }

                return $this.object = objects[++currentPos];
            }

            var inputClose = $this.destroy;
            $this.destroy = function groupBy(){
                inputClose.call($this);
                objects = null;
            };

            $this.chain.push('group');
        },

        _installSelect: function ($select){
            var inputNext = $this.next;

            $this.next = function select(){
                var object = $this.object = inputNext.call($this);

                if (object != null) {
                    var obj = {};
                    for(var outputField in $select) {
                        obj[outputField] = $this.Common.get.call($this, $select[outputField]);
                    }
                    object = $this.object = obj;
                }
                return object;
            }
        },

        _installDistinct: function ($distinct){
            var inputNext = $this.next;
            var ids = {};
            $this.next = function distinct(){
                do {
                    var object = inputNext.call($this);
                    var id = $this.Runtime.id.call($this);
                } while(object != null && ids[id]);

                ids[id] = true;
                return $this.object = object;
            };

            var inputClose = $this.destroy;
            $this.destroy = function distinct(){
                inputClose.call($this);
                ids = {};
            };

            $this.chain.push('distinct');
        },

        _installSort: function($sort){
            var inputNext = $this.next;
            var objects = null;
            var currentPos = -1;

            $this.next = function sort(){
                if (objects == null) {
                    objects = [];
                    var object = inputNext.call($this);
                    object.$$sort = [];
                    for(var i = 0; i < $sort.length; i++){
                        object.$$sort[i] = $this.Common.get.call($this, $sort[i].$expr);
                    }
                    objects.push(object);
                    while(object != null) {
                        object = inputNext.call($this);
                        if (object) {
                            object.$$sort = [];
                            for(var i = 0; i < $sort.length; i++){
                                object.$$sort[i] = $this.Common.get.call($this, $sort[i].$expr);
                            }
                            objects.push(object);
                        }
                    }
                    var self = this;
                    objects.sort(function(a, b){
                        for(var i = 0; i < a.$$sort.length; i++) {
                          if (a.$$sort[i] == b.$$sort[i]) {
                            continue;
                          }
                          if (a.$$sort[i] > b.$$sort[i]) {
                            return $sort[i].$type;
                          }
                          if (a.$$sort[i] < b.$$sort[i]) {
                            return -$sort[i].$type;
                          }
                        }
                        return 0;
                    });
                }

                var object = $this.object = objects[++currentPos];
                if(object) delete object.$$sort;
                return object;
            };

            var inputClose = $this.destroy;
            $this.destroy = function sort(){
                inputClose.call($this);
                objects = null;
                currentPos = -1;
            };

            $this.chain.push('sort');
        },

        _installOffset: function($offset){
            var inputNext = $this.next;
            var current = 0;

            $this.next = function offset(){
                var object = inputNext.call($this);
                while(object != null && current++ < $offset) {
                    object = inputNext.call($this);
                }
                return $this.object = object;
            };

            $this.chain.push('offset');
        },

        _installLimit: function($limit){
            if ($limit < 0) return;
            var inputNext = $this.next;
            var count = 0;

            $this.next = function limit(){
                var object = inputNext.call($this);
                if (count++ == $limit) {
                    return $this.object = null;
                }
                return $this.object = object;
            };

            $this.chain.push('limit');
        },

        _installFinally: function(){
            var inputNext = $this.next;
            $this.next = function _finally(){
                var object = inputNext.call(this);
                this.stepState = {};
                return object;
            };

        },

        _extractSubFilter: function($filter, inputOrOutput) {
            // TODO only with input fields or only with output fields
            return $filter;
        },

        _extractSubSort: function($sort, inputOrOutput) {
            // TODO only with input fields or only with output fields
            return $sort;
        },

	}
}