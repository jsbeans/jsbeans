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
	    },

	    options: {
	        readonly: false,
	        type: 'text',    // password, color, search
	        placeholder: null,

	        dataList: null
	    },

	    clear: function(){
	        this.editor.val('');
	        this.editor.attr('list', '');
	        this.dataList.remove();
	    },

	    enable: function(bool){
            this.options.enable = bool;
            this.editor.attr('disabled', !bool);
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