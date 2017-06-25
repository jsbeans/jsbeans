{
	$name:'JSB.HttpJsb',
	$server: {
		$require: ['JSB.System.Kernel','JSB.System.Log', 'Web'],

		$singleton: true,
		
		$constructor: function(){
		},
		
		exec: function(beanPath, proc, params){
			if(!beanPath || beanPath.length === 0){
				throw 'Wrong bean path';
			}
			if(beanPath[0] == '/' || beanPath[0] == '\\'){
				beanPath = beanPath.substr(1);
			}
			var repoEntry = $jsb.getRepository().getByPath(beanPath);
			if(!repoEntry || !repoEntry.jsb){
				throw 'Unable to find bean: ' + beanPath;
			}
/*			
			if(!repoEntry.jsb['$http'] && (!repoEntry.jsb.currentSection() || !repoEntry.jsb.currentSection()['$http'])){
				throw 'Bean "' + repoEntry.jsb.$name + '" does not allow to be called via HTTP. Use "$http" option in bean declaration.';
			}
*/			
			return $jsb.getProvider().executeClientRpc(repoEntry.jsb.$name, '__httpCall__' + repoEntry.jsb.$name, proc, params);
		}
		
	}
}