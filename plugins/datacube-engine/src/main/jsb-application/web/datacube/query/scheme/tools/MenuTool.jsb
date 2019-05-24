/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

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

			this.btnWrap = new Button({
				cssClass: 'btnWrap',
				icon: true,
				tooltip: 'Обернуть',
				onClick: function(clickEvt){
					$this.close();
					$this.data.callback.call($this, 'wrap', clickEvt);
				}
			});
			this.append(this.btnWrap);

			this.btnEdit = new Button({
				cssClass: 'btnEdit',
				icon: true,
				tooltip: 'Редактировать',
				onClick: function(clickEvt){
					$this.close();
					$this.data.callback.call($this, 'edit', clickEvt);
				}
			});
			this.append(this.btnEdit);

			this.btnDelete = new Button({
				cssClass: 'btnDelete',
				icon: true,
				tooltip: 'Удалить',
				onClick: function(clickEvt){
					$this.close();
					$this.data.callback.call($this, 'delete', clickEvt);
				}
			});
			this.append(this.btnDelete);

            this.getElement().hover(function(){
                JSB.cancelDefer('DataCube.Query.hideMenu' + $this.getElementId());
            }, function(){
                JSB.defer(function(){
                    $this.close();
                }, 300, 'DataCube.Query.hideMenu' + $this.getElementId());
            });
		},

		getElementId: function(){
		    return this.getData('id');
		},

		update: function(){
		    this.btnWrap.classed('hidden', !this.getData('wrap'));
		    this.btnDelete.classed('hidden', !this.getData('remove'));
		    this.btnEdit.classed('hidden', !this.getData('edit'));
		}
	}
}