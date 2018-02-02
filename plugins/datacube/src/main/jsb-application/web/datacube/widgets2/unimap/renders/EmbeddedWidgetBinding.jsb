{
	$name: 'Unimap.Render.EmbeddedWidgetBinding',
	$parent: 'Unimap.Render.Item',
	$client: {
	    $require: ['JSB.Controls.Button', 'DataCube.Renderers.EmbededWidgetRenderer'],

	    construct: function(){
	        this.addClass('embeddedWidgetBindingRender');
	        this.loadCss('EmbeddedWidgetBinding.css');
	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

            item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;

							if(JSB.isInstanceOf(obj, 'DataCube.Widgets.WidgetListItem')){
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
                        $this.setValue(item, {name: d.get(0).draggingItems[i].descriptor.name, jsb: d.get(0).draggingItems[i].descriptor.jsb});
                        break;
                    }
                }
            });

            this.append(item);
        },

        constructScheme: function(){
            //this._scheme
        },

        removeBinding: function(item){

        },

        setValue: function(item, wDesc){
			this._values.values[0] = {
			    binding: wDesc
			}

            if(this.render){
                this.render.destroy();
            }

			this.render = new EmbededWidgetRenderer($this.wDesc, {});
			item.prepend(this.render.getElement());
			item.addClass('filled');

			if(!this.deleteBtn){
			    this.deleteBtn = new Button({
                    hasIcon: true,
                    hasCaption: false,
                    cssClass: 'btnDelete',
                    tooltip: 'Удалить',
                    onclick: function(evt){
                        evt.stopPropagation();
                        $this.removeBinding(item);
                    }
			    });
			    item.append(this.deleteBtn.getElement());
			}

			this.constructScheme();

			this.options.onchange.call(this, this._values);
        }
	}
}