/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

 /**
  * @name         JSB.Controls.TabView
  * @module       JSB.Controls
  * @description  Компонент для отображения контента в нескольких вкладках
  * @author       Leonid Simakov
  * @copyright    (c) 2019 Leonid Simakov <lasimakov@gmail.com>
  * @copyright    (c) 2019 Special Information Systems, LLC <info@sis.ru>
  * @license      MIT Licence
  */

{
	$name: 'JSB.Controls.TabView',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['JSB.Controls.ScrollPanel',
		           'css:tabView.css'],

        _currentTab: null,
        _tabPane: null,
        _tabs: {},
        _contentPane: null,
		
		$constructor: function(opts) {
			$base(opts);

			this.addClass('jsb-tabview');

			this.addClass(this.options.tabPosition + 'TabPosition');

			if(this.options.scrollTab) {
			    this._tabPane = new ScrollPanel({
			        cssClass: 'tabPane',
			        position: this.options.tabPosition === 'top' || this.options.tabPosition === 'bottom' ? 'horizontal' : 'vertical',
			        onClick: function(elementDesc) {
			            $this.switchTab(elementDesc.key);
			        }
			    });
			} else {
                this._tabPane = this.$('<ul class="tabPane"></ul>');
            }

            this._contentPane = this.$('<div class="contentPane"></div>');
            this.append(this._contentPane);

            if(this.options.tabPosition === 'left' || this.options.tabPosition === 'top') {
                this.prepend(this._tabPane);
            } else {
                this.append(this._tabPane);
            }

            if(!this.options.showTabs) {
                this._tabPane.addClass('hidden');
            }
		},

		options: {
		    /*
		    todo:
            allowCloseTab: true,
            allowNewTab: true,
		    */

		    scrollTab: false,
			tabPosition: 'top',
			showTabs: true,
			switchOnCreate: false
		},

	    /**
	    * Добавление новой вкладки
	    *
	    * @param {object} options - объект опций новой вкладки
	    * @param {*} options.content - содержимое вкладки
	    * @param {boolean} [options.hasIcon] - содержит ли заголовок вкладки иконку
	    * @param {number|string} options.id - уникальный идентификатор вкладки
	    * @param {string} options.title - заголовок вкладки
	    */
		addTab: function(options) {
			let icon = this.$('<i class="icon"></i>'),
			    id = options.id || JSB().generateUid(),
                tab,
                title = this.$('<span class="title">' + options.title + '</span>');

            if(this.options.scrollTab) {
                tab = this.$('<div class="tab"></div>');
            } else {
                tab = this.$('<li class="tab" clientId="' + id + '"></li>');

    			tab.click(function(evt) {
                    $this.switchTab(id);
    			});
            }

            if(options.desc) {
                title.attr('title', options.desc);
            }

            tab.append(title);

            if(options.hasIcon) {
                tab.prepend(icon);
            }

			this._tabs[id] = {
			    iconElement: icon,
			    options: options,
			    tabElement: tab,
			    titleElement: title
			};

			if(this.options.scrollTab) {
			    this._tabPane.addElement({
			        element: tab,
			        key: id,
			        onClick: () => {
			            this.switchTab(id);
			        }
			    });
			} else {
			    this._tabPane.append(tab);
            }

			if(this.options.switchOnCreate) {
			    this.switchTab(id);
			}

			if(options.disabled) {
				this.enableTab(id, false);
			}

			return this._tabs[id];
		},

	    /**
	    * Очистить компонент
	    */
		clear: function() {
            this._currentTab = null;

            if(this.options.scrollTab) {
                this._tabPane.clear();
            } else {
                this._tabPane.empty();
            }

            this._tabs = {};
            this._contentPane.empty();
		},

	    /**
	    * Сделать вкладку активной/неактивной
	    *
	    * @param {number|string} id - идентификатор вкладки
	    * @param {boolean} isEnable - вкладка активна?
	    */
		enableTab: function(id, isEnable) {
		    var tab = this._getTab(id);

			if(b) {
			    tab.tabElement.removeClass('disabled');
			} else {
				tab.tabElement.addClass('disabled');
			}
		},

		filter: function(filterCallback) {
		    var tabs = this._getTab();

		    for(let i in tabs) {
		        filterCallback.call(this, i, tabs[i]);
		    }
		},

		getContentPane: function() {
		    return this._contentPane;
		},

	    /**
	    * Вернуть текущую вкладку
	    *
	    * @return {object} объект-описание активной вкладки
	    */
		getCurrentTab: function() {
			return this._currentTab;
		},

	    /**
	    * Вернуть контент вкладки
	    *
	    * @return {*} контент вкладки
	    */
		getTabContent: function(id) {
		    let tab = this._getTab(id);

		    if(tab) {
		        return tab.options.content;
		    }
		},

		getTabPane: function() {
		    return this._tabPane;
		},

		hasTab: function(id) {
		    return this._getTab(id) ? true : false;
		},

	    /**
	    * Удаляет вкладку
	    *
	    * @param {number|string} id - идентификатор вкладки
	    */
		removeTab: function(id) {
		    var currentTab = this.getCurrentTab(),
		        tab = this._getTab(id);

		    if(currentTab.id === id) {
		        for(let i in this._getTab()) {
		            this.switchTab(i);
		            break;
		        }
		    }

		    if(JSB.isFunction(tab.options.content.destroy)) {
		        tab.options.content.destroy();
		    }

		    if(this.options.scrollTab) {
		        this._tabPane.removeElement(id);
		    } else {
		        tab.titleElement.remove();
            }

		    delete this._tabs[id];
		},

	    /**
	    * Установить иконку вкладки
	    *
	    * @param {number|string} id - идентификатор вкладки
	    * @param {string} title - иконка вкладки
	    */
		setTabIcon: function(id, icon) {
		    var tab = this._getTab(id);

		    tab.iconElement.css('background-image', 'url(' + icon + ')');
		},

	    /**
	    * Установить заголовок вкладки
	    *
	    * @param {number|string} id - идентификатор вкладки
	    * @param {string} title - заголовок вкладки
	    */
		setTabTitle: function(id, title) {
		    var tab = this._getTab(id);

		    tab.titleElement.text(title);
		},

	    /**
	    * Сделать все вкладки видимыми/невидимыми
	    *
	    * @param {boolean} isShow - видимость
	    */
		showAll: function(isShow) {
		    var tabs = this._getTab();

		    for(let i in tabs) {
		        this.showTab(i, isShow);
		    }
		},

	    /**
	    * Сделать вкладку видимой/невидимой
	    *
	    * @param {number|string} id - идентификатор вкладки
	    * @param {boolean} isShow - вкладка видна?
	    */
		showTab: function(id, isShow) {
		    var tab = this._getTab(id);

			if(isShow) {
			    tab.tabElement.removeClass('hidden');
			} else {
				tab.tabElement.addClass('hidden');
			}
		},

	    /**
	    * Сортирует табы
	    *
	    * @param {function} [sortCallback] - функция сортировки. Если не указана, то сортирует по заголовкам табов
	    */
		sort: function(sortCallback) {
            if(!sortCallback) {
                sortCallback = function(a, b) {
                    if(a.options.title > b.options.title) return 1;
                    if(a.options.title < b.options.title) return -1;
                    return 0;
                };
            }

            if(this.options.scrollTab) {
                this._tabPane.sort((a, b) => {
                    return sortCallback.call(this, this._getTab(a.key), this._getTab(b.key));
                });
            } else {
                let tabsArr = [],
                    tabs = this._getTab();

                for(let i in tabs) {
                    tabs[i].tabElement.detach();
                    tabsArr.push(tabs[i]);
                }

                tabsArr.sort(sortCallback);

                for(let i = 0; i < tabsArr.length; i++) {
                    this._tabPane.append(tabsArr[i].tabElement);
                }
            }
		},

	    /**
	    * Делает текущей вкладку с указанным id
	    *
	    * @param {number|string} id - идентификатор вкладки
	    */
		switchTab: function(id) {
			var currentTab = this.getCurrentTab(),
			    tab = this._getTab(id);

            if(currentTab) {
                if(currentTab.id === id) {
                    return;
                }

                currentTab.tabElement.removeClass('active');

                currentTab.options.content.detach();
            }

            tab.tabElement.addClass('active');

            // если контент - конструктор элемента, то сперва создадим элемент
            if(JSB.isFunction(tab.options.content)) {
                tab.options.content = new tab.options.content();
            }

            this._contentPane.append(tab.options.content);

            this._currentTab = tab;

			if(this.options.onSwitchTab) {
				this.options.onSwitchTab.call(this, id);
			}
		},

	    /**
	    * Получить вкладку
	    *
	    * @param {number|string} [id] - идентификатор вкладки. Если не указан, то вернёт карту вкладок
	    *
	    * @return {object} объект-описание активной вкладки | карта вкладок
	    */
		_getTab: function(id) {
		    if(JSB.isDefined(id)) {
		        return this._tabs[id];
		    }

		    return this._tabs;
		}
	}
}