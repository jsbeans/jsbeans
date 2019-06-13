/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.DomController',
	$require: ['JQuery'],
	$client: {
		$singleton: true,
		$constructor: function(opts){
			var self = this;
			$base(opts);
			var testDwpId = '_testDwpDetection' + JSB().generateUid();
			var insertListener = function(evt){
				if (evt.animationName == "nodeInserted") {
					var elt = self.$(evt.target);
					if(elt.attr('_id') || elt.attr('_inject') || !elt.attr('jsb')){
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

			this.$('head').append(`#dot
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

				*[jsb] {
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
			`);
			
			// update jQuery fn scope with access function
			this.$.fn.jsb = function(){
				var id = this.attr('_id');
				if(!id){
					return null;
				}
				return JSB.getInstance(id);
			}
			
			// inject controls on startup
			var ctrls = this.$('*[jsb]');
			for(var i = 0; i < ctrls.length; i++ ){
				var elt = self.$(ctrls.get(i));
				if(elt.attr('_id') || elt.attr('_inject')){
					continue;	// already existed
				}

				self.injectControl(elt);
			}
		},
		
		injectControl: function(elt, readyCallback){
			var self = this;
			if(elt.attr('_inject')){
				if(readyCallback) {
					if(elt.jsb()){
						readyCallback(elt.jsb());
					} else {
						JSB().deferUntil(function(){
							readyCallback(elt.jsb());
						}, function(){
							return elt.jsb();
						});
					}
				}
				return;
			}
			elt.attr('_inject', true);
			var jsoName = elt.attr('jsb');
			if(!jsoName || jsoName.length === 0){
				throw 'JSB injection failed due to missing "jsb" attribute: ' + this.$('<div></div>').append(elt.clone()).html();
			}
			JSB.lookup(jsoName, function(cls){
				if(!cls){
					throw 'Unable to find Bean: ' + jsoName;
				}
				
				// collect option names map
				var optMap = {};
				var curCtor = cls;
				while(curCtor){
					var opts = curCtor.prototype.options;
					if(opts){
						for(var n in opts){
							optMap[n.toLowerCase()] = n;
						}
					}
					if(!curCtor.$superclass){
						break;
					}
					curCtor = curCtor.$superclass.$constructor;
				}

				// collect opts from attrs
				var opts = {};
				var attrs = elt.get(0).attributes;
				var initProc = null;
				for(var i = 0; i < attrs.length; i++){
					var attr = attrs[i];
					if(attr.name == 'jsb' || attr.name == 'id' || attr.name == '_inject'){
						continue;
					}
					if(attr.name == 'options'){
						var opObj = self.performAttrVal(attr.value);
						if(JSB.isFunction(opObj)){
							opObj = opObj.call(this);
						}
						JSB.merge(opts, opObj);
					} else if(attr.name == 'init'){
						initProc = self.performAttrVal(attr.value);
					} else {
						var attrName = attr.name;
						if(optMap[attrName]){
							attrName = optMap[attrName];
						}
						opts[attrName] = self.performAttrVal(attr.value);
/*						
						if(JSB().isFunction(opts[attrName])){
							var onName = 'on' + attr.name[0].toUpperCase() + attr.name.substr(1);
							opts[onName] = opts[attr.name];
						}
*/						
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
						if(c.attr('jsb')){
							if(c.jsb()){
								// append control
								ctrlObj.append(c.jsb());
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
}