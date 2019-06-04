/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.ParamItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$viewItem',

    $client: {
	    $require: ['DataCube.Query.SchemeController'],

        $constructor: function(opts) {
            $base(opts);

            this.addClass('viewItem');

            this.controller = new SchemeController({
                data: this.getData(),
                slice: this.getSlice(),
                values: this.getValues(),
                onChange: function() {
                    $this.onChange();
                }
            });
            this.append(this.controller);
        },

        destroy: function() {
            this.controller.destroy();

            $base();
        }
    }
}