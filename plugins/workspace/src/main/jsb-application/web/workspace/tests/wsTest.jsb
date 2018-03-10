{
	$name: 'JSB.Workspace.Tests.WsTest',
	$require: ['JSB.Workspace.WorkspaceController', 'JSB.Workspace.FolderEntry'],
	$fixedId: true,
	
	$constructor: function(){
		$base();
	},
	
	test1: function(arg1, arg2){
		var userWs = WorkspaceController.createWorkspace('user', {id: 'userTest1'});
		for(var i = 0; i < 100; i++){
			var fe = new FolderEntry(JSB.generateUid(), userWs);
			fe.setName('folder_' + i);
		}
		userWs.store();
	},
	
}