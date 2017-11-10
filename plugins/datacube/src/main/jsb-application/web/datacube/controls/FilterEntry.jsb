{
	$name: 'DataCube.Controls.FilterEntry',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.PrimitiveEditor', 'JSB.Widgets.ToolManager'],
	
	$client: {
		filterField: null,
		filterFieldType: null,
		curOp: null,
		
		opMap: {
			'$eq': '=',
			'$lt': '<',
			'$lte': '&le;',
			'$gt': '>',
			'$gte': '&ge;',
			'$ne': '&ne;'
		},
		
		dropList: [{
			key: '$eq',
			element: '='
		},{
			key: '$lt',
			element: '<'
		},{
			key: '$lte',
			element: '&le;'
		},{
			key: '$gt',
			element: '>'
		},{
			key: '$gte',
			element: '&ge;'
		},{
			key: '$ne',
			element: '&ne;'
		}],
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('FilterEntry.css');
			this.addClass('filterEntry');
			
			this.editor = new PrimitiveEditor({
				onChange: function(){
					JSB.defer(function(){
						$this.update();
					}, 600, 'filterUpdate_' + $this.getId());
				}
			});
			
			this.append(this.editor);
			
			this.opSelector = this.$('<div class="opSelector"></div>');
			this.opSelector.click(function(){
				// show op list
				ToolManager.activate({
					id: '_dwp_droplistTool',
					cmd: 'show',
					data: $this.dropList,
					target: {
						selector: $this.opSelector,
						dock: 'bottom'
					},
					callback: function(key, item, evt){
						$this.setOp(key);
						$this.update();
					}
				});
			});
			this.append(this.opSelector);
			this.setOp('$eq');
		},
		
		setOp: function(op){
			this.opSelector.empty();
			this.opSelector.append(this.opMap[op]);
			this.curOp = op;
		},
		
		setField: function(field, type){
			if(this.filterField == field && this.filterFieldType == type){
				return;
			}
			this.filterField = field;
			this.filterFieldType = type;
			this.classed('showOp', this.filterFieldType != 'string');
			this.editor.setData('');
		},
		
		setFocus: function(){
			JSB.defer(function(){
				$this.editor.setFocus();	
			});
		},
		
		clear: function(){
			this.editor.setData('');
		},
		
		getFilter: function(){
			var fieldFilter = {};
			var filter = {};
			fieldFilter[$this.filterField] = filter;
			var val = $this.editor.getData().getValue();
			if(this.filterFieldType == 'integer' 
				|| this.filterFieldType == 'float' 
				|| this.filterFieldType == 'double' 
				|| this.filterFieldType == 'boolean'){
				// use op
				if(val && val.length > 0){
					switch($this.filterFieldType){
					case 'integer':
						val = parseInt(val);
						break;
					case 'float':
					case 'double':
						val = parseFloat(val);
						break;
					case 'boolean':
						if(val.toLowerCase() == 'true'){
							val = true;
						} else {
							val = false;
						}
						break;
					}
					if(!JSB.isNaN(val)){
						filter[$this.curOp] = {'$const': val};
					}
				}
			} else if(this.filterFieldType == 'string'){
				// use ilike
				if(val && val.length > 0){
					filter['$ilike'] = {'$const': '%' + val + '%'};
				}
			}
			return fieldFilter;
		},
		
		update: function(){
			if($this.options.onChange){
				$this.options.onChange.call($this, $this.getFilter());
			}
		}
	}
}