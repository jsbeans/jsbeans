{
	$name: 'HtmlToCanvas',
	$singleton: true,
	
	$client: {
		$require: ['script:htmlToCanvas.js'],
		
		toCanvas: function(c, callback){
			if(JSB().isInstanceOf(c, 'JSB.Widgets.Control') || JSB().isInstanceOf(c, 'JSB.Controls.Control')){
				c = c.getElement();
			} else if(!JSB().isString(c)){
				c = this.$(c);
			}
			
			html2canvas(c.get(0)).then(function(canvas){
	            if(callback){
	            	callback.call($this, canvas);
	            }
	        });
		}
	}
}