{
	$name: 'JSB.Widgets.CronEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: ['JQuery.Cron',
	           'css:CronEditor.css'],
	
	$client: {
		_value: '* * * * *',
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('cronEditor');
			this._value = opts.value;
			
			this.cronInstance = this.getElement().jqCron({
		        enabled_minute: true,
		        multiple_dom: true,
		        multiple_month: true,
		        multiple_mins: true,
		        multiple_dow: true,
		        multiple_time_hours: true,
		        numeric_zero_pad: true,
		        multiple_time_minutes: true,
		        /*default_period: 'minute',*/
		        default_value: this._value,
		        no_reset_button: true,
		        lang: 'ru',
		        /*bind_to: this.cronValueEditor.getElement().find('input'),
		        bind_method: {
		            set: function($element, value) {
		            	debugger;
		            },
		            get: function($element){
		            	debugger;
		            }
		        }*/
		    }).jqCronGetInstance();
			this.getElement().bind('cron:change', function(evt, value){
				$this._value = value;
				if(opts.onChange){
					opts.onChange.call($this, value);
				}
			});
		},
		
		setData: function(data){
			debugger;
			this._value = data;
		},
		
		getData: function() {
			return this._value;
		}
	}
}