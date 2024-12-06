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
  * @name         JSB.Controls.ScrollPanel
  * @module       JSB.Controls
  * @description  Компонент для прокручивания контента в горизонтальном или вертикальном направлениях. Содержит боковые кнопки прокрутки
  * @author       Leonid Simakov
  * @copyright    (c) 2019 Leonid Simakov <lasimakov@gmail.com>
  * @copyright    (c) 2019 Special Information Systems, LLC <info@sis.ru>
  * @license      MIT Licence
  */

{
	$name: 'JSB.Controls.ScrollPanel',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:ScrollPanel.css'],

	    _clickPosition: null,
	    _elements: [],
	    _isMouseDown: false,
	    _isMoved: false,
	    _panel: null,

	    $constructor: function(opts) {
	        $base(opts);

			this.addClass('jsb-scrollPanel');

			let isHorizontal = this.options.position === 'horizontal';

			function changeButtonVisibility(position) {
			    let isNextHide;

			    if(isHorizontal) {
			        isNextHide = $this._panel.outerWidth() - $this._panelList.width() >= position;
			    } else {
			        isNextHide = $this._panel.outerHeight() - $this._panelList.height() >= position;
			    }

                isNextHide ? nextScroll.addClass('hidden') : nextScroll.removeClass('hidden');
                position === parseFloat($this._panel.css('padding-left')) ? prevScroll.addClass('hidden') : prevScroll.removeClass('hidden');
			}

			function scrollPrev() {
			    let pos;

			    if(isHorizontal) {
			        pos = $this._panelList.position().left + 120;
			    } else {
			        pos = $this._panelList.position().top + 30;
			    }

			    pos = pos > 0 ? parseFloat($this._panel.css("padding-left")) : pos;

			    if(isHorizontal) {
			        $this._panelList.css({left: pos});
			    } else {
			        $this._panelList.css({top: pos});
			    }

			    changeButtonVisibility(pos);
			}

			function scrollNext() {
			    let pos;

			    if(isHorizontal) {
			        pos = $this._panelList.position().left - 120;

                    if(pos < $this._panel.width() - $this._panelList.outerWidth()) {
                        pos = $this._panel.width() - $this._panelList.outerWidth();
                    }

			        $this._panelList.css({left: pos});
			    } else {
			        pos = $this._panelList.position().top - 30;

			        if(pos < $this._panel.outerHeight() - $this._panelList.height()) {
			            pos = $this._panel.outerHeight() - $this._panelList.height();
			        }

			        $this._panelList.css({top: pos});
			    }

			    changeButtonVisibility(pos);
			}

			this.addClass(this.options.position);

            if(opts.goback){
                this._goback = this.$('<i key="goback" class="fas fa-chevron-left"></i>');
                this._goback.on('click', function(){
                    opts.onClick && opts.onClick({key: $this._goback.attr('key')});
                });
            }

			let prevScroll = this.$('<div class="prevScroll scroll hidden"></div>');

			prevScroll.click(scrollPrev);

			this._panel = this.$('<div class="panel"></div>');
			this._panelList = this.$('<div class="list"></div>');
			this._panel.append(this._panelList);

			this._panel.addClass(this.options.position);

			let nextScroll = this.$('<div class="nextScroll scroll hidden"></div>');

			nextScroll.click(scrollNext);

            if(this.options.mousemove) {
                this._panelList.mousedown((e) => {
                    this._isMouseDown = true;
                    this._isMoved = false;

                    if(isHorizontal) {
                        this._clickPosition = e.pageX;
                    } else {
                        this._clickPosition = e.pageY;
                    }
                });

                this.$(document).mousemove((e) => {
                    if(this._isMouseDown) {
                        this._panelList.addClass('moving');

                        if(isHorizontal) {
                            let outerWidth = this._panel.outerWidth(),
                                width = this._panelList.width();

                            if(width > outerWidth) {
                                if(Math.abs(this._clickPosition - e.pageX) > 5) {
                                    this._isMoved = true;
                                }

                                let pos = $this._panelList.position().left - $this._clickPosition + e.pageX;

                                if(pos <= 0) {
                                    if(pos < outerWidth - width) {
                                        pos = outerWidth - width;
                                    }
                                }

                                this._panelList.css({left: pos});

                                changeButtonVisibility(pos);
                            }
                        } else {
                            let outerHeight = this._panel.outerHeight(),
                                height = this._panelList.height();

                            if(height > outerHeight) {
                                if(Math.abs(this._clickPosition - e.pageY) > 5) {
                                    this._isMoved = true;
                                }

                                let pos = this._panelList.position().top - this._clickPosition + e.pageY;

                                if(pos > 0) {
                                    pos = 0;
                                }

                                if(pos < outerHeight - height) {
                                    pos = outerHeight - height;
                                }

                                this._panelList.css({top: pos});

                                changeButtonVisibility(pos);
                            }
                        }
                    }
                });

                this.$(document).mouseup(() => {
                    if(this._isMouseDown) {
                        this._isMouseDown = false;
                        this._panelList.removeClass('moving');
                    }
                });
			}

            this._panelList.bind('mousewheel', (e) => {
                if(isHorizontal) {
                    if(this._panel.outerWidth() > this._panelList.width()) {
                        return;
                    }
                } else {
                    if(this._panel.outerHeight() > this._panelList.height()) {
                        return;
                    }
                }

                if(e.originalEvent.wheelDelta > 0) {
                    scrollPrev();
                } else {
                    scrollNext();
                }
            });

			this.getElement().resize(() => {
			    if(isHorizontal) {
			        changeButtonVisibility(this._panelList.position().left);
			    } else {
			        changeButtonVisibility(this._panelList.position().top);
			    }
			});
            this.append(this._goback);
			this.append(prevScroll);
			this.append(this._panel);
			this.append(nextScroll);
        },

        options: {
            mousemove: false,
            position: 'horizontal',
            onClick: null
        },

        addElement: function(el) {
            let element = this.$('<div></div>');

            element.attr('key', el.key);

            if(JSB.isInstanceOf(el.element, 'JSB.Controls.Control') || JSB.isInstanceOf(el.element, 'JSB.Widgets.Control')) {
                element.append(el.element.getElement());
            } else {
                element.append(el.element);
            }

            let index = this._elements.push({
                key: el.key,
                element: element,
                originalElement: el
            });

            if(JSB.isFunction(this.options.onClick)) {
                element.click(() => {
                    if(this._isMoved) {
                        return;
                    }

                    this.options.onClick.call(this, el, index - 1);
                });
            }

            this._panelList.append(element);
        },

        clear: function() {
            this._panelList.empty();
            this._elements = [];
        },

        getElements: function() {
            return this._elements;
        },

        getPanel: function() {
            return this._panel;
        },

        getPanelList: function() {
            return this._panelList;
        },

        getGoback: function() {
            return this._goback;
        },

        insertElement: function(el) {
            // todo
        },

        removeElement: function(key) {
            // todo
        },

        sort: function(sortCallback) {
            this._elements.sort((a, b) => {
                return sortCallback.call(this, a, b);
            });

            this._panelList.children().detach();

            this._elements.forEach(item => {
                this._panelList.append(item.element);
            });
        }
    }
}