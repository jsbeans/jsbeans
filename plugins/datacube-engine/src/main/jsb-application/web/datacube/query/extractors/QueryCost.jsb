{
	$name: 'DataCube.Query.Extractors.QueryCost',
	$parent: 'DataCube.Query.Visitors.ProxyVisitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'java:java.util.HashMap',
        ],

        /** Сканирует запрос целиком и формирует списки используемых полей для всех подзапросов
        */

        $constructor: function(rootQuery){
            $this.queryCost = new HashMap();

            $base({
                price: {
                    field:     function(cost) { cost.value+=1;    cost.components.push('field:+1'); },
                    query:     function(cost) { cost.value+=1000; cost.components.push('query:+1000'); },
                    groupBy:   function(cost) { cost.value+=500;  cost.components.push('groupBy:+500'); },
                    sort:      function(cost) { cost.value+=500;  cost.components.push('sort:+500'); },
                    distinct:  function(cost) { cost.value+=500;  cost.components.push('distinct:+500'); },
                    limit:     function(cost) { cost.value/=2;    cost.components.push('limit:/2'); },
                    union:     function(cost) { cost.value*=1;    cost.components.push('union:x1'); },
                    join:      function(cost) { cost.value*=2;    cost.components.push('join:x2'); },
                    recursive: function(cost) { cost.value*=4;    cost.components.push('recursive:x4'); },
                },

                query: {
                    before: function(query) {
                        var cost = { components: [], value: 0};
                        $this.queryCost.put(query, cost);
                    },
                    after: function(query) {
                        var cost = $this.queryCost.get(query);

                        function applySource(sourceCost){
                            cost.value += sourceCost.value;
                            cost.components.push(sourceCost.components);
                        }

                        if (query.$from && JSB.isObject(query.$from)) {
                            var sourceCost = $this.queryCost.get(this.getQuery(query.$from));
                            applySource(sourceCost);
                        } else if (query.$from && JSB.isString(query.$from)) {
                            var sourceQuery = this.getQuery(query.$from);
                            var sourceCost = $this.queryCost.get(sourceQuery);
                            sourceCost(sourceCost)
                        } else if (query.$join) {
                            var leftCost = $this.queryCost.get(this.getQuery(query.$join.$left));
                            var rightCost = $this.queryCost.get(this.getQuery(query.$join.$right));
                            sourceCost(leftCost);
                            sourceCost(rightCost);
                            $this.options.price.join.call(cost);
                        } else if (query.$recursive) {
                            var leftCost = $this.queryCost.get(this.getQuery(query.$recursive.$start));
                            var rightCost = $this.queryCost.get(this.getQuery(query.$recursive.$joinedNext));
                            sourceCost(leftCost);
                            sourceCost(rightCost);
                            $this.options.price.recursive.call(cost);
                        } else if (query.$union) {
                            for(var i = 0; i < query.$union.length; i++) {
                                var sourceCost = $this.queryCost.get(this.getQuery(query.$union[i]));
                                applySource(sourceCost);
                            }
                            $this.options.price.union.call(cost);
                        } else if (query.$cube) {
                            // TODO
                        } else if (query.$provider) {
                            // TODO
                        }

                        $this.options.price.query.call(cost);

                        if (query.$distinct) {
                            $this.options.price.distinct.call(cost);
                        }
                        if (query.$limit) {
                            $this.options.price.limit.call(cost);
                        }

                    },
                },

                groupBy: {
                    before: function(groupBy){
                        var query = this.getQuery();
                        var cost = $this.queryCost.get(query);
                        $this.options.price.groupBy.call(cost);
                    },
                },

                sort: {
                    before: function(sort){
                        var query = this.getQuery();
                        var cost = $this.queryCost.get(query);
                        $this.options.price.sort.call(cost);
                    },
                },

                field: {
                    before: function(field, context, sourceContext){
                        var query = this.getQuery();
                        var cost = $this.queryCost.get(query);
                        $this.options.price.field.call(cost);
                    },
                },
            });
        },

        extract: function(){
            $this.visit($this.rootQuery);
            return $this.queryCost.get($this.rootQuery);
        },
    }
}