{
	$name: 'JSB.Widgets.MenuRegistry',
	$parent: 'JSB.Widgets.Registry',
	$singleton: true,
	
	$client: {
		lookupActions: function(category, callback){
			if(!category){
				throw new Error('Missing "category" argument in calling JSB.Widgets.MenuRegistry.lookupActions');
			}
			this.lookupItems(category, function(res){
				if(!JSB.isArray(res) || res.length == 0){
					callback.call($this, {});
				}
				JSB.chain(res, function(desc, c){
					if(desc.inst){
						c(desc.inst);
					} else {
						JSB.lookup(desc.jsb, function(cls){
							desc.inst = new cls();
							c(desc.inst);
						});
					}
				}, function(actArr){
					var actMap = {};
					for(var i = 0; i < actArr.length; i++){
						actMap[actArr[i].getJsb().getDescriptor().$name] = actArr[i];
					}
					callback.call($this, actMap);
				});
			});
		}
	},
	
	$server: {
		$constructor: function(){
			$base();
			JSB.onLoad(function(){
				if(this.isSubclassOf('JSB.Widgets.MenuAction') && JSB.isDefined(this.$expose)){
					$this.register(this);
				}
			});
		}
	}
}