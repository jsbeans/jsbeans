{
	$name: 'Unimap.Render.EntryBinding',
	$parent: 'Unimap.Render.Item',
	$client: {
	    $require: ['JSB.Widgets.RendererRepository',
	               'css:EntryBinding.css'],

	    _items: [],
	    _renders: [],
	    
	    construct: function(){
	        this.addClass('entryBindingRender');
	        $base();
	        
/*
	        if(this._scheme.name && this._scheme.name.length > 0){
		        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
		        this.append(name);
		        
		        this.createRequireDesc(name);
		        this.createDescription(name);
	        }

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0]);
	        } else {
	            this.addItem();
	        }
*/	        
	    },
	    
	    generateEmptyName: function(){
	    	if(this._scheme.emptyText){
	    		return this._scheme.emptyText;
	    	}
	    	return 'Перетащите сюда объект';
	    },

	    addItem: function(values, itemIndex){
	    	if(!values){
                values = {};
	            if(!itemIndex){
	                itemIndex = this._values.values.length;
	            }

                this._values.values[itemIndex] = values;
            }
	    	
	    	var item = null;
	    	
	    	if(this._scheme.multiple){
	    		item = this.$('<div class="item multipleItem" idx="' + itemIndex + '"></div>').text($this.generateEmptyName());
	    		this.multipleBtn.before(item);
	    	} else {
		        item = this.$('<div class="item"></div>').text($this.generateEmptyName());
		        this.append(item);
	    	}
	    	
	    	this._items[itemIndex] = item;

            item.droppable({
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
                    var itemIdx = parseInt(item.attr('idx'));
                    for(var i in d.get(0).draggingItems){
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.EntryNode')){
							continue;
						}
						$this.setValueFromEntry(obj.getTargetEntry(), itemIdx);
						break;
                    }
                }
            });

           

            if(values){
                this.setValue(values.value, null, itemIndex);
            } else {
            	values = {
	                value: {}
	            };
	            this._values.values[itemIndex] = values;
            }
	    },
	    
	    removeItem: function(itemIndex){
	    	if(!itemIndex){
	    		itemIndex = 0;
	    	}
	    	
	    	$this._values.values.splice(itemIndex, 1);
	    	var item = this._items[itemIndex];
	    	this._items.splice(itemIndex, 1);
	    	
	    	// fix items idx
	    	for(var i = itemIndex; i < this._items.length; i++){
	    		this._items[i].attr('idx', i);
	    	}
	    	
	    	if(this._renders[itemIndex]){
	    		this._renders[itemIndex].destroy();
	    		this._renders.splice(itemIndex, 1);
	    	}
/*
            var errIndex = $this._errorList.indexOf(itemIndex);
            if(errIndex > -1){
                $this._errorList.splice(errIndex, 1);

                if($this._errorList.length === 0){
                    $this.hideError();
                }
            }
*/            
            
            item.remove();

	    },

	    destroy: function(){
	    	for(var i = 0; i < this._renders.length; i++){
	    		if(this._renders[i]){
	    			this._renders[i].destroy();
	    		}
	    	}
	    	this._renders = [];

	        $base();
	    },

	    setValue: function(val, entry, itemIdx){
	    	if(!itemIdx){
	    		itemIdx = 0;
	    	}
            this._values.values[itemIdx] = {
                value: val
            }
            
            var item = this._items[itemIdx];

            function createValue(entry){
            	item.addClass('filled');
                var render = RendererRepository.createRendererFor(entry);
                item.empty();
                item.append(render.getElement());
                $this._renders[itemIdx] = render;

                var removeButton = $this.$('<i class="btn btnDelete fas fa-times-circle" title="Удалить"></i>');
                removeButton.click(function(evt){
                    evt.stopPropagation();
                    if($this._scheme.multiple){
                    	$this.removeItem(parseInt(item.attr('idx')));
                    } else {
                    	$this.removeBinding(parseInt(item.attr('idx')));
                    }
                    
                });
                item.append(removeButton);
            }

            if(this._renders[itemIdx]){
            	this._renders[itemIdx].destroy();
            	this._renders[itemIdx] = null;
            }
            
            item.empty();
            item.removeClass('filled');
            item.text($this.generateEmptyName());

            if($this._scheme.multiple){
	    		var removeButton = $this.$('<i class="btn btnDelete fas fa-times-circle" title="Удалить"></i>');
	            removeButton.click(function(evt){
	                evt.stopPropagation();
	                $this.removeItem(parseInt(item.attr('idx')));
	            });
	            item.append(removeButton);
            }

            
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
	    
	    removeBinding: function(itemIdx){
	    	if(!itemIdx){
	    		itemIdx = 0;
	    	}
	    	if(this._renders[itemIdx]){
	    		this._renders[itemIdx].destroy();
	    	}
	    	var item = this._items[itemIdx];
	    	if(item){
	            item.find('.btnDelete').remove();
	            item.removeClass('filled');
	    	}
            $this.setValue(null, null, itemIdx);
            $this.onchange();
            
            item.text($this.generateEmptyName());
        },
	    
	    getValue: function(){
	    	if(this._values.values.length > 0 && this._values.values[0].value){
	    		return this._values.values[0].value;
	    	}
	    	return null;
	    },
	    
	    getValues: function(){
	    	
	    },

	    setValueFromEntry: function(entry, itemIdx){
	        var val = {
                workspaceId: entry.getWorkspace().getId(),
                entryId: entry.getId(),
                name: entry.getName()
            };

	        this.setValue(val, entry, itemIdx);
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