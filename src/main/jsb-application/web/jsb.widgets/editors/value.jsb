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
	$name:'JSB.Widgets.Value',
	$client: {
		$constructor: function(value, type){
			$base();
			this.value = value;
			this.type = type;
		},
		
		getValue: function(){
			return this.value;
		},
	
		setValue: function(val){
			this.value = val;
		},
		
		getType: function(){
			return this.type;
		},
		
		setType: function(type){
			this.type = type;
		},
		
		toString: function(){
			if(JSB.isNull(this.value)){
				return '(null)';
			}
			if(JSB.isArray(this.value) || JSB.isPlainObject(this.value)){
				return JSON.stringify(this.value, null, 2);
			}
			return '' + this.value;
		}
	}
}