{
	$name: 'JSB.Controls.ComboEditorTreeViewDropDown',
	$parent: 'JSB.Widgets.Tool',

	$client: {
        $require: ['JSB.Widgets.TreeView',
                   'css:comboEditorTreeViewDropDown.css'],

		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: 'ComboEditorTreeViewDropDown',
					jso: self,
					wrapperOpts: {
						exclusive: 'ComboEditorTreeViewDropDown',
						modal: false,
						hideByOuterClick: true,
						hideInterval: 0,
						cssClass: 'comboEditorTreeViewDropDown'
					}
				});
			});
		},

		_tree: null,

		update: function() {
		    this._tree && this._tree.destroy();

		    let itemRender = this.getData('itemRender'),
		        options = this.getData('options');

	        this._tree = new TreeView({
	            onSelectionChanged: (key, item, evt) => {
	                this.close();
	                this.data.callback.call(this, item.originalItem.value);
	            }
	        });

	        for(let i in options) {
	            let item = options[i];

                if(item.originalItem.element) {
                    item.element = item.originalItem.element;
                } else {
                    if(itemRender) {
                        item.element = itemRender.call(this, item);
                    } else {
                        item.element = item.value || item.key;
                    }
                }

                this._tree.addNode(item, item.parentKey);
	        }

	        this.append(this._tree);
		}
	}
}