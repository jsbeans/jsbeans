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
	$name:'JSB.Widgets.SliderEditor',
	$parent: 'JSB.Widgets.Editor',
	
	$require: {
	    Slider: 'jQuery.UI.Slider'
	},
	$bootstrap: function(){
		this.lookupSingleton('JSB.Widgets.EditorRegistry', function(obj){
			obj.register(['slider'], this);
		})
	},
	$client: {
		$require: ['css:SliderEditor.css'],

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_jsb_sliderEditor');
			this.slider = this.$('<div class="_jsb_slider"></div>');
			this.append(this.slider);
			this.label = $this.$('<div class="_jsb_label"></div>');
			this.append(this.label);
			this.slider.slider({
				min: opts.min || 0,
			    max: opts.max || 100,
			    value: opts.value || 0,
			    step: opts.step || 1,
			    slide: function(event, ui){
			    	self.updateValue(ui.value);
			    	if($this.options.onChange){
                        $this.options.onChange.call($this, ui.value);
                    }
			    }
			});
			this.slider.find('a').append('<div class="_jsb_sliderSubtitle"></div>');
			this.updateValue();
		},
		
		updateValue: function(val){
			var value = null;
			if(JSB.isDefined(val)){
				value = val;
				this.setData(val);
			} else {
				value = this.slider.slider('value');
			}
			var str = value;
			if($this.options.onFormat){
				str = $this.options.onFormat.call($this, value);
			}
			this.label.text(str);
		},
		
		setData: function(val){
			if(this.slider){
				this.slider.slider('value', val);
				this.updateValue();
			}
		},
		
		getData: function(){
			return this.slider.slider('value');
		}
	}
}