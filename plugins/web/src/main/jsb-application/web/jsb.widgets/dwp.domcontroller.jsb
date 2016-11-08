JSB({
	name:'DWP.DomController',
	group: 'dwp',
	require: ['JQuery'],
	client: {
		singleton: true,
		constructor: function(opts){
			var self = this;
			this.base(opts);
			var testDwpId = '_testDwpDetection' + JSO().generateUid();
			if(!document.registerElement){
				try {
					(function(){
						#include '../tpl/webcomponents/webcomponents-lite.min.js';
					}).call(null);
				} catch(e){
					// polymer is not supported by current browser - skip it
				}
			}
			if(document.registerElement){
				document.registerElement('dwp-control', {
					prototype: Object.create(HTMLDivElement.prototype)
				});
			}
			var insertListener = function(evt){
				if (evt.animationName == "nodeInserted" && evt.target.nodeName == 'DWP-CONTROL') {
					var elt = self.$(evt.target);
					if(elt.attr('_id') || elt.attr('_inject')){
						return;	// already existed
					}
					if(elt.is('#' + testDwpId)){
						self.animationDetectSupported = true;
						elt.remove();
						return;
					}
					self.injectControl(elt);
				}
			}
			
			document.addEventListener("animationstart", insertListener, false); // standard + firefox
			document.addEventListener("MSAnimationStart", insertListener, false); // IE
			document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari

			this.$('head').append(#dot{{
				<style>
				@keyframes nodeInserted {  
					from { opacity: 0.99; }
					to { opacity: 1; }  
				}

				@-moz-keyframes nodeInserted {  
					from { opacity: 0.99; }
					to { opacity: 1; }
				}

				@-webkit-keyframes nodeInserted {  
					from { opacity: 0.99; }
					to { opacity: 1; }
				}

				@-ms-keyframes nodeInserted {  
					from { opacity: 0.99; }
					to { opacity: 1; }
				}

				@-o-keyframes nodeInserted {  
					from { opacity: 0.99; }
					to { opacity: 1; }
				} 

				dwp-control {
				    animation-duration: 0.001s;
				    -o-animation-duration: 0.001s;
				    -ms-animation-duration: 0.001s;
				    -moz-animation-duration: 0.001s;
				    -webkit-animation-duration: 0.001s;
				    animation-name: nodeInserted;
				    -o-animation-name: nodeInserted;
				    -ms-animation-name: nodeInserted;        
				    -moz-animation-name: nodeInserted;
				    -webkit-animation-name: nodeInserted;
				}
				</style>
			}});
			
			// update jQuery fn scope with access function
			this.$.fn.jso = function(){
				var id = this.attr('_id');
				if(!id){
					return null;
				}
				return JSO().getInstance(id);
			}
			
			// inject controls on startup
			var ctrls = this.$('dwp-control');
			for(var i = 0; i < ctrls.length; i++ ){
				var elt = self.$(ctrls.get(i));
				if(elt.attr('_id') || elt.attr('_inject')){
					continue;	// already existed
				}

				self.injectControl(elt);
			}
			
			// check dwp-control method insert detection is available on current browser
			this.$('body').append('<dwp-control id="'+testDwpId+'"></dwp-control>');
			JSO().defer(function(){
				// check whether automatic dwp detect method is available
				if(self.animationDetectSupported){
					// everything is ok, nothing to do
//					console.log('DWP.DomController: animation detection supported');
					return;
				} else {
					// TODO: enable manual detection method
//					console.log('DWP.DomController: animation detection NOT supported');
				}
			}, 1000);
			
		},
		
		injectControl: function(elt, readyCallback){
			var self = this;
			if(elt.attr('_inject')){
				if(readyCallback) {
					if(elt.jso()){
						readyCallback(elt.jso());
					} else {
						JSO().deferUntil(function(){
							readyCallback(elt.jso());
						}, function(){
							return elt.jso();
						});
					}
				}
				return;
			}
			elt.attr('_inject', true);
			var jsoName = elt.attr('jso');
			JSO().lookup(jsoName, function(cls){
				if(!cls){
					throw 'Unable to find JSO object: ' + jsoName;
				}

				// collect opts from attrs
				var opts = {};
				var attrs = elt.get(0).attributes;
				var initProc = null;
				for(var i = 0; i < attrs.length; i++){
					var attr = attrs[i];
					if(attr.name == 'jso' || attr.name == 'id' || attr.name == '_inject'){
						continue;
					}
					if(attr.name == 'options'){
						var opObj = self.performAttrVal(attr.value);
						if(JSO().isFunction(opObj)){
							opObj = opObj.call(this);
						}
						JSO().merge(opts, opObj);
					} else if(attr.name == 'init'){
						initProc = self.performAttrVal(attr.value);
					} else {
						opts[attr.name] = self.performAttrVal(attr.value);
						if(JSO().isFunction(opts[attr.name])){
							var onName = 'on' + attr.name[0].toUpperCase() + attr.name.substr(1);
							opts[onName] = opts[attr.name];
						}
					}
				}
				opts.element = elt;
				var ctrlObj = null;
				
				// detach content
				var content = this.$(elt.get(0).childNodes);
				if(content.length > 0){
					content.detach();
					var contentToAdd = [];
					content.each(function(){
						contentToAdd.push(self.$(this));
					});
					
					ctrlObj = new cls(opts);
					
					// remove _id attr to prevent complete status until children are ok
					var eltId = elt.attr('_id');
					elt.removeAttr('_id');
					
					if(initProc){
						initProc.call(ctrlObj);
					}
					
					function nextContentItem(){
						if(contentToAdd.length == 0){
							
							// return _id attr back
							elt.attr('_id', eltId);
							
							if(readyCallback) readyCallback(ctrlObj);
							return;
						}
						var c = contentToAdd.shift();
						if(c.get(0).nodeName == 'DWP-CONTROL'){
							if(c.jso()){
								// append control
								ctrlObj.append(c.jso());
								nextContentItem();
							} else {
								// inject & append control
								self.injectControl(c, function(obj){
									ctrlObj.append(obj);
									nextContentItem();
								});
							}
						} else {
							// append other
							ctrlObj.append(c);
							nextContentItem();
						}
					}
					
					nextContentItem();
				} else {
					ctrlObj = new cls(opts);
					if(initProc){
						initProc.call(ctrlObj);
					}
					if(readyCallback) readyCallback(ctrlObj);
				}
			});
		},
		
		performAttrVal: function(val){
			var tVal = val.trim();
			var jVal = null;
			// try to eval
			try {
				jVal = eval('(' + tVal + ')');
			} catch(e){
				jVal = val;
			}
			return jVal;
		}
	}
});