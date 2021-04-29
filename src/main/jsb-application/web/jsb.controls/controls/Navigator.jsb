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
			this.options.onClick = (elementDesk, index) => {
			    if(this.getElements().length - 1 === index || elementDesk.key === 'splitter') {
			        return;
			    }

			    this.gotoElement(elementDesk.key);

			    opts.onClick.call(this, elementDesk, index);
			};

	        $base(opts);

			this.addClass('jsb-navigator');
        },

        addElement: function(el) {
            var panel = this.getPanel();

            if(panel.children().length > 0) {
                $base({
                    key: 'splitter',
                    element: '<div></div>'
                });
            }

            $base(el);
        },

        gotoElement: function(key) {
            let elements = this.getElements(),
                htmlElements = this.getPanel().find('div:nth-child(odd)'),
                index;

            for(index = 0; index < elements.length; index++) {
                if(elements[index].key === key){
                    break;
                }
            }

            elements.splice(index + 1, elements.length);

            this.$(htmlElements[index]).nextAll().remove();
        }
    }
}