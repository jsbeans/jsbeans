/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Widgets.FilterManager',
	$require: ['JSB.Crypt.MD5'],
	
	$client: {
		owner: null,
		filters: {},
		filterArr: [],
		cubeFieldMap: {},
		
		$constructor: function(owner){
			$base();
			this.owner = owner;
			this.subscribe('DataCube.Model.Cube.updateCubeFields', {session: true}, function(sender, msg, params){
				if($this.cubeFieldMap[sender.getId()]){
                    $this.cubeFieldMap[sender.getId()] = params.fieldMap;
                }
			});
		},
		
		getOwner: function(){
			return this.owner;
		},
		
		clear: function(){
			this.filters = {};
			this.filterArr = [];
			this.publish('DataCube.filterChanged');
		},
		
		constructFilterId: function(fItem){
			function _constructFilterPath(fDesc, sender){
				if(fDesc.op == '$group'){
					var curSender = fDesc.sender || sender;
					var str = '__$group' + curSender.getId();
					for(var i = 0; i < fDesc.items.length; i++){
						str += '|' + _constructFilterPath(fDesc.items[i], curSender);
					}
					return str;
				} else {
					return '' + (fDesc.cubeField || fDesc.field || fDesc.param) + '|' + (fDesc.op || '') + '|' + JSON.stringify(fDesc.value);
				}
			}
			return  MD5.md5(_constructFilterPath(fItem));
		},
		
		registerSource: function(widget, source, callback){
			var cube = source.getQueryableContainer();

			if(this.cubeFieldMap[cube.getId()]){
				callback.call($this);
				return;
			}

			// get source fields
			cube.server().extractFields(function(fm){
				$this.cubeFieldMap[cube.getId()] = fm;
				callback.call($this);
			});
		},
		
		removeFilter: function(itemId, dontPublish){
			var bRemoved = false;

			// remove from filters
			if($this.filters[itemId]){
				delete $this.filters[itemId];
				bRemoved = true;
			}

			// remove from array
			for(var i = $this.filterArr.length - 1; i >= 0 ; i--){
				if($this.filterArr[i].id == itemId){
					$this.filterArr.splice(i, 1);
				}
			}

			if(bRemoved && !dontPublish){
				this.publish('DataCube.filterChanged');
			}
		},

		clearFilters: function(){
			var bRemoved = false;
			var filtersIds = Object.keys($this.filters);
			for(var i = 0; i < filtersIds.length; i++){
				$this.removeFilter(filtersIds[i], true);
				bRemoved = true;
			}
			if(bRemoved){
				this.publish('DataCube.filterChanged');
			}
		},

		hasFilter: function(fDesc){
			var fId = this.constructFilterId(fDesc);
			if($this.filters[fId]){
				return fId;
			}
			return false;
		},

		extractCubeField: function(source, field){
			var cubeField = field;
			if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
				function _extractCubeField(rValue){
					if(JSB.isString(rValue)){
						return rValue;
					} else if(JSB.isObject(rValue)){
						var d = ['$field','$first','$last','$any'];
						for(var i = 0; i < d.length; i++){
							if(JSB.isDefined(rValue[d[i]]) && JSB.isString(rValue[d[i]])){
								return rValue[d[i]];
							}
						}
						return null;
					} else {
						return null;
					}
				}
				var q = source.getQuery();
				var cube = source.getQueryableContainer();
				var cubeFields = $this.cubeFieldMap && $this.cubeFieldMap[cube.getId()];
				if(q.$select && q.$select[field] && (!cubeFields || !cubeFields[field])){
					cubeField = _extractCubeField(q.$select[field]);
				}
			} else {
				// throw new Error('Unknown source type: ' + source.getJsb().$name);
			}

			return cubeField;
		},

		translateFilter: function(fDesc, source){
			var newDesc = JSB.clone(fDesc);
			function _translate(newDesc){
				if(newDesc.type == '$param'){
					return newDesc;
				}
				if(newDesc.op == '$group'){
					for(var i = 0; i < newDesc.items.length; i++){
						_translate(newDesc.items[i]);
					}
				} else {
					var cubeField = newDesc.cubeField || $this.extractCubeField(source, newDesc.field);
					if(cubeField){
						newDesc.cubeField = cubeField;
						newDesc.cubeId = source.getQueryableContainer().getId();
					} else {
						newDesc.boundTo = source.getId();
					}
				}
				return newDesc;
			}
			return _translate(newDesc);
		},

		addFilter: function(fDesc){
            // create new filters
			var itemId = this.constructFilterId(fDesc);
			if($this.filters[itemId]){
				return itemId;
			}

			// check filter conflicts
            var f;
            for(var i = 0; i < $this.filterArr.length; i++){
                if(($this.filterArr[i].cubeField || $this.filterArr[i].field) === (fDesc.cubeField || fDesc.field) && $this.filterArr[i].op === fDesc.op){
                    f = $this.filterArr[i];
                }
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
                    case "$ne":
                    	break;
                }
            }

			$this.filters[itemId] = JSB.merge({}, fDesc, {id: itemId});
			$this.filterArr.push($this.filters[itemId]);

			$this.publish('DataCube.filterChanged');

			return itemId;
		},

		changeFilterType: function(itemId, nType){
			if($this.filters[itemId]){
				$this.filters[itemId].type = nType;
			}

			for(var i = $this.filterArr.length - 1; i >= 0 ; i--){
				if($this.filterArr[i].id == itemId){
					$this.filterArr[i].type = nType;
				}
			}
		},
		
		getFiltersBySource: function(source){
			var sourceId = source.getId();
			var cube = source.getQueryableContainer();
			var cubeFields = $this.cubeFieldMap[cube.getId()];
			var srcFilters = {};
			
			function _checkSourceAccepted(fDesc){
				if(fDesc.op == '$group'){
					for(var i = 0; i < fDesc.items.length; i++){
						if(_checkSourceAccepted(fDesc.items[i])){
							return true;
						}
					}
					return false;
				} else if(fDesc.type == '$param'){
					return true;
				} else {
					var f = fDesc.cubeField || fDesc.field;
					return fDesc.boundTo == sourceId || (cubeFields && cubeFields[f]);
				}
			}
			
			for(var fItemId in this.filters){
				var fDesc = this.filters[fItemId];
				if(_checkSourceAccepted(fDesc)){
					srcFilters[fItemId] = JSB.clone(fDesc);
				}
			}
			return srcFilters;
		},
		
		constructFilterBySource: function(source){
			return this.constructFilterByLocal(this.getFiltersBySource(source), source);
		},
		
		performSegmentation: function(segMap, fDesc, sourceId){
			// generate segDesc entry
			var segName = fDesc.op == '$group' ? '__group' + fDesc.sender.getId() : fDesc.cubeField || fDesc.field || fDesc.param;
			if(!segMap[segName]){
				segMap[segName] = {
					andFilters: [],
					orFilters: [],
					notFilters: [],
					andFiltersLocal: [],
					orFiltersLocal: [],
					notFiltersLocal: [],
					params: []
				};
			}
			var type = fDesc.type;
			
			function _insertToSeg(fDesc, segDesc, filterName, localFilterName, val){
				if(fDesc.boundTo && localFilterName){
					if(fDesc.boundTo == sourceId){
						segDesc[localFilterName].push(val);
					}
				} else {
					segDesc[filterName].push(val);
				}

			}
			
			function _performSegmentation(segDesc, fDesc){
				if(fDesc.op == '$group'){
					var groupSeg = {
						type: 'group',
						andFilters: [],
						orFilters: [],
						notFilters: [],
						andFiltersLocal: [],
						orFiltersLocal: [],
						notFiltersLocal: [],
						params: []
					};
					for(var i = 0; i < fDesc.items.length; i++){
						_performSegmentation(groupSeg, fDesc.items[i]);
					}
					
					if(fDesc.type == '$and'){
						_insertToSeg(fDesc, segDesc, 'andFilters', null, groupSeg);
					} else if(fDesc.type == '$or'){
						_insertToSeg(fDesc, segDesc, 'orFilters', null, groupSeg);
					} else if(fDesc.type == '$not'){
						_insertToSeg(fDesc, segDesc, 'notFilters', null, groupSeg);
					} else if(fDesc.type == '$param'){
						_insertToSeg(fDesc, segDesc, 'params', null, groupSeg);
					} else {
						throw new Error('Unexpected filter type: ' + fDesc.type);
					}
				} else {
					var field = {};
					if(fDesc.op == '$range'){
						var f = fDesc.cubeField || fDesc.field;
						if(JSB.isArray(fDesc.value) && fDesc.value.length >= 2){
							var f1 = {}, f2 = {};
							f1[f] = {$gte: fDesc.value[0]};
							f2[f] = {$lte: fDesc.value[1]};
							field.$and = [f1, f2];
						}
					} else if(fDesc.type == '$param'){
						field[fDesc.param] = fDesc.value;
					} else {
						var f = fDesc.cubeField || fDesc.field;
						var fOp = {};
						fOp[fDesc.op] = fDesc.value;
						field[f] = fOp;
					}
					
					if(fDesc.type == '$and'){
						_insertToSeg(fDesc, segDesc, 'andFilters', 'andFiltersLocal', {type:'filter', filter:field});
					} else if(fDesc.type == '$or'){
						_insertToSeg(fDesc, segDesc, 'orFilters', 'orFiltersLocal', {type:'filter', filter:field});
					} else if(fDesc.type == '$not'){
						_insertToSeg(fDesc, segDesc, 'notFilters', 'notFiltersLocal', {type:'filter', filter:field});
					} else if(fDesc.type == '$param'){
						_insertToSeg(fDesc, segDesc, 'params', null, {type:'filter', filter:field});
					} else {
						throw new Error('Unexpected filter type: ' + fDesc.type);
					}
				}
			}
			
			_performSegmentation(segMap[segName], fDesc, sourceId);
		},
		
		constructFilterByLocal: function(filters, source){
			if(!filters || Object.keys(filters).length == 0){
				return null;
			}
			var sourceId = source.getId();
			
			// combine by fields
			var ffMap = {};
			for(var fItemId in filters){
				var fDesc = filters[fItemId];
				
				$this.performSegmentation(ffMap, fDesc, sourceId);
			}
			
			function _constructSegFilter(ffDesc){
				var filter = null;
				var postFilter = null;
				var params = null;
				
				var or = {$or:[]};
				var and = {$and:[]};
				
				var orLocal = {$or:[]};
				var andLocal = {$and:[]};
				
				// proceed and & not
				if(ffDesc.andFilters.length > 0){
					for(var i = 0; i < ffDesc.andFilters.length; i++){
						var curFilter = null;
						var curFilterLocal = null;
						if(ffDesc.andFilters[i].type == 'filter'){
							curFilter = ffDesc.andFilters[i].filter;
						} else {
							var curDesc = _constructSegFilter(ffDesc.andFilters[i]);
							curFilter = curDesc.filter;
							curFilterLocal = curDesc.postFilter;
						}
						if(curFilter){
							and.$and.push(curFilter);
						}
						if(curFilterLocal){
							andLocal.$and.push(curFilterLocal);
						}
					}
				}
				if(ffDesc.notFilters.length > 0){
					for(var i = 0; i < ffDesc.notFilters.length; i++){
						var curFilter = null;
						var curFilterLocal = null;
						if(ffDesc.notFilters[i].type == 'filter'){
							curFilter = ffDesc.notFilters[i].filter;
						} else {
							var curDesc = _constructSegFilter(ffDesc.notFilters[i]);
							curFilter = curDesc.filter;
							curFilterLocal = curDesc.postFilter;
						}
						if(curFilter){
							and.$and.push({$not:curFilter});
						}
						if(curFilterLocal){
							andLocal.$and.push({$not:curFilterLocal});
						}
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
						var curFilter = null;
						var curFilterLocal = null;
						if(ffDesc.orFilters[i].type == 'filter'){
							curFilter = ffDesc.orFilters[i].filter;
						} else {
							var curDesc = _constructSegFilter(ffDesc.orFilters[i]);
							curFilter = curDesc.filter;
							curFilterLocal = curDesc.postFilter;
						}
						if(curFilter){
							or.$or.push(curFilter);
						}
						if(curFilterLocal){
							orLocal.$or.push(curFilterLocal);
						}
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
				
				// proceed and & not local
				if(ffDesc.andFiltersLocal.length > 0){
					for(var i = 0; i < ffDesc.andFiltersLocal.length; i++){
						if(ffDesc.andFiltersLocal[i].type == 'filter'){
							andLocal.$and.push(ffDesc.andFiltersLocal[i].filter);
						} else {
							throw new Error('Groups cannot be hosted in local filters')
						}
					}
				}
				
				if(ffDesc.notFiltersLocal.length > 0){
					for(var i = 0; i < ffDesc.notFiltersLocal.length; i++){
						if(ffDesc.notFiltersLocal[i].type == 'filter'){
							andLocal.$and.push({$not:ffDesc.notFiltersLocal[i].filter});
						} else {
							throw new Error('Groups cannot be hosted in local filters')
						}
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
						if(ffDesc.orFiltersLocal[i].type == 'filter'){
							orLocal.$or.push(ffDesc.orFiltersLocal[i].filter);
						} else {
							throw new Error('Groups cannot be hosted in local filters')
						}
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
				
				// proceed params
				if(ffDesc.params.length > 0){
					params = {};
					for(var i = 0; i < ffDesc.params.length; i++){
						var pDesc = ffDesc.params[i].filter;
						for(var pName in pDesc){
							params[pName] = {$defaultValue: pDesc[pName]};
						}
						
					}
				}
				
				return {filter: filter, postFilter: postFilter, params: params}
			}
			
			var filter = {$or:[{$and:[]}]};
			var postFilter = {$or:[{$and:[]}]};
			var params = {};
			
			for(var fName in ffMap){
				var ffDesc = ffMap[fName];
				var fDesc = _constructSegFilter(ffDesc);
				if(fDesc.filter){
					if(ffDesc.andFilters.length > 0 || ffDesc.notFilters.length > 0){
						filter.$or[0].$and.push(fDesc.filter);
					} else {
						filter.$or.push(fDesc.filter);
					}
				}
				if(fDesc.postFilter){
					if(ffDesc.andFiltersLocal.length > 0 || ffDesc.notFiltersLocal.length > 0){
						postFilter.$or[0].$and.push(fDesc.postFilter);	
					} else {
						postFilter.$or.push(fDesc.postFilter);
					}
				}
				if(fDesc.params){
					JSB.merge(params, fDesc.params);
				}
			}
			
			// simplify filters
			if(filter.$or[0].$and.length == 0){
				filter.$or.splice(0, 1);
			} else if(filter.$or[0].$and.length == 1){
				filter.$or[0] = filter.$or[0].$and[0];
			}
			if(filter.$or.length == 0){
				filter = null;
			} else if(filter.$or.length == 1){
				filter = filter.$or[0];
			}
			
			if(postFilter.$or[0].$and.length == 0){
				postFilter.$or.splice(0, 1);
			} else if(postFilter.$or[0].$and.length == 1){
				postFilter.$or[0] = postFilter.$or[0].$and[0];
			}
			if(postFilter.$or.length == 0){
				postFilter = null;
			} else if(postFilter.$or.length == 1){
				postFilter = postFilter.$or[0];
			}
			
			//JSB.getLogger().debug(JSON.stringify(filter, null, 4));
			
			return {
				filter: filter,
				postFilter: postFilter,
				params: params
			};
		},
		
		getFilterArray: function(){
			return this.filterArr;
		},
		
		getFilters: function(){
			return this.filters;
		}
	}
}