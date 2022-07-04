{
	$name: 'DatePicker',
	$parent: 'JSB.Widgets.Control',
	$require:['jQuery.UI.Datepicker',
	          'css:datepicker.css'],
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
			
			this.addClass('_jsb_DatePicker');
			
			var pickerOpts = {
				changeMonth: this.options.changeMonth,
				changeYear: this.options.changeYear,
				numberOfMonths: this.options.numberOfMonths,
				showButtonPanel: this.options.showButtonPanel,
				dateFormat: this.options.dateFormat,
				showWeek: this.options.showWeek,
				onSelect: function(dateStr){
					if($this.options.onChange){
						$this.options.onChange.call($this, dateStr);
					}
				}
			};
			var pickerElt = null;
			
			if(this.options.inline){
				pickerElt = this.$('<div class="picker"></div>');
			} else {
				pickerElt = this.$('<input type="text" class="picker" />');
			}
			this.append(pickerElt);
			pickerElt.datepicker(pickerOpts);
			
			if(this.options.date || this.options.value){
				this.setDate(this.options.date || this.options.value);
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