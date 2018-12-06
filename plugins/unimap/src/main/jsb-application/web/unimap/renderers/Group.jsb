{
	$name: 'Unimap.Render.Group',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Panel', 
	           'JSB.Controls.Checkbox',
	           'css:Group.css'],
	$client: {
	    _defaultSchemeOpts: {
	        sortable: true
	    },

	    construct: function(opts){
	        this.addClass('groupRender');

	        this._values.name = opts.name || this._values.name || this._scheme.name;

	        this.group = new Panel({
	        	toolbarPosition: 'left',
	            title: this._values.name,
	            titleEditBtn: this._scheme.editableName,
                collapseBtn: this._scheme.optional ? false : this._scheme.collapsible,
                collapsed: this._scheme.collapsed,
                titleValidateFunction: function(val){
                    var parent = $this.getParent();
                    if(JSB.isObject(parent.isMultiple()) && parent.isMultiple().uniqueNames){
                        return !parent._childNames[val];
                    }
                },
                onTitleEdited: function(val){
                    if($this._scheme.editableName){
                        var parent = $this.getParent();
                        if(JSB.isObject(parent.isMultiple()) && parent.isMultiple().uniqueNames){
                            delete parent._childNames[$this._values.name];

                            parent._childNames[val] = true;
                        }

                        if($this._scheme.editableName.commonField){
                            $this.getSchemeController().updateCommonFields(null, $this._scheme.editableName.commonField, val, $this._values.name);
                        }

                        $this._values.name = val;

                        $this.onchange();
                    }
                }
	        });
	        this.append(this.group);

	        if(this._scheme.editableName && this._scheme.editableName.commonField){
	            this.getSchemeController().updateCommonFields(null, this._scheme.editableName.commonField, this._values.name);
	        }

	        var name = this.group.find('.header h1');
	        this.createDescription(name);

	        if(this._scheme.optional){
	            var content = this.group.find('.content');

	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            if(!this._values.checked){
	                content.addClass('hidden');
	            }

	            this.checkBox = new Checkbox({
	                checked: this._values.checked,
	                onchange: function(b){
	                    $this._values.checked = b;

	                    content.toggleClass('hidden');

	                    $this.onchange();
	                }
	            });
	            this.group.prepend(this.checkBox);

	            name.click(function(){
	                $this.checkBox.toggleChecked();
	            });
	        }

	        if(this._scheme.multiple){
	            if(this._scheme.sortable){
                    this.group.elements.content.sortable({
                        handle: '.sortableHandle',
                        update: function(){
                            $this.reorderValues();
                        }
                    });
	            }

	            this.multipleBtn = this.$('<i class="btn btnMultiple fas fa-plus-circle"></i>');
	            this.multipleBtn.click(function(){
	                $this.addItem();

	                $this.onchange();
	            });
	            this.group.appendContent(this.multipleBtn);
	        }

            if(Object.keys(this._scheme.items).length === 1 &&
               this._scheme.items[Object.keys(this._scheme.items)[0]].render === 'group' &&
               JSB.isObject(this._scheme.multiple) &&
               this._scheme.multiple.uniqueNames){
                this._childNames = {};
            }

	        if(this._values.values.length > 0){
	            for(var i = 0; i < this._values.values.length; i++){
	                this.addItem(this._values.values[i], i);
	            }
	        } else {
                if(!this._scheme.items || Object.keys(this._scheme.items).length === 0){
                    this.addClass('hidden');
                    return;
                }

	            if(!this._scheme.multiple || JSB.isObject(this._scheme.multiple) && this._scheme.multiple.createDefault){
                    this.addItem(null, 0);
                }
            }
	    },

	    addItem: function(values, itemIndex){
	        var name;

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
	                var k = 1;

                    name = this._scheme.items[Object.keys(this._scheme.items)[0]].name;

	                while(this._childNames[name]){
	                    name = this._scheme.items[Object.keys(this._scheme.items)[0]].name + ' ' + k;
	                    k++;
	                }

	                this._childNames[name] = true;
	            }
	        }

	        var keys = Object.keys(this._scheme.items);
	        for(var i = 0; i < keys.length; i++){
	        	this._scheme.items[keys[i]]._order = i;
	        }

	        keys.sort(function(a, b){
	            var aPriority = JSB.isDefined($this._scheme.items[a].priority) ? $this._scheme.items[a].priority : 0.5,
	                bPriority = JSB.isDefined($this._scheme.items[b].priority) ? $this._scheme.items[b].priority : 0.5;

                if(aPriority > bPriority){
                    return -1;
                }

                if(aPriority < bPriority){
                    return 1;
                }

                return $this._scheme.items[a]._order - $this._scheme.items[b]._order;
	        });

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem"></div>');

	            item.attr('idx', itemIndex);

	            if(this._scheme.sortable){
	                item.addClass('sortable');

                    item.append(`#dot
                        <div class="sortableHandle">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    `);
                }

                for(var i = 0; i < keys.length; i++){
                    var k = keys[i];

                    if(!this._scheme.items[k].render){
                        continue;
                    }

                    if(!values[k]){
                        values[k] = {};
                    }

                    var render = this.createRender(k, this._scheme.items[k], values[k], { name: name });

                    if(render){
                        item.append(render.getElement());
                    }

                    if(this._childNames){
                        if(!name){
                            name = render.getName();
                        }

                        this._childNames[name] = true;
                    }
                }

                var dltBtn = this.$('<i class="btn btnDelete fas fa-times-circle"></i>');
                dltBtn.click(function(){
                    $this.removeItem(item, render);
                });
                item.append(dltBtn);

                this.multipleBtn.before(item);
	        } else {
                for(var i = 0; i < keys.length; i++){
                    var k = keys[i];

                    if(!this._scheme.items[k].render){
                        continue;
                    }

                    if(!values[k]){
                        values[k] = {};
                    }

                    var render = this.createRender(k, this._scheme.items[k], values[k])
                    if(render){
                        this.group.appendContent(render);
                    }
                }
	        }
	    },

	    changeCommonGroup: function(){},

	    changeLocalLink: function(values){
	        this.group.setTitle(values[0].value);
	        this._values.name = values[0].value;
	    },

	    destroy: function(){
	        this.group && this.group.destroy();
	        this.checkBox && this.checkBox.destroy();

	        $base();
	    },

	    removeItem: function(item, render){
	        var items = this.group.getElement().find('>.content>.multipleItem'),
	            itemIndex = Number(item.attr('idx'));

            if(this._childNames){
                var name = render.getName();

                delete this._childNames[name];

                if(render._scheme.editableName && render._scheme.editableName.commonField){
                    this.getSchemeController().updateCommonFields(null, render._scheme.editableName.commonField, null, name);
                }
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

	        $this.onchange();
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