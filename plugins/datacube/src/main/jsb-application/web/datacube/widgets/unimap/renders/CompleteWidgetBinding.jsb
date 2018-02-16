{
	$name: 'Unimap.Render.CompleteWidgetBinding',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Controls.Button'],

	    construct: function(){
	        this.addClass('completeWidgetBindingRender');
	        this.loadCss('CompleteWidgetBinding.css');

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createDescription(name);

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0]);
	        } else {
	            this.addItem();
	        }
	    },

	    addItem: function(values){
	        if(!values){
	            values = {
	                value: {}
	            };
	            this._values.values.push(values);
	        }

	        this._item = this.$('<div class="item"></div>');

            this._item.droppable({
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
                    $this._item.addClass('acceptDraggable');
                },
                out: function(evt, ui){
                    if( ui.helper.hasClass('accepted') ){
                        ui.helper.removeClass('accepted');
                    }
                    $this._item.removeClass('acceptDraggable');
                },
                drop: function(evt, ui){
                    var d = ui.draggable;
                    $this._item.removeClass('acceptDraggable');
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

            this.append(this._item);

            if(values.value){
                this.setValue(values.value);
            }
	    },

	    setValue: function(val){
            this._values.values[0] = {
                value: val
            }

	        if(!val){
	            this._item.text('Перетащите готовый виджет');
	            this._item.removeClass('filled');

	            if(this._removeButton){
	                this._removeButton.destroy();
	                this._removeButton = null;
	            }
	        } else {
	            this._item.text(val.name);
	            this._item.addClass('filled');

	            if(!this._removeButton){
	                this._removeButton = new Button({
                         hasIcon: true,
                         hasCaption: false,
                         cssClass: 'deleteButton',
                         tooltip: 'Удалить',
                         onclick: function(evt){
                             if($this.options.onchange){
                                 $this.options.onchange.call($this, $this._values);
                             }

                             $this.setValue(null);
                         }
                    });
                    this._item.append(this._removeButton.getElement());
	            }
	        }
	    },

	    setValueFromEntry: function(entry){
	        var val = {
                widgetWsid: entry.workspace.getLocalId(),
                widgetWid: entry.getLocalId(),
                name: entry.name
            };

	        this.setValue(val);

            if(this.options.onchange){
                this.options.onchange.call(this, this._values);
            }
	    }
	}
}