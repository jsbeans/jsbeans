{
	$name: 'JSB.DataCube.CubeDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable', 'JSB.Widgets.ToolManager'],
	
	$client: {
		ready: false,
		fields: null,
		editor: null,
		entry: null,
		leftFieldConnectors: {},
		rightFieldConnectors: {},
		
		options: {
			onHighlight: function(bEnable){
				this.highlightNode(bEnable);
			},
			onSelect: function(bEnable){
				this.selectNode(bEnable);
			},
			onRemove: function(){},
			onPositionChanged: function(x, y){
				var self = this;
				if(this.editor.ignoreHandlers){
					return;
				}
				JSB.defer(function(){
					self.entry.server().updateCubeNodePosition({x: x, y: y});
				}, 500, 'posChanged_' + this.getId());
				
			}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);
			this.editor = opts.editor;
			this.entry = opts.entry;
			this.loadCss('CubeDiagramNode.css');
			this.addClass('cubeDiagramNode');
			
			this.caption = this.$(`#dot
				<div class="caption">
					<div class="icon"></div>
					<div class="name">{{=this.entry.getName()}}</div>
					
					<div jsb="JSB.Widgets.Button" class="roundButton btnCreate btn10" tooltip="Создать срез"
						onclick="{{=$this.callbackAttr(function(evt){ $this.editor.addSlice() })}}"></div>
				</div>
			`);
			this.body = this.$(`
				<div class="body"></div>
			`);
			this.status = this.$('<div class="status"></div>');
			this.append(this.caption);
			this.append(this.body);
			this.append(this.status);
			this.fieldList = this.$('<div class="fields"></div>');
			this.body.append(this.fieldList);

			// install drag-move selector
			this.installDragHandle('drag', {
				selector: this.caption
			});
			
			// install resize hande
			var rightBottomGripper = this.$('<div class="gripper cornerGripper rightBottomGripper"></div>');
			this.append(rightBottomGripper);
			
			this.installResizeHandle('rightBottomGripper',{
				selector: rightBottomGripper,
				resize: {right: true}
			});
			
			$this.refresh();
			$this.ready = true;
			
			this.getElement().resize(function(){
				var nameCell = $this.fieldList.find('.field .cell.name');
				var typeCell = $this.fieldList.find('.field .cell.type');
				var sz = nameCell.outerWidth();
				typeCell.css('width', 'calc(100% - '+sz+'px)');
			});
			
			this.subscribe('Workspace.renameEntry', function(sender, msg, desc){
				var entry = desc.entry;
				if($this.entry != entry){
					return;
				}
				$this.caption.find('.name').text(desc.name);
			});
		},
		
		addField: function(field, type, isLink){
			var fElt = null;
			if(field){
				if(!$this.fields){
					$this.fields = {};
				}
				$this.fields[field] = type;
				var prependElt = $this.find('.field[key="__new__"]');
				// add field
				var nWidth = null;
				var tWidth = null;
				if($this.resized){
					var prevCellName = $this.fieldList.find('.field > .cell.name');	
					var prevCellType = $this.fieldList.find('.field > .cell.type');
					nWidth = prevCellName.width();
					tWidth = prevCellType.width();
				}
				fElt = $this.$('<div class="field"></div>');
				fElt.attr('key', field);
				if(isLink){
					fElt.addClass('link');
				}
				fElt.append(`#dot
					<div class="cell name">
						<div class="icon"></div>
						<div jsb="JSB.Widgets.PrimitiveEditor" class="text" mode="inplace"
							onvalidate = "{{=$this.callbackAttr(function(val){return $this.isFieldNameValid(val)})}}"></div>
							
						<div jsb="JSB.Widgets.Button" class="roundButton btnEdit btn10" tooltip="Изменить название поля"
							onclick="{{=$this.callbackAttr(function(evt){evt.stopPropagation(); $this.beginEditField(fElt.attr('key'))})}}"></div>

					</div><div class="cell type">
						<div class="icon"></div>
						<div class="text"></div>
					</div>
					<div class="connector left"></div>
					<div class="connector right"></div>
					
					<div jsb="JSB.Widgets.Button" class="roundButton btnDelete btn10" tooltip="Удалить поле"
						onclick="{{=$this.callbackAttr(function(evt){evt.stopPropagation(); $this.removeField(fElt.attr('key'), evt)})}}"></div>
					
				`);
				fElt.find('.cell.type > .text').text($this.fields[field]);
				
				JSB.deferUntil(function(){
					var nameEditor = fElt.find('.cell.name > .text').jsb();
					nameEditor.setData(field);
					nameEditor.setOption('onChange', function(val){
						if(val != val.trim()){
							nameEditor.setData(val.trim());
						}
						$this.renameField(val.trim(), fElt.attr('key'));
					});
				}, function(){
					return fElt.find('.cell.name > .text').jsb();
				});
				
				if(prependElt){
					prependElt.before(fElt);
				} else {
					$this.fieldList.append(fElt);
				}
				
				if(nWidth){
					fElt.find('.cell.name').width(nWidth);
				}
				if(tWidth){
					fElt.find('.cell.type').width(tWidth);
				}
				
				// create left connector
				var leftConnector = $this.installConnector('cubeFieldLeft', {
					origin: fElt.find('.connector.left'),
					handle: [fElt.find('.connector.left'), fElt.find('.cell.name > .icon'), fElt.find('.cell.name > .text')],
					iri: 'connector/field/left/' + field,
					onHighlight: function(bEnable, meta){
						$this.highlightConnector(this, bEnable, meta);
					},
					onChangeConnection: function(link){
						if(!link || !this.hasLink(link) || $this.editor.ignoreHandlers){
							return;
						}
						var rDesc = this.getRemote(link);
						var provider = rDesc.node.provider;
						var pField = rDesc.connector.options.field;
						var field = fElt.attr('key');
						$this.entry.server().linkField(field, provider.getId(), pField, rDesc.node.fields[pField], function(desc){
							if(!$this.fields){
								$this.fields = {};
							}
							if(desc.link){
								fElt.addClass('link');
							} else {
								fElt.removeClass('link');
							}
							
						});						
					}
				});
				$this.leftFieldConnectors[field] = leftConnector;

				// create right connector
				var rightConnector = $this.installConnector('cubeFieldRight', {
					origin: fElt.find('.connector.right'),
					handle: [fElt.find('.connector.right'), fElt.find('.cell.type')],
					iri: 'connector/field/right/' + field,
					onHighlight: function(bEnable, meta){
						$this.highlightConnector(this, bEnable, meta);
					},
					onChangeConnection: function(link){
						if(!link || !this.hasLink(link) || $this.editor.ignoreHandlers){
							return;
						}
					}
				});
				$this.rightFieldConnectors[field] = rightConnector;
				
				var nameCells = $this.fieldList.find('.cell.name');
				var typeCells = $this.fieldList.find('.field .cell.type');
				nameCells.resizable({
					autoHide: true,
					handles: "e",
					alsoResize: nameCells,
					start: function(evt, ui){
						nameCells.resizable('option', 'minWidth', fElt.width() * 0.3);
						nameCells.resizable('option', 'maxWidth', fElt.width() * 0.7);
					},
					resize: function(evt, ui){
						typeCells.css('width', 'calc(100% - '+ui.size.width+'px)');
						$this.resized = true;
					}
				});

			} else {
				// add temporary field
				fElt = $this.$('<div class="field" key="__new__"></div>');
				fElt.append(`#dot
					<div class="icon"></div>
					<div class="text">Свяжите с полем источника</div>
					<div class="connector left"></div>
				`);
				$this.fieldList.append(fElt);
				
				var welcomeConnector = $this.installConnector('cubeFieldLeft', {
					origin: fElt.find('.connector.left'),
					handle: [fElt.find('.connector.left'), fElt.find('.text'), fElt.find('.icon')],
					iri: 'connector/welcome/left',
					onHighlight: function(bEnable, meta){
						$this.highlightConnector(this, bEnable, meta);
					},
					onChangeConnection: function(link){
						if(!link || !this.hasLink(link) || $this.editor.ignoreHandlers){
							return;
						}
						var rDesc = this.getRemote(link);
						var provider = rDesc.node.provider;
						var field = rDesc.connector.options.field;
						$this.entry.server().addField(provider.getId(), field, rDesc.node.fields[field], function(desc){
							$this.addField(desc.field, desc.type);
							$this.editor.ignoreHandlers = true;
							link.setSource($this.leftFieldConnectors[desc.field]);
							$this.editor.ignoreHandlers = false;
						});
					}
				});
			}
			
			return fElt;
		},
		
		isFieldNameValid: function(fName){
			var n = fName.trim();
			if(n.length == 0){
				return false;
			}
			if(/\s/.test(n)){
				return false;
			}
			if(/$\d/.test(n)){
				return false;
			}
			if(this.fields[n]){
				return false;
			}
			return true;
		},
		
		prepareFieldKey: function(name){
			return name.replace(/\"/g, '\\"');
		},
		
		beginEditField: function(field){
			var editor = $this.find('.fields > .field[key="'+$this.prepareFieldKey(field)+'"] > .cell.name > .text').jsb();
			editor.beginEdit();
		},
		
		renameField: function(newName, oldName){
			$this.entry.server().renameField(oldName, newName, function(desc){
				$this.fields[desc.field] = desc.type;
				delete $this.fields[oldName];
				var fElt = $this.find('.fields > .field[key="'+$this.prepareFieldKey(oldName)+'"]');
				fElt.attr('key', desc.field);
			});
		},
		
		removeField: function(field){
			var fElt = $this.find('.fields > .field[key="'+$this.prepareFieldKey(field)+'"]');
			ToolManager.showMessage({
				icon: 'removeDialogIcon',
				text: 'Вы уверены что хотите удалить поле "'+$this.prepareFieldKey(field)+'"?',
				buttons: [{text: 'Удалить', value: true},
				          {text: 'Нет', value: false}],
				target: {
					selector: fElt
				},
				constraints: [{
					weight: 10.0,
					selector: fElt
				}],
				callback: function(bDel){
					if(bDel){
						$this.entry.server().removeField(field, function(res, fail){
							if(res){
								delete $this.fields[field];
								$this.find('.fields > .field[key="'+$this.prepareFieldKey(field)+'"]').remove();
								$this.leftFieldConnectors[field].destroy();
								delete $this.leftFieldConnectors[field];
								$this.rightFieldConnectors[field].destroy();
								delete $this.rightFieldConnectors[field];
							}
						});
					}
				}
			});
		},
		
		refresh: function(){
			this.fieldList.empty();
			if(this.fields){
				var fieldNames = Object.keys(this.fields);
				fieldNames.sort(function(a, b){
					return a.localeCompare(b);
				});
				for(var i = 0; i < fieldNames.length; i++){
					var f = fieldNames[i];
					this.addField(f, this.fields[f]);
				}
			}
			
			// add welcome field
			this.addField(null);
			
		},
		
		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		selectNode: function(bEnable){
			if(bEnable){
				this.addClass('selected');
			} else {
				this.removeClass('selected');
			}
		},
		
		highlightConnector: function(connector, bEnable, meta){
			var elt = connector.options.origin;
			if(bEnable){
				elt.addClass('highlighted');
			} else {
				elt.removeClass('highlighted');
			}
		}
	}
}