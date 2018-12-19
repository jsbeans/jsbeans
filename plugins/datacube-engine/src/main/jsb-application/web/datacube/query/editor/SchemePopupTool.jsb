{
	$name: 'DataCube.Query.SchemePopupTool',
	$parent: 'JSB.Widgets.Tool',
	$require: [
	           'JSB.Widgets.ToolManager', 
	           'JSB.Widgets.Button', 
	           'JSB.Widgets.ListBox', 
	           'JSB.Widgets.PrimitiveEditor', 
	           'JSB.Widgets.RendererRepository',
	           'css:SchemePopupTool.css'],
	$client: {
		
		cubeFieldsCat: 'Поля источника',
		sliceFieldsCat: 'Поля среза',
		
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'schemePopupTool',
				jso: self,
				wrapperOpts: {
					exclusive: false, //'schemePopupTool',
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
			
			// add search box
			var searchBoxElt = $this.$('<div class="searchBox"></div>');
			$this.searchEditor = new PrimitiveEditor({
				onChange: function(str){
					$this.itemsListBox.setFilter(function(item){
						if(!str || str.length == 0){
							return true;
						}
						var strLc = str.toLowerCase();
						if((item.value && item.value.toLowerCase().indexOf(strLc) >= 0)||
						   (item.desc && item.desc.toLowerCase().indexOf(strLc) >= 0)||
						   (item.comment && item.comment.toLowerCase().indexOf(strLc) >= 0)){
							return true;
						}
						return false;
					});
				}
			});
			
			searchBoxElt.append($this.searchEditor.getElement());
			searchBoxElt.append('<div class="icon"></div>');
			$this.itemsListBox.getElement().prepend(searchBoxElt);

			
			$this.subscribe('DataCube.Query.SchemeEditor.selected', function(sender, msg, params){
				var editor = $this.data.data.editor;
				var entryKey = $this.data.data.entryKey;
				var entryType = $this.data.data.entryType;
				if(sender == editor && params.entryType == entryType && params.entryKey == entryKey && !params.selected){
					$this.close();
				}
			});
		},
		
		update: function(){
			$this.categoriesElt.empty();

			var items = $this.data.data.items;
			var selected = $this.data.data.selectedObj;

			if(JSB.isArray(items)){
				// hide categories
				$this.categoriesElt.addClass('hidden');
				$this.fillItems(items);
			} else {
				$this.categoriesElt.removeClass('hidden');
				
				// fill categories
				var catArr = Object.keys(items);
				catArr.sort(function(a, b){
					if(b == $this.cubeFieldsCat){
						return 1;
					} else if(a == $this.cubeFieldsCat){
						return -1;
					}
					if(b == $this.sliceFieldsCat){
						return 1;
					} else if(a == $this.sliceFieldsCat){
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
				
				var category = $this.categoriesElt.find('> .entry:first-child').attr('key');
				if(selected){
					category = $this.findCategoryByItem(selected.scheme) || category;
				} 
				$this.selectCategory(category);
			}
		},
		
		findCategoryByItem: function(scheme){
			var obj = $this.data.data.items;
			if(JSB.isArray(obj)){
				return;
			}
			for(var cat in obj){
				var items = obj[cat];
				for(var i = 0; i < items.length; i++){
					var item = items[i];
					if(JSB.isString(item)){
						if(item == scheme){
							return cat;
						}
					} else {
						if(item.item == scheme){
							return cat;
						}
					}
				}
			}
		},
		
		selectCategory: function(cat){
			$this.categoriesElt.find('> .entry.selected').removeClass('selected');
			var entryElt = $this.categoriesElt.find('> .entry[key="'+cat+'"]');
			entryElt.addClass('selected');
			$this.fillItems($this.data.data.items[cat]);
		},
		
		fillItems: function(items){
			var selected = $this.data.data.selectedObj,
			    editor = $this.data.data.editor,
			    chosenListItem = null;

			$this.itemsListBox.clear();
			$this.itemsListBox.setFilter(null);
			$this.searchEditor.setData('');

			for(var i = 0; i < items.length; i++){
				var item = items[i];

				if(item == '#fieldName' || item == '$fieldName'){ //  || item == '$fieldExpr'
				    editor.getSourceSelectFields(function(sources){
				        for(var j in sources){
				            var fields = sources[j].fields,
				                el = $this.$('<div class="sourceName" title="' + j + '"></div>');

                            el.append(RendererRepository.createRendererFor(sources[j].entry).getElement());

                            $this.itemsListBox.addItem({
                                allowHover: false,
                                allowSelect: false,
                                key: j,
                                value: j,
                                scheme: item,
                                desc: null,
                                element: el
                            });

                            for(var i in fields){
                                var element = $this.$('<div class="field" title="' + i + '"> <div class="icon"></div><div class="name">' + i + '</div></div>');

                                if(fields[i].type){
                                    element.append('<div class="type">' + fields[i].type.toLowerCase() + '</div>');
                                }

                                var listItem = $this.itemsListBox.addItem({
                                    context: sources[j].context,
                                    key: j + '_' + i,
                                    value: i,
                                    scheme: item,
                                    desc: null,
                                    element: element
                                });
                                if(selected && selected.scheme == item && selected.value == i){
                                    $this.itemsListBox.selectItem(listItem.key, null, null, null, true);
                                    $this.itemsListBox.scrollTo(listItem.key);
                                }
                            }
				        }
				    });
				} else if(item == '$fieldExpr'){
				    editor.getSliceFields(function(result){
                        for(var i in result.fields){
                            var element = $this.$('<div class="field" title="' + i + '"> <div class="icon"></div><div class="name">' + i + '</div></div>');

                            if(result.fields[i].type){
                                element.append('<div class="type">' + result.fields[i].type.toLowerCase() + '</div>');
                            }

                            var listItem = $this.itemsListBox.addItem({
                                context: result.context,
                                key: result.context + '_' + i,
                                value: i,
                                scheme: item,
                                desc: null,
                                element: element
                            });
                            if(selected && selected.scheme == item && selected.value == i){
                                $this.itemsListBox.selectItem(listItem.key, null, null, null, true);
                                $this.itemsListBox.scrollTo(listItem.key);
                            }
                        }
				    });
				} else if(item == '#outputFieldName' || item == '$sortField') { //|| item == '$fieldExpr'
					var colMap = editor.combineColumns();

					for(var qName in colMap){
						var colArr = colMap[qName];
						for(var j = 0; j < colArr.length; j++){
							var fName = colArr[j];
							var listItem = $this.itemsListBox.addItem({
								key: fName + '_' + qName,
								scheme: item,
								value: fName,
								context: qName,
								desc: null,
								element: `#dot
									<div class="column" title="{{=fName}}">
										<div class="icon"></div>
										<div class="name">{{=fName}}</div>
										<div class="qname">{{=qName.toLowerCase()}}</div>
									</div>
								`
							});
							if(selected && selected.scheme == item && selected.value == fName){
								chosenListItem = listItem;
							}
						}
					}

				} else if(item == '$viewName') {
					editor.getCubeSlices(function(slices){
						var sArr = Object.keys(slices);
						sArr.sort(function(a, b){
							return slices[a].getName().localeCompare(slices[b].getName());
						});
						
						// add views
						var views = editor.combineViews();
						if(views && Object.keys(views).length > 0){
							for(var viewName in views){
								var listItem = $this.itemsListBox.addItem({
									key: viewName,
									value: viewName,
									scheme: item,
									desc: null,
									element: `#dot
										<div class="view" title="{{=viewName}}">
											<div class="icon"></div>
											<div class="name">{{=viewName}}</div>
										</div>
									`
								});
								if(selected && selected.scheme == item && selected.value == viewName){
//									chosenListItem = listItem;
									$this.itemsListBox.selectItem(listItem.key, null, null, null, true);
									$this.itemsListBox.scrollTo(listItem.key);
								}
							}
						}
						
						// add slices
						for(var j = 0; j < sArr.length; j++){
							var sId = sArr[j];
							var slice = slices[sId];
							if(slice == editor.options.slice){
								continue;
							}
							var sliceName = slice.getName();
							var listItem = $this.itemsListBox.addItem({
								key: sId,
								value: sliceName,
								scheme: item,
								desc: null,
								element: RendererRepository.createRendererFor(slice).getElement()
							});
							if(selected && selected.scheme == item && selected.value == sliceName){
//								chosenListItem = listItem;
								$this.itemsListBox.selectItem(listItem.key, null, null, null, true);
								$this.itemsListBox.scrollTo(listItem.key);
							}
						}
					});
				} else {
					var listItem = $this.itemsListBox.addItem({
						value: item.item,
						key: item.item,
						scheme: item.item,
						desc: item.desc,
						element: `#dot
							<div class="item" scheme="{{=item.item}}">
								<div class="title">{{=item.item + (item.title ? ' - ' + item.title : '')}}</div>
								<div class="desc">{{=item.desc}}</div>
							</div>
						`
					});
					if(selected && selected.scheme == item.item){
						chosenListItem = listItem;
					}
				}
			}
			
			if(chosenListItem){
				$this.itemsListBox.selectItem(chosenListItem.key, null, null, null, true);
				$this.itemsListBox.scrollTo(chosenListItem.key);
			}
			
			JSB.defer(function(){
				$this.searchEditor.setFocus();	
			}, 300);
		}
	}
}