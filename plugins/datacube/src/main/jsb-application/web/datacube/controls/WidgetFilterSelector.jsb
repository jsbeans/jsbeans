{
	$name: 'DataCube.Controls.WidgetFilterSelector',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		visible: false,
		owner: null,
		filterManager: null,
		filters: {},
		
		$constructor: function(owner, filterManager){
			$base();
			this.owner = owner;
			this.filterManager = filterManager;
			this.loadCss('WidgetFilterSelector.css');
			this.addClass('widgetFilterSelector');
			
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
		
		addFilter: function(fId){
			if(!this.filterManager){
				return;
			}
			var fDesc = this.filterManager.getFilters()[fId];
			if(fDesc){
				this.filters[fId] = fDesc;
				this.redraw();
			}
			
		},
		
		updateVisibility: function(){
			var filtersCount = Object.keys(this.filters).length;
			if(filtersCount > 0){
				if(!this.visible){
					this.getElement().css('height', 18);
					this.visible = true;
				} else {
					if(filtersCount == 1){
						this.getElement().css('height', 18);
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
			// remove unexisted filters
			var globalFilters = this.filterManager.getFilters();
			var fidsToRemove = [];
			for(var fId in this.filters){
				if(!globalFilters[fId]){
					fidsToRemove.push(fId);
				}
			}
			for(var i = 0; i < fidsToRemove.length; i++){
				delete this.filters[fidsToRemove[i]];
			}

			this.getElement().empty();
			
			function _constructTag(fId){
				var fDesc = $this.filters[fId];
				var fName = fDesc.cubeField || fDesc.field;
				var fTag = $this.$('<div class="filterTag"></div>').attr('fId', fId);
				fTag.append('<div class="removeLine"></div>');
				fTag.append($this.$('<div class="field"></div>').text(fName).attr('title', fName));
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
				case '$in':
				case '$range':
					opSign = '&isin;';
					break;
				case '$nin':
					opSign = '&notin;';
					break;
				default:
					opSign = ':';
				}
				fTag.append('<div class="op">'+opSign+'</div>');

				var v = fDesc.value;
				if(fDesc.op == '$range' && JSB.isArray(fDesc.value)){
					v = '[' + fDesc.value[0] + ' - ' + fDesc.value[1] + ']';
				} else if(JSB.isArray(fDesc.value)){
					v = JSON.stringify(fDesc.value);
				} else if(JSB().isDate(fDesc.value)){
				    v = fDesc.value.toDateString();
				}
				var valElt = $this.$('<div class="value"></div>').text('' + v).attr('title', '' + v);
				if(JSB.isString(fDesc.value)){
					valElt.addClass('string');
				}
				fTag.append(valElt);
				return fTag;
			}
			
			for(var fId in this.filters){
				(function(fId){
					var fTag = _constructTag(fId);
					$this.append(fTag);
					fTag.click(function(){
						fTag.remove();
						$this.filterManager.removeFilter(fId);
						JSB.defer(function(){
                            $this.publish('DataCube.filterChanged', {initiator: $this, manager: $this.filterManager, type: 'changeFilterType', fItemIds: [fId]});
                        });
					});
				})(fId);
			}

			this.updateVisibility();
		}
	}
}