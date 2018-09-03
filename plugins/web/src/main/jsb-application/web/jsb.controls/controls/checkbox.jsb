{
	$name: 'JSB.Controls.Checkbox',
	$parent: 'JSB.Controls.Control',

	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('jsb-checkbox');
			this.loadCss('checkbox.css');

			this.getElement().append(`#dot
			    <div class="check-elem">
			        <input type="checkbox" class="flat" style="position: absolute; opacity: 0;">
			        <ins class="check-helper"></ins>
                </div>
                <span class="caption"></span>
                <div class="contents">
                    <div class="shadowPanel"></div>
                </div>
			`);

			if(this.options.label){
				this.setLabel(this.options.label);
			}

            this.find('> .check-elem > ins').click(function(evt){
                $this.setChecked(!$this.find('> .check-elem').hasClass('checked'));

                if($this.options.onclick){
                    $this.options.onclick.call($this, evt);
                }
            });

            this.find('> .caption').click(function(evt){
                $this.setChecked(!$this.find('> .check-elem').hasClass('checked'));

                if($this.options.onclick){
                    $this.options.onclick.call($this, evt);
                }
            });

			this.setChecked(this.options.checked, true);
		},

		options: {
			label: null,
			checked: false,

			onclick: null,
			onchange: null
		},

		setLabel: function(str){
			this.getElement().find('.caption').text(str);
		},

		isChecked: function(){
			return this.find('> .check-elem > input').prop('checked');
		},

		isEnabled: function(){
			return this.options.enabled;
		},

		setChecked: function(b, hideEvent){
			this.find('> .check-elem > input').prop('checked', b);

			if(b){
			    this.find('> .check-elem').addClass('checked');
			} else {
			    this.find('> .check-elem').removeClass('checked');
			}

			this.enableContents(b);

			if(this.options.onchange && !hideEvent){
				this.options.onchange.call(this, b);
			}
		},

		setLoading: function(b){
		    if(!this.loader && b){
		        this.loader = this.$('<div class="loader hidden"></div>');
		        this.getElement().append(this.loader);
		    }

		    if(b){
		        this.addClass('loading');
		    } else {
		        this.removeClass('loading');
		    }
		},

		toggleChecked: function(hideEvent){
		    var input = this.find('> .check-elem > input'),
		        checked = input.prop('checked');

            input.prop('checked', !checked);

			if(!checked){
			    this.find('> .check-elem').addClass('checked');
			} else {
			    this.find('> .check-elem').removeClass('checked');
			}

			this.enableContents(!checked);

			if(this.options.onchange && !hideEvent){
				this.options.onchange.call(this, !checked);
			}
		},

		enableContents: function(b){
			var cElt = this.find('> .contents');
			if(b){
				cElt.removeClass('disabled');
			} else {
				cElt.addClass('disabled');
			}
		},

		append: function(c){
			return this.find('> .contents').append(this.resolveElement(c));
		}
	}
}