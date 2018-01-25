{
	$name: 'DataCube.Query.Views.JoinView',
	$parent: 'DataCube.Query.Views.MultiView',

	$server: {
		$constructor: function(name, leftView){
		    $base(name);
		    this.leftView = leftView;
		},

		setRightView: function(rightView) {
		    this.rightView = rightView;
		},

        listViews: function() {
            return [this.leftView, this.rightView];
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
	}
}