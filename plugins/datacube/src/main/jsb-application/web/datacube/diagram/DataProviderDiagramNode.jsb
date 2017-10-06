{
	$name: 'DataCube.DataProviderDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable', 'JSB.Widgets.RendererRepository', 'JSB.Widgets.Button', 'JSB.Widgets.CheckBox', 'JSB.Widgets.Alpha.ScrollBox'],
	
	$client: {
		ready: false,
		provider: null,
		editor: null,
		fields: null,
		binding: null,
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
			
			var removeButton = new Button({
				cssClass: 'roundButton btn10 btnDelete',
				tooltip: 'Удалить',
				enabled: false,
				onClick: function(evt){
					evt.stopPropagation();
					debugger;
				}
			});
			this.caption.append(removeButton.getElement());

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
			this.status = this.$('<div class="status"></div>');
			this.append(this.caption);
			this.append(this.body);
			this.append(this.status);

			this.keyFieldList = this.$('<div class="fields keyFields"></div>');
			this.body.append(this.keyFieldList);

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
			
			this.getElement().resize(function(){
				var nameCell = $this.fieldList.find('.field .cell.name');
				var typeCell = $this.fieldList.find('.field .cell.type');
				var sz = nameCell.outerWidth();
				typeCell.css('width', 'calc(100% - '+sz+'px)');
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
			this.fieldList.empty();
			this.keyFieldList.empty();

			var fieldNames = Object.keys(this.fields);
			fieldNames.sort(function(a, b){
				return a.localeCompare(b);
			});

			for(var i = 0; i < fieldNames.length; i++){
				var f = fieldNames[i];
				(function(field){
					var fElt = $this.$('<div class="field"></div>');
					fElt.attr('key', field);
					if(!$this.fields[field].keyField){
					    var checkbox = new CheckBox({
					        checked: $this.fields[field].cubeField,
					        onChange: function(isCheck){
					            if(isCheck){
					                $this.editor.cubeEntry.server().addField($this.provider.getId(), field, $this.fields[field].type, function(desc){
					                    if(desc){
					                        $this.editor.cubeNode.addField(desc.field, desc.type);
					                    }
					                });
					            } else {
					                $this.editor.cubeEntry.server().removeField($this.fields[field].cubeField, function(res, fail){
					                    if(res){
					                        $this.editor.cubeNode.afterFieldRemove($this.fields[field].cubeField);
					                    } else {
					                        checkbox.setChecked(false);
					                    }
					                });
					            }
					        }
					    });
					    fElt.append(checkbox.getElement());
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
                            field: field,
                            onHighlight: function(bEnable, meta){
                                $this.highlightConnector(this, bEnable, meta);
                            }
                        });
                        $this.rightFieldConnectors[field] = rightConnector;
					} else {
					    $this.fieldList.append(fElt);
					}
				})(f);
			}
			
			var nameCell = this.fieldList.find('.field .cell.name');
			var typeCell = this.fieldList.find('.field .cell.type');
			var fieldElt = this.fieldList.find('.field');
			nameCell.resizable({
				autoHide: true,
				handles: "e",
				alsoResize: nameCell,
				start: function(evt, ui){
					nameCell.resizable('option', 'minWidth', fieldElt.width() * 0.3);
					nameCell.resizable('option', 'maxWidth', fieldElt.width() * 0.7);
				},
				resize: function(evt, ui){
					var sz = nameCell.outerWidth();
					typeCell.css('width', 'calc(100% - '+ui.size.width+'px)');
					nameCell.css('height', '');
				}
			});
			
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
				this.editor.publish('DataCube.CubeEditor.providerNodeSelected', this.provider);
			} else {
				this.removeClass('selected');
				this.editor.publish('DataCube.CubeEditor.providerNodeDeselected', this.provider);
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