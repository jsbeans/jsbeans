{
	$name: 'DataCube.Controls.FilterEntry',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.PrimitiveEditor', 'JSB.Widgets.ToolManager', 'JSB.Widgets.ComboBox'],
	
	$client: {
		filterField: null,
		filterFieldType: null,
		defaultFilterValue: null,
		defaultFilterOp: null,
		curOp: null,
		fixedArea: null,
		fixedFilters: {},
		
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
			
			$jsb.loadCss('FilterEntry.css');
			this.addClass('filterEntry');
			
			this.editor = new PrimitiveEditor({
				onChange: function(){
					JSB.defer(function(){
						$this.update();
					}, 1500, 'filterUpdate_' + $this.getId());
				}
			});
			
			this.append(this.editor);
			
			this.booleanEditor = new ComboBox({
				items: [{key: 'any', element:'Любое'},{key:'true', element:'true'}, {key:'false', element:'false'}],
				value: 'any',
				onChange: function(){
					$this.update();
				}
			});
			this.append(this.booleanEditor);
			
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
			
			this.fixBtn = this.$('<div class="fixBtn" title="Зафиксировать фильтр"></div>');
			this.append(this.fixBtn);
			
			this.fixBtn.click(function(){
				if($this.options.onFix){
					$this.options.onFix.call($this, $this.getFilter());
				}
			});
			
		},
		
		setOp: function(op){
			this.opSelector.empty();
			this.opSelector.append(this.opMap[op]);
			this.curOp = op;
		},
		
		setField: function(field, type, val, op){
			if(this.filterField == field && this.filterFieldType == type && this.defaultFilterValue == val && this.defaultFilterOp == op){
				return;
			}
			this.filterField = field;
			this.filterFieldType = type;
			this.defaultFilterValue = val;
			this.defaultFilterOp = op;
			this.classed('showOp', this.filterFieldType != 'string' && this.filterFieldType != 'boolean');
			this.classed('showEditor', this.filterFieldType != 'boolean');
			this.classed('showBoolean', this.filterFieldType == 'boolean');
			this.editor.setData(val);
			this.setOp(op);
		},
		
		allowFix: function(bFix){
			this.classed('allowFix', bFix);
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
			
			if(this.filterFieldType == 'integer' 
				|| this.filterFieldType == 'float' 
				|| this.filterFieldType == 'double'){
				
				var val = $this.editor.getData().getValue();
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
			} else if(this.filterFieldType == 'boolean'){
				var val = $this.booleanEditor.getData().key;
				// use ilike
				if(val == 'true'){
					filter['$eq'] = {'$const': true};
				} else if(val == 'false'){
					filter['$eq'] = {'$const': false};
				}
			} else if(this.filterFieldType == 'string'){
				var val = $this.editor.getData().getValue();
				// use ilike
				if(val && val.length > 0){
					filter['$ilike'] = {'$const': '%' + val + '%'};
				}
			}
			return fieldFilter;
		},
/*		
		addFixedFilter: function(fDesc){
			if(this.fixedFilters[fDesc.id]){
				return;
			}
			this.fixedFilters[fDesc.id] = fDesc;
			this.updateFixedFilters();
			
			
			var fixedTag = constructFixedTag(fDesc);
			this.fixedArea.append(fixedTag);
		},
		
		removeFixedFilter: function(fId){
			if(this.fixedFilters[fId]){
				delete this.fixedFilters[fId];
				this.updateFixedFilters();
			}
		},
		
		constructFixedTag: function(fDesc){
			return this.$('<div class="fixedTag"></div>').text(fDesc.value);
		},

		
		updateFixedFilters: function(){
			if(Object.keys(this.fixedFilters).length > 0){
				// has filters
				if(!this.fixedArea){
					this.fixedArea = this.$('<div class="fixedArea"></div>');
					this.append(this.fixedArea);
				}
				
				// remove missing filters
				
				
				// add new filters

				
				
			} else {
				// no filters
				if(this.fixedArea){
					this.fixedArea.remove();
				}
			}
		},
*/		
		update: function(){
			if($this.options.onChange){
				$this.options.onChange.call($this, $this.getFilter());
			}
		}
	}
}