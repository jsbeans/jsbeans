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
	var d = "resize-special-event";
	e.delay = 50;
	e.minDelay = 10;
	e.maxDelay = 800;
	e.throttleWindow = true;
	$.event.special.resize={
		setup:function(){
			if(!e.throttleWindow && this.setTimeout){
				return false
			}
			var elt = $(this);
			elemets = elemets.add(elt);
			filtered = elemets.filter(':visible');
			$.data(this, d, {w:elt.width(),h:elt.height()});
			if(elemets.length === 1){
				checkResize();
			}
		},
		
		teardown:function(){
			if(!e.throttleWindow && this.setTimeout){return false}
			var elt = $(this);
			elemets = elemets.not(elt);
			elt.removeData(d);
			if(!elemets.length){
				clearTimeout(timeoutHandle);
			}
		},
		
		add:function(l){
			if(!e.throttleWindow && this.setTimeout){return false}
			var n;
			function m(s,o,p){
				var q=$(this),r=$.data(this,d);
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
				var m = elt.width(),l = elt.height(), o = $.data(this,d);
				if(m!==o.w||l!==o.h){
					trigCount++;
					elt.trigger('resize',[o.w=m,o.h=l]);
				}
			});
			if(trigCount){
				e.delay *= 0.25;
				if(e.delay < e.minDelay){
					e.delay = e.minDelay;
				}
			} else {
				e.delay *= 2;
				filtered = elemets.filter(':visible');
				if(e.delay > e.maxDelay){
					e.delay = e.maxDelay;
				}
			}
			checkResize();
		},e.delay);
	}
})(jQuery,this);