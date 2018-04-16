/*
 * jQuery visible event - v1.1 - 2018
 * 
 * Copyright (c) 2018 SIS
 * Dual licensed under the MIT and GPL licenses.
 */
(function($,h,c){
	var elemets = $([]); 
	var e = $.visible = $.extend($.visible, {});
	var timeoutHandle;
	e.delay = 50;
	e.minDelay = 10;
	e.maxDelay = 800;
	e.throttleWindow = true;
	$.event.special.visible = {
		setup:function(){
			if(!e.throttleWindow && this.setTimeout){ return false; }
			var elt = $(this);
			elemets = elemets.add(elt);
			$.data(this, "visible-special-event", {visible:elt.is(':visible')});
			if(elemets.length === 1){
				checkVisibility();
			}
		},
		
		teardown:function(){
			if(!e.throttleWindow && this.setTimeout){ return false; }
			var elt = $(this);
			elemets = elemets.not(elt);
			elt.removeData("visible-special-event");
			if(!elemets.length){
				clearTimeout(timeoutHandle);
			}
		},
		
		add:function(l){
			if(!e.throttleWindow && this.setTimeout){return false;}
			var n;
			function m(){
				var elt = $(this),
					r=$.data(this,"visible-special-event");
				r.visible = elt.is(':visible');
				n.apply(this, arguments);
			}
			if($.isFunction(l)){
				n=l;
				return m;
			} else {
				n=l.handler;
				l.handler=m;
			}
		}
	};
	if(!$.fn.visible){
		$.fn.visible = function(callback){
			this.on('visible', callback);
		}
	}
	
	function checkVisibility(){
		timeoutHandle = setTimeout(function(){
			var trigCount = 0;
			elemets.each(function(){
				var elt = $(this);
				
				var d = $.data(this,"visible-special-event");
				var vis = elt.is(':visible');
				
				if(!d){
					d = {visible: vis};
					$.data(this, "visible-special-event", d);
				}
				if(vis !== d.visible){
					trigCount++;
					d.visible = vis;
					elt.trigger('visible',[d.visible]);
				}
			});
			if(trigCount){
				e.delay *= 0.25;
				if(e.delay < e.minDelay){
					e.delay = e.minDelay;
				}
			} else {
				e.delay *= 2;
				if(e.delay > e.maxDelay){
					e.delay = e.maxDelay;
				}
			}
			checkVisibility();
		},e.delay);
	}
})(jQuery,this);