{
	$name: 'JSB.Workspace.WorkspaceController',
	$singleton: true,

	$server: {
		$require: ['JSB.IO.FileSystem', 
		           'JSB.System.Config'],
		
		managers: {},
		fileUploadCallbackRegistry: {},
		explorerNodeRegistry: {},
		browserViewRegistry: {},
		workspaceDescriptors: {},
		workspacesById: {},
		workspacesByType: {},
		workspacesByUser: {},
		configVariables: {},
		
		
		$constructor: function(){
			$base();
			
			JSB.getRepository().ensureLoaded(function(){
				$this._init();
				$this.setTrigger('ready');
			});
			
		},
		
		_init: function(){
			// setup initial config variables
			this.configVariables = {
				'USER_DIR': FileSystem.getUserDirectory(true)
			}
			
			// load configuration
			var wTypes = Config.get('workspace.workspaceTypes');
			for(var wType in wTypes){
				this.workspaceDescriptors[wType] = wTypes[wType];
			}
			
			// scan all workspaces
			this._scanWorkspaces();
			
			// create system workspaces
			for(var wType in this.workspaceDescriptors){
				if(this.workspaceDescriptors[wType].system){
					this.createWorkspace(wType);
				}
			}
			
			
		},
		
		_resolveConfigVariables: function(obj, vars){
			vars = vars || this.configVariables;
			if(JSB.isObject(obj)){
				var nObj = {};
				for(var f in obj){
					nObj[f] = this._resolveConfigVariables(obj[f], vars);
				}
				return nObj;
			} else if(JSB.isArray(obj)){
				var nObj = [];
				for(var i = 0; i < obj.length; i++){
					nObj.push(this._resolveConfigVariables(obj[i], vars));
				}
				return nObj;
			} else if(JSB.isString(obj)){
				return obj.replace(/\%([^\%]+)\%/gi, function(o, v){
					if(vars[v]){
						return vars[v];
					}
					return o;
				});
			} else {
				return obj;
			}
		},
		
		_scanWorkspaces: function(){
			for(var wType in this.workspaceDescriptors){
				var wCfg = this.workspaceDescriptors[wType];
				var entryStoreCfg = wCfg.entryStore;
				if(!entryStoreCfg || !entryStoreCfg.jsb){
					throw new Error('Invalid entry store configuration in workspace type: ' + wType);
				}
				var jsb = JSB.get(entryStoreCfg.jsb);
				if(!jsb){
					throw new Error('Unable to create entry store due to missing bean: ' + entryStoreCfg.jsb);
				}
				var resolvedCfg = this._resolveConfigVariables(entryStoreCfg);
				var entryStore = new (jsb.getClass())(resolvedCfg);
				
				var mtx = 'JSB.Workspace.WorkspaceController.indices';
				JSB.getLocker().lock(mtx);
				try {
					var wsIter = entryStore.getWorkspaces();
					while(wsIter.hasNext()){
						var wsDesc = wsIter.next();
						var wDesc = JSB.merge({
							wType: wType,
							wInst: null
						}, wsDesc);
						this.workspacesById[wDesc.wId] = wDesc;
						this.workspacesByType[wType] = this.workspacesByType[wType] || {};
						this.workspacesByType[wType][wDesc.wId] = wDesc;
						this.workspacesByUser[wDesc.wOwner] = this.workspacesByUser[wDesc.wOwner] || {};
						this.workspacesByUser[wDesc.wOwner][wDesc.wId] = wDesc;
					}
				} finally {
					entryStore.destroy();
					JSB.getLocker().unlock(mtx);
				}
				
				
			}
		},
		
		createWorkspace: function(wType, opts){
			if(!wType){
				throw new Error('Failed to create workspace due to missing it\'s workspace type argument');
			}
			var wCfg = this.workspaceDescriptors[wType];
			if(!wCfg){
				throw new Error('Failed to create workspace of unknown type: ' + wType);
			}
			var wId = null;
			if(wCfg.system){
				// check if system workspace has already existed
				if(this.workspacesByType[wType] && Object.keys(this.workspacesByType[wType]).length > 0){
					wId = Object.keys(this.workspacesByType[wType])[0];
					return this.loadWorkspace(wId);
				}
			}
			wId = (opts && opts.id) || wCfg.workspaceId || JSB.generateUid();
			
			var mtx = 'JSB.Workspace.WorkspaceController.indices';
			JSB.getLocker().lock(mtx);
			
			try {
				if(this.workspacesById[wId]){
					return this.loadWorkspace(wId);
				}
				var wDesc = {
					wId: wId,
					wType: wType
				};
				
				var resolvedConf = this._resolveConfigVariables(wCfg, JSB.merge({}, this.configVariables, {'WORKSPACE_ID':wId}));
				var wCls = JSB.get('JSB.Workspace.Workspace').getClass();
				var wInst = new wCls(wId, resolvedConf, wDesc);
				wDesc.wInst = wInst;
				wDesc.wOwner = wInst.getOwner();
				wInst.property('_wt', wType);
	
				// store indices
				this.workspacesById[wId] = wDesc;
				this.workspacesByType[wType] = this.workspacesByType[wType] || {}
				this.workspacesByType[wType][wId] = wDesc;
				this.workspacesByUser[wDesc.wOwner] = this.workspacesByUser[wDesc.wOwner] || {};
				this.workspacesByUser[wDesc.wOwner][wId] = wDesc;
				
				// enhance workspace with attributes in opts
				var name = (opts && opts.name) || wCfg.defaultName;
				if(name){
					wInst.setName(name);
				}
	
				wInst.store();
				return wInst;
			} finally {
				JSB.getLocker().unlock(mtx);
			}
		},
		
		removeWorkspace: function(wId){
			if(!wId){
				throw new Error('No workspace id passed in WorkspaceController.removeWorkspace');
			}
			if(!JSB.isString(wId) && JSB.isInstanceOf(wId, 'JSB.Workspace.Workspace')){
				wId = wId.getId();
			}
			var mtx = 'JSB.Workspace.WorkspaceController.indices';
			JSB.getLocker().lock(mtx);
			try {
				var wDesc = this.workspacesById[wId];
				if(!wDesc){
					return;
				}
				
				if(!wDesc.wInst){
					wDesc.wInst = this.loadWorkspace(wId);
				}
				
				delete this.workspacesById[wId];
				if(this.workspacesByType[wDesc.wType] && this.workspacesByType[wDesc.wType][wId]){
					delete this.workspacesByType[wDesc.wType][wId];
				}
				if(this.workspacesByUser[wDesc.wOwner] && this.workspacesByUser[wDesc.wOwner][wId]){
					delete this.workspacesByUser[wDesc.wOwner][wId];
				}
			} finally {
				JSB.getLocker().unlock(mtx);
			}
			if(!wDesc.wInst.isDestroyed()){
				wDesc.wInst.remove();
			}
		},
		
		loadWorkspace: function(wId){
			if(!wId){
				throw new Error('Missing workspace id argument while loading workspace');
			}
			var wDesc = this.workspacesById[wId];
			if(!wDesc){
				throw new Error('Load workspace failed. Missing workspace with id: ' + wId);
			}
			if(wDesc.wInst){
				return wDesc.wInst;
			}
			var wCfg = this.workspaceDescriptors[wDesc.wType];
			var resolvedConf = this._resolveConfigVariables(wCfg, JSB.merge({}, this.configVariables, {'WORKSPACE_ID':wId}));
			var wCls = JSB.get('JSB.Workspace.Workspace').getClass();
			var wInst = new wCls(wId, resolvedConf, wDesc);
			wDesc.wInst = wInst;
			wDesc.wOwner = wInst.getOwner();
			
			return wInst;
		},
		
		getWorkspacesInfo: function(user){
			var infoArr = [];
			var wMap = null;
			if(Kernel.isAdmin()){
				if(user){
					wMap = this.workspacesByUser[user];
				} else {
					wMap = this.workspacesById;
				}
			} else {
				user = Kernel.user();
				wMap = this.workspacesByUser[user];
			}
			if(wMap && Object.keys(wMap).length > 0){
				for(wId in wMap){
					infoArr.push({
						wId: wId,
						wType: wMap[wId].wType,
						wOwner: wMap[wId].wOwner
					});
				} 
			}
			
			return infoArr;
		},
		
		getWorkspaceInfo: function(wId){
			var wDesc = this.workspacesById[wId];
			if(!wDesc){
				throw new Error('Missing workspace with id: ' + wId);
			}
			if(Kernel.isAdmin() || wDesc.wOwner == Kernel.user()){
				return {
					wId: wId,
					wType: wDesc.wType,
					wOwner: wDesc.wOwner
				};
			}
			throw new Error('Workspace restricted for user: ' + Kernel.user());
		},
		
		getWorkspace: function(wId){
			var wDesc = this.getWorkspaceInfo(wId);
			return this.loadWorkspace(wDesc.wId);
		},
		
/*		
		ensureManager: function(wmKey){
			if(!wmKey){
				throw new Error('No wmKey specified');
			}
			if(!this.managers[wmKey]){
				var dir = FileSystem.getUserDirectory();
				var fld = wmKey;
				if(Config.has('workspace.managers.' + wmKey)){
					var cfgEntry = Config.get('workspace.managers.' + wmKey);
					dir = cfgEntry.baseDirectory || dir;
					fld = cfgEntry.folderName || fld
				}
				
				var WorkspaceManager = $jsb.get('JSB.Workspace.WorkspaceManager').getClass();
				if(!WorkspaceManager){
					throw new Error('Unable to find JSB.Workspace.WorkspaceManager');
				}
				var wm = new WorkspaceManager({
					id: 'wm-' + wmKey,
					wmKey: wmKey,
					artifactsStore: {
						home: FileSystem.join(dir, fld)
					}
				});
				this.managers[wmKey] = wm;
			}
			return this.managers[wmKey];
		},
*/		
		registerExplorerNode: function(wmKeys, entryType, priority, nodeType){
			var locker = JSB.getLocker();
			locker.lock('registerExplorerNode_' + this.getId());
			try {
				if(!$jsb.isArray(wmKeys)){
					wmKeys = [wmKeys||null];
				}
				for(var i = 0; i < wmKeys.length; i++){
					var wmKey = wmKeys[i];
					if(!this.explorerNodeRegistry[wmKey]){
						this.explorerNodeRegistry[wmKey] = {};
					}
					var regEntry = this.explorerNodeRegistry[wmKey];
					if(entryType instanceof JSB){
						entryType = entryType.$name;
					}
					if(!regEntry[entryType]){
						regEntry[entryType] = [];
					}
					regEntry[entryType].push({priority:priority, nodeType:nodeType});
				}
			} finally {
				locker.unlock('registerExplorerNode_' + this.getId());
			}
		},
		
		queryExplorerNodeType: function(wmKey, entryType){
			if(!entryType){
				throw new Error('Expected entryType');
			}
			if($jsb.isBean(entryType)){
				entryType = entryType.getJsb().$name;
			} else if(entryType instanceof JSB){
				entryType = entryType.$name;
			} else if($jsb.isFunction(entryType) && entryType.jsb){
				entryType = entryType.jsb.$name;
			}
			var regEntryArr = [];
			var wmKeys = [null];
			if(wmKey){
				wmKeys.push(wmKey);
			}
			for(var j = 0; j < wmKeys.length; j++){
				wmKey = wmKeys[j];
				if(this.explorerNodeRegistry[wmKey] && this.explorerNodeRegistry[wmKey][entryType]){
					for(var i = 0; i < this.explorerNodeRegistry[wmKey][entryType].length; i++){
						regEntryArr.push(this.explorerNodeRegistry[wmKey][entryType][i]);
					}
				}
			}
			regEntryArr.sort(function(a, b){
				return b.priority - a.priority;
			});
			if(regEntryArr.length > 0){
				return regEntryArr[0].nodeType;
			}
			return null;
		},
		
		constructExplorerNodeTypeSlice: function(wmKey){
			var slice = {};
			var wmKeys = [null];
			if(wmKey){
				wmKeys.push(wmKey);
			}
			for(var j = 0; j < wmKeys.length; j++){
				wmKey = wmKeys[j];
				if(!this.explorerNodeRegistry[wmKey]){
					continue;
				}
				for(var eType in this.explorerNodeRegistry[wmKey]){
					if(!slice[eType]){
						slice[eType] = [];
					}
					var rArr = this.explorerNodeRegistry[wmKey][eType];
					for(var i = 0; i < rArr.length; i++){
						slice[eType].push(rArr[i]);
					}
				}
			}
			var rSlice = {};
			for(var eType in slice){
				var arr = slice[eType];
				arr.sort(function(a, b){
					return b.priority - a.priority;
				});
				if(arr.length > 0){
					rSlice[eType] = arr[0].nodeType;
				}
			}
			
			return rSlice;
		},
		
		registerFileUploadCallback: function(wmKeys, entryType, priority, callback){
			var locker = JSB.getLocker();
			locker.lock('registerFileUploadCallback_' + this.getId());
			try {
				if(!$jsb.isArray(wmKeys)){
					wmKeys = [wmKeys||null];
				}
				for(var i = 0; i < wmKeys.length; i++){
					var wmKey = wmKeys[i];
					if(!this.fileUploadCallbackRegistry[wmKey]){
						this.fileUploadCallbackRegistry[wmKey] = {};
					}
					var regEntry = this.fileUploadCallbackRegistry[wmKey];
					if(entryType instanceof JSB){
						entryType = entryType.$name;
					}
					if(!regEntry[entryType]){
						regEntry[entryType] = [];
					}
					regEntry[entryType].push({priority:priority, callback:callback});
				}
			} finally {
				locker.unlock('registerFileUploadCallback_' + this.getId());
			}
		},
		
		queryFileUploadEntryType: function(wmKey, fileName, fileData){
			var regEntryArr = [];
			var wmKeys = [null];
			if(wmKey){
				wmKeys.push(wmKey);
			}
			for(var j = 0; j < wmKeys.length; j++){
				if(this.fileUploadCallbackRegistry[wmKeys[j]]){
					for(var eType in this.fileUploadCallbackRegistry[wmKeys[j]]){
						var regEntryLst = this.fileUploadCallbackRegistry[wmKeys[j]][eType];
						for(var i = 0; i < regEntryLst.length; i++){
							var regEntry = regEntryLst[i];
							regEntryArr.push($jsb.merge({entryType: eType}, regEntry));
						}
					}
				}
			}
			regEntryArr.sort(function(a, b){
				return b.priority - a.priority;
			});
			for(var i = 0; i < regEntryArr.length; i++){
				if(regEntryArr[i].callback.call($this, fileName, fileData)){
					return regEntryArr[i].entryType;
				}
			}
			
			return null;
		},
		
		registerBrowserView: function(viewType, viewOpts){
			var locker = JSB.getLocker();
			locker.lock('registerBrowserView_' + this.getId());
			try {
				var wmKeys = viewOpts.wmKey;
				if(!JSB.isArray(wmKeys)){
					wmKeys = [wmKeys||null];
				}
				if(viewType instanceof JSB){
					viewType = viewType.$name;
				} else if(JSB.isBean(viewType)){
					viewType = viewType.getJsb().$name;
				} else if(!JSB.isString(viewType)){
					throw new Error('Invalid viewType');
				}
				var acceptNodes = viewOpts.acceptNode;
				if(!acceptNodes){
					acceptNodes = null;
				}
				if(!JSB.isArray(acceptNodes)){
					acceptNodes = [acceptNodes];
				}
				
				for(var j = 0; j < wmKeys.length; j++){
					var wmKey = wmKeys[j];
					if(!this.browserViewRegistry[wmKey]){
						this.browserViewRegistry[wmKey] = {};
					}
					for(var n = 0; n < acceptNodes.length; n++){
						var aNode = acceptNodes[n];
						if(!this.browserViewRegistry[wmKey][aNode]){
							this.browserViewRegistry[wmKey][aNode] = [];
						}
						this.browserViewRegistry[wmKey][aNode].push({
							viewType: viewType,
							priority: viewOpts.priority || 0,
							caption: viewOpts.caption,
							icon: viewOpts.icon
						});
					}
				}
			} finally {
				locker.unlock('registerBrowserView_' + this.getId());
			}
		},
		
		queryBrowserViews: function(wmKey, nodeJsb){
			var viewArr = [];
			if(JSB.isNull(nodeJsb)){
				// do nothing
			} else if(JSB.isString(nodeJsb)){
				nodeJsb = JSB.get(nodeJsb);
			} else if(JSB.isBean(nodeJsb)){
				nodeJsb = nodeJsb.getJsb();
			} else if(!(nodeJsb instanceof JSB)){
				throw new Error('Invalid nodeJsb');
			}
			var wmKeys = [null];
			if(wmKey){
				wmKeys.push(wmKey);
			}
			for(var j = 0; j < wmKeys.length; j++){
				var wmKey = wmKeys[j];
				if(!this.browserViewRegistry[wmKey]){
					continue;
				}
				for(var nType in this.browserViewRegistry[wmKey]){
					if((nodeJsb && nodeJsb.isSubclassOf(nType)) || (JSB.isNull(nodeJsb) && (JSB.isNull(nType) || nType == 'null'))){
						viewArr = viewArr.concat(this.browserViewRegistry[wmKey][nType]);
					}
				}
			}
			viewArr.sort(function(a, b){
				return b.priority - a.priority;
			});
			
			return viewArr;
		}

	}
}