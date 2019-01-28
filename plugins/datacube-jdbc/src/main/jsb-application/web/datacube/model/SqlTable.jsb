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
		
		commentField: {
		    field: '',
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
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.setName(this.descriptor.schema + '.' + this.descriptor.name);
				this.view = this.descriptor.isView || false;
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
				this.commentField = this.property('commentField') || this.commentField;
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

                if(this.commentField.isUseComment){
                    if(this.commentField.isObject){
                        fieldName = fields[i].comment[this.commentField.field];
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
                var nativeType = columns[i].datatypeName,
                    comment = undefined;

                if(columns[i].comment){
                    try{
                        comment = JSON.parse(columns[i].comment);
                    } catch(ex){}

                    if(!comment){
                        comment = columns[i].comment;
                    }
                }

                fields[i] = {
                    comment: comment,
                    name: i,
                    nativeType: nativeType,
                    type: JDBC.toJsonType(nativeType)
                }
            }

			return fields;
		},

		getCommentFields: function(){
		    var comment = this._parseComment();

		    if(comment.type === 'object'){
		        return comment.fields;
		    }

		    if(comment.type === 'string'){
		        return ['Поле комментария'];
		    }

		    return [];
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

		    this.commentField = {
                field: ctx.find('commentField').value(),
                isUseComment: ctx.find('useComments').checked(),
                isObject: this._parseComment().type === 'object'
		    };

		    this.property('commentField', this.commentField);
		},

		updateDescriptor: function(desc){
			if(!desc || JSB.isEqual(desc, this.descriptor)){
				return;
			}
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.view = this.descriptor.isView || false;
			this.setName(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		},

		_parseComment: function(){
		    var columns = this.getDescriptor().columns,
		        colNames = Object.keys(columns);

            if(columns[colNames[0]].comment){
                var comObject;

                try{
                    comObject = JSON.parse(columns[colNames[0]].comment);
                } catch(ex){}

                if(comObject){
                    return {
                        type: 'object',
                        fields: Object.keys(comObject)
                    };
                } else {
                    return {
                        type: 'string'
                    };
                }
            } else {
                return {
                    type: 'noComment'
                };
            }
		}
	}
}