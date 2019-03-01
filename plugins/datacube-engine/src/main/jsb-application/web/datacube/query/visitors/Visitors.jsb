{
	$name: 'DataCube.Query.Visitors.Visitors',
	$singleton:true,

	$server: {
		$require: [
		    'DataCube.Query.Visitors.PrintVisitor',
		    'DataCube.Query.Visitors.ProxyVisitor',
		    'DataCube.Query.Extractors.FieldsExtractor',
        ],

        visitPrint: function(query, options) {
            try {
                var visitor = new PrintVisitor(options);
                visitor.visit(query);
            } finally {
                visitor && visitor.destroy();
            }
        },

        visitProxy: function(query, options) {
            try {
                var visitor = new ProxyVisitor(options);
                visitor.visit(query);
            } finally {
                visitor && visitor.destroy();
            }
        },

        extractedFields: function(rootQuery, callback) {
            try {
                var fieldsExtractor = new FieldsExtractor(rootQuery);
                fieldsExtractor.extract();
                return callback.call(fieldsExtractor,fieldsExtractor);
            } finally {
                fieldsExtractor && fieldsExtractor.destroy();
            }
        },
    }
}