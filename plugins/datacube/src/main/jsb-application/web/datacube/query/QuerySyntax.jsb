{
	$name: 'JSB.DataCube.Query.QuerySyntax',
	$singleton: true,

	$server: {
		$require: [],

		$constructor: function(){
		},

		aggregateLocalFunctions: function(){
		    return JSB.merge({}, this.aggregateLocalFieldFunctions(), this.aggregateLocalConstFunctions());
		},

		aggregateLocalFieldFunctions: function(){
		    return {
		        $sum: {/*todo*/},
		        $count: {/*todo*/},
		        $min: {/*todo*/},
		        $max: {/*todo*/},
		        $avg: {/*todo*/},
		        $array: {/*todo*/},
		        $flatArray: {/*todo*/},
		    };
		},

		aggregateLocalConstFunctions: function(){
		    return {
		        $sum: {/*todo*/},
		        $count: {/*todo*/},
		    };
		},

		aggregateGlobalFunctions: function(){
		    return JSB.merge({}, this.aggregateGlobalFieldFunctions(), this.aggregateGlobalConstFunctions());
		},

		aggregateGlobalFieldFunctions: function(){
		    return {
		        $gsum: {/*todo*/},
		        $gcount: {/*todo*/},
		        $gmin: {/*todo*/},
		        $gmax: {/*todo*/},
		    };
		},

		aggregateGlobalConstFunctions: function(){
		    return {
		        $gsum: {/*todo*/},
		        $gcount: {/*todo*/},
		    };
		},

		aggregateFunctions: function(){
		    return JSB.merge({}, this.aggregateLocalFunctions(), this.aggregateGlobalFunctions());
		},

		valueFunctions: function(){
		    // TODO
        },

		filterOperators: function(){
		    // TODO
        },

		filterConditions: function(){
		    // TODO
        },

	}
}