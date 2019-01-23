{
	$name: 'DataCube.Query.Renders.Source',
	$parent: 'DataCube.Query.Renders.Basic',

	$client: {
	    $require: ['JSB.Widgets.RendererRepository'],

	    createSource: function(value, callback){
	        function click(evt){
	            //
	        }

	        switch(typeof value){
	            case 'object':  // query
	                break;
                case 'string':  // slice id
                    this.server().getEntry(value, function(res, fail){
                        var source = RendererRepository.createRendererFor(res);
                        source.getElement().click(click);

                        callback.call($this, source);
                    });
                    break;
                default:
                    var source = this.$('<div>Источник не задан</div>');
                    source.click(click);
                    callback.call(this, source);
	        }
	    }
    },

    $server: {
        $require: ['JSB.Workspace.WorkspaceController'],

        getEntry: function(id){
	        var idArr = id.split('/');

	        return WorkspaceController.getWorkspace(idArr[0]).entry(idArr[1]);
        }
    }
}