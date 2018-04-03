{
	$name: 'Unimap.Render.Group',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Panel', 'JSB.Controls.Checkbox'],
	$client: {
	    _childNames: [],

	    construct: function(opts){
	        this.addClass('groupRender');
	        this.loadCss('Group.css');

	        this.group = new Panel({
	        	toolbarPosition: 'left',
	            title: opts.name || this._values.name || this._scheme.name,
	            titleEditBtn: this._scheme.editableName,
                collapseBtn: this._scheme.collapsable,
                collapsed: this._scheme.collapsed,
                titleValidateFunction: function(val){
                    var parent = $this.getParent();
                    if(JSB.isObject(parent.isMultiple()) && parent.isMultiple().uniqueNames){
                        return (parent._childNames.indexOf(val) === -1);
                    }
                },
                onTitleEdited: function(val){
                    if($this._scheme.editableName && $this._scheme.editableName.commonField){
                        $this.getSchemeController().updateCommonFields(null, $this._scheme.editableName.commonField, val, opts.name || $this._values.name || $this._scheme.name);
                        $this._values.name = val;
                    }
                }
	        });
	        this.append(this.group);

	        if(this._scheme.editableName && this._scheme.editableName.commonField){
	            this.getSchemeController().updateCommonFields(null, this._scheme.editableName.commonField, opts.name || this._values.name || this._scheme.name);
	        }

	        var name = this.group.find('.header h1');
	        this.createDescription(name);

	        if(this._scheme.optional){
	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            this.checkBox = new Checkbox({
	                checked: this._values.checked,
	                onchange: function(b){
	                    $this._values.checked = b;
	                }
	            });
	            this.group.prepend(this.checkBox);
	        }

	        if(this._scheme.multiple){
                this.group.elements.content.sortable({
                    handle: '.sortableHandle',
                    update: function(){
                        $this.reorderValues();
                    }
                });

	            this.multipleBtn = this.$('<i class="multipleBtn fas fa-plus-circle"></i>');
	            this.multipleBtn.click(function(){
	                $this.addItem();
	            });
	            this.group.appendContent(this.multipleBtn);
	        }

            if(Object.keys(this._scheme.items).length === 1 && this._scheme.items[Object.keys(this._scheme.items)[0]].render === 'group'){
                this._childGroups = [];
            }

	        if(this._values.values.length > 0){
	            for(var i = 0; i < this._values.values.length; i++){
	                this.addItem(this._values.values[i], i);
	            }
	        } else {
	            if(!this._scheme.multiple){
                    this.addItem(null, 0);
                }
            }

            if(JSB.isObject(this._scheme.multiple) && this._scheme.multiple.uniqueNames){
                this._childNames = [];

                for(var i = 0; i < this._childGroups.length; i++){
                    this._childNames.push(this._childGroups[i].getName());
                }
            }
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};

	            for(var i in this._scheme.items){
	                values[i] = {};
	            }

	            this._values.values.push(values);

	            if(!itemIndex){
	                itemIndex = this._values.values.length - 1;
	            }

	            if(JSB.isObject(this._scheme.multiple) && this._scheme.multiple.uniqueNames){
	                var name = this._scheme.items[Object.keys(this._scheme.items)[0]].name,
	                    k = 1;
	                while(this._childNames.indexOf(name) > -1){
	                    name = this._scheme.items[Object.keys(this._scheme.items)[0]].name + ' ' + k;
	                    k++;
	                }

	                values.name = name;
	                this._childNames.push(name);
	            }
	        }

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem"></div>');

	            item.attr('idx', itemIndex);

	            item.append(`#dot
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);

                for(var i in this._scheme.items){
                    if(!values[i]){
                        values[i] = {};
                    }

                    var render = this.createRender(i, this._scheme.items[i], values[i], { name: values.name });

                    if(render){
                        item.append(render.getElement());
                    }

                    if(render && this._childGroups){
                        this._childGroups.push(render);
                    }
                }

                var dltBtn = this.$('<i class="dltBtn fas fa-times"></i>');
                dltBtn.click(function(){
                    $this.removeItem(item);
                });
                item.append(dltBtn);

                this.multipleBtn.before(item);
	        } else {
                for(var i in this._scheme.items){
                    if(!values[i]){
                        values[i] = {};
                    }

                    var render = this.createRender(i, this._scheme.items[i], values[i])
                    if(render){
                        this.group.appendContent(render);
                    }
                }
	        }
	    },

	    changeCommonGroup: function(){},

	    destroy: function(){
	        this.group && this.group.destroy();
	        this.checkBox && this.checkBox.destroy();

	        $base();
	    },

	    removeItem: function(item){
	        var items = this.group.getElement().find('>.content>.multipleItem'),
	            itemIndex = Number(item.attr('idx')),
	            name = this._values.values[itemIndex].name;

            if(this._childNames){
                this._childNames.splice(this._childNames.indexOf(name), 1);
            }

	        for(var i = 0; i < items.length; i++){
	            if(i === itemIndex){
	                items[i].remove();
	                this._values.values.splice(i, 1);
	                continue;
	            }

	            if(i > itemIndex){
	                this.$(items[i]).attr('idx', i - 1);
	            }
	        }

	        if(this._scheme.editableName && this._scheme.editableName.commonField){
                this.getSchemeController().updateCommonFields(null, this._scheme.editableName.commonField, null, this._values.name || this._scheme.name);
	        }
	    },

	    reorderValues: function(){
	        var items = this.group.getElement().find('>.content>.multipleItem');

	        for(var i = 0; i < items.length; i++){
	            var idx = Number(this.$(items[i]).attr('idx'));
	            if(idx !== i){
	                this.$(items[i]).attr('idx', i);

	                if(idx > i){
	                    var el = this._values.values.splice(idx, 1);
	                    this._values.values.splice(i, 0, el[0]);
	                }
	            }
	        }
	    }
	}
}