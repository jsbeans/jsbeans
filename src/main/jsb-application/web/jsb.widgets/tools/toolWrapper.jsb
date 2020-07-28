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
	$name:'JSB.Widgets.ToolWrapper',
	$parent:'JSB.Widgets.Control',
	$client: {
		$require: ['jQuery.UI.Droppable',
		           'script:/../../../tpl/d3/d3.min.js',
		           'css:toolWrapper.css'],

		$constructor: function(toolId, toolMgr, w, opts){
			$base(opts);

			this.toolId = toolId;
			this.toolManager = toolMgr;
			this.embeddedWidget = w;

			this.init();
		},
		
		options: {
			hideByEsc: true,
			draggable: false
		},

		init: function(){
			var elt = this.getElement();
			elt.addClass('_dwp_toolWrapper');
			if(!JSB().isNull(this.options.cssClass)){
				elt.addClass(this.options.cssClass);
			}
			this.clientContainer = this.$('<div class="clientContainer"></div>');
			
			this.initSvg();
			elt.append(this.clientContainer);
			this.rect = {x: 0, y: 0, w: 0, h: 0};
			
			this.visible = false;
			this.isMouseInside = false;
			this.scope = null;
			this.clientContainer.append(this.embeddedWidget.getElement());
			this.embeddedWidget.setWrapper(this);
			elt.css({
				'left': 0,
				'top': 0
			});			
			this.toolManager.getToolArea().append(elt);
			this.initHandlers();
		},
		
		initSvg: function(){
			var elt = this.getElement();
			this.svgContainer = d3.select(elt.get(0)).append("svg");
			this.svgContainer.attr('class','svgContainer');
			this.svgContainer.attr('width',0);
			this.svgContainer.attr('height',0);
			var defs = this.svgContainer.append('defs');
			
			// add left gradient
			this.leftGradientId = JSB().generateUid();
			var leftGradient = defs.append('linearGradient')
				.attr('id', this.leftGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '100%')
				.attr('y2', '0%');
			leftGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'left transparent');
			leftGradient.append('stop')
			.attr('offset', '100%')
			.attr('class', 'left opaque');

			// add right gradient
			this.rightGradientId = JSB().generateUid();
			var rightGradient = defs.append('linearGradient')
				.attr('id', this.rightGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '100%')
				.attr('y2', '0%');
			rightGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'right opaque');
			rightGradient.append('stop')
				.attr('offset', '100%')
				.attr('class', 'right transparent');

			// add top gradient
			this.topGradientId = JSB().generateUid();
			var topGradient = defs.append('linearGradient')
				.attr('id', this.topGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '0')
				.attr('y2', '100%');
			topGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'top transparent');
			topGradient.append('stop')
				.attr('offset', '100%')
				.attr('class', 'top opaque');

			// add bottom gradient
			this.bottomGradientId = JSB().generateUid();
			var bottomGradient = defs.append('linearGradient')
				.attr('id', this.bottomGradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '0')
				.attr('y2', '100%');
			bottomGradient.append('stop')
				.attr('offset', '0%')
				.attr('class', 'bottom opaque');
			bottomGradient.append('stop')
				.attr('offset', '100%')
				.attr('class', 'bottom transparent');
			
		},
		
		initHandlers: function(){
			var self = this;
			var elt = this.getElement();

			elt.mouseover(function(){
				self.isMouseInside = true;
				if(self.options.hideInterval > 0){
					JSB().cancelDefer('_toolHideInterval_');
				}
			});

			elt.mouseout(function(){
				self.isMouseInside = false;
				if(self.options.hideInterval > 0){
					JSB().defer(function(){
						self.close();
					}, self.options.hideInterval, '_toolHideInterval_');
				}
			});

            this.$(window).resize(function(){
                if($this.params && $this.isVisible()){
                	$this.updatePosition();
                }
                    
            });
/*
            if(this.options.draggable){
                elt.draggable({
                    drag: function( event, ui ) {
                        // $this.updatePosition();
                        // $this.svgContainer.remove();
                        // $this.initSvg();
                        // $this.trackPosition();
                        // $this.updateSvgCallouts();
                    },
                    stop: function( event, ui ) {
                        $this.updateSvgCallouts();
                    }
                });
            }
*/
		},
		
		getScope: function(){
			return this.scope;
		},
		
		showModalBackground: function(pt){
			var scope = this.getScope();
			var scopeEl = null;
			var rect = null;
			if(JSB.isInstanceOf(scope, 'JSB.Widgets.Control')){
				scopeEl = scope.getElement();
			} else if(JSB.isBean(scope)) {
				scopeEl = this.$('body');
			} else if(JSB.isNull(scope)){
				scopeEl = this.$('body');
			} else if(JSB.isWindow(scope)){
				scopeEl = null;
			} else {
				scopeEl = this.$(scope);
			}
			
			if(scopeEl){
				// construct modal background
				rect = scopeEl.get(0).getBoundingClientRect();
			}
			if(!rect || rect.width == 0 || rect.height == 0){
				// take a whole window rect
				rect = {
					left: 0,
					top: 0,
					width: this.$(window).width(),
					height: this.$(window).height()
				};
			}

			this.modalBack = this.$('<div class="_dwp_toolWrapperModalBack"></div>');
			this.modalHighlighter = this.$('<div class="_dwp_toolWrapperModalHighlighter"></div>');
			this.modalBack.append(this.modalHighlighter);
			this.modalBack.css({
				left: 0,
				top: 0,
				width: rect.width,
				height: rect.height
			});
			this.modalHighlighter.css({
				width: rect.width * 2, 
				height: rect.height * 2,
				left: -rect.width + pt.x - rect.left,
				top: -rect.height + pt.y - rect.top
			});
			scopeEl.append(this.modalBack);
			var droppables = scopeEl.find('.ui-droppable');
			var activeDroppables = [];
			droppables.each(function(){
				var disabled = $this.$(this).droppable('option', 'disabled');
				if(!disabled){
					activeDroppables.push(this);
				}
			});
			this.droppables = activeDroppables;
			for(var i = 0; i < activeDroppables.length; i++){
				$this.$(activeDroppables[i]).droppable('disable');
			}
			
			this.modalBack.fadeIn();
		},
		
		show: function(params){
			var self = this;
			this.prepareShow = false;
			for(var i in this.toolManager.visibleInstances){
				if(this.toolManager.visibleInstances[i] == this){
					return;	// already showing
				}
			}
			this.toolManager.visibleInstances.push(this);
			var elt = this.getElement();
			this.visible = true;
			this.params = params;
			this.scope = null;
			if(!JSB().isNull(this.options.scope)){
				this.scope = this.options.scope;
			}
			if(!JSB().isNull(params.scope)){
				this.scope = params.scope;
			}
			
			this.onHide = params.onHide;

			this.embeddedWidget.onShow();
			
			this.publish('toolShow', params);
			
			this.updatePosition();

			if(this.options.modal){
				this.addClass('_dwp_modal');
				this.showModalBackground(this.affinityPoint);
			} else {
				this.removeClass('_dwp_modal');
			}
			
			elt.addClass('visible');
			
			if( !JSB().isNull(this.embeddedWidget)){
				this.embeddedWidget.setFocus();
			}
			
			if(self.options.hideInterval > 0){
				// track target's mouse over and out
				var elt = params.target;
				this.trackProcs = {
					over: function(){
						JSB.cancelDefer('_toolHideInterval_');
					},
					out: function(){
						JSB.defer(function(){
							self.close();
						}, self.options.hideInterval, '_toolHideInterval_');
					}
				};
				params.target.selector.bind({
					mouseover: this.trackProcs.over,
					mouseout: this.trackProcs.out
				});
				if(params.handle && params.handle.selector){
					params.handle.selector.bind({
						mouseover: this.trackProcs.over,
						mouseout: this.trackProcs.out
					});
				}
				
				JSB.defer(function(){
					self.close();
				}, self.options.hideInterval, '_toolHideInterval_');
			}
		},
		
		resolveConstraints: function(cArr){
			var constraints = [];
			if(!JSB().isNull(cArr)){
				for(var i in cArr){
					var c = cArr[i];
					var newC = {
						weight: c.weight,
						left: c.left,
						top: c.top,
						width: c.width,
						height: c.height
					};
					
					var sel = JSB().$(c.selector);
					if(!JSB().isNull(c.selector) && sel.length > 0){
						var selRect = sel.get(0).getBoundingClientRect();
//							var offs = c.selector.offset();
						newC.left = selRect.left;
						newC.top = selRect.top;
						newC.width = selRect.width;
						newC.height = selRect.height;
					}
					
					if(JSB().isNull(newC.left) || JSB().isNull(newC.top) || JSB().isNull(newC.width) || JSB().isNull(newC.height)){
						continue;	// ignore constraint
					}
					
					if(!JSB().isNull(c.margin)){
						if(!JSB().isNull(c.margin.left)){
							newC.left -= c.margin.left;
							newC.width += c.margin.left;
						}
						if(!JSB().isNull(c.margin.right)){
							newC.width += c.margin.right;
						}
						if(!JSB().isNull(c.margin.top)){
							newC.top -= c.margin.top;
							newC.height += c.margin.top;
						}
						if(!JSB().isNull(c.margin.bottom)){
							newC.height += c.margin.bottom;
						}
					}
					constraints.push(newC);
				}
			}
			
			return constraints;
		},
		
		resolveAffinityPoint: function(){
			var ap = {x: 0, y: 0};
			var ptCnt = 0;
			for(var i in this.targets){
				var t = this.targets[i];
				var selRect = null;
				if(!JSB().isNull(t.selector)){
					var sel = this.$(t.selector);
					if(JSB().isNull(sel) || sel.length == 0){
						throw 'ToolWrapper.show: invalid selector specified';
						return;
					}
					selRect = sel.get(0).getBoundingClientRect();
					
				} else {
					selRect = {
						left: 0,
						right: this.$(window).width(),
						width: this.$(window).width(),
						top: 0,
						bottom: this.$(window).height(),
						height: this.$(window).height()
					};
				}
				var tRect = {
					left: selRect.left,
					top: selRect.top,
					right: selRect.right,
					bottom: selRect.bottom
				};
				var pt = {
					x: ( tRect.left + tRect.right ) / 2,
					y: ( tRect.top + tRect.bottom ) / 2
				};
				if(t.pivotHorz == 'left'){
					pt.x = tRect.left;
				} else if(t.pivotHorz == 'right'){
					pt.x = tRect.right;
				}
				if(t.pivotVert == 'top'){
					pt.y = tRect.top;
				} else if(t.pivotVert == 'bottom'){
					pt.y = tRect.bottom;
				}
				if(!JSB().isNull(t.offsetHorz)){
					pt.x += t.offsetHorz;
				}
				if(!JSB().isNull(t.offsetVert)){
					pt.y += t.offsetVert;
				}
				t.rect = tRect;
				t.pt = pt;
				ap.x += pt.x;
				ap.y += pt.y;
				ptCnt++;
			}
			
			ap.x /= ptCnt;
			ap.y /= ptCnt;
			
			return ap;
		},
		
		updatePosition: function(bUpdate){
			var self = this;
			var elt = this.getElement();

			if(JSB().isNull(this.params.distWeight)){
				this.params.distWeight = 0.1;
			}
			if(JSB().isNull(this.targets)){
				this.targets = [];
			}

			// merge targets
			var newTargets = [];
			if(JSB().isArray(this.params.target)){
				newTargets = this.params.target;
			} else {
				newTargets.push( this.params.target ); 
			}
			
			// remove old non-existed targets
			var idsToRemove = [];
			for(var i in this.targets){
				var t = this.targets[i];
				var bExisted = false;
				for(var j in newTargets){
					nT = newTargets[j];
					if(this.$(nT.selector).get(0) == this.$(t.selector).get(0)){
						bExisted = true;
						break;
					}
				}
				if(!bExisted){
					this.removeSvgCallout(t)
					idsToRemove.push(i);
				}
			}
			for(var i in idsToRemove){
				this.targets.splice(idsToRemove[i], 1);
			}
			
			// append new targets
			var targetsToAppend = [];
			for(var i in newTargets){
				var nT = newTargets[i];
				var bExisted = false;
				for(var j in this.targets){
					var t = this.targets[j];
					if(this.$(nT.selector).get(0) == this.$(t.selector).get(0)){
						bExisted = true;
						break;
					}
				}
				if(!bExisted){
					targetsToAppend.push(nT);
				}
			}
			for(var i in targetsToAppend){
				this.targets.push(targetsToAppend[i]);
			}

			if(this.targets.length > 0 && !JSB().isNull(this.targets[0].dock)){
				// perform docking
				var tgt = this.targets[0].selector;
				var xOffs = this.targets[0].offsetHorz || 0;
				var yOffs = this.targets[0].offsetVert || 0;
				var selRect = tgt.get(0).getBoundingClientRect();
				var posObj = {
					top: {
						x: selRect.left + xOffs, 
						y: selRect.top - this.getElement().outerHeight() + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					topRight: {
						x: selRect.left + selRect.width - this.getElement().outerWidth() + xOffs, 
						y: selRect.top - this.getElement().outerHeight() + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					bottom: {
						x: selRect.left + xOffs, 
						y: selRect.top + selRect.height + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					bottomRight: {
						x: selRect.left + selRect.width - this.getElement().outerWidth() + xOffs, 
						y: selRect.top + selRect.height + yOffs, 
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					left: {
						x: selRect.left - this.getElement().outerWidth() + xOffs,
						y: selRect.top + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					leftCenter: {
						x: selRect.left - this.getElement().outerWidth() + xOffs,
						y: selRect.top + selRect.height / 2 - this.getElement().outerHeight() / 2 + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					leftBottom: {
						x: selRect.left - this.getElement().outerWidth() + xOffs,
						y: selRect.top + selRect.height - this.getElement().outerHeight() + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					right: {
						x: selRect.left + selRect.width + xOffs,
						y: selRect.top + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					rightCenter: {
						x: selRect.left + selRect.width + xOffs,
						y: selRect.top + selRect.height / 2 - this.getElement().outerHeight() / 2 + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					},
					rightBottom: {
						x: selRect.left + selRect.width + xOffs,
						y: selRect.top + selRect.height - this.getElement().outerHeight() + yOffs,
						w: this.getElement().outerWidth(), 
						h: this.getElement().outerHeight()
					}


				};
				if(this.targets[0].align){
					switch(this.targets[0].align){
					case 'left':
						break;
					case 'right':
						break;
					case 'center':
						posObj.top.x = selRect.left - (this.getElement().outerWidth() - selRect.width) / 2;
						posObj.bottom.x = selRect.left - (this.getElement().outerWidth() - selRect.width) / 2;
						break;
					case 'top':
						break;
					case 'bottom':
						break;
					}
				}
				var priorityList = [];
				switch(this.targets[0].dock){
				case 'top':
					if(this.targets[0].align == 'right'){
						priorityList = [posObj.topRight, posObj.bottomRight, posObj.top, posObj.bottom, posObj.right, posObj.rightCenter, posObj.left, posObj.leftCenter];
					} else {
						priorityList = [posObj.top, posObj.topRight, posObj.bottom, posObj.bottomRight, posObj.right, posObj.rightCenter, posObj.left, posObj.leftCenter];
					}
					break;
				case 'bottom':
					if(this.targets[0].align == 'right'){
						priorityList = [posObj.bottomRight, posObj.topRight, posObj.bottom, posObj.top, posObj.right, posObj.rightCenter, posObj.left, posObj.leftCenter];
					} else {
						priorityList = [posObj.bottom, posObj.bottomRight, posObj.top, posObj.topRight, posObj.right, posObj.rightCenter, posObj.left, posObj.leftCenter];
					}
					break;
				case 'left':
					priorityList = [posObj.left, posObj.leftCenter, posObj.leftBottom, posObj.right, posObj.rightCenter, posObj.rightBottom, posObj.bottom, posObj.top];
					break;
				case 'right':
					priorityList = [posObj.right, posObj.rightCenter, posObj.rightBottom, posObj.left, posObj.leftCenter, posObj.leftBottom, posObj.bottom, posObj.top];
					break;
				}
				var bestR = null;
				var bestRect = null;
				for(var i in priorityList){
					var rect = priorityList[i];
					var testR = this.test(rect.x, rect.y, rect.w, rect.h);
					if(bestR === null || bestR > testR){
						bestR = testR;
						bestRect = rect;
						if(testR === 0){
							break;
						}
					}
				}
				this.rect = bestRect;
				elt.css({
					'left': this.rect.x,
					'top': this.rect.y,
				});
				this.affinityPoint = {x:selRect.left + selRect.width / 2, y:selRect.top + selRect.height / 2};
			} else {
				// find out affinity point
				var ap = this.resolveAffinityPoint();
				this.affinityPoint = ap;
				
				// resolve constraints
				var constraints = this.resolveConstraints(this.params.constraints);
				
				// resolve containment
				if(this.params.containment){
					this.containmentBox = JSB().$(this.params.containment).get(0).getBoundingClientRect();
				}

				// lookup best position via whirl algorithm
				var width = this.getElement().outerWidth();
				var height = this.getElement().outerHeight();
				this.minPt = {x: 0, y: 0, w: null};
				var whirlStep = 20;
				if(this.params.whirlStep){
					whirlStep = this.params.whirlStep; 
				}
				var sz = Math.max(width, height);
				var maxWhirlVal = Math.ceil(sz / whirlStep) * 2 + 1;
				this.whirl(ap.x - width / 2, ap.y - height / 2, whirlStep, function(x, y, val){
					x = Math.round(x);
					y = Math.round(y);

					// find distance between window position and target
					var cx = ap.x;
					var cy = ap.y;
					if(ap.x < x || ap.x > x + width || ap.y < y || ap.y > y + height){
						// calc the nearest point to the ap
						if(ap.x < x){
							cx = x;
						}
						if(ap.x > x + width){
							cx = x + width;
						}
						if(ap.y < y){
							cy = y;
						}
						if(ap.y > y + height){
							cy = y + height;
						}
					}
					var dist = (ap.x - cx) * (ap.x - cx) + (ap.y - cy) * (ap.y - cy);
					
					var w = Math.round(this.test(x, y, width, height, constraints) + dist * self.params.distWeight);
					if(this.minPt.w == null || w < this.minPt.w){
						this.minPt.w = w;
						this.minPt.x = x;
						this.minPt.y = y;
					}
					if(val > maxWhirlVal){
						return false;
					}
					
					return true;
				});
				this.rect = {
					x: this.minPt.x, 
					y: this.minPt.y, 
					w: width, 
					h: height
				};
				
				if(bUpdate){
					this.getElement().find('svg.svgContainer').css('display','none');
					elt.animate({
						'left': this.minPt.x,
						'top': this.minPt.y
					}, function(){
						// update svg callouts
						self.updateSvgCallouts();
						self.trackPosition();
						self.getElement().find('svg.svgContainer').fadeIn(200);
					});
				} else {
					elt.css({
						'left': this.minPt.x,
						'top': this.minPt.y
					});
					
					// update svg callouts
					this.updateSvgCallouts();
					
					this.trackPosition();
				}
			}
		},
		
		trackPosition: function(){
			var self = this;
			if(self.visible){
				var width = this.getElement().outerWidth();
				var height = this.getElement().outerHeight();
				var x = this.rect.x;
				var y = this.rect.y;
				var ap = this.resolveAffinityPoint();
				var cx = ap.x;
				var cy = ap.y;
				if(ap.x < x || ap.x > x + width || ap.y < y || ap.y > y + height){
					// calc the nearest point to the ap
					if(ap.x < x){
						cx = x;
					}
					if(ap.x > x + width){
						cx = x + width;
					}
					if(ap.y < y){
						cy = y;
					}
					if(ap.y > y + height){
						cy = y + height;
					}
				}
				
				var dist = (ap.x - cx) * (ap.x - cx) + (ap.y - cy) * (ap.y - cy);
				var w1 = this.test(this.rect.x, this.rect.y, width, height, this.resolveConstraints(this.params.constraints));
				var w2 = dist * self.params.distWeight;
				var w = Math.round(w1 + w2);
				if(Math.abs(w - this.minPt.w) > ((w + this.minPt.w) / 2) * 0.3){
					self.updatePosition(true);
				} else {
					JSB().defer(function(){
						self.trackPosition();
					}, 10, '__jsb_tw_trackPosMtx_' + $this.getId());
				}
			}
		},
		
		whirl: function(x, y, step, iteratorCallback){
			this.whirlAgg = [];
			var curPos = {
				x: x,
				y: y
			};
			var r = iteratorCallback.call(this, curPos.x, curPos.y, 0 );
			if(!r){
				return;
			}
			var dirVec = {
				x: step,
				y: 0
			};
			for(var curVal = 1; ; curVal++ ){
				for(var j = 0; j < 2; j++ ){
					for(var i = 0; i < curVal; i++ ){
						curPos.x += dirVec.x;
						curPos.y += dirVec.y;
						var r = iteratorCallback.call(this, curPos.x, curPos.y, curVal );
						if(!r){
							return;
						}
					}
					if(dirVec.x > 0){
						dirVec.x = 0;
						dirVec.y = step;
					} else if(dirVec.y > 0){
						dirVec.y = 0;
						dirVec.x = -step;
					} else if(dirVec.x < 0){
						dirVec.x = 0;
						dirVec.y = -step;
					} else {
						dirVec.y = 0;
						dirVec.x = step;
					}
				}
			}
		},

		
		test: function(x, y, w, h, cArr){
			var weight = 0.0;
			
			// check offScreen
			var offScreenCoff = 1000.0;
			var selfRect = {
				x: x,
				y: y,
				w: w,
				h: h
			};
			
			var sRect = {
				x: 0.0,
				y: 0.0,
				w: this.$( window ).width(),
				h: this.$( window ).height()
			};
			
			if(this.containmentBox){
				sRect = {
					x: this.containmentBox.left,
					y: this.containmentBox.top,
					w: this.containmentBox.right - this.containmentBox.left,
					h: this.containmentBox.bottom - this.containmentBox.top
				};
			} else {	// chrome optimization bug
				sRect.x = 0.0;
				sRect.y = 0.0;
			}
			
			var screenS = this.calcIntersectionSquare(selfRect,sRect);
			weight += ( w * h - screenS ) * offScreenCoff;
			// check constraints
			if(cArr){
				for(var i in cArr){
					var c = cArr[i];
					var cS = this.calcIntersectionSquare(selfRect, {
						x: c.left,
						y: c.top,
						w: c.width,
						h: c.height
					});
					weight += cS * c.weight;
				}
			}
			
			return weight;
		},
		
		calcIntersectionSquare: function(r1, r2){
			var left = Math.max(r1.x, r2.x);
			var top = Math.max(r1.y, r2.y);
			var right = Math.min(r1.x + r1.w, r2.x + r2.w);
			var bottom = Math.min(r1.y + r1.h, r2.y + r2.h);
			if(right < left || bottom < top){
				return 0;
			}
			return (right - left) * (bottom - top);
		},
		
		removeSvgCallout: function(target){
			if(!JSB().isNull(target.calloutElt)){
				target.calloutElt.remove();
				target.calloutElt = undefined;
			}
		},
		
		updateSvgCallouts: function(){
			// calculate SVG bound rect
			var minPt = {
				x: this.rect.x, 
				y: this.rect.y
			};
			var maxPt = {
				x: this.rect.x + this.rect.w, 
				y: this.rect.y + this.rect.h
			};
			
			for(var i in this.targets){
				var t = this.targets[i];
				minPt.x = Math.min(minPt.x, t.pt.x);
				minPt.y = Math.min(minPt.y, t.pt.y);
				maxPt.x = Math.max(maxPt.x, t.pt.x);
				maxPt.y = Math.max(maxPt.y, t.pt.y);
			}
			
			// update svg canvas
			var leftOffset = minPt.x - this.rect.x;
			var topOffset = minPt.y - this.rect.y;
			var svgWidth = maxPt.x - minPt.x;
			var svgHeight = maxPt.y - minPt.y;
			
			this.getElement().find('svg').css({
				left: leftOffset,
				top: topOffset,
				position: 'absolute'
			});
			this.svgContainer.attr('width', svgWidth);
			this.svgContainer.attr('height', svgHeight);
			
			// update callouts
			var sideOffset = 10;
			var minWdist = 20;
			for(var i in this.targets){
				var t = this.targets[i];
				
				// choose other two points to draw callout
				var side = null;
				if(t.pt.x < this.rect.x){
					if(t.pt.y < this.rect.y){  
						// left top corner
						if(this.rect.x - t.pt.x > this.rect.y - t.pt.y){
							side = 'left';
						} else {
							side = 'top'
						}
					} else if(t.pt.y > this.rect.y + this.rect.h){
						// left bottom corner
						if(this.rect.x - t.pt.x > t.pt.y - (this.rect.y + this.rect.h)){
							side = 'left';
						} else {
							side = 'bottom'
						}
					} else {
						// left side
						side = 'left';
					}
				} else if(t.pt.x > this.rect.x + this.rect.w){
					if(t.pt.y < this.rect.y){  
						// right top corner
						if(t.pt.x - (this.rect.x + this.rect.w) > this.rect.y - t.pt.y){
							side = 'right';
						} else {
							side = 'top'
						}
					} else if(t.pt.y > this.rect.y + this.rect.h){
						// right bottom corner
						if(t.pt.x - (this.rect.x + this.rect.w) > t.pt.y - (this.rect.y + this.rect.h)){
							side = 'right';
						} else {
							side = 'bottom'
						}
					} else {
						// right side
						side = 'right';
					}
					
				} else { // between left and right
					if(t.pt.y < this.rect.y){  
						// top side
						side = 'top';
					} else if(t.pt.y > this.rect.y + this.rect.h){
						// bottom size
						side = 'bottom';
					} else {
						// middle
					}
				}
				
				var pt1 = {x: 0, y: 0}, 
					pt2 = {x: 0, y: 0};
				var gradientId = null;
				if(side == 'top'){
					var wDist = (this.rect.y - t.pt.y) / 2;
					if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.x = t.pt.x - wDist / 2;
					pt1.y = this.rect.y;
					if(pt1.x < this.rect.x + sideOffset){
						pt1.x = this.rect.x + sideOffset;
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.x = pt1.x + wDist;
					pt2.y = pt1.y;
					if(pt2.x > this.rect.x + this.rect.w - sideOffset){
						pt2.x = this.rect.x + this.rect.w - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.x = pt2.x - wDist;  
					}
					gradientId = this.topGradientId;
				} else if(side == 'bottom'){
					var wDist = (t.pt.y - (this.rect.y + this.rect.h)) / 2;
					if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.x = t.pt.x - wDist / 2;
					pt1.y = this.rect.y + this.rect.h - 2;
					if(pt1.x < this.rect.x + sideOffset){
						pt1.x = this.rect.x + sideOffset;
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.x = pt1.x + wDist;
					pt2.y = pt1.y;
					if(pt2.x > this.rect.x + this.rect.w - sideOffset){
						pt2.x = this.rect.x + this.rect.w - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.w / 2){ wDist = this.rect.w / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.x = pt2.x - wDist;  
					}
					gradientId = this.bottomGradientId;
				} else if(side == 'left'){
					var wDist = (this.rect.x - t.pt.x) / 2;
					if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.y = t.pt.y - wDist / 2;
					pt1.x = this.rect.x;
					if(pt1.y < this.rect.y + sideOffset){
						pt1.y = this.rect.y + sideOffset;
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.y = pt1.y + wDist;
					pt2.x = pt1.x;
					if(pt2.y > this.rect.y + this.rect.h - sideOffset){
						pt2.y = this.rect.y + this.rect.h - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.y = pt2.y - wDist;  
					}
					gradientId = this.leftGradientId;
				} else if(side == 'right'){
					var wDist = (t.pt.x - (this.rect.x + this.rect.w)) / 2;
					if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
					if(wDist < minWdist){ wDist = minWdist; }
					pt1.y = t.pt.y - wDist / 2;
					pt1.x = this.rect.x + this.rect.w - 2;
					if(pt1.y < this.rect.y + sideOffset){
						pt1.y = this.rect.y + sideOffset
						wDist = Math.sqrt((t.pt.x - pt1.x)*(t.pt.x - pt1.x) + (t.pt.y - pt1.y)*(t.pt.y - pt1.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
					}
					pt2.y = pt1.y + wDist;
					pt2.x = pt1.x;
					if(pt2.y > this.rect.y + this.rect.h - sideOffset){
						pt2.y = this.rect.y + this.rect.h - sideOffset;
						wDist = Math.sqrt((t.pt.x - pt2.x)*(t.pt.x - pt2.x) + (t.pt.y - pt2.y)*(t.pt.y - pt2.y)) / 2;
						if(wDist > this.rect.h / 2){ wDist = this.rect.h / 2; }
						if(wDist < minWdist){ wDist = minWdist; }
						pt1.y = pt2.y - wDist;  
					}
					gradientId = this.rightGradientId;
				} else {
					// no callout
					this.removeSvgCallout(t);
					return;
				}
				
				
				if(JSB().isNull(t.calloutElt)){
					t.calloutElt = this.svgContainer.append('polyline');
				}
				
				var pointsStr = '' + (pt1.x - minPt.x) + ',' + (pt1.y - minPt.y)+ ' ' + (t.pt.x - minPt.x) + ',' + (t.pt.y - minPt.y) + ' ' + (pt2.x - minPt.x) + ',' + (pt2.y - minPt.y);
				t.calloutElt.attr('points', pointsStr);
				t.calloutElt.style('fill', 'url(#'+gradientId+')');

			}
			this.svgContainer.attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
		},
		
		
		close: function() {
			this.hide();

			if(this.options.data.closeCallback) {
			    this.options.data.closeCallback.call(this);
			}
		},
		
		hideModalBackground: function(){
			var self = this;
			
			// restore droppables
			if($this.droppables){
				for(var i = 0; i < $this.droppables.length; i++){
					try {
						$this.$($this.droppables[i]).droppable('enable');
					}catch(e){}
				}
				$this.droppables = null;
			}

			this.modalBack.fadeOut(function(){
				self.modalBack.remove();
				self.modalBack = null;
				
			});
		},
		
		hide: function(bCanceled){
			var self = this;
			this.prepareShow = false;
			if(this.frozen){
				return;
			}
			for(var i = 0; i < this.toolManager.visibleInstances.length; i++){
				if(this.toolManager.visibleInstances[i] == this){
					this.toolManager.visibleInstances.splice(i, 1);
					break;
				}
			}
			$this.removeClass('visible');
			self.visible = false;
			self.embeddedWidget.onHide(bCanceled);
			if(!JSB().isNull(self.onHide)){
				self.onHide(bCanceled);
			}
			if(self.options.hideInterval > 0){
				// unbind handlers
				self.params.target.selector.unbind({
					mouseover: self.trackProcs.over,
					mouseout: self.trackProcs.out
				});
				if(self.params.handle && self.params.handle.selector){
					self.params.handle.selector.unbind({
						mouseover: self.trackProcs.over,
						mouseout: self.trackProcs.out
					});
				}
			}
			
			if(this.options.modal){
				this.hideModalBackground();
			}
			
			this.publish('toolHide', this.params);
		},
		
		getToolId: function(){
			return this.toolId;
		},
		
		isVisible: function(){
			return this.visible;
		},
		
		setData: function(data){
			this.embeddedWidget.setData(data);
		},
		
		updateBehavior: function(b){
//				debugger;
		},
		
		getClientContainer: function(){
			return this.clientContainer;
		},
		
		setFocus: function(){
			this.embeddedWidget.setFocus();
		},
		
		freeze: function(b){
			var self = this;
			if(JSB().isNull(b)){
				b = true;
			}
			this.frozen = b;
			if(!this.frozen && !self.isMouseInside){
				if(this.options.hideInterval > 0){
					JSB().defer(function(){
						self.close();
					}, self.options.hideInterval, '_toolHideInterval_');
				}
			}
		},

		getTool: function(){
		    return this.embeddedWidget;
		},

		getTargetElement: function() {
		    return this.params.target;
		}
	}
}