{
	$name: 'JSB.DataCube.Widgets.DataBindingSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.DataCube.Providers.DataProviderRepository',
	           'JSB.Widgets.RendererRepository',
	           'JSB.Widgets.ToolManager'],
	
	$client: {
		dataScheme: null,
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('dataBindingSelector');
			this.loadCss('DataBindingSelector.css');
			this.wrapper = opts.wrapper;
			
			
			if(!this.options.scope){
				this.attr('title', 'Перетащите сюда источник');
				this.placeholderElt = this.$('<div class="placeholder">Перетащите сюда источник</div>');
				this.append(this.placeholderElt);
				this.bindingElt = this.$('<div class="binding hidden"></div>');
				this.append(this.bindingElt);
				
				this.setupDroppable();
			} else {
				this.addClass('selectable');
				this.attr('title', 'Выберите поле');
				this.placeholderElt = this.$('<div class="placeholder">Выберите поле</div>');
				this.append(this.placeholderElt);
				this.bindingElt = this.$('<div class="binding hidden"></div>');
				this.append(this.bindingElt);
				this.getElement().click(function(evt){
					$this.showTool(evt);
				});
				if(this.options.value){
					debugger;
					var path = this.wrapper.getBindingRelativePath(this.options.scope, this.options.value);
					this.setField(path, this.options.value);
				}
			}
		},
		
		setupDroppable: function(){
			this.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
								continue;
							}
							var entry = obj.getEntry();
							if(JSB.isInstanceOf(entry,'JSB.DataCube.Model.Slice')){
								return true;
							}
							var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
							if(dpInfo){
								return true;
							}
						}
						
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				over: function(evt, ui){
					if( !ui.helper.hasClass('accepted') ){
						ui.helper.addClass('accepted');
					}
					$this.getElement().addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					$this.getElement().removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					$this.getElement().removeClass('acceptDraggable');
					for(var i in d.get(0).draggingItems){
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
							continue;
						}
						$this.setSource(obj.getEntry());
						break;
					}
				}
			});
			
		},
		
		setSource: function(entry){
			this.bindingElt.empty().append(RendererRepository.createRendererFor(entry, {showCube: true}).getElement());
			this.placeholderElt.addClass('hidden');
			this.bindingElt.removeClass('hidden');
			if(JSB.isInstanceOf(entry,'JSB.DataCube.Model.Slice')){
				// add slice
				this.source = entry;
			} else {
				var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
				if(dpInfo){
					this.source = entry;
				}
				
			}
			
			this.wrapper.server().combineDataScheme(this.source, function(dataScheme, fail){
				if(fail){
					
				} else {
					$this.dataScheme = dataScheme;
					if($this.options.onChange){
						$this.options.onChange.call($this);
					}
				}
			});

		},
		
		setField: function(field, binding){
			this.bindingElt.empty().text(field);
			this.placeholderElt.addClass('hidden');
			this.bindingElt.removeClass('hidden');
			
			$this.dataScheme = binding;
			if($this.options.onChange){
				$this.options.onChange.call($this);
			}
		},
		
		prepareItems: function(type){
			var items = [];
			var scope = this.options.scope;
			
			function collectFields(desc, items, path){
				if(desc.type == 'array'){
					collectFields(desc.arrayType, items);
				} else if(desc.type == 'object'){
					for(var f in desc.record){
						var rf = desc.record[f];
						var curPath = (path ? path + '.' : '') + rf.field;
						var itemDesc = {
							key: curPath,
							element: $this.$('<div class="dataBindingField"></div>').text(rf.field),
							binding: rf,
							children: []
						}
						items.push(itemDesc);
						collectFields(rf, itemDesc.children, curPath);
					}
				}
			}
			
			collectFields(scope, items, '');
			return items;
		},
		
		showTool: function(evt){
			var items = [];
			ToolManager.activate({
				id: '_dwp_dropTreeTool',
				cmd: 'show',
				data: $this.prepareItems(),
				target: {
					selector: $this.getElement(),
					dock: 'bottom'
				},
				callback: function(key, item, evt){
					if(item){
						$this.setField(key, item.binding);
					}
					
				}
			});
		},
		
		isFilled: function(){
			return !JSB.isNull(this.dataScheme);
		},
		
		getDataScheme: function(){
			return this.dataScheme;
		}
		
	}
}