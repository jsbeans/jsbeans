{
	$name: 'JSB.Controls.SearchBox',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:SearchBox.css'],
		_value: null,

	    $constructor: function(opts){
	        $base(opts);

            this.addClass('jsb-searchBox');

            this.editor = this.$('<input type="text" placeholder="Поиск...">');
            this.append(this.editor);

            var searchBtn = this.$('<div class="search"></div>');
            this.append(searchBtn);
            searchBtn.click(function(){
                $this.toggleClass('open');

                if($this.hasClass('open')){
                    $this.editor.focus();
                } else {
                    $this.clear();

                    if(JSB.isFunction($this.options.onClose)){
                        $this.options.onClose.call($this);
                    }
                }
            });

            if(this.options.placeholder){
                this.setPlaceholder(this.options.placeholder);
            }

            this.editor.keyup(function(evt){
                var val = $this.$(this).val();

                if(val !==  $this._value && JSB.isFunction($this.options.onChange)){
                    JSB.defer(function(){
                        $this.options.onChange.call($this, val);
                    }, 500, '_editor.changeValue' + $this.getId());
                }

                if(evt.keyCode === 13){
                    if(JSB.isFunction($this.options.onEnterPressed)){
                        $this.options.onEnterPressed.call($this, val);
                    }
                }

                $this._value = val;
            });
	    },

	    options: {
	        placeholder: null,

	        // events
	        onChange: null,
	        onClose: null,
	        onEnterPressed: null
	    },

	    clear: function(){
	        this.editor.val('');
	        this._value = '';
	    },

	    getValue: function(){
	        return this.editor.val();
	    },

	    setPlaceholder: function(placeholder){
	        this.options.placeholder = placeholder;
	        this.editor.attr('placeholder', placeholder);
	    }
	}
}