/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'Unimap.Render.TemplateView',
	$parent: 'Unimap.Render.Basic',

	$alias: 'template',
	
	$client: {
	    $require: ['JSB.Widgets.RendererRepository',
	               'css:TemplateView.css'],
	               
	    construct: function(){
	        this.addClass('templateView');
	        
	        if(this._scheme.cssClass){
	        	this.addClass(this._scheme.cssClass);
	        }
	        
	        if(!this._scheme.template){
	        	throw new Error('Missing "template" parameter');
	        }

	        if(this._scheme.name){
		        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
		        this.append(name);
		        this.createRequireDesc(name);
		        this.createDescription(name);
	        }

	        this.createRequireDesc(name);
	        this.createDescription(name);
	        
	        this._item = this.$('<div class="item"></div>');
	        this.append(this._item);
	        
	        this._item.append(this._scheme.template);
	        
	        JSB.deferUntil(function(){
				if($this._scheme.onInit){
					$this._scheme.onInit.call($this);
				}
			}, function(){
				return $this.isContentReady();
			});
	    }
	    
	}
}