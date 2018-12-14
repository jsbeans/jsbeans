{
	$name: 'JSB.Controls.Checkbox',
	$parent: 'JSB.Controls.Control',

	$client: {
		$require: ['css:checkbox.css'],

		_contentBox: null,
		_label: null,

		$constructor: function(opts){
			$base(opts);
			this.addClass('jsb-checkbox');

			this.getElement().append(`#dot
			    <div class="check-elem">
			        <input type="checkbox" class="flat" style="position: absolute; opacity: 0;">
			        <ins class="check-helper"></ins>
                </div>
			`);

			if(this.options.label){
				this.setLabel(this.options.label);
			}

			if(this.options.content){
			    this.setContent(this.options.content);
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
			content: null,

			onClick: null, // onclick
			onChange: null // onchange
		},

		// public methods
		appendContent: function(c){
		    this._ensureContentBox();

			return this._contentBox.append(this.resolveElement(c));
		},

		enableContent: function(b){
            var cElt = this.find('> .content');
            if(b){
                cElt.removeClass('disabled');
            } else {
                cElt.addClass('disabled');
            }
        },

		isChecked: function(){
			return this.find('> .check-elem > input').prop('checked');
		},

		setChecked: function(b, hideEvent){
			this.find('> .check-elem > input').prop('checked', b);

			if(b){
			    this.find('> .check-elem').addClass('checked');
			} else {
			    this.find('> .check-elem').removeClass('checked');
			}

			this.enableContent(b);

			if(this.options.onchange && !hideEvent){
				this.options.onchange.call(this, b);
			}
		},

		setContent: function(content){
		    this._ensureContentBox();

		    this._contentBox.empty();
		    this._contentBox.append(content);
		},

		setLabel: function(str){
		    if(!this._label){
		        this._label = this.$('<div class="caption"></div>');
		        this.getElement().find('.check-elem').after(this._label);
		    }

			this._label.text(str);
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

			this.enableContent(!checked);

			if(this.options.onchange && !hideEvent){
				this.options.onchange.call(this, !checked);
			}
		},

		// private methods
		_ensureContentBox: function(){
		    if(!this._contentBox){
		        this._contentBox = this.append('<div class="content"></div>');
		    }
		}
	}
}