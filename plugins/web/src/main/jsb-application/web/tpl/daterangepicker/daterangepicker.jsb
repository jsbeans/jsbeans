{
	name:'DateRangePicker',
	parent: 'JSB.Widgets.Control',
	require:['JQuery', 'JSB.Widgets.ToolManager'],
	client:{
		
		bootstrap: function(readyCallback){
			
			JSB().loadCss('tpl/daterangepicker/daterangepicker.css');
			JSB().loadCss('tpl/glyphs/glyphs.css');
			
			(function(jQuery){
				#include 'moment.js';
				#include 'daterangepicker.js';
			}).call(null, JSB().$);
			
		},
		
		constructor: function(opts){
			var self = this;
			$base(opts);
			
			this.addClass('_dwp_DateRangePicker');
			var inputElt = this.$('<input type="text" class="form-control" />');
			this.append(inputElt);
			var iconElt = this.$('<i class="glyphicon glyphicon-calendar fa fa-calendar" />');
			this.append(iconElt);
			iconElt.click(function(){
				inputElt.click();
			});
			
			JSB().deferUntil(function(){
				var today = new Date();
				var ops = JSO().merge(true, {
					parentEl: self.$('._dwp_toolManager_toolArea'),
					locale: {
						format: 'DD.MM.YYYY',
						customRangeLabel: 'Другой период ...',
						applyLabel: 'Применить',
						cancelLabel: 'Отмена',
						weekLabel: 'Нед.',
						daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
						monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
						firstDay: 1
				    },
					autoApply: true
				}, opts);

				inputElt.daterangepicker(ops, function(start, end, label) {
					self.from = start.toDate().getTime();
					self.to = end.toDate().getTime();
				});
				
				var drp = inputElt.data('daterangepicker');
				
				self.from = drp.startDate.toDate().getTime();
				self.to = drp.endDate.toDate().getTime();
				
				drp.container.css({
					display: 'none'
				});
				
			}, function(){
				return self.getElement().width() > 0 && self.getElement().height() > 0;
			});
			
		},
		
		getPeriod: function(){
			return {
				from: this.from,
				to: this.to
			}
		}
	}
}