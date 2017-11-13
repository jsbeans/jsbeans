{
	$name: 'DataCube.DataProviderDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable', 
	           'JSB.Widgets.RendererRepository', 
	           'JSB.Widgets.Button', 
	           'JSB.Widgets.CheckBox',
	           'JSB.Widgets.PrimitiveEditor',
	           'JSB.Controls.ScrollBox',
	           'JSB.Controls.Switch',
	           'JSB.Widgets.ToolManager'],
	
	$client: {
		ready: false,
		provider: null,
		editor: null,
		fields: null,
		binding: null,
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
					self.editor.cubeEntry.server().updateDataProviderNodePosition(self.provider.getId(), {x: x, y: y});
				}, 500, 'posChanged_' + this.getId());
				
			}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);
			this.provider = opts.provider;
			this.editor = opts.editor;
			this.loadCss('DataProviderDiagramNode.css');
			this.addClass('dataProviderDiagramNode');
			this.attr('provider', this.provider.getJsb().$name);
			
			this.caption = this.$('<div class="caption"></div>');
			var renderer = RendererRepository.createRendererFor(this.provider.entry, {showSource: true});
			this.caption.append(renderer.getElement());
			
			// refresh btn
			var refreshButton = new Button({
				cssClass: 'roundButton btn10 btnRefresh',
				tooltip: 'Обновить схему данных',
				onClick: function(evt){
					evt.stopPropagation();
					$this.refreshScheme();
				}
			}); 
			this.caption.append(refreshButton.getElement());
			// remove btn
			this.removeButton = new Button({
				cssClass: 'roundButton btn10 btnDelete',
				tooltip: 'Удалить',
				onClick: function(evt){
					evt.stopPropagation();
					ToolManager.showMessage({
                        icon: 'removeDialogIcon',
                        text: 'Вы уверены что хотите удалить провайдер? \n Удаление провайдера приведёт к удалению материализации.',
                        buttons: [{text: 'Удалить', value: true},
                                  {text: 'Нет', value: false}],
                        target: {
                            selector: this.getElement()
                        },
                        constraints: [{
                            weight: 10.0,
                            selector: this.getElement()
                        }],
                        callback: function(bDel){
                            $this.editor.cubeEntry.server().removeProvider($this.provider.getId(), function(res, fail){
                                if(!fail){
                                    $this.editor.cubeNode.refreshFields();
                                    $this.destroy();
                                }
                            });
                        }
                    });
				}
			});
			this.caption.append(this.removeButton.getElement());

            var checked = opts.provider.getMode() === 'join' ? true : false;
            this.caption.append(`#dot
                <div class="providerMode">
                    <span>Union</span>
                    <div
                     jsb="JSB.Controls.Switch"
                     checked="{{=checked}}"
                     onchange="{{=this.callbackAttr(function(b){ $this.providerModeChange(b); })}}"
                     ></div>
                    <span>Join</span>
                </div>
            `);

			this.body = this.$(`
                <div class="body">
					<div class="loading hidden">
						<div class="icon"></div>
						<div class="text">Загрузка схемы данных...</div>
					</div>
					<div class="failed hidden">
						<div class="icon"></div>
						<div class="text">MSG</div>
						<div class="details"></div>
					</div>
                </div>
			`);
			this.status = this.$(`
			    <div class="status">
                    <div class="toolbar">
                        <div class="selectAll" title="Выделить все"></div>
                        <div class="deselectAll" title="Снять выделение со всех"></div>
                        <div class="useComments" title="Использовать содержимое комментариев для формирования названий полей куба"></div>
                    </div>
                </div>`);
			this.append(this.caption);
			this.append(this.body);
			this.append(this.status);

			this.keyFieldList = this.$('<div class="fields keyFields"></div>');
			this.body.append(this.keyFieldList);

			// search
            this.body.append(`#dot
                <div class="search">
                    <div
                        jsb="JSB.Widgets.PrimitiveEditor"
                        onChange="{{=this.callbackAttr(function(){ var editor = this; JSB.defer(function(){ $this.search(editor) }, 300, 'searchDefer_' + $this.getId()); })}}"
                    >
                    </div>
                    <div class="icon">
                    </div>
                </div>
            `);

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

			if($this.fields){
				$this.refresh();
				$this.ready = true;
			} else {
				$this.loadScheme(function(){
					$this.refresh();
					$this.ready = true;
				});
			}

			this.status.find('.selectAll').click(function(evt){
			    var fields = $this.fieldList.find('.field > ._dwp_checkBox');

			    for(var i = 0; i < fields.length; i++){
			        var jsb = $this.$(fields[i]).jsb();
			        if(!jsb.isChecked()){
			            jsb.setChecked(true);
			        }
			    }

			    // $this.$(this).addClass('disabled');
			});

			this.status.find('.deselectAll').click(function(evt){
			    var fields = $this.fieldList.find('.field > ._dwp_checkBox');

			    for(var i = 0; i < fields.length; i++){
			        var jsb = $this.$(fields[i]).jsb();
			        if(jsb.isChecked()){
			            jsb.setChecked(false);
			        }
			    }

			    // $this.$(this).addClass('disabled');
			});
			
			var useCommentsElt = this.status.find('.useComments');
			useCommentsElt.click(function(evt){
				useCommentsElt.toggleClass('selected');
				if(useCommentsElt.hasClass('selected')){
					$this.editor.cubeEntry.server().changeProviderOptions($this.provider.getId(), {useComments:true}, function(){});
				} else {
					$this.editor.cubeEntry.server().changeProviderOptions($this.provider.getId(), {useComments:false}, function(){});
				}
			});
			
			if(opts.provider.getOption('useComments')){
				useCommentsElt.addClass('selected');
			}
			
			this.getElement().resize(function(){
			    if($this.editor.cubeEntry){
                    JSB.defer(function(){
                        $this.editor.cubeEntry.server().updateDataProviderNodeSize($this.provider.getId(), {
                            width: $this.getElement().width()
                        });
                    }, 300, 'dataProviderResize_' + $this.getId());
			    }
			});
		},
		
		loadScheme: function(callback){
			$this.find('.body > .loading').removeClass('hidden');
			$this.find('.body > .failed').addClass('hidden');
			this.editor.cubeEntry.server().extractDataProviderFields($this.provider.getId(), function(fields, fail){
				$this.find('.body > .loading').addClass('hidden');
				if(fail){
					$this.find('.body > .failed').removeClass('hidden');
					$this.find('.body > .failed > .text').text('Ошибка загрузки схемы');
					$this.find('.body > .failed > .details').text(fail.message);
				} else {
					$this.fields = fields;
					callback.call($this);
				}
			});
		},
		
		refreshScheme: function(){
			$this.find('.body > .loading').removeClass('hidden');
			$this.find('.body > .failed').addClass('hidden');
			this.editor.cubeEntry.server().refreshDataProviderFields($this.provider.getId(), function(desc, fail){
				$this.find('.body > .loading').addClass('hidden');
				if(fail){
					$this.find('.body > .failed').removeClass('hidden');
					$this.find('.body > .failed > .text').text('Ошибка загрузки схемы');
					$this.find('.body > .failed > .details').text(fail.message);
				} else {
					// update local fields
					$this.fields = desc.fields;
					$this.binding = desc.binding;
					$this.refresh();
					// $this.updateNodeLinks();
					$this.editor.cubeNode.refreshFields();
                    $this.removeButton.enable($this.keyFieldList.find('.field').length == 0);
				}
			});
		},
		
		refresh: function(){
			if($this.rightFieldConnectors && Object.keys($this.rightFieldConnectors).length > 0){
				for(var fName in $this.rightFieldConnectors){
					var conn = $this.rightFieldConnectors[fName];
					conn.destroy();
				}
			}
			this.fieldList.clear();
			this.keyFieldList.empty();

			var fieldNames = Object.keys(this.fields);
			fieldNames.sort(function(a, b){
				return a.localeCompare(b);
			});

			for(var i = 0; i < fieldNames.length; i++){
				this.createField(fieldNames[i], true);
			}

			this.removeButton.enable(this.keyFieldList.find('.field').length == 0);

			this.updateResizable();
		},

		createField: function(field, notUpdateResizable){
            var fElt = $this.$('<div class="field"></div>');
            fElt.attr('key', field);

            if(!$this.fields[field].keyField){
                var loader = this.$('<div class="loader hidden"></div>')

                var checkbox = new CheckBox({
                    checked: $this.fields[field].cubeField,
                    onChange: function(isCheck){
                        if(isCheck){
                            function addField(){
                                loader.removeClass('hidden');
                                $this.editor.cubeEntry.server().addField($this.provider.getId(), field, $this.fields[field].type, function(desc){
                                    loader.addClass('hidden');
                                    if(desc){
                                        $this.editor.cubeNode.addField(desc.field, desc.type, { id: desc.binding[0].provider.getId(), name: desc.binding[0].provider.getName() });
                                        $this.editor.cubeNode.reorderFields(desc.binding[0].provider.getId());
                                        $this.editor.cubeNode.updateInterface();
                                        $this.fields[field].cubeField = desc.field;
                                    }
                                });
                            }

                            $this.editor.cubeEntry.server().getMaterializationInfo(function(matDesc){
                                if(matDesc.materializing){
                                    ToolManager.showMessage({
                                        icon: 'infoDialogIcon',
                                        text: 'Добавление поля в куб в момент материализации невозможно',
                                        buttons: [{text: 'Закрыть', value: true}],
                                        target: {
                                            selector: fElt
                                        },
                                        constraints: [{
                                            weight: 10.0,
                                            selector: fElt
                                        }]
                                    });
                                    $this.setCheckField(field, false);
                                } else if(matDesc.materialization && Object.keys(matDesc.materialization).length > 0){
                                    ToolManager.showMessage({
                                        icon: 'warningDialogIcon',
                                        text: 'Добавление поля в куб приведет к удалению существующей материализации',
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
                                                addField();
                                            } else {
                                                $this.setCheckField(field, false);
                                            }
                                        }
                                    });
                                } else {
                                    addField();
                                }
                            });
                        } else {
                            function removeField(){
                                loader.removeClass('hidden');
                                $this.editor.cubeEntry.server().removeFields($this.fields[field].cubeField, function(res, fail){
                                    loader.addClass('hidden');
                                    if(res){
                                        $this.editor.cubeNode.afterFieldRemove($this.fields[field].cubeField);
                                    } else {
                                        checkbox.setChecked(false, true);
                                    }
                                });
                            }

                            $this.editor.cubeEntry.server().getMaterializationInfo(function(matDesc){
                                if(matDesc.materializing){
                                    ToolManager.showMessage({
                                        icon: 'infoDialogIcon',
                                        text: 'Удаление поля из куба в момент материализации невозможно',
                                        buttons: [{text: 'Закрыть', value: true}],
                                        target: {
                                            selector: fElt
                                        },
                                        constraints: [{
                                            weight: 10.0,
                                            selector: fElt
                                        }]
                                    });
                                    $this.setCheckField(field, true);
                                } else if(matDesc.materialization && Object.keys(matDesc.materialization).length > 0){
                                    ToolManager.showMessage({
                                        icon: 'warningDialogIcon',
                                        text: 'Удаление поля из куба приведет к удалению существующей материализации',
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
                                            } else {
                                                $this.setCheckField(field, true);
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
                fElt.append(checkbox.getElement())
                    .append(loader);
            } else {
                fElt.append('<div class="icon"></div>');
            }
            fElt.append(`#dot
                <div class="cell name">
                    <div class="text"></div>
                </div>
                <div class="cell type">
                    <div class="icon"></div>
                    <div class="text"></div>
                </div>
            `);
            if($this.fields[field].keyField){
                fElt.append(`#dot <div class="connector right"></div>`);
            }
            fElt.find('.cell.name').attr('title', field);
            fElt.find('.cell.name > .text').text(field);
            fElt.find('.cell.type > .text').text($this.fields[field].type);

            if($this.fields[field].keyField){
                $this.keyFieldList.append(fElt);

                // create right connector
                var rightConnector = $this.installConnector('providerFieldRight', {
                    origin: fElt.find('.connector.right'),
                    handle: [fElt.find('.connector.right'), fElt.find('.cell.type')],
                    iri: 'connector/field/right/' + field,
                    field: field
                });
                $this.rightFieldConnectors[field] = rightConnector;
            } else {
                $this.fieldList.append(fElt);
            }

            if(!notUpdateResizable){
                this.updateResizable();
            }
		},

		reorderFields: function(isKey){
		    JSB().defer(function(){
                if(isKey){
                    var fields = $this.keyFieldList.find('.field');
                } else {
                    var fields = $this.fieldList.find('.field');
                }

                fields.sort(function(a, b){
                    var an = $this.$(a).find('.name .text').text(),
                        bn = $this.$(b).find('.name .text').text();

                    if(an && bn){
                        return an.toUpperCase().localeCompare(bn.toUpperCase());
                    }

                    return 0;
                });

                if(isKey){
                    fields.detach().appendTo($this.keyFieldList);
                } else {
                    fields.detach().appendTo($this.fieldList.getElement());
                }
		    }, 300, "reorderFields_" + this.getId());
		},

		toggleKeyField: function(field, isKey){
		    $this.fields[field].keyField = isKey;

		    if(isKey){
                var e = $this.keyFieldList.find('.field[key="' + field + '"]');
                if(e.length > 0){
                    return this.rightFieldConnectors[field];
                }
		    } else {
                var e = $this.fieldList.find('.field[key="' + field + '"]');
                if(e.length > 0){
                    return;
                }

		        this.rightFieldConnectors[field].destroy();
		        delete this.rightFieldConnectors[field];
		    }

		    var element = $this.find('.field[key="' + field + '"]');
            element.remove();

            this.createField(field);
            this.reorderFields(isKey);

            this.removeButton.enable(this.keyFieldList.find('.field').length == 0);

            // return right connector
            return this.rightFieldConnectors[field];
		},

		setCheckField: function(field, isCheck){
		    this.fieldList.find('.field[key="' + field + '"] > ._dwp_checkBox').jsb().setChecked(isCheck, true);
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

		updateNodeLinks: function(){
		    for(var i in this.fields){
		        if(this.fields[i].keyField){
                    var link = this.diagram.createLink('bind');
                    link.setSource(this.editor.cubeNode.leftFieldConnectors[this.fields[i].cubeField]);
                    link.setTarget(this.rightFieldConnectors[i]);
		        }
		    }
		},

		providerModeChange: function(b){
		    // true - Join, false - Union
		    this.editor.cubeEntry.server().changeProviderOptions(this.provider.getId(), b ? {mode:"join"} : {mode:"union"}, function(res, fail){
		        if(fail){
		            $this.caption.find('[jsb="JSB.Controls.Switch"]').jsb().setChecked(!b, true);
		        } else{
		            $this.provider.getMode() = b ? "join" : "union";
		        }
		    });
		},

		selectNode: function(bEnable){
			if(bEnable){
				this.addClass('selected');
				this.editor.publish('DataCube.CubeEditor.providerNodeSelected', this.provider);
			} else {
				this.removeClass('selected');
				this.editor.publish('DataCube.CubeEditor.providerNodeDeselected', this.provider);
			}
		},

		search: function(editor){
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

		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		}
	}
}