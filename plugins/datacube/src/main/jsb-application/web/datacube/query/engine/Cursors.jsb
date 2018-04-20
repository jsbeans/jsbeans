{
	$name: 'DataCube.Query.Engine.Cursors',
	$singleton: true,

	$server: {
		$require: [
        ],

		$constructor: function(){
		    function installSuper(obj, _super) {
		        if (!Object.setPrototypeOf) {
		            obj.__proto__ = _super;
		        } else {
		            Object.setPrototypeOf(obj, _super);
		        }

		        return _super;
		    };

		    this.Cursor = function Cursor(executionContext) {
		   		this.object = null;
		   		this.next   = function (){};
		   		this.close  = function (){};
		   		this.reset  = function (){};
		   		this.clone  = function (){};
		   		this.getExecutionContext = function() {
		   		    return executionContext;
		   		};
		    };

		    /** Group of expressions
		    */
		    this.CachedCursor = function CachedCursor(innerCursor) {
		        var _super = installSuper(this, new $this.Cursor());

                var fully = false;
                var cache = {
                    values: [],
                    pos :-1,
                };
                var currentPos = -1;

                this._setCache = function(newCache){
                    cache = newCache;
                };

		   		this.getExecutionContext = function() {
		   		    return _super.getExecutionContext();
		   		};

                this.next = function() {
                    currentPos++;
                    if(cache.values[currentPos] !== undefined) {
                        this.object = cache.values[currentPos];
                    } else {
                        this.object = cache.values[currentPos] = innerCursor.next();
                    }
                    if (this.object == null) {
                        fully = true;
                        innerCursor.close();
                    }
                    return this.object;
                };

                this.reset = function (){
                    if (!fully) {
                        // complete and close
                        while(this.next());
                    }
                    currentPos = -1;
                    this.object = null;
                };

                this.close = function (){
                    this.object = null;
                    cachedValues = null;
                    if (!fully) {
                        this.close();
                    }
                };

                this.clone = function (){
                    var cloned = new $this.CachedCursor(innerCursor.clone());
                    cloned._setCache(cache);
                    return cloned;
                };
		    };

		    /** String expression value
		    */
		    this.EString = function EString(desc) {
		        desc.type = 'string';
		        desc.expressionType = desc.expressionType || 'EString';
		        var _super = installSuper(this, new $this.Expression(desc));
		    };
        },

	}
}