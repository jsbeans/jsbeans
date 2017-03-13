{
	$name:'DatePicker',
	$parent: 'JSB.Widgets.Control',
	$require:['JQuery.UI'],
	$client:{
		
		options: {
			inline: false,
			changeMonth: false,
			changeYear: false,
			numberOfMonths: 1,
			showButtonPanel: false,
			dateFormat: 'dd.mm.yy',
			showWeek: false,
			
			onChange: null
		},
		
		$bootstrap: function(readyCallback){
			
		},
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			
			this.loadCss('datepicker.css');
			this.addClass('_jsb_DatePicker');
			
			var pickerOpts = {
				changeMonth: this.options.changeMonth,
				changeYear: this.options.changeYear,
				numberOfMonths: this.options.numberOfMonths,
				showButtonPanel: this.options.showButtonPanel,
				dateFormat: this.options.dateFormat,
				showWeek: this.options.showWeek,
			};
			var pickerElt = null;
			
			if(this.options.inline){
				pickerElt = this.$('<div class="picker"></div>');
			} else {
				pickerElt = this.$('<input type="text" class="picker" />');
			}
			this.append(pickerElt);
			pickerElt.datepicker(pickerOpts);
			
			if(this.options.date){
				this.setDate(this.options.date);
			}
		},
		
		getDate: function(){
			return this.find('> .picker').datepicker('getDate');
		},
		
		setDate: function(date){
			this.find('> .picker').datepicker('setDate', date);
		}
		
	}
}