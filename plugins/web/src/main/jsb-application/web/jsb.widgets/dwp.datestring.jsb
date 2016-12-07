JSB({
	name:'DWP.DateString',
	parent: 'JSB.Widgets.Control',
	group: 'dwp',
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('dwp.datestring.css');
			this.addClass('_dwp_dateString');
		},
		
		options: {
			millis: false
		},
		setTimestamp: function(timestamp){
			var ti1 = null, ti2 = null;
			var date = new Date(timestamp);
			var timeInfo = date.toLocaleTimeString();
			if(!this.options.millis){
				var lastColonPos = timeInfo.lastIndexOf(':');
				timeInfo = timeInfo.substr(0, lastColonPos);
			}
			
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			var yesterday = new Date();
			yesterday.setTime(today.getTime() - 24 * 60 * 60 * 1000);
			yesterday.setHours(0, 0, 0, 0);
			var dateInfo = null;
			if(timestamp >= today.getTime()){
				dateInfo = 'сегодня';
			} else if(timestamp >= yesterday.getTime()){
				dateInfo = 'вчера';
			} else {
				dateInfo = date.toLocaleDateString();
			}
			
			this.getElement().text(dateInfo + ' в ' + timeInfo);
		}
	}
});