{
	$name:'JSB.Widgets.Tool',
	$parent: 'JSB.Widgets.Widget',
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			if(opts && opts.cssClass){
				this.addClass(opts.cssClass);
			}
		},
		
		setData: function(data){
			this.data = data;
			this.update();
		},
		
		update: function(){
			// do update when overrides
		},
		
		close: function(bCanceled){
			if(this.wrapper){
				this.wrapper.close(bCanceled);
			}
		},
		
		setWrapper: function(wrapper){
			this.wrapper = wrapper;
		},
		
		getWrapper: function(){
			return this.wrapper;
		},
		
		onHide: function(bCanceled){}
	}
}