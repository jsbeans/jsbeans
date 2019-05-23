/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

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