{
	$name: 'DataCube.Formatter.EditMenuTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager', 
	           'JSB.Widgets.Button',
	           'css:Formatter.EditMenuTool.css'],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'formatterEditMenuTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: false,
					hideInterval: 0,
					hideByEsc: false,
					cssClass: 'formatterEditMenuToolWrapper'
				}
			});
		},

		$constructor: function(opts){
			$base(opts);

			this.addClass('formatterEditMenuTool');

			$this.btnEdit = new Button({
				cssClass: 'roundButton btn10 btnEdit',
				tooltip: 'Редактировать',
				onClick: function(evt){
					$this.close();
					$this.data.callback.call($this, 'edit');
				}
			});
			$this.append($this.btnEdit);

			$this.btnDelete = new Button({
				cssClass: 'roundButton btn10 btnDelete',
				tooltip: 'Удалить',
				onClick: function(evt){
					$this.close();
					$this.data.callback.call($this, 'delete');
				}
			});
			$this.append($this.btnDelete);

			$this.getElement().on({
				mousemove: function(){
					JSB.cancelDefer('DataCube.Formatter.overItemEvt');
					JSB.cancelDefer('DataCube.Formatter.outItemEvt');
				},
				mouseover: function(){
					JSB.cancelDefer('DataCube.Formatter.overItemEvt');
					JSB.cancelDefer('DataCube.Formatter.outItemEvt');
				},
				mouseout: function(){
					JSB.defer(function(){
						$this.close();
					}, 300, 'DataCube.Formatter.outItemEvt');
				}
			});
		},


		update: function(){
			$this.btnEdit.enable(this.data.data.dataType !== 'string');
		}
	}
}