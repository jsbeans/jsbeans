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
	$name:'JSB.Widgets.GroupBox',
	$parent: 'JSB.Widgets.Control',
	$require: {
		PrimitiveEditor: 'JSB.Widgets.PrimitiveEditor'
	},
	
	$client: {
		$require: ['css:groupBox.css'],
		$constructor: function(opts){
			$base(opts);
			this.init();
		},
		
		options: {
			caption: 'title',
			collapsed: false,
			collapsible: true,
			editable: false,
			rotate: false,
			iconClass: null,
			
			onExpand: null,
			onCollapse: null
		},
		init: function(){
			var self = this;
			var elt = this.getElement();
			elt.addClass('_dwp_groupBox');
			this.createHeader();
			this.pane = this.$('<div class="_dwp_groupBoxPane"></span>');
			this.hiddenArea = this.$('<div class="_dwp_groupBoxHidden"></span>');
			elt.append(this.pane);
			elt.append(this.hiddenArea);
			
			this.setTitle(this.options.caption);
		},
		
		setTitle: function(title){
			if(this.options.editable){
				this.titleEditor.setData(title);
			} else {
				this.title.text(title);
			}
		},
		
		createHeader: function(){
			var self = this;
			this.header = this.$('<div class="_dwp_groupBoxHeader"></div>');
			this.getElement().append(this.header);
			
			if(this.options.collapsible){
				this.getElement().addClass('collapsible');
				this.header.append('<div class="_dwp_groupBoxCollapseContainer"><div class="_dwp_groupBoxCollapseHandler"></div></div>');
				this.header.click(function(){
					self.toggleCollapse();
				});
			}
			if(this.options.iconClass){
				this.header.append('<span class="_dwp_groupBoxIcon '+this.options.iconClass+'"></span>');
			}
			if(this.options.collapsed){
				this.getElement().addClass('collapsed');
			} else {
				if(this.options.rotate){
					var handler = self.header.find('._dwp_groupBoxCollapseHandler');
					handler.css({
						textIndent: 90,
						'-ms-transform': 'rotate(90deg)',
				    	'-webkit-transform': 'rotate(90deg)',
				    	'transform': 'rotate(90deg)'
					});
				}
			}
			
			if(this.options.editable){
				this.titleEditor = new PrimitiveEditor({
					mode: 'inplace',
					onValidate: self.options.onValidateTitle,
					onChange: self.options.onChangeTitle
				});
				this.header.append(this.titleEditor.getElement());
				this.titleEditor.getElement().addClass('_dwp_groupBoxTitle');
			} else {
				this.title = this.$('<span class="_dwp_groupBoxTitle"></span>');
				this.header.append(this.title);
			}
		},
		
		toggleCollapse: function(){
			var self = this;
			if(this.getElement().hasClass('collapsed')){
				// show
				this.hiddenArea.append(this.pane);
				this.pane.css({
					display: 'block'
				});
				JSB().deferUntil(function(){
					var originalHeight = self.pane.height();
					self.pane.css({
						height: 0,
						opacity: 0,
					});
					self.getElement().append(self.pane);
					self.getElement().removeClass('collapsed');
					if(self.options.onExpand){
						self.options.onExpand.call(self);
					}
					if(self.options.rotate){
						var handler = self.header.find('._dwp_groupBoxCollapseHandler');
						handler.animate({
							textIndent: 90
						}, {
							step: function(now, fx) {
								self.$(this).css({
									'-ms-transform': 'rotate('+now+'deg)',
							    	'-webkit-transform': 'rotate('+now+'deg)',
							    	'transform': 'rotate('+now+'deg)'
								});
							},
							duration:200
						}, 'linear');
					}
					self.pane.animate({
						height: originalHeight,
						opacity: 1
					}, 200, function(){
						self.pane.css({
							height: '',
							opacity: ''
						});
					});
				},function(){
					return self.pane.height() > 0;
				});
			} else {
				// hide
				this.pane.css({
					height: this.pane.height() 
				});
				if(self.options.onCollapse){
					self.options.onCollapse.call(self);
				}
				if(self.options.rotate){
					var handler = self.header.find('._dwp_groupBoxCollapseHandler');
					handler.animate({
						textIndent: 0
					}, {
						step: function(now, fx) {
							self.$(this).css({
								'-ms-transform': 'rotate('+now+'deg)',
						    	'-webkit-transform': 'rotate('+now+'deg)',
						    	'transform': 'rotate('+now+'deg)'
							});
						},
						duration:200
					}, 'linear');
				}
				this.pane.animate({
					height: 0,
					opacity: 0
				}, 200, function(){
					self.getElement().addClass('collapsed');
					self.pane.css({
						height: '',
						opacity: '',
						display: 'none'
					});
				});
			}
			
		},
		
		getHeader: function(){
			return this.header;
		},
		
		getPane: function(){
			return this.pane;
		},
		
		append: function(c){
			return this.getPane().append(this.resolveElement(c));
		},
		
		empty: function(){
			this.getPane().empty();
		}
	}
}