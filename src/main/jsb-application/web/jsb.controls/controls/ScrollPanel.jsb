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
	    _moved: false,
	    _panel: null,

	    $constructor: function(opts) {
	        $base(opts);

			this.addClass('jsb-scrollPanel');

			var isHorizontal = this.options.position === 'horizontal';

			function changeButtonVisibility(position) {
			    var isNextHide;

			    if(isHorizontal) {
			        isNextHide = $this.getElement().outerWidth() - $this._panel.width() === position;
			    } else {
			        isNextHide = $this.getElement().outerHeight() - $this._panel.height() === position;
			    }

                if(isNextHide){
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

			if(isHorizontal) {
			    this.addClass('horizontal');
			} else {
			    this.addClass('vertical');
			}

			var prevScroll = this.$('<div class="prevScroll scroll hidden"></div>');
			prevScroll.click(function() {
			    var pos;

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
			});

			this._panel = this.$('<ul class="panel"></ul>');

			var nextScroll = this.$('<div class="nextScroll scroll hidden"></div>');
			nextScroll.click(function() {
			    var pos;

			    if(isHorizontal) {
			        pos = $this._panel.position().left + 30;

			        if(pos < $this.getElement().outerWidth() - $this._panel.width()) {
			            pos = $this.getElement().outerWidth() - $this._panel.width();
			        }
			    } else {
			        pos = $this._panel.position().top + 30;

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
			});

			this._panel.mousedown(function(e) {
			    function off() {
                    $this.$(document).on('mouseup.navigator', function(e) {
                        $this._panel.off('mousemove.navigator');
                        $this.$(document).off('mouseup.navigator');
                        $this._panel.removeClass('moving');
                    });
			    }

			    if(isHorizontal) {
			        let outerWidth = $this.getElement().outerWidth(),
			            width = $this._panel.width();

                    if(width > outerWidth) {
                        $this._clickPosition = e.pageX;
                        $this._panel.addClass('moving');

                        $this._panel.on('mousemove.navigator', function(e) {
                            $this._moved = true;

                            var pos = $this._panel.position().left - $this._clickPosition + e.pageX;

                            if(pos <= 0) {
                                if(pos < outerWidth - width) {
                                    pos = outerWidth - width;
                                }
                            }

                            $this._panel.css({left: pos});
                        });

                        off();
                    }
			    } else {
			        let outerHeight = $this.getElement().outerHeight(),
			            height = $this._panel.height();

                    if(height > outerHeight) {
                        $this._clickPosition = e.pageX;
                        $this._panel.addClass('moving');

                        $this._panel.on('mousemove.navigator', function(e) {
                            $this._moved = true;

                            var pos = $this._panel.position().left - $this._clickPosition + e.pageX;

                            if(pos <= 0) {
                                if(pos < outerHeight - height) {
                                    pos = outerHeight - height;
                                }
                            }

                            $this._panel.css({left: pos});
                        });

                        off();
                    }
			    }
			});

			this.getElement().scroll(function() {
			    // todo
			    //debugger;
			});

			this.getElement().resize(function() {
			    var position;

			    if(isHorizontal) {
			        position = $this._panel.position().left;
			    } else {
			        position = $this._panel.position().top;
			    }

			    changeButtonVisibility(position);
			});

			this.append(prevScroll);
			this.append(this._panel);
			this.append(nextScroll);
        },

        options: {
            position: 'horizontal',
            onclick: null
        },

        addElement: function(el) {
            var element = this.$('<li></li>');

            if(JSB.isInstanceOf(el.element, 'JSB.Controls.Control') || JSB.isInstanceOf(el.element, 'JSB.Widgets.Control')) {
                element.append(el.element.getElement());
            } else {
                element.append(el.element);
            }

            var index = this._elements.push({
                key: el.key,
                element: element
            });

            if(JSB.isFunction(this.options.onclick)) {
                element.click(function(){
                    if($this._moved){
                        $this._moved = false;
                        return;
                    }

                    if($this._elements.length === index) {
                        return;
                    }

                    $this.options.onclick.call($this, el.key, index - 1);
                });
            }

            this._panel.append(element);
        },

        getPanel: function() {
            return this._panel;
        },

        insertElement: function(el) {
            // todo
        },

        removeElement: function(key) {
            // todo
        }
    }
}