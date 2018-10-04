{
	$name: 'DataCube.Controls.FilterSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Controls.FilterTag'],
	
	$client: {
		owner: null,
		filterManager: null,
		visible: false,
		filterTags: {},
		
		$constructor: function(owner, filterManager){
			$base();
			this.owner = owner;
			this.filterManager = filterManager;
			this.loadCss('FilterSelector.css');
			this.addClass('filterSelector');
			
			var iconElt = this.$('<div class="icon"></div>');
			this.append(iconElt);
			this.append('<div class="filterContainer"></div>');
			
			iconElt.click(function(){
				$this.clear();
			});
			
			$this.updateVisibility();
			
			this.subscribe('DataCube.filterChanged', function(sender){
				if(!JSB.isInstanceOf(sender, 'DataCube.Widgets.FilterManager')){
					return;
				}

				$this.redraw();
			});
		},
		
		getOwner: function(){
			return this.owner;
		},
		
		clear: function(){
			var fIds = Object.keys($this.filterTags);
			$this.filterManager.clear();
			$this.redraw();
			$this.publish('DataCube.filterChanged', {initiator: $this, manager: $this.filterManager, type: 'removeFilter', fItemIds: fIds});
		},
		
		updateVisibility: function(){
			var filterArr = this.filterManager.getFilterArray();
			if(filterArr.length > 0){
				if(!this.visible){
					this.getElement().css('height', 28);
					this.visible = true;
				} else {
					if(filterArr.length == 1){
						this.getElement().css('height', 28);
					} else {
						this.getElement().css('height', '');
					}
				}
			} else {
				this.visible = false;
				this.getElement().css('height', 0);
			}
		},
		
		redraw: function(){
			var filterArr = this.filterManager.getFilterArray();
			var filters = this.filterManager.getFilters();
			var fContainerElt = this.find('> .filterContainer');
			
			// remove old
			for(var fId in $this.filterTags){
				$this.filterTags[fId].destroy();
			}
			fContainerElt.empty();

			// construct logic tree
			var ffMap = {};
			for(var fItemId in filters){
				var fDesc = filters[fItemId];
				var f = fDesc.cubeField || fDesc.field;
				if(!ffMap[f]){
					ffMap[f] = {
						andFilters: [],
						orFilters: []
					};
				}
				
				var ffDesc = ffMap[f];
				if(fDesc.type == '$and'){
					ffDesc.andFilters.push({type:'tag', id: fItemId});
				} else if(fDesc.type == '$or'){
					ffDesc.orFilters.push({type:'tag', id: fItemId});
				} else if(fDesc.type == '$not'){
					ffDesc.andFilters.push({type:'tag', id: fItemId, not:true});
				}
			}
			
			var drawTree = {type:'or', values:[{type:'and', values:[]}]};
			
			for(var fName in ffMap){
				var ffDesc = ffMap[fName];
				var treeNode = null;
				
				var and = {type:'and', values:[]};
				var or = {type:'or', values:[]};
				
				// proceed and
				if(ffDesc.andFilters.length > 0){
					and.values = ffDesc.andFilters;
				}
				if(and.values.length == 0){
					and = null;
				} else if(and.values.length == 1){
					and = and.values[0];
				}
				
				// proceed or
				if(ffDesc.orFilters.length > 0){
					if(and){
						or.values.push(and);
					}
					for(var i = 0; i < ffDesc.orFilters.length; i++){
						or.values.push(ffDesc.orFilters[i]);
					}
					if(or.values.length == 0){
						or = null;
					} else if(or.values.length == 1){
						or = or.values[0];
					}
					treeNode = or;
				} else if(and){
					treeNode = and;
				}
				if(ffDesc.andFilters.length > 0){
					drawTree.values[0].values.push(treeNode);
				} else {
					drawTree.values.push(treeNode);
				}
			}
			
			if(drawTree.values[0].values.length == 0){
				drawTree.values.splice(0, 1);
			} else if(drawTree.values[0].values.length == 1){
				drawTree.values[0] = drawTree.values[0].values[0];
			}
			if(drawTree.values.length == 0){
				drawTree = null;
			} else if(drawTree.values.length == 1){
				drawTree = drawTree.values[0];
			}

			function _renderTree(treeNode){
				if(treeNode.type == 'tag'){
					var fId = treeNode.id;
					var fDesc = filters[fId];
					var fTag = new FilterTag(fDesc, {
						not: treeNode.not, 
						onRemove: function(){
							$this.filterManager.removeFilter(fId);
							if($this.filterTags[fId]){
								delete $this.filterTags[fId];
							}
							fTag.destroy();
							$this.updateVisibility();
							JSB.defer(function(){
								$this.publish('DataCube.filterChanged', {initiator: $this, manager: $this.filterManager, type: 'removeFilter', fItemIds: [fId]});
							});
						}
					});
					$this.filterTags[fId] = fTag;
					
					return fTag.getElement();
				} else {
					var nodeElt = $this.$('<div class="node"></div>');
					for(var i = 0; i < treeNode.values.length; i++){
						if(i > 0){
						    var separator = $this.$('<div class="separator"></div>').text(treeNode.type == 'and' ? 'И' : 'ИЛИ').attr('type', treeNode.type);
							nodeElt.append(separator);

							(function(fId, type){
                                separator.click(function(evt){
                                    evt.stopPropagation();

                                    $this.filterManager.changeFilterType(fId, type == 'and' ? '$or' : '$and');

                                    separator.text(type == 'and' ? 'ИЛИ' : 'И');

                                    type = (type === type == 'and' ? 'or' : 'and');

                                    JSB.defer(function(){
                                        $this.publish('DataCube.filterChanged', {initiator: $this, manager: $this.filterManager, type: 'changeFilterType', fItemIds: [fId]});
                                    });
                                });
							})(treeNode.values[i].id, treeNode.type);
						}
						nodeElt.append(_renderTree(treeNode.values[i]));
					}
					
					return nodeElt;
				}
			}
			
			if(drawTree){
				fContainerElt.append(_renderTree(drawTree));
			}
			this.updateVisibility();
		}
	}
}