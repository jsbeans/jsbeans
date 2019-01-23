{
	$name: 'DataCube.Query.SchemeTool',
	$parent: 'JSB.Widgets.Tool',

	$client: {
	    $require: ['JSB.Widgets.ToolManager',
	               'css:SchemeTool.css'],

		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'querySchemeTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					hideByEsc: true,
					cssClass: 'querySchemeTool'
				}
			});
		},

		_sliceId: null,

		$constructor: function(){
		    // search

		    // categories
		    this.categories = this.$('<ul class="categories"></ul>');
		    this.append(this.categories);

		    // tabs
		    this.categories.append(`
		        <li>Срезы</li>
		    `);

		    // items
		    var items = this.$('<div class="items"></div>');
		    this.append(items);

		    this.sliceItems = this.$('<div></div>');
		    items.append(this.sliceItems);
		},

		update: function(){
		    var data = this.data.data;

		    // fill slices
		    if(this._sliceId !== data.sliceId){
		        this.sliceItems.empty();
		        //
            }
		}
    }
}