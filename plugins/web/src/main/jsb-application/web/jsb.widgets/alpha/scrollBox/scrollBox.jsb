{
	$name: 'JSB.Widgets.Alpha.ScrollBox',
	$parent: 'JSB.Widgets.Control',
	$client: {
		_oldScroll:{
			x: 0,
			y: 0
		},
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('scrollBox');
			this.loadCss('scrollBox.css');

            if(this.options.cssClass){
                this.addClass(this.options.cssClass);
            }

            if(!this.options.xAxisScroll){
                this.getElement().css('overflow-x', 'hidden');
            }

            if(!this.options.yAxisScroll){
                this.getElement().css('overflow-y', 'hidden');
            }

			this.getElement().scroll(function(evt){
				var scrollHeight = evt.target.scrollHeight,
					scrollWidth = evt.target.scrollWidth,
					scrollTop = evt.target.scrollTop,
					scrollLeft = evt.target.scrollLeft,
					clientHeight = evt.target.clientHeight,
					clientWidth = evt.target.clientWidth;
				
				// for content preloader
				if(scrollTop !== 0 && scrollHeight - scrollTop <= 2 * clientHeight && JSB().isFunction($this.events.preLoad))
					$this.events.preLoad.call($this, evt);
				
				// maxY
				if(scrollHeight - scrollTop - clientHeight === 0 && $this._oldScroll.y !== scrollTop && JSB().isFunction($this.events.onMaxY))
					$this.events.onMaxY.call($this, evt);
				
				// minY
				if(scrollTop === 0 && $this._oldScroll.y !== scrollTop && JSB().isFunction($this.events.onMinY))
					$this.events.onMinY.call($this, evt);
				
				// maxX
				if(scrollWidth - scrollLeft - clientWidth === 0 & $this._oldScroll.x !== scrollLeft && JSB().isFunction($this.events.onMaxX))
					$this.events.onMaxX.call($this, evt);
				
				// minX
				if(scrollLeft === 0 && $this._oldScroll.x !== scrollLeft && JSB().isFunction($this.events.onMinX))
					$this.events.onMinX.call($this, evt);
				
				$this._oldScroll.x = scrollLeft;
				$this._oldScroll.y = scrollTop;
			});

			this.getElement().mousewheel(function(evt){
			    evt.stopPropagation();
			});
		},
		
		events:{
			onMaxX: null,
			onMinX: null,
			onMaxY: null,
			onMinY: null,
			preLoad: null
		},

		options: {
		    xAxisScroll: true,
		    yAxisScroll: true
		},

		/**
         * Очищает элемент.
         */
		clear: function(){
			this.getElement().empty();
		},

		empty: function(){
		    this.getElement().empty();
		},

        /**
         * Возвращает текущую позицию скроллбокса.
         *
         * @return {{number}, {number}} Объект {x, y}
         */
		getScrollPosition: function(){
			return { x: this.getElement().scrollLeft, y: this.getElement().scrollTop };
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
            // todo
		},
		/*
		setScrollPosition: function(pos){
			if(!pos){
				throw new Error('Incorrect function parameters("setScrollPosition" need 1 parameter)');
				return;
			}
				
			if(pos.x)
				this.getElement().setLeft(pos.x);
			
			if(pos.y)
				this.getElement().setTop(pos.y);
		}
		*/

		/**
         * Устанавливает позицию скроллбокса.
         *
         * @param {number}, {number} Координаты по осям x и y
         */
        setScrollPosition: function(x, y){
            if(x)
                this.getElement().setLeft(x);

            if(y)
                this.getElement().setTop(y);
        }
	}
}