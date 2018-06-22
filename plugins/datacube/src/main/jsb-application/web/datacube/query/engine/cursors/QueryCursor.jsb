{
	$name: 'DataCube.Query.Engine.Cursors.QueryCursor',
	$parent: 'DataCube.Query.Engine.Cursors.ViewCursor',

	$server: {
		$require: [
        ],

        nested: {},
        chain: [],
        state: {},

		$constructor: function(executor, query, params, parent, caller){
		    $base(executor, query, params, parent, caller);

        },

        addNested: function(name, cursor){
            $this.nested[name] = cursor;
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
            $base();
            $this.state = {};
            $this.buildQueryBody();
        },

        close: function(){
            if ($this.closed) return;
            $this.chain = null;
            $this.state = null;
            $base();
        },

        next: function(){
             /// look $this.buildQueryBody
        },

        buildQueryBody: function(){

            // вход запроса
            $this.next = function nextInput(){
                $this.state = {};
                return $this.object = $this.source.next();
            }
            $this.chain.push('input');

debugger;

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
        },

        _installFilter: function($filter){
            var inputNext = $this.next;

            $this.next = function (){
                var object = inputNext.call($this);
                while(object != null && !$this.Common.check.call($this, $filter)) {
                    object = inputNext.call($this);
if (object['Год отчетного периода'] == '2016' && object['Номер в ЕМД'] == '03.01.0042' ) debugger;
                }
                return $this.object = object;
            };

            $this.chain.push('filter');
        },

        _installGroupBy: function($select){
            var inputNext = $this.next;
            var objects = [];
            var currentPos = -1;
            $this.next = function(){
                if (currentPos == -1) {
debugger;
                    $this.Aggregate.init.call($this);

                    var object = inputNext.call($this);
                    while(object != null) {
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

            var inputClose = $this.close;
            $this.close = function(){
                inputClose.call($this);
                objects = null;
            };

            $this.chain.push('group');
        },

        _installSelect: function($select){
            var inputNext = $this.next;

            $this.next = function(){
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

        _installDistinct: function($distinct){
            var inputNext = $this.next;
            var ids = {};
            $this.next = function(){
                do {
                    var object = inputNext.call($this);
                    var id = $this.Runtime.id.call($this);
                } while(object != null && ids[id]);

                ids[id] = true;
                return $this.object = object;
            };

            var inputClose = $this.close;
            $this.close = function(){
                inputClose.call($this);
                ids = {};
            };

            $this.chain.push('distinct');
        },

        _installSort: function($sort){
            var inputNext = $this.next;
            var objects = {};

            $this.next = function sorting(){
                // TODO sort next
                return inputNext.call($this);
            };

            var inputClose = $this.close;
            $this.close = function sorting(){
                // TODO sort close
                inputClose.call($this);
                objects = {};
            };

            $this.chain.push('sort');
        },

        _installOffset: function($offset){
            var inputNext = $this.next;
            var current = 0;

            $this.next = function offset(){
debugger;
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