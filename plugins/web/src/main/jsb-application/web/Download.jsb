{
	$name: 'JSB.Web.Download',
	$http: true,
	$fixedId: true,
	
	$client: {
		$constructor: function(){
/*			JSB.defer(function(){
				$this.download();
			});*/
		},
		
		download: function(){
			var a = window.document.createElement('a');
            a.href = this.getJsb().getBasePath() + 'download.jsb?id=' + this.getId();
            a.target = '_blank';
            a.style = 'position:absolute; visibility:hidden;';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            $this.destroy();
		}
	},
	
	$server: {
		$require: ['JSB.Web'],
		fileName: null,
		opts: {},
		callback: null,
		
		$constructor: function(fileName, opts, callback){
			this.fileName = fileName;
			this.opts = opts;
			this.callback = callback;
		},
		
		get: function(obj){
			var opts = JSB.merge({
				contentDisposition: 'attachment; filename*=UTF-8\'\''+encodeURIComponent(this.fileName),
				mode: 'binary',
				encoding: 'UTF-8'
			}, this.opts);
			
			var request = Web.getRequest();
			var response = Web.getResponse();
			
			if(opts.contentType){
				response.setContentType(opts.contentType);
			}
			response.addHeader("Content-disposition", opts.contentDisposition);
			response.setCharacterEncoding(opts.encoding);
			
			var outputStream = response.getOutputStream();
			var StreamClass = null;
			var oStream = null;
			if(opts.mode && opts.mode == 'text'){
				StreamClass = JSB().get('JSB.IO.TextStream').getClass();
				oStream = new StreamClass(outputStream, {
					charset: opts.encoding
				});
			} else {
				StreamClass = JSB().get('JSB.IO.Stream').getClass();
				oStream = new StreamClass(outputStream);
			}
			
			try {
				if(this.callback){
					this.callback.call(this, oStream)
				}
			} finally {
				oStream.close();
				this.destroy();
			}
		}
	}
}