{
	$name: 'DataCube.Query.Helper',

	$singleton: true,

	$client: {
	    createName: function(namesList, startName) {
            var count = 1,
                name = startName;

            while(namesList[name]){
                name = startName + '_' + count;
                count++;
            }

            return name;
	    }
	}
}