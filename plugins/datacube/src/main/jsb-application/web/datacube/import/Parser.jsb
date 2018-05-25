{
	$name: 'DataCube.Parser',
	$session: false,
	
	$scheme: {
		parserSettings: {
			render: 'group',
	        name: 'Настройки парсера',
	        items: {}
		},
		
		structure: {
			render: 'parserBinding'
		},
		
		tablesSettings: {
			render: 'group',
	        name: 'Настройки таблиц',
	        
	        multiple: {
                createDefault: false,
                uniqueNames: true
            },
	        items: {
	        	tableSettings: {
	        		render: 'group',
	        		name: 'Таблица',
	        		editableName: true,
	        		items: {}
	        	}
	        }
		}
	},
	
	$server: {
		entry: null,
		context: null,
		
		struct: null,
		structScope: null,
		structScopeType: null,
		structStack: [],
		structTypeStack: [],
		structTopArray: null,
		structLastChangedCount: null,
		
		deep: 0,
		
		$constructor: function(entry, context){
			$base();
			this.entry = entry;
			this.context = context;
		},
		
		analyze: function(){
			throw new Error('This method should be overriden');
		},
		
		getStruct: function(){
			return this.struct;
		},
		
		checkBreak: function(){
			if(this.structScope == this.structTopArray && this.structScope._count - this.structLastChangedCount > 10){
				throw 'Break';
			}
		},
		
		beginArray: function(field){
			if(field === null){
				this.struct = {array:{_count: 0}};
				this.structScope = this.struct.array;
				if(!this.structTopArray){
					this.structTopArray = this.structScope;
				}
				if(this.structTopArray){
					this.structLastChangedCount = this.structTopArray._count;
				}
			} else {
				this.structStack.push(this.structScope);
				this.structTypeStack.push(this.structScopeType);
				if(this.structScopeType == 0){
					this.structScope._count++;
					if(!this.structScope.array){
						this.structScope.array = {_count: 0};
						this.structLastChangedCount = this.structTopArray._count;
					}
					this.structScope = this.structScope.array;
					
				} else if(this.structScopeType == 1){
					if(!this.structScope[field]){
						this.structScope[field] = {};
					}
					if(!this.structScope[field].array){
						this.structScope[field].array = {_count: 0};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray._count;
						}

					}
					this.structScope = this.structScope[field].array;
				} else {
					throw new Error('Unexpected structure type: ' + this.structScopeType);
				}
				
				if(!this.structTopArray){
					this.structTopArray = this.structScope;
					this.structLastChangedCount = this.structTopArray._count;
				}
			}
			this.structScopeType = 0;
		},
		
		endArray: function(){
			this.structScope = this.structStack.pop();
			this.structScopeType = this.structTypeStack.pop();
			this.checkBreak();
		},
		
		beginObject: function(field){
			if(field === null){
				this.struct = {object:{}};
				this.structScope = this.struct.object;
			} else {
				this.structStack.push(this.structScope);
				this.structTypeStack.push(this.structScopeType);
				if(this.structScopeType == 0){
					this.structScope._count++;
					if(!this.structScope.object){
						this.structScope.object = {};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray._count;
						}
					}
					this.structScope = this.structScope.object;
				} else if(this.structScopeType == 1){
					if(!this.structScope[field]){
						this.structScope[field] = {};
					}
					if(!this.structScope[field].object){
						this.structScope[field].object = {};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray._count;
						}
					}
					this.structScope = this.structScope[field].object;
				} else {
					throw new Error('Unexpected structure type: ' + this.structScopeType);
				}
			}
			this.structScopeType = 1;
		},
		
		endObject: function(){
			this.structScope = this.structStack.pop();
			this.structScopeType = this.structTypeStack.pop();
			this.checkBreak();
		},
		
		setValue: function(field, value){
			// detect value type
			var type = null;
			if(JSB.isNull(value)){
				type = 'null';
			} else if(JSB.isBoolean(value)){
				type = 'boolean';
			} else if(JSB.isString(value)){
				type = 'string';
			} else if(JSB.isFloat(value)){
				type = 'float';
			} else if(JSB.isInteger(value)){
				type = 'integer';
			} else if(JSB.isInteger(value)){
				throw new Error('Unknown value type: ' + JSON.stringify(value));
			}
			
			if(this.structScopeType == 0){
				this.structScope._count++;
				if(!this.structScope[type]){
					this.structScope[type] = true;
					if(this.structTopArray){
						this.structLastChangedCount = this.structTopArray._count;
					}
				}
				this.checkBreak();
			} else if(this.structScopeType == 1) {
				if(!this.structScope[field]){
					this.structScope[field] = {};
				}
				if(!this.structScope[field][type]){
					this.structScope[field][type] = true;
					if(this.structTopArray){
						this.structLastChangedCount = this.structTopArray._count;
					}
				}
			} else {
				throw new Error('Unexpected structure type: ' + this.structScopeType);
			}
			
		}
	}
}