{
	$name: 'DataCube.Controls.FilterTag',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$constructor: function(fDesc, opts){
			$base(opts);
			$jsb.loadCss('FilterTag.css');
			this.addClass('filterTag');
			if(opts && opts.not){
				this.addClass('not');
			}
			
			var fTag = $this.getElement();
			if(opts && opts.id){
				fTag.attr('fId', opts.id);
			}
			var removeSelector = null;
			
			fTag.append('<div class="removeLine"></div>');
			
			if(fDesc.op == '$group'){
				fTag.addClass('group');
				var groupName = $this.$('<div class="name"></div>').text(fDesc.sender.getName());
				var groupCount = $this.$('<div class="count"></div>').text(fDesc.items.length);
				fTag.append(groupName);
				fTag.append(groupCount);
				removeSelector = groupName;
			} else {
				var fName = fDesc.cubeField || fDesc.field;
				var fieldElt = $this.$('<div class="field"></div>').text(fName).attr('title', fName);
				removeSelector = fieldElt;
				fTag.append(fieldElt);
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
			}
			
			$this.getElement().on({
				click: function(evt){
					evt.stopPropagation();
					if(opts && opts.onRemove){
						opts.onRemove.call(this);
					}
				}
			});
				
		}
	}
}