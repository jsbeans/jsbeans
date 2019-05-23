/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

({
	$name: 'Datacube.Types.Type',
	$fixedId: true,
	
	$sync: {
		updateCheckInterval: 0
	},
	
	name: null,
	
	getName: function(){
		return this.name;
	},
	
	isEqual: function(type1, type2) {
	    if (type1 instanceof $this.getClass()) {
	        type1 = type1.name;
	    }
	    if (JSB.isString(type1)) {
	        type1 = type1.toLowerCase();
	    }
	    if (type2 instanceof $this.getClass()) {
	        type2 = type2.name;
	    }
	    if (JSB.isString(type2)) {
	        type2 = type2.toLowerCase();
	    }
	    return type1 == type2;
	},


	$server: {
		aliases: {},

		$constructor: function(name){
			this.id = 'DataTypes.' + name;
			$base();
			$this.name = name;
			$this.aliases = {}; /// {vendor: [aliases]}
//			$this.converter = {}; /// {vendor: { from, to }}
		},

		registerAlias: function(vendor, alias) {
		    $this.aliases[vendor] = $this.aliases[vendor]||[];
		    if (JSB.isArray(alias)) {
		        $this.aliases[vendor] = $this.aliases[vendor].concat(alias);
		    } else {
		        $this.aliases[vendor].push(alias);
		    }
		},

//		registerConverter: function(vendor, converter) {
//		    $this.converters[vendor] = converter;
//		},

        /** returns original type name by ant found alias */
		fromAny: function(vendorType){
		    for(var vendor in $this.aliases) {
		        var aliases = $this.aliases[vendor];
                for(var i = 0; i < aliases.length; i++) {
                    if ($this.isEqual(aliases[i], vendorType)) {
                        return $this.name;
                    }
                }
		    }
		    return null;
		},

		fromVendor: function(vendor, vendorType){
		    var aliases = $this.aliases[vendor];
		    if (!aliases || aliases.length == 0) {
		        throw 'Vendor ' + vendor + 'is not registered for type ' + $this.name;
		    }

		    for(var i = 0; i < aliases.length; i++) {
		        if ($this.isEqual(aliases[i], vendorType)) {
		            return $this.name;
		        }
		    }
		    return null;
		},

		toVendor: function(vendor){
		    var aliases = $this.aliases[vendor];
		    if (!aliases || aliases.length == 0) {
		        throw 'Vendor ' + vendor + 'is not registered for type ' + $this.name;
		    }
		    return aliases[aliases.length - 1] || null;
		},

//		valueToVendor: function(vendor, value) {
//            var converter = $this.converters[vendor];
//		    if (!converter || !JSB.isFunction(converter.to)) {
//		        return value;
//		    }
//		    return converter.to.call($this, value);
//		},
//
//		valueFromVendor: function(vendor, value) {
//            var converter = $this.converters[vendor];
//		    if (!converter || !JSB.isFunction(converter.from)) {
//		        return value;
//		    }
//		    return converter.from.call($this, value);
//		},


	}
})