/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Workspace.BrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$scheme: {},
	
	$client: {
		$require: ['Unimap.Selector',
		           'Unimap.Repository'],
		
		setCurrentEntry: function(entry, opts){
			if(this.getCurrentEntry() === entry){
				return;
			}
			if(opts.scheme && opts.settings){
				Repository.ensureInitialized(function(){
					$this._ctx = new Selector({
						values: opts.settings,
						scheme: opts.scheme,
						createDefaultValues: true,
						updateValues: true
					});
					$base(entry, opts);
				});
			} else {
				$this._ctx = null;
				$base(entry, opts);
			}
			
		},
		
		getContext: function(){
			return $this._ctx;
		}
	}
	
}