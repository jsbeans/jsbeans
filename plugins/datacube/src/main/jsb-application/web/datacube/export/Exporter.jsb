{
	$name: 'DataCube.Export.Exporter',
	
	$server: {
		stream: null,
		manager: null,
		opts: null,
		
		$constructor: function(manager, stream, opts){
			this.stream = stream;
			this.manager = manager;
			this.opts = opts;
		},
		
		getStream: function(){
			return this.stream;
		},
		
		getOptions: function(){
			return this.opts;
		},
		
		begin: function(){
			throw new Error('This method should be overriden');
		},
		
		write: function(row){
			throw new Error('This method should be overriden');
		},
		
		end: function(){
			throw new Error('This method should be overriden');
		},
		
		iterate: function(it){
			this.begin();
			try {
				while(true){
					var el = it.next();
					if(!el){
						break;
					}
					this.write(el);
				}
				this.end();
			} finally {
				it.close();
			}
		}
	}
}