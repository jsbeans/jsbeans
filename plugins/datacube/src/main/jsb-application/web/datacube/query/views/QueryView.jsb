{
	$name: 'DataCube.Query.Views.QueryView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, query, sourceView){
		    $base(name);
		    $this.query = query;
		    $this.sourceView = sourceView;
		},

		destroy: function(){
            $this.sourceView.destroy();
		    $base();
		},

        isolated: true,
		managedFields: {},
		subViews: {/**context:view*/},
		linkedFieldViews: {/**field:{name:view}*/},

        setIsolated: function(isolated) {
            $this.isolated = isolated;
		},

		addSubView: function(subView) {
            $this.subViews[subView.getContext()] = subView;
        },

        setField: function(field, desc) {
            $this.managedFields[field] = desc;
		},

        listFields: function() {
		    return Object.keys($this.managedFields);
		},

        listLinkedFields: function() {
		    return Object.keys($this.linkedFieldViews);
		},

		isIsolated: function(){
		    return $this.isolated;
		},

        getField: function(field) {
            var desc = $this.managedFields[field];
//            if (desc) {
//                desc.context = desc.context || $this.getContext();
//            }
            return desc;
		},

        getFieldLinkedViews: function(field) {
            return $this.linkedFieldViews[field];
		},

		linkField: function(field, linkedView) {
		    $this.linkedFieldViews[field] = $this.linkedFieldViews[field] || {};
		    $this.linkedFieldViews[field][linkedView.name] = linkedView;
		},

        lookupField: function(name, notAlias) {
            var desc = $this.sourceView.getField(name);
            if (desc && !desc.context) {
                desc.context = $this.getContext();
            }
            if (!desc && !notAlias) {
                desc = $this.getField(name);
            }
            return desc;
		},

		getSourceView: function() {
		    return $this.sourceView;
		},

		getQuery: function() {
		    return $this.query;
		},

		visitInternalViews: function(visitor/**function visitor(view)*/) {
            $this.sourceView.visitInternalViews(visitor);
            for(var v in $this.subViews) {
                if ($this.sourceView != $this.subViews[v]) {
                    $this.subViews[v].visitInternalViews(visitor);
                }
            }
            $base(visitor);
		},
	}
}