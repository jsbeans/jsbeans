JSB({
	name:'JSB.Widgets.ScrollBox',
	parent: 'JSB.Widgets.Control',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('scrollbox.css');
			JSO().loadScript('tpl/iscroll/iscroll-probe.js', function(){
				self.init();
			});
/*			
			JSO().waitForObjectExist('window.IScroll',function(){
				
			});
*/			
		},
		
		options: {
			scrollbars: true
		},
		init: function(){
			var self = this;
			self.pan = {
				active: false,
				x: 0,
				y: 0,
				lastDeltaX: 0,
				lastDeltaY: 0
			};
			self.panning = false;
			var elt = this.getElement();
			elt.addClass('_dwp_scrollBox');
			
			// init scrollPane
			if(this.options.scrollPaneElement){
				this.scrollPane = this.$(this.options.scrollPaneElement);
				this.scrollPane.addClass('_dwp_scrollPane');
			} else {
				this.scrollPane = this.$('<div class="_dwp_scrollPane"></div>');
				elt.append(this.scrollPane);
			}
			
			this.multiplicator = 150;
			if(navigator.platform.match(/Mac/)){
				this.multiplicator = 1;
			}
			
			this.getElement().resize(function(evt){
				self.refresh();
				self.updateVisibleArea();
				self.updateScrollbars();
			});
			
			this.scrollPane.resize(function(evt){
				self.refresh();
				self.updateVisibleArea();
				if(!JSO().isNull(self.scroll)){
					if(self.scrollPane.width() > self.getElement().width() 
						|| self.scrollPane.height() > self.getElement().height()){
						self.scroll._execEvent('scrollStart');
						JSO().defer(function(){
							self.scroll._execEvent('scrollEnd');
						}, 1000, 'scrollPaneDefer_' + self.getId());
					}
				}
				self.updateScrollbars();
			});
			
			if(!this.options.disableWheel){
				this.getElement().mousewheel(function(evt, delta, deltaX, deltaY){
					self.addWheelDelta(delta);
					if(self.options.stopPropagation){
						evt.stopPropagation();
					}
				});
			}
			
			if(this.options.stopPropagation){
				this.getElement().mousedown(function(evt){
					if(evt.currentTarget == evt.target || self.options.stopPropagation){
						evt.stopPropagation();
					}
				});
			}
			
			JSO().deferUntil(function(){
				self.installScroll();
			},function(){
				return self.getElement().width() > 0;
			});

			this.setEasing('default');
			this.updateScrollbars();
		},
		
		refresh: function(){
			if(!JSO().isNull(this.scroll)){
				this.scroll.refresh();
			}
		},

		installScroll: function(){
			var self = this;
			this.scroll = new IScroll(this.getElement().get(0), JSO().merge(this.options, {
				scrollX: true,
				scrollY: true,
				mouseWheel: false,
				scrollbars: self.options.scrollbars,
				interactiveScrollbars: true,
				bounce: false,
				disableMouse: JSO().isNull(self.options.disableMouse) ? true : self.options.disableMouse,
				mouseWheelSpeed: 40,
				fadeScrollbars: JSO().isNull(self.options.fadeScrollbars) ? false : self.options.fadeScrollbars,
				click: JSO().isNull(self.options.click) ? false : self.options.click,
				preventDefault: self.options.preventDefault || false,
				freeScroll: true,
				probeType: 3
			}));
			this.scroll.on('scrollEnd', function(){
				var nX = Math.round(this.x); 
				var nY = Math.round(this.y);
				self.scroll.scrollTo(nX, nY);
				self.handleOnScroll(nX, nY);
			});
			
			this.scroll.on('scroll', function(){
				self.handleOnScroll(this.x, this.y);
			});
			
			this.scroll.on('beforeScrollStart', function(){
				self.scrollMethod = 'touch';
			});
		},
		
		updateScrollbars: function(){
			if(!this.options.scrollbars){
				return;
			}
			var wrapRect = this.getElement().get(0).getBoundingClientRect();
			var paneRect = this.scrollPane.get(0).getBoundingClientRect();
			
			if(paneRect.width > wrapRect.width){
				this.addClass('horzScrollVisible');
			} else {
				this.removeClass('horzScrollVisible');
			}
			
			if(paneRect.height > wrapRect.height){
				this.addClass('vertScrollVisible');
			} else {
				this.removeClass('vertScrollVisible');
			}
		},
		
		handleOnScroll: function(x, y){
			var self = this;
			self.updateVisibleArea();
			if(!JSO().isNull(self.options.onScroll)){
				self.options.onScroll(x, y);
			}
		},
		
		addWheelDelta: function(delta){
			var self = this;
			var boundaryPenetrationAllowed = 0;
			if(this.scrollPane.height() < this.getElement().height()){
				return;
			}
			
			self.scrollMethod = 'wheel';
			
			if(this.scrollDelta == null){
				this.scrollDelta = 0;
				this.scrollPos = this.scroll.y;
			}
			this.scrollStartTime = new Date().getTime();
			var prevDelta = this.scroll.y - this.scrollPos; 
			self.scrollDelta += delta * this.multiplicator - prevDelta;
			this.scrollPos = this.scroll.y;
			
			// check for bounds
			if(self.scrollDelta > 0 && this.scrollPos + self.scrollDelta > boundaryPenetrationAllowed){
				self.scrollDelta = boundaryPenetrationAllowed - this.scrollPos;
			} else if(self.scrollDelta < 0 && this.scrollPos + self.scrollDelta + this.scrollPane.height() - this.getElement().height() < -boundaryPenetrationAllowed){
				self.scrollDelta = this.getElement().height() - boundaryPenetrationAllowed - this.scrollPane.height() - this.scrollPos;
			}
			
			if(self.updateScrollInterval == null ) {
				JSO().deferUntil(function(){
					if(!self.scrollDelta){
						return;
					}
					self.scroll._execEvent('scrollStart');
					self.isScrolling = true;
					self.updateScrollInterval = setInterval(function(){
						self.updateWheelScrollPosition();
					},1);
				}, function(){
					return !self.isScrolling;
				});
			}
		},

		ease: function (t, b, c, d) {
			return this.easing(t, b, c, d);
		},
		
		setEasing: function(easing){
			if(JSO().isFunction(easing)){
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
		
		updateWheelScrollPosition: function(){
			var dur = 800;
			var curTime = new Date().getTime() - this.scrollStartTime;
			if(curTime > dur){
				this.stopScrollUpdate('wheel');
				return;
			}
			var curPos = this.getScrollPosition();
			var newY = this.ease(curTime, this.scrollPos, this.scrollDelta, dur);
			
			this.scroll.scrollTo(curPos.x, newY);

			if(Math.round(newY) == Math.round(this.scrollPos + this.scrollDelta)){
				this.stopScrollUpdate('wheel');
				return;
			}

			var curScrollHandleTime = new Date().getTime();
			if(JSO().isNull(this.lastScrollHandleTime) || curScrollHandleTime - this.lastScrollHandleTime > 10){
				this.handleOnScroll(curPos.x, newY);
				this.lastScrollHandleTime = curScrollHandleTime;
			}
		},

		updateScrollPosition: function(){
			var dur = 800;
			var curTime = new Date().getTime() - this.scrollStartTime;
			if(curTime > dur){
				this.stopScrollUpdate('auto');
				return;
			}
			var newX = this.ease(curTime, this.scrollPosX, this.scrollDeltaX, dur);
			var newY = this.ease(curTime, this.scrollPosY, this.scrollDeltaY, dur);
			
			if(Math.round(newY) == Math.round(this.scrollPosY + this.scrollDeltaY) 
				&& Math.round(newX) == Math.round(this.scrollPosX + this.scrollDeltaX)){
				this.stopScrollUpdate('auto');
				return;
			}

			this.scroll.scrollTo(newX, newY);
			
			var curScrollHandleTime = new Date().getTime();
			if(JSO().isNull(this.lastScrollHandleTime) || curScrollHandleTime - this.lastScrollHandleTime > 10){
				this.handleOnScroll(newX, newY);
				this.lastScrollHandleTime = curScrollHandleTime;
			}

			this.prevX = newX;
			this.prevY = newY;
		},
		
		stopScrollUpdate: function(method){
			if(JSO().isNull(this.updateScrollInterval)){
				return;
			}
			this.scrollDeltaX = null;
			this.scrollDeltaY = null;
			this.scrollDelta = null;

			clearInterval(this.updateScrollInterval);
			this.updateScrollInterval = null;
			this.isScrolling = false;
			if(this.scrollMethod == method){
				this.scroll._execEvent('scrollEnd');
			}
		},

		updateScrollTarget: function(x, y){
			var self = this;
			this.stopScrollUpdate('auto');
			
			self.scrollMethod = 'auto';
			if(!this.scroll){
				return;
			}
			this.scrollPosX = this.scroll.x;
			this.scrollPosY = this.scroll.y;
			
			this.scrollStartTime = new Date().getTime();
			this.scrollDeltaY = y - this.scrollPosY; 
			this.scrollDeltaX = x - this.scrollPosX;

			if(self.updateScrollInterval == null ) {
				JSO().deferUntil(function(){
					self.scroll._execEvent('scrollStart');
					self.isScrolling = true;
					self.updateScrollInterval = setInterval(function(){
						self.updateScrollPosition();
					},1);
				}, function(){
					return !self.isScrolling;
				});
			}
		},

		scrollTo: function(x, y, hard){
			if(!this.scrollPane || !this.getElement()){
				return;
			}
			if(this.scrollPane.height() + y < this.getElement().height()){
				y = this.getElement().height() - this.scrollPane.height(); 
			}
			if(this.scrollPane.width() + x < this.getElement().width()){
				x = this.getElement().width() - this.scrollPane.width(); 
			}
			if(x > 0){
				x = 0;
			}
			if(y > 0){
				y = 0;
			}
			if(hard){
				this.scroll.scrollTo(x, y);
			} else {
				this.updateScrollTarget(x, y);
//					this.scroll.scrollTo(x, y, 900, IScroll.utils.ease.quadratic);
			}
		},
		
		getScrollPosition: function(){
			return {y: this.scroll.y, x: this.scroll.x };
		},

		updateVisibleArea: function(){
			var self = this;
			if(JSO().isNull(this.options.onChangeVisible) || JSO().isNull(this.scroll)){
				return;
			}
			
			var wholeSize = { 
				width: this.scrollPane.outerWidth(),
				height: this.scrollPane.outerHeight(),
			};
			var visibleRect = {
				left: -this.scroll.x,
				top: -this.scroll.y,
				right: -this.scroll.x + this.getElement().width(),
				bottom: -this.scroll.y + this.getElement().height(),
			};
			this.options.onChangeVisible(visibleRect, wholeSize);
		},
		
		append: function(ctrl){
			var self = this;
			if(JSO().isNull(this.scrollPane)){
				JSO().deferUntil(function(){
					self.scrollPane.append(self.resolveElement(ctrl));
				}, function(){
					return !JSO().isNull(self.scrollPane);
				});
			} else {
				this.scrollPane.append(this.resolveElement(ctrl));
			}
			return this;
		},

		prepend: function(ctrl){
			var self = this;
			if(JSO().isNull(this.scrollPane)){
				JSO().deferUntil(function(){
					self.scrollPane.prepend(self.resolveElement(ctrl));
				}, function(){
					return !JSO().isNull(self.scrollPane);
				});
			} else {
				this.scrollPane.prepend(this.resolveElement(ctrl));
			}
			return this;
		},
		
		clear: function(){
			if(this.scrollPane){
				this.scrollPane.empty();
			}
		}
	}
});