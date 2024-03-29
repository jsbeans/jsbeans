/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.Button',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$require: ['css:button.css'],
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_dwp_button');
			
			// create button
			if(this.options.iconPosition == 'left' || this.options.iconPosition == 'top'){
				var posCls = 'left';
				if(this.options.iconPosition == 'top'){
					posCls = 'top';
				}
				this.append(this.$('<div class="_dwp_icon"></div>').addClass(posCls));
				if(!this.options.hideCaption && this.hasCaption()){
					this.append('<div class="_dwp_separator"></div>');
				}
			}
			if(!this.options.hideCaption && this.hasCaption()){
				var caption = this.$('<div class="_dwp_caption"></div>'); 
				this.append(caption);
				
				if(JSB.isString(this.options.caption)){
					caption.text(this.options.caption);
					this.attr('caption', this.options.caption);
				} else if(JSB().isInstanceOf(this.options.caption, 'JSB.Widgets.Control')){
					caption.append(this.options.caption.getElement());
				}
			}
			if(this.options.iconPosition == 'right' || this.options.iconPosition == 'bottom'){
				if(!this.options.hideCaption && this.hasCaption()){
					this.append('<div class="_dwp_separator"></div>');
				}

				var posCls = 'right';
				if(this.options.iconPosition == 'bottom'){
					posCls = 'bottom';
				}
				this.append(this.$('<div class="_dwp_icon"></div>').addClass(posCls));
			}

			if(!this.options.tooltip && JSB().isString(this.options.caption)){
				this.options.tooltip = this.options.caption;
			}
			if(this.options.tooltip){
				this.getElement().attr('title', this.options.tooltip);
			}
			if(this.options.cssClass){
				this.getElement().addClass(this.options.cssClass);
			}
			
			this.enable(this.options.enabled);
/*			
			if(!this.options.caption || this.options.caption.length == 0){
				this.getElement().find('._dwp_separator').addClass('_dwp_hidden');
			}
*/			
			// install event handlers
			if(this.options.onClick){
				this.getElement().click(function(evt){
					if(!self.options.enabled) return;
					self.options.onClick.call(self, evt);
				});
			}
			if(this.options.onDblClick){
				this.getElement().dblclick(function(evt){
					if(!self.options.enabled) return;
					self.options.onDblClick.call(self, evt);
				});
			}
			if(this.options.onMouseOver){
				this.getElement().mouseover(function(evt){
					if(!self.options.enabled) return;
					self.options.onMouseOver.call(self, evt);
				});
			}
		},
		
		options: {
			iconPosition: 'left',
			hideCaption: false,
			caption: '',
			tooltip: null,
			cssClass: null,
			enabled: true,
			
			onClick: null,
			onDblClick: null,
			onMouseOver: null
		},
		
		hasCaption: function(){
			return this.options 
				&& this.options.caption 
				&& ((JSB.isString(this.options.caption) && this.options.caption.length > 0)
					||(JSB.isInstanceOf(this.options.caption, 'JSB.Widgets.Control')));
		},
		
		setCaption: function(str){
			this.getElement().find('._dwp_caption').text(str);
		},
		
		enable: function(b){
			this.options.enabled = b;
			if(b) {
				this.addClass('enabled');
				this.removeClass('disabled');
			} else { 
				this.addClass('disabled');
				this.removeClass('enabled');
			}
		},
		
		on: function(handlerObj){
			var self = this;
			if(handlerObj.click){
				this.options.onClick = handlerObj.click;
				this.getElement().click(function(evt){
					if(!self.options.enabled) return;
					self.options.onClick.call(self, evt);
				});
			}
			if(handlerObj.dblClick){
				this.options.onDblClick = handlerObj.dblClick;
				this.getElement().dblclick(function(evt){
					if(!self.options.enabled) return;
					self.options.onDblClick.call(self, evt);
				});
			}
			if(handlerObj.mouseOver){
				this.options.onMouseOver = handlerObj.mouseOver;
				this.getElement().mouseover(function(evt){
					if(!self.options.enabled) return;
					self.options.onMouseOver.call(self, evt);
				});
			}
			
		}
	}
}