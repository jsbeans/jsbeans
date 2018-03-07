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
			
			// enumerate system workspaces
			for(var wType in this.workspaceDescriptors){
				if(this.workspaceDescriptors[wType].system){
					if(!this.workspacesByType[wType]){
						this.createWorkspace(wType);
					}
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
				var entryStore = new (jsb.getClass())(resolvedCfg, wType);
				var idIter = entryStore.getWorkspaceIds();
				while(true){
					var idVal = idIter.next();
					if(!idVal){
						break;
					}
					
				}
				
			}
		},
		
		createWorkspace: function(wType){
			
		},
		
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