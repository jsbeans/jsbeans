{
	$name: 'DataCube.Query.Translators.TranslatorRegistry',
	$singleton: true,

	$server: {
		$require: [
		    'JSB.System.Config',
		    'DataCube.Query.QueryUtils'
        ],
        $constructor: function(){
        	$base();
        },

		register: function(translatorJsb){
		},
	}
}