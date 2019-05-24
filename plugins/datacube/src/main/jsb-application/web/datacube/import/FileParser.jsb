/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.FileParser',
	$parent: 'DataCube.Parser',
	$session: false,
	$scheme: {
	},
	
	$server: {
		
		$constructor: function(source, values){
			$base(source, values);
			
			if(JSB.isInstanceOf(source, 'JSB.Workspace.FileEntry')){
				this.fileSize = source.getFileSize();
			} else if(JSB.isString(source)){
				this.fileSize = source && source.length || 0;
			} else if(JSB.isInstanceOf(source, 'JSB.IO.TextStream')){
				this.fileSize = source.available();
			} else {
				this.fileSize = 0;
			}
		},
		
		getFileSize: function(){
			return this.fileSize;
		}

	}
		
}