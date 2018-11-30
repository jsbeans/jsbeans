{
	$name: 'Unimap.Render.EntryBinding',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Widgets.RendererRepository'],

	    construct: function(){
	        this.addClass('entryBindingRender');
	        $jsb.loadCss('EntryBinding.css');

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
	    
	    generateEmptyName: function(){
	    	if(this._scheme.emptyText){
	    		return this._scheme.emptyText;
	    	}
	    	return 'Перетащите сюда объект';
	    },

	    addItem: function(values){
	        this._item = this.$('<div class="item"></div>').text($this.generateEmptyName());

            this._item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;
                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.EntryNode')){
                                continue;
                            }
                            var entry = obj.getTargetEntry();
                            if($this._scheme.accept){
                            	var acceptArr = [];
                            	if(!JSB.isArray($this._scheme.accept)){
                            		acceptArr.push($this._scheme.accept);
                            	}
                            	for(var i = 0; i < acceptArr.length; i++){
                            		if(JSB.isInstanceOf(entry, acceptArr[i])){
                                        return true;
                                    }
                            	}
                            	return false;
                            } else {
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
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.EntryNode')){
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
            	$this._item.addClass('filled');
                $this._render = RendererRepository.createRendererFor(entry);
                $this._item.empty();
                $this._item.append($this._render.getElement());

                var removeButton = $this.$('<i class="btn btnDelete fas fa-times" title="Удалить"></i>');
                removeButton.click(function(evt){
                    evt.stopPropagation();
                    $this.removeBinding();
                    
                });
                $this._item.append(removeButton);
            }

            if(this._render){
                this._render.destroy();
            }
            
            this._item.empty();
            this._item.removeClass('filled');
            $this._item.text($this.generateEmptyName());
            
	        if(val && Object.keys(val).length > 0){
	            if(entry){
	                createValue(entry);
	            } else {
	                this.server().getEntry(val, function(entry, error){
	                	if(entry){
	                		createValue(entry);
	                	} else {
	                		
	                	}
	                });
	            }
	        }
	    },
	    
	    removeBinding: function(){
            this._render.destroy();
            this._item.find('.btnDelete').remove();
            this._item.removeClass('filled');
            
            $this.setValue(null);
            $this.onchange();
            
            this._item.text($this.generateEmptyName());
        },
	    
	    getValue: function(){
	    	if(this._values.values.length > 0 && this._values.values[0].value){
	    		return this._values.values[0].value;
	    	}
	    	return null;
	    },

	    setValueFromEntry: function(entry){
	        var val = {
                workspaceId: entry.getWorkspace().getId(),
                entryId: entry.getId(),
                name: entry.getName()
            };

	        this.setValue(val, entry);
	        this.onchange();
	    }
	},

	$server: {
	    $require: ['JSB.Workspace.WorkspaceController'],

	    getEntry: function(entryDesc){
            if(!entryDesc || !entryDesc.workspaceId || !entryDesc.entryId){
            	return null;
            }
            
            try {
            	return WorkspaceController.getWorkspace(entryDesc.workspaceId).entry(entryDesc.entryId);	
            } catch(e){}

            return null;
            
	    }
	}
}