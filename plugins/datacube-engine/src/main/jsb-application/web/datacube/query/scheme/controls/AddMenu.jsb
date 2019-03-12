{
	$name: 'DataCube.Query.Controls.AddMenu',
	$parent: 'JSB.Controls.Control',

	$client: {
	    $require: ['JSB.Widgets.ToolManager',,
	               'DataCube.Query.SimpleSelectTool',
	               'css:AddMenu.css'],

        _menuItems: [],

        options: {
            /** @type {object} */
            existElements: {},
            /** @type {object[]} */
            menuItems: [],
            sortAfterAdd: true,

            callback: null
        },

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('addMenu');

	        this.getElement().click(function(){
                ToolManager.activate({
                    id: 'simpleSelectTool',
                    cmd: 'show',
                    data: {
                        key: JSB.generateUid(),
                        values: $this._menuItems
                    },
                    scope: null,
                    target: {
                        selector: $this.getElement(),
                        dock: 'bottom'
                    },
                    callback: function(desc){
                        $this.removeItem(desc.item);

                        $this.options.callback.call($this, desc);
                    }
                });
	        });

	        if(this.options.existElements){
                this._menuItems = this.options.menuItems.filter(function(el){
                    if($this.options.existElements[el.key]){
                        return false;
                    }

                    return true;
                });
	        }

	        this.sort();

	        if(this._menuItems.length === 0){
	            this.addClass('hidden');
	        }
	    },

	    addItem: function(itemDesc){
	        this._menuItems.push(itemDesc);

	        this.removeClass('hidden');

	        if(this.options.sortAfterAdd){
	            this.sort();
	        }
	    },

	    removeItem: function(itemDesc){
	        for(var i = 0; i < this._menuItems.length; i++){
	            if(this._menuItems[i] === itemDesc){
	                this._menuItems.splice(i, 1);
	                break;
	            }
	        }

	        if(this._menuItems.length === 0){
	            this.addClass('hidden');
	        }
	    },

	    sort: function(){
            this._menuItems.sort(function(a, b){
                if(a.key > b.key){
                    return 1;
                }

                if(a.key < b.key){
                    return -1;
                }

                return 0;
            });
	    }
	}
}