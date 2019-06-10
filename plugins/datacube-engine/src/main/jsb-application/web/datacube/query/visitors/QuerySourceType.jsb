/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.QuerySourceType',
	$singleton: true,

	$server: {
	    $require: [,
            'DataCube.Query.QueryUtils',
            'DataCube.Model.Cube',
            'DataCube.Model.Slice',
            'DataCube.Model.QueryableEntry',
        ],

        EmptyQuery: 'EmptyQuery',
        SubQuery:   'SubQuery',
        ViewName:   'ViewName',
        Join:       'Join',
        Union:      'Union',
        Recursive:  'Recursive',
        Cube:       'Cube',
        Slice:      'Slice',
        Provider:   'Provider',

		getSourceType: function(query, cube) {
            if (query.$cube)      return $this.Cube;
            if (query.$provider)  return $this.Provider;
            if (query.$join)      return $this.Join;
            if (query.$union)     return $this.Union;
            if (query.$recursive) return $this.Recursive;

		    if (query.$from) {
                if (JSB.isString(query.$from)) {
                    var entry = QueryUtils.getQueryEntry(query.$from, cube, true);
                    if (entry instanceof Cube) {
                        return $this.Cube;
                    }
                    if (entry instanceof Slice) {
                        return $this.Slice;
                    }

                    if (entry instanceof QueryableEntry) {
                        return $this.Provider;
                    }
                    return $this.ViewName;
                } else if (JSB.isArray(query.$from)){
                    return $this.Union;
                } else if (JSB.isObject(query.$from)) {
                    if (query.$from.$left && query.$from.$right) {
                        return $this.Join;
                    } else if(query.$from.$start && query.$from.$joinedNext) {
                        return $this.Recursive;
                    } else if (Object.keys(query.$from).length == 0) {
                        return $this.EmptyQuery;
                    }
                    return $this.SubQuery;
                }
		    }
		    throw new JSB.Error('Internal error: Unexpected source type for query');
		},
	}
}