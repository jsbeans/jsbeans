/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.Editor',
	$parent: 'JSB.Widgets.Control',
	$require: {
		EditorRegistry: 'JSB.Widgets.EditorRegistry'
	},
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('_dwp_editor');
		},
		
		setData: function(){
			throw 'Abstract method should be overriden';
		},
		getData: function(){
			throw 'Abstract method should be overriden';
			return null;
		},
		
		setFocus: function(){},
		
		isValid: function(){
			if(!JSB().isNull(this.options.onValidate)){
				return this.options.onValidate(this.getData().getValue());
			}
			return true;
		},
		
		clear: function(){}
	}
}