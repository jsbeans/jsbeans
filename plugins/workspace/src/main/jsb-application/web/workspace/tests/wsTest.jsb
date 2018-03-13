{
	$name: 'JSB.Workspace.Tests.WsTest',
	$require: ['JSB.Workspace.WorkspaceController', 'JSB.Workspace.FolderEntry', 'JSB.IO.FileSystem'],
	$fixedId: true,
	
	$constructor: function(){
		$base();
	},
	
	test1: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.createWorkspace('user', {id: 'userTest1'});
		for(var i = 0; i < 10000; i++){
			var fe = new FolderEntry(JSB.generateUid(), userWs);
			fe.setName('folder_' + i);
		}
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1)); 
	},
	
	test12: function(){
		var t1 = Date.now();
		WorkspaceController.removeWorkspace('userTest1');
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
	},
	
	test2: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest1');
		var eIt = userWs.entries();
		var eNames = [];
		while(eIt.hasNext()){
			var e = eIt.next();
			eNames.push(e.getName());
		}
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
		return eNames;
	},
	
	test3: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest1');
		for(var i = 0; i < 10; i++){
			var fe = new FolderEntry(JSB.generateUid(), userWs);
			fe.setName('oddFolder_' + i);
		}
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
	},
	
	test4: function(){
		var fPath = $jsb.getFullPath() + '/resources/dostoevsky.txt';
		var buffer = FileSystem.read(fPath, {binary:true});
		var t1 = Date.now();
		var userWs = WorkspaceController.createWorkspace('user', {id: 'userTest2'});
		for(var i = 0; i < 3; i++){
			var fe = new FolderEntry(JSB.generateUid(), userWs);
			fe.setName('folder_' + i);
			
			// write text artifact
			fe.storeArtifact('text.art', 'This is a artifact body');
			
			// write json artifact
			fe.storeArtifact('json.art', {f1: 'f1', f2: true, f3: {sukan:1}});
			
			// write binary artifact
			fe.storeArtifact('bin.art', buffer);
		}
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1)); 
	},
	
	test5: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest2');
		var eIt = userWs.entries();
		var eArts = [];
		while(eIt.hasNext()){
			var e = eIt.next();
			if(e.existsArtifact('text.art')){
				eArts.push({
					text: e.loadArtifact('text.art'),
					json: e.loadArtifact('json.art'),
					bin: e.loadArtifact('bin.art')
				});
			}
		}
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
		return eArts;
	},
	
	test6: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest2');
		var eMap = userWs.getEntries();
		var e = eMap[Object.keys(eMap)[0]];
		var aMap = e.getArtifacts();
		for(var aName in aMap){
			e.removeArtifact(aName);
		}
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1)); 
	},
	
	test7: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.createWorkspace('user', {id: 'userTest3'});
		for(var i = 0; i < 3; i++){
			var fe = new FolderEntry(JSB.generateUid(), userWs);
			fe.setName('folder_' + i);
			fe.storeArtifact('data', 'folder artifact data');
			
			for(var j = 0; j < 3; j++){
				var fes = new FolderEntry(JSB.generateUid(), userWs);
				fes.setName('subfolder_' + j);
				fes.storeArtifact('subdata', 'subfolder artifact data');
				fe.addChildEntry(fes);
			}
			
		}
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
	},
	
	test8: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest3');
		var chMap = userWs.getChildren();
		var e = chMap[Object.keys(chMap)[0]];
		var eChMap = e.getChildren();
		for(var eId in eChMap){
			e.removeChildEntry(eChMap[eId]);
		}
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));

	},
	
	test9: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest3');
		var chMap = userWs.getChildren();
		var e = chMap[Object.keys(chMap)[0]];
		e.remove();
		userWs.store();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
	},
	
	test10: function(){
		var t1 = Date.now();
		var userWs = WorkspaceController.loadWorkspace('userTest3');
		userWs.remove();
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
	},
	
	test11: function(){
		var t1 = Date.now();
		WorkspaceController.removeWorkspace('userTest3');
		JSB.getLogger().info('Time taken: ' + (Date.now() - t1));
	}
	
	
}