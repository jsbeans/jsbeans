{
	$name: 'DataCube.Query.Renders.Math',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$math',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        var scheme = this.getScheme();

	        var operator = this.$('<div class="operator">' + scheme.displayName + '</div>');

	        if(scheme.args === 2){
	            var leftVar = this.$('<div class="leftVar"></div>');
	            this.append(leftVar);
            }

            this.append(operator);

            var rightVar = this.$('<div class="rightVar"></div>');
            this.append(rightVar);
	    },

	    defineContext: function(){
	        //
	    },

	    getContext: function(){
	        return this.getParent().getValues()['$context'];
	    }
	}
}