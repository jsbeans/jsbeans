/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.DynamicalScrollBox',
	$parent: 'JSB.Controls.ScrollBox',
	$client: {
	    $require: ['css:dynamicalScrollBox.css'],

		_controlHeight: 0,
		_items: [],
		_itemsContainer: null,

		$constructor: function(opts) {
			$base(opts);

			this._itemsContainer = this.$('<div class="itemsContainer"></div>');
			this.append(this._itemsContainer);

			this._controlHeight = this.getElement().height();

            this.getElement().scroll((evt) => {
                this.updateList(evt);
            });

            this.getElement().visible((evt, isVisible) => {
                if (isVisible) {
                    this.updateList(evt);
                }
            });

            this.getElement().resize(() => {
                this._controlHeight = this.getElement().height();

                JSB.defer(() => {
                    this.refresh();
                }, 500, 'dynamicalScrollBox_' + this.getId());
            });
		},

        options: {
            itemHeight: null
        },

        updateList: function (evt) {
            let scrollTop = evt.target.scrollTop,
                visibleHeight = evt.target.clientHeight;

            // detach hidden
            this._itemsContainer.children().each(function (index) {
                // скролл вниз - убираем невидимые элементы сверху
                if(scrollTop > this.offsetTop + $this.options.itemHeight) {
                    $this._itemsContainer.get(0).removeChild(this);
                }

                // скролл вниз - убираем невидимые элементы снизу
                if(scrollTop + visibleHeight < this.offsetTop) {
                    $this._itemsContainer.get(0).removeChild(this);
                }
            });

            this._items.forEach((item) => {
                if(item.hidden) {
                    return this;
                }

                let cssTop = item.element.css('top'),
                    offsetTop = Number(cssTop.substring(0, cssTop.length - 2));

                if(offsetTop >= scrollTop && offsetTop <= scrollTop + visibleHeight) {
                    this._itemsContainer.append(item.element);
                }
            });
        },

        addItem: function(item) {
            this._items.push(item);

            if(item.hidden) {
                return this;
            }

            if(this._controlHeight === 0) {
                let elementHeight = this.getElement().height();

                if(elementHeight > this._controlHeight) {
                    this._controlHeight = elementHeight;
                }
            }

            let curHeight = this._itemsContainer.height();

            item.element.css({
                height: this.options.itemHeight + 'px',
                top: curHeight
            });

            this._itemsContainer.height(curHeight + this.options.itemHeight);

            if(curHeight - this._itemsContainer.scrollTop() < this._controlHeight) {
                this._itemsContainer.append(item.element);
            }

            return this;
        },

        addItems: function(items) {
            items.forEach((item) => {
                this.addItem(item);
            });

            return this;
        },

		/**
         * Очищает элемент.
         */
		clear: function() {
			this.getItems().forEach((item) => {
			    item.element.detach();
			});

			this._itemsContainer.height(0);

			this._items = [];

			return this;
		},

		filter: function(filterFunc) {
		    this.getItems().forEach((item) => {
		        if(filterFunc.call(this, item)) {
		            item.hidden = false;
		        } else {
		            item.hidden = true;
		        }
		    });

		    this.refresh();
		},

		getItem: function(key) {
		    return this._items.find((item) => {
		        return item.key === key;
		    });
		},

		getItems: function() {
		    return this._items;
		},

		refresh: function() {
		    let items = this.getItems();

		    this.clear().addItems(items);
		},

		removeItem: function(key) {
		    let item = this.getItem(key);

		    if(item) {
		        item.element.remove();

		        this._itemsContainer.height(this._itemsContainer.height() - this.options.itemHeight);

		        this._items.splice(this._items.indexOf(item), 1);
		    }

		    return this;
		},

		sort: function(sortFunc) {
		    this.getItems().sort(sortFunc);

		    this.refresh();
		}
	}
}