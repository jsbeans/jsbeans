{
	$name: 'JSB.DataCube.Widgets.FilterSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Crypt.MD5', 'JSB.Widgets.Button'],
	
	$client: {
		owner: null,
		visible: false,
		filterBySource: {},
		filters: {},
		filterArr: [],
		
		$constructor: function(owner){
			$base();
			this.owner = owner;
			this.loadCss('FilterSelector.css');
			this.addClass('filterSelector');
			
			this.append('<div class="icon"></div>');
			this.append('<div class="filterContainer"></div>');
			
			$this.updateVisibility();
		},
		
		getOwner: function(){
			return this.owner;
		},
		
		clear: function(){
			this.filterBySource = {};
			this.filters = {};
			this.filterArr = [];
			this.redraw();
		},
		
		addFilterItem: function(sourceId, type, fItem){
			var itemId = MD5.md5('' + fItem.field) + '_' + MD5.md5('' + fItem.value);
			if(!$this.filterBySource[sourceId]){
				$this.filterBySource[sourceId] = {};
			}
			if($this.filterBySource[sourceId][itemId]){
				return false; 
			}
			$this.filterBySource[sourceId][itemId] = {
				id: itemId,
				type: type,
				field: fItem.field,
				value: fItem.value,
				op: fItem.op
			}
			
			if(!$this.filters[itemId]){
				$this.filters[itemId] = $this.filterBySource[sourceId][itemId];
				$this.filterArr.push($this.filters[itemId]);
			}
			
			
			return true;
		},
		
		removeFilterItem: function(itemId){
			// remove from sources
			for(var srcId in $this.filterBySource){
				if($this.filterBySource[srcId][itemId]){
					delete $this.filterBySource[srcId][itemId];
				}
			}
			
			// remove from filters
			if($this.filters[itemId]){
				delete $this.filters[itemId];
			}
			
			// remove from array
			for(var i = $this.filterArr.length - 1; i >= 0 ; i--){
				if($this.filterArr[i].id == itemId){
					$this.filterArr.splice(i, 1);
				}
			}
		},
		
		addFilter: function(srcId, type, items){
			if(!JSB.isArray(items)){
				items = [items];
			}
			// acquire cube slices by current source
			this.getOwner().getDashboard().server().acquireAssiciatedSources(srcId, function(sourceArr){
				var bNeedRefresh = false;
				for(var i = 0; i < sourceArr.length; i++){
					var sourceId = sourceArr[i];
					for(var j = 0; j < items.length; j++){
						if($this.addFilterItem(sourceId, type, items[j])){
							bNeedRefresh = true;
						}
					}
				}
				if(bNeedRefresh){
					$this.redraw();
					JSB.defer(function(){
						$this.publish('DataCube.Dashboard.filterChanged');	
					});
				}
			})
		},
		
		constructFilter: function(sourceId){
			var filters = this.filterBySource[sourceId];
			if(!filters || Object.keys(filters).length == 0){
				return null;
			}
			var filter = {};
			for(var fItemId in filters){
				var fItemDesc = filters[fItemId];
				var fOp = {};
				fOp[fItemDesc.op] = fItemDesc.value;
				filter[fItemDesc.field] = fOp;
			}
			return filter;
		},
		
		updateVisibility: function(){
			if(this.filterArr.length > 0){
				if(!this.visible){
					this.getElement().css('height', 28);
					this.visible = true;
				} else {
					if(this.filterArr.length == 1){
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
			var fContainerElt = this.find('> .filterContainer');
			fContainerElt.empty();
			for(var i = 0; i < this.filterArr.length; i++){
				(function(fId){
					var fDesc = $this.filters[fId];
					var fTag = $this.$('<div class="filterTag"></div>').attr('fId', fId);
					fTag.append($this.$('<div class="field"></div>').text(fDesc.field).attr('title', fDesc.field));
					fTag.append('<div class="op">=</div>');
					fTag.append($this.$('<div class="value"></div>').text('' + fDesc.value).attr('title', '' + fDesc.value));
					
					var removeButton = new Button({
						cssClass: 'roundButton btn10 btnDelete',
						tooltip: 'Удалить фильтр',
						onClick: function(evt){
							evt.stopPropagation();
							$this.removeFilterItem(fId);
							removeButton.destroy();
							fTag.remove();
							$this.updateVisibility();
							JSB.defer(function(){
								$this.publish('DataCube.Dashboard.filterChanged');	
							});
						}
					});
					fTag.append(removeButton.getElement());
					
					fContainerElt.append(fTag);
				})(this.filterArr[i].id);
			}
			this.updateVisibility();
		}
	}
}