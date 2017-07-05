{
	$name:'JSB.Widgets.Control',
	$require: ['JQuery', 'JSB.Widgets.DomController'],
	$client: {
		$constructor: function(opts){
			opts = opts || {};
			$base(opts);
			
			if(this.options !== this.$constructor.$superclass.options){
				this.options = JSB.merge(true, {}, this.$constructor.$superclass.options, this.options);
			} 
			this.options = JSB.merge(true, {}, this.options, opts);
			
			this.loadCss('control.css');
			if(this.options.element){
				this.element = this.$(this.options.element);
				delete this.options.element;
				this.element.attr('_id', this.getId());
				this.element.addClass('_dwp_control');
			} else {
				var tag = opts.tag || 'div';
				this.element = this.$('<'+tag+' _id="'+this.getId()+'" class="_dwp_control"></'+tag+'>');
			}
			this._init();
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
		
		hasOption: function(){
			return !JSB().isNull(this.options[opt]);
		},

		getElement: function(){
			return this.element;
		},
		
		_init: function(){
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
			if(JSB().isInstanceOf(c, 'JSB.Widgets.Control')){
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
		
		attr: function(){
			return this.getElement().attr.apply(this.getElement(), arguments);
		},
		
		isContentReady: function(sel){
			if(!sel){
				sel = '*[jsb]';
			}
			var ctrls = this.find(sel);
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
		}

	}
}