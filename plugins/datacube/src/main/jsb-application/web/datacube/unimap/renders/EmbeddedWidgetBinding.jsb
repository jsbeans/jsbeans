/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'Unimap.Render.EmbeddedWidgetBinding',
	$parent: 'Unimap.Render.Basic',

	$alias: 'embeddedWidget',

	$client: {
	    _beans: [],

	    $require: ['JSB.Controls.Checkbox',
	               'jQuery.UI.Droppable',
	               'DataCube.Renderers.EmbededWidgetRenderer',
	               'css:EmbeddedWidgetBinding.css'],

	    construct: function(){
	        this.addClass('embeddedWidgetBindingRender');

	        if(this._scheme.optional){
	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                onChange: function(b){
	                    $this._values.checked = b;
	                }
	            });

	            this.prepend(checkBox);

	            this._beans.push(checkBox);
	        }

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createRequireDesc(name);
	        this.createDescription(name);

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0]);
	        } else {
	            this.addItem();
	        }
	    },

	    addItem: function(values){
	        if(!values){
	            values = {
	                value: {}
	            };
	            this._values.values.push(values);
	        }

	        this._item = this.$('<div class="item">Перетащите виджет</div>');

            this._item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
							if(JSB.isInstanceOf(d.get(0).draggingItems[i], "DataCube.Renderers.WidgetRegistryRenderer")){
								return true;
							}
                        }
                    }
                    return false;
                },
                tolerance: 'pointer',
                greedy: true,
                activeClass : 'acceptDraggable',
                hoverClass: 'hoverDraggable',
                drop: function(evt, ui){
                    var d = ui.draggable;

                    for(var i in d.get(0).draggingItems){
                        $this._values.values[0] = {
                            binding: {name: d.get(0).draggingItems[i].getObject().name, jsb: d.get(0).draggingItems[i].getObject().jsb},
                            value: {}
                        }
                        $this.setValue({name: d.get(0).draggingItems[i].getObject().name, jsb: d.get(0).draggingItems[i].getObject().jsb}, true);
                        break;
                    }
                }
            });

            this.append(this._item);

	        this._values.valueSkipping = JSB.isDefined(this._values.valueSkipping) ? this._values.valueSkipping : true;

	        var checkBox = new Checkbox({
	            checked: this._values.valueSkipping,
	            cssClass: 'valueSkipping',
	            label: 'Проброс значений',
	            onChange: function(b){
	                $this._values.valueSkipping = b;

                    if(b){
                        $this.childSourceBinding && $this.childSourceBinding.disable();
                    } else {
                        $this.childSourceBinding && $this.childSourceBinding.enable();
                    }
	            }
	        });
	        this.append(checkBox);

	        this._beans.push(checkBox);

            if(values.binding){
                this.setValue(values.binding);
            }
        },

        changeLinkTo: function(values){
            //debugger;
        },

        constructScheme: function(jsb){
            if(this._innerController){
                this._innerController.destroy();
            }

            JSB.lookup(jsb, function(wCls){
                $this._innerController = $this.createInnerScheme(wCls.jsb.$scheme, $this._values.values[0].value, function(){
                    $this._values.values[0].linkedFields = $this._innerController.getLinkedFields();
                });
                $this.append($this._innerController);

                $this._values.values[0].linkedFields = $this._innerController.getLinkedFields();

                var sb = $this._innerController.findRendersByRender('sourceBinding');

                if(sb.length > 0 && !sb[0].getValues().binding){
                    var parentSourceBinding = $this.getSchemeController().findRendersByRender('sourceBinding');

                    if(parentSourceBinding.length > 0){
                        sb[0].setDataScheme(parentSourceBinding[0].getDataSchemes()[0], null, 0, function(){
                            sb[0].changeBinding(0);
                            sb[0].disable();
                        });
                    }
                }

                if(sb.length > 0){
                    $this.childSourceBinding = sb[0];
                }
            });
        },

        destroy: function(){
            for(var i = 0; i < this._beans.length; i++){
                this._beans[i].destroy();
            }

            if(this.render){
                this.render.destroy();
            }

            if(this._innerController){
                this._innerController.destroy();
            }

            $base();
        },

        removeBinding: function(){
            this.render.destroy();
            this._item.find('.btnDelete').remove();
            this._item.removeClass('filled');
            this._item.text('Перетащите виджет');
            this._innerController.destroy();
            this.childSourceBinding = null;

            $this._values.values[0] = {
                value: {}
            };
        },

        setValue: function(wDesc, event){
            if(this.render){
                this.render.destroy();
                this._item.find('.btnDelete').remove();
            }

			this.render = new EmbededWidgetRenderer(wDesc, {});
			this._item.empty();
			this._item.prepend(this.render.getElement());
			this._item.addClass('filled');

            var removeButton = $this.$('<i class="btn btnDelete fas fa-times-circle" title="Удалить"></i>');
            removeButton.click(function(evt){
                evt.stopPropagation();
                $this.removeBinding();
            });
            this._item.append(removeButton);

			this.constructScheme(wDesc.jsb);

			if(event){
			    this.onchange();
			}
        }
	}
}