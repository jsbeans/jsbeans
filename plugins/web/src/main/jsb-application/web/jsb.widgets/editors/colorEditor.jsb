{
	$name:'JSB.Widgets.ColorEditor',
	$parent: 'JSB.Widgets.Editor',
	$require: [],
	$client: {
	    _color: "#000",

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('colorEditor');

			switch(this.options.mode){
			    case 'spectrum':
			        JSB().loadCss('tpl/spectrum/spectrum.css');
			        JSB().loadScript('tpl/spectrum/spectrum.js', function(){
                        $this._initSpectrum();
                    });
			        break;
                case 'hexagon':
                    $this._initHexagon();
                    break;
			}
		},

		options: {
		    mode: 'spectrum', // spectrum or hexagon
		    readonly: false,
			onChange: null
		},

		setData: function(val){
			this._color = val;

            switch(this.options.mode){
                case 'spectrum':
                    if(this.editBoxElt)
                        this.editBoxElt.spectrum('set', val);
                    break;
                case 'hexagon':

                    break;
            }
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

		_initHexagon: function(){

		},

		_initSpectrum: function(){
		    this.editBoxElt = this.$('<input type="text"></input>');
		    this.append(this.editBoxElt);

		    this.editBoxElt.spectrum({
		        color: this._color,
		        showInput: true,
		        showPalette: true,
		        showPaletteOnly: true,
		        showInitial: true,
		        togglePaletteMoreText: 'больше',
                togglePaletteLessText: 'меньше',
                chooseText: "Принять",
                cancelText: "Отмена",
                showButtons: true,
                allowEmpty: true,
                togglePaletteOnly: true,
                hideAfterPaletteSelect:true,
		        disabled: this.options.readonly,
		        palette: [["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
		        change: function(color){ if(color) $this._onChange(color.toHexString()); }
		    });
		},

		isReadonly: function(){
			return this.options.readonly;
		},

		clear: function(){
			// this.editBoxElt.val('#FFF');
		},

		getData: function(){
			return this._color;
		},

		// events
		_onChange: function(color){
		    this._color = color;

		    if(this.options.onChange){
                this.options.onChange.call(this, color);
            }
		}
	}
}