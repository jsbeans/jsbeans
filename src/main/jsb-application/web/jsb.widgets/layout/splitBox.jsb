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
	$name:'JSB.Widgets.SplitBox',
	$parent: 'JSB.Widgets.Control',
	$require:['jQuery.UI.Draggable',
	          'css:splitBox.css'],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_dwp_splitbox');
			self.init();
		},
		
		panes: [],
		filledPanes: [],
		splitters: [],
		splitterPositions: [],
		hidden:[],
		
		options: {
			overlay: false
		},
		
		init: function(){
			var self = this;
			
			var elt = this.getElement();
			var posArr = this.options.position;
			if(!JSB().isArray(posArr)){
				posArr = [this.options.position];
			}
			
			var curPos = 0;
			posArr[posArr.length] = 1;
			this.posArr = posArr;
			
			for(var i = 0; i < posArr.length; i++ ){
				(function(i){
					var splitPos = posArr[i];
					$this.splitterPositions[i] = splitPos;
					// append splitter
					if(i < posArr.length - 1){
						var pos = Math.floor(splitPos * 100) + '%';
						var splitter = $this.$('<div class="_dwp_splitter '+$this.options.type+'" idx="'+i+'"><div class="gripIcon"></div></div>');
						if($this.options.overlay){
							splitter.addClass('overlay');
						}
						$this.splitters[i] = splitter; 
						if($this.options.type == 'vertical'){
							splitter.css({
								left: pos
							});
							splitter.draggable({ 
								axis: 'x',
								start: function(evt, data){
									var splitter = data.helper;
									var idx = parseInt(splitter.attr('idx'));
									var firstPane = self.panes[idx];
									var secondPane = self.panes[idx + 1];
									splitter.percentWidth = ( firstPane.outerWidth() + secondPane.outerWidth() ) * 100 / elt.width();
								},
								drag: function(evt, data){
									var splitter = data.helper;
									var idx = parseInt(splitter.attr('idx'));
									var firstPane = self.panes[idx];
									var secondPane = self.panes[idx + 1];
									var deltaX = data.position.left - splitter.position().left;
									var leftPercent = ( firstPane.outerWidth() + deltaX ) * 100 / elt.width();
									
									var rightPercent = splitter.percentWidth - leftPercent;
									 
									var percent = data.position.left * 100 / elt.width();
									if(percent > 100){
										percent = 100;
									}
									if(percent < 0){
										percent = 0;
									}
									splitter.css('left', '' + percent + '%');
									data.position.left = self.updatePanes()[idx];
								},
								stop: function(evt, data){
									var splitter = data.helper;
									var percent = data.position.left * 100 / elt.width();
									splitter.css('left', '' + percent + '%');
									$this.splitterPositions[i] = data.position.left / elt.width();
									if($this.options.onChange){
										$this.options.onChange.call($this, i, $this.splitterPositions[i]);
									}
								}
							});
							
						} else {
							splitter.css({
								top: pos 
							});
							splitter.draggable({
								axis: 'y',
								start: function(evt, data){
									var splitter = data.helper;
									var idx = parseInt(splitter.attr('idx'));
									var firstPane = self.panes[idx];
									var secondPane = self.panes[idx + 1];
									splitter.percentHeight = ( firstPane.outerHeight() + secondPane.outerHeight() ) * 100 / elt.height();
								},
								drag: function(evt, data){
									var splitter = data.helper;
									var idx = parseInt(splitter.attr('idx'));
									var firstPane = self.panes[idx];
									var secondPane = self.panes[idx + 1];
									var deltaX = data.position.top - splitter.position().top;
									var leftPercent = ( firstPane.outerHeight() + deltaX ) * 100 / elt.height();
									
									var rightPercent = splitter.percentHeight - leftPercent;
									 
									var percent = data.position.top * 100 / elt.height();
									
									if(percent > 100){
										percent = 100;
									}
									if(percent < 0){
										percent = 0;
									}
									splitter.css('top', '' + percent + '%');
									data.position.top = self.updatePanes()[idx];
								},
								stop: function(evt, data){
									var splitter = data.helper;
									var percent = data.position.top * 100 / elt.height();
									splitter.css('top', '' + percent + '%');
									$this.splitterPositions[i] = data.position.top / elt.height();
									if($this.options.onChange){
										$this.options.onChange.call($this, i, $this.splitterPositions[i]);
									}

								}
							});

						}
						elt.append(splitter);
						splitter.css('position','');
					}
					
					var fromPos = curPos;
					var toPos = splitPos;
					var paneElt = $this.$('<div class="_dwp_splitPane '+$this.options.type+'"></div>');
					if($this.options.type == 'vertical'){
						paneElt.css({
							left: fromPos * elt.width(),
							width: (toPos - fromPos) * elt.width()
						});
					} else {
						paneElt.css({
							top: fromPos * elt.height(),
							height: (toPos - fromPos) * elt.height()
						});
					}
					
					elt.append(paneElt);
					$this.panes.push(paneElt);
					$this.filledPanes.push(false);

					curPos = splitPos;

				})(i);
			}
			
			elt.resize(function(){
				self.updatePanes();
			});
		},
		
		updatePanes: function(){
			var elt = this.getElement();
			if(!elt.is(':visible')){
				return;
			}
			
			// update visibility
			var vPanes = [];
			var vSplitters = [];
			
			for(var i = 0; i < this.panes.length; i++){
				if(this.hidden[i]){
					if(i == this.panes.length - 1 && this.panes.length > 1){
						if(vSplitters.length > 0){
							var s = vSplitters.pop();
							s.css({display:'none'});
						}
					} else {
						this.splitters[i].css({display:'none'});
					}
					
					this.panes[i].css({display:'none'});
					continue;
				}
				vPanes.push(this.panes[i]);
				this.panes[i].css({display:'block'});
				
				if(i < this.panes.length - 1){
					vSplitters.push(this.splitters[i]);
					this.splitters[i].css({display:'block'});
				}
			}
			
			// update layout
			var curPos = 0;
			var splittersPos = [];
			for(var i = 0; i < vPanes.length; i++ ){

				var paneElt = vPanes[i];
				var splitPos = 0, nextPos = 0;
				if( i < vPanes.length - 1){
					if( this.options.type == 'vertical' ){
						var sLeftPos = vSplitters[i].position().left;
						splitPos = sLeftPos;
						nextPos = sLeftPos + ($this.options.overlay ? Math.round(vSplitters[i].outerWidth() / 2) : vSplitters[i].outerWidth()); 
					} else {
						var sTopPos = vSplitters[i].position().top;
						splitPos = sTopPos;
						nextPos = sTopPos + ($this.options.overlay ? Math.round(vSplitters[i].outerHeight() / 2) : vSplitters[i].outerHeight());
					}
					splittersPos[i] = splitPos;
				} else {
					if( this.options.type == 'vertical' ){
						splitPos = elt.width();
					} else {
						splitPos = elt.height();
					}
				}
				
				var fromPos = curPos;
				var toPos = splitPos;
				if(this.options.overlay && i < vPanes.length - 1){
					if(this.options.type == 'vertical'){
						toPos += Math.round(vSplitters[i].outerWidth() / 2);
					} else {
						toPos += Math.round(vSplitters[i].outerHeight() / 2);
					}
				}
				
				if(this.options.type == 'vertical'){
					var nw = toPos - fromPos;
					paneElt.css({
						left: Math.round(fromPos),
						width: Math.round(nw)
					});
					if(paneElt.width() && paneElt.width() != nw ){
						// fixup splitter
						var splitter = null;
						if(i > 0){
							splitter = vSplitters[i-1];
							if(splitter){
								var spos = splitter.position().left - (paneElt.outerWidth() - nw);
								splittersPos[i-1] = spos;
								var ppos = spos * 100 / elt.width();
								$this.splitterPositions[i-1] = spos / elt.width();
								splitter.css({left: ''+ ppos + '%'})
								paneElt.css({
									left: Math.round(splitter.position().left) + ($this.options.overlay ? Math.round(splitter.outerWidth() / 2) : splitter.outerWidth())
								});
							}
						} else {
							splitter = vSplitters[i];
							if(splitter){
								var spos = splitter.position().left + (paneElt.outerWidth() - nw);
								splittersPos[i] = spos;
								var ppos = spos * 100 / elt.width();
								$this.splitterPositions[i] = spos / elt.width();
								splitter.css({left: ''+ ppos + '%'})
							}
						}
						if(splitter){
							nextPos = splitter.position().left + ($this.options.overlay ? Math.round(splitter.outerWidth() / 2) : splitter.outerWidth());
						}
					}
				} else {
					var nh = toPos - fromPos;
					paneElt.css({
						top: Math.round(fromPos),
						height: Math.round(nh)
					});
					if(paneElt.height() && paneElt.height() != nh ){
						// fixup splitter
						var splitter = null;
						if(i > 0){
							splitter = vSplitters[i-1];
							if(splitter){
								var spos = splitter.position().top - (paneElt.outerHeight() - nh);
								splittersPos[i-1] = spos;
								var ppos = spos * 100 / elt.height();
								$this.splitterPositions[i-1] = spos / elt.height();
								splitter.css({top: ''+ ppos + '%'})
								paneElt.css({
									top: Math.round(splitter.position().top) + ($this.options.overlay ? Math.round(splitter.outerHeight() / 2) : splitter.outerHeight())
								});
							}
						} else {
							splitter = vSplitters[i];
							if(splitter){
								var spos = splitter.position().top + (paneElt.outerHeight() - nh);
								splittersPos[i] = spos;
								var ppos = spos * 100 / elt.height();
								$this.splitterPositions[i] = spos / elt.height();
								splitter.css({top: ''+ ppos + '%'})
							}
						}
						if(splitter){
							nextPos = splitter.position().top + ($this.options.overlay ? Math.round(splitter.outerHeight() / 2) : splitter.outerHeight());
						}
					}
				}
				
				curPos = nextPos;
			}
			
			return splittersPos;
		},
		
		getType: function(){
			return this.options.type;
		},
		
		showPane: function(paneIdx, bShow){
			this.hidden[paneIdx] = !bShow;
			
			this.updatePanes();
		},
		
		addToPane: function(paneIdx, ctrl){
			this.panes[paneIdx].append(this.resolveElement(ctrl));
			this.filledPanes[paneIdx] = true;
			this.hidden[paneIdx] = false;
			
			return this.panes[paneIdx];
		},
		
		getPane: function(paneIdx){
			return this.panes[paneIdx];
		},
		
		append: function(ctrl){
			for(var i = 0; i < this.filledPanes.length; i++ ){
				if(!this.filledPanes[i]){
					this.addToPane(i, ctrl);
					return this;
				}
			}
			return this;
		},
		
		getSplitterPosition: function(idx){
			if(!idx){
				idx = 0;
			}
			return this.splitterPositions[idx];
		},
		
		setSplitterPosition: function(idx, pos, animateObj, readyCallback){
			var splitter = $this.splitters[idx];
			if(pos < 0){
				pos = 0;
			}
			if(pos > 1){
				pos = 1;
			}
			
			if(animateObj){
				if(!JSB.isObject(animateObj)){
					animateObj = {};
				}
				animateObj.duration = animateObj.duration || 300;
				progressProc = animateObj.progress;
				animateObj.progress = function(){
					$this.updatePanes();
					if(progressProc){
						progressProc.call($this);
					}
				};
				if(JSB.isFunction(readyCallback)){
					animateObj.complete = readyCallback;
				}
			}
			
			var cssObj = {};
			if($this.options.type == 'vertical'){
				cssObj.left = '' + (pos*100) + '%';
			} else {
				cssObj.top = '' + (pos*100) + '%';
			}
			
			if(animateObj){
				splitter.animate(cssObj, animateObj);
			} else {
				splitter.css(cssObj);
				$this.updatePanes();
				if(JSB.isFunction(readyCallback)){
					readyCallback.call(this);
				}
			}
		}
	}
}