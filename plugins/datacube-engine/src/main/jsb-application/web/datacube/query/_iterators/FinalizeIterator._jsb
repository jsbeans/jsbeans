{
	$name: 'DataCube.Query.Iterators.FinalizeIterator',
	$parent: 'DataCube.Query.Iterators.Iterator',

	$server: {
		$constructor: function(iterator, queryEngine){
		    $base();
		    this.iterator = iterator;
		    this.queryEngine = queryEngine;
		    this.cube = queryEngine.cube;
		},

		iterate: function(dcQuery, params){
		    this.dcQuery = dcQuery;
		    this.iterator.iterate(dcQuery, params);
		    return this;
		},

		next: function(){
		    do {
		        var next = this.iterator.next();
		        if (JSB.isNull(next)) {
		            return null;
		        }
		        if (JSB.isFunction(this.dcQuery.$finalize)) {
		            var value = dcQuery.this.dcQuery.$finalize.call(next, next);
                } else if (JSB.isPlainObject(this.dcQuery.$finalize)) {
                    var value = this._finalizeObject(next, this.dcQuery.$finalize);
                }
		    } while (JSB.isNull(value));
		    return value;
		},

		matchDataProvider: function(dataProvider){
		    if (this.iterator.matchDataProvider(dataProvider)) {
                return true;
            }
		    return false;
		},

		close: function() {
		    this.iterator.close();
		    this.destroy();
		},

		_finalizeObject: function(json, finalize) {
		    function finalizeReplace(finalizedField, replacer) {
		        var finalizedValue = '' + json[finalizedField]; // as string
                for (var p in replacer) if (replacer.hasOwnProperty(p)) {
                    if (p.startsWith('/')) {
                        var pp = p.split('/');
                        var reg = new RegExp(pp[1], pp[2]||'');
                        if (finalizedValue.match(reg)) {
                            json[finalizedField] = replacer[p];
                        }
                    } else {
                        if (finalizedValue == p) {
                            json[finalizedField] = replacer[p];
                        }
                    }
                }

		    }
		    function finalizeGroupFields(finalizedField, fields) {
		        var value = {};
		        if (json[finalizedField]) {
		            value[finalizedField] = json[finalizedField];
		        }
                for (var i in fields) {
                    var field = fields[i];
                    value[field] = json[field];
                    delete json[field];
                }
		        json[finalizedField] = value;
		        return json;
		    }

		    for (var finalizedField in finalize) if (finalize.hasOwnProperty(finalizedField )) {
		        var finalizer = finalize[finalizedField];

		        if (finalizer.$replace) finalizeReplace(finalizedField, finalizer.$replace);
		        if (finalizer.$groupFields) finalizeGroupFields(finalizedField, finalizer.$groupFields);
		    }
		    return json;
		},
	}
}