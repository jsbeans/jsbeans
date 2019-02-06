{
	$name: 'JSB.Controls.Button',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:button.css'],
	    $constructor: function(opts){
	        if(opts && !opts.element) opts.element = '<button></button>';
	        $base(opts);

            this.addClass('jsb-button');

            // options caption
            if(this.options.caption){
                this.caption = this.$('<div class="caption"></div>');
                this.append(this.caption);

                this.setCaption(this.options.caption);
            }

            // options icon
            if(this.options.icon){
                this.icon = this.$('<div class="icon"></div>').addClass(this.options.iconPosition);

                if(this.options.iconPosition === 'left' || this.options.iconPosition === 'top'){
                    this.prepend(this.icon);
                }

                if(this.options.iconPosition === 'right' || this.options.iconPosition === 'bottom'){
                    this.append(this.icon);
                }
            }

            // only icon
            if(this.options.icon && !this.options.caption){
                this.addClass('onlyIcon');
            }

            // options tooltip
            if(!this.options.tooltip && JSB().isString(this.options.caption)){
                this.options.tooltip = this.options.caption;
            }

            if(this.options.tooltip){
                this.getElement().attr('title', this.options.tooltip);
            }

            if(this.options.onClick){
                this.getElement().click(this.options.onClick);
            }

            // todo: remove in all places
            // options events
            for(var i in this.options){
                if(i.substr(0, 2) === 'on'){
                    this.on(i.substr(2), this.options[i]);
                }
            }

            // options enable
            this.enable(this.options.enabled);
	    },

        options: {
            caption: null,
            enabled: true,
            icon: false,
            iconPosition: 'left',
            tooltip: null,

            onClick: null
        },

		enable: function(b){
            this.options.enabled = b;

            if(b) {
                this.removeClass('disabled');
            } else {
                this.addClass('disabled');
            }
		},

        setCaption: function(caption){
            this.caption.empty();

            if(JSB().isString(caption)){
                this.caption.append(caption);
            } else if(JSB().isInstanceOf(caption, 'JSB.Widgets.Control')){
                caption.append(caption.getElement());
            }
        }
	}
}