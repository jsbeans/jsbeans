{
	$name: 'Unimap.Render.EmbeddedWidgetBinding',
	$parent: 'Unimap.Render.Basic',
	$client: {
	    $require: ['JSB.Controls.Button', 'DataCube.Renderers.EmbededWidgetRenderer'],

	    construct: function(){
	        this.addClass('embeddedWidgetBindingRender');
	        this.loadCss('EmbeddedWidgetBinding.css');

	        if(this._scheme.optional){
	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                onchange: function(b){
	                    $this._values.checked = b;
	                }
	            });

	            this.prepend(checkBox);
	        }

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createDescription(name);

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0]);
	        } else {
	            this.addItem();
	        }
	    },

	    addItem: function(values){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        this._item = this.$('<div class="item"></div>');

            this._item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
							if(JSB.isInstanceOf(d.get(0).draggingItems[i], "DataCube.Widgets.WidgetListItem")){
								return true;
							}
                        }
                    }
                    return false;
                },
                tolerance: 'pointer',
                greedy: true,
                over: function(evt, ui){
                    if( !ui.helper.hasClass('accepted') ){
                        ui.helper.addClass('accepted');
                    }
                    $this._item.addClass('acceptDraggable');
                },
                out: function(evt, ui){
                    if( ui.helper.hasClass('accepted') ){
                        ui.helper.removeClass('accepted');
                    }
                    $this._item.removeClass('acceptDraggable');
                },
                drop: function(evt, ui){
                    var d = ui.draggable;
                    $this._item.removeClass('acceptDraggable');
                    for(var i in d.get(0).draggingItems){
                        $this.setValue({name: d.get(0).draggingItems[i].descriptor.name, jsb: d.get(0).draggingItems[i].descriptor.jsb});
                        break;
                    }
                }
            });

            this.append(this._item);
        },

        constructScheme: function(jsb){
            if(this._innerController){
                this._innerController.destroy();
            }

            JSB.lookup(jsb, function(wCls){
                $this._innerController = $this.createInnerScheme(wCls.jsb.$scheme, $this._values.values[0].value);
                $this.append($this._innerController);

                var sb = $this._innerController.findRendersByRender('sourceBinding');

                if(sb.length > 0 && !sb[0].getValues().binding){
                    var parentSourceBinding = $this.getSchemeController().findRendersByRender('sourceBinding');

                    if(parentSourceBinding.length > 0){
                        sb[0].setDataScheme(parentSourceBinding[0].getDataSchemes()[0], null, 0, function(){
                            sb[0].changeBinding(0);
                        });
                    }
                }
            });
        },

        removeBinding: function(){
            this.render.destroy();
            this.deleteBtn.destroy();
            this._item.removeClass('filled');
        },

        setValue: function(wDesc){
			this._values.values[0] = {
			    binding: wDesc,
			    value: {}
			}

            if(this.render){
                this.render.destroy();
            }

			this.render = new EmbededWidgetRenderer(wDesc, {});
			this._item.prepend(this.render.getElement());
			this._item.addClass('filled');

            this.deleteBtn = new Button({
                hasIcon: true,
                hasCaption: false,
                cssClass: 'btnDelete',
                tooltip: 'Удалить',
                onclick: function(evt){
                    evt.stopPropagation();
                    $this.removeBinding();
                }
            });
            this._item.append(this.deleteBtn.getElement());

			this.constructScheme(wDesc.jsb);

			this.options.onchange.call(this, this._values);
        }
	}
}