{
	name: 'JSB.Widgets.GridTable',
	parent: 'JSB.Widgets.Control',
	require: ['JSB.Widgets.ScrollBox', 'JQuery.UI.Resizable'],
	client: {
		constructor: function(opts){
			$base(opts);
			this.loadCss('grid.table.css');
			var self = this;
			var elt = this.getElement();
			elt.addClass('_dwp_gridTable');
			
			this.headerElem = this.$('<table class="tableHeader"></table>')
			this.append(this.headerElem);
			
			if(this.options.headerItems)
				this.setHeader();
			
			this.scrollBox = new ScrollBox(this.options);
			elt.append(this.scrollBox.getElement());
			
			this.rootElt = this.$('<table class="_dwp_gridTableContainer"></table>');
			this.scrollBox.append(this.rootElt);
			
			this.getElement().click(function(evt){
				if($this.$(evt.target).closest('tr'))
					$this.selectElem(evt);
			});
		},
		
		options: {
			isResizable: false,
			headerItems: null,
			selectMod: '',
			onSelectChange: function(){},
			emptyText: 'No items in table'
		},
		
		itemList: [],
		
		selectedItems: [],
		
		setHeader: function(header){
			var tr = this.$('<tr></tr>');
			
			if(header)
				this.options.headerItems = header;

			for(var el in this.options.headerItems){
				var item = this.$('<td class="tableHeader-el">' + this.options.headerItems[el] + '</td>');
				
				if(this.options.isResizable){
					if(item.resizable( "instance" ) != undefined)
						item.resizable("destroy");
					item.resizable({
						maxHeight: 1
					});
				}
				
				tr.append(item);
			}
			
			this.headerElem.append(tr);		
		},
		
		addItem: function(item){
			var self = this;
			
			if(this.noItemsElt){
				this.noItemsElt.removeClass('visible');
			}
			
			var tr = this.$('<tr></tr>');
			
			if(item.style)
				tr.addClass(item.style);
			
			if(this.options.headerItems != null)
				for(var el in this.options.headerItems){
					var td = this.$('<td></td>');
					td.append(item.data[el]);
					tr.append(td);
				}
			else
				for(var el in item.data){
					var td = this.$('<td></td>');
					td.append(item.data[el]);
					tr.append(td);
				}

			this.itemList.push(item);
			tr.attr('num', self.itemList.length - 1);
			this.rootElt.append(tr);
			
			
			var headers = this.find('.tableHeader-el');
			var content = this.rootElt.find('tr');
			
			if(this.options.isResizable)
				for(var i = 0; i< headers.length; i++)			
					this.$(headers[i]).resizable("option", "alsoResize", content.find('td:nth-child(' + (i+1) + ')'));
		},
		
		removeItems: function(keys){
			for(var el in keys)
				switch(typeof keys[el]){
					case 'number':
						this.rootElt.find('tr[num=' + keys[el] + ']').remove();		
						break;
					case 'string':
						// TODO
						break;
				}
			this.recountItems();
		},
		
		recountItems: function(){
			var items = this.rootElt.find('tr');
			
			for(var el in items)
				this.$(items[el]).attr('num', el);
		},
		
		getSelectedItems: function(){
			var selected = [];
			
			for(var i in this.selectedItems)
				selected.push(this.itemList[i]);
			
			return selected;
		},
		
		getSelectedItemsNumber: function(){
			return this.selectedItems.length;
		},
		
		clear: function(){
			this.itemList = [];
			this.rootElt.empty();
		},
		
		selectElem: function(evt){
			var self = this;
			var targetNum = $this.$(evt.target).closest('tr').attr("num");
			
			if(!targetNum){
				this.selectedItems = [];
				this.changeSelect();
				this.options.onSelectChange.call(this, this.getSelectedItems());
				return;
			}
			
			if(this.selectedItems.length){
				if(this.options.selectMod == 'multi'){
					if(evt.ctrlKey && !evt.shiftKey){
						this.selectedItems[targetNum] = true;
						this.changeSelect();
					} else
					if(evt.shiftKey && !evt.ctrlKey){
						var prev;
						for(var i = 0; i < targetNum; i++)
							if(this.selectedItems[i])
								prev = i;
						for(var i = prev; i <= targetNum; i++)
							this.selectedItems[i] = true;
						this.changeSelect();
					} else
					{
						this.selectedItems = [];
						this.selectedItems[targetNum] = true;
						this.changeSelect();
					}
				}else{
					this.selectedItems = [];
					this.selectedItems[targetNum] = true;
					this.changeSelect();
				}
			} else{
				if(this.options.selectMod == 'allPrew')
					for(var i = 0; i <= targetNum; i++)
						this.selectedItems[i] = true;
				else
					this.selectedItems[targetNum] = true;
				
				this.changeSelect();
			}
			
			this.options.onSelectChange.call(this, this.getSelectedItems());
		},
		
		changeSelect: function(){
			this.rootElt.find('tr').removeClass('selected');
			for(var i in this.selectedItems)
				this.find('tr[num=' + i + ']').addClass('selected');
		}
	}
}