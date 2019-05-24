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
	$name: 'Unimap.Render.Switch',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Switch',
	           'css:Switch.css'],

	$alias: 'switch',

	$client: {
	    construct: function(){
	        this.addClass('switchRender');

	        this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	        this.switchEl = new Switch({
	            checked: this._values.checked,
	            label: this._scheme.name,
	            onChange: function(b){
	                $this._values.checked = b;

	                if(b){
	                    $this.createScheme();
	                } else {
	                    $this.removeScheme();
	                }
	            }
	        });
	        this.append(this.switchEl);

	        this.createDescription(this.switchEl);

	        if(this._values.checked){
	            this.createScheme();
	        }
	    },

	    createScheme: function(){
	        var values = this._values.values[0];

	        if(!values){
	            values = {};

	            this._values.values.push(values);

	            for(var i in this._scheme.items){
	                values[i] = {};
	            }
	        }

	        this.schemeEl = this.$('<div class="schemeEl"></div>');
	        this.append(this.schemeEl);

            for(var i in this._scheme.items){
                if(!this._scheme.items[i].render){
                    continue;
                }

                if(!values[i]){
                    values[i] = {};
                }

                var render = this.createRender(i, this._scheme.items[i], values[i]);
                if(render){
                    this.schemeEl.append(render.getElement());
                }
            }
	    },

	    destroy: function(){
	        this.switchEl.destroy();

	        $base();
	    },

	    removeScheme: function(){
	        this.schemeEl.remove();
	    }
	}
}