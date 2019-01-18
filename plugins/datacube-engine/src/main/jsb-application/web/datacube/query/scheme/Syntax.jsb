{
	$name: 'DataCube.Query.Syntax',
	$singleton: true,

	$sync: {
		updateCheckInterval: 0
	},

	$scheme: {
	    $join: {
            name: '$join',
            category: 'Источник запроса',
            displayName: 'Пересечение',
            desc: 'Задает в качестве источника запроса перечесение результатов двух запросов',
            render: '$join',
            values: {
                '$joinType': '$joinType',
                '$filter': '$joinFilter',
                '$left': '$sourceSelect',
                '$right': '$sourceSelect'
            }
	    }
	},

    getSchema: function (key){
        if(key){
            return this.$scheme[key];
        }

        return this.$scheme;
    },
}