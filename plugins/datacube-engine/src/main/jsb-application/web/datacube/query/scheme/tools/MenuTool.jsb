{
	$name: 'DataCube.Query.MenuTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager',
	           'JSB.Controls.Button',
	           'css:MenuTool.css'],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'queryMenuTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: false,
					hideInterval: 0,
					hideByEsc: false,
					cssClass: 'menuToolWrapper'
				}
			});
		},

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('queryMenuTool');

			this.btnEdit = new Button({
				cssClass: 'btnEdit',
				icon: true,
				tooltip: 'Редактировать',
				onClick: function(evt){
				    evt.stopPropagation();

					$this.close();
					$this.data.callback.call($this, 'edit');
				}
			});
			this.append(this.btnEdit);

			this.btnDelete = new Button({
				cssClass: 'btnDelete',
				icon: true,
				tooltip: 'Удалить',
				onClick: function(evt){
				    evt.stopPropagation();

					$this.close();
					$this.data.callback.call($this, 'delete');
				}
			});
			this.append(this.btnDelete);

            this.getElement().hover(function(){
                JSB.cancelDefer('DataCube.Query.hideMenu' + $this.getElementId());
            }, function(){
                JSB.defer(function(){
                    $this.data.data.controller.hideMenu();
                }, 300, 'DataCube.Query.hideMenu' + $this.getElementId());
            });
		},

		getElementId: function(){
		    return this.data.data.elementId;
		},

		update: function(){
		    this.btnDelete.classed('hidden', !this.data.data.removable);
		    this.btnEdit.classed('hidden', !this.data.data.replaceable);
		}
	}
}