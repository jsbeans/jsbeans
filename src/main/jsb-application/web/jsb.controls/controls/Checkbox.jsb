/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.Checkbox',
	$parent: 'JSB.Controls.Control',

	$client: {
		$require: ['css:Checkbox.css',
					'css:../../fonts/fa/css/all.min.css'],

		_contentBox: null,
		_label: null,

		$constructor: function(opts){
			$base(opts);
			this.addClass('jsb-checkbox');

			this.getElement().append(`#dot
				<div class="caption">
				    <div class="check-elem">
				    	<i class="far fa-square"></i>
				    	<i class="fas fa-check-square"></i>
				        <input type="checkbox" class="flat" style="position: absolute; opacity: 0;">
	                </div>
                </div>
			`);

			if(this.options.label){
				this.setLabel(this.options.label);
			}

			if(this.options.content){
			    this.setContent(this.options.content);
			}

            this.find('> .caption > .check-elem').click(function(evt){
                $this.setChecked(!$this.find('> .caption > .check-elem').hasClass('checked'));

                if($this.options.onclick){
                    $this.options.onclick.call($this, evt);
                }
            });

			this.setChecked(this.options.checked, true);
		},

		options: {
			label: null,
			labelPosition: 'right',
			checked: false,
			content: null,

			onClick: null, // onclick
			onChange: null // onchange
		},

		// public methods
		append: function(c){
		    this._ensureContentBox();

			return this._contentBox.append(c);
		},

		enableContent: function(b){
            var cElt = this.find('> .content');
            if(b){
                cElt.removeClass('disabled');
            } else {
                cElt.addClass('disabled');
            }
        },

        getLabel: function(){
            if(this._label){
                return this._label.text();
            }
        },

		isChecked: function(){
			return this.find('> .caption > .check-elem > input').prop('checked');
		},

		setChecked: function(b, hideEvent){
			this.find('> .caption > .check-elem > input').prop('checked', b);

			if(b){
			    this.find('> .caption > .check-elem').addClass('checked');
			} else {
			    this.find('> .caption > .check-elem').removeClass('checked');
			}

			this.enableContent(b);

			if(this.options.onChange && !hideEvent){
				this.options.onChange.call(this, b);
			}
		},

		setContent: function(content){
		    this._ensureContentBox();

		    this._contentBox.empty();
		    this._contentBox.append(content);
		},

		setLabel: function(str){
		    if(!this._label){
		        this._label = this.$('<div class="label"></div>');

		        if(this.options.labelPosition === 'right'){
		            this.getElement().find('> .caption > .check-elem').after(this._label);
		        }

		        if(this.options.labelPosition === 'left'){
		            this.getElement().find('> .caption > .check-elem').before(this._label);
		        }

                this._label.click(function(evt){
                    $this.setChecked(!$this.find('> .caption > .check-elem').hasClass('checked'));

                    if($this.options.onclick){
                        $this.options.onclick.call($this, evt);
                    }
                });
		    }

		    this._label.empty();
		    this._label.append(str);
//			this._label.text(str);
			this._label.attr('title', str);
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
		    var input = this.find('> .caption > .check-elem > input'),
		        checked = input.prop('checked');

            input.prop('checked', !checked);

			if(!checked){
			    this.find('> .caption > .check-elem').addClass('checked');
			} else {
			    this.find('> .caption > .check-elem').removeClass('checked');
			}

			this.enableContent(!checked);

			if(this.options.onChange && !hideEvent){
				this.options.onChange.call(this, !checked);
			}
		},

		// private methods
		_ensureContentBox: function(){
		    if(!this._contentBox){
		        this._contentBox = this.$('<div class="content"></div>');
		        this.getElement().append(this._contentBox);
		    }
		}
	}
}