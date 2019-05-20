{
	$name: 'DataCube.Widgets.WorkspaceItem',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Элемент проекта',
		description: '',
		category: 'Компоненты',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZGF0YS1uYW1lPSJMYXllciAxIiBpZD0iTGF5ZXJfMSIgdmlld0JveD0iMCAwIDUwOC4zMyA1MDguMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMzYWFmODU7ZmlsbC1ydWxlOmV2ZW5vZGQ7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZS8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDg1LDI5LjcyYzExLjQ1LDE1LjEzLDE2LjYxLDQwLjIxLDE5LjE1LDcwLjcsMy4zNiw0NS41LDQuNzEsMTAwLjEsNiwxNTYuNTItMS42Nyw1Ny40Ny0yLjM1LDExNS40My02LDE1Ni41Mi0yLjg4LDMxLjU0LTksNTIuNjYtMTkuMjIsNjUuNDctMTMsMTIuNzktMzcuOTQsMjMuNTktNzMuNSwyNi4xNS00My4yNSwzLjY5LTk2LjYxLDMuNjUtMTU1LjQ4LDUuMS02NS40NC0xLjEyLTEwOS44Mi0uNjQtMTU2LjM4LTUuMDgtMzYuMzItMi41Mi02MC4wOC0xMy4xOS03NC43LTI2LjA3LTEwLjgzLTE0LjU0LTE0LTMwLTE3LTY2LjI0LTMuNzUtNDEuODUtNC41OC05OC41Ni02LTE1NS41NEM0LDIwMC41Nyw0LjEzLDE0My40NCw3LjksMTAwLjc0LDEwLjQzLDY3LjA1LDE0LjQyLDQ0LjQsMjQuNjUsMzAsMzksMTcuNzcsNjMuNDgsMTEuNjksMTAwLDguNjljNTAtNS44NSwxMDIuMDYtNywxNTUuODgtNi44Nyw1NS4zOS4wOSwxMDguNTYsMS42NywxNTYsNi4zNCwzMiwyLjU2LDU4LjQ4LDguMDcsNzMuMDcsMjEuNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS44MyAtMS44MikiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zOTguMzYsMjU3LjQ2QTI2LjIxLDI2LjIxLDAsMCwwLDM2NS4xNSwyNDFsLTI3LjgzLDkuMzctMTguODYtNTYsMjcuMS05LjEyYTI2LjIxLDI2LjIxLDAsMSwwLTE2LjczLTQ5LjY5bC0yNy4xLDkuMTItOS4xMy0yNy4xMkEyNi4yMSwyNi4yMSwwLDAsMCwyNTkuNCwxMDFoMGEyNi4yMSwyNi4yMSwwLDAsMC0xNi40OCwzMy4yMUwyNTIsMTYxLjM0LDE5NC44MywxODAuNmwtOS0yNi43OWEyNi4yMSwyNi4yMSwwLDAsMC00OS42OSwxNi43M2w5LDI2Ljc5LTI3LjI4LDkuMThhMjYuMjEsMjYuMjEsMCwwLDAtMTYuNDgsMzMuMjFoMGEyNi4yMSwyNi4yMSwwLDAsMCwzMy4yMSwxNi40OEwxNjEuODYsMjQ3bDE4Ljg2LDU2TDE1NC4xNywzMTJhMjYuMjEsMjYuMjEsMCwxLDAsMTYuNzIsNDkuNjlsMjYuNTUtOC45NCw5LjY4LDI4Ljc3YTI2LjIxLDI2LjIxLDAsMCwwLDQ5LjY5LTE2LjczTDI0Ny4xNCwzMzZsNTcuMjItMTkuMjYsOS41NywyOC40NGEyNi4yMSwyNi4yMSwwLDEsMCw0OS42OS0xNi43MkwzNTQsMzAwbDI3LjgzLTkuMzdBMjYuMjEsMjYuMjEsMCwwLDAsMzk4LjM2LDI1Ny40NlpNMjMwLjQxLDI4Ni4zM2wtMTguODYtNTZMMjY4Ljc3LDIxMWwxOC44Niw1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjgzIC0xLjgyKSIvPjwvc3ZnPg==`
	},
	$scheme: {
        dataSource: {
            render: 'sourceBinding',
            name: 'Источник данных'
        },
        
        workspaceId: {
        	render: 'dataBinding',
            name: 'Идентификатор проекта',
            linkTo: 'dataSource',
            require: true,
        },
        entryId: {
        	render: 'dataBinding',
            name: 'Идентификатор элемента',
            linkTo: 'dataSource',
            require: true,
        },
        
        title: {
        	render: 'group',
        	name: 'Название элемента',
        	items: {
        		
        		titleCss: {
                    render: 'switch',
                    name: 'Использовать CSS-стиль названия',
                    items: {
                        cssValue: {
                            render: 'item',
                            name: 'CSS-стиль',
                            editor: 'JSB.Widgets.MultiEditor',
                            editorOpts: {
                                valueType: 'org.jsbeans.types.Css'
                            },
                            value: `/* Заполните объект CSS значениями */
{
    font-family: 'arial';
}`
                        }
                    }

                }
        	}
        },
        
        thumb: {
        	render: 'group',
        	name: 'Пиктограмма',
        	items: {
        		iconSize: {
                	render: 'item',
                	name: 'Размер пиктограммы',
                	valueType: 'number',
                	require: true,
                    value: 50
                },
                iconPosition: {
        			render: 'item',
        			name: 'Расположение',
        			editor: 'JSB.Controls.Positioner',
                    editorOpts: {
                        positions: [
                            [ { key: 'topleft', dummy:true }, {key: 'top', name: 'Сверху'}, { key: 'topright', dummy:true }],
                            [ { key: 'left', name: 'Слева' }, {key: 'center', dummy:true, color:'#a5a4a4'}, { key: 'right', name: 'Справа'}],
                            [ { key: 'bottomleft', dummy:true }, {key: 'bottom', name: 'Снизу'}, { key: 'bottomright', dummy:true }]
                        ]
                    },
                    value: 'right'
        		},
                iconCss: {
                    render: 'switch',
                    name: 'Использовать CSS-стиль пиктограммы',
                    items: {
                        cssValue: {
                            render: 'item',
                            name: 'CSS-стиль',
                            editor: 'JSB.Widgets.MultiEditor',
                            editorOpts: {
                                valueType: 'org.jsbeans.types.Css'
                            },
                            value: `/* Заполните объект CSS значениями */
{
    border-radius: '4px';
}`
                        }
                    }

                }
        	}
        },

	},
	$client: {
		$require: ['JSB.Widgets.RendererRepository',
		           'css:WorkspaceItem.css'],
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('workspaceItem');
/*			
			this.container = $this.$('<div class="container"></div>');
			this.append(this.container);
			
			this.thumb = this.$('<img class="thumb" />');
			this.container.append(this.thumb);
			
			this.title = this.$('<div class="title"></div>');
			this.container.append(this.title);
*/			
			$this.setInitialized();
		},

		refresh: function(opts){
		    this.onRefresh(opts);
		},

		onRefresh: function(opts){
		    var dataSource = this.getContext().find('dataSource');
            if(!dataSource.hasBinding || !dataSource.hasBinding()){
                return;
            }

			$base();
			
			function prepareCss(cssText){
				if(cssText.indexOf('{') >= 0){
					var m = cssText.match(/\{([^\}]*)\}/i);
					if(m && m.length > 1){
						cssText = m[1];
					}
				}
				return cssText.replace(/\r/g,'').replace(/\n/g,'').trim();
			}
			
			var options = {
				wIdSel: this.getContext().find('workspaceId'),
				eIdSel: this.getContext().find('entryId'),
				size: this.getContext().find('iconSize').value(),
				iconPosition: this.getContext().find('iconPosition').value(),
				titleCss: this.getContext().find('titleCss').checked() ? prepareCss(this.getContext().find('titleCss cssValue').value()) : null,
				iconCss: this.getContext().find('iconCss').checked() ? prepareCss(this.getContext().find('iconCss cssValue').value()) : null
			};

            this.fetch(dataSource, {batchSize: 1}, function(data, fail){
            	if(fail){
            		return;
            	}
                dataSource.next();

                var wId = options.wIdSel.value();
    			var eId = options.eIdSel.value();
    			
    			$this.getElement().attr('iconposition', options.iconPosition);
    			$this.server().getEntryInfo(wId, eId, function(entryInfo, fail){
    				$this.drawEntry(entryInfo, options)
    			});
            });
            
		},
		
		drawEntry: function(entryInfo, options){
			if(!entryInfo){
				// draw missing entry
				
				return;
			}
			
			var expose = entryInfo.entry.getJsb().getDescriptor().$expose;
			var thumb = entryInfo.thumb;
			var desc = entryInfo.description || expose.description;
			var title = entryInfo.entry.getName();
			
			if(!this.renderer){
				$this.getElement().empty();
				this.renderer = RendererRepository.createRendererFor(entryInfo.entry, {});
				this.append(this.renderer);
			}
			
			this.renderer.find('> .icon').css({
				width: options.size,
				height: options.size,
				'min-width': options.size,
				'min-height': options.size
			});
			this.renderer.find('> .title').attr('style', options.titleCss);
			
			if(thumb){
				this.renderer.find('> .icon').css('background-image', 'url(' + thumb + ')');
			}
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		getEntryInfo: function(wid, eid){
			var info = {
				entry: WorkspaceController.getEntry(wid, eid),
				description: null,
				thumb: null
			};
			if(JSB.isInstanceOf(info.entry, 'DataCube.Model.Dashboard')){
				var ctx = info.entry.getSettingsContext();
				info.description = ctx.find('publication description').value();
				info.thumb = ctx.find('publication logo').value();
			} else if(JSB.isInstanceOf(info.entry, 'DataCube.Model.Widget')){
				var ctx = info.entry.getContext();
				info.description = ctx.find('common description').value();
				info.thumb = ctx.find('common icon').value();
			}
			
			return info;
		}
	}
}