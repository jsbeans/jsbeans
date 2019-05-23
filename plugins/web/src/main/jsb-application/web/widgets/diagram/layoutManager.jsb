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
	$name: 'JSB.Widgets.Diagram.LayoutManager',
	
	$client: {
		busy: false,

		options: {
		},
		
		$constructor: function(diagram, opts){
			var self = this;
			$base();
			this.diagram = diagram;
			JSB().merge(true, this.options, opts);
		},
		
		getOption: function(node, optName){
			if(!node.options.layout){
				return null;
			}
			var layoutOpts = node.options.layout[this.key];
			if(!layoutOpts){
				return null;
			}

			var optVal = layoutOpts[optName];
			if(JSB().isFunction(optVal)){
				return optVal.call(node);
			}
			return optVal;
		},
		
		execute: function(items){
			var self = this;
			if(this.busy){
				if(!this.waitBatch){
					this.waitBatch = JSB().merge({}, items);
					JSB().deferUntil(function(){
						var items = self.waitBatch;
						self.waitBatch = null;
						self.execute(items);
					}, function(){
						return !self.busy;
					});
				} else {
					JSB().merge(this.waitBatch, items);
				}
				return;
			}
			this.busy = true;
			
			var rChanged = this.layout(items);
			
			if(Object.keys(rChanged).length === 0){
				this.busy = false;
				return;
			}
			
			this.translateNodes(rChanged);

		},
		
		layout: function(items){
			throw 'JSB.Widgets.Diagram.LayoutManager.layout should be overriden';
		},
		
		getStyleProperty: function( propName ) {
			if ( !propName ) {
				return;
			}
			var prefixes = 'Webkit Moz ms Ms O'.split(' ');
			var docElemStyle = document.documentElement.style;

			// test standard property first
			if ( typeof docElemStyle[ propName ] === 'string' ) {
				return propName;
			}

			// capitalize
			propName = propName.charAt(0).toUpperCase() + propName.slice(1);

			// test vendor specific properties
			var prefixed;
			for ( var i=0, len = prefixes.length; i < len; i++ ) {
				prefixed = prefixes[i] + propName;
				if ( typeof docElemStyle[ prefixed ] === 'string' ) {
					return prefixed;
				}
			}
		},
		
		translateNodes: function(rects){
			var self = this;
			var waitMap = {};
			for(var nId in rects){
				var r = rects[nId];
				var newPt = {x: r.x, y: r.y};
				var node = this.diagram.nodes[nId];
				var oldPos = node.getPosition();
				if(oldPos.x == newPt.x && oldPos.y == newPt.y){
					continue;
				}
				var expandOpt = this.getOption(node, 'nodeExpand');
				if(expandOpt){
					if(JSB().isNumber(expandOpt)){
						newPt.x += expandOpt;
						newPt.y += expandOpt;
					} else if(JSB().isPlainObject(expandOpt)){
						newPt.x += expandOpt.left || 0;
						newPt.y += expandOpt.top || 0;
					}
				}
				var animOpt = this.getOption(node, 'animate');
				if(!animOpt){
					node.setPosition(newPt.x, newPt.y);
				} else {
					// do animation
					(function(node, newPt){
						waitMap[node.getId()] = node;
						var elt = node.getElement();
						var transEndProp = 'transitionend';

						var transitionHandler = function(){
							elt.get(0).removeEventListener(transEndProp, arguments.callee);
							
							// update dimenstions
							var cssObj = {};
							cssObj[self.getStyleProperty('transition-property')] = '';
							cssObj[self.getStyleProperty('transition-duration')] = '';
							cssObj[self.getStyleProperty('transform')] = '';
							
							elt.css(cssObj);
							node.setPosition(newPt.x, newPt.y);
							delete waitMap[node.getId()];
							if(Object.keys(waitMap).length === 0){
								self.busy = false;
							}
						}
						elt.get(0).addEventListener(transEndProp, transitionHandler);

						var cssObj = {};
						
						var oldPos = node.getPosition();
						cssObj[self.getStyleProperty('transition-property')] = 'transform';
						cssObj[self.getStyleProperty('transition-duration')] = '0.4s';
						cssObj[self.getStyleProperty('transform')] = 'translate('+(newPt.x - oldPos.x)+'px,'+(newPt.y - oldPos.y)+'px)';
						
						elt.css(cssObj);
						
					})(node, newPt);

				}
				if(Object.keys(waitMap).length === 0){
					this.busy = false;
				}
			}
		}

	}
}