JSB({
	name:'JSB.Widgets.ItemList.TableView',
	parent: 'JSB.Widgets.ItemList.View',
	require: {},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			
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
			});
		},
		
		options: {},
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
			this.getSuperClass().activate.call(this, container);
			this.list.addClass('tableView');
		},
		
		deactivate: function(){
			this.list.removeClass('tableView');
			this.container.find('> li > .cell').remove();	// TODO: remove internal beans
			this.getSuperClass().deactivate.call(this);
		},
		
		update: function(){
			var self = this;
			if(!this.isActive()){
				return;
			}
			
			this.container.find('> li').each(function(){
				self.syncItem(self.$(this));
			});
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
							var item = wrapper.find('> ._dwp_listItem').jso();
							col.opts.onCreateCell.call(this, item, cellElt);
						}
						cells = wrapper.find('> *');
					}
				}
			}
		}
		
	}
});
