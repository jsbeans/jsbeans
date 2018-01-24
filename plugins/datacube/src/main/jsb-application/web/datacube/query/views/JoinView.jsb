{
	$name: 'DataCube.Query.Views.JoinView',

	$server: {
		$require: [
//		    'DataCube.Query.Views.ViewsRegistry',
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, leftView){
		    $base(name);
		    this.leftView = leftView;
		},

		setRightView: function(rightView) {
		    this.rightView = rightView;
		},

		getRightView: function() {
		    return this.rightView;
		},

		managedFields: null,

        setField: function(field, desc) {
		    this.managedFields[field] = desc;
		},

        listFields: function() {
            var fields = {};
            var list = this.leftView.listFields();
            for(var i in list) {
                fields[list[i]] = true;
            }
            list = this.rightView.listFields();
            for(var i in list) {
                fields[list[i]] = true;
            }
		    return Object.keys(fields);
		},

		listJoinFields: function(){
            var leftFields = this.leftView.listFields();
            var rightFields = this.rightView.listFields();
		    var list = [];
            for (var r in rightFields) {
                if (leftFields.indexOf(rightFields[r]) != -1) {
                    list.push(rightFields[r]);
                }
            }
		    return list;
		},

        getField: function(name) {
            return this.leftView.getField(name) || this.rightView.getField(name);
		},
	}
}