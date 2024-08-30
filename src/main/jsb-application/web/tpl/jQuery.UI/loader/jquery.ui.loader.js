(function($){
	$.widget('ui.blocker', {
		_init: function(){
    		if(this.blocker == null || this.blocker == undefined){
        		this.blocker = $('<div class="jsb_blocker"></div>');
        		this.blocker.css({
        			display: 'none'
        		});
        		this.element.append(this.blocker);
    		}
    		this.show();
    	},
    	_create: function(){},
    	_destroy: function(){},
    	
    	show: function(){
    		this.blocker.css({
    			display: ''
    		});
    	},
    	
    	hide: function(){
    		this.blocker.css({
    			display: 'none'
    		});
    	}
	});
	
    $.widget("ui.loader", {
    	
    	options:{
    		style: 'gear',
    		onShow: null,
    		onHide: null,
    		message: '',
    		fadeInTime: 300,
    		fadeOutTime: 200
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
        		this.element.append(this.loader);
    		}
    		this.loader.attr('key', this.options.style);
    		this.message(this.options.message);
    		this.icon(this.options.icon);
    		this.show();
    	},
    	_create: function(){},
    	_destroy: function(){},
    	
    	message: function(data){
    		var c = this.loader.find('.content');
    		c.empty();
    		if(data){
    			c.append(data);
    		}
    	},
    	
    	icon: function(data){
    		var c = this.loader.find('.icon');
    		if(data){
    			c.css('background-image', 'url('+data+')');
    		} else {
    			c.css('background-image', '');
    		}
    	},
    	
    	show: function(){
    		var self = this;
    		this.loader.fadeIn(this.options.fadeInTime, function(){
    			if(self.options.onShow){
    				self.options.onShow.call(self);
    			}
    		});
    	},
    	
    	hide: function(){
    		var self = this;
    		this.loader.fadeOut(this.options.fadeOutTime, function(){
/*    			var c = self.loader.find('.content');
        		c.empty();*/
        		if(self.options.onHide){
    				self.options.onHide.call(self);
    			}
    		});
    	}
    });
}(jQuery));