(function($){
    $.widget("ui.loader", {
    	
    	options:{
    		style: 'gear32'
    	},
    	
    	_init: function(){
    		if(this.loader == null || this.loader == undefined){
        		this.loader = $('<div class="ajaxloader"></div>')
        			.append($('<div class="ajaxloaderInfo"></div>')
        					.append('<div class="icon"></div>')
                			.append('<div class="content"></div>'));
        		
        		this.loader.css({
        			display: 'none'
        		});
        		this.loader.addClass(this.options.style);
        		this.element.append(this.loader);
    		}
    		this.show();
    	},
    	_create: function(){},
    	_destroy: function(){},
    	
    	content: function(data){
    		var c = this.loader.find('.content');
    		c.empty();
    		c.append(data);
    	},
    	
    	show: function(){
    		this.loader.fadeIn(300);
    	},
    	
    	hide: function(){
    		this.loader.fadeOut(200);
    	}
    });
}(jQuery));