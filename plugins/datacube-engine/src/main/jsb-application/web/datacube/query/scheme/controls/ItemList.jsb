{
	$name: 'DataCube.Query.ItemList',
	$parent: 'JSB.Controls.Control',
    $client: {
    	$require: ['css:ItemList.css'],

    	_categoriesList: {},
    	_itemList: {},

        $constructor: function(opts) {
            $base(opts);

            this.addClass('queryItemList');

            this._items = this.$('<div class="items"></div>');
            this.append(this._items);

            if(this.options.categories){
                this._categories = this.$('<ul class="categories"></ul>');
                this.prepend(this._categories);

                for(var i = 0; i < this.options.categories.length; i++){
                    this.addCategory(this.options.categories[i]);
                }
            }
        },

        options: {
            categories: undefined,
            onSelect: null
        },

        addCategory: function(category){
            var categoryLabel = this.$('<li>' + category + '</li>');
            this._categories.append(categoryLabel);
            categoryLabel.click(function(){
                //
            });

            var categoryItem = this.$('<div class="categoryItem" key=["' + category + '"]></div>');
            this._items.append(categoryItem);

            if(Object.keys(this._categoriesList).length === 0){
                categoryLabel.addClass('selected');
            }

            this._categoriesList[category] = {
                categoryLabel: categoryLabel,
                itemsList: categoryItem
            };
        },

        addItem: function(item, key, category){
            var el = this.$('<div class="item"></div>');
            el.append(item);

            this._itemList[key] = {
                category: category,
                item: el
            };

            if(category){
                if(!this._categoriesList[category]){
                    this.addCategory(category);
                }

                this._categoriesList[category].itemsList.append(el);
            } else {
                this._items.append(el);
            }

            el.click(function(){
                if($this.options.onSelect){
                    $this.options.onSelect.call($this, {
                        category: category,
                        item: item,
                        key: key
                    });
                }
            });
        },

        clearCategory: function(category){
            this._categoriesList[category].itemsList.empty();
        },

        hideCategories: function(categories){},

        hideItems: function(items){},

        removeItem: function(key){},

        selectCategory: function(category){
            //
        },

        selectItem: function(key){
            this.selectCategory(this._itemList[key].category);

            for(var i in this._itemList){
                this._itemList[i].item.removeClass('selected');
            }

            this._itemList[key].item.addClass('selected');
        }
    }
}