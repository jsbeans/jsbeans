{
	$name:'JSB.Widgets.Widget',
	$parent: 'JSB.Widgets.Control',
	$require: {
		WidgetContainer: 'JSB.Widgets.WidgetContainer'
	},
	$client: {
		_widgetContainer: null,
		
		$constructor: function(opts){
			$base(opts);
			$jsb.loadCss('widget.css');
			this.element.addClass('_dwp_widget');
			if(opts){
				if(!JSB().isNull(opts.container)){
					this.attachContainer(opts.container);
				}
			}
		},
		
		title: null,
		
		behavior: {
			allowResize: {
				horizontal: true,
				vertical: true
			},
			dimensions: {
				aspect: 1.33,	// 4/3
				preserveAspect: false,
				defaultWidth: null,
				defaultHeight: null
			}
		},
		
		/* methods */
		
		destroy: function(){
			this.detachContainer();
			$base();
		},
		
		setTitle: function(title){
			this.title = title;
			
			if(this.getContainer()){
				this.getContainer().renameWidget(this, title);
			}
		},
		
		getTitle: function(){
			return this.title;
		},
		
		attachContainer: function( c, desc ){
			var self = this;
			if( !JSB().isNull(this.getContainer()) ) {
				this.detachContainer();
			}
			
			if(!JSB().isInstanceOf(c, 'JSB.Widgets.WidgetContainer')){
				// create adhoc container
				JSB().$(c).append(self.getElement());
			} else {
				c.attachWidget(this, desc);
			}
		},
		
		detachContainer: function(){
			/* TODO: remove all event handlers which are in common to container */
			if(!JSB().isNull(this.getContainer())){
				this.getContainer().detachWidget(this);
			}
		},
		
		getBehavior: function(){
			return this.behavior;
		},
		
		applyBehavior: function(b){
			this.behavior = this.$.extend(true, {}, this.behavior, b);
		},
		
		getContainer: function(){
			return this._widgetContainer;
		},
		
		setContainer: function(wc){
			this._widgetContainer = wc;
		},
		
		checkSizes: function(){
			/* track the difference between local widget size and container's size */
			
		},
		
		preloadImages: function(){
			var self = this;
			var globe = JSB().getGlobe();
			if(globe['DWP_PreloadedImageList'] == null || globe['DWP_PreloadedImageList'] == undefined){
				globe['DWP_PreloadedImageList'] = {};
			}
			var preloadScope = globe['DWP_PreloadedImageList'];
			if(preloadScope[this.getJsb().$name]){
				return;
			}
			
			this.rpc('getResourceList', [], function(imgList){
				for(var i in imgList){
					var img = new Image();
					img.src = imgList[i];
				}
				preloadScope[self.getJsb().$name] = imgList;
			});
		}
		
	},
	$server:{
		$constructor: function(){},

		getResourceList: function(){
			var ch = Bridge.getConfigHelper();
			var fh = Bridge.getFileHelper();
			var folders = ch.getWebFolders().toArray();
			for(var f in folders){
				var folder = folders[f].trim();
				if(folder.charAt(folder.length() - 1) != '\\' && folder.charAt(folder.length() - 1) != '/'){
					folder += '/';
				}
				folder += this.getJsb().path;
				var imgNames = fh.searchFiles(folder, "**/*.jpg|**/*.png|**/*.gif", true);
				var imgArr = [];
				for(var i = 0; i < imgNames.size(); i++){
					var p = imgNames.get(i).replace('\\', '/').replace('\'', '"');
					imgArr[imgArr.length] = this.getJsb().path + '/' + p;
				}
			}
			return imgArr;
		}
	}
}