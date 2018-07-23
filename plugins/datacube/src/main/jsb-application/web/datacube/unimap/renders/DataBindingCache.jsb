{
	$name: 'Unimap.Render.DataBindingCache',
	$singleton: true,
	
	_cache: {},
	
	get: function(ctx, srcKey, bKey){
		return $this._cache[ctx] && $this._cache[ctx][srcKey] && $this._cache[ctx][srcKey][bKey];
	},
	
	put: function(ctx, srcKey, bKey, val){
		this.lock('DataBindingCache');
		if(!$this._cache[ctx]){
			$this._cache[ctx] = {};
		}
		if(!$this._cache[ctx][srcKey]){
			$this._cache[ctx][srcKey] = {};
		}
		$this._cache[ctx][srcKey][bKey] = val;
		this.unlock('DataBindingCache');
	},
	
	remove: function(ctx, srcKey, bKey){
		this.lock('DataBindingCache');
		if($this._cache[ctx]){
			if(srcKey){
				if($this._cache[ctx][srcKey]){
					if(bKey){
						if($this._cache[ctx][srcKey][bKey]){
							delete $this._cache[ctx][srcKey][bKey];
						}
					} else {
						delete $this._cache[ctx][srcKey];
					}
				}
			} else {
				delete $this._cache[ctx];
			}
		}
		this.unlock('DataBindingCache');
	}
}