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
	$name: 'JSB.Controls.TestControl',
	$parent: 'JSB.Controls.Control',

	// widget('JSB.Controls.TestControl')

	$require: ['JSB.Controls.Editor',
	           'JSB.Controls.Selectize',
	           'JSB.Controls.MultitypeEditor'],

	$client: {
	    $constructor: function(opts) {
	        $base(opts);

		// html types: color(5), date(5), datetime(5), datetime-local(5), email(5,
		// month(5), number(5), password, range(5), search(5), tel(5), text,
		// time(5), url(5), week(5)

	        var types = [
	        {
	            id: 'bool'
	        },
	        {
	            id: 'color'
	        },
	        {
	            id: 'date'
	        },
	        {
	            id: 'datetime-local'
	        },
	        {
	            id: 'email'
	        },
	        {
	            id: 'month'
	        },
	        {
	            id: 'number'
	        },
	        {
	            id: 'password'
	        },
	        {
	            id: 'range'
	        },
	        {
	            id: 'search'
	        },
	        {
	            id: 'tel'
	        },
	        {
	            id: 'text'
	        },
	        {
	            id: 'time'
	        },
	        {
	            id: 'url'
	        },
	        {
	            id: 'week'
	        },
	        ];

	        var type = new Selectize({
	            label: 'Тип',
	            labelField: 'id',
	            onlySelect: true,
	            options: types,
	            searchField: 'id',
	            valueField: 'id',
	            onChange: function(val) {
	                editor.setType(val);
	            }
	        });
	        this.append(type);

	        var editor = new MultitypeEditor({
	            label: 'Мультиэдитор',
	            placeholder: 'Введите данные',
	            type: 'number',
	            /*
	            min: 0,
	            max: 100,
	            step: 10,
	            */
	            onChange: function(val) {
	                console.log('Value: ' + val);
	            },
	            onEditComplete: function(val, isValid) {
	                console.log('Value: ' + val);
	                console.log('IsValid: ' + isValid);
	            }
	        });
	        this.append(editor);
	    }
	}
}