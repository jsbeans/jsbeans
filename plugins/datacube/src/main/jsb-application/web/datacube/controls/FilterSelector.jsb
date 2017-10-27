{
	$name: 'DataCube.Controls.FilterSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.Button'],
	
	$client: {
		owner: null,
		filterManager: null,
		visible: false,
		
		$constructor: function(owner, filterManager){
			$base();
			this.owner = owner;
			this.filterManager = filterManager;
			this.loadCss('FilterSelector.css');
			this.addClass('filterSelector');
			
			this.append('<div class="icon"></div>');
			this.append('<div class="filterContainer"></div>');
			
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
			fContainerElt.empty();
			
			function _constructTag(fId){
				var fDesc = filters[fId];
				var fTag = $this.$('<div class="filterTag"></div>').attr('fId', fId);

				var type = '';
				switch(fDesc.type){
				    case '$and':
                        type = 'И';
				        break;
                    case '$or':
                        type = 'ИЛИ';
                        break;
				}
                //fTag.append($this.$('<div class="type"></div>').text(type));

				fTag.append($this.$('<div class="field"></div>').text(fDesc.field).attr('title', fDesc.field));
				var opSign = ':';
				switch(fDesc.op){
				case '$eq':
					opSign = '=';
					break;
				case '$lt':
					opSign = '<';
					break;
				case '$lte':
					opSign = '&le;';
					break;
				case '$gt':
					opSign = '>';
					break;
				case '$gte':
					opSign = '&ge;';
					break;
				case '$ne':
					opSign = '&ne;';
					break;
				case '$like':
				case '$ilike':
					opSign = '&asymp;';
					break;
				default:
					opSign = ':';
				}
				fTag.append('<div class="op">'+opSign+'</div>');

				if(JSB().isDate(fDesc.value)){
				    var v = fDesc.value.toDateString();
				} else {
				    var v = fDesc.value;
				}
				var valElt = $this.$('<div class="value"></div>').text('' + v).attr('title', '' + v);
				if(JSB.isString(v)){
					valElt.addClass('string');
				}
				fTag.append(valElt);
				
				var removeButton = new Button({
					cssClass: 'roundButton btn10 btnDelete',
					tooltip: 'Удалить фильтр',
					onClick: function(evt){
						evt.stopPropagation();
						$this.filterManager.removeFilter(fId);
						removeButton.destroy();
						fTag.remove();
						$this.updateVisibility();
						
						JSB.defer(function(){
							$this.publish('DataCube.filterChanged', {initiator: $this, dashboard: $this.getOwner().getDashboard(), type: 'removeFilter', fItemIds: [fId]});
						});
					}
				});
				fTag.append(removeButton.getElement());
				
				return fTag;
			}
			
			// construct logic tree
			var ffMap = {};
			for(var fItemId in filters){
				var fDesc = filters[fItemId];
				if(!ffMap[fDesc.field]){
					ffMap[fDesc.field] = {
						andFilters: [],
						orFilters: []
					};
				}
				
				var ffDesc = ffMap[fDesc.field];
				if(fDesc.type == '$and'){
					ffDesc.andFilters.push({type:'tag', id: fItemId});
				} else if(fDesc.type == '$or'){
					ffDesc.orFilters.push({type:'tag', id: fItemId});
				}
			}
			
			var drawTree = {type:'and', values:[]};
			
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
				
				drawTree.values.push(treeNode);
			}
			
			if(drawTree.values.length == 0){
				drawTree = null;
			} else if(drawTree.values.length == 1){
				drawTree = drawTree.values[0];
			}
			
			function _renderTree(treeNode){
				if(treeNode.type == 'tag'){
					return _constructTag(treeNode.id);
				} else {
					var nodeElt = $this.$('<div class="node"></div>');
					for(var i = 0; i < treeNode.values.length; i++){
						if(i > 0){
							nodeElt.append($this.$('<div class="separator"></div>').text(treeNode.type == 'and' ? 'И' : 'ИЛИ').attr('type', treeNode.type));
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