{
	$name: 'DataCube.CubeDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable', 
	           'JSB.Widgets.ToolManager', 
	           'DataCube.Dialogs.CubeMaterializationTool',
	           'JSB.Widgets.CheckBox',
	           'JSB.Widgets.Alpha.ScrollBox'],
	
	$client: {
		ready: false,
		fields: null,
		editor: null,
		entry: null,
		checkedFieldList: {},
		leftFieldConnectors: {},
		rightFieldConnectors: {},
		
		options: {
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
						onclick="{{=$this.callbackAttr(function(evt){ $this.editor.addSlice($this.checkedFieldList); evt.stopPropagation(); })}}"></div>
				</div>
			`);
			this.body = this.$(`
				<div class="body"></div>
			`);
			this.status = this.$(`
				<div class="status">
                    <div class="toolbar">
                        <div class="link disabled" title="Объединение полей"></div>
                        <div class="remove disabled" title="Удаление полей"></div>
                        <div class="materialization" title="Настройки материализации куба"></div>
                    </div>
					<div class="message hidden"></div>
				</div>`);
			this.append(this.caption);
			this.append(this.body);
			this.append(this.status);

            this.keyFieldList = this.$('<div class="fields keyFields"></div>');
            this.body.append(this.keyFieldList);

			// search
            this.search = this.$(`#dot
                <div class="search">
                    <div
                        jsb="JSB.Widgets.PrimitiveEditor"
                        onChange="{{=this.callbackAttr(function(){ var editor = this; JSB.defer(function(){ $this.searchFunction(editor) }, 300, 'searchDefer_' + $this.getId()); })}}"
                    >
                    </div>
                    <div class="icon">
                    </div>
                </div>
            `);
            this.body.append(this.search);

            this.fieldList = new ScrollBox({
                cssClass: 'fields',
                xAxisScroll: false
            });
            this.body.append(this.fieldList.getElement());

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

			$this.ready = true;
			
			this.getElement().resize(function(){
				JSB.defer(function(){
				    $this.entry.server().updateCubeNodeSize({
				        width: $this.getElement().width()
				    });
				}, 300, 'cubeResize_' + $this.getId());
			});
			
			this.subscribe('Workspace.renameEntry', function(sender, msg, desc){
				var entry = desc.entry;
				if($this.entry != entry){
					return;
				}
				$this.caption.find('.name').text(desc.name);
			});
			
			this.subscribe('DataCube.Model.Cube.status', {session: true}, function(sender, msg, params){
				if(sender != $this.entry){
					return;
				}
				var msgElt = $this.status.find('.message');
				msgElt.removeClass('hidden');
				msgElt.empty();
				if(params.status){
					msgElt.append(params.status);
					msgElt.attr('title', params.status);
				}
				if(params.success){
					msgElt.removeClass('error');
				} else {
					msgElt.addClass('error');
				}
				$this.updateIndicators();
			});
			
			// toolbar
			this.status.find('.materialization').click(function(evt){
				$this.showMaterializationDialog(evt);
			});
			this.status.find('.link').click(function(){
			    $this.createKeyField();
			    $this.$(this).addClass('disabled');
			});
			this.status.find('.remove').click(function(){
			    $this.removeField(Object.keys($this.checkedFieldList));
			    $this.checkedFieldList = {};
			    $this.$(this).addClass('disabled');
			});

			this.updateIndicators();
		},
		
		updateIndicators: function(){
			this.entry.server().getMaterializationInfo(function(mInfo){
				var matElt = $this.status.find('.toolbar > .materialization');
				if(mInfo && mInfo.materializing){
					matElt.addClass('materializing');
					matElt.removeClass('materialized');
				} else if(mInfo && Object.keys(mInfo.materialization).length > 0){
					matElt.addClass('materialized');
					matElt.removeClass('materializing');
				} else {
					matElt.removeClass('materializing');
					matElt.removeClass('materialized');
				}
			});
		},
		// updateFieldsType
		refreshFields: function(){
		    this.entry.server().getFields(function(fields){
		        if(!fields) return;

		        for(var i in fields){
		            if($this.fields[i] !== fields[i].type){
		                $this.getElement().find('.field[key="' + i + '"] > .type > .text').text(fields[i].type);
		                $this.fields[i] = fields[i].type;
		            }
		        }
		    });
		},
		
		addField: function(field, type, provider, isLink, isKeyField, notUpdateResizable){
			var fElt = null;
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

                    <div jsb="JSB.Widgets.PrimitiveEditor" class="text" mode="inplace"
                        onvalidate = "{{=$this.callbackAttr(function(val){return $this.isFieldNameValid(val)})}}"></div>

                    <div jsb="JSB.Widgets.Button" class="roundButton btnEdit btn10" tooltip="Изменить название поля"
                        onclick="{{=$this.callbackAttr(function(evt){evt.stopPropagation(); $this.beginEditField(fElt.attr('key'))})}}"></div>
                </div>
                <div class="cell type">
                    <div class="text"></div>
                </div>
            `);

            if(isKeyField){
                fElt.append(`#dot
                    <div class="connector left"></div>
                `);
            }

            var checkbox = new CheckBox({
                onChange: function(isChecked){
                    if(isChecked){
                        $this.checkedFieldList[field] = true;
                    } else {
                        delete $this.checkedFieldList[field];
                    }

                    var keysCount = Object.keys($this.checkedFieldList).length;

                    if(keysCount >= 2){
                        $this.status.find('.toolbar > .link').removeClass('disabled');
                    } else {
                        $this.status.find('.toolbar > .link').addClass('disabled');
                    }

                    if(keysCount >= 1){
                        $this.status.find('.toolbar > .remove').removeClass('disabled');
                    } else {
                        $this.status.find('.toolbar > .remove').addClass('disabled');
                    }
                }
            });
            fElt.find('.cell.name').prepend(checkbox.getElement());

            fElt.append(`#dot
                <div jsb="JSB.Widgets.Button"
                     class="roundButton btnDelete btn10"
                     tooltip="Удалить поле"
                     onclick="{{=$this.callbackAttr(function(evt){evt.stopPropagation(); $this.removeField(fElt.attr('key'))})}}">
                 </div>
            `);

            fElt.find('.cell.type > .text').text($this.fields[field]);
            fElt.find('.cell.name').attr('title', field);

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

            if(isKeyField){
                $this.keyFieldList.append(fElt);
            } else {
                if(provider){
                    var providerBlock = this.fieldList.find('.providerBlock[key="' + provider.id + '"]');

                    if(providerBlock.length === 0){
                        providerBlock = this.$('<div class="providerBlock" key="' + provider.id + '"><div class="caption">' + provider.name + '</div></div>');
                        providerBlock.hover(function(){
                            $this.editor.providersNodes[provider.id].highlightNode(true);
                        }, function(){
                            $this.editor.providersNodes[provider.id].highlightNode(false);
                        });
                        this.fieldList.append(providerBlock);
                    }

                    providerBlock.append(fElt);
                } else {
                    this.fieldList.append(fElt);
                }
            }

            if(nWidth){
                fElt.find('.cell.name').width(nWidth);
            }
            if(tWidth){
                fElt.find('.cell.type').width(tWidth);
            }
            if(isKeyField){
                // create left connector
                var leftConnector = $this.installConnector('cubeFieldLeft', {
                    origin: fElt.find('.connector.left'),
                    handle: [fElt.find('.connector.left'), fElt.find('.cell.name > .icon'), fElt.find('.cell.name > .text')],
                    iri: 'connector/field/left/' + field
                });
                $this.leftFieldConnectors[field] = leftConnector;
            }

            if(!notUpdateResizable){
                this.updateResizable();
            }

			return fElt;
		},

		reorderFields: function(providerId){
		    JSB().defer(function(){
                if(providerId){ // reorder only one provider
                    var providerBlock = $this.fieldList.find('.providerBlock[key="' + providerId + '"]');
                    var fields = providerBlock.find('.field');

                    fields.sort(function(a, b){
                        var an = $this.$(a).find('.name .text').text(),
                            bn = $this.$(b).find('.name .text').text();

                        if(an && bn){
                            return an.toUpperCase().localeCompare(bn.toUpperCase());
                        }

                        return 0;
                    });

                    fields.detach().appendTo(providerBlock);
                } else {    // reorder all
                    var providerBlocks = $this.fieldList.find('.providerBlock');

                    for(var i = 0; i < providerBlocks.length; i++){
                        var fields = this.$(providerBlocks[i]).find('.field');

                        fields.sort(function(a, b){
                            var an = $this.$(a).find('.name .text').text(),
                                bn = $this.$(b).find('.name .text').text();

                            if(an && bn){
                                return an.toUpperCase().localeCompare(bn.toUpperCase());
                            }

                            return 0;
                        });

                        fields.detach().appendTo(providerBlocks[i]);
                    }
                }
		    }, 300, "reorderFields_" + this.getId());
		},

		reorderKeyFields: function(){
		    JSB().defer(function(){
                var fields = $this.keyFieldList.find('.field');

                fields.sort(function(a, b){
                    var an = $this.$(a).find('.name .text').text(),
                        bn = $this.$(b).find('.name .text').text();

                    if(an && bn){
                        return an.toUpperCase().localeCompare(bn.toUpperCase());
                    }

                    return 0;
                });

                fields.detach().appendTo($this.keyFieldList);
		    }, 300, "reorderFields_" + this.getId());
		},

		updateResizable: function(){
            var keyCells = this.keyFieldList.find('.field .cell.name'),
                cells = this.fieldList.find('.field .cell.name');

            keyCells.resizable({
                autoHide: true,
                handles: "e",
                resize: function(evt, ui){
                    keyCells.width(ui.size.width);
                }
            });

            cells.resizable({
                autoHide: true,
                handles: "e",
                resize: function(evt, ui){
                    cells.width(ui.size.width);
                }
            });
		},
		
		isFieldNameValid: function(fName){
			var n = fName.trim();
			if(n.length == 0){
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
			var editor = $this.find('.fields .field[key="'+$this.prepareFieldKey(field)+'"] > .cell.name > .text').jsb();
			editor.beginEdit();
		},
		
		renameField: function(newName, oldName){
			$this.entry.server().renameField(oldName, newName, function(desc){
				$this.fields[desc.field] = desc.type;
				delete $this.fields[oldName];
				var fElt = $this.find('.fields .field[key="'+$this.prepareFieldKey(oldName)+'"]');
				fElt.attr('key', desc.field);
				fElt.find('.cell.name').attr('title', desc.field);
				if(desc.binding.length > 1){
				    $this.reorderKeyFields();
				} else {
				    $this.reorderFields(desc.binding[0].provider.getId());
				}
			});
		},
		
		removeField: function(field){
		    if(JSB.isArray(field)){
		        var fElt = this.status.find('.remove');
		    } else {
		        var fElt = this.find('.fields .field[key="'+$this.prepareFieldKey(field)+'"]');
		    }

			ToolManager.showMessage({
				icon: 'removeDialogIcon',
				text: 'Вы уверены что хотите удалить поля?',
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
						function removeField(){
							$this.entry.server().removeFields(field, function(res, fail){
							    if(fail) return;
							    $this.afterFieldRemove(field, res);
							});
						}
						
						$this.entry.server().getMaterializationInfo(function(matDesc){
							if(matDesc.materializing){
								ToolManager.showMessage({
									icon: 'infoDialogIcon',
									text: 'Удаление полей из куба в момент материализации невозможно',
									buttons: [{text: 'Закрыть', value: true}],
									target: {
										selector: fElt
									},
									constraints: [{
										weight: 10.0,
										selector: fElt
									}],
									callback: function(){
										
									}
								});
							} else if(matDesc.materialization && Object.keys(matDesc.materialization).length > 0){
								// show ask dialog
								ToolManager.showMessage({
									icon: 'warningDialogIcon',
									text: 'Удаление полей из куба приведет к удалению существующей материализации',
									buttons: [{text: 'Продолжить', value: true},
									          {text: 'Отмена', value: false}],
									target: {
										selector: fElt
									},
									constraints: [{
										weight: 10.0,
										selector: fElt
									}],
									callback: function(b){
										if(b){
											removeField();
										} 
									}
								});
							} else {
								removeField();
							}
						});
					}
				}
			});
		},

		afterFieldRemove: function(fields, nFields){
		    if(!JSB.isArray(fields)){
		        fields = [fields];
		    }

		    for(var i = 0; i < fields.length; i++){
		        delete this.fields[fields[i]];
		        this.find('.fields .field[key="'+$this.prepareFieldKey(fields[i])+'"]').remove();

                if(this.leftFieldConnectors[fields[i]]){
                    this.leftFieldConnectors[fields[i]].destroy();
                    delete this.leftFieldConnectors[fields[i]];
                }
		    }

            if(!nFields || nFields.length === 0){
                this.updateInterface();
                return;
            }

            for(var i = 0; i < nFields.add.length; i++){
                this.fields[nFields.add[i].field] = nFields.add[i].type;
                this.addField(nFields.add[i].field, nFields.add[i].type, { id: nFields.add[i].binding[0].provider.getId(), name: nFields.add[i].binding[0].provider.getName() }, false, false);

                this.editor.providersNodes[nFields.add[i].binding[0].provider.getId()].toggleKeyField(nFields.add[i].binding[0].field, false);
            }

            for(var i = 0; i < nFields.uncheck.length; i++){
                this.editor.providersNodes[nFields.uncheck[i].binding[0].provider.getId()].setCheckField(nFields.uncheck[i].binding[0].field, false);
            }

            this.updateInterface();
            if(nFields.add.length > 0){
                this.reorderFields();
            }
		},

		selectNode: function(bEnable){
			if(bEnable){
				this.addClass('selected');
				this.editor.publish('DataCube.CubeEditor.cubeNodeSelected', this.entry);
			} else {
				this.removeClass('selected');
				this.editor.publish('DataCube.CubeEditor.cubeNodeDeselected', this.entry);
			}
		},
		
		showMaterializationDialog: function(evt){
			var elt = this.$(evt.currentTarget);
			ToolManager.activate({
				id: 'cubeMaterializationTool',
				cmd: 'show',
				data: {
					cube: $this.entry,
				},
				scope: $this.$('.cubeEditorView'),
				target: {
					selector: elt,
				},
				constraints: [{
					selector: elt,
					weight: 10.0
				},{
					selector: $this.getElement(),
					weight: 10.0
				}],
				draggable: true,
				callback: function(desc){
				}
			});
		},

		createKeyField: function(){
		    var fArray = [];
		    for(var i in this.checkedFieldList){
		        fArray.push({
		            field: i
		        });
		    }
		    this.checkedFieldList = {};


		    $this.entry.server().linkFields(fArray, function(nField){
		        for(var i = 0; i < fArray.length; i++){
		            $this.afterFieldRemove(fArray[i].field);
		        }
		        $this.fields[nField.field] = nField.type;
		        $this.addField(nField.field, nField.type, null, true, true);

		        for(var i = 0; i < nField.binding.length; i++){
		            var rightConnector = $this.editor.providersNodes[nField.binding[i].provider.getId()].toggleKeyField(nField.binding[i].field, true);

                    var link = $this.diagram.createLink('bind');
                    link.setSource($this.leftFieldConnectors[nField.field]);
                    link.setTarget(rightConnector);
		        }
		        $this.updateInterface();
		        $this.reorderKeyFields();
		    });
		},

		searchFunction: function(editor){
		    var fields = this.fieldList.find('.field'),
		        val = editor.getData().getValue();

		    if(!val || val.length == 0){
		        fields.removeClass('hidden');
		    } else {
                fields.each(function(i, el){
                    var text = $this.$(el).find('.name .text').text();
                    if(text.toLowerCase().match(val.toLowerCase())){
                        $this.$(el).removeClass('hidden');
                    } else {
                        $this.$(el).addClass('hidden');
                    }
                });
		    }
		},

		updateInterface: function(){
            this.fieldList.find('.providerBlock').each(function(i, el){
                var element = $this.$(el);
                if(element.children().length === 1){
                    element.remove();
                }
            });

		    if(this.fieldList.getElement().children().length > 0){
		        this.search.removeClass('hidden');
		    } else {
		        this.search.addClass('hidden');
		    }
		}
	}
}