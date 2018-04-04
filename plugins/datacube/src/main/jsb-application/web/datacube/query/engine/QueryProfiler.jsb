{
	$name: 'DataCube.Query.Engine.QueryProfiler',
	$server: {
		$require: [
        ],

		$constructor: function(){
		},

		start: function(qid, details) {
            Log.debug('[qid='+qid+'] - START: ' + JSON.stringify(details));
		},

		profile: function(qid, name, details) {
		    if (details) {
		        Log.debug('[qid='+qid+'] - ' + name + ': ' + JSON.stringify(details));
            } else {
                Log.debug('[qid='+qid+'] - ' + name);
            }
		},

		complete: function(qid) {
            Log.debug('[qid='+qid+'] - COMPLETE');
		},

		failed: function(qid, error) {
            Log.debug('[qid='+qid+'] - FAILED: ' + JSB.stringifyError(error));
		},
	}
}