{
	$name:'JSB.Numeral',
	$singleton: true,
	
	$constructor: function(){
		$base();
		
		`#include 'numeral.min.js'`;
		`#include 'locales.min.js'`;
	},
	
	setLocale: function(loc){
		this.numeral.locale(loc);
	},
	
	format: function(val, fmt){
		
		var num = this.numeral(val);
		return num.format(fmt);
	}
}