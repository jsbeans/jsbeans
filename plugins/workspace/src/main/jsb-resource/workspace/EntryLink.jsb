{
	$name: 'JSB.Workspace.EntryLink',
	$parent: 'JSB.Workspace.Entry',
	
	_targetEntry: null,
	_access: null,
	
	getTargetEntry: function(){
		return this._targetEntry;
	},
	
	canRead: function(){
		return this._access >= 1;
	},
	
	canWrite: function(){
		return this._access >= 2;
	},
	
	isLink: function(){
		return true;
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				$this._targetEntry = opts.entry;
				$this.property('_eId', $this._targetEntry.getId());
				$this.property('_wId', $this._targetEntry.getWorkspace().getId());
				$this._access = opts.access;
				$this.property('_access', $this._access);
			} else {
				if($this.property('_eId')){
					$this._targetEntry = WorkspaceController.getWorkspace($this.property('_wId')).entry($this.property('_eId'));
				}
				$this._access = $this.property('_access');
			}
		},
		
		setAccess: function(access){
			$this._access = access;
			$this.property('_access', $this._access);
		}
		
	}
}