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
	$name: 'JSB.Widgets.MenuOption',
	
	_title: null,
	_desc: null,
	_opts: null,
	
	$constructor: function(title, desc, opts){
		$base();
		this._title = title;
		this._desc = desc;
		this._opts = opts;
	},
	
	getTitle: function(){
		return this._title;
	},
	
	getDescription: function(){
		return this._desc;
	},
	
	getOptions: function(){
		return this._opts;
	},
	
	execute: function(opts){
		throw new Error('JSB.Widgets.MenuOption.execute method should be overriden');
	}
}