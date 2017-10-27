{
    $name: 'DataCube.Controls.WidgetBindingSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Controls.Button'],
	$client: {
	    value: null,

	    $constructor: function(opts){
	        $base(opts);
	        this.addClass('widgetBindingSelector');
            this.loadCss('WidgetBindingSelector.css');

            this.placeholderElt = this.$('<div class="placeholder">Перетащите сюда готовый виджет</div>');
            this.append(this.placeholderElt);

            this.bindingElt = this.$('<div class="binding hidden"><div></div><span></span></div>');
            this.append(this.bindingElt);

            var removeButton = new Button({
                hasIcon: true,
                hasCaption: false,
                cssClass: 'deleteButton',
                tooltip: 'Удалить',
                onclick: function(evt){
                    $this.setValue(null);
                }
            });
            this.bindingElt.append(removeButton.getElement());

            if(opts.value){
                this.setValue(opts.value);
            }

            this.getElement().droppable({
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
	    },

	    setValue: function(val){
	        this.value = val;

	        if(!val){
                this.placeholderElt.removeClass('hidden');
                this.bindingElt.addClass('hidden');
	        } else {
                this.placeholderElt.addClass('hidden');
                this.bindingElt.removeClass('hidden');
                this.bindingElt.find('span').text(val.name);
	        }

            if(this.options.onChange){
                this.options.onChange.call(this, val);
            }
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