JSB({
	name:'JSB.Widgets.RangeValue',
	parent: 'JSB.Widgets.Value',
	client: {
		constructor: function(value){
			this.base(value, 'range');
		},
		
		toString: function(){
			var val = this.getValue();
			return val[0] + ' - ' + val[1];
		}
	}
});