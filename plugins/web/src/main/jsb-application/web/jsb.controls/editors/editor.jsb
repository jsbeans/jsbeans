{
	$name: 'JSB.Controls.Editor',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        $base(opts);

            this.loadCss('editor.css');
            this.addClass('jsb-editor');

            if(this.options.type !== 'text' || this.options.type !== 'password' || this.options.type !== 'color' || this.options.type !== 'search'){
                this.options.type = 'text';
            }

            this.editor = this.$('<input type="' + this.options.type + '"/>');
            this.append(this.editor);

            if(this.options.readonly){
                this.editor.attr('readonly', true);
            }

            if(this.options.placeholder){
                this.editor.attr('placeholder', this.options.placeholder);
            }

            if(this.options.dataList){
                this.setDataList(this.options.dataList);
            }

            // options events
            for(var i in this.options){
                if(i.substr(0, 2) === 'on'){
                    this.on(i.substr(2), this.options[i]);
                }
            }
	    },

	    options: {
	        readonly: false,
	        type: 'text',    // password, color, search
	        placeholder: null,

	        dataList: null
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

		on: function(eventName, func){
		    if(!JSB().isFunction(func)) return;

		    this.options[eventName] = func;
		    this.editor.getElement().on(eventName, function(evt){
		        if(!$this.options.enabled) return;
		        $this.options[eventName].call($this, evt);
		    });
		},

	    removeDataList: function(){
	        this.editor.attr('list', '');
	        this.dataList.remove();
	        this._dataList = [];
	    },

	    setDataList: function(dataList){
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

	    setPlaceholder: function(placeholder){
	        this.options.placeholder = placeholder;
	        this.editor.attr('placeholder', placeholder);
	    },

	    setReadonly: function(bool){
	        this.options.readonly = bool;
	        this.editor.attr('readonly', bool);
	    },

	    setValue: function(value){
	        this.editor.val(value);
	    }
	}
}