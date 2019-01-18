{
	$name: 'DataCube.Dialogs.JoinSettingsTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager',
               'Unimap.Controller',
               'Unimap.Selector',
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
					exclusive: true,
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'datacubeToolWrapper'
				}
			});
		},

		$scheme: {
            joinType: {
                render: 'select',
                name: 'Тип пересечения',
                items: {
                    leftInner: {
                        name: 'left inner'
                    },
                    leftOuter: {
                        name: 'left outer'
                    },
                    rightInner: {
                        name: 'right inner'
                    },
                    rightOuter: {
                        name: 'right outer'
                    },
                    full: {
                        name: 'full'
                    }
                }
            },
            filter: {
                render: 'joinFilter',
                name: 'Условие пересечения',
                multiple: {
                    createDefault: true
                }
            }
		},

		$constructor: function(opts){
			$base(opts);
			this.addClass('joinSettingsTool');

			this.caption = this.$('<header>Настройки пересечения</header>');
			this.append(this.caption);

			var cancelBtn = new Button({
			    caption: 'Отмена',
			    cssClass: 'cancelBtn',
				hasIcon: false,
				hasCaption: true,
				tooltip: 'Отмена',
			    onclick: function(){
			        $this.close();
			    }
			});
			this.append(cancelBtn.getElement());

			var okBtn = new Button({
			    caption: 'Сохранить',
			    cssClass: 'okBtn',
				hasIcon: false,
				hasCaption: true,
				tooltip: 'Сохранить',
			    onclick: function(){
			        var values = new Selector({
                        values: JSB.clone($this.controller.getValues())
                    });

                    var filters = values.find('filter').values(),
                        queryOpts = {
                            $joinType: values.find('joinType').value(),
                            $filter: {
                                $and: []
                            }
                        };

                    for(var i = 0; i < filters.length; i++){
                        var obj = {};

                        obj[filters[i]['comparison']] = [filters[i]['firstField'], filters[i]['secondField']];

                        queryOpts.$filter.$and.push(obj);
                    }

			        $this.data.callback.call($this, queryOpts);

			        $this.close()
			    }
			});
			this.append(okBtn.getElement());
        },

        update: function(){
            if(this.controller){
                this.controller.destroy();
            }

            this.controller = new Controller({
                data: this.data.data,
                scheme: this.$scheme,
                values: {},
                bootstrap: 'Datacube.Unimap.Bootstrap'
            });

            this.caption.after(this.controller.getElement());
        }
    }
}