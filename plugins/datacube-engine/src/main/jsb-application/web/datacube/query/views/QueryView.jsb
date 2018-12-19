{
	$name: 'DataCube.Query.Views.QueryView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.Views.DataProviderView',
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

		managedFields: {},
		subViews: {/**context:view*/},
		linkedForeignFields: {},

		addSubView: function(subView) {
            $this.subViews[subView.getContext()] = subView;
        },

        setField: function(field, desc) {
            $this.managedFields[field] = desc;
		},

        listFields: function() {
		    return Object.keys($this.managedFields);
		},

        isIsolated: function(){
            // true - если все вложенные запросы не используют поля из запросов выше текущего
		    var contexts = {};
		    $this.visitInternalViews(function(view){
		        if (view.getJsb().$name == $this.getJsb().$name) {
                    contexts[view.getContext()] = view;
                }
		    });

		    var isolated = true;
		    for (var context in contexts) {
                contexts[context].walkLinkedFields(function(linkedField, linkedContext){
                    isolated = !!contexts[linkedContext] && isolated;
                });
                if (!isolated) break;
		    }
            return isolated;
		},

		hasLinkedFields: function(){
		    return Object.keys($this.linkedForeignFields).length > 0;
		},

        walkLinkedFields: function(callback /**(field, context)*/) {
		    for(var i in $this.linkedForeignFields) if($this.linkedForeignFields.hasOwnProperty(i)) {
		        var field = $this.linkedForeignFields[i];
		        callback(field.$field, field.$context);
		    }
		},

        getField: function(field) {
            var desc = $this.getOriginalField(field);
            return desc;
		},

        getOriginalField: function(field) {
            var desc = $this.managedFields[field];
            if (desc && !desc.context) {
                desc.context = $this.name;
            }
            return desc;
		},

		isProviderWrapper: function(){
		    if (!$this.query.$filter
		            && !$this.query.$groupBy
                    && !$this.query.$sort
                    && !$this.query.$limit
                    && !$this.query.$offset
                    && $this.getSourceView() instanceof DataProviderView
                ) {
                return true;
            }
		},

//        getFieldLinkedViews: function(field) {
//            return $this.linkedForeignFields[field];
//		},

		linkForeignField: function(foreignField, foreignContext) {
             if (foreignContext == $this.query.$context) {
                throw new Error('Internal error: invalid foreign context');
		    }
		    var id = foreignContext +  '.' + foreignField;
		    $this.linkedForeignFields[id] = {
		        $field: foreignField,
		        $context: foreignContext
		    };
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