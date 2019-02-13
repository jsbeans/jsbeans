({
	$name: 'Datacube.Types.DataTypes',
	$singleton: true,

	$server: {
		$require: [
		    'Datacube.Types.Type',
		],

        /** Общий принцип работы типов:
            - DataTypes - основной контейнер типов
            - Type - базовый класс описания типа, содержит имя и список алиасов для каждого вендора
            - DataTypes.register() - регистрация нового типа
            - DataTypes.types - все зарегистрированные типы в формате {name: Type} (в то время как DataTypes.TYPENAME - только основные)
            - DataTypes.names - имена зарегистрированных типов в формате {name: name}, чтобы использовать в case DataTypes.names.TYPENAME
            - DataTypes.registerAliases() - позволяет зарегистрировать дополнительные алиасы для вендора,
              последний зарегистрированный алиас ялвляется основным
            - DataTypes.get() - возвращает объект типа по имени
            - DataTypes.fromJson() - получение имени JSON типа по имени типа (по сути вендор "JSON")
            - DataTypes.toVendor() - получение алиаса типа для заданного вендора (тип алиаса тот, который был при регистрации, помимо строки может быть объектом или числом)
            - DataTypes.toVendor() - получение имени типа по алиасу и вендору
            - DataTypes.fromAny()  - получение имени типа по первому совпадению алиаса для любого вендора
            - DataTypes.byObject() - получение имени типа по классу объекта
            - SQL вендоры регистрируются в бине JDBC
            - Алиасы и номера SQL/JDBC типов также регистрируются в бине JDBC
        */

		$constructor: function(){
			$base();

            /// create standard types
            $this['null']   = new Type('null');
			$this.string    = new Type('string');
			$this.integer   = new Type('integer');
			$this.long      = new Type('long');
			$this.uint      = new Type('uint');
			$this.ulong     = new Type('ulong');
			$this.number    = new Type('number');
			$this.boolean   = new Type('boolean');
			$this.float     = new Type('float');
			$this.double    = new Type('double');
			$this.date      = new Type('date');
			$this.time      = new Type('time');
			$this.datetime  = new Type('datetime');
			$this.timestamp = new Type('timestamp');
			$this.array     = new Type('array');
			$this.object    = new Type('object');

            /// register standart types
			for(var name in $this) if($this.hasOwnProperty(name) && $this[name] instanceof Type) {
			    $this.register(name, $this[name]);
			}

            /// register aliases for JSON vendor
			$this.registerAliases('JSON', {
			    string: 'string',
			    number: 'number',
			    integer: 'number',
			    uint: 'number',
			    long: 'number',
			    ulong: 'number',
			    boolean: 'boolean',
			    float: 'float',
			    double: 'double',
			    datetime: 'date',
			    date: 'date',
			    time: 'date',
			    timestamp: 'date',
			    array: 'array',
			    object: 'object',
			});
		},

        /** $this (DataTypes instance) contains standard types map {name: Type} */
		types: {}, /// all registered types map {name: Type}
		names: {}, /// all registered

		register: function(name, type){
		    if (!(type instanceof Type)) {
		        throw 'Illegal class for type ' + name;
		    }
		    name = name.toLowerCase();
		    if(!$this[name]) $this[name] = type;
		    $this.types[name] = type;
		    $this.names[name] = name;
        },

		registerAliases: function(vendor, map/**{name:alias/aliases}*/) {
		    for(var name in map) if(map.hasOwnProperty(name)) {
                var type = $this.get(name);
                if (!type || !(type instanceof Type)) {
                    throw 'Type not found: ' + name;
                }

                type.registerAlias(vendor, map[name]);
		    }
		},

//		registerConverter: function(vendor, converter) {
//		    for(var type in map) if(map.hasOwnProperty(type)) {
//                var type = $this.get(name);
//                if (!type || !(type instanceof Type)) {
//                    throw 'Type not found: ' + name;
//                }
//
//                type.registerConverter(vendor, converter);
//            }
//		},

		get: function(name){
		    name = name.toLowerCase();
		    return $this[name];
		},

        /** returns original type name by object type */
		byObject: function(object){
            if (JSB.isNull(value)) {
                return $this['null'];
            } else if (JSB.isNumber(value)) {
                if (Number.isInteger(value)) {
                    return $this.integer;
                } else {
                    return $this.double;
                }
            } else if (JSB.isBoolean(value)) {
                return $this.boolean;
            } else if (JSB.isString(value)) {
                return $this.string;
            } else if (JSB.isDate(value)) {
                return $this.datetime;
            } else if(JSB.isArray(value)) {
                return $this.array;
            } else {
                var isJava = !!object.getClass && object.getClass().getName;
                if (isJava) {
                    var className = object.getClass().getName();
                    switch(className) {
                        case 'java.lang.String': return $this.string;
                        case 'java.lang.Boolean': return $this.boolean;
                        case 'java.lang.Integer': return $this.integer;
                        case 'java.lang.Long': return $this.long;
                        case 'java.lang.long': return $this.long;
                        case 'java.lang.Float': return $this.float;
                        case 'java.lang.Double': return $this.double;
                        case 'java.lang.UnsignedInteger': return $this.uint;
                        case 'java.lang.UnsignedLong': return $this.ulong
                    }
                }
                return $this.object;
            }
		},

        /** returns original type name by JSON type alias */
		fromJson: function(jsonType){
		    return $this.fromVendorType('JSON', jsonType).name;
		},

        /** returns last registered JSON type alias */
		toVendor: function(vendor, type){
		    return $this.toVendor('JSON', type);
		},

        /** returns original Type object by vendor and alias */
		fromVendorType: function(vendor, vendorType){
		    for(var name in $this.types) {
		        if($this.types[name].fromVendor(vendor, vendorType)) {
		            return $this.types[name];
		        }
		    }
            throw 'Type alias ' + vendorType + 'is not registered for vendor ' + vendor;
		},

        /** returns original type name by vendor and alias */
		fromVendor: function(vendor, vendorType){
		    return $this.fromVendorType(vendor, vendorType).name;
		},

        /** returns last registered alias for vendor */
		toVendor: function(vendor, type){
		    if(type instanceof Type) {
		        return type.toVendor(vendor);
		    }
		    var ty = $this.get(type);
                if (!ty || !(ty instanceof Type)) {
                    throw 'Type not found: ' + type;
                }
		    return ty.toVendor(vendor);
		},

        /** returns original Type object by any found alias */
		fromAnyType: function(vendorType){
		    for(var name in $this.types) {
		        if($this.types[name].fromAny(vendorType)) {
		            return $this.types[name];
		        }
		    }
debugger;
            throw 'Type alias ' + vendorType + ' is not registered for any vendor';
		},

        /** returns original type name by ant found alias */
		fromAny: function(vendorType){
		    return $this.fromAnyType(vendorType).name;
		},

	}
})