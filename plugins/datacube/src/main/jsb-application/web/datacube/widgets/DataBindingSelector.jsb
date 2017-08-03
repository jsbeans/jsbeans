{
	$name: 'JSB.DataCube.Widgets.DataBindingSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.DataCube.Providers.DataProviderRepository',
	           'JSB.Widgets.RendererRepository',
	           'JSB.Widgets.ToolManager',
	           'JSB.Widgets.Button'],
	
	$client: {
		source: null,
		dataScheme: null,
		ready: false,
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('dataBindingSelector');
			this.loadCss('DataBindingSelector.css');
			this.wrapper = opts.wrapper;
			
			var removeButton = new Button({
				cssClass: 'roundButton btn10 btnDelete',
				tooltip: 'Удалить',
				onClick: function(evt){
					evt.stopPropagation();
					$this.dataScheme = null;
					$this.removeClass('filled');
					if($this.options.onChange && $this.ready){
						$this.options.onChange.call($this);
					}
				}
			});

			var refreshButton = new Button({
				cssClass: 'roundButton btn10 btnRefresh',
				tooltip: 'Обновить схему данных',
				onClick: function(evt){
					evt.stopPropagation();
					$this.setSource($this.source);
				}
			});
			
			this.append(removeButton);
			this.append(refreshButton);
			
			if(!this.options.scope){
				this.addClass('refreshable');
				this.attr('title', 'Перетащите сюда источник');
				this.placeholderElt = this.$('<div class="placeholder">Перетащите сюда источник</div>');
				this.append(this.placeholderElt);
				this.bindingElt = this.$('<div class="binding"></div>');
				this.append(this.bindingElt);
				
				this.refreshElt = this.$('<div class="refresh">Загрузка схемы данных<div class="icon"></div></div>');
				this.append(this.refreshElt);

				
				this.setupDroppable();
				if(this.options.value){
					this.setDataScheme(this.options.value);
				}
			} else {
				this.addClass('selectable');
				this.attr('title', 'Выберите поле');
				this.placeholderElt = this.$('<div class="placeholder">Выберите поле</div>');
				this.append(this.placeholderElt);
				this.bindingElt = this.$('<div class="binding"></div>');
				this.append(this.bindingElt);
				this.getElement().click(function(evt){
					$this.showTool(evt);
				});
				if(this.options.value){
					var val, path;
					if(JSB.isString(this.options.value)){
						path = this.options.value;
						val = this.wrapper.applyBindingRelativePath(this.options.scope, path);
					} else {
						val = this.options.value;
						path = this.wrapper.getBindingRelativePath(this.options.scope, val);
					}
					this.setField(path, val);
				}
			}
			this.ready = true;
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
		
		setDataScheme: function(ds, source, callback){
			$this.dataScheme = ds;
			var ready = $this.ready;
			
			function setupSource(source){
				$this.source = source;
				$this.bindingElt.empty().append(RendererRepository.createRendererFor(source, {showCube: true}).getElement());
				$this.addClass('filled');
				
				if($this.options.onChange && ready){
					$this.options.onChange.call($this);
				}
			}
			
			if(source){
				setupSource(source);
				if(callback){
					callback.call($this);
				}
			} else {
				this.wrapper.getWidgetEntry().server().getDataSchemeSource(ds, function(source){
					setupSource(source);
					if(callback){
						callback.call($this);
					}

				});
			}
		},
		
		setSource: function(entry){
			var source = null;
			if(JSB.isInstanceOf(entry,'JSB.DataCube.Model.Slice')){
				// add slice
				source = entry;
			} else {
				var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
				if(dpInfo){
					source = entry;
				}
				
			}
			$this.addClass('refreshing');
			this.wrapper.getWidgetEntry().server().combineDataScheme(source, function(dataScheme, fail){
				if(fail){
					$this.removeClass('refreshing');
				} else {
					$this.setDataScheme(dataScheme, source, function(){
						$this.removeClass('refreshing');
					});
				}
			});
		},
		
		setField: function(field, binding){
			this.bindingElt.empty().text(field);
			this.addClass('filled');
			
			$this.dataScheme = binding;
			if($this.options.onChange && $this.ready){
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