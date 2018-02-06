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
            return $this.managedFields[field] ? JSB.merge({
                ownerView: $this,
                context: $this.getContext(),
            }, $this.managedFields[field]) : null;
		},

        getFieldLinkedViews: function(field) {
            return $this.linkedFieldViews[field];
		},

		linkField: function(field, linkedView) {
		    $this.linkedFieldViews[field] = $this.linkedFieldViews[field] || {};
		    $this.linkedFieldViews[field][linkedView.name] = linkedView;
		},

        lookupField: function(name, notAlias) {
            // notAlias=false : alias, field
            // notAlias=true  : field, alias
            var field = notAlias && $this.sourceView.getField(name) || $this.getField(name) || $this.sourceView.getField(name);
            return field ? JSB.merge(field, {
                    ownerView: $this,
                    context: $this.getContext(),
                }) : null;
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