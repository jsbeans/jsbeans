{
	$name:'JSB.Tpl.Highstock',
	$client:{
		$singleton: true,
		$constructor: function(){
			$base();
			(function(){
				`#include 'highstock.js'`;
				`#include 'highcharts-more.js'`;
				`#include 'plugins/grouped-categories.js'`;
				
				Highcharts.setOptions({
			        lang: {
                        contextButtonTitle: "Меню виджета",
                        decimalPoint: ",",
                        downloadJPEG: "Скачать в формате JPEG",
                        downloadPDF: "Скачать в формате PDF",
                        downloadPNG: "Скачать в формате PNG",
                        downloadSVG: "Скачать в формате SVG",
                        invalidDate: undefined,
                        loading: "Загрузка...",
                        months: [ "Январь" , "Февраль" , "Март" , "Апрель" , "Май" , "Июнь" , "Июль" , "Август" , "Сентябрь" , "Октябрь" , "Ноябрь" , "Декабрь"],
                        numericSymbolMagnitude: 1000,
                        numericSymbols: [ "k" , "M" , "G" , "T" , "P" , "E"],
                        printChart: "Печать виджета",
                        rangeSelectorFrom: "От",
                        rangeSelectorTo: "До",
                        rangeSelectorZoom: "Зум",
                        resetZoom: "Сбросить зум",
                        resetZoomTitle: "Масштаб 1:1",
                        shortMonths: [ "Янв" , "Фев" , "Мар" , "Апр" , "Май" , "Июн" , "Июл" , "Авг" , "Сен" , "Окт" , "Ноя" , "Дек"],
                        thousandsSep: " ",
                        shortWeekdays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                        weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
                    }
			    });
			}).call(null);
		}
	}
}