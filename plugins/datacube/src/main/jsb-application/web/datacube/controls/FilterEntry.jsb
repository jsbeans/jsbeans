/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Controls.FilterEntry',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.PrimitiveEditor', 
	           'JSB.Widgets.ToolManager', 
	           'JSB.Widgets.ComboBox',
	           'css:FilterEntry.css'],
	
	$client: {
		filterParam: null,
		filterParamType: null,
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
		
		setField: function(field, type, val, op, param, paramType){
			if(this.filterField == field 
				&& this.filterFieldType == type 
				&& this.defaultFilterValue == val 
				&& this.defaultFilterOp == op 
				&& this.filterParam == param
				&& this.filterParamType == paramType){
				return;
			}
			this.filterField = field;
			this.filterFieldType = type;
			this.defaultFilterValue = val;
			this.defaultFilterOp = op;
			this.filterParam = param;
			this.filterParamType = paramType;
			this.classed('showOp', this.filterFieldType != 'string' && this.filterFieldType != 'boolean' && !this.filterParam);
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
			
			var filter = {};
			var valType = this.filterFieldType || this.filterParamType;
			
			if(valType == 'integer'
				||valType == 'uint'
				|| valType == 'float'
				|| valType == 'double'){
				
				var val = $this.editor.getData().getValue();
				// use op
				if(val && val.length > 0){
					switch(valType){
					case 'uint':
					case 'integer':
						val = parseInt(val);
						break;
					case 'float':
					case 'number':
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
						if($this.filterParam){
							filter = val;
						} else {
							filter[$this.curOp] = {'$const': val};
						}
					}
				}
			} else if(valType == 'boolean'){
				var val = $this.booleanEditor.getData().key;
				// use ilike
				if(val == 'true'){
					if($this.filterParam){
						filter = true;
					} else {
						filter['$eq'] = {'$const': true};
					}
				} else if(val == 'false'){
					if($this.filterParam){
						filter = false;
					} else {
						filter['$eq'] = {'$const': false};
					}
				}
			} else if(valType == 'string'){
				var val = $this.editor.getData().getValue();
				// use ilike
				if(val && val.length > 0){
					if($this.filterParam){
						filter = val;
					} else {
						filter['$ilike'] = {'$const': '%' + val + '%'};
					}
				}
			}
			
			var fieldFilter = {};
			if($this.filterParam){
				fieldFilter[$this.filterParam] = filter;
			} else {
				fieldFilter[$this.filterField] = filter;
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