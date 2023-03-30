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
	$name: 'JSB.Controls.ScrollBox',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:scrollBox.css'],

		_oldScroll:{
			x: 0,
			y: 0
		},
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('jsb-scrollBox');

            if(!this.options.xAxisScroll){
                this.getElement().css('overflow-x', 'hidden');
            }

            if(!this.options.yAxisScroll){
                this.getElement().css('overflow-y', 'hidden');
            }

            let hasEvents = this.options.onMaxX ||
                            this.options.onMinX ||
                            this.options.onMaxY ||
                            this.options.onMinY ||
                            this.options.preLoad ||
                            this.options.onScroll ||
                            this.options.onChangeVisible;

			if(hasEvents) {
                this.getElement().scroll(function(evt) {
                    var scrollHeight = evt.target.scrollHeight,
                        scrollWidth = evt.target.scrollWidth,
                        scrollTop = evt.target.scrollTop,
                        scrollLeft = evt.target.scrollLeft,
                        clientHeight = evt.target.clientHeight,
                        clientWidth = evt.target.clientWidth;

                    if(JSB().isFunction($this.options.onScroll)){
                        $this.options.onScroll.call($this, evt);
                    }

                    // for content preloader    todo: not fire when scroll up
                    if(scrollTop !== 0 && scrollHeight - scrollTop <= 2 * clientHeight && JSB().isFunction($this.options.preLoad)) {
                        $this.options.preLoad.call($this, evt);
                    }

                    // maxY
                    if(scrollHeight - scrollTop - clientHeight === 0 && $this._oldScroll.y !== scrollTop && JSB().isFunction($this.options.onMaxY)) {
                        $this.options.onMaxY.call($this, evt);
                    }

                    // minY
                    if(scrollTop === 0 && $this._oldScroll.y !== scrollTop && JSB().isFunction($this.options.onMinY)) {
                        $this.options.onMinY.call($this, evt);
                    }

                    // maxX
                    if(scrollWidth - scrollLeft - clientWidth === 0 & $this._oldScroll.x !== scrollLeft && JSB().isFunction($this.options.onMaxX)) {
                        $this.options.onMaxX.call($this, evt);
                    }

                    // minX
                    if(scrollLeft === 0 && $this._oldScroll.x !== scrollLeft && JSB().isFunction($this.options.onMinX)) {
                        $this.options.onMinX.call($this, evt);
                    }

                    $this._oldScroll.x = scrollLeft;
                    $this._oldScroll.y = scrollTop;
                });
            }
			
			$this.setEasing('easeOutExpo');

            this.getElement().mousewheel(function(evt){
                evt.stopPropagation();
            });

            if(this.options.onChangeVisible) {
                this.getElement().resize(function(evt){
                    if(!$this.getElement().is(':visible')){
                        return;
                    }

                    $this.updateVisibleArea();
                });
            }
		},
		
        options: {
            xAxisScroll: true,
            yAxisScroll: true,
            
            onMaxX: null,
			onMinX: null,
			onMaxY: null,
			onMinY: null,
			preLoad: null,
			onScroll: null,
			onChangeVisible: null
        },

		/**
         * Очищает элемент.
         */
		clear: function() {
			this.getElement().empty();
		},

        /**
         * Возвращает текущую позицию скроллбокса.
         *
         * @return {{number}, {number}} Объект {x, y}
         */
		getScrollPosition: function(){
			return { x: this.getElement().scrollLeft(), y: this.getElement().scrollTop() };
		},

		/**
         * Устанавливает позицию скроллбокса.
         *
         * @param {number}, {number} Координаты по осям x и y
         */
		scrollTo: function(x, y, opts){
			if(x < 0){
				x = 0;
			}
			if(y < 0){
				y = 0;
			}
			let maxScrollWidth = this.getElement().get(0).scrollWidth - this.getElement().get(0).clientWidth;
			let maxScrollHeight = this.getElement().get(0).scrollHeight - this.getElement().get(0).clientHeight;
			if(x > maxScrollWidth){
				x = maxScrollWidth;
			}
			if(y > maxScrollHeight){
				y = maxScrollHeight;
			}
			if(opts && opts.animate){
				let dur = opts.duration || 400;
				let startTime = Date.now();
				let scrollStart = this.getScrollPosition();
				let deltaX = x - scrollStart.x;
				let deltaY = y - scrollStart.y;
				if(deltaX == 0 && deltaY == 0){
					return;
				}
				$this.getElement().css('scroll-behavior', 'auto');
				function _doScrollStep(){
					let deltaTime = Date.now() - startTime;
					var newX = $this.ease(deltaTime, scrollStart.x, deltaX, dur);
					var newY = $this.ease(deltaTime, scrollStart.y, deltaY, dur);
					$this.setScrollPosition(newX, newY);
					if(Math.round(newX) == Math.round(x) && Math.round(newY) == Math.round(y)){
						$this.getElement().css('scroll-behavior', '');
						return;
					}
					JSB.defer(()=>{
						_doScrollStep();
					}, 0);
				}
				_doScrollStep();
			} else {
				this.getElement().css('scroll-behavior', 'auto');
				this.setScrollPosition(x, y);
				this.getElement().css('scroll-behavior', '');
			}
		},

		scrollToElement: function(target, opts){
			var tgt = this.find(target);
			if(tgt.length == 0){
				return;
			}
            var targetRc = tgt.get(0).getBoundingClientRect();
            var sbRc = this.getElement().get(0).getBoundingClientRect();
            var sp = this.getScrollPosition();

            var vAlign = opts && opts.vAlign || 'center';
            var hAlign = opts && opts.hAlign || 'center';
            var hOffs, vOffs;

            switch(vAlign){
            case 'top':
                vOffs = targetRc.top - sbRc.top;
                break;
            case 'bottom':
                vOffs = targetRc.bottom - sbRc.bottom;
                break;
            case 'center':
                vOffs = (targetRc.bottom + targetRc.top) / 2 - (sbRc.bottom + sbRc.top) / 2;
                break;
            }

            switch(hAlign){
            case 'left':
                hOffs = targetRc.left - sbRc.left;
                break;
            case 'right':
                hOffs = targetRc.right - sbRc.right;
                break;
            case 'center':
                hOffs = (targetRc.right + targetRc.left) / 2 - (sbRc.right + sbRc.left) / 2;
                break;
            }

            this.scrollTo(Math.round(sp.x+hOffs), Math.round(sp.y+vOffs), opts);
		},

		/**
         * Устанавливает позицию скроллбокса.
         *
         * @param {number}, {number} Координаты по осям x и y
         */
        setScrollPosition: function(x, y){
            if(JSB.isDefined(x)){
           		this.getElement().scrollLeft(x);	
            }
            if(JSB.isDefined(y)){
                this.getElement().scrollTop(y);
            }
        },

        updateVisibleArea: function() {
            let wholeSize = {
                width: this.getElement().width(),
                height: this.getElement().height(),
            };

            let visibleRect = {
                left: -this.getElement().x,
                top: -this.getElement().y,
                right: -this.getElement().x + this.getElement().width(),
                bottom: -this.getElement().y + this.getElement().height(),
            };

            this.options.onChangeVisible.call(visibleRect, wholeSize);
        },
        
        ease: function (t, b, c, d) {
			return this.easing(t, b, c, d);
		},
		
		setEasing: function(easing){
			if(JSB().isFunction(easing)){
				this.easing = easing;
				return;
			}
			switch(easing){
			case 'linearTween':
				this.easing = function (t, b, c, d) {
					return c*t/d + b;
				};
				break;
			case 'easeInQuad':
				this.easing = function (t, b, c, d) {
					t /= d;
					return c*t*t + b;
				};
				break;
			case 'easeOutQuad':
				this.easing = function (t, b, c, d) {
					t /= d;
					return -c * t*(t-2) + b;
				};
				break;
			case 'easeInOutQuad':
				this.easing = function (t, b, c, d) {
					t /= d/2;
					if (t < 1) return c/2*t*t + b;
					t--;
					return -c/2 * (t*(t-2) - 1) + b;
				};
				break;
			case 'easeInCubic':
				this.easing = function (t, b, c, d) {
					t /= d;
					return c*t*t*t + b;
				};
				break;
			case 'easeOutCubic':
				this.easing = function (t, b, c, d) {
					t /= d;
					t--;
					return c*(t*t*t + 1) + b;
				};
				break;
			case 'easeInOutCubic':
				this.easing = function (t, b, c, d) {
					t /= d/2;
					if (t < 1) return c/2*t*t*t + b;
					t -= 2;
					return c/2*(t*t*t + 2) + b;
				};
				break;
			case 'easeInQuart':
				this.easing = function (t, b, c, d) {
					t /= d;
					return c*t*t*t*t + b;
				};
				break;
			case 'easeOutQuart':
				this.easing = function (t, b, c, d) {
					t /= d;
					t--;
					return -c * (t*t*t*t - 1) + b;
				};
				break;
			case 'easeInOutQuart':
				this.easing = function (t, b, c, d) {
					t /= d/2;
					if (t < 1) return c/2*t*t*t*t + b;
					t -= 2;
					return -c/2 * (t*t*t*t - 2) + b;
				};
				break;
			case 'easeInQuint':
				this.easing = function (t, b, c, d) {
					t /= d;
					return c*t*t*t*t*t + b;
				};
				break;
			case 'easeOutQuint':
				this.easing = function (t, b, c, d) {
					t /= d;
					t--;
					return c*(t*t*t*t*t + 1) + b;
				};
				break;
			case 'easeInOutQuint':
				this.easing = function (t, b, c, d) {
					t /= d/2;
					if (t < 1) return c/2*t*t*t*t*t + b;
					t -= 2;
					return c/2*(t*t*t*t*t + 2) + b;
				};
				break;
			case 'easeInSine':
				this.easing = function (t, b, c, d) {
					return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
				};
				break;
			case 'easeOutSine':
				this.easing = function (t, b, c, d) {
					return c * Math.sin(t/d * (Math.PI/2)) + b;
				};
				break;
			case 'easeInOutSine':
				this.easing = function (t, b, c, d) {
					return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
				};
				break;
			case 'easeInExpo':
				this.easing = function (t, b, c, d) {
					return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
				};
				break;
			case 'easeOutExpo':
				this.easing = function (t, b, c, d) {
					return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
				};
				break;
			case 'easeInOutExpo':
				this.easing = function (t, b, c, d) {
					t /= d/2;
					if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
					t--;
					return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
				};
				break;
			case 'easeInCirc':
				this.easing = function (t, b, c, d) {
					t /= d;
					return -c * (Math.sqrt(1 - t*t) - 1) + b;
				};
				break;
			case 'easeOutCirc':
				this.easing = function (t, b, c, d) {
					t /= d;
					t--;
					return c * Math.sqrt(1 - t*t) + b;
				};
				break;
			case 'easeInOutCirc':
				this.easing = function (t, b, c, d) {
					t /= d/2;
					if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
					t -= 2;
					return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
				};
				break;
			default:
				this.easing = function (t, b, c, d) {
					return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
				};
			}
		},
	}
}