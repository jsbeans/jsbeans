{
	$name: 'DataCube.Query.Views.JoinView',
	$parent: 'DataCube.Query.Views.MultiView',

	$server: {
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

        listViews: function() {
            return [$this.leftView, $this.rightView];
		},

		listJoinFields: function(){
            var leftFields = $this.leftView.listFields();
            var rightFields = $this.rightView.listFields();
		    var list = [];
            for (var r in rightFields) {
                if (leftFields.indexOf(rightFields[r]) != -1) {
                    list.push(rightFields[r]);
                }
            }
		    return list;
		},

		getFromBody: function(){
		    var from = {
		        $context : $this.name,
                $select: null,
                $join: {
                    $joinType: $this.joinType,
                    $left: null,
                    $right: null,
                    $filter: null,
                },
            };
		    var left = from.$join.$left = $this.leftView.getFromBody();
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
                select[field] = {
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