/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.ParamsViewsBase',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$paramsViewsBase',

	$client: {
	    $require: ['css:ParamsViewsBase.css'],

	    $constructor: function(opts) {
	        $base(opts);

	        var category,
	            values = this.getValues();

            function createRender(key, category) {
                var render = $this.createRender({
                    category: category,
                    key: key,
                    renderName: '$paramsViewsItem',
                    scope: $this.getValues()
                });

                if(render){
                    $this.container.append(render);
                }
            }

            switch(this.getKey()) {
                case '$params':
                    category = '$param';
                    break;
                case '$views':
                    category = '$view';
                    break;
            }

	        this.addClass('paramsViewsBase');

	        this.createHeader();

	        this.bindMenu(this.createMainMenuOptions());

	        this.container = this.$('<div class="container"></div>');
	        this.append(this.container);

	        var addBtn = this.$('<i class="addBtn"></i>');
	        this.append(addBtn);
	        addBtn.click(function() {
	            var key = $this.createItem(category);

	            createRender(key, category);

	            $this.onChange();
	        });

	        for(var i in values) {
	            createRender(i, category);
	        }
	    },

	    createItem: function(category) {
	        function createName(values, startName) {
                var count = 1,
                    name = startName;

                while(values[name]){
                    name = startName + '_' + count;
                    count++;
                }

                return name;
	        }

	        var name,
	            values = this.getValues();

	        if(category === '$param') {
	            name = this.wrapName(createName(this.getUnwrappedParams(), 'Параметр'));
	        } else {    // view
	            name = createName(values, 'Именованный подзапрос');
	        }

	        values[name] = this.getDefaultAddValues();

	        return name;
	    },

	    getUnwrappedParams: function() {
	        var values = this.getValues(),
	            params = {};

            for(var i in values) {
                params[this.unwrapName(i)] = true;
            }

            return params;
	    },

	    wrapName: function(name) {  // "${param name}"
	        return '${' + name + '}';
	    },

	    unwrapName: function(name) {
	        var regexp = /\{(.*?)\}/;
	        return name.match(regexp)[1];
	    }
    }
}