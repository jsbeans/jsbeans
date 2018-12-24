{
	$name: 'JSB.Controls.Control',
	$require: ['JQuery', 
	           'JSB.Widgets.DomController',
	           'css:Control.css'],
	$client: {
		$constructor: function(opts){
		    opts = opts || {};
		    $base(opts);

            if(this.options !== this.$constructor.$superclass.options){
                this.options = JSB.merge(true, {}, this.$constructor.$superclass.options, this.options);
            }
		    this.options = JSB.merge(true, {}, this.options, opts);

            if(this.options.element){
                this.element = this.$(this.options.element);
                delete this.options.element;
                this.element.attr('_id', this.getId());
                this.element.addClass('jsb-control');
            } else {
                var tag = opts.tag || 'div';
                this.element = this.$('<'+tag+' _id="'+this.getId()+'" class="jsb-control"></'+tag+'>');
            }

            if(this.options.cssClass){
                this.addClass(this.options.cssClass);
            }

            //todo: context menu btn?
		},

        options: {
            cssClass: null,
            enabled: true
        },

        addClass: function(c){
            return this.getElement().addClass(c);
        },

        append: function(c){
            var ret = this.getElement().append(this.resolveElement(c));
            return ret;
        },

		attach: function(){
			if(!this.replacingMark || this.isAttached()){
				return;
			}
			this.replacingMark.before(this.getElement());
			this.replacingMark.remove();
			this.replacingMark = null;
		},

		attr: function(){
			return this.getElement().attr.apply(this.getElement(), arguments);
		},

		children: function(selector){
		    return this.getElement().children(selector);
		},

		classed: function(c, b){
			if(b){
				this.addClass(c);
			} else {
				this.removeClass(c);
			}
		},
		
		destroy: function(){
			if(this.getElement()){
				this.getElement().remove();
			}
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

		enable: function(b){
		    this.options.enabled = b;

		    this.classed('disabled', b);
		},

		find: function(c){
			return this.getElement().find(c);
		},

        getElement: function(){
            return this.element;
        },

        getOption: function(opt){
            return this.options[opt];
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

		hasClass: function(cls){
			return this.getElement().hasClass(cls);
		},

        hasOption: function(opt){
            return !JSB().isNull(this.options[opt]);
        },

		isAttached: function(){
			return this.$.contains(document, this.getElement().get(0));
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

		isEnabled: function(){
			return this.options.enabled;
		},

		localToScreen: function(x, y){
			var pt = this.getRelativePosition();
			return {x: x + pt.left, y: y + pt.top};
		},

		on: function(eventName, func){
		    if(!JSB().isFunction(func)) return;

		    this.options[eventName] = func;
		    this.getElement().on(eventName, function(evt){
		        if(!$this.options.enabled) return;
		        $this.options[eventName].call($this, evt);
		    });
		},

		prepend: function(c){
			var ret = this.getElement().prepend(this.resolveElement(c));
			return ret;
		},

		removeClass: function(c){
			return this.getElement().removeClass(c);
		},

        resolveElement: function(c){
            if(JSB().isFunction(c.getElement)){
                c = c.getElement();
            } else if(!JSB().isString(c)){
                c = this.$(c);
            }
            return c;
        },

		setOption: function(opt, b){
			this.options[opt] = b;
		},
		
		screenToLocal: function(x, y){
			var pt = this.getRelativePosition();
			return {x: x - pt.left, y: y - pt.top};
		},

		toggleClass: function(c){
            return this.getElement().toggleClass(c);
		}
	}
}