{
	$name: 'DataCube.FileParser',
	$parent: 'DataCube.Parser',
	$session: false,
	$scheme: {
	},
	
	$server: {
		
		$constructor: function(entry, values){
			$base(entry, values);
			this.fileSize = entry.getFileSize();
		},
		
		getFileSize: function(){
			return this.fileSize;
		}

	}
		
}