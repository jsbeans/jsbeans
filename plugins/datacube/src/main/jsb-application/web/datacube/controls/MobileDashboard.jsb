/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Controls.MobileDashboard',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['script:../../tpl/iscroll/iscroll.js',
		           'css:MobileDashboard.css'],
		
		widgets: [],
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('mobileDashboard');
			
			this.header = $this.$('<div class="header"></div>');
			this.headerPane = $this.$('<div class="pane"></div>');
			this.header.append(this.headerPane);
			this.append(this.header);
			
			this.headerScroll = new IScroll( this.header.get(0), {
				scrollX: true,
				scrollY: false,
				momentum: false,
				click: true
			});
			
			this.container = $this.$('<div class="container"></div>');
			this.pane = $this.$('<div class="pane"></div>');
			this.container.append(this.pane);
			this.append(this.container);
			
			this.widgetScroll = new IScroll( this.container.get(0), {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				click: true,
				disableTouch: true,
				snapSpeed: 400,
				keyBindings: true
			});
			
			this.container.resize(function(){
				JSB.defer(function(){
					$this.updateSizes();
				}, 100, 'mobileContainerResize.' + $this.getId());
			});
			
			this.header.resize(function(){
				var headerHeight = $this.header.height();
				$this.container.css({
					height: 'calc(100% - '+headerHeight+'px)'
				});
			});
		},
		
		setLayout: function(layoutDesc){
			this.pane.empty();
			this.headerPane.empty();
			var containerWidth = this.container.width();
			var containerHeight = this.container.height();
			var paneWidth = 0;
			var idx = 0;
			this.widgets = [];
			for(var wId in layoutDesc.widgets){
				var widget = layoutDesc.widgets[wId];
				if(widget.getWidgetEntry().isUnused()){
					continue;
				}
				this.widgets[idx] = widget;
				var widgetPlaceholder = $this.$('<div class="widgetPlaceholder"></div>');
				this.pane.append(widgetPlaceholder);
				widgetPlaceholder.css({
					width: containerWidth,
					height: containerHeight
				});
				paneWidth += containerWidth;
				widgetPlaceholder.append(widget.getElement());
				
				var headerEntry = $this.$('<div class="headerEntry" idx="'+idx+'"></div>');
				headerEntry.text(widget.getTitle());
				this.headerPane.append(headerEntry);
				headerEntry.click(function(evt){
					var tgt = $this.$(evt.currentTarget);
					var idx = parseInt(tgt.attr('idx'));
					$this.activateWidget(idx);
				});
				idx++;
			}
			this.pane.css('width', paneWidth);
			this.widgetScroll.refresh();
			this.headerScroll.refresh();
			JSB.defer(function(){
				$this.activateWidget(0);
			}, 0);
			
		},
		
		updateSizes: function(){
			var containerWidth = this.container.width();
			var containerHeight = this.container.height();
			var paneWidth = 0;
			var placeholders = this.pane.find('> .widgetPlaceholder')
			placeholders.css({
				width: containerWidth,
				height: containerHeight
			});
			this.pane.css('width', placeholders.length * containerWidth);
			this.widgetScroll.refresh();
		},
		
		activateWidget: function(idx){
			for(var i = 0; i < this.widgets.length; i++){
				this.widgets[i].setAuto(i==idx);
			}
			var headerEntry = this.headerPane.find('.headerEntry[idx="'+idx+'"]');
			this.headerPane.find('.headerEntry').removeClass('active');
			headerEntry.addClass('active');
			this.widgetScroll.goToPage(idx, 0, 400, IScroll.utils.ease.quadratic);
			this.headerScroll.scrollToElement(headerEntry.get(0), 400, true, 0, IScroll.utils.ease.quadratic);
		}
	}
}