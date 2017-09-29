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
			$this.itemsListBox = new ListBox({
				onSelectionChanged: function(key, item){
					$this.data.callback.call($this, {scheme: item.scheme, value: item.value, context: item.context});
					$this.close();
				}
			});
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
				var catArr = Object.keys(items);
				catArr.sort(function(a, b){
					if(b == 'Поля куба'){
						return 1;
					} else if(a == 'Поля куба'){
						return -1;
					}
					if(b == 'Столбцы среза'){
						return 1;
					} else if(a == 'Столбцы среза'){
						return -1;
					}
					return 0;
				});
				for(var i = 0; i < catArr.length; i++){
					(function(cat){
						var catEntry = $this.$('<div class="entry"></div>');
						catEntry.text(cat);
						catEntry.attr('key', cat);
						
						catEntry.click(function(){
							$this.selectCategory(cat);
						});
						
						$this.categoriesElt.append(catEntry);
					})(catArr[i]);
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
				if(item == '#fieldName' || item == '$fieldName'){
					var editor = $this.data.data.editor;
					var slice = editor.options.slice;
					var fields = editor.options.cubeFields;
					var fArr = Object.keys(fields);
					fArr.sort(function(a, b){
						return a.localeCompare(b);
					});
					for(var j = 0; j < fArr.length; j++){
						var fName = fArr[j];
						var fType = fields[fName];
						$this.itemsListBox.addItem({
							key: fName,
							value: fName,
							scheme: item,
							element: `#dot
								<div class="field" title="{{=fName}}">
									<div class="icon"></div>
									<div class="name">{{=fName}}</div>
									<div class="type">{{=fType.toLowerCase()}}</div>
								</div>
							`
						});
					}
				} else if(item == '#outputFieldName' || item == '$fieldExpr') {
					var editor = $this.data.data.editor;
					var colMap = editor.combineColumns();
					for(var qName in colMap){
						var colArr = colMap[qName];
						for(var j = 0; j < colArr.length; j++){
							var fName = colArr[j];
							$this.itemsListBox.addItem({
								key: fName + '_' + qName,
								scheme: item,
								value: fName,
								context: qName,
								element: `#dot
									<div class="column" title="{{=fName}}">
										<div class="icon"></div>
										<div class="name">{{=fName}}</div>
										<div class="qname">{{=qName.toLowerCase()}}</div>
									</div>
								`
							});
						}
					}
				} else {
					$this.itemsListBox.addItem({
						value: item.item,
						key: item.item,
						scheme: item.item,
						element: `#dot
							<div class="item" scheme="{{=item.item}}">
								<div class="title">{{=item.title?item.title:item.item}}</div>
								<div class="desc">{{=item.desc}}</div>
							</div>
						`
					});
				}
			}
		},
		
		
	}
}