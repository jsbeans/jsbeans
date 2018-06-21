{
	$name: 'DataCube.Query.Engine.Cursors.ViewCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
		    'DataCube.Query.Engine.RuntimeFunctions',

		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

		$constructor: function(executor, query, params, parent, caller){
		    $base(executor, parent, caller);
		    $this.query = query;
		    $this.context = query.$context;
		    $this.params = params;
		    $this.cid = parent ? parent.cid + '/' + query.$context : query.$context;

		    $this.JSB = JSB;
		    $this.MD5 = MD5;
		    $this.QueryUtils = QueryUtils;
		    $this.QuerySyntax = QuerySyntax;
		    $this.Common = RuntimeFunctions.Common;
		    $this.Operators = RuntimeFunctions.Operators;
		    $this.Aggregate = RuntimeFunctions.Aggregate;
        },

        source:  null,
        fields: {},

        getNested: function(){
            return [];
        },

        getFieldValue: function(e) {
            // if external field find parent context
            if (e.$context && e.$context != $this.context) {
                $this.QueryUtils.throwError($this.parent, 'External field is not defined: {}', JSON.stringify(e));
                return $this.Common.get.call($this.parent, e);
            }
            // output or input value
            var value = $this.object[e.$field];
            if (typeof value === 'undefined') {
                value = $this.source.object[e.$field];
            }
            $this.QueryUtils.throwError(typeof value !== 'undefined', 'Field is not defined: {}', JSON.stringify(e));
            return value;
        },

        reset: function(){
            var nested = $this.getNested();
            for(var c in nested){
                nested[c].reset();
            }
            $this.source.reset();
        },

        close: function(){
            if ($this.closed) return;
            var nested = $this.getNested();
            for(var c in nested){
                nested[c] && nested[c].close();
            }
            $this.source && $this.source.close();
            $base();
        },

        next: function(){
            return $this.source.next();
        },

		analyze: function(){
		    var json = $base();
		    json.source = $this.source && $this.source.analyze();
		    json.fields = $this.fields;
		    json.nested  = {};
            var nested = $this.getNested();
            for(var c in nested){
                json.nested[c] = nested[c] && nested[c].analyze();
            }
		    return json;
		},

	}
}