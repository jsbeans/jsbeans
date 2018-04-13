{
	$name: 'JSB.Controls.Editor',
	$parent: 'JSB.Controls.Control',
	$client: {
	    _types: [],
	    _value: null,

	    $constructor: function(opts){
	        if(!opts.element) {
	            opts.element = '<input />';
	        }
	        $base(opts);

            this.loadCss('editor.css');
            this.addClass('jsb-editor');

            this.editor = this.getElement();

            if(this.options.type !== 'text' || this.options.type !== 'password' || this.options.type !== 'color' || this.options.type !== 'search'){
                this.options.type = 'text';
            }

            this.editor.attr('type', this.options.type);

            if(this.options.readonly){
                this.editor.attr('readonly', true);
            }

            if(this.options.placeholder){
                this.editor.attr('placeholder', this.options.placeholder);
            }

            if(this.options.dataList){
                this.setDataList(this.options.dataList);
            }

            if(this.options.value){
                this.setValue(this.options.value);
            }

            this.editor.keyup(function(evt){
                var val = $this.$(this).val();

                if(val !==  $this._value && JSB.isFunction($this.options.onchange)){
                    JSB.defer(function(){
                        $this.options.onchange.call($this, val);
                    }, 500, '_editor.changeValue' + $this.getId());
                }

                if(evt.keyCode === 13){
                    if(JSB.isFunction($this.options.oneditcomplete)){
                        $this.options.oneditcomplete.call($this, val);
                    }

                    if(JSB.isFunction($this.options.onenterpressed)){
                        $this.options.onenterpressed.call($this, val);
                    }
                }

                $this._value = val;
            });

            this.editor.focusout(function(){
                if(JSB.isFunction($this.options.oneditcomplete)){
                    $this.options.oneditcomplete.call($this, $this.$(this).val());
                }

                if(JSB.isFunction($this.options.onfocusout)){
                    $this.options.onfocusout.call($this, $this.$(this).val());
                }
            });
	    },

	    options: {
	        readonly: false,
	        type: 'text',    // password, color, search
	        placeholder: null,
	        value: null,

	        dataList: null,

	        // events
	        onchange: null,
	        oneditcomplete: null,
	        onenterpressed: null,
	        onfocusout: null
	    },

	    _dataList: [],

	    clear: function(bRemoveDataList){
	        this.editor.val('');
	        bRemoveDataList && this.removeDataList();
	    },

	    enable: function(bool){
            this.options.enable = bool;
            this.editor.attr('disabled', !bool);
	    },

	    isValFromDatalist: function(){
	        return this._dataList.indexOf(this.editor.val()) > -1;
	    },

	    getValue: function(){
	        return this.editor.val();
	    },

	    removeDataList: function(){
	        this.editor.attr('list', '');
	        this.dataList.remove();
	        this._dataList = [];
	    },

	    setDataList: function(dataList){
	        if(this.options.type !== 'text'){
	            return;
	        }

	        if(this.dataList){
	            this.dataList.empty();
	        } else {
	            var id = 'datalist_' + JSB.generateUid();
	            this.dataList = this.$('<datalist id="' + id + '"></datalist>');
	            this.append(this.dataList);
	            this.editor.attr('list', id);
	        }

	        if(!JSB.isArray(dataList)){
	            dataList = [dataList];
	        }

	        for(var i = 0; i < dataList.length; i++){
	            this.dataList.append('<option value="' + dataList[i] + '">');
	        }

	        this._dataList = dataList;
	    },

	    setGroupDataList: function(dataList){
	        if(this.options.type !== 'text'){
	            return;
	        }
	        // todo
	    },

	    setPlaceholder: function(placeholder){
	        this.options.placeholder = placeholder;
	        this.editor.attr('placeholder', placeholder);
	    },

	    setReadonly: function(bool){
	        this.options.readonly = bool;
	        this.editor.attr('readonly', bool);
	    },

	    setValue: function(value){
	        if(JSB.isDefined(value)){
	            this.editor.val(value);
	            this._value = value;
	        }
	    }
	}
}