{
	$name: 'Scheme.Render.SourceBinding',
	$parent: 'Scheme.Render.Item',
	$client: {
	    construct: function(){
	        this.addClass('sourceBindingRender');
	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div></div>');

	        switch(this._scheme.options.editor){
	            case 'none':
	                break;
                default:
                    var editor = new PrimitiveEditor({
                        onChange: function(val){
                            values.value = val;
                        }
                    });
                    item.append(editor);
                    break;
	        }

	        if(this._scheme.options.binding){
	            if(editor){
	                editor.setPlaceholderText('Введите значение или перетащите источник');
	            }

	            item.droppable({
                    accept: function(d){
                        if(d && d.length > 0 && d.get(0).draggingItems){
                            for(var i in d.get(0).draggingItems){
                                var obj = d.get(0).draggingItems[i].obj;    // todo: universal method for treeView

                                if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                    continue;
                                }
                                var entry = obj.getEntry();
                                if(JSB.isInstanceOf(entry, 'Scheme.Source.Basic')){
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
                            $this.setBinding(d.get(0).draggingItems[i].obj.getEntry());
                            break;
                        }
                    }
	            });
	        }

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

	    setBinding: function(){

	    }
	}
}