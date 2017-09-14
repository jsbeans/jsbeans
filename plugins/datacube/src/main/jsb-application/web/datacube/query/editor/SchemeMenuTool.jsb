{
	$name: 'DataCube.Query.SchemeMenuTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager', 'JSB.Widgets.Button'],
	$client: {
		
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'schemeMenuTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: false,
					hideInterval: 0,
					hideByEsc: false,
					cssClass: 'schemeToolWrapper'
				}
			});
		},
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('SchemeMenuTool.css');
			this.addClass('schemeMenuTool');
			
			$this.btnCreate = new Button({
				cssClass: 'roundButton btn10 btnCreate',
				tooltip: 'Добавить',
				onClick: function(){
				}
			});
			$this.append($this.btnCreate);
			
			$this.btnEdit = new Button({
				cssClass: 'roundButton btn10 btnEdit',
				tooltip: 'Редактировать',
				onClick: function(){
				}
			});
			$this.append($this.btnEdit);
			
			$this.btnDelete = new Button({
				cssClass: 'roundButton btn10 btnDelete',
				tooltip: 'Удалить',
				onClick: function(){
				}
			});
			$this.append($this.btnDelete);

			$this.getElement().on({
				mousemove: function(){
					JSB.cancelDefer('DataCube.Query.SchemeEditor.over');
					JSB.cancelDefer('DataCube.Query.SchemeEditor.out');
				},
				mouseover: function(){
					JSB.cancelDefer('DataCube.Query.SchemeEditor.over');
					JSB.cancelDefer('DataCube.Query.SchemeEditor.out');
				}
			});
		},
		
		
		update: function(){
		}
		
		
	}
}