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
		linkedFieldViews: {/**field:{name:view}*/},

        setIsolated: function(isolated) {
            $this.isolated = isolated;
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
            return JSB.merge({
                ownerView: $this,
                context: $this.getContext(),
            }, $this.managedFields[field]);
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
            return notAlias && $this.sourceView.getField(name) || $this.managedFields[name] || $this.sourceView.getField(name);
		},

		getSourceView: function() {
		    return $this.sourceView;
		},

		getQuery: function() {
		    return $this.query;
		},

		visitInternalViews: function(visitor/**function visitor(view)*/) {
            $base(visitor);
            visitor.call($this.sourceView, $this.sourceView);
		},
	}
}