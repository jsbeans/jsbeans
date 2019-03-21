{
	$name: 'DataCube.Query.Transforms.OrderSelect',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cubeOrDataProvider){
             // move top fields that used in other
             $this.upperGeneralFields(dcQuery);

             // embed global groups
             QueryUtils.walkQueries(dcQuery, {getExternalView:function(){return {};}}, null,
                function(query){
                    if (!query.$groupBy || query.$groupBy.length == 0) {
                        for(var alias in query.$select) {
                            var e = query.$select[alias];
                            if (QueryUtils.isAggregatedExpression(e)) {
                                query.$groupBy = [{$const:1}];
                                break;
                            }
                        }
                    }
                }
            );
		    return dcQuery;
		},

        /** Поднять в запросе наверх (изменить порядок ключей в json) поля/алиасы, которые используются в других полях
        */
		upperGeneralFields: function(dcQuery){
		    function copyWithTopField(fieldName, obj) {
		        var res = {};
		        res[fieldName] = obj[fieldName];
		        for (var f in obj) if (typeof obj[f] !== 'undefined' && f != fieldName) {
		            res[f] = obj[f];
		        }
		        return res;
		    }

		    function isFieldLinkedWith(field, exp) {
                if (JSB.isObject(exp)) {
                    if (exp.$field
                            && exp.$context == dcQuery.$context
                            && exp.$field == field) {
                        return true;
                    } else {
                        for(var p in exp) if (exp[p] != null) {
                            if (isFieldLinkedWith(field, exp[p])) {
                                return true;
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i = 0; i < exp.length; i++) {
                        if (isFieldLinkedWith(field, exp[i])) {
                            return true;
                        }
                    }
                } else if (JSB.isString(exp) && exp == field) {
                    // not true - defined without context (see top where isObject)
                    return false;
                }
                return false;
		    }

            var select = dcQuery.$select;
		    var topFields = {};
		    for (var field in select) if (typeof select[field] !== 'undefined') {
                var list = false;
                for (var nextField in select) {
                    if (nextField == field) {
                        list = true;
                    } else if (list && select[nextField] != null) {
                        if (isFieldLinkedWith(field, select[nextField])) {
                            topFields[field] = Object.keys(topFields).length;
                        }
                    }
                }
		    }

            for (var field in topFields) if (typeof topFields[field] !== 'undefined') {
		        select = copyWithTopField(field, select);
		    }
		    dcQuery.$select = select;
		},
	}
}