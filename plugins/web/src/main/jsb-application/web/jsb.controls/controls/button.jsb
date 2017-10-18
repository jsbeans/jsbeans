{
	$name: 'JSB.Controls.Button',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        if(!opts.element) opts.element = '<button></button>';
	        $base(opts);

	        this.loadCss('button.css');
            this.addClass('jsb-button');

            // options caption
            if(this.options.hasCaption){
                this.caption = this.$('<div class="caption"></div>');
                this.append(this.caption);

                this.setCaption(this.options.caption);
            }

            // options icon
            if(this.options.hasIcon){
                this.icon = this.$('<div class="icon"></div>').addClass(this.options.iconPosition);

                if(this.options.iconPosition === 'left' || this.options.iconPosition === 'top'){
                    this.prepend(this.icon);
                }

                if(this.options.iconPosition === 'right' || this.options.iconPosition === 'bottom'){
                    this.append(this.icon);
                }
            }

            // options tooltip
            if(!this.options.tooltip && JSB().isString(this.options.caption)){
                this.options.tooltip = this.options.caption;
            }
            if(this.options.tooltip){
                this.getElement().attr('title', this.options.tooltip);
            }

            // options events
            for(var i in this.options){
                if(i.substr(0, 2) === 'on'){
                    this.on(i.substr(2), this.options[i]);
                }
            }
	    },

        options: {
            hasIcon: false,
            iconPosition: 'left',

            hasCaption: true,
            caption: '',

            tooltip: null
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