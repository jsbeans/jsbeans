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
			firstDay: 1,
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
				firstDay: this.options.firstDay,
				showButtonPanel: this.options.showButtonPanel,
				dateFormat: this.options.dateFormat,
				showWeek: this.options.showWeek,
				onSelect: function(dateStr, obj){
					var day = parseInt(obj.selectedDay);
					var month = parseInt(obj.selectedMonth);
					var year = parseInt(obj.selectedYear);
					var dt = new Date(year, month, day);
					if($this.options.onChange){
						$this.options.onChange.call($this, dt.getTime());
					}
				},
				beforeShow: function(i) { 
					if($this.$(i).attr('readonly')) { return false; } 
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
			
			this.append('<i class="fas fa-calendar-alt"></i>');
			
			if(this.options.date || this.options.value){
				this.setDate(this.options.date || this.options.value);
			}
			
			if(this.options.readonly){
				pickerElt.attr('readonly', 'readonly');
			}
		},
		
		getDate: function(){
			return this.find('> .picker').datepicker('getDate');
		},
		
		setDate: function(date){
			if(JSB.isString(date)){
				if(/^[0-9]+$/.test(date)){
					date = new Date(parseInt(date));
				} else {
					date = new Date(date);
				}
			} else if(JSB.isNumber(date)){
				date = new Date(date);
			}
			this.find('> .picker').datepicker('setDate', date);
		}
		
	}
}