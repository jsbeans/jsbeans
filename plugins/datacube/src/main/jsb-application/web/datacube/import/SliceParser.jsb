{
	$name: 'DataCube.SliceParser',
	$parent: 'DataCube.Parser',
	$session: false,
/*	$scheme: {
		parserSettings: {
			items: {
			}
		}
	},*/
	
	$require: ['DataCube.ParserManager'],
	$server: {
		$require: [],
		
		$bootstrap: function(){
			ParserManager.registerParser(this, {
				name: 'Срез',
				accepts: function(entry){
					return JSB.isInstanceOf(entry, 'DataCube.Model.Slice');
				}
			});
		},
		
		options: {
			treatEmptyStringsAsNull: true
		},
		
		$constructor: function(entry, values){
			$base(entry, values);
		},
		
		execute: function(){
			var total = 0;
			var entry = this.getEntry();
			// extract total size
			var wrapQuery = {$select:{'cnt':{$count: 1}}};
			var itCount = null;
			try {
				itCount = entry.executeQuery({wrapQuery: wrapQuery});
				var rCnt = itCount.next();
				if(rCnt){
					total = rCnt.cnt || 0;
				}
			} finally {
				if(itCount){
					itCount.close();		
				}
			}
			
			function appendValue(name, val){
				if(JSB.isDate(val) || JSB.isNull(val)){
					$this.setValue(name, val);
				} else if(JSB.isObject(val)){
					$this.beginObject(name);
					for(var f in val){
						appendValue(f, val[f]);
					}
					$this.endObject();
				} else if(JSB.isArray(val)){
					$this.beginArray(name);
					for(var i = 0; i < val.length; i++){
						appendValue(i, val[i]);
					}
					$this.endArray();
				} else {
					$this.setValue(name, val);
				}

			}
			
			var it = null, cnt = 0, lastProgress = -1;
			try {
				it = entry.executeQuery();
				$this.beginArray(null);
				while(true){
					var rec = it.next();
					if(!rec){
						break;
					}
					
					appendValue(cnt, rec);
					cnt++;
					
					var progress = Math.round(cnt * 100 / total);
					if(lastProgress != progress){
						lastProgress = progress;
						$this.publish('Parser.progress', {progress: progress, position: cnt, total: total});
					}
					
				}
				$this.endArray();
			} finally {
				if(it){
					it.close();
				}
			}
		}
		
	}
}