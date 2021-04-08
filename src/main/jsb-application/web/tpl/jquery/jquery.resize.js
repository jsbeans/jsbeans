/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,h,c){
	var elemets = $([]), filtered = null;
	var e = $.resize = $.extend($.resize,{});
	var timeoutHandle;
	e.delay = 100;
	e.minDelay = 50;
	e.maxDelay = 100;
	e.throttleWindow = true;
	if(window.ResizeObserver){
		e.ro = new ResizeObserver(function(entries, observer) {
		    for(var i = 0; i < entries.length; i++){
		    	var entry = entries[i];
		    	var elt = $(entry.target);
		    	if(elt.is(':visible')){
			    	var o = $.data(entry.target,"resize-special-event");
			    	if(o.w !== entry.contentRect.width || o.h !== entry.contentRect.height){
			    		elt.trigger('resize',[o.w=entry.contentRect.width,o.h=entry.contentRect.height]);	
			    	}
		    	}
		    }
		});
	}
	$.event.special.resize={
		setup:function(){
			if(!e.throttleWindow && this.setTimeout){
				return false
			}
			var elt = $(this);
			elemets = elemets.add(elt);
			var o = {w:elt.width(),h:elt.height()};
			$.data(this, "resize-special-event", o);
			
			if(e.ro){
				try {
					e.ro.observe(this);	
				} catch(e){
					//debugger;
				}
			} else {
				filtered = elemets.filter(':visible');
				if(elemets.length === 1){
					checkResize();
				}
			}
			
		},
		
		teardown:function(){
			if(!e.throttleWindow && this.setTimeout){return false}
			var elt = $(this);
			elemets = elemets.not(elt);
			elt.removeData("resize-special-event");
			if(!elemets.length){
				clearTimeout(timeoutHandle);
			}
		},
		
		add:function(l){
			if(!e.throttleWindow && this.setTimeout){return false}
			var n;
			function m(s,o,p){
				var q=$(this),r=$.data(this,"resize-special-event");
				r.w=o!==c?o:q.width();
				r.h=p!==c?p:q.height();
				n.apply(this,arguments);
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
	
	function checkResize(){
		timeoutHandle = setTimeout(function(){
			var visCount = 0;
			var trigCount = 0;
			if(!filtered){
				filtered = elemets.filter(':visible');
			}
			filtered.each(function(){
				var elt = $(this);
				visCount++;
				var o = $.data(this,"resize-special-event");
				if(!o){
					o = {w:0,h:0};
					$.data(this, "resize-special-event", o);
				}
				var w = elt.width(), h = elt.height();
				if(w!==o.w||h!==o.h){
					trigCount++;
					elt.trigger('resize',[o.w=w,o.h=h]);
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
					filtered = elemets.filter(':visible');
					e.delay = e.maxDelay;
				}
			}
			checkResize();
		},e.delay);
	}
	
})(jQuery,this);