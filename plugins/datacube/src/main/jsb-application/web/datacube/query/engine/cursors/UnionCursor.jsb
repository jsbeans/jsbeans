{
	$name: 'DataCube.Query.Engine.Cursors.UnionCursor',
	$parent: 'DataCube.Query.Engine.Cursors.ViewCursor',

	$server: {
		$require: [
        ],

		$constructor: function(executor, query, params, parent, caller){
		    $base(executor, query, params, parent, caller);
        },

        unions: [],
        unionPos: 0,

        addUnion: function(cursor){
            $this.unions.push(cursor);
        },

        getNested: function(){
            var nested = {};
            for(var i=0; i < $this.unions.length; i++) {
                var c = $this.unions[i];
                nested[c.cid] = c;
            }
            return nested;
        },

        close: function(){
            if ($this.closed) return;
            $this.unions = [];
            $base();
        },

		analyze: function(){
		    var json = $base();
		    json.unions  = [];
            for(var i=0; i < $this.unions.length; i++) {
                json.unions.push($this.unions[i] && $this.unions[i].analyze());
            }
		    return json;
		},

        reset: function(){
            $this.unionPos = 0;
            $base();
        },

        next: function(){
            while($this.unionPos < $this.unions.length) {
                var value = $this.unions[$this.unionPos].next();
                if(value == null) {
                    $this.unionPos++;
                    continue;
                }
                return value;
            }
            return null;
        },

	}
}