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
        iconSize: {
        	render: 'item',
        	name: 'Размер пиктограммы',
        	valueType: 'number',
        	require: true,
            value: 100
        },
        title: {
        	render: 'group',
        	name: 'Отображать название элемента',
        	optional: 'checked',
        	items: {
        		titlePosition: {
        			render: 'item',
        			name: 'Расположение',
        			editor: 'JSB.Controls.Positioner',
                    editorOpts: {
                        positions: [
                            [ { key: 'topleft', dummy:true, color:'#555' }, {key: 'top', name: 'Сверху'}, { key: 'topright', dummy:true, color:'#555'}],
                            [ { key: 'left', name: 'Слева' }, {key: 'center', dummy:true, color:'#55f'}, { key: 'right', name: 'Справа'}],
                            [ { key: 'bottomleft', dummy:true, color:'#555' }, {key: 'bottom', name: 'Снизу'}, { key: 'bottomright', dummy:true, color:'#555'}]
                        ]
                    },
                    value: 'right'
        		}
        	}
        }
	},
	$client: {
		$require: ['JSB.Utils.Formatter',
		           'css:WorkspaceItem.css'],
		widgets: [],
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('workspaceItem');
			
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
			
/*
            this.fetch(dataSource, {batchSize: 1}, function(data, fail){
            	if(fail){
            		return;
            	}
                dataSource.next();

                $this.draw(series);
            });
*/            
		},
		
		draw: function(series){
			var seriesSel = d3.select(this.getElement().get(0)).selectAll('div.serie');
			
			var seriesSelData = seriesSel.data(series);

			// remove old
			seriesSelData.exit()
				.remove();

			// append new
			seriesSelData.enter()
				.append('div')
					.classed('serie', true)
					.each(function(d){
						var opts = {
							color: d.colSelector.value() || '#637e90',
							strokeWidth: d.colWidth || 4,
							trailColor: d.trailColor || '#dadada',
							trailWidth: d.trailWidth || 2
						};
						d3.select(this).attr('style', d.css);
						//d3.select(this).attr('type', d.type);
						var min = parseFloat(d.minSelector.value() || 0);
						var max = parseFloat(d.maxSelector.value() || 0);
						var val = parseFloat(d.valSelector.value() || 0);

						var progress = 0;
						if(max - min > 0 && val > min){
							progress = (val - min) * 100 / (max - min);
						}
						
						d3.select(this)
							.append('div')
								.classed('trail', true)
								.style('background-color', opts.trailColor)
								.append('div')
									.classed('progress', true)
									.style('background-color', opts.color)
									.style('width', progress + '%');
						
						if(d.showValues){
                            var valStr = '' + val,
                                format = d.valFormat.value();

                            if(JSB.isNumber(val) && format){
                                valStr = Formatter.format(format, {y: val});
                            }
    						d3.select(this)
								.append('div')
									.classed('progressbar-text', true)
									.attr('style', d.textCss)
									.text(valStr);
                        }
					});
			
			// update existed
			seriesSelData.each(function(d){
				var opts = {
					color: d.colSelector.value() || '#3a3a3a',
					strokeWidth: d.colWidth || 4,
					trailColor: d.trailColor || '#f4f4f4',
					trailWidth: d.trailWidth || 2
				};
				d3.select(this).attr('style', d.css);
				var min = parseFloat(d.minSelector.value() || 0);
				var max = parseFloat(d.maxSelector.value() || 0);
				var val = parseFloat(d.valSelector.value() || 0);
				var progress = 0;
				if(max - min > 0 && val > 0){
					progress = (val - min) * 100 / (max - min);
				}
				d3.select(this).selectAll('.trail')
					.style('background-color', opts.trailColor)
					.selectAll('.progress')
						.style('background-color', opts.color)
						.style('width', progress + '%');
					
				if(d.showValues){
                    var format = d.valFormat.value();
                    if(JSB.isNumber(val) && format){
                        val = Formatter.format(format, {y: val});
                    }
                    
                    d3.select(this).select('.progressbar-text')
                    	.attr('style', d.textCss)
                    	.text('' + val);
				}
			});

			// sort
			seriesSelData.order();
		}
	}
}