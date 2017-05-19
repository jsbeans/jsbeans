{
	$name:'JSB.Widgets.ItemList.TableView',
	$parent: 'JSB.Widgets.ItemList.View',
	$require:['JQuery.UI.Resizable'],
	
	$client: {
		options: {
			header: false,
			headerOverflow: false,
			headerCellMinSize: 10
		},
		columns: [{key: '__main__', opts:{}}],
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			
			this.loadCss('itemList.tableView.css');
			
			this.subscribe(['JSB.Widgets.ItemList.insertItem', 'JSB.Widgets.ItemList.deleteItem','JSB.Widgets.ItemList.clear'], function(sender, msg, params){
				if(self.list !== sender){
					return;
				}
				
				if(!self.isActive()){
					return;
				}
				
				if(msg == 'JSB.Widgets.ItemList.insertItem'){
					var wrapper = params.item.getElement().parent();
					self.syncItem(wrapper);
				}
				
			});
			
			this.subscribe(['JSB.Widgets.ItemList.addItem'], function(sender, msg, params){
				if(self.list !== sender){
					return;
				}
				if(!self.isActive()){
					return;
				}
				
				var wrapper = params.item.getElement().parent();
				self.syncItem(wrapper);
				JSB().defer(function(){
					$this.updateHeader();
				}, 300, 'itemList.updateHeader' + $this.getId());
			});
		},
		
		addColumn: function(key, opts){
			this.columns.push({
				key: key,
				opts: opts
			});
			this.update();
		},
		
		deleteColumn: function(key){
			for(var i = 0; i < this.columns.length; i++ ){
				if(this.columns[i].key == key){
					this.columns.splice(i, 1);
					this.update();
					break;
				}
			}
		},
		
		insertColumn: function(idx, key, opts){
			this.columns.splice(idx, 0, {
				key: key,
				opts: opts
			});
			this.update();
		},
		
		activate: function(container){
			$base(container);
			this.list.addClass('tableView');
			
			// append header
			JSB().defer(function(){
				$this.updateHeader();
			}, 300);
		},
		
		deactivate: function(){
			this.list.removeClass('tableView');
			this.container.find('> li > .cell').remove();	// TODO: remove internal beans
			$base();
			
			// hide header
			var tvh = this.list.find('.tableViewHeader');
			if(tvh.length > 0){
				tvh.addClass('hidden');
			}
		},
		
		updateHeader: function(){
			if(!this.options.header){
				return;
			}
			
			var self = this;
			var tvh = this.list.find('.tableViewHeader');
			var tr = null;
			if(tvh.length === 0){
				tvh = this.$('<div class="tableViewHeader"></div>');
				tr = this.$('<div class="tableViewHeaderRow"></div>');
				tvh.append(tr);				
				this.list.horizontalScrollBox.getElement().find('> ._dwp_scrollPane').prepend(tvh);
			} else {
				tr = tvh.find('> .tableViewHeaderRow');
			}
			
			var hCells = tr.find('> .cellHeader');
			if(hCells.length != this.columns.length){
				hCells.remove();
				
				// fill
				for(var i = 0; i < this.columns.length; i++){
					var col = this.columns[i];
					var th = this.$('<div class="cellHeader"></div>');
					th.attr('key', col.key);
					tr.append(th);
					
					if(col.opts && col.opts.onCreateCellHeader){
						col.opts.onCreateCellHeader.call(this, th, col.opts);
					}
				}
			}
			
			$this.list.horizontalScrollBox.getElement().find('._dwp_scrollBox').css({
				top: tvh.height()
			});
			
			function findCol(lis, i){
				var col = {
						cells: [],
						isEmpty: true
					};
					
					for(var j = 0; j < lis.length; j++){
						col.cells.push($this.$(lis[j].children[i]));
						if(lis[j].children[i].innerHTML != '')
							col.isEmpty = false;
					}
						
					return col;
			}
			
			var lis = this.container.find('> li');
			if(lis.length > 0){
				// set header width
				var count = lis[0].children.length;
				var cols = [];
				
				for(var i = 0; i < count; i++){
					var col = findCol(lis, i);
					cols.push(col);
				}
				
				for(var i = 0; i < count; i++){
					(function(i){
						self.$(hCells[i]).resize(function(){
							for(var s = 0; s < cols[i].cells.length; s++){
								cols[i].cells[s].outerWidth(self.$(hCells[i]).outerWidth());
							}
						});	
						
						for(var j = 0; j < cols[i].cells.length; j++)
							cols[i].cells[j].outerWidth(self.$(hCells[i]).outerWidth() - 1);
					})(i);
					
					// resizable
					if(this.$(hCells[i]).resizable( "instance" ) != undefined)
						this.$(hCells[i]).resizable("destroy");
					
					this.$(hCells[i]).resizable({
						autoHide: true,
						handles: "e",
						alsoResize: tvh
					});
				}
			}
			
			if(this.options.headerOverflow)
				this.container.resize(function(){					
					if($this.list.horizontalScrollBox.getElement().find('.iScrollHorizontalScrollbar').is(":visible")){
						$this.list.horizontalScrollBox.getElement().find('._dwp_scrollBox:not(.horizontalScrollPane)').css({
							padding: '0 0 10px 0'
						});
						$this.list.horizontalScrollBox.getElement().find('._dwp_scrollPane.horizontalScrollPane').css({
							height: 'calc(100% - 10px)'
						});
					}else{
						$this.list.horizontalScrollBox.getElement().find('._dwp_scrollBox:not(.horizontalScrollPane)').css({
							padding: '0'
						});
						$this.list.horizontalScrollBox.getElement().find('._dwp_scrollPane.horizontalScrollPane').css({
							height: '100%'
						});
					}
				});
			
			tvh.resize(function(){
				$this.list.horizontalScrollBox.getElement().find('._dwp_scrollPane').width(tvh.width());
			});
		},
		
		update: function(){
			var self = this;
			if(!this.isActive()){
				return;
			}
			
			this.container.find('> li').each(function(){
				self.syncItem(self.$(this));
			});
			
			$this.updateHeader();
		},
		
		setColumnOpts: function(key, opts){
			if(!key)
				return;
			
			for(var i in this.columns)
				if(this.columns[i].key == key){
					for(var j in opts)
						this.columns[i].opts[j] = opts[j];
					
					break;
				}
		},
		
		syncItem: function(wrapper){
			var cells = wrapper.find('> *');

			var bNeedUpdate = false;
			
			if(cells.length == this.columns.length){
				for(var i = 0; i < this.columns.length; i++ ){
					var col = this.columns[i];
					var cell = this.$(cells[i]);
					if(cell.is('.cell')){
						// cell
						var cellKey = cell.attr('key');
						if(cellKey == col.key){
							continue;	// cells are equal
						}
					} else {
						// main
						if(col.key == '__main__'){
							continue;	// cells are equal
						}
					}
					bNeedUpdate  = true;
					break;
				}
			} else {
				bNeedUpdate = true;
			}
			
			if(bNeedUpdate){
				// clear all cells except main
				wrapper.find('> .cell').remove(); // TODO: remove all injected beans
				var bWasMain = false;
				cells = wrapper.find('> *');
				for(var i = 0; i < this.columns.length; i++ ){
					var col = this.columns[i];
					var cell = this.$(cells[i]);
					
					if(col.key == '__main__'){
						bWasMain = true;
					} else {
						var cellElt = this.$('<div class="cell"></div>');
						cellElt.attr('key', col.key);
						
						if(bWasMain){
							wrapper.append(cellElt);
						} else {
							cell.before(cellElt);
						}
						if(col.opts && col.opts.onCreateCell){
							var item = wrapper.find('> ._dwp_listItem').jsb();
							col.opts.onCreateCell.call(this, item, cellElt);
						}
						cells = wrapper.find('> *');
					}
				}
			}
		}
	}
}