/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.ItemList.TableView',
	$parent: 'JSB.Widgets.ItemList.View',
	$require:['jQuery.UI.Resizable',
	          'css:itemList.tableView.css'],
	
	$client: {
		options: {
			header: false,
			headerOverflow: false,
			headerCellMinSize: 10
		},
		columns: [], //[{key: '__main__', opts:{}}],
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.columns.push({key: '__main__', opts: opts});
			
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
			
			var self = this, hTable = null;
			var tvh = this.list.find('.tableViewHeader');
			if(tvh.length === 0){
				tvh = this.$('<div class="tableViewHeader"><table class="headerTable" cellpadding="0" cellspacing="0"><colgroup></colgroup><thead><tr class="tableViewHeaderRow"></tr></thead></table></div>');
				hTable = tvh.find('> .headerTable');
				this.list.getElement().prepend(tvh);
				tvh.resize(function(){
					$this.list.scrollBox.getElement().css('top', tvh.height());
				});
				
				$this.container.resize(function(){
					hTable.css('width', $this.container.width());
					$this.updateHeaderCols();
				});
				
				$this.subscribe('JSB.Widgets.ItemList.scroll', function(sender, msg, params){
					if(sender != $this.list){
						return;
					}
					
					hTable.css('margin-left', params.x);
				});
			} else {
				hTable = tvh.find('> .headerTable');	
			}
			

			var headerRow = tvh.find('.tableViewHeaderRow');
			var headerColGroup = tvh.find('colgroup');
			
			var hCells = headerRow.find('> .cellHeader');
			var hCols = headerColGroup.find('> col');
			if(hCells.length != this.columns.length){
				hCells.remove();
				hCols.remove();
				
				// fill
				for(var i = 0; i < this.columns.length; i++){
					var col = this.columns[i];
					var th = this.$('<th class="cellHeader"></th>');
					th.attr('key', col.key);
					headerRow.append(th);
					
					var colEl = this.$('<col></col>');
					colEl.attr('key', col.key);
					headerColGroup.append(colEl);
					
					if(col.opts && col.opts.onCreateCellHeader){
						col.opts.onCreateCellHeader.call(this, th, col.opts);
					} else {
						th.text(col.key);
					}
				}
			}
			
			$this.list.scrollBox.getElement().css({
				top: tvh.height()
			});
			
			$this.updateHeaderCols();
			
/*			
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
						// alsoResize: hTable
					});
				}
			}
*/			
/*			
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
*/			
		},
		
		updateHeaderCols: function(){
			var tvh = this.list.find('.tableViewHeader');
			var headerCols = tvh.find('colgroup > col');
			var headerCells = tvh.find('.cellHeader');
			var lis = this.container.find('> li');
			if(lis.length == 0){
				return;
			}
			
			// set header width
			var count = lis[0].children.length;
			for(var i = 0; i < count; i++){
				if(headerCols.length <= i){
					break;
				}
				(function(i){
					var cellWidth = $this.$(lis[0].children[i]).outerWidth();
					
					var hCell = $this.$(headerCells[i]);
					hCell.outerWidth(cellWidth);
					JSB.defer(function(){
						if(hCell.outerWidth() != cellWidth){
							$this.$(lis[0].children[i]).outerWidth(hCell.outerWidth());
						}
					});
				})(i);
			}
		},
		
		update: function(){
			if(!this.isActive()){
				return;
			}
			
			this.container.find('> li').each(function(){
				$this.syncItem($this.$(this));
			});
			
			$this.updateHeader();
		},
		
		updateItem: function(key){
			if(!this.isActive()){
				return;
			}
			
			this.container.find('> li[key="'+key+'"]').each(function(){
				$this.syncItem($this.$(this), true);
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
		
		syncItem: function(wrapper, bForce){
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
			
			if(bNeedUpdate || bForce){
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