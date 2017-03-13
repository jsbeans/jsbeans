{
	$name:'JSB.Widgets.Value',
	$client: {
		$constructor: function(value, type){
			$base();
			this.value = value;
			this.type = type;
		},
		
		getValue: function(){
			return this.value;
		},
	
		setValue: function(val){
			this.value = val;
		},
		
		getType: function(){
			return this.type;
		},
		
		setType: function(type){
			this.type = type;
		},
		
		toString: function(){
			if(JSB.isNull(this.value)){
				return '(null)';
			}
			if(JSB.isArray(this.value) || JSB.isPlainObject(this.value)){
				return JSON.stringify(this.value, null, 2);
			}
			return '' + this.value;
		}
	}
}