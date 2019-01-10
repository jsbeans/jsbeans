{
	$name: 'DataCube.Query.Renders.Join',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$join',

	$client: {
	    $require: ['JSB.Controls.Selectize'],

	    $constructor: function(opts) {
	        $base(opts);

console.log($);
debugger;

	        var sources = this.getData('cubeSlices');

	        // join type
	        var joinType = new Selectize({
	            labelField: 'title',
	            options: [
	                {id: '$eq', title: '='},
	                {id: '$gte', title: '>='},
	                {id: '$gt', title: '>'},
	                {id: '$lte', title: '<='},
	                {id: '$lt', title: '<'}
	            ],
	            valueField: 'id',

	            onChange: function(value){
	                //
	            }
	        });
	        this.append(joinType);

	        // left source
	        var leftSource = new Selectize({
	            options: sources,

	            onChange: function(value){
	                //
	            }
	        });
	        this.append(leftSource);

	        // right source



	        // join filters
	        //
	    }
	}
}