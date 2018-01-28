{
	$name:'JSB.DataCube.CheckBox',
	$parent: 'JSB.Widgets.Control',

	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('dataCube_checkBox');
			this.loadCss('CheckBox.css');

			// construct
			this.getElement().append(`#dot
			    <div class="check-elem">
			        <input type="checkbox" class="flat" style="position: absolute; opacity: 0;">
			        <ins class="check-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>
                </div>
                <span class="caption"></span>
			`);

			if(this.options.label){
				this.setLabel(this.options.label);
			}

            this.find('> .check-elem > ins').click(function(evt){
                $this.setChecked(!$this.find('> .check-elem').hasClass('checked'));

                if(self.options.onClick){
                    self.options.onClick.call(self, evt);
                }
            });

			this.enable(this.options.enabled);

			if(this.options.check){
				this.setChecked(this.options.checked, true);
			}
		},

		options: {
			label: null,
			check: true,
			checked: false,
			enabled: true,

			onClick: null,
			onChange: null
		},

		setLabel: function(str){
			this.getElement().find('.caption').text(str);
		},

		isChecked: function(){
			if(!this.options.check){
				return false;
			}
			return this.find('> .check-elem > input').prop('checked');
		},

		isEnabled: function(){
			return this.options.enabled;
		},

		setChecked: function(b, dontNotify){
			if(!this.options.check){
				return;
			}

			this.find('> .check-elem > input').prop('checked', b);

			if(b){
			    this.find('> .check-elem').addClass('checked');
			} else {
			    this.find('> .check-elem').removeClass('checked');
			}

			this.enableContents(b);

			if(this.options.onChange && !dontNotify){
				this.options.onChange.call(this, b);
			}
		},

		enable: function(b){
			this.options.enabled = b;
			if(b) {
				this.removeClass('disabled');
			} else {
				this.addClass('disabled');
			}
			this.enableContents(!b || this.isChecked() || !this.options.check);
		},

		enableContents: function(b){
			var cElt = this.find('> .contents');
			if(cElt.length == 0){
				return;
			}
			if(b){
				cElt.removeClass('disabled');
			} else {
				cElt.addClass('disabled');
			}
		},

		append: function(c){
			debugger;
			// ensure contents
			if(this.find('> .contents').length == 0){
				this.getElement().append('<div class="contents"><div class="shadowPanel"></div></div>');
			}
			return this.find('> .contents').append(this.resolveElement(c));
		}
	}
}