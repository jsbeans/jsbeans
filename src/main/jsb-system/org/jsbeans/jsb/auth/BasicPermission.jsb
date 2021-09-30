/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'JSB.Auth.BasicPermission',
	$require: ['JSB.Auth'],
	
	$constructor: function(id){
		this.id = id;
		$base();
		if(!this.getJsb().$expose || !this.getJsb().$expose.id){
			throw new Error('Wrong permission "' + this.getJsb().getName() + '" - missing mandatory $expose entry');
		}
	},
	
	getName: function(){
		return this.getJsb().$expose.name;
	},
	
	check: function(){
		var pName = this.getJsb().getName();
		throw new Error('Function "' + pName + '.check" is not implemented'); 
	}
}