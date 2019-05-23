/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Dialogs.JoinSettingsTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager',
               'DataCube.Query.SchemeController',
               'JSB.Controls.Button',
	           'css:JoinSettingsTool.css'],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'joinSettingsTool',
				jso: self,
				wrapperOpts: {
					exclusive: 'joinSettingsTool',
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'datacubeToolWrapper'
				}
			});
		},

		$constructor: function(opts){
			$base(opts);
			this.addClass('joinSettingsTool');

			var cancelBtn = new Button({
			    caption: 'Отмена',
			    cssClass: 'textButton cancelBtn',
				tooltip: 'Отмена',
			    onClick: function(){
			        $this.close();
			    }
			});
			this.append(cancelBtn.getElement());

			var okBtn = new Button({
			    caption: 'Сохранить',
			    cssClass: 'textButton okBtn',
				tooltip: 'Сохранить',
			    onClick: function(){
                    $this.data.callback.call($this, $this.controller.getValues());

			        $this.close()
			    }
			});
			this.append(okBtn.getElement());
        },

        update: function(){
            var sources = this.data.data.sources;

            if(this.controller){
                this.controller.destroy();
            }

            this.controller = new SchemeController({
                data: this.data.data,
                queryOpts: {
                    allowChangeSource: false,
                    allowChild: []
                },
                values: {
                    $join: {
                        $left: sources[0] && sources[0].getFullId(),
                        $right: sources[1] && sources[1].getFullId()
                    }
                }
            });

            this.prepend(this.controller);
        }
    }
}