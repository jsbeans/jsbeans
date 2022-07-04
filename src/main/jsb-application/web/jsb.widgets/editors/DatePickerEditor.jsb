{
	$name:'JSB.Widgets.DatePickerEditor',
	$parent: 'DatePicker',
	$client:{
		options: {
			changeMonth: true,
			changeYear: true,
			
			onChange: null
		},
		
		setData: function(val){
			return this.setDate(val);
		},
		
		getData: function(){
			return this.getDate();
		}
	}
}