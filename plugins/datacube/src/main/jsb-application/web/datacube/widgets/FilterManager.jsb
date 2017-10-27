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
		
		removeFilter: function(itemId, isNoPublish){
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
			
			if(Object.keys($this.filters) != pfCount && !isNoPublish){
				this.publish('DataCube.filterChanged');
			}
		},
		
		clearFilters: function(initiator){
			var filtersIds = Object.keys($this.filters);
			for(var i = 0; i < filtersIds.length; i++){
				$this.removeFilter(filtersIds[i], true);
			}
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

			// check filter conflicts
            var f;
            for(var i = 0; i < $this.filterArr.length; i++){
                if($this.filterArr[i].field === fDesc.field && $this.filterArr[i].op === fDesc.op)
                    f = $this.filterArr[i];
            }
            if(f){
                switch(f.op){
                    case "$gt":
                    case "$gte":   // >=
                        if(f.type === "$and" && fDesc.type === "$and"){
                            if(f.value >= fDesc.value){
                                return f.id;
                            } else {
                                this.removeFilter(f.id, true);
                            }
                        }
                        if(f.type === "$or" && fDesc.type === "$or"){
                            if(f.value >= fDesc.value){
                                this.removeFilter(f.id, true);
                            } else {
                                return f.id;
                            }
                        }
                        break;
                    case "$lt":
                    case "$lt":
                    case "$lte":    // <=
                        if(f.type === "$and" && fDesc.type === "$and"){
                            if(f.value >= fDesc.value){
                                this.removeFilter(f.id, true);
                            } else {
                                return f.id;
                            }
                        }
                        if(f.type === "$or" && fDesc.type === "$or"){
                            if(f.value >= fDesc.value){
                                return f.id;
                            } else {
                                this.removeFilter(f.id, true);
                            }
                        }
                        break;
                    case "$eq":
                        if(f.type === "$and" && fDesc.type === "$and"){
                            this.removeFilter(f.id, true);
                        }
                        break;
                }
            }
			
			var bNeedRefresh = false;
			for(var i = 0; i < sourceArr.length; i++){
				if($this.addFilterItem(sourceArr[i], fDesc)){
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
			return this.constructFilterByLocal(this.localizeFilter(source), source);
		},
		
		constructFilterByLocal: function(filters, source){
			if(!filters || Object.keys(filters).length == 0){
				return null;
			}
			var sourceId = source.getLocalId();
			
			// combine by fields
			var ffMap = {};
			for(var fItemId in filters){
				var fDesc = filters[fItemId];
				if(!ffMap[fDesc.field]){
					ffMap[fDesc.field] = {
						andFilters: [],
						orFilters: [],
						andFiltersLocal: [],
						orFiltersLocal: []
					};
				}
				
				var ffDesc = ffMap[fDesc.field];
				var fOp = {};
				fOp[fDesc.op] = fDesc.value;
				var field = {};
				field[fDesc.field] = fOp;
				if(fDesc.type == '$and'){
					if(fDesc.boundTo){
						if(fDesc.boundTo == sourceId){
							ffDesc.andFiltersLocal.push(field);
						}
					} else {
						ffDesc.andFilters.push(field);
					}
				} else if(fDesc.type == '$or'){
					if(fDesc.boundTo){
						if(fDesc.boundTo == sourceId){
							ffDesc.orFiltersLocal.push(field);
						}
					} else {
						ffDesc.orFilters.push(field);
					}
				}
			}
			
			function _constructFieldFilter(fName){
				var ffDesc = ffMap[fName];
				
				var filter = null;
				var postFilter = null;
				
				var or = {$or:[]};
				var and = {$and:[]};
				
				var orLocal = {$or:[]};
				var andLocal = {$and:[]};
				
				// proceed and
				if(ffDesc.andFilters.length > 0){
					for(var i = 0; i < ffDesc.andFilters.length; i++){
						and.$and.push(ffDesc.andFilters[i]);
					}
				}
				if(and.$and.length == 0){
					and = null;
				} else if(and.$and.length == 1){
					and = and.$and[0];
				}
				
				// proceed or
				if(ffDesc.orFilters.length > 0){
					if(and){
						or.$or.push(and);
					}
					for(var i = 0; i < ffDesc.orFilters.length; i++){
						or.$or.push(ffDesc.orFilters[i]);
					}
					if(or.$or.length == 0){
						or = null;
					} else if(or.$or.length == 1){
						or = or.$or[0];
					}
					filter = or;
				} else if(and) {
					filter = and;
				}
				
				// proceed and local
				if(ffDesc.andFiltersLocal.length > 0){
					for(var i = 0; i < ffDesc.andFiltersLocal.length; i++){
						andLocal.$and.push(ffDesc.andFiltersLocal[i]);
					}
				}
				if(andLocal.$and.length == 0){
					andLocal = null;
				} else if(andLocal.$and.length == 1){
					andLocal = andLocal.$and[0];
				}
				
				// proceed or local
				if(ffDesc.orFiltersLocal.length > 0){
					if(andLocal){
						orLocal.$or.push(andLocal);
					}
					for(var i = 0; i < ffDesc.orFiltersLocal.length; i++){
						orLocal.$or.push(ffDesc.orFiltersLocal[i]);
					}
					if(orLocal.$or.length == 0){
						orLocal = null;
					} else if(orLocal.$or.length == 1){
						orLocal = orLocal.$or[0];
					}
					postFilter = orLocal;
				} else if(andLocal) {
					postFilter = andLocal;
				}
				return {filter: filter, postFilter: postFilter}
			}
			
			var filter = {$and:[]};
			var postFilter = {$and:[]};
			
			for(var fName in ffMap){
				var fDesc = _constructFieldFilter(fName);
				if(fDesc.filter){
					filter.$and.push(fDesc.filter);
				}
				if(fDesc.postFilter){
					postFilter.$and.push(fDesc.postFilter);
				}
			}
			
			// correct filters
			if(filter.$and.length == 0){
				filter = null;
			} else if(filter.$and.length == 1){
				filter = filter.$and[0];
			}
			
			if(postFilter.$and.length == 0){
				postFilter = null;
			} else if(postFilter.$and.length == 1){
				postFilter = postFilter.$and[0];
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