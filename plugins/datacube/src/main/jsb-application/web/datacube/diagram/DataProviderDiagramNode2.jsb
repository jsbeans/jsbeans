{
	$name: 'DataCube.DataProviderDiagramNode2',
	$parent: 'JSB.Widgets.Diagram.Node',
	$client: {
	    $require: ['JSB.Controls.Button',
	               'JSB.Controls.Checkbox',
	               'JSB.Controls.ScrollBox',
	               'JSB.Controls.Select',
	               'JSB.Widgets.RendererRepository',
	               'JSB.Widgets.ToolManager'],

		options: {
			onSelect: function(bEnable){
				//
			},
			onRemove: function(){},
			onPositionChanged: function(x, y){
			    var self = this;

				if(this.editor.ignoreHandlers){
					return;
				}
				JSB.defer(function(){
					self.editor.cubeEntry.server().updateDataProviderNodePosition(self.provider.getId(), {x: x, y: y});
				}, 500, 'dataProviderResize_' + this.getId());
			}
		},

	    $constructor: function(diagram, key, opts){
	        $base(diagram, key, opts);

	        this.provider = opts.provider;
	        this.editor = opts.editor;
	        this.fields = opts.fields;

			this.loadCss('DataProviderDiagramNode.css');
			this.addClass('dataProviderDiagramNode');

			// caption
			this.caption = this.$('<div class="caption"></div>');
			this.append(this.caption);
			var renderer = RendererRepository.createRendererFor(this.provider.entry, {showSource: true});
			this.caption.append(renderer.getElement());

			// refresh btn
			var refreshButton = new Button({
				cssClass: 'btnRefresh',
				tooltip: 'Обновить схему данных',
				hasIcon: true,
				hasCaption: false,
				onClick: function(evt){
					evt.stopPropagation();

					// todo: refresh scheme

					//$this.refreshScheme();
				}
			});
			this.caption.append(refreshButton.getElement());

			// remove btn
			this.removeButton = new Button({
				cssClass: 'btnDelete',
				tooltip: 'Удалить',
				hasIcon: true,
				hasCaption: false,
				onClick: function(evt){
					evt.stopPropagation();

					ToolManager.showMessage({
                        icon: 'removeDialogIcon',
                        text: 'Вы уверены что хотите удалить провайдер?',
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
                            // todo: remove into provider entry
                        }
                    });
				}
			});
			this.caption.append(this.removeButton.getElement());

			// body
			this.body = this.$('<div class="body"></div>');
			this.append(this.body);

			this.loadingMsg = this.$('<div class="loading hidden"><div class="icon"></div><div class="text">Загрузка схемы данных...</div></div>');
			this.body.append(this.loadingMsg);

			this.failedMsg = this.$('<div class="failed hidden"><div class="icon"></div><div class="text">MSG</div><div class="details"></div></div>');
			this.body.append(this.failedMsg);

			// toolbar
			this.toolbar = this.$('<div class="toolbar"></div>');
            this.append(this.toolbar);

            /*
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
            */

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

			this.getElement().resize(function(){
			    if($this.editor.cubeEntry){
                    JSB.defer(function(){
                        $this.editor.cubeEntry.server().updateDataProviderNodePosition($this.provider.getId(), null, {width: $this.getElement().width()});
                    }, 300, 'dataProviderResize_' + $this.getId());
			    }
			});

			this.refresh();
	    },

	    enableUseComments: function(isEnable){
	        if(isEnable && this.fields.commentsType){
	            if(!this.useCommentsBtn){
                    this.useCommentsBtn = new Button({
                        //
                    });
                    this.toolbar.append(useCommentsBtn.getElement());
	            }

	            if(!this.commentsList){
                    this.commentsList = new Select({
                        cssClass: 'commentsList',
                        onchange: function(val){
                            $this.refresh(true, {commentField: val.key});
                            $this.provider.options.commentField = val.key; // todo
                            /*
                            $this.editor.cubeEntry.server().changeProviderOptions($this.provider.getId(), {commentField: val.key}, function(){
                                $this.provider.options.commentField = val.key;
                                $this.refreshScheme(true);
                            });
                            */
                        }
                    });
                    this.toolbar.append(this.commentsList.getElement());
                }
	        } else {
	            if(this.useCommentsBtn){
	                this.useCommentsBtn.destroy();
	            }

	            if(this.commentsList){
	                this.commentsList.destroy();
	            }
	        }
	    },

	    loadScheme: function(loadOpts, callback){
//todo: loadOpts
	        this.loadingMsg.removeClass('hidden');
			this.editor.cubeEntry.server().extractDataProviderFields($this.provider.getId(), function(fields, fail){
			    $this.loadingMsg.addClass('hidden');

				if(fail){
				    $this.failedMsg.removeClass('hidden');
					$this.failedMsg.find('.text').text('Ошибка загрузки схемы');
					$this.failedMsg.find('.details').text(fail.message);
				} else {
				    $this.failedMsg.addClass('hidden');
					$this.fields = fields;
					callback.call($this);
				}
			});
	    },

	    refresh: function(needReload, reloadOpts){
	        if(!this.fields || needReload){
	            this.loadScheme(reloadOpts, this.refresh);
	            return;
	        }

	        var fieldsElements = d3.select(this.fieldList.getElement().get(0));
	        // enter
	        fieldsElements.selectAll('div.field').data(this.fields.fields).enter().append('div').classed('field', true);

            fieldsElements.selectAll('div.field')
	            // name
	            .append('div').classed('cell name', true);
            fieldsElements.selectAll('div.field')
	            // type
	            .append('div').classed('cell type', true);

	        // update
	        fieldsElements.selectAll('div.field').data(this.fields.fields).attr('key', function(d){
	                return d.key;
	            })
	            .select('.name').text(function(d){
	                return d.name;
	            });
            fieldsElements.selectAll('div.field').data(this.fields.fields).select('.type').text(function(d){
	                return d.type;
	            });

	        // exit
	        fieldsElements.selectAll('div.field').data(this.fields.fields).exit().remove();
	    }
	}
}