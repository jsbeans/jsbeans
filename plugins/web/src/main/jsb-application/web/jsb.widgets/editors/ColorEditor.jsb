{
	$name:'JSB.Widgets.ColorEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: [],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('colorEditor');

			this.editBoxElt = this.$('<input type="color"></input>');

			if(this.options.readonly){
				this.editBoxElt.attr('readonly', true);
			}

			this.getElement().append(this.editBoxElt);

            this.editBoxElt.change(function(evt){
                if(self.options.onChange){
                    self.options.onChange.call(self, evt);
                }
            });

			this.editBoxElt.focusout(function(evt){
				if(self.options.onFocusOut){
					self.options.onFocusOut.call(self, evt);
				}
			});

			this.editBoxElt.focus(function(evt){
				if(self.options.onFocus){
					self.options.onFocus.call(self, evt);
				}
			});
		},

		options: {
			onChange: null,
			onFocus: null,
			onFocusOut: null,
		},

		setData: function(val){
			this.editBoxElt.val(val);
		},

		setReadonly: function(b){
			if(b){
				this.editBoxElt.attr('readonly', true);
				this.editBoxElt.addClass('readonly');
			} else {
				this.editBoxElt.attr('readonly', false);
				this.editBoxElt.removeClass('readonly');
			}
			this.options.readonly = b;
		},

		isReadonly: function(){
			return this.options.readonly;
		},

		clear: function(){
			this.editBoxElt.val('#FFF');
		},

		getData: function(){
			return this.editBoxElt.val();
		}
	}
}