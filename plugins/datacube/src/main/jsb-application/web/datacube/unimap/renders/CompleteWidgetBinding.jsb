{
	$name: 'Unimap.Render.CompleteWidgetBinding',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Widgets.RendererRepository',
	               'css:CompleteWidgetBinding.css'],

	    construct: function(){
	        this.addClass('completeWidgetBindingRender');

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createRequireDesc(name);
	        this.createDescription(name);

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0]);
	        } else {
	            this.addItem();
	        }
	    },

	    addItem: function(values){
	        this._item = this.$('<div class="item"></div>');

            this._item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;
                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                continue;
                            }
                            var entry = obj.getTargetEntry();
                            if(JSB.isInstanceOf(entry,'DataCube.Model.Widget')){
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
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
							continue;
						}
						$this.setValueFromEntry(obj.getTargetEntry());
						break;
                    }
                }
            });

            this.append(this._item);

            if(values){
                this.setValue(values.value);
            }

	        if(!values){
	            values = {
	                value: {}
	            };
	            this._values.values.push(values);
	        }
	    },

	    destroy: function(){
            if(this._render){
                this._render.destroy();
            }

	        $base();
	    },

	    setValue: function(val, entry){
            this._values.values[0] = {
                value: val
            }

            function createValue(entry){
                $this._render = RendererRepository.createRendererFor(entry);
                $this._item.append($this._render.getElement());

                var removeButton = $this.$('<i class="btn btnDelete fas fa-times" title="Удалить"></i>');
                removeButton.click(function(evt){
                    evt.stopPropagation();
                    $this.onchange();
                    $this.setValue(null);
                });
                $this._item.append(removeButton);
            }

            if(this._render){
                this._render.destroy();
            }
            this._item.empty();

	        if(!val){
	            this._item.removeClass('filled');
	        } else {
	            this._item.addClass('filled');

	            if(entry){
	                createValue(entry);
	            } else {
	                this.server().getEntry(val, function(entry, error){
	                    if(!error){
	                        createValue(entry);
	                    } else {
	                        $this._item.append('<span class="error">Виджет не найден!</span>')
	                    }
	                });
	            }
	        }
	    },

	    setValueFromEntry: function(entry){
	        var val = {
                widgetWsid: entry.getWorkspace().getId(),
                widgetWid: entry.getId(),
                name: entry.getName()
            };

	        this.setValue(val, entry);
	        this.onchange();
	    }
	},

	$server: {
	    $require: ['JSB.Workspace.WorkspaceController'],

	    getEntry: function(entryDesc){
            if(!entryDesc || !entryDesc.widgetWsid || !entryDesc.widgetWid){
                throw new Error('Invalid entry description in CompleteWidgetBinding');
            }

            return WorkspaceController.getWorkspace(entryDesc.widgetWsid).entry(entryDesc.widgetWid);
	    }
	}
}