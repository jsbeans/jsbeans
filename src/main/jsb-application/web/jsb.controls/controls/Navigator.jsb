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
	        opts = opts || {};

	        let onClick = opts.onClick;

			opts.onClick = (elementDesk, index) => {
			    if(this.getElements().length - 1 === index || elementDesk.key === 'splitter') {
			        return;
			    }

			    this.gotoElement(elementDesk.key);

			    onClick && onClick.call(this, elementDesk, index);
			};

	        $base(opts);

			this.addClass('jsb-navigator');
        },

        addElement: function(el) {
            var panelList = this.getPanelList();

            panelList.children().length > 0 && panelList.append(this.$('<i key="splitter" class="fas fa-chevron-right"></i>'));

            $base(el);
        },

        gotoElement: function(key) {
            let elements = this.getElements(),
                htmlElements = this.getPanelList().children('div'),
                index;
            if (key === 'goback') {
                index = elements.length - 2;
            }else{
                for(index = 0; index < elements.length; index++){
                    if(elements[index].key === key){
                        break;
                    }
                }
            }

            elements.splice(index + 1);

            this.$(htmlElements[index]).nextAll().remove();
        }
    }
}