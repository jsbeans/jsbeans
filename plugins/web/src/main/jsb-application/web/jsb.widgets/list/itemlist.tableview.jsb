JSB({
	name:'JSB.Widgets.ItemList.TableView',
	parent: 'JSB.Widgets.ItemList.View',
//	require:['JQuery', 'JQuery.UI.Interactions'],
	
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			
			this.loadCss('itemlist.tableview.css');
			
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
				JSB.defer(function(){
					self.updateHeader();
				}, 0, '_updateHeader');
			});
		},
		
		options: {
			header: false
		},
		columns: [{key: '__main__', opts:{}}],
		
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
			this.updateHeader();
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
				this.list.prepend(tvh);
				tr = this.$('<div class="tableViewHeaderRow"></div>');
				tvh.append(tr);
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
						col.opts.onCreateCellHeader.call(this, th);
					}
				}
				
			}
			
			// update sizes
			var lis = this.container.find('> li');
			if(lis.length > 0){
				var fli = this.$(lis[0]);
				var cells = fli.find('> *');
				for(var i = 0; i < cells.length; i++){
					(function(cell, i){
						self.$(cell).resize(function(){
							self.$(hCells[i]).width(self.$(cell).outerWidth());
						});
						self.$(hCells[i]).width(self.$(cell).outerWidth());
											
					})(cells[i], i);
				}
			}
			
			this.container.resize(function(){
				tvh.width(self.container.width());
			});
			
			tvh.resize(function(){
				self.list.find('> ._dwp_scrollBox').css({
					top: tvh.height()
				});
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
			
			this.updateHeader();
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
});
