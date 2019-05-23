/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Controls.WidgetFilterSelector',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$require: ['DataCube.Controls.FilterTag',
		           'css:WidgetFilterSelector.css'],
		
		visible: false,
		owner: null,
		filterManager: null,
		filters: {},
		filterTags: {},
		
		$constructor: function(owner, filterManager){
			$base();
			this.owner = owner;
			this.filterManager = filterManager;
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
			var bFiltersEnabled = this.getOwner() && this.getOwner().getWidget() && this.getOwner().getWidget().getContext().find('common > showFilters').checked();
			
			if(filtersCount > 0 && bFiltersEnabled){
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
			
			for(var fId in $this.filterTags){
				$this.filterTags[fId].destroy();
			}
			this.getElement().empty();
			
			
			for(var fId in this.filters){
				(function(fId){
					var fDesc = $this.filters[fId];
					var fTag = new FilterTag(fDesc, {
						not: fDesc.type == '$not',
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
					
					$this.append(fTag);
				})(fId);
			}

			this.updateVisibility();
		}
	}
}