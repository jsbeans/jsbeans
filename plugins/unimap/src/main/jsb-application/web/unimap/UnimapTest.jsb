/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'Unimap.Test',
	$parent: 'JSB.Controls.Control',
	$require: ['Unimap.Controller', 'Unimap.Selector'],

	// widget('Unimap.Test')

	$client: {
        scheme: {
            source1: {
                render: 'item',
                name: 'Источник 1 уровня'
            },
            credits: {
                render: 'group',
                name: 'Авторская подпись',
                collapsible: true,
                collapsed: true,
                items: {
                    source2: {
                        render: 'item',
                        name: 'Источник 2 уровня'
                    }
                }
            }
        },

	    $constructor: function(){
	        $base();

	        var values = { };

            var widgetSchemeRenderer = new Controller({
                scheme: this.scheme,
                values: values
            });
            this.append(widgetSchemeRenderer);

            var testBtn = this.$('<button>Тест</button>');
            this.append(testBtn);
            testBtn.click(function(){
                var selector = new Selector({
                    scheme: $this.scheme,
                    values: widgetSchemeRenderer.getValues()
                });

                selector.ensureInitialized(function(){
debugger;
                    var itemRenders = selector.findRendersByName('item');

                    var scheme2 = itemRenders[1].scheme();

                    var id = itemRenders[1].getInternalId();

                    var itemSelectorById = selector.findById(id);

                    selector.destroy();
                });
            });
	    }
	}
}