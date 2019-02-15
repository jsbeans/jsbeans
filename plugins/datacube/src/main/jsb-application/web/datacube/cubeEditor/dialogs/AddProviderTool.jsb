{
	$name: 'DataCube.Dialogs.AddProviderTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager',
	           'DataCube.FieldList',
               'JSB.Widgets.Button',
	           'css:AddProviderTool.css'],

	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'addProviderTool',
				jso: self,
				wrapperOpts: {
					exclusive: 'addProviderTool',
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'addProviderToolWrapper'
				}
			});
		},

		$constructor: function(opts){
			$base(opts);
			this.addClass('addProviderTool');

			this.append('<header>Поля таблицы базы данных</header>');

			this.fields = new FieldList();
			this.append(this.fields);
			
			var btnBar = $this.$('<div class="buttonBar"></div>');
			this.append(btnBar);

			var cancelBtn = new Button({
			    caption: 'Отмена',
			    cssClass: 'textButton btnCancel roundButton btn16',
				tooltip: 'Отмена',
			    onClick: function(){
			        $this.close();
			    }
			});
			btnBar.append(cancelBtn.getElement());

			var okBtn = new Button({
			    caption: 'Добавить',
			    cssClass: 'textButton btnOk roundButton btn16',
				tooltip: 'Добавить',
			    onClick: function(){
                    $this.data.callback.call($this, $this.fields.getChecked());

			        $this.close()
			    }
			});
			btnBar.append(okBtn.getElement());
        },

        update: function(){
            this.fields.getElement().loader();
            this.getData('tableEntry').server().extractFields(true, function(fields, fail){
                $this.fields.getElement().loader('hide');

                if(fail){
                    return;
                }

                $this.fields.setFields(fields);
            });
        }
    }
}