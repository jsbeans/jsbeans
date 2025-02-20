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
	$name:'JSB.Widgets.Control',
	$require: ['JQuery', 'JSB.Widgets.DomController', 'css:control.css'],
	$client: {
		$constructor: function(opts){
			opts = opts || {};
			$base(opts);
			
			if(this.options !== this.$constructor.$superclass.options){
				this.options = JSB.merge(true, {}, this.$constructor.$superclass.options, this.options);
			} 
			if(opts && Object.keys(opts).length > 0){
				this.options = JSB.merge(true, {}, this.options, opts);
			}
			
			if(this.options.element){
				this.element = this.$(this.options.element);
				delete this.options.element;
				this.element.attr('_id', this.getId());
				this.element.addClass('_jsb_control');
			} else {
				var tag = opts.tag || 'div';
				this.element = this.$('<'+tag+' _id="'+this.getId()+'" class="_jsb_control"></'+tag+'>');
			}
			// options class
            if(this.options.cssClass){
                this.addClass(this.options.cssClass);
            }
			this._jsb_init();
		},
		
		destroy: function(){
			if(this.getElement()){
				this.getElement().remove();
			}
			$base();
		},
		
		options: {
			onContextMenu: null
		},
		
		/* methods */
		setOption: function(opt, b){
			this.options[opt] = b;
		},
		
		getOption: function(opt){
			return this.options[opt];
		},
		
		hasOption: function(opt){
			return !JSB().isNull(this.options[opt]);
		},

		getElement: function(){
			return this.element;
		},
		
		_jsb_init: function(){
			var self = this;
/*				
				// install tooltip
				if(!JSB().isNull(this.options.tooltip)){
					self.installTooltipHandler();
				}
*/				
			this.subscribe('setFocus', function(sender, msg, params){
				if(sender != this){
					self.loseFocus();
				}
			});
			this._isFocused = false;
			
			this.getElement().bind('contextmenu',function(evt){
				if(self.options.onContextMenu){
					if( self.options.onContextMenu.call(self, evt) ){
						evt.stopPropagation();
					}
				} else {
					evt.preventDefault();
				}
			});
			
/*
				this.getElement().bind('DOMNodeInserted', function(evt){
					console.log('DOMNodeInserted: ' + (evt.target && evt.target.nodeName) || 'noname');
					if(evt.target.nodeName && evt.target.nodeName.toLowerCase() == 'control'){
						this.injectControl(JSB().$(evt.target));
					}
				});
*/				
		},
		
		installTooltipHandler: function(){
			var self = this;
			this.getElement().on({
				mouseover: function(evt){
					self.showTooltip();
				},
				mouseout: function(evt){
					self.hideTooltip();
				}
			});
		},
		
		showTooltip: function(params){
			var self = this;
			var elt = this.getElement();
			var p = this.$.extend(true, {
				id: '_dwp_standardTooltip',
				cmd: 'show',
				data: self.options.tooltip.text,
				scope: this,
				target: {
					selector: elt,
					pivotHorz: 'center',
					pivotVert: 'top',
					offsetHorz: 0,
					offsetVert: 0
				},
				distWeight: 0.1,
				constraints: [{
					weight: 1.0,
					selector: elt
				}],
			}, params);
			self.publish('tool', p);
		},
		
		hideTooltip: function(){
			this.publish('tool', {
				id: '_dwp_standardTooltip',
				cmd: 'hide',
			});
		},
		
		screenToLocal: function(x, y){
			var pt = this.getRelativePosition();
			return {x: x - pt.left, y: y - pt.top};
		},

		localToScreen: function(x, y){
			var pt = this.getRelativePosition();
			return {x: x + pt.left, y: y + pt.top};
		},

		getRelativePosition: function(relativeToElt){
			var pt = {
				left: 0,
				top: 0
			};
			var curElt = this.getElement();
			var wOff = curElt.offset();
			if(relativeToElt == null){
				return wOff;
			}
			var targetElt = this.$(relativeToElt);
			var rOff = targetElt.offset();
			return {
				left: wOff.left - rOff.left,
				top: wOff.top - rOff.top
			}
		},
		
		resolveElement: function(c){
			if(JSB().isInstanceOf(c, 'JSB.Widgets.Control') || JSB().isInstanceOf(c, 'JSB.Controls.Control')){
				c = c.getElement();
			} else if(!JSB().isString(c)){
				c = this.$(c);
			}
			return c;
		},
		
		append: function(c){
			var self = this;
			var ret = this.getElement().append(this.resolveElement(c));
			return ret;
		},

		prepend: function(c){
			var self = this;
			var ret = this.getElement().prepend(this.resolveElement(c));
			return ret;
		},
		
		find: function(c){
			return this.getElement().find(c);
		},
		
		classed: function(c, b){
			if(b){
				this.addClass(c);
			} else {
				this.removeClass(c);
			}
		},
		
		addClass: function(c){
			return this.getElement().addClass(c);
		},
		
		removeClass: function(c){
			return this.getElement().removeClass(c);
		},
		
		toggleClass: function(c){
			return this.getElement().toggleClass(c);
		},
		
		hasClass: function(cls){
			return this.getElement().hasClass(cls);
		},
		
		setFocus: function(){
			this.publish('setFocus');
			this._isFocused = true;
		},
		
		loseFocus: function(){
			this._isFocused = false;
		},
		
		isFocused: function(){
			return this._isFocused;
		},
		
		isVisible: function(){
			if(this.element.is(':visible')){
				var r = this.element.get(0).getBoundingClientRect();
				return r.bottom >= 0 
					&& r.right >= 0 
					&& r.top <= (window.innerHeight || document.documentElement.clientHeight)
					&& r.left <= (window.innerWidth || document.documentElement.clientWidth);
			}
			return false;
		},
		
		attr: function(){
			return this.getElement().attr.apply(this.getElement(), arguments);
		},
		
		removeAttr: function(){
			return this.getElement().removeAttr.apply(this.getElement(), arguments);
		},
		
		isContentReady: function(sel, shouldExists){
			if(!sel){
				sel = '*[jsb]';
			}
			var ctrls = this.find(sel);
			if(shouldExists){
				if(ctrls.length === 0){
					return false;
				}
				if(JSB.isNumber(shouldExists)){
					if(ctrls.length != shouldExists){
						return false;
					}
				}
			}
			for(var i = 0; i < ctrls.length; i++){
				if(!this.$(ctrls[i]).attr('_id')){
					return false;
				}
			}
			
			return true;
		},
		
		isAttached: function(){
			return this.$.contains(document, this.getElement().get(0));
		},
		
		detach: function(){
			if(!this.isAttached()){
				return;
			}
			
			if(this.replacingMark){
				this.replacingMark.remove();
				this.replacingMark = null;
			}
			
			// create replacing placeholder mark
			this.replacingMark = this.$('<div id="'+this.getId()+'_rmark"></div>');
			this.getElement().after(this.replacingMark);
			this.getElement().detach();
		},
		
		attach: function(){
			if(!this.replacingMark || this.isAttached()){
				return;
			}
			this.replacingMark.before(this.getElement());
			this.replacingMark.remove();
			this.replacingMark = null;
		},
		
		copyToClipboard: function(str) {
			if(!str){
				str = this.getElement().text();
			}
			const el = document.createElement('textarea');  // Create a <textarea> element
			el.value = str;                                 // Set its value to the string that you want copied
			el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
			el.style.position = 'absolute';                 
			el.style.left = '-9999px';                      // Move outside the screen to make it invisible
			document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
			const selected =            
				document.getSelection().rangeCount > 0        // Check if there is any content selected previously
					? document.getSelection().getRangeAt(0)     // Store selection if found
					: false;                                    // Mark as false to know no selection existed before
			el.select();                                    // Select the <textarea> content
			document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
			document.body.removeChild(el);                  // Remove the <textarea> element
			if (selected) {                                 // If a selection existed before copying
				document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
				document.getSelection().addRange(selected);   // Restore the original selection
			}
		},

		// temp before replace with JSB.Controls.Control
		registerChild: function(){},
		unregisterChild: function(){},
		
		
	}
}