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