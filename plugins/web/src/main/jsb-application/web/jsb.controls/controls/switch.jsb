/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.Switch',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:switch.css'],
		
	    $constructor: function(opts){
	        $base(opts);

            this.addClass('jsb-switch');

            this.checkbox = this.$('<input id="switch_' + $this.getId() + '" type="checkbox" />');
            this.append(this.checkbox);

            this.append(`#dot
                <label for="switch_{{=$this.getId()}}"></label>
            `);

            this.caption = this.$('<span class="caption"></span>');
            if(this.options.leftLabel){
                this.prepend(this.caption);
            } else {
                this.append(this.caption);
            }

            if(this.options.label){
                this.setLabel(this.options.label);
            }

            if(this.options.checked){
                this.find('input').prop("checked", true);
            }

            if(this.options.title){
                this.getElement().attr('title', this.options.title);
            }

            if(this.options.onChange && JSB.isFunction(this.options.onChange)){
                this.checkbox.change(function(){
                    $this.options.onChange.call($this, $this.$(this).prop("checked"));
                });
            }

            this.getElement().click(function(evt){
                evt.stopPropagation();
                if($this.options.onclick && JSB.isFunction(this.options.onclick)){
                    $this.options.onclick.call($this, $this.$(this).prop("checked"));
                }
            });

            this.caption.click(function(){
                $this.setChecked(!$this.checkbox.prop("checked"));
            });
	    },

	    options: {
	        checked: false,
	        label: null,
	        leftLabel: false,
	        title: null
	    },

	    setChecked: function(b, noHandle){
	        this.checkbox.prop("checked", b);

	        if(this.options.onChange && !noHandle){
                this.options.onChange.call(this, b);
            }
	    },

		setLabel: function(str){
			this.caption.text(str);
		}
	}
}