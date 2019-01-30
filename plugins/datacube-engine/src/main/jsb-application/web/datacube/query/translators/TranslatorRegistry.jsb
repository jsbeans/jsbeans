{
	$name: 'DataCube.Query.Translators.TranslatorRegistry',
	$singleton: true,

	$server: {
		$require: [
		    'JSB.System.Config',
		    'DataCube.Query.QueryUtils'
        ],

        translatorsCfg: null,
        translatorsJsb: {},
        
        $constructor: function(){
        	$base();
        	$this.translatorsCfg = Config.get('datacube.query.translators');
        },

		register: function(translatorJsb){

            if(translatorJsb instanceof JSB){
				translatorJsb = translatorJsb.$name;
			}

			var config = $this.translatorsCfg[translatorJsb];
			if (config) {
			    JSB.getLogger().debug('Registered translator ' + translatorJsb);
			    $this.translatorsJsb[translatorJsb] = JSB.get(translatorJsb);
			    QueryUtils.throwError($this.translatorsJsb[translatorJsb], 'Translator {} is undefined ');
			}
		},

		lookupTranslators: function(providerType, providers, defaultCube){
            var translators = [];
            for(var translatorName in $this.translatorsJsb) {
                var config = $this.translatorsCfg[translatorName];
                var providerJsb = JSB.get(providerType);
                for(var i = 0; i < config.providers.length; i++){
                	if(providerJsb.isSubclassOf(config.providers[i])){
                		var Translator = $this.translatorsJsb[translatorName].getClass();
                        translators.push(new Translator(providers, defaultCube));
                        break;
                	}
                }
            }
            return translators;
		},
	}
}