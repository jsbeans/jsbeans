/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(){
		},

		setParamType: function(param, type){
            throw new Error('Not implemented');
		},

		getParamType: function(param){
		    throw new Error('Not implemented');
		},

		translatedQueryIterator: function(dcQuery, params){
		    /// returns:
		    /// 1) null - is not compatible
		    /// 2) {
            ///    next: function(){
            ///    },
            ///    close: function(){
            ///    }
            /// }
		    throw new Error('Not implemented');
		},

		close: function() {
		    throw new Error('Not implemented');
		},
	}
}