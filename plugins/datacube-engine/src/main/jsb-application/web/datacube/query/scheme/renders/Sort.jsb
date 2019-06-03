/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Sort',
	$parent: 'DataCube.Query.Renders.Default',

	$alias: '$sort',

	$client: {
	    $require: ['css:Sort.css'],

	    _isQueryElement: false,

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('sortRender');
	    },

	    constructValues: function(){
            var values = this.getValues(),
                items = this.$('<div class="items"></div>');

            this.append(items);

            function createItem(index){
                var item = $this.$('<div class="item" idx="' + index + '"></div>');

                var sortableHandle = $this.$(`
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);
                item.append(sortableHandle);

                $this.bindMenu({
                    element: sortableHandle,
                    id: $this.getId() + '_index_' + index,
                    edit: false,
                    remove: true,
                    deleteCallback: function(){
                        $this.removeItem(items.find('> .item'), item);
                    }
                });

                var render = $this.createRender({
                    index: index,
                    renderName: '$sortItem',
                    scope: $this.getValues()
                });

                if(render){
                    item.append(render);
                }

                items.append(item);
            }

            for(var i = 0; i < values.length; i++){
                createItem(i);
            }

            var addBtn = this.$('<i class="addBtn"></i>');
            this.append(addBtn);
            addBtn.click(function(){
                var index = values.push($this.getDefaultAddValues()) - 1;

                createItem(index);

                $this.onChange();
            });
	    }
	}
}