{
	$name: 'Unimap.Render.WidgetBinding',
	$parent: 'Unimap.Render.Item',
    $client: {
        _items: [],

        construct: function(){
            this.addClass('sourceBindingRender');
            this.loadCss('SourceBinding.css');
            $base();
        },

        addItem: function(values, itemIndex){
            if(!values){
                values = {};
                this._values.values.push(values);
            }

            var item = this.$('<div class="item"></div>');

            if(values.value){
                this.setValue(values.value);
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
                            if(JSB.isInstanceOf(entry,'DataCube.Model.Widget')){
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
					$this.getElement().addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					$this.getElement().removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					$this.getElement().removeClass('acceptDraggable');
					for(var i in d.get(0).draggingItems){
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
							continue;
						}
						$this.setValueFromEntry(obj.getEntry());
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

        setValue: function(val){

        },

	    setValueFromEntry: function(entry){
	        this.setValue({
	            widgetWsid: entry.workspace.getLocalId(),
	            widgetWid: entry.getLocalId(),
	            name: entry.name
	        });
	    }
    }
}