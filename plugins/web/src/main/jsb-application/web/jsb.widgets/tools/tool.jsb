{
	$name:'JSB.Widgets.Tool',
	$parent: 'JSB.Widgets.Widget',
	$client: {
		close: function(bCanceled){
			if(this.wrapper){
				this.wrapper.close(bCanceled);
			}
		},

		getData: function(key){
		    if(key){
		        return this.data.data[key];
		    } else {
		        return this.data.data;
		    }
		},

		getWrapper: function(){
			return this.wrapper;
		},

		onHide: function(bCanceled){},

		setData: function(data){
			this.data = data;
			this.update();
		},

		setWrapper: function(wrapper){
			this.wrapper = wrapper;
		},
		
		update: function(){
			// do update when overrides
		}
	}
}