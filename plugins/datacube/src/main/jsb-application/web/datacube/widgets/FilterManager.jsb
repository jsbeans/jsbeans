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
			this.translateFilter(fDesc);
			var fId = this.constructFilterId(fDesc);
			if($this.filters[fId]){
				return fId;
			}
			return false;
		},
		
		translateFilter: function(fDesc){
			// translate local fields into cube fields
			if(JSB.isInstanceOf(fDesc.source, 'DataCube.Model.Slice')){
				function extractCubeField(rValue){
					if(JSB.isString(rValue)){
						return rValue;
					} else if(JSB.isObject(rValue)){
						if(JSB.isDefined(rValue.$field) && JSB.isString(rValue.$field)){
							return rValue.$field;
						}
						return null;
					} else {
						return null;
					}
				}
				var q = fDesc.source.getQuery();
				if(q.$select && q.$select[fDesc.field]){
					var cubeField = extractCubeField(q.$select[fDesc.field]);
					if(cubeField){
						fDesc.field = cubeField;
					} else {
						fDesc.boundTo = fDesc.sourceId;
					}
				}
			} else {
				fDesc.boundTo = fDesc.sourceId;
			}
		},
		
		addFilter: function(fDesc, sourceArr, initiator){
            // create new filters
			this.translateFilter(fDesc);
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
		
		localizeFilter: function(source){
			var sourceId = source.getLocalId();
			var filters = this.filterBySource[sourceId];
			if(!filters || Object.keys(filters).length == 0){
				return null;
			}
			return filters;
		},
		
		constructFilterBySource: function(source){
			return this.constructFilterByLocal(this.localizeFilter(source));
		},
		
		constructFilterByLocal: function(filters){
			if(!filters || Object.keys(filters).length == 0){
				return null;
			}
			// combine by fields
			var andFilters = [];
			var orFilters = [];
			var andFiltersLocal = [];
			var orFiltersLocal = [];
			for(var fItemId in filters){
				var fDesc = filters[fItemId];
				var fOp = {};
				fOp[fDesc.op] = fDesc.value;
				var field = {};
				field[fDesc.field] = fOp;
				if(fDesc.type == '$and'){
					if(fDesc.boundTo){
						if(fDesc.boundTo == sourceId){
							andFiltersLocal.push(field);
						}
					} else {
						andFilters.push(field);
					}
				} else if(fDesc.type == '$or'){
					if(fDesc.boundTo){
						if(fDesc.boundTo == sourceId){
							orFiltersLocal.push(field);
						}
					} else {
						orFilters.push(field);
					}
				}
			}
			
			var filter = null;
			var postFilter = null;
			
			var and = {$and:[]};
			var or = {$or:[]};
			var andLocal = {$and:[]};
			var orLocal = {$or:[]};
			
			// proceed and
			if(andFilters.length > 0){
				for(var i = 0; i < andFilters.length; i++){
					and.$and.push(andFilters[i]);
				}
			}
			
			// proceed or
			if(orFilters.length > 0){
				if(andFilters.length > 0){
					or.$or.push(and);
				}
				for(var i = 0; i < orFilters.length; i++){
					or.$or.push(orFilters[i]);
				}
				filter = or;
			} else if(andFilters.length > 0) {
				filter = and;
			}

			// proceed andLocal
			if(andFiltersLocal.length > 0){
				for(var i = 0; i < andFiltersLocal.length; i++){
					andLocal.$and.push(andFiltersLocal[i]);
				}
			}
			
			// proceed orLocal
			if(orFiltersLocal.length > 0){
				if(andFiltersLocal.length > 0){
					orLocal.$or.push(andLocal);
				}
				for(var i = 0; i < orFiltersLocal.length; i++){
					orLocal.$or.push(orFiltersLocal[i]);
				}
				postFilter = orLocal;
			} else if(andFiltersLocal.length > 0) {
				postFilter = andLocal;
			}

			return {
				filter: filter,
				postFilter: postFilter
			};
		},
		
		getFilterArray: function(){
			return this.filterArr;
		},
		
		getFilters: function(){
			return this.filters;
		},
		
	}
}