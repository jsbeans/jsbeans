{
	$name: 'DataCube.Widgets.FilterSelector',
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
			for(var i = 0; i < filterArr.length; i++){
				(function(fId){
					var fDesc = filters[fId];
					var fTag = $this.$('<div class="filterTag"></div>').attr('fId', fId);
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
					fTag.append($this.$('<div class="value"></div>').text('' + v).attr('title', '' + v));
					
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
					
					fContainerElt.append(fTag);
				})(filterArr[i].id);
			}
			this.updateVisibility();
		}
	}
}