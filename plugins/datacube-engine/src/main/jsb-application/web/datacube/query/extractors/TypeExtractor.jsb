{
	$name: 'DataCube.Query.Extractors.TypeExtractor',
	$singleton:true,

	$server: {
		$require: [
		    'DataCube.Query.Extractors.ExpressionsTypesExtractor',
        ],

        extractQueryOutputFieldsTypes: function(rootQuery, query){
            var types = $this.extractOutputFieldsTypes(rootQuery);
            return types.get(query||rootQuery);
        },

        extractOutputFieldsTypes: function(rootQuery){
            return ExpressionsTypesExtractor.extractedTypes(rootQuery);
        },
    }
}