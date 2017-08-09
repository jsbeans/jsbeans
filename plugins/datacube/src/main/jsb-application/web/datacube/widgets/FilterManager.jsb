{
	$name: 'DataCube.Widgets.FilterManager',
	$require: ['JSB.Crypt.MD5'],
	
	$client: {
		owner: null,
		filterBySource: {},
		filters: {},
		filterArr: [],
		
		$constructor: function(owner){
			$base();
			this.owner = owner;
		},
		
		getOwner: function(){
			return this.owner;
		},
		
		clear: function(){
			this.filterBySource = {};
			this.filters = {};
			this.filterArr = [];
		},
		
		constructFilterId: function(fItem){
			return MD5.md5('' + fItem.field) + '_' + MD5.md5('' + fItem.value);
		},
		
		addFilterItem: function(sourceId, fDesc){
			var itemId = this.constructFilterId(fDesc);
			if(!$this.filterBySource[sourceId]){
				$this.filterBySource[sourceId] = {};
			}
			if($this.filterBySource[sourceId][itemId]){
				return false; 
			}
			$this.filterBySource[sourceId][itemId] = {
				id: itemId,
				type: fDesc.type,
				field: fDesc.field,
				value: fDesc.value,
				op: fDesc.op
			}
			
			if(!$this.filters[itemId]){
				$this.filters[itemId] = $this.filterBySource[sourceId][itemId];
				$this.filterArr.push($this.filters[itemId]);
			}
			
			return true;
		},
		
		removeFilter: function(itemId){
			var pfCount = Object.keys($this.filters).length;
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
			
			if(Object.keys($this.filters) != pfCount){
				this.publish('DataCube.filterChanged');
			}
		},
		
		clearFilters: function(initiator){
			
		},
		
		hasFilter: function(fDesc){
			var fId = this.constructFilterId(fDesc);
			if($this.filters[fId]){
				return fId;
			}
			return false;
		},
		
		addFilter: function(fDesc, sourceArr, initiator){
            // create new filters
			var fId = this.constructFilterId(fDesc);
			
			var bNeedRefresh = false;
			for(var i = 0; i < sourceArr.length; i++){
				var sourceId = sourceArr[i];
				if($this.addFilterItem(sourceId, fDesc)){
					bNeedRefresh = true;
				}
			}
			if(bNeedRefresh){
				this.publish('DataCube.filterChanged');
			}
			return fId;
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
		
		getFilterArray: function(){
			return this.filterArr;
		},
		
		getFilters: function(){
			return this.filters;
		},
		
	}
}