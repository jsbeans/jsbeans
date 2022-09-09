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
	$name:'JSB.Widgets.ColorEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: ['script:../../tpl/spectrum/spectrum.js',
	           'css:../../tpl/spectrum/spectrum.css',
	           'css:colorEditor.css'],
	$client: {
	    _color: null,

		$constructor: function(opts) {
			$base(opts);

			this.addClass('colorEditor');

			if(this.options.value) {
			    this._color = this.options.value;
			}

		    this.editBoxElt = this.$('<input type="text"></input>');
		    this.append(this.editBoxElt);

		    this.editBoxElt.spectrum({
		        color: this._color,
		        showInput: true,
		        showInitial: true,
		        showPalette: true,
		        showPaletteOnly: false,
		        togglePaletteMoreText: 'больше',
                togglePaletteLessText: 'меньше',
                chooseText: "Принять",
                cancelText: "Отмена",
                clearText: "Удалить цвет",
                noColorSelectedText: "Цвет не выбран",
                showButtons: true,
                allowEmpty: true,
                showAlpha: true,
                //togglePaletteOnly: true,
                hideAfterPaletteSelect:true,
		        disabled: this.options.readonly,
		        palette: [["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
		        change: function(color) {
		            if(color){
		                color = color.toHexString();
		            }

                    $this._color = color;

                    if($this.options.onChange){
                        $this.options.onChange.call($this, color);
                    }
		        }
		    });
		},

		options: {
		    readonly: false,
			onChange: null
		},

		setData: function(val) {
			this._color = val;

			this.editBoxElt.spectrum('set', val);
		},

		setReadonly: function(b) {
			if(b){
				this.editBoxElt.attr('readonly', true);
				this.editBoxElt.addClass('readonly');
			} else {
				this.editBoxElt.attr('readonly', false);
				this.editBoxElt.removeClass('readonly');
			}
			this.options.readonly = b;
		},

		isReadonly: function() {
			return this.options.readonly;
		},

		getData: function() {
			return this._color;
		}
	}
}