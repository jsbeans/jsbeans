{
	$name: 'DataCube.Query.Syntax',
	$singleton: true,

	$sync: {
		updateCheckInterval: 0
	},

	$scheme: {
	    $join: {
            name: '$join',
            render: '$join',
            category: 'Источник запроса',
            displayName: 'Пересечение',
            desc: 'Задает в качестве источника запроса перечесение результатов двух запросов',
            values: {
                '$joinType': '$joinType',
                '$filter': '$joinFilter',
                '$left': ['$slice', ''],
                '$right': '$sourceSelect'
            }
	    },

	    $source: {
	        render: '#source',
	        values: ['slice', 'query', 'view']
	    }
	},

	$toolList: [
	{
	    name: '',
	    category: '',
	}
	],

    getSchema: function (key){
        if(key){
            return this.$scheme[key];
        }

        return this.$scheme;
    },
}