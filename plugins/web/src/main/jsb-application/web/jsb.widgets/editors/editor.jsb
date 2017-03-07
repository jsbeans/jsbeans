{
	name:'JSB.Widgets.Editor',
	parent: 'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.EditorRegistry': 'EditorRegistry'
	},
	client: {
		constructor: function(opts){
			$base(opts);
			this.addClass('_dwp_editor');
		},
		
		setData: function(){
			throw 'Abstract method should be overriden';
		},
		getData: function(){
			throw 'Abstract method should be overriden';
			return null;
		},
		
		setFocus: function(){},
		
		isValid: function(){
			if(!JSO().isNull(this.options.onValidate)){
				return this.options.onValidate(this.getData().getValue());
			}
			return true;
		},
		
		clear: function(){}
	},
	
	server: {
		constructor: function(){}
	}
}