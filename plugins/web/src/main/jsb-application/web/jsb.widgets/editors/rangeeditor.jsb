{
	name:'JSB.Widgets.RangeEditor',
	parent: 'JSB.Widgets.Editor',
	
	require: {
		'JSB.Widgets.RangeValue': 'Value'
	},
	bootstrap: function(){
		this.lookupSingleton('JSB.Widgets.EditorRegistry', function(obj){
			obj.register(['range'], this);
		})
	},
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('rangeEditor.css');
			this.addClass('_dwp_rangeEditor');
			this.slider = this.$('<div class="_dwp_slider"></div>');
			this.append(this.slider);
			this.slider.slider({
				range: true,
				min: opts.min,
			    max: opts.max,
			    step: 1,
			    values: [ opts.min, opts.max ],
			    slide: function(event, ui){
			    	self.updateValues();
			    }
			});
			this.slider.find('a').append('<div class="_dwp_sliderSubtitle"></div>');
			this.updateValues();
		},
		
		updateValues: function(){
			var values = this.slider.slider('values');
	    	this.slider.find('a:nth-child(2) ._dwp_sliderSubtitle').text(values[0]);
	    	this.slider.find('a:nth-child(3) ._dwp_sliderSubtitle').text(values[1]);
	    	if(this.data){
	    		this.data.destroy();
	    	}
	    	this.data = new Value(values);
		},
		
		setData: function(val){
			var self = this;
			if(JSO().isInstanceOf(val, 'JSB.Widgets.RangeValue')){
				this.data = val;
			} else {
				this.data = new Value(val);
			}
			if(this.slider){
				this.slider.slider('values', this.data.getValue());
				this.updateValues();
			}
		},
		
		getData: function(){
			return this.data;
		}

	}
}