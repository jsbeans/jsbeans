{
	$name: 'DataCube.Query.Engine.QueryProfiler',
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(){
		},

		start: function(qid, details) {
            Log.debug('[qid='+qid+'] - START: ' + JSON.stringify(details));
		},

		profile: function(qid, name, details) {
		    if (details) {
                var args = Array.prototype.slice.call(arguments, 0);
		        if (JSB.isObject(details) || JSB.isArray(details)) {
		            args[2] = JSON.stringify(details);
		        }
                var msg = QueryUtils.sformat('[qid={}] - {}: {}', args);
		        Log.debug(msg);
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