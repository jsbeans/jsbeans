/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Controls.Error',
	$parent: 'JSB.Widgets.Widget',

	$client: {
	    $require: ['css:Error.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('errorMessage hidden');

	        this.append('<header>Ошибка!</header>');

	        this._text = this.$('<div class="errorText"></div>');
	        this.append(this._text);
	    },

	    hide: function(){
	        this.addClass('hidden');
	    },

	    show: function(text){
	        this._text.text(text);

	        this.removeClass('hidden');
	    }
	}
}