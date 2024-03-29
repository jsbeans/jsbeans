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
	$name:'JSB.Widgets.Tool',
	$parent: 'JSB.Widgets.Widget',
	$client: {
		close: function(bCanceled){
			if(this.wrapper){
				this.wrapper.close(bCanceled);
			}
		},

		getData: function(key){
		    if(key){
		        return this.data.data[key];
		    } else {
		        return this.data.data;
		    }
		},

		getWrapper: function(){
			return this.wrapper;
		},

		onHide: function(bCanceled) {},

		onShow: function() {},

		setData: function(data){
			this.data = data;
			this.update();
		},

		setWrapper: function(wrapper){
			this.wrapper = wrapper;
		},
		
		update: function(){
			// do update when overrides
		}
	}
}