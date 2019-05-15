{
	$name: 'DataCube.Query.ItemList',
	$parent: 'JSB.Controls.Control',
    $client: {
    	$require: ['JSB.Controls.ScrollBox',
    	           'JSB.Workspace.SearchEditor',
    	           'css:ItemList.css'],

    	_categoriesList: {},
    	_itemList: {},

        $constructor: function(opts) {
            $base(opts);

            this.addClass('queryItemList');

            this._searchEl = new SearchEditor({
                onChange: function(txt){
                    $this.search(txt && txt.toLowerCase());
                }
            });
            this.append(this._searchEl);

            this._items = this.$('<div class="items"></div>');
            this.append(this._items);

            if(this.options.categories) {
                for(var i in this.options.categories) {
                    this.addCategory(i, this.options.categories[i].displayName, true);
                }
            }

            if(this.options.items){
                for(var i = 0; i < this.options.items.length; i++){
                    this.addItem(this.options.items[i]);
                }
            }

            this.sortCategories();

            this.selectDefaultCategory();
        },

        options: {
            items: undefined,
            itemRender: null,
            onSelect: null
        },

        addCategory: function(key, name, noSort){
            if(!this._categories){
                this._categories = this.$('<ul class="categories"></ul>');
                this._searchEl.getElement().after(this._categories);
            }

            var categoryLabel = this.$('<li>' + name + '</li>');
            this._categories.append(categoryLabel);
            categoryLabel.click(function(evt){
                evt.stopPropagation();

                $this.selectCategory(key);
            });

            var categoryItem = new ScrollBox({
                cssClass: 'categoryItem',
                xAxisScroll: false
            });
            this._items.append(categoryItem);

            this._categoriesList[key] = {
                categoryLabel: categoryLabel,
                items: {},
                itemsList: categoryItem
            };

            if(!noSort){
                this.sortCategories();
            }
        },

        addItem: function(itemDesc){    // item, key, category
            if(this._itemList[itemDesc.key]) {
                throw Error('Элемент с таким ключом уже существует');
            }

            var el = this.$('<div class="item"></div>');

            if(this.options.itemRender){
                this.options.itemRender.call(this, el, itemDesc)
            } else {
                el.append(itemDesc.item);
            }

            this._itemList[itemDesc.key] = {
                category: itemDesc.category,
                item: el,
                itemDesc: itemDesc
            };

            if(itemDesc.category){
                if(!this._categoriesList[itemDesc.category]) {
                    this.addCategory(itemDesc.category, itemDesc.category, true);
                }

                this._categoriesList[itemDesc.category].itemsList.append(el);
                this._categoriesList[itemDesc.category].items[itemDesc.key] = this._itemList[itemDesc.key];
            } else {
                this._items.append(el);
            }

            if(JSB.isDefined(itemDesc.allowSelect) && !itemDesc.allowSelect){
                el.addClass('noSelect');
                return;
            }


            if(this.options.onSelect){
                el.click(function(evt){
                    evt.stopPropagation();

                    $this.options.onSelect.call($this, itemDesc);
                });
            }
        },

        allowItems: function(items, categories){
            var allowCategories = {};

            if(categories){
                for(var i = 0; i < categories.length; i++){
                    allowCategories[categories[i]] = true;
                }
            }

            for(var i in this._itemList){
                if(items.indexOf(i) > -1){
                    this._itemList[i].item.removeClass('hidden');
                    allowCategories[this._itemList[i].category] = true;
                } else {
                    if(categories.indexOf(this._itemList[i].category) === -1){
                        this._itemList[i].item.addClass('hidden');
                    } else {
                        this._itemList[i].item.removeClass('hidden');
                    }
                }
            }

            for(var i in this._categoriesList){
                if(!allowCategories[i]){
                    this._categoriesList[i].categoryLabel.addClass('hidden');
                }
            }

            this.selectDefaultCategory();
        },

        clear: function() {
            for(var i in this._itemList){
                this._itemList[i].item.remove();
            }

            this._itemList = {};

            for(var i in this._categoriesList){
                this._categoriesList[i].categoryLabel.remove();
                this._categoriesList[i].categoryItem.destroy();
            }

            this._categoriesList = {};
        },

        clearCategory: function(key){
            if(this._categoriesList[key]){
                this._categoriesList[key].itemsList.clear();

                for(var i in this._categoriesList[key].items) {
                    delete this._itemList[i];
                }

                this._categoriesList[key].items = {};
            }
        },

        hideCategory: function(key, isHide) {
            if(isHide){
                this._categoriesList[key].categoryLabel.addClass('hidden');
            } else {
                this._categoriesList[key].categoryLabel.removeClass('hidden');
            }
        },

        removeItem: function(key){},

        search: function(text){
            if(text){
                for(var i in this._itemList){
                    if(this._itemList[i].itemDesc.searchId){
                        if(this._itemList[i].itemDesc.searchId.toLowerCase().indexOf(text) > -1){
                            this._itemList[i].item.removeClass('searchHidden');
                        } else {
                            this._itemList[i].item.addClass('searchHidden');
                        }
                    } else {
                        // todo
                    }
                }

                for(var i in this._categoriesList){
                    if(this._categoriesList[i].itemsList.children(':not(.searchHidden)').length === 0){
                        this._categoriesList[i].categoryLabel.addClass('searchHidden');
                    } else {
                        this._categoriesList[i].categoryLabel.removeClass('searchHidden');
                    }
                }
            } else {
                for(var i in this._itemList){
                    this._itemList[i].item.removeClass('searchHidden');
                }

                for(var i in this._categoriesList){
                    this._categoriesList[i].categoryLabel.removeClass('searchHidden');
                }
            }
        },

        selectCategory: function(key){
            for(var i in this._categoriesList){
                this._categoriesList[i].categoryLabel.removeClass('selected');
                this._categoriesList[i].itemsList.removeClass('selected');
            }

            if(this._categoriesList[key]){
                this._categoriesList[key].categoryLabel.addClass('selected');
                this._categoriesList[key].itemsList.addClass('selected');
            }
        },

        selectDefaultCategory: function(){
            for(var i in this._categoriesList){
                if(!this._categoriesList[i].categoryLabel.hasClass('hidden')){
                    this.selectCategory(i);
                    return;
                }
            }
        },

        selectItem: function(key){
            this.selectCategory(this._itemList[key].category);

            for(var i in this._itemList){
                this._itemList[i].item.removeClass('selected');
            }

            this._itemList[key].item.addClass('selected');
        },

        showAll: function() {
            for(var i in this._itemList){
                this._itemList[i].item.removeClass('hidden');
            }

            for(var i in this._categoriesList){
                this._categoriesList[i].categoryLabel.removeClass('hidden');
            }
        },

        sortCategories: function(){
            if(!this._categories){
                return;
            }

		    var categories = this._categories.children();

		    categories.sort(function(a, b){
		        a = $this.$(a).text();
		        b = $this.$(b).text();

                if(a > b){
                    return 1;
                }

                if(a < b){
                    return -1;
                }

                return 0;
		    });

		    categories.detach().appendTo(this._categories);
        }
    }
}