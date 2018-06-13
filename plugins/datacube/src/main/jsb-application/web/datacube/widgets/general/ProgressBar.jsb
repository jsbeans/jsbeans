{
	$name: 'DataCube.Widgets.ProgressBar',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'ProgressBar',
		description: '',
		category: 'Основные',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMC41Ig0KICAgaGVpZ2h0PSIxMDAuNXB4Ig0KICAgaWQ9IkNhcGFfMSINCiAgIHZlcnNpb249IjEuMSINCiAgIHZpZXdCb3g9IjAgMCAxMDAgMTAwLjUiDQogICB3aWR0aD0iMTAwcHgiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9wcm9ncmVzc18yMTY3MDAuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhMTMiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMxMSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXc5Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjMuMzIwOTM5MyINCiAgICAgaW5rc2NhcGU6Y3g9Ii0zMS4yMjMwMzciDQogICAgIGlua3NjYXBlOmN5PSI1NC45OTE3NjQiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkNhcGFfMSIgLz48cGF0aA0KICAgICBkPSJtIDkwLDI1LjI1IC04MCwwIGMgLTUuNSwwIC0xMCw0LjUgLTEwLDEwIGwgMCwzMCBjIDAsNS41IDQuNSwxMCAxMCwxMCBsIDgwLDAgYyA1LjUsMCAxMCwtNC41IDEwLC0xMCBsIDAsLTMwIGMgMCwtNS41IC00LjUsLTEwIC0xMCwtMTAgeiBtIDAsNDAgLTgwLDAgMCwtMzAgODAsMCAwLDMwIHogbSAtMzAsLTI0LjkgLTIwLDAgMCwxOS44IDIwLDAgMCwtMTkuOCB6IG0gLTI1LDAgLTIwLDAgMCwxOS44IDIwLDAgMCwtMTkuOCB6Ig0KICAgICBpZD0icGF0aDciDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsOiM1NTIyMDA7ZmlsbC1vcGFjaXR5OjEiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTQ0Ig0KICAgICB3aWR0aD0iMjAuMDI0NDU2Ig0KICAgICBoZWlnaHQ9IjE5LjcyMTA1NCINCiAgICAgeD0iMTQuOTgwNzAxIg0KICAgICB5PSI0MC4zNTEzNTMiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTQ0LTAiDQogICAgIHdpZHRoPSIyMC4wMjQ0NTYiDQogICAgIGhlaWdodD0iMTkuNzIxMDU0Ig0KICAgICB4PSIzOS45NzM2MjkiDQogICAgIHk9IjQwLjM1MjQ5MyIgLz48L3N2Zz4=`,
		thumb: `data:image/png;base64,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`
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
		$require: 'JSB.Utils.Formatter',
		widgets: [],
		
		$bootstrap: function(){
			(function(){
				`#include 'progressbar.js'`
			}).call(null);
		},
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('progressBar');
			this.loadCss('ProgressBar.css');
			
			JSB.loadScript('tpl/d3/d3.min.js', function(){
				$this.setInitialized();
			});
		},
		
		refresh: function(opts){
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

            this.fetchBinding(dataSource, {batchSize: 1}, function(){
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
							color: d.colSelector.value() || '#3a3a3a',
							strokeWidth: d.colWidth || 4,
							trailColor: d.trailColor || '#f4f4f4',
							trailWidth: d.trailWidth || 2
						};
						d3.select(this).attr('style', d.css);
						d3.select(this).attr('type', d.type);
						var widget = new ProgressBar[d.type](this, opts);
						var min = parseFloat(d.minSelector.value() || 0);
						var max = parseFloat(d.maxSelector.value() || 0);
						var val = parseFloat(d.valSelector.value() || 0);

						var progress = 0;
						if(max - min > 0 && val > 0){
							progress = (val - min) / (max - min);
						}
						widget.set(0);
						JSB.defer(function(){
							widget.animate(progress, {
								duration: 800,
								easing: 'easeInOut'
							});
						}, 0)
						var valStr = '' + val,
						    format = d.valFormat.value();

						if(JSB.isNumber(val) && format){
							valStr = Formatter.format(format, {y: val});
						}
						widget.setText(valStr);
						d3.select(this).select('.progressbar-text').attr('style', d.textCss);
						
						$this.widgets[d.serieIdx] = {widget: widget, type: d.type};
					});
			
			// update existed
			seriesSelData.each(function(d){
				if(!$this.widgets[d.serieIdx]){
					return;
				}
				var widget = $this.widgets[d.serieIdx].widget;
				var type = $this.widgets[d.serieIdx].type;
				if(type != d.type){
					$this.$(this).empty();
					var opts = {
						color: d.colSelector.value() || '#3a3a3a',
						strokeWidth: d.colWidth || 4,
						trailColor: d.trailColor || '#f4f4f4',
						trailWidth: d.trailWidth || 2
					};
					widget = new ProgressBar[d.type](this, opts);
					$this.widgets[d.serieIdx] = {widget: widget, type: d.type};
					d3.select(this).attr('type', d.type);
				}
				d3.select(this).attr('style', d.css);
				var min = parseFloat(d.minSelector.value() || 0);
				var max = parseFloat(d.maxSelector.value() || 0);
				var val = parseFloat(d.valSelector.value() || 0);
				var progress = 0;
				if(max - min > 0 && val > 0){
					progress = (val - min) / (max - min);
				}
				widget.animate(progress, {
					duration: 800,
					easing: 'easeInOut'
				});

				var format = d.valFormat.value();
				if(JSB.isNumber(val) && format){
					val = Formatter.format(format, {y: val});
				}
				widget.setText('' + val);
				
				d3.select(this).select('svg > path:first-child')
					.attr('stroke', d.trailColor || '#f4f4f4')
					.attr('stroke-width', d.trailWidth || 2);

				d3.select(this).select('svg > path:last-child')
					.attr('stroke', d.colSelector.value() || '#3a3a3a')
					.attr('stroke-width', d.colWidth || 4);
				
				d3.select(this).select('.progressbar-text').attr('style', d.textCss);
			});

			// sort
			seriesSelData.order();
		}
	}
}