JSB({
	name:'JSB.Widgets.FloatingContainer',
	parent:'JSB.Widgets.WidgetContainer',
	client: {
		constructor: function(opts){
			// ctor
			this.base(opts);
			this.loadCss('floatingcontainer.css');
			this.getElement().addClass('_dwp_floatingContainer');
			this.init();
		},
		
		isResizing: false,
		
		// fields
		options: {
			position: 'floating', // floating | fixed
			caption: false,
			allowClose: true,
			allowDock: false,
			allowMaximize: true,
			dockedHorz: false,
			dockedVert: false,
			tools: [],
		},
		
		// members
		init: function(){
			var self = this;
			this.isMaximized = false;
			var elt = this.getElement();
			elt.css('position', ( this.options.position == 'floating' ? 'absolute' : 'relative'));
			
			this.clientContainer = this.$('<div class="clientContainer"></div>');
			this.hiddenArea = this.$('<div class="hiddenArea"></div>');
			
			elt.append(this.clientContainer);
			elt.append(this.hiddenArea);
		},
		
		updateToolbar: function(){
			var self = this;
			var elt = this.getElement();
			// create toolbar
			var toolBarUl = this.$('<ul></ul>');
			var showToolbar = false;

			// draw custom tools
			for(var i in this.options.tools){
				var tool = this.options.tools[i];
				var toolElt = this.$('<li class="'+tool.name+'"></li>');
				toolBarUl.append(toolElt);
				showToolbar = true;
				(function(t){
					toolElt.click(function(evt){
						t.onClick.call(self, evt);
					});
				})(tool);
			}

			if(this.options.allowDock){
				toolBarUl.append('<li class="dock"></li>');
				showToolbar = true;
			}
			if(this.behavior.allowResize.horizontal && this.behavior.allowResize.vertical && this.options.allowMaximize){
				toolBarUl.append('<li class="maxmin"></li>');
				showToolbar = true;
			}
			if(this.options.allowClose){
				toolBarUl.append('<li class="close"></li>');
				showToolbar = true;
			}
			
			
			if(showToolbar){
				this.toolbar = this.$('<div class="containerToolbar"></div>').append(toolBarUl);
				
				this.toolbar.find('li').click(function(evt){
					var tgt = self.$(evt.currentTarget);
					if(tgt.hasClass('close')){
						self.close();
					} else if(tgt.hasClass('maxmin')){
						if(tgt.hasClass('minimize')){
							self.minimize();
							tgt.removeClass('minimize');
						} else {
							self.maximize();
							tgt.addClass('minimize');
						}
					} else if(tgt.hasClass('dock')){
						self.publish('widgetDock', {
							widgetName: self.getWidget().jso.name,
							options: self.getWidget().options
						});
					}
				});

				elt.append(this.toolbar);
			} else {
				this.toolbar = null;
			}
		},
		
		clickStopPropagationHandler: function(evt){
			evt.stopPropagation();
			return true;
		},
		
		destroy: function(){
			this.close();
			this.getSuperClass('JSB.Widgets.WidgetContainer').destroy.call(this);
		},
		
		close: function(){
			this.getWidget().destroy();
			this.getElement().remove();
			JSO().unregister(this);
		},
		
		maximize: function(){
			if(this.isMaximized){
				return;
			}
			this.isMaximized = true;
			this.originalWidth = this.getElement().outerWidth();
			this.originalHeight = this.getElement().outerHeight();
			this.getElement().css({
				position: 'fixed',
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
				width: '',
				height: '',
				'z-index': 10000
			});
			
			this.getElement().addClass('fullscreen');
			this.getElement().find('.gripper').css({
				visibility:'hidden'
			});
			
		},
		
		minimize: function(){
			var self = this;
			if(!this.isMaximized){
				return;
			}
			this.isMaximized = false;
			this.replacingMark = JSO().$('<div id="'+this.getId()+'_rmark"></div>');
			this.getElement().after(this.replacingMark);
			this.getElement().detach();

			this.getElement().css({
				position: ( this.options.position == 'floating' ? 'absolute' : 'relative'),
				left: '',
				top: '',
				right: '',
				bottom: '',
				width: this.originalWidth,
				height: this.originalHeight,
				'z-index': ''
			});
			this.getElement().insertBefore(this.replacingMark);
			this.replacingMark.remove();
			this.getElement().removeClass('fullscreen');
			this.getElement().find('.gripper').css({
				visibility:''
			});
		},
		
		getClientContainer: function(){
			return this.hiddenArea;
		},
		
		updateGrippers: function(b){
			var self = this;
			var elt = this.getElement();

			elt.find('.gripper').remove();
			if(b.allowResize.horizontal){
				// place right gripper
				var rightGripper = this.$('<div class="gripper verticalGripper rightGripper"><div class="gripIcon"></div></div>');
				elt.append(rightGripper);
				rightGripper.mousedown(function(evt){
					evt.stopPropagation();
				});
				rightGripper.draggable({
					axis: 'x',
//						containment: elt,	// TODO constrain sizing
					start: function(evt, data){
						self.isResizing = true;
						self.initialWidth = self.getElement().outerWidth();
						evt.stopPropagation();
					},
					drag: function(evt, data){
						var deltaX = data.position.left - data.originalPosition.left;
						self.getElement().css('width',self.initialWidth + deltaX);
						evt.stopPropagation();
					},
					stop: function(evt, data){
						self.isResizing = false;
						data.helper.css({
							left: '',
							right: ''
						});
						evt.stopPropagation();
					}
				});
				rightGripper.css('position','');

			}
			if(b.allowResize.vertical){
				// place bottom gripper
				var bottomGripper = this.$('<div class="gripper horizontalGripper bottomGripper"><div class="gripIcon"></div></div>');
				elt.append(bottomGripper);
				bottomGripper.mousedown(function(evt){
					evt.stopPropagation();
				});
				bottomGripper.draggable({
					axis: 'y',
//						containment: elt,	// TODO: constrain sizing
					start: function(evt, data){
						self.isResizing = true;
						self.initialHeight = self.getElement().outerHeight();
						evt.stopPropagation();
					},
					drag: function(evt, data){
						var deltaY = data.position.top - data.originalPosition.top;
						self.getElement().css('height',self.initialHeight + deltaY);
						evt.stopPropagation();
					},
					stop: function(evt, data){
						self.isResizing = false;
						data.helper.css({
							top: '',
							bottom: ''
						});
						evt.stopPropagation();
					}
				});
				bottomGripper.css('position','');
			}
			if(b.allowResize.horizontal && b.allowResize.vertical){
				// place right-bottom corner gripper
				var rightBottomGripper = this.$('<div class="gripper cornerGripper rightBottomGripper"></div>');
				elt.append(rightBottomGripper);
				rightBottomGripper.draggable({
					start: function(evt, data){
						self.isResizing = true;
						self.initialWidth = self.getElement().outerWidth();
						self.initialHeight = self.getElement().outerHeight();
						evt.stopPropagation();
					},
					drag: function(evt, data){
						var deltaX = data.position.left - data.originalPosition.left;
						var deltaY = data.position.top - data.originalPosition.top;
						self.getElement().css({
							'width': self.initialWidth + deltaX,
							'height': self.initialHeight + deltaY
						});
						evt.stopPropagation();
					},
					stop: function(evt, data){
						self.isResizing = false;
						data.helper.css({
							'left': '',
							'top': '',
							'right': '',
							'bottom': ''

						});
						evt.stopPropagation();
					}
				});
				rightBottomGripper.css('position','');
			}
		},
		
		updateBehavior: function(b){
			var self = this;
			this.behavior = JSO().clone(b);
			
			if(this.options.dockedHorz){
				this.behavior.allowResize.horizontal = false;
			}
			if(this.options.dockedVert){
				this.behavior.allowResize.vertical = false;
			}
				
			this.preConstruct();
			JSO().deferUntil(function(){
				self.constructContainer();
				self.updateGrippers(self.behavior);
				if(!JSO().isNull(self.storeArea)){
//						self.updateArea(self.storeArea.width, self.storeArea.height);
				}
			}, function(){
				return self.getWidget() && 
					self.getWidget().getElement().width() > 0 && 
					self.getWidget().getElement().height() > 0 && 
					self.getElement().width() > 0;
			});
		},
		
		preConstruct: function(){
			this.updateToolbar();
			var wcClass = 'simple';
			if(this.behavior.allowResize.vertical 
				|| this.behavior.allowResize.horizontal
				|| !JSO().isNull(this.toolbar)){
				wcClass = 'border';
			}
			this.getElement().addClass(wcClass);
		},
		
		constructContainer: function(){
			var wSize = {
				width: this.getWidget().getElement().outerWidth(),
				height: this.getWidget().getElement().outerHeight()
			};
			var areaSize = {
				width: this.options.initialWidth || this.getElement().outerWidth(),
				height: this.options.initialHeight || this.getElement().outerHeight()
			};
			
			if(this.behavior.dimensions.aspect){
				var ah = Math.max(areaSize.height, areaSize.width / this.behavior.dimensions.aspect);
				var aw = Math.max(areaSize.width, areaSize.height * this.behavior.dimensions.aspect);
				areaSize.width = aw;
				areaSize.height = ah; 
			}
			
			if(this.options.initialWidth && areaSize.width > this.options.initialWidth){
				areaSize.width = this.options.initialWidth;
			}

			if(this.options.initialHeight && areaSize.height > this.options.initialHeight){
				areaSize.height = this.options.initialHeight;
			}

			var suggestedWidth = this.behavior.dimensions.defaultWidth;
			var suggestedHeight = this.behavior.dimensions.defaultHeight;
			if(JSO().isNull(suggestedWidth)){
				suggestedWidth = areaSize.width;
			}
			if(JSO().isNull(suggestedHeight)){
				suggestedHeight = areaSize.height;
			}
			
			if(!this.behavior.allowResize.horizontal) {
				suggestedWidth = wSize.width;
			}

			if(!this.behavior.allowResize.vertical) {
				suggestedHeight = wSize.height;
			}

			suggestedWidth = this.fixMinWidth( suggestedWidth );
			suggestedHeight = this.fixMinHeight( suggestedHeight );
			if(!JSO().isNull(this.options.suggested)){
				if(!JSO().isNull(this.options.suggested.width) && this.options.suggested.width > 0){
					suggestedWidth = this.fixMinWidth( this.options.suggested.width );
				}
				if(this.options.suggested.height != undefined){
					suggestedHeight = this.fixMinHeight( this.options.suggested.height );
				}
			}
			if(this.behavior.dimensions.preserveAspect && this.behavior.dimensions.aspect){
				if(this.behavior.allowResize.horizontal){
					suggestedWidth = Math.min(suggestedWidth, suggestedHeight * this.behavior.dimensions.aspect);
				}
				if(this.behavior.allowResize.vertical){
					suggestedHeight = Math.min(suggestedHeight, suggestedWidth / this.behavior.dimensions.aspect);
				}
			}
			if(this.behavior.allowResize.horizontal || true){
				this.getElement().css('width', suggestedWidth);
			}
			if(this.behavior.allowResize.vertical || true){
				this.getElement().css('height', suggestedHeight);
			}

			this.clientContainer.append(this.wcView.getElement());
		},
		
		fixMinWidth: function(w){
			var minWidth = parseInt(this.getWidget().getElement().css('min-width'));
			return Math.max(w, minWidth);
		},
		
		fixMinHeight: function(h){
			var minHeight = parseInt(this.getWidget().getElement().css('min-height'));
			return Math.max(h, minHeight);
		},
		
		updateArea: function(w, h){
			if(this.isMaximized){
				return;
			}
			var newW = 0;
			var newH = 0;
			if(!this.getWidget()){
				this.storeArea = {
					width: w,
					height: h
				};
				return;
			} else {
				this.storeArea = null;
			}
			if(w > 0 && w < this.getElement().width()){
				newW = this.fixMinWidth(w);
				if(this.behavior.dimensions.preserveAspect){
					newH = this.fixMinHeight( newW / this.behavior.dimensions.aspect );
				}
			}
			if(h > 0 && h < this.getElement().height()){
				newH = this.fixMinHeight( h );
				if(this.behavior.dimensions.preserveAspect){
					newW = this.fixMinWidth( newH * this.behavior.dimensions.aspect );
				}
			}
			if(newW > 0){
				this.getElement().css('width',newW);
			}
			if(newH > 0){
				this.getElement().css('height',newH);
			}
		}
	}
});