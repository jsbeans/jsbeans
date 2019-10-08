/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.DateString',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['css:dateString.css'],
		$constructor: function(opts){
			var self = this;
			$base(opts);
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
}