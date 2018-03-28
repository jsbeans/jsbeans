{
	$name: 'Unimap.Render.StylesBinding',
	$parent: 'Unimap.Render.Item',
	$client: {
	    construct: function(){
	        this.addClass('styleBindingRender');
	        this.loadCss('StylesBinding.css');

	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

            if(values.value){
                this._setValue(values.value, item);
            }

            item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;

                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                continue;
                            }

                            var entry = obj.getEntry();
                            if(JSB.isInstanceOf(entry,'DataCube.Model.StyleSettings')){
                                return true;
                            }
                        }
                    }
                    return false;
                },
                tolerance: 'pointer',
                greedy: true,
                over: function(evt, ui){
                    if( !ui.helper.hasClass('accepted') ){
                        ui.helper.addClass('accepted');
                    }
                    item.addClass('acceptDraggable');
                },
                out: function(evt, ui){
                    if( ui.helper.hasClass('accepted') ){
                        ui.helper.removeClass('accepted');
                    }
                    item.removeClass('acceptDraggable');
                },
                drop: function(evt, ui){
                    var d = ui.draggable;
                    item.removeClass('acceptDraggable');
                    for(var i in d.get(0).draggingItems){
                        var entry = d.get(0).draggingItems[i].obj.getEntry();
                        $this.setBinding(entry, itemIndex, item);
                        break;
                    }
                }
            });

	        if(this._scheme.multiple){
	            item.addClass('.multipleItem');

	            if(!itemIndex){
	                itemIndex = this.multipleContainer.find('.multipleItem').length;
	            }
	            item.attr('idx', itemIndex);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(item);
	        }
	    },

	    destroy: function(){
	        for(var i = 0; i < this._beans.length; i++){
	            this._beans[i].destroy();
	        }

	        $base();
	    },

		removeBinding: function(item, itemIndex){
            this._items[itemIndex] = {};

            if(itemIndex > 0){
                item.remove();
            } else {
                item.removeClass('filled');
                item.empty();
                this.setEditor(item);
            }

            this.changeBinding(itemIndex);
		},

	    setBinding: function(entry, itemIndex, item){
	        var value = {
	            workspaceId: entry.getWorkspace().getId(),
	            entryId: entry.getId(),
	            name: entry.getName()
	        };

	        this._values.values[itemIndex].value = value;

	        this._setValue(value, item);
	    },

	    _setValue: function(value, item){
	        item.empty().append(value.name);
	    }
	}
}