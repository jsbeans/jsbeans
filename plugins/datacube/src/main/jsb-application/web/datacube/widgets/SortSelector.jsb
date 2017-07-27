{
	$name: 'JSB.DataCube.Widgets.SortSelector',
	$parent: 'JSB.Widgets.Control',
	$require: 'JSB.Widgets.ToolManager',
	
	$client: {
		sortFields: null,
		sortDir: null,
		sortField: null,
		
		$constructor: function(sortFields, opts){
			$base(opts);
			this.sortFields = sortFields;
			this.loadCss('SortSelector.css');
			this.addClass('sortSelector');
			
			this.field = this.$('<div class="field"></div>');
			this.append(this.field);
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.icon.click(function(){
				function toggleOrder(){
					if($this.sortDir === null || $this.sortDir == -1){
						$this.sortDir = 1;
					} else {
						$this.sortDir = -1;
					}
					if($this.options.onChange){
						var sortQuery = {};
						sortQuery[$this.sortField] = $this.sortDir;
						$this.options.onChange.call($this, sortQuery);
					}
					$this.updateState();
				}
				
				if(!$this.sortField){
					if($this.sortFields.length == 1){
						$this.sortField = $this.sortFields[0];
						toggleOrder();
					} else {
						// TODO: drop down list
						$this.showDropList(function(){
							toggleOrder();
						});
					}
				} else {
					toggleOrder();
				}
				
			});
			
			this.field.click(function(){
				$this.showDropList(function(){
					if($this.options.onChange){
						var sortQuery = {};
						sortQuery[$this.sortField] = $this.sortDir;
						$this.options.onChange.call($this, sortQuery);
					}
					$this.updateState();
				});
			});
		},
		
		showDropList: function(callback){
			ToolManager.activate({
				id: '_dwp_droplistTool',
				cmd: 'show',
				data: $this.sortFields,
				target: {
					selector: $this.getElement(),
					dock: 'bottom'
				},
				callback: function(key, item, evt){
					$this.sortField = key;
					if(callback){
						callback.call($this);
					}
				}
			});
		},
		
		clear: function(){
			$this.sortDir = null;
			$this.sortField = null;
			$this.updateState();
		},
		
		updateState: function(){
			if($this.sortDir === null){
				$this.removeClass('asc');
				$this.removeClass('desc');
			} else if($this.sortDir == 1){
				$this.addClass('asc');
				$this.removeClass('desc');
			} else {
				$this.addClass('desc');
				$this.removeClass('asc');
			}
			
			if($this.sortFields.length > 1 && $this.sortField){
				$this.addClass('showField');
				$this.field.text($this.sortField);
			} else {
				$this.removeClass('showField');
			}
		}
		

	}
}