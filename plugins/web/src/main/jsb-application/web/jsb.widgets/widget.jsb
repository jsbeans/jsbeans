JSB({
	name:'JSB.Widgets.Widget',
	parent: 'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.WidgetContainer': 'WidgetContainer'
	},
	client: {
		constructor: function(opts){
			this.base(opts);
			this.loadCss('widget.css');
			this.element.addClass('_dwp_widget');
			this.container = null;
			if(opts){
				if(!JSO().isNull(opts.container)){
					this.attachContainer(opts.container);
				}
			}
		},
		
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
			this.getSuperClass('JSB.Widgets.Control').destroy.call(this);
		},
		
		attachContainer: function( c, desc ){
			var self = this;
			if( !JSO().isNull(this.container) ) {
				this.detachContainer();
			}
			
			if(!JSO().isInstanceOf(c, 'JSB.Widgets.WidgetContainer')){
				// create adhoc container
				JSO().$(c).append(self.getElement());
			} else {
				c.attachWidget(this, desc);
			}
		},
		
		detachContainer: function(){
			/* TODO: remove all event handlers which are in common to container */
			if(!JSO().isNull(this.container)){
				this.container.detachWidget(this);
			}
		},
		
		getBehavior: function(){
			return this.behavior;
		},
		
		applyBehavior: function(b){
			this.behavior = this.$.extend(true, {}, this.behavior, b);
		},
		
		checkSizes: function(){
			/* track the difference between local widget size and container's size */
			
		},
		
		preloadImages: function(){
			var self = this;
			var globe = JSO().getGlobe();
			if(globe['DWP_PreloadedImageList'] == null || globe['DWP_PreloadedImageList'] == undefined){
				globe['DWP_PreloadedImageList'] = {};
			}
			var preloadScope = globe['DWP_PreloadedImageList'];
			if(preloadScope[this.jso.name]){
				return;
			}
			
			this.rpc('getResourceList', function(imgList){
				for(var i in imgList){
					var img = new Image();
					img.src = imgList[i];
				}
				preloadScope[self.jso.name] = imgList;
			});
		}
	},
	server:{
		constructor: function(){},

		getResourceList: function(){
			var ch = Bridge.getConfigHelper();
			var fh = Bridge.getFileHelper();
			var folders = ch.getWebFolders().toArray();
			for(var f in folders){
				var folder = folders[f].trim();
				if(folder.charAt(folder.length() - 1) != '\\' && folder.charAt(folder.length() - 1) != '/'){
					folder += '/';
				}
				folder += this.jso.path;
				var imgNames = fh.searchFiles(folder, "**/*.jpg|**/*.png|**/*.gif", true);
				var imgArr = [];
				for(var i = 0; i < imgNames.size(); i++){
					var p = imgNames.get(i).replace('\\', '/').replace('\'', '"');
					imgArr[imgArr.length] = this.jso.path + '/' + p;
				}
			}
			return imgArr;
		}

	}
});