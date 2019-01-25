{
	$name: 'DataCube.Query.Renders.Source',
	$parent: 'DataCube.Query.Renders.Basic',

	$client: {
	    $require: ['JSB.Widgets.RendererRepository'],

	    createSource: function(value, appendElement, changeCallback){
	        function click(selectedId){
	            $this.showTool(appendElement, selectedId, function(desc){

	                switch(desc.category){
	                    case 'Срезы':
	                        var slice = desc.item.getObject();

                            appendElement.empty().append(RendererRepository.createRendererFor(slice));

                            changeCallback.call($this, 'slice', slice);
	                        break;
	                }
	            });
	        }

	        switch(typeof value){
	            case 'object':  // query
	                break;
                case 'string':  // slice id
                    // todo: use entry from data?
                    this.server().getEntry(value, function(res, fail){
                        var source = RendererRepository.createRendererFor(res);
                        appendElement.append(source);

                        appendElement.click(function(){
                            click(appendElement.children().jsb().getObject().getFullId());
                        });
                    });
                    break;
                default:
                    var source = this.$('<div>Источник не задан</div>');

                    appendElement.click(function(){
                        click();
                    });

                    appendElement.append(source);
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