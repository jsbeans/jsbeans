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
			        isNextHide = $this.getElement().outerWidth() - $this._panel.width() >= position;
			    } else {
			        isNextHide = $this.getElement().outerHeight() - $this._panel.height() >= position;
			    }

                if(isNextHide) {
                    nextScroll.addClass('hidden');
                } else {
                    nextScroll.removeClass('hidden');
                }

                if(position === 0){
                    prevScroll.addClass('hidden');
                } else {
                    prevScroll.removeClass('hidden');
                }
			}

			function scrollPrev() {
			    let pos;

			    if(isHorizontal) {
			        pos = $this._panel.position().left + 30;
			    } else {
			        pos = $this._panel.position().top + 30;
			    }

			    pos = pos > 0 ? 0 : pos;

			    if(isHorizontal) {
			        $this._panel.css({left: pos});
			    } else {
			        $this._panel.css({top: pos});
			    }

			    changeButtonVisibility(pos);
			}

			function scrollNext() {
			    let pos;

			    if(isHorizontal) {
			        pos = $this._panel.position().left + 30;

			        if(pos < $this.getElement().outerWidth() - $this._panel.width()) {
			            pos = $this.getElement().outerWidth() - $this._panel.width();
			        }
			    } else {
			        pos = $this._panel.position().top - 30;

			        if(pos < $this.getElement().outerHeight() - $this._panel.height()) {
			            pos = $this.getElement().outerHeight() - $this._panel.height();
			        }
			    }

			    if(isHorizontal) {
			        $this._panel.css({left: pos});
			    } else {
			        $this._panel.css({top: pos});
			    }

			    changeButtonVisibility(pos);
			}

			this.addClass(this.options.position);

			let prevScroll = this.$('<div class="prevScroll scroll hidden"></div>');

			prevScroll.click(scrollPrev);

			this._panel = this.$('<div class="panel"></div>');

			this._panel.addClass(this.options.position);

			let nextScroll = this.$('<div class="nextScroll scroll hidden"></div>');

			nextScroll.click(scrollNext);

            if(this.options.mousemove) {
                this._panel.mousedown((e) => {
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
                        this._panel.addClass('moving');

                        if(isHorizontal) {
                            let outerWidth = this.getElement().outerWidth(),
                                width = this._panel.width();

                            if(width > outerWidth) {
                                if(Math.abs(this._clickPosition - e.pageX) > 5) {
                                    this._isMoved = true;
                                }

                                let pos = $this._panel.position().left - $this._clickPosition + e.pageX;

                                if(pos <= 0) {
                                    if(pos < outerWidth - width) {
                                        pos = outerWidth - width;
                                    }
                                }

                                this._panel.css({left: pos});

                                changeButtonVisibility(pos);
                            }
                        } else {
                            let outerHeight = this.getElement().outerHeight(),
                                height = this._panel.height();

                            if(height > outerHeight) {
                                if(Math.abs(this._clickPosition - e.pageY) > 5) {
                                    this._isMoved = true;
                                }

                                let pos = this._panel.position().top - this._clickPosition + e.pageY;

                                if(pos > 0) {
                                    pos = 0;
                                }

                                if(pos < outerHeight - height) {
                                    pos = outerHeight - height;
                                }

                                this._panel.css({top: pos});

                                changeButtonVisibility(pos);
                            }
                        }
                    }
                });

                this.$(document).mouseup(() => {
                    if(this._isMouseDown) {
                        this._isMouseDown = false;
                        this._panel.removeClass('moving');
                    }
                });
			}

            this._panel.bind('mousewheel', function(e) {
                if(e.originalEvent.wheelDelta > 0) {
                    scrollPrev();
                } else {
                    scrollNext();
                }
            });

			this.getElement().resize(() => {
			    if(isHorizontal) {
			        changeButtonVisibility(this._panel.position().left);
			    } else {
			        changeButtonVisibility(this._panel.position().top);
			    }
			});

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

                    this.options.onClick.call(this, el.key, index - 1);
                });
            }

            this._panel.append(element);
        },

        clear: function() {
            this._panel.empty();
            this._elements = [];
        },

        getElements: function() {
            return this._elements;
        },

        getPanel: function() {
            return this._panel;
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

            this._panel.children().detach();

            this._elements.forEach(item => {
                this._panel.append(item.element);
            });
        }
    }
}