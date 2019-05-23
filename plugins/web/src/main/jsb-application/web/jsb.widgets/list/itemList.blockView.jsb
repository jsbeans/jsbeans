/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.ItemList.BlockView',
	$parent: 'JSB.Widgets.ItemList.View',
	
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			JSB().loadScript('tpl/packery/packery.pkgd.min.js', function(){
				self.initPackery(opts);
			});
			
			this.subscribe(['JSB.Widgets.ItemList.insertItem', 'JSB.Widgets.ItemList.deleteItem','JSB.Widgets.ItemList.clear'], function(sender, msg, params){
				if(self.list !== sender){
					return;
				}
				
				if(!self.frozen) {
					self.update(true);
				}
				if(msg == 'JSB.Widgets.ItemList.insertItem'){
					var wrapper = params.item.getElement().parent();
					wrapper.resize(function(){
						if(!wrapper.is(':visible')){
							return;
						}

						self.update();
					});
				}
				
			});
			
			this.subscribe(['JSB.Widgets.ItemList.addItem'], function(sender, msg, params){
				if(self.list !== sender){
					return;
				}
				if(!self.isActive()){
					return;
				}
				
				if(self.packeryInitialized){
					if(!self.frozen){
						self.getContainer().packery('appended', params.item.getElement().parent());
					}
					if(params.item.getElement().parent().is('.stamp')){
						self.getContainer().packery('stamp', params.item.getElement().parent());
					}
				}

				// apply sizing if needed
				if(self.blockSizingDesc){
					JSB().deferUntil(function(){
						self.applyBlockSizing(params.item, true);
					}, function(){
						return params.item.getElement().width() > 0 && params.item.getElement().height() > 0;
					});
				}
				
				var wrapper = params.item.getElement().parent();
				wrapper.resize(function(){
					if(!wrapper.is(':visible')){
						return;
					}
					self.update();
				});

				
			});
			
		},
		
		options: {},
		packeryInitialized: false,
		frozen: false,
		
		freeze: function(val){
			this.frozen = val;
			if(!val){
				this.update(true);
			}
		},
		
		initPackery: function(opts){
			var self = this;
			
			if(!this.getContainer() || !this.getContainer().packery || this.packeryInitialized){
				return;
			}
			
			this.lastContainerSize = {
				width: this.getContainer().width(),
				height: this.getContainer().height()
			};
			
			this.getContainer().resize(function(){
				if(!$this.getContainer().is(':visible')){
					return;
				}
				var nw = self.getContainer().width();
				if(self.lastContainerSize.width != nw){
					self.update();
				}
				self.lastContainerSize.width = nw;
				self.lastContainerSize.height = self.getContainer().height();
			});
			
			this.getContainer().packery(JSB().merge({}, opts, {
				containerStyle: null, 
				itemSelector: 'li._dwp_listBoxItem',
				stamp: 'li._dwp_listBoxItem.stamp',
				isResizeBound: true 
			}));
			
			if(self.options.onLayoutComplete){
				this.getContainer().packery('on', 'layoutComplete', self.options.onLayoutComplete);
			}
			
			this.packeryInitialized = true;
		},
		
		activate: function(container){
			$base(container);
			this.initPackery();
		},
		
		stamp: function(elts, bClear){
			var eltArr = [];
			if(JSB().isArray(elts)){
				eltArr = elts;
			} else {
				eltArr.push(elts);
			}
			
			var pArr = [];
			for(var i in eltArr){
				pArr.push(eltArr[i].wrapper);
			}
			
			if(self.packeryInitialized){
				if(bClear){
					this.getContainer().packery('unstamp', pArr);
				} else {
					this.getContainer().packery('stamp', pArr);
				}
			} else {
				for(var i in pArr){
					if(bClear){
						pArr[i].removeClass('stamp');
					} else {
						pArr[i].addClass('stamp');
					}
				}
			}
		},
		
		unstamp: function(elts){
			this.stamp(elts, true);
		},
		
		update: function(doRescan){
			var self = this;
			if(!this.isActive()){
				return;
			}
			if(!self.packeryInitialized){
				JSB().deferUntil(function(){
					self.update(doRescan);
				}, function(){
					return self.packeryInitialized;
				});
			} else {
				JSB().defer(function(){
					if(!self.getContainer()){
						return;
					}
					
					if(!self.frozen){
						if(doRescan){
							self.getContainer().packery('reloadItems');
						}
						
						// do layout
						self.getContainer().packery();
					}
				}, 300, 'updatePackeryLayout' + this.getId());
			}
		},
		
		setBlockSize: function(desc){
			this.blockSizingDesc = desc;
		},
		
		applyBlockSizing: function(item, b){
			if(!this.blockSizingDesc){
				return;
			}
			var size = 1;
			if(b){
				var size = this.blockSizingDesc.size(item);
			}
			var w = null;
			var h = null;
			if(item.getElement().parent().attr('ow')){
				w = parseInt(item.getElement().parent().attr('ow'));
				h = parseInt(item.getElement().parent().attr('oh'));
			} else {
				w = item.getElement().parent().outerWidth();
				h = item.getElement().parent().outerHeight();
				item.getElement().parent().attr('ow', w);
				item.getElement().parent().attr('oh', h);
			}
			
			item.getElement().parent().css({
				width: w * size,
				height: h * size
			});
			item.getElement().css({
				'-ms-transform': 'scale('+size+','+size+')',
				'-webkit-transform': 'scale('+size+','+size+')',
				'transform': 'scale('+size+','+size+')',
				position: 'absolute',
				left: -(w - w * size) / 2,
				top: -(h - h * size) / 2,
			});
			item.getElement().resize(function(){
				if(!item.getElement().is(':visible')){
					return;
				}
				var nw = item.getElement().outerWidth();
				var nh = item.getElement().outerHeight();
				item.getElement().parent().css({
					width: nw * size,
					height: nh * size
				});
			});
		}
	}
}