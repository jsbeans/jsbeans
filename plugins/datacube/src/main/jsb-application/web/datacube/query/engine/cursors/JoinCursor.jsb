{
	$name: 'DataCube.Query.Engine.Cursors.JoinCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
		    'JSB.Crypt.MD5',
		    'DataCube.Query.Engine.RuntimeFunctions',

            'java:java.util.HashMap'
        ],

		$constructor: function(type, filter, leftCursor, createRightCursor){
		    $base();

		    $this.filter = filter;
		    $this.leftCursor = leftCursor;
		    $this.createRightCursor = createRightCursor;
		    $this.rightCursor = null;
		    $this.type = type || 'left outer'; // or inner

            $this._build();
        },

        _build: function(){
		    $this.objects = [];
        },

        next: function(){
            /// next left or complete
            if (!$this.leftObject) {
                $this.leftObject = $this.leftCursor.next();
                if ($this.leftObject == null) {
                    $this.leftCursor.close();
                    return null;
                }
            }
            /// next right
            if ($this.rightCursor) {
                var value = $this.rightCursor.next();
                if (value == null) {
                    $this.rightCursor.close();
                    $this.rightCursor = null;
                    if ($this.type === 'inner') {
                        /// next left
                        $this.leftObject = null;
                        return next(); // TODO delete recursion
                    }
                } else {
                    return merge(value, $this.leftObject);
                }
            }

            /// create right
            var params = {};
            var select = {};
            for(var i = 0; $this.on.length; i++) {
                params[$this.on[i].$rightField] = $this.leftObject[$this.on[i].$leftField];
                select[$this.on[i].$rightField] = $this.on[i].$rightField;
            }
            // TODO: fill select used fields
            $this.rightCursor = createRightCursor({
                $select: select,
                $params: params,
            });
            return null;
        },

        close: function(){
            if(!$this.leftCursor.closed) {
                $this.leftCursor.close();
            }
            if($this.rightCursor && !$this.rightCursor.closed) {
                $this.rightCursor.close();
            }
        },

        reset: function(){
            $this.leftCursor.reset();
            if($this.rightCursor && !$this.rightCursor.closed) {
                $this.rightCursor.close();
            }
		    $this.leftObject = null;
        },

        clone: function(){
            return new $this.Class($this.filter, $this.type, $this.leftCursor.clone(), $this.createRightCursor);
        },
	}
}