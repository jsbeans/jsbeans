{
	$name: 'DataCube.CubePanel',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $require: ['JSB.Controls.ScrollBox',
                   'JSB.Widgets.Button',
                   'JSB.Widgets.TreeView',
                   'JSB.Widgets.ToolBar',
                   'JSB.Widgets.ToolManager'
        ],

        $constructor: function(opts){
            $base(opts);

            $jsb.loadCss('CubePanel.css');
            this.addClass('cubePanel');

            var caption = this.$('<header>Измерения куба</header>');
            this.append(caption);

            this.toolbar = new ToolBar();
            this.append(this.toolbar);

			this.toolbar.addItem({
				key: 'add',
				tooltip: 'Добавить измерение',
				element: '<div class="icon"></div>',
				click: function(){
                    $this.$('body').addClass('copyCursor');

                    $this.$(document).on('keyup.startAddDimension', function(e) {
                        if (e.key === "Escape") {
                            $this.publish('DataCube.CubeEditor.stopAddDimension');
                        }
                    });

                    $this.publish('DataCube.CubeEditor.startAddDimension');
				}
			});

			var removeBtn = this.toolbar.addItem({
				key: 'remove',
				tooltip: 'Удалить измерения',
				element: '<div class="icon"></div>',
				disabled: true,
				click: function(){
                    ToolManager.showMessage({
                        icon: 'removeDialogIcon',
                        text: 'Вы уверены что хотите удалить выбранные элементы?',
                        buttons: [{text: 'Удалить', value: true},
                                  {text: 'Нет', value: false}],
                        target: {
                            selector: removeBtn.wrapper
                        },
                        constraints: [{
                            weight: 10.0,
                            selector: removeBtn.wrapper
                        }],
                        callback: function(bDel){
                            if(bDel){
                                $this.removeDimensions();
                            }
                        }
                    });
				}
			});

			this.dimensions = new TreeView({
				selectMulti: true,
				onSelectionChanged: function(key, obj){
				    $this.toolbar.enableItem('remove', key);
				},
				onNodeHighlighted: function(key, bHighlighted, evt){
				    $this.publish('DataCube.CubeEditor.dimensionHighlighted', {
				        isHighlighted: bHighlighted,
				        key: key
				    });
				}
			});
			this.append(this.dimensions);

            this.subscribe('DataCube.CubeEditor.stopAddDimension', function(sender, msg, obj){
                $this.$(document).off('keyup_startAddDimension');

                $this.$('body').removeClass('copyCursor');

                if(obj){
                    $this.addDimension(obj);
                }
            });
        },

        addDimension: function(obj){
            this.cube.server().addDimension(obj.field, function(res, fail){
                if(!fail){
                    $this.dimensions.addNode({
                        key: obj.field,
                        element: $this.$('<div class="dimension">' + obj.field + '</div>')
                    });

                    $this.publish('DataCube.CubeEditor.addDimension', obj.field);
                }
            });
        },

        refresh: function(cube, dimensions){
            this.cube = cube;

            this.dimensions.clear();

            for(var i in dimensions){
                this.dimensions.addNode({
                    key: i,
                    element: this.$('<div class="dimension">' + i + '</div>')
                });
            }
        },

        removeDimensions: function(){
            var selected = this.dimensions.getSelected(),
                keys = [];

            if(!JSB.isArray(selected)){
                selected = [selected];
            }

            for(var i = 0; i < selected.length; i++){
                keys.push(selected[i].key);
            }

            this.cube.server().removeDimension(keys, function(res, fail){
                if(!fail){
                    for(var i = 0; i < keys.length; i++){
                        $this.dimensions.deleteNode(keys[i]);
                    }
                }
            });
        }
    }
}