{
	$name: 'DataCube.Query.SchemePopupTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager', 'JSB.Widgets.Button', 'JSB.Widgets.ListBox'],
	$client: {
		
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'schemePopupTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					hideByEsc: true,
					cssClass: 'schemePopupToolWrapper'
				}
			});
		},
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('SchemePopupTool.css');
			this.addClass('schemePopupTool');
			
			$this.getElement().on({
				mousemove: function(){
					var editor = $this.data.data.editor;
					var entryKey = $this.data.data.entryKey;
					var entryType = $this.data.data.entryType;
					if(entryKey && entryType){
						var entryId = editor.getId() + '_' + entryType + '_' + entryKey;
						JSB.cancelDefer('DataCube.Query.SchemeEditor.over:' + entryId);
						JSB.cancelDefer('DataCube.Query.SchemeEditor.out:' + entryId);
					}
				},
				mouseover: function(){
					var editor = $this.data.data.editor;
					var entryKey = $this.data.data.entryKey;
					var entryType = $this.data.data.entryType;
					if(entryKey && entryType){
						var entryId = editor.getId() + '_' + entryType + '_' + entryKey;
						JSB.cancelDefer('DataCube.Query.SchemeEditor.over:' + entryId);
						JSB.cancelDefer('DataCube.Query.SchemeEditor.out:' + entryId);
					}
				},
				mouseout: function(){
					var editor = $this.data.data.editor;
					var entryKey = $this.data.data.entryKey;
					var entryType = $this.data.data.entryType;
					if(entryKey && entryType){
						var entryId = editor.getId() + '_' + entryType + '_' + entryKey;
						JSB.defer(function(){
							editor.selectHover(entryType, entryKey, false);
						}, 300, 'DataCube.Query.SchemeEditor.out:' + entryId);
					}
				}
			});
			
			// create categories
			$this.categoriesElt = $this.$('<div class="categories"></div>');
			$this.append($this.categoriesElt);
			
			// create item list
			$this.itemsListBox = new ListBox({});
			$this.itemsListBox.addClass('items');
			$this.append($this.itemsListBox);
		},
		
		
		update: function(){
			$this.categoriesElt.empty();
			
			
			var items = $this.data.data.items;
			
			if(JSB.isArray(items)){
				// hide categories
				$this.categoriesElt.addClass('hidden');
				
				$this.fillItems(items);
			} else {
				$this.categoriesElt.removeClass('hidden');
				
				// fill categories
				for(var cat in items){
					(function(cat){
						var catEntry = $this.$('<div class="entry"></div>');
						catEntry.text(cat);
						catEntry.attr('key', cat);
						
						catEntry.click(function(){
							$this.selectCategory(cat);
						});
						
						$this.categoriesElt.append(catEntry);
					})(cat);
				}
				
				var firstKey = $this.categoriesElt.find('> .entry:first-child').attr('key');
				$this.selectCategory(firstKey);
			}
			
		},
		
		selectCategory: function(cat){
			$this.categoriesElt.find('> .entry.selected').removeClass('selected');
			var entryElt = $this.categoriesElt.find('> .entry[key="'+cat+'"]');
			entryElt.addClass('selected');
			$this.fillItems($this.data.data.items[cat]);
		},
		
		fillItems: function(items){
			$this.itemsListBox.clear();
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				$this.itemsListBox.addItem({
					key: item.item,
					element: `#dot
						<div class="title">{{=item.title?item.title:item.item}}</div>
						<div class="desc">{{=item.desc}}</div>
					`
				});
			}
		},
		
		
	}
}