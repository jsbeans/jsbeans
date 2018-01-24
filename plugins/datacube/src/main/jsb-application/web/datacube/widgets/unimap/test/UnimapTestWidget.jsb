{
	$name: 'DataCube.Widgets.TestNewScheme',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Тест схемы',
        description: '',
        category: 'Тест'
    },
    $client: {
        $require: ['Unimap.Test'],

        $constructor: function(opts){
            $base(opts);

            this.scheme = new Test();
            this.append(this.scheme);
        }
    }
}