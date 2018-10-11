{
	$name:'JSB.Tpl.Highcharts',
	$client:{
		$singleton: true,

		_lang: {
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
            noData: 'Нет данных',
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
		},

		_setOptions:{
		    highcharts: false,
		    highstock: false,
		    highmaps: true
		},

		$constructor: function(){
			$base();

			(function(){
				`#include 'highcharts.js'`;
				`#include 'highcharts-more.js'`;
				`#include 'modules/no-data-to-display.js'`;

				$jsb.loadCss('css/customHighcharts.css');

				$this.setOptions();
			}).call(null);
		},

		setOptions: function(){
		    if(!this._setOptions.highcharts && window.Highcharts){
				Highcharts.setOptions({
			        lang: this._lang
			    });

			    this._setOptions.highcharts = true;
		    }

		    if(!this._setOptions.highstock && window.Highcharts.stockChart){
		        Highcharts.setOptions({
		            lang: this._lang
		        });

		        this._setOptions.highstock = true;
		    }
		}
	}
}