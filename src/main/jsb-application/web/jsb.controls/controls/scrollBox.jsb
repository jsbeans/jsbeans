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
		scrollTo: function(x, y){
		    this.setScrollPosition(x, y);
		},

		scrollToElement: function(target, vAlign, hAlign){
			var tgt = this.find(target);
			if(tgt.length == 0){
				return;
			}
            var targetRc = tgt.get(0).getBoundingClientRect();
            var sbRc = this.getElement().get(0).getBoundingClientRect();

            if(!vAlign){
                vAlign = 'center';
            }
            if(!hAlign){
                hAlign = 'center';
            }

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

            this.scrollTo(hOffs, vOffs);
		},

		/**
         * Устанавливает позицию скроллбокса.
         *
         * @param {number}, {number} Координаты по осям x и y
         */
        setScrollPosition: function(x, y){
            if(x)
                this.getElement().scrollLeft(x);

            if(y)
                this.getElement().scrollTop(y);
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
        }
	}
}