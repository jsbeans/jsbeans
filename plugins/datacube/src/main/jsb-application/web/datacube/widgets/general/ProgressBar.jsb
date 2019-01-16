{
	$name: 'DataCube.Widgets.ProgressBar',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'ProgressBar',
		description: '',
		category: 'Основные',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMC41Ig0KICAgaGVpZ2h0PSIxMDAuNXB4Ig0KICAgaWQ9IkNhcGFfMSINCiAgIHZlcnNpb249IjEuMSINCiAgIHZpZXdCb3g9IjAgMCAxMDAgMTAwLjUiDQogICB3aWR0aD0iMTAwcHgiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9wcm9ncmVzc18yMTY3MDAuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhMTMiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMxMSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXc5Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjMuMzIwOTM5MyINCiAgICAgaW5rc2NhcGU6Y3g9Ii0zMS4yMjMwMzciDQogICAgIGlua3NjYXBlOmN5PSI1NC45OTE3NjQiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz48cGF0aA0KICAgICBkPSJtIDkwLDI1LjI1IC04MCwwIGMgLTUuNSwwIC0xMCw0LjUgLTEwLDEwIGwgMCwzMCBjIDAsNS41IDQuNSwxMCAxMCwxMCBsIDgwLDAgYyA1LjUsMCAxMCwtNC41IDEwLC0xMCBsIDAsLTMwIGMgMCwtNS41IC00LjUsLTEwIC0xMCwtMTAgeiBtIDAsNDAgLTgwLDAgMCwtMzAgODAsMCAwLDMwIHogbSAtMzAsLTI0LjkgLTIwLDAgMCwxOS44IDIwLDAgMCwtMTkuOCB6IG0gLTI1LDAgLTIwLDAgMCwxOS44IDIwLDAgMCwtMTkuOCB6Ig0KICAgICBpZD0icGF0aDciDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsOiM1NTIyMDA7ZmlsbC1vcGFjaXR5OjEiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTQ0Ig0KICAgICB3aWR0aD0iMjAuMDI0NDU2Ig0KICAgICBoZWlnaHQ9IjE5LjcyMTA1NCINCiAgICAgeD0iMTQuOTgwNzAxIg0KICAgICB5PSI0MC4zNTEzNTMiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTQ0LTAiDQogICAgIHdpZHRoPSIyMC4wMjQ0NTYiDQogICAgIGhlaWdodD0iMTkuNzIxMDU0Ig0KICAgICB4PSIzOS45NzM2MjkiDQogICAgIHk9IjQwLjM1MjQ5MyIgLz48L3N2Zz4=`
	},
	$scheme: {
        dataSource: {
            render: 'sourceBinding',
            name: 'Источник данных'
        },
	    series: {
	        render: 'group',
	        name: 'Серии',
	        multiple: true,
	        items: {
/*	        	
	            type: {
	                render: 'select',
	                name: 'Тип',
	                items: {
	                    Line: {
	                        name: 'Линейный'
	                    },
	                    Circle: {
	                        name: 'Круговой'
	                    },
	                    SemiCircle: {
	                        name: 'Дуговой'
	                    }
	                }
	            },
*/	            
	            min: {
	                render: 'dataBinding',
	                name: 'Минимум',
	                linkTo: 'dataSource',
	                editor: 'input',
	                defaultValue: 0
	            },
	            max: {
	                render: 'dataBinding',
	                name: 'Максимум',
	                linkTo: 'dataSource',
	                editor: 'input',
	                defaultValue: 100
	            },
	            val: {
	                render: 'dataBinding',
	                name: 'Значение',
	                linkTo: 'dataSource',
	                editor: 'input',
	                defaultValue: 50
	            },
	            formatter: {
	                render: 'formatter',
	                name: 'Формат значения',
                    formatterOpts: {
                        basicSettings: {
                            type: 'number',
                            value: 'y'
                        },
                        variables: [
                            {
                                alias: 'Значение',
                                type: 'number',
                                value: 'y'
                            }
                        ]
                    },
                    valueType: 'string',
                    defaultValue: '{y:,.0f}'
	            },
	            showValues: {
	                render: 'item',
	                name: 'Показывать значения',
	                optional: 'checked',
	                editor: 'none'
	            },
	            colColorSelector: {
	                render: 'select',
	                name: 'Цвет',
	                items: {
	                    simpleColor: {
	                        name: 'Единый цвет',
	                        items: {
                                colColor: {
                                    render: 'item',
                                    name: 'Цвет',
                                    editor: 'JSB.Widgets.ColorEditor',
                                    defaultValue: '#eee'
                                }
                            }
	                    },
	                    sourceColor: {
	                        name: 'Цвет из источника',
	                        items: {
                                colColor: {
                                    render: 'dataBinding',
                                    name: 'Цвет',
                                    linkTo: 'dataSource',
                                    defaultValue: '#eee'
                                }
	                        }
	                    }
	                }
	            },
	            colWidth: {
	                render: 'item',
	                name: 'Толщина столбца',
	                defaultValue: 4
	            },
	            trailColor: {
	                render: 'item',
	                name: 'Цвет дорожки',
	                editor: 'JSB.Widgets.ColorEditor',
	                defaultValue: '#eee'
	            },
	            trailWidth: {
	                render: 'item',
	                name: 'Толщина дорожки',
	                defaultValue: 2
	            },
	            css: {
	                render: 'switch',
	                name: 'Использовать CSS стиль',
	                items: {
	                    cssStyle: {
                            render: 'item',
                            name: 'CSS стиль',
                            editor: 'JSB.Widgets.MultiEditor',
                            editorOpts: {
                                valueType: 'org.jsbeans.types.Css'
                            }
	                    }
	                }
	            },
	            textCss: {
	                render: 'switch',
	                name: 'Использовать CSS стиль текста',
	                items: {
	                    cssStyle: {
	                        render: 'item',
	                        name: 'CSS стиль',
                            editor: 'JSB.Widgets.MultiEditor',
                            editorOpts: {
                                valueType: 'org.jsbeans.types.Css'
                            }
	                    }
	                }
	            }
	        }
	    }
	},
	$client: {
		$require: ['JSB.Utils.Formatter',
		           'css:ProgressBar.css'],
		widgets: [],
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('progressBar');
			
			JSB.loadScript('tpl/d3/d3.min.js', function(){
				$this.setInitialized();
			});
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
			
			// construct series descriptors
			function prepareCss(cssText){
				if(cssText.indexOf('{') >= 0){
					var m = cssText.match(/\{([^\}]*)\}/i);
					if(m && m.length > 1){
						cssText = m[1];
					}
				}
				return cssText.replace(/\r/g,'').replace(/\n/g,'').trim();
			}
			
			var gArr = this.getContext().find('series').values();
			var series = [];
			for(var i = 0; i < gArr.length; i++){
				var serieDesc = {
					serieIdx: i,
					type: gArr[i].find('type').value(),
					minSelector: gArr[i].find('min'),
					maxSelector: gArr[i].find('max'),
					valSelector: gArr[i].find('val'),
					colSelector: gArr[i].find('colColor'),
					valFormat: gArr[i].find('formatter'),
					showValues: gArr[i].find('showValues').checked(),
					colWidth: parseFloat(gArr[i].find('colWidth').value()),
					trailColor: gArr[i].find('trailColor').value(),
					trailWidth: parseFloat(gArr[i].find('trailWidth').value()),
					css: '',
					textCss: ''
				};

				if(gArr[i].find('css').checked()){
					serieDesc.css = prepareCss(gArr[i].find('css cssStyle').value());
				}
				if(gArr[i].find('textCss').checked()){
					serieDesc.textCss = prepareCss(gArr[i].find('textCss cssStyle').value());
				}

				series.push(serieDesc);
			}

            this.fetch(dataSource, {batchSize: 1}, function(data, fail){
            	if(fail){
            		return;
            	}
                dataSource.next();

                $this.draw(series);
            });
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
						if(max - min > 0 && val > 0){
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