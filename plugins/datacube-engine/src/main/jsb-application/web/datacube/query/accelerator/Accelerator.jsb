{
	$name: 'DataCube.Query.Accelerator.Accelerator',

	$server: {
		$require: [
        ],

        $bootstrap: function(){

        },

		getDescriptor: function(){
		    return {
		        name: $this.getJsb().$name,
		        displayName: $this.getJsb().$name,
		        description: '',
		    };
		},

		enable: function(slice){
		    // implement
		},

		disable: function(slice){
		    // implement
		},
	}
}