{
	$name: 'JSB.Workspace.Tests.WsTest',
	$require: ['JSB.Workspace.WorkspaceController', 'JSB.Workspace.FolderEntry'],
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
	}
	
}