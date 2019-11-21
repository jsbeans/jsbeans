/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

 /**
  * @name         JSB.Controls.Test.Navigator
  * @module       JSB.Controls
  * @description  Отладка компонента Navigator
  * @author       Leonid Simakov
  * @copyright    (c) 2019 Leonid Simakov <lasimakov@gmail.com>
  * @copyright    (c) 2019 Special Information Systems, LLC <info@sis.ru>
  * @license      MIT Licence
  */

{
	$name: 'JSB.Controls.Test.TestNavigator',
	$parent: 'JSB.Controls.Control',

	$client: {
	    $require: ['JSB.Controls.Navigator',
	               'css:TestNavigator.css'],

	    $constructor: function(opts){
	        $base(opts);

	        var elements = ['Home', 'Node_1', 'Node_2'];

	        var navigator = new Navigator();
	        this.append(navigator);

	        for(var i = 0; i < elements.length; i++) {
                navigator.addElement({
                    key: elements[i],
                    element: elements[i]
                });
	        }
        }
    }
}