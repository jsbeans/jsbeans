/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.QueryTracer',
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(qid){
		    $this.qid = qid;
		},

//		history: {},

		start: function(details) {
//		    $this.history[''+Date.now()] = {
//		        details: details,
//		    }
            Log.debug('[qid='+$this.qid+'] - START: ' + JSON.stringify(details));
		},

		profile: function(name, details) {
		    if (details) {
                var msg = QueryUtils.sformat('[qid={}] - {}: {}',
                    $this.qid, name,
                    JSB.isObject(details) || JSB.isArray(details) ? JSON.stringify(details) : details
                );
		        Log.debug(msg);
            } else {
                Log.debug('[qid='+$this.qid+'] - ' + name);
            }
		},

		complete: function(name) {
            Log.debug('[qid='+$this.qid+'] - COMPLETE:' + name);
		},

		failed: function(name, error) {
            Log.debug('[qid='+$this.qid+'] - FAILED: ' + name + ': ' + JSB.stringifyError(error));
		},

		destroy: function(){
//		    history = null;
		    $base();
		},
	}
}