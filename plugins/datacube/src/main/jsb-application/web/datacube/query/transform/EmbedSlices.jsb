{
	$name: 'DataCube.Query.Transforms.EmbedSlices',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cubeOrDataProvider){
		    if (cubeOrDataProvider.getJsb().$name != 'DataCube.Model.Cube') {
		        return;
		    }
		    var slicesById = cubeOrDataProvider.getSlices();
		    var slicesByName = {};
		    for (var id in slicesById) if (slicesById.hasOwnProperty(id)) {
		        slicesByName[slicesById[id].getName()] = slicesById[id];
		    }

		    dcQuery.$views = dcQuery.$views || {};
		    var num = 0;
		    function embedSlicesForQuery(query) {
                QueryUtils.walkSubQueries(query, function(subQuery){
                    if (typeof subQuery.$from === 'string') {
                        var slice = slicesById[subQuery.$from] || slicesByName[subQuery.$from];
                        if (slice) {
                            subQuery.$from = $this.sliceLocalId(slice);
                            if (!dcQuery.$views[subQuery.$from]) {
                                var viewQuery = $this._rebuildQuery(slice.getQuery(), subQuery.$from);
                                embedSlicesForQuery(viewQuery);
                                dcQuery.$views[subQuery.$from] = viewQuery;
                            }
                        }
                    }
                });
            }

            embedSlicesForQuery(dcQuery);
		    return dcQuery;
		},

		sliceLocalId: function(slice){
		    var id = slice.getId();
		    return 'view_' + id.substring(id.length - 6);
		},

		_rebuildQuery: function(dcQuery, context) {
		    var dcQuery = JSB.merge(true, {}, dcQuery);
		    var oldContext = dcQuery.$context;

		    function walk(e) {
		        if (e == null) {
		        } else if(JSB.isObject(e)) {
		            for(var i in e) if (e.hasOwnProperty(i)) {
		                if (i == '$context') {
		                    if (e[i] == oldContext) {
		                        e[i] = context;
		                    } else {
		                        e[i] = 'sub_' + context + '_' + e[i];
                            }
		                } else {
		                    walk(e[i]);
		                }
		            }
		        } else if(JSB.isArray(e)) {
		            for(var i in e) {
		                walk(e[i]);
		            }
                }
		    }

		    walk(dcQuery);
		    return dcQuery;
		},
	}
}