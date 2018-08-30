{
	$name: 'DataCube.Query.Views.JoinView',
	$parent: 'DataCube.Query.Views.MultiView',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

        query: null,

		$constructor: function(name, leftView, joinType){
		    $base(name);
		    $this.leftView = leftView;
		    $this.joinType = joinType;
		},

		setRightView: function(rightView) {
		    $this.rightView = rightView;
		},

		getRightView: function() {
		    return $this.rightView;
		},

		getLeftView: function() {
		    return $this.leftView;
		},

        getOriginalField: function(name) {
            var desc = $this.leftView.getField(name);
            var context = $this.leftView.name;
            if (!desc) {
                desc = $this.rightView.getField(name);
                context = $this.rightView.name;
            }
            if (desc && !desc.context) {
                desc.context = context;
            }
            return desc;
		},

        listViews: function() {
            return [$this.leftView, $this.rightView];
		},

		listJoinFields: function(){
            if (!$this.query) {
                // cube mode

                var leftFields = $this.leftView.listFields();
                var rightFields = $this.rightView.listFields();
                var list = [];
                for (var r in rightFields) {
                    if (leftFields.indexOf(rightFields[r]) != -1) {
                        list.push(rightFields[r]);
                    }
                }
                return list;
            } else {
                // query mode

                throw new Error("TODO: extract from filter");
            }
		},

		getFromBody: function(){
		    function wrapRight(query){
debugger;
		        if (query.$from){
		            // is simple query
		            return query;
		        }

                var rightFields = $this.rightView.listFields();
                // wrap with query
                query.$from = {
                    $context: query.$context,
                    $select: query.$select,
                };
                query.$context = 'RightWrapper:' + query.$context;
                query.$select = {};
                for(var alias in query.$from.$select) {
                    query.$select[alias] = alias;
                }
//                QueryUtils.walkCurrentQueryFields(
//                    query,
//                    function(){
//                        if (!this.$alias) {
//                            query.$from.$select[this.$field] = this.$field;
//                        }
//                    }
//                );
                if (query.$join) {
                    query.$from.$join = query.$join;
                    delete query.$join;
                } else if (query.$union) {
                    query.$from.$union = query.$union;
                    delete query.$union;
                } else if (query.$provider) {
                    query.$from.$provider = query.$provider;
                    delete query.$provider;
                } else if (query.$cube) {
                    query.$from.$cube = query.$cube;
                    delete query.$cube;
                }
                return query;
		    }

		    if ($this.query) {
		        return JSB.clone($this.query);
		    }

		    var from = {
		        $context : $this.name,
                $select: null,
                $join: {
//                    $context : $this.name,
                    $joinType: $this.joinType,
                    $left: null,
                    $right: null,
                    $filter: null,
                },
            };
		    var left = from.$join.$left = $this.leftView.getFromBody();
//		    var right = from.$join.$right = wrapRight($this.rightView.getFromBody());
            var right = from.$join.$right = $this.rightView.getFromBody();

		    //from.$context = $this.joinType + ' join:[' + left.$context + ' (X) ' + right.$context + ']';
		    var filter = from.$join.$filter = {$and:[]};
		    var select = from.$select = {};

		    var fields = $this.listJoinFields();
		    for(var i = 0; i < fields.length; i++){
		        var leftField = $this.leftView.getField(fields[i]);
		        var rightField = $this.rightView.getField(fields[i]);
		        filter.$and.push({
		            $eq: [
		                {
		                    $field: leftField.field,
		                    $context: left.$context,
		                }, {
		                    $field: rightField.field,
		                    $context: right.$context,
		                }
		            ],
		        });
                select[fields[i]] = {
                    $field: leftField.field,
                    $context: left.$context,
                }
		    }
		    for(var field in left.$select) {
		        if (!select[field]) {
		            select[field] = {
		                $field: field,
		                $context: left.$context,
		            }
                }
		    }
		    for(var field in right.$select) {
		        if (!select[field]) {
		            select[field] = {
		                $field: field,
		                $context: right.$context,
		            }
                }
		    }
		    return from;
		},
	}
}