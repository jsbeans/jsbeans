{
	$name: 'DataCube.Workspace.BrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$scheme: {},
	
	$client: {
		$require: ['Unimap.Selector'],
		
		setCurrentEntry: function(entry, opts){
			if(this.getCurrentEntry() === entry){
				return;
			}
			if(opts.scheme && opts.settings){
				$this._ctx = new Selector({
					values: opts.settings,
					scheme: opts.scheme,
					createDefaultValues: true,
					updateValues: true
				});
			} else {
				$this._ctx = null;
			}
			$base(entry, opts);
		},
		
		getContext: function(){
			return $this._ctx;
		}
	}
	
}