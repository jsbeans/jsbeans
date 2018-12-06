{
	$name: 'Unimap.Render.StylesBinding',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Widgets.RendererRepository',
	               'css:StylesBinding.css'],

	    construct: function(){
	        this.addClass('styleBindingRender');

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

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        this._item = this.$('<div class="item"></div>');

            if(values.value){
                this._setValue(values.value);
            } else {
                this._item.append('<span>Перетащите схему сюда</span>');
            }

            this._item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;

                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                continue;
                            }

                            var entry = obj.getTargetEntry();
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
                        var entry = d.get(0).draggingItems[i].obj.getTargetEntry();
                        $this.setBinding(entry);
                        break;
                    }
                }
            });

            this.append(this._item);
	    },

		removeBinding: function(){
		    if(this._render){
		        this._render.destroy();
		    }

		    this._values.values[0] = {};

		    this._item.removeClass('filled');
		    this._item.empty().append('<span class="empty">Перетащите схему сюда</span>');
		},

	    setBinding: function(entry){
	        var value = {
	            workspaceId: entry.getWorkspace().getId(),
	            entryId: entry.getId(),
	            name: entry.getName()
	        };

	        this._values.values[0].value = value;

	        this._setValue(value, entry);
	    },

	    _setValue: function(value, entry){
	        function createValue(entry){
	            $this._item.addClass('filled');

	            var removeBtn = $this.$('<i class="btn btnDelete fas fa-times-circle"></i>');
                removeBtn.click(function(){
                    $this.removeBinding();
                    removeBtn.remove();
                });

                $this._render = RendererRepository.createRendererFor(entry);
                $this._item.append($this._render.getElement());

                $this._item.append(removeBtn);
	        }

            if(this._render){
                this._render.destroy();
            }
            this._item.empty();

            if(entry){
                createValue(entry);
            } else {
                this.server().getEntry(value, function(entry, error){
                    if(!error){
                        createValue(entry);
                    } else {
                        $this._item.append('<span class="error">Цветовая схема не найдена!</span>')
                    }
                });
            }
	    }
	},

	$server: {
	    $require: ['JSB.Workspace.WorkspaceController'],

	    getEntry: function(entryDesc){
            if(!entryDesc || !entryDesc.workspaceId || !entryDesc.entryId){
                throw new Error('Invalid entry description in CompleteWidgetBinding');
            }

            return WorkspaceController.getWorkspace(entryDesc.workspaceId).entry(entryDesc.entryId);
	    }
	}
}