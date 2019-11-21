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
  * @name         JSB.Controls.Navigator
  * @module       JSB.Controls
  * @description  Компонент для навигации в древовидной структуре
  * @author       Leonid Simakov
  * @copyright    (c) 2019 Leonid Simakov <lasimakov@gmail.com>
  * @copyright    (c) 2019 Special Information Systems, LLC <info@sis.ru>
  * @license      MIT Licence
  */

{
	$name: 'JSB.Controls.Navigator',
	$parent: 'JSB.Controls.ScrollPanel',
	$client: {
		$require: ['css:Navigator.css'],

	    $constructor: function(opts) {
	        $base(opts);

			this.addClass('jsb-navigator');

			this.options.onclick = function(key, index) {
			    $this.gotoElement(key);

			    opts.onclick.call($this, key, index);
			};
        },

        addElement: function(el) {
            var panel = this.getPanel();

            if(panel.children().length > 0) {
                panel.append('<li></li>');
            }

            $base(el);
        },

        gotoElement: function(key) {
            var elements = this.getPanel().find('li:nth-child(odd)'),
                index;

            for(index = 0; index < this._elements.length; index++){
                if(this._elements[index].key === key){
                    break;
                }
            }

            this._elements.splice(index + 1, this._elements.length);

            this.$(elements[index]).nextAll().remove();
        }
    }
}