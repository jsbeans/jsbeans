{
	$name: 'DataCube.Query.Console',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.QueryUtils',
        ],

        message: function(desc){
            if (desc.error){
                QueryUtils.logDebug.apply(QueryUtils,
                    ['Console [ERROR]: ' + desc.message + '\n' + desc.error].concat(desc.params));
            } else {
                QueryUtils.logDebug.apply(QueryUtils,
                    ['Console [INFO]:  ' + desc.message].concat(desc.params));
            }
        },
	}
}