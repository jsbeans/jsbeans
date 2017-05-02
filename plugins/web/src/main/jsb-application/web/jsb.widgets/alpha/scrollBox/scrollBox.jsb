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
			
			this.getElement().scroll(function(evt){
				var scrollHeight = evt.target.scrollHeight,
					scrollWidth = evt.target.scrollWidth,
					scrollTop = evt.target.scrollTop,
					scrollLeft = evt.target.scrollLeft,
					clientHeight = evt.target.clientHeight,
					clientWidth = evt.target.clientWidth;
				
				// for content preloader
				if(scrollHeight - scrollTop <= 2 * clientHeight && JSB().isFunction($this.events.preLoad))
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
		},
		
		events:{
			onMaxX: null,
			onMinX: null,
			onMaxY: null,
			onMinY: null,
			preLoad: null
		},
		
		clear: function(){
			this.getElement().empty();
		},
		
		getScrollPosition: function(){
			return { x: this.getElement().scrollLeft, y: this.getElement().scrollTop };
		},
		
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
	}
}