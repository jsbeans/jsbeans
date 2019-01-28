{
	$name: 'DataCube.Model.SqlTable',
	$parent: 'DataCube.Model.DatabaseTable',

    $scheme: {
        useComments: {
            render: 'switch',
            name: 'Использовать комментарии в качестве имён столбцов',
            optional: true,
            items: {
                commentField: {
                    render: 'select',
                    name: 'Поле комментария',
                    loadOptions: function(callback){
                        this.server().getCommentFields(function(res, fail){
                            if(fail){
                                // todo: error
                                return;
                            }

                            callback.call(this, res);
                        });
                    }
                }
            }
        }
    },

	view: false,
	
	isView: function(){
		return this.view;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.Store.Sql.JDBC'],
		
		commentDesc: {
		    field: '',
		    hasComment: false,
		    isUseComment: false,
		    isObject: false
		},
		descriptor: null,
	
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.SqlTableNode',
				create: false,
				move: false,
				remove: false,
				share: false,
				rename: false
			});

			JDBC.loadDrivers(true);
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			
			if(opts){
			    this.updateDescriptor(opts);
			} else {
				this.descriptor = this.property('descriptor');
				this.commentDesc = this.property('commentDesc') || this.commentDesc;
				this.missing = this.property('missing') || false;
				this.view = this.descriptor.isView || false;
			}
		},

		createQuerySelect: function(useContext){
            var fields = this.extractFields(),
                context = this.getFullId(),
                select = {};

            for(var i in fields){
                var fieldName = i;

                if(this.commentDesc.isUseComment){
                    if(this.commentDesc.isObject){
                        fieldName = fields[i].comment[this.commentDesc.field];
                    } else { // string
                        fieldName = fields[i].comment;
                    }
                }

                if(useContext){
                    select[fieldName] = {
                        $context: context,
                        $field: i
                    };
                } else {
                    select[fieldName] = {
                        $field: i
                    };
                }
            }

            return select;
		},

		extractFields: function(opts){
			var columns = this.getDescriptor().columns,
			    fields = {};

            for(var i in columns){
                var nativeType = columns[i].datatypeName;

                fields[i] = {
                    comment: columns[i].comment,
                    name: i,
                    nativeType: nativeType,
                    type: JDBC.toJsonType(nativeType)
                }
            }

			return fields;
		},

		getCommentFields: function(){
		    if(this.commentDesc.hasComment){
		        if(this.commentDesc.isObject){
		            var columns = this.getDescriptor().columns;

                    for(var i in columns){
                        return Object.keys(columns[i].comment);
                    }
		        } else {
		            return ['Поле комментария'];
		        }
		    } else {
		        return [];
		    }
		},

		getDescriptor: function(){
			return this.descriptor;
		},

		getTableFullName:function(){
		    var tableDescriptor = this.getDescriptor();

		    return tableDescriptor.schema
		            ? '"' + tableDescriptor.schema + '"."' + tableDescriptor.name + '"'
		            : '"' + tableDescriptor.name + '"';
        },

		onChangeSettings: function(){
		    var ctx = this.getSettingsContext();

		    this.commentDesc.field = ctx.find('commentField').value();
		    this.commentDesc.isUseComment = ctx.find('useComments').checked();

		    this.property('commentDesc', this.commentDesc);
		},

		updateDescriptor: function(desc){
			if(!desc){  // || JSB.isEqual(desc, this.descriptor)
				return;
			}

			var commentDesc;

			for(var i in desc.columns){
			    if(!commentDesc){
			        commentDesc = this.commentDesc;

			        if(desc.columns[i].comment === 'null'){
			            commentDesc.hasComment = false;
			        } else {
                        var comObject;

                        try{
                            comObject = JSON.parse(desc.columns[i].comment);
                        } catch(ex){}

                        if(comObject){
                            commentDesc.isObject = true;
                        } else {
                            commentDesc.isObject = false;
                        }

                        commentDesc.hasComment = true;
			        }

			        this.commentDesc = commentDesc;
			    }

			    if(commentDesc.hasComment){
			        if(commentDesc.isObject){
			            try {
			                desc.columns[i].comment = JSON.parse(desc.columns[i].comment);
			            } catch(ex){
			                JSB.getLogger().error('Error while parsing comment for "' + i + '" field in table ' + desc.name);
			            }
			        }
			    } else {
			        desc.columns[i].comment = undefined;
			    }
			}

			this.property('commentDesc', this.commentDesc);
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.view = this.descriptor.isView || false;
			this.setName(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		}
	}
}