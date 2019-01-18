{
	$name: 'JSB.Controls.Control',
	$require: ['JQuery', 
	           'JSB.Widgets.DomController',
	           'css:Control.css'],
	$client: {
	    _innerBeans: {},

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
            return this.getElement().append(c);
        },

		attach: function(){
		    // todo
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

		contains: function(element){
		    if(JSB.isBean(element)){
		        if(JSB.isInstanceOf(element, 'JSB.Controls.Control') || JSB.isInstanceOf(element, 'JSB.Widgets.Control')){
		            element = element.getElement().get(0);
		        } else {
		            throw new Error('Not allow type of argument (bean must be JSB.Controls.Control or JSB.Widgets.Control)');
		        }
		    } else if(element instanceof this.$) {
		        element = element.get(0);
		    } else if(element instanceof Element) {
		        // allow
            } else {
                throw new Error('Not allow type of argument (must be bean (JSB.Controls.Control or JSB.Widgets.Control), jQuery or HTML element');
            }

		    return this.$.contains(this.getElement().get(0), element);
		},
		
		destroy: function(){
		    for(var i in this._innerBeans){
		        if(this.contains(this._innerBeans[i].getElement())){
		            this._innerBeans[i].destroy();
                }
		    }

			if(this.getElement()){
				this.getElement().remove();
			}

			$base();
		},

		detach: function(){
		    // todo
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

		hasClass: function(cls){
			return this.getElement().hasClass(cls);
		},

        hasOption: function(opt){
            return !JSB().isNull(this.options[opt]);
        },

		isAttached: function(){
			return this.$.contains(document, this.getElement().get(0));
		},

		isEnabled: function(){
			return this.options.enabled;
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
			return this.getElement().prepend(c);
		},

		removeClass: function(c){
			return this.getElement().removeClass(c);
		},

		setOption: function(opt, b){
			this.options[opt] = b;
		},

		toggleClass: function(c){
            return this.getElement().toggleClass(c);
		}
	}
}