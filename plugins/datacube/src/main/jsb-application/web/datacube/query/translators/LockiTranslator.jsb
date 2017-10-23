{
	$name: 'DataCube.Query.Translators.LockiTranslator',
	$parent: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Providers.InMemoryDataProvider'
        ],

		$bootstrap: function(){
			TranslatorRegistry.register(this, 'DataCube.Providers.InMemoryDataProvider');
			TranslatorRegistry.register(this, 'DataCube.Providers.JsonFileDataProvider');
		},

		$constructor: function(provider, cubeOrQueryEngine){
		    $base(provider, cubeOrQueryEngine);
		},

		translatedQueryIterator: function(dcQuery, params){
		    // TODO: translate query to loki
            var result = this.providers[0].find();

            var fieldsMap = {};
            var managedFields = this.cube.getManagedFields();
            for (var field in managedFields) if (managedFields.hasOwnProperty(field)) {
                var binding = managedFields[field].binding;
                for(var b in binding) {
                    if (this.providers[0] == binding[b].provider) {
                        fieldsMap[field] = binding[b].field;
                    }
                }
            }

            var i = 0;
		    return {
		        next: function(){
                    if (i < result.length) {
                        var value = result[i++];
                        return $this._mapCubeFields(value, fieldsMap);
                    }
                    return null;
		        },
		        close: function(){

		        }
		    };
		},

		close: function() {
		    this.destroy();
		},

		_mapCubeFields: function(value, fieldsMap) {
		    if (this.cube) {
		        var newValue = {};
                for (var cubeField in fieldsMap) if (fieldsMap.hasOwnProperty(cubeField)) {
                    newValue[cubeField] = value[fieldsMap[cubeField]];
                }
                return newValue;
		    } else {
		        return value;
            }
		}
	}
}