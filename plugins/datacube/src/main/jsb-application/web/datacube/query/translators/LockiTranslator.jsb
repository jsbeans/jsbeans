{
	$name: 'JSB.DataCube.Query.Translators.LockiTranslator',
	$parent: 'JSB.DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'JSB.DataCube.Providers.InMemoryDataProvider'
        ],

		$constructor: function(provider, cube){
		    $base(provider);
		    this.cube = cube;
		    this.queryEngine = cube.queryEngine;
		},

		translatedQueryIterator: function(dcQuery, params){
		    if (this.iterator) {
		        // close previous iterator
		        this.iterator.close();
		    }

            var loki = { };
		    return {
		        next: function(){
                    if (!loki.data) {
                        loki.data = $this._prepareData(dcQuery, params)
                        loki.pos = 0;
                    }

		        },
		        close: function(){
		            if (loki.data) delete loki.data;
		        }
		    };
		},

		close: function() {
		    this.iterator.close();
		},

		_prepareData: function(dcQuery, params){
            var dpQuery = this._translateToDataProviderFields(dcQuery);

		    var data = dpQuery.$filter
                    ? provider.collection.find(this._translateFind(dpQuery, params))
                    : provider.collection.find();

            // TODO
            return data;
		},

		_translateToDataProviderFields: function(dcQuery){
		},

		_translateFind: function(dcQuery, params) {
debugger;
            return query;
        },
	}
}