JSB({
	name:'JSB.Widgets.ComplexEditor',
	parent: 'JSB.Widgets.Editor',
	
	client: {
		options: {
			readonly: false,
			
			onChange: null,
		},
		
		constructor: function(opts){
			$base(opts);
			this.loadCss('complexeditor.css');
			this.addClass('_jsb_complexEditor');
		},
		
		setData: function(){
		},
		
		getData: function(){
		},
		
	}
});