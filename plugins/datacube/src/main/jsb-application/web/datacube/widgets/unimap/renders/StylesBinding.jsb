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
            } else {
                item.append('<span>Перетащите схему сюда</span>');
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
                activeClass : 'acceptDraggable',
                hoverClass: 'hoverDraggable',
                drop: function(evt, ui){
                    var d = ui.draggable;

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

		removeBinding: function(item){
		    var itemIndex = item.attr('idx');

		    if(!JSB.isDefined(itemIndex)){
		        itemIndex = 0;
		    }

            if(itemIndex > 0){
                this._values.values.splice(itemIndex, 1);
                item.remove();
            } else {
                this._values.values[0] = {};
                item.removeClass('filled');
                item.empty();
                item.append('<span class="empty">Перетащите схему сюда</span>');
            }
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
	        var styleItem = this.$('<span>' + value.name + '</span>'),
	            removeBtn = this.$('<i class="btn fas fa-times"></i>');

            removeBtn.click(function(){
                $this.removeBinding(item);
                removeBtn.remove();
            });

            styleItem.append(removeBtn);

	        item.empty().append(styleItem);
	    }
	}
}