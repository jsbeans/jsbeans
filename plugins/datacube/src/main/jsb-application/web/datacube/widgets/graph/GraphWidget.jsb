{
	$name: 'DataCube.Widgets.GraphWidget',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Граф',
        description: '',
        category: 'Диаграммы',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjQ3cHgiDQogICBoZWlnaHQ9IjQ3cHgiDQogICB2aWV3Qm94PSIwIDAgNDcgNDciDQogICBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NyA0NzsiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJidXNpbmVzcy1hZmZpbGlhdGUtbmV0d29yay5zdmciPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE1NCI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczUyIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzUwIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjUuMDIxMjc2NiINCiAgICAgaW5rc2NhcGU6Y3g9IjIzLjUiDQogICAgIGlua3NjYXBlOmN5PSIyMy41Ig0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJDYXBhXzEiIC8+PHBhdGgNCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgaWQ9InBhdGg4Ig0KICAgICBkPSJtIDE3LjU2NywxNS45MzggLTIuODU5LC0yLjcwMiBjIDAuMzMzLC0wLjYwNSAwLjUzOSwtMS4yOSAwLjUzOSwtMi4wMjkgMCwtMi4zNDIgLTEuODk3LC00LjIzOSAtNC4yNCwtNC4yMzkgLTIuMzQzLDAgLTQuMjQzLDEuODk2IC00LjI0Myw0LjIzOSAwLDIuMzQzIDEuOSw0LjI0MSA0LjI0Myw0LjI0MSAwLjgyNiwwIDEuNTksLTAuMjQ2IDIuMjQyLC0wLjY1NCBsIDIuODU1LDIuNjk5IGMgMC40MzIsLTAuNTcxIDAuOTE5LC0xLjA5NCAxLjQ2MywtMS41NTUgeiINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBpZD0icGF0aDEwIg0KICAgICBkPSJtIDI5LjY2LDE1LjYgMy43OTksLTYuMzkzIGMgMC4zNzQsMC4xMDcgMC43NjIsMC4xODQgMS4xNjksMC4xODQgMi4zNDcsMCA0LjI0NCwtMS44OTggNC4yNDQsLTQuMjQxIDAsLTIuMzQyIC0xLjg5NywtNC4yMzkgLTQuMjQ0LC00LjIzOSAtMi4zNDMsMCAtNC4yMzksMS44OTYgLTQuMjM5LDQuMjM5IDAsMS4xNjMgMC40NjksMi4yMTQgMS4yMjcsMi45ODEgbCAtMy43ODcsNi4zNzUgYyAwLjY1MSwwLjI5NSAxLjI2NSwwLjY2MyAxLjgzMSwxLjA5NCB6Ig0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwYXRoDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIGlkPSJwYXRoMTIiDQogICAgIGQ9Im0gNDIuNzYyLDIwLjk1MiBjIC0xLjgyNCwwIC0zLjM2OSwxLjE1OSAtMy45NjgsMi43NzUgbCAtNS4yNzgsLTAuNTIxIGMgMCwwLjA0IDAuMDA2LDAuMDc4IDAuMDA2LDAuMTE3IDAsMC42ODggLTAuMDc2LDEuMzYgLTAuMjEzLDIuMDA5IGwgNS4yNzYsMC41MjEgYyAwLjMxOSwyLjAyNCAyLjA2MiwzLjU3NiA0LjE3NywzLjU3NiAyLjM0MiwwIDQuMjM4LC0xLjg5NiA0LjIzOCwtNC4yMzggMCwtMi4zNDEgLTEuODk2LC00LjIzOSAtNC4yMzgsLTQuMjM5IHoiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiIC8+PHBhdGgNCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgaWQ9InBhdGgxNCINCiAgICAgZD0ibSAyOC4xOTcsMzcuNjI0IC0xLjE4LC01LjE1NiBjIC0wLjY2NiwwLjIzMiAtMS4zNTksMC4zOTggLTIuMDgyLDAuNDgxIGwgMS4xODIsNS4xNTcgYyAtMS4zNTUsMC43MDkgLTIuMjksMi4xMSAtMi4yOSwzLjc0NiAwLDIuMzQyIDEuODk2LDQuMjM3IDQuMjQzLDQuMjM3IDIuMzQyLDAgNC4yMzgsLTEuODk2IDQuMjM4LC00LjIzNyAwLjAwMywtMi4yOTkgLTEuODI5LC00LjE2IC00LjExMSwtNC4yMjggeiINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBpZD0icGF0aDE2Ig0KICAgICBkPSJtIDE0LjM1NywyNS4zNyAtNi41NywyLjIwMSBDIDcuMDI5LDI2LjQxMyA1LjcyNCwyNS42NDUgNC4yMzksMjUuNjQ1IDEuODk2LDI1LjY0NSAwLDI3LjU0MiAwLDI5Ljg4NCBjIDAsMi4zNDUgMS44OTYsNC4yNDIgNC4yMzksNC4yNDIgMi4zNDEsMCA0LjI0MiwtMS44OTcgNC4yNDIsLTQuMjQyIDAsLTAuMDk4IC0wLjAyMSwtMC4xODggLTAuMDI5LC0wLjI4NCBsIDYuNTkxLC0yLjIwNyBDIDE0Ljc0NiwyNi43NTIgMTQuNTEsMjYuMDc3IDE0LjM1NywyNS4zNyBaIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxjaXJjbGUNCiAgICAgaWQ9ImNpcmNsZTE4Ig0KICAgICByPSI3LjI3MDk5OTkiDQogICAgIGN5PSIyMy4zMjMiDQogICAgIGN4PSIyMy44MyINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48Zw0KICAgICBpZD0iZzIwIiAvPjxnDQogICAgIGlkPSJnMjIiIC8+PGcNCiAgICAgaWQ9ImcyNCIgLz48Zw0KICAgICBpZD0iZzI2IiAvPjxnDQogICAgIGlkPSJnMjgiIC8+PGcNCiAgICAgaWQ9ImczMCIgLz48Zw0KICAgICBpZD0iZzMyIiAvPjxnDQogICAgIGlkPSJnMzQiIC8+PGcNCiAgICAgaWQ9ImczNiIgLz48Zw0KICAgICBpZD0iZzM4IiAvPjxnDQogICAgIGlkPSJnNDAiIC8+PGcNCiAgICAgaWQ9Imc0MiIgLz48Zw0KICAgICBpZD0iZzQ0IiAvPjxnDQogICAgIGlkPSJnNDYiIC8+PGcNCiAgICAgaWQ9Imc0OCIgLz48L3N2Zz4=`
    },
    $scheme: {
        dataSource: {
            render: 'sourceBinding',
            name: 'Источник данных'
        },
        graphGroups: {
            render: 'group',
            name: 'Связи',
            collapsible: true,
            multiple: true,
            items: {
                item: {
                    render: 'group',
                    name: 'Группа связей',
                    collapsible: true,
                    items: {
                        sourceElement: {
                            render: 'dataBinding',
                            name: 'Начальный элемент',
                            linkTo: 'dataSource'
                        },
                        targetElement: {
                            render: 'dataBinding',
                            name: 'Конечный элемент',
                            linkTo: 'dataSource'
                        },
                        linkCss: {
                            render: 'item',
                            name: 'CSS стиль связи',
                            editor: 'JSB.Widgets.MultiEditor',
                            editorOpts: {
                                valueType: 'org.jsbeans.types.Css'
                            }
                        }
                    }
                }
            }
        },
        viewTypes: {
            render: 'group',
            name: 'Способы отображения',
            collapsible: true,
            multiple: true,
            items: {
                element: {
                    render: 'dataBinding',
                    name: 'Элемент',
                    linkTo: 'dataSource'
                },
                view: {
                    render: 'select',
                    name: 'Тип маркера',
                    items: {
                        simpleGraph: {
                            name: 'Узел графа',
                            items: {
                                header: {
                                    render: 'dataBinding',
                                    name: 'Заголовок',
                                    linkTo: 'dataSource'
                                }
                            }
                        },
                        widgetGroup: {
                            name: 'Встроенный виджет',
                            items: {
                                widgetBinding: {
                                    render: 'embeddedWidget',
                                    name: 'Тип виджета',
                                    linkTo: 'dataSource'
                                }
                            }
                        }
                    }
                },
                caption: {
                    render: 'dataBinding',
                    name: 'Всплывающая подпись',
                    linkTo: 'dataSource'
                },
                nodeCss: {
                    render: 'item',
                    name: 'CSS стиль элемента',
                    editor: 'JSB.Widgets.MultiEditor',
                    editorOpts: {
                        valueType: 'org.jsbeans.types.Css'
                    }
                }
            }
        },
        settings: {
            render: 'group',
            name: 'Общие настройки',
            collapsible: true,
            items: {
                maxNodes: {
                    render: 'item',
                    name: 'Максимальное число вершин',
                    valueType: 'number',
                    defaultValue: 100,
                    value: 100
                },
                itemHeight: {
                    render: 'item',
                    name: 'Высота ячейки',
                    valueType: 'number',
                    defaultValue: 50,
                    value: 50
                },
                itemWidth: {
                    render: 'item',
                    name: 'Ширина ячейки',
                    valueType: 'number',
                    defaultValue: 50,
                    value: 50
                },
                layoutAlgorithm: {
                    render: 'group',
                    name: 'Алгоритм расположения',
                    items: {
                        simulation: {
                            render: 'group',
                            name: 'Симуляция',
                            items: {
                                alpha: {
                                    render: 'item',
                                    name: 'alpha',
                                    valueType: 'number',
                                    defaultValue: 1,
                                    value: 1,
                                    optional: true
                                },
                                alphaMin: {
                                    render: 'item',
                                    name: 'alphaMin',
                                    valueType: 'number',
                                    defaultValue: 0.001,
                                    value: 0.001,
                                    optional: true
                                },
                                alphaDecay: {
                                    render: 'item',
                                    name: 'alphaDecay',
                                    valueType: 'number',
                                    defaultValue: 0.0228,
                                    value: 0.0228,
                                    optional: true
                                },
                                alphaTarget: {
                                    render: 'item',
                                    name: 'alphaTarget',
                                    valueType: 'number',
                                    defaultValue: 0,
                                    value: 0,
                                    optional: true
                                },
                                velocityDecay: {
                                    render: 'item',
                                    name: 'velocityDecay',
                                    valueType: 'number',
                                    defaultValue: 0.4,
                                    value: 0.4,
                                    optional: true
                                }
                            }
                        },
                        collide: {
                            render: 'group',
                            name: 'Коллизия',
                            optional: true,
                            items: {
                                radius: {
                                    render: 'item',
                                    name: 'Радиус',
                                    valueType: 'number',
                                    defaultValue: 50,
                                    value: 50
                                },
                                strength: {
                                    render: 'item',
                                    name: 'Сила',
                                    valueType: 'number',
                                    defaultValue: 0.7,
                                    value: 0.7,
                                    optional: true
                                },
                                iterations: {
                                    render: 'item',
                                    name: 'iterations',
                                    valueType: 'number',
                                    defaultValue: 1,
                                    value: 1,
                                    optional: true
                                }
                            }
                        },
                        link: {
                            render: 'group',
                            name: 'Связи',
                            items: {
                                distance: {
                                    render: 'item',
                                    name: 'Расстояние',
                                    valueType: 'number',
                                    defaultValue: 80,
                                    value: 80,
                                },
                                strength: {
                                    render: 'item',
                                    name: 'Сила',
                                    valueType: 'number',
                                    defaultValue: 0.5,
                                    value: 0.5,
                                    optional: true
                                },
                                iterations: {
                                    render: 'item',
                                    name: 'iterations',
                                    valueType: 'number',
                                    defaultValue: 1,
                                    value: 1,
                                    optional: true
                                }
                            }
                        },
                        charge: {
                            render: 'group',
                            name: 'Заряд',
                            items: {
                                strength: {
                                    render: 'item',
                                    name: 'Сила',
                                    valueType: 'number',
                                    defaultValue: -150,
                                    value: -150
                                },
                                theta: {
                                    render: 'item',
                                    name: 'Theta',
                                    valueType: 'number',
                                    defaultValue: 0.9,
                                    value: 0.9,
                                    optional: true
                                },
                                distanceMin: {
                                    render: 'item',
                                    name: 'Минимальное расстояние',
                                    valueType: 'number',
                                    defaultValue: 50,
                                    value: 50,
                                    optional: true
                                },
                                distanceMax: {
                                    render: 'item',
                                    name: 'Максимальное расстояние',
                                    valueType: 'number',
                                    defaultValue: 500,
                                    value: 500,
                                    optional: true
                                }
                            }
                        }
                    }
                }
            }
        }
    },
	$client: {
        $require: ['JSB.Widgets.Diagram', 
                   'JSB.Controls.Checkbox',
                   'css:GraphWidget.css'],

        embeddedBindings: [],
        _nodeList: {},
        _namesList: {},

        $constructor: function(opts){
            $base(opts);
            this.addClass('graphWidget');

            JSB().loadScript('tpl/d3/d3.min.js', function(){
                $this.setTrigger('_scriptLoaded');
            });

            this.diagram = new Diagram({
            	zoom: 0.25,
                minZoom: 0.05,
                highlightSelecting: false,
                autoLayout: false,
                background: 'none',
                onInit: function(){
                    $this.setTrigger('_diagramInitialized');
                },
                nodes: {
                    graphNode: {
                        jsb: 'DataCube.GraphWidget.GraphNode',
                        layout: {
                            'default': {
                                auto: true,
                                animate: true,
                                nodeExpand: 20
                            }
                        }
                    }
                },
                connectors: {
                    nodeConnector: {
                        acceptLocalLinks: false,
                        offsetX: 2,
                        wiringLink: {
                            key: 'bind',
                            type: 'target'
                        }
                    }
                },
                links: {
                    bind: {
                        source: ['nodeConnector'],
                        target: ['nodeConnector'],
                        heads: {
                            target: {
                                // shape: 'arrow',
                                strip: 0
                            }
                        }
                    }
                }
            });
            this.append(this.diagram);
            
            $this.getElement().visible(function(evt, isVisible){
				if(!isVisible){
					return;
				}
				if($this.refreshOrdered){
					$this.refresh($this.refreshOrderedOpts);
				}
			});
        },

        onRefresh: function(opts){
        	if(!$this.getElement().is(':visible')){
				$this.refreshOrdered = true;
				$this.refreshOrderedOpts = opts;
				this.ready();
				return;
			}
			$this.refreshOrdered = false;
        	
            // if filter source is current widget
            if(opts && this == opts.initiator){
                this.ready();
                return;
            }
			
            if(opts && opts.updateStyles){
                this._styles = null;
                this._dataSource = null;
                this.embeddedBindings = [];

                for(var i in this._nodeList){
                    this.diagram.remove(this._nodeList[i]);
                }

                this._nodeList = {};
                this._namesList = {};
            }

            if(!this._dataSource){
                this._dataSource = this.getContext().find('dataSource');

                if(!this._dataSource.hasBinding()){
                    this.ready();
                    return;
                }
            }

            if(!this._styles){
                this._styles = {
                    requireWidgets: [],
                    viewListObj: {}
                };

                var viewTypes = this.getContext().find('viewTypes').values(),
                    bindingMap = {};

                for(var i = 0; i < viewTypes.length; i++){
                    var binding = viewTypes[i].find('element').binding();

                    if(bindingMap[binding]) {
                        continue;
                    }

                    var viewSelector = viewTypes[i].find('view'),
                        caption = viewTypes[i].find('caption'),
                        name = viewTypes[i].find('name').value() || binding,
                        nClass = 'nodeType_' + JSB().generateUid();

                    if(viewSelector.value() === 'widgetGroup'){
                        var widget = viewSelector.find("widgetBinding"),
                            jsb = widget.getWidgetBean(),
                            obj = {
                                jsb: jsb,
                                wrapper: this.getWrapper(),
                                values: widget,
                                caption: caption,
                                nClass: nClass,
                                nodeCss: viewTypes[i].find('nodeCss').value()
                            };

                        this._styles.viewListObj[binding] = obj;

                        this._styles.requireWidgets.push({
                            jsb: jsb,
                            obj: obj
                        });

                        this.embeddedBindings = this.embeddedBindings.concat(widget.findRendersByName('sourceBinding'));

                        this._namesList[name] = { binding: binding, type: 'widget', nClass: nClass };
                    } else {
                        this._styles.viewListObj[binding] = {
                            header: viewTypes[i].find('header'),
                            caption: caption,
                            nClass: nClass,
                            nodeCss: viewTypes[i].find('nodeCss').value()
                        }

                        this._namesList[name] = { binding: binding, type: 'simpleGraph', nClass: nClass };
                    }

                    bindingMap[binding] = true;
                }

                var graphGroups = this.getContext().find('graphGroups').values(),
                    graphList = [];

                function checkGraphGroup(el){
                    if(!$this._styles.viewListObj[el.binding()]){
                        $this._styles.viewListObj[el.binding()] = {
                            caption: el,
                            header: el,
                            nClass: 'nodeType_' + JSB().generateUid()
                        }
                    }
                }

                for(var i = 0; i < graphGroups.length; i++){
                    var srcEl = graphGroups[i].find('sourceElement'),
                        tgtEl = graphGroups[i].find('targetElement');

                    graphList.push({
                        css: graphGroups[i].find('linkCss').value(),
                        sourceElement: srcEl,
                        targetElement: tgtEl
                    });

                    checkGraphGroup(srcEl);
                    checkGraphGroup(tgtEl);
                }

                this._styles.graphList = graphList;

                //
                this._styles.maxNodes = this.getContext().find('maxNodes').value();
                this._styles.itemWidth = this.getContext().find('itemWidth').value();
                this._styles.itemHeight = this.getContext().find('itemHeight').value();

                // simulationOpts
                var simulationOpts = this.getContext().find('settings layoutAlgorithm simulation');
                this._styles.simulationOpts = {
                    alpha: simulationOpts.find('alpha').checked() ? simulationOpts.find('alpha').value() : undefined,
                    alphaMin: simulationOpts.find('alphaMin').checked() ? simulationOpts.find('alphaMin').value() : undefined,
                    alphaDecay: simulationOpts.find('alphaDecay').checked() ? simulationOpts.find('alphaDecay').value() : undefined,
                    alphaTarget: simulationOpts.find('alphaTarget').checked() ? simulationOpts.find('alphaTarget').value() : undefined,
                    velocityDecay: simulationOpts.find('velocityDecay').checked() ? simulationOpts.find('velocityDecay').value() : undefined
                };

                // collideOpts
                var collideOpts = this.getContext().find('settings layoutAlgorithm collide');
                if(collideOpts.checked()){
	                this._styles.collideOpts = {
	                    radius: collideOpts.find('radius').value(),
	                    strength: collideOpts.find('strength').checked() ? collideOpts.find('strength').value() : undefined,
	                    iterations: collideOpts.find('iterations').checked() ? collideOpts.find('iterations').value() : undefined
	                };
                } else {
                	this._styles.collideOpts = undefined;
                }

                // linkOpts
                var linkOpts = this.getContext().find('settings layoutAlgorithm link');
                this._styles.linkOpts = {
                    distance: linkOpts.find('distance').value(),
                    strength: linkOpts.find('strength').checked() ? linkOpts.find('strength').value() : undefined,
                    iterations: linkOpts.find('iterations').checked() ? linkOpts.find('iterations').value() : undefined
                }

                // chargeOpts
                var chargeOpts = this.getContext().find('settings layoutAlgorithm charge');
                this._styles.chargeOpts = {
                    strength: chargeOpts.find('strength').value(),
                    theta: chargeOpts.find('theta').checked() ? chargeOpts.find('theta').value() : undefined,
                    distanceMin: chargeOpts.find('distanceMin').checked() ? chargeOpts.find('distanceMin').value() : undefined,
                    distanceMax: chargeOpts.find('distanceMax').checked() ? chargeOpts.find('distanceMax').value() : undefined
                }
            }

            $base();

            if($this.simulation){
                $this.simulation.stop();
            }

            this.innerRefresh();
        },

        innerRefresh: function(){
            this.getElement().loader();

            //this.createLegend();

            JSB.chain(this._styles.requireWidgets, function(d, c){
                if(!d.jsb){
                    c();
                } else {
                    JSB.lookup(d.jsb, function(cls){
                        d.obj.cls = cls;
                        c();
                    });
                }
            }, function(){
                $this.ensureInitialized(function(){
                    $this.fetchWidget();
                });
            });
        },

        fetchWidget: function(){
            var viewList = $this._styles.viewListObj,
                graphList = $this._styles.graphList;

            if(this.simulation) {
                this.simulation.stop();
                this.simulation = null;
            }

            this.diagram.setPan({x: 0, y: 0});

            var count = 0,
                links = [],
                nodesMap = {};

            function createNode(node, binding){
                if(!nodesMap[node] && !$this._nodeList[node]){
                    var entry = JSB().clone(viewList[binding]);

                    if(entry){
                        if(entry.values){
                            entry.values = entry.values.getFullValues();
                        }
                        if(entry.header){
                            entry.header = entry.header.value();
                        }
                        if(entry.caption){
                            entry.caption = entry.caption.value();
                        }
                    } else {
                        entry.header = node;
                    }

                    nodesMap[node] = entry;

                    var diagNode = $this.diagram.createNode('graphNode', {entry: entry});

                    if($this._styles.itemWidth && $this._styles.itemHeight){
                    	var css = {
                    		'width': $this._styles.itemWidth,
                    		'height': $this._styles.itemHeight,
                    		'margin-left': -$this._styles.itemWidth / 2,
                    		'margin-top': -$this._styles.itemHeight / 2
                    	};
                    	diagNode.getElement().css(css);
/*                        diagNode.getElement().width($this._styles.itemWidth);
                        diagNode.getElement().height($this._styles.itemHeight);*/
                    }

                    $this._nodeList[node] = diagNode;
                }
                if(!nodesMap[node] && $this._nodeList[node]){
                    nodesMap[node] = true;
                }
            }

            function innerFetch(isReset){
            	var batchSize = 100;
                $this.fetch($this._dataSource, { batchSize: batchSize, reset: isReset }, function(res, fail){
                    if(fail){
                        $this.ready();
                        $this.getElement().loader('hide');
                        return;
                    }

                    while($this._dataSource.next({embeddedBindings: $this.embeddedBindings}) && count <= $this._styles.maxNodes){
                        for(var i = 0; i < graphList.length; i++){
                            var entry,
                                sourceElement = graphList[i].sourceElement,
                                targetElement = graphList[i].targetElement,
                                se = sourceElement.value(),
                                te = targetElement.value();

                            if(!se || !te){
                                continue;
                            }

                            createNode(se, sourceElement.binding());
                            createNode(te, targetElement.binding());

                            var flag = true,
                                curLink = {
                                    source: se,
                                    target: te,
                                    css: graphList[i].css
                                };
                            for(var j = 0; j < links.length; j++){
                                if(links[j].source === curLink.source && links[j].target === curLink.target || links[j].target === curLink.source && links[j].source === curLink.target){
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag){
                                links.push(curLink);
                            }
                        }

                        count = Object.keys(nodesMap).length;
                    }

                    if(count >= $this._styles.maxNodes || res.length < batchSize){
                        var nodes = [];
                        for(var i in nodesMap){
                            nodes.push({
                                id: i,
                                entry: nodesMap[i]
                            });
                        }

                        $this.removeOldNodes(nodesMap);

                        for(var i = 0; i < links.length; i++){
                            var link = $this.diagram.createLink('bind');

                            link.setSource($this._nodeList[links[i].source].connector);
                            link.setTarget($this._nodeList[links[i].target].connector);

                            link.path.attr('style', links[i].css);
                        }

                        $this.simulateGraph({
                            nodes: nodes,
                            links: links
                        });
                    } else {
                        innerFetch();
                    }
                });
            }

            innerFetch(true);
        },

        simulateGraph: function(data){
        	console.log('simulateGraph');
        	var tickIter = 0;
            var nodes = data.nodes,
                links = data.links;
            try{
                var itemWidth = this._styles.itemWidth,
                    itemHeight = this._styles.itemHeight,
                    simulationOpts = this._styles.simulationOpts,
                    collideOpts = this._styles.collideOpts,
                    linkOpts = this._styles.linkOpts,
                    chargeOpts = this._styles.chargeOpts;
                
                function ticked(){
                	tickIter++;
                	if(tickIter % 4 !== 1){
                		return;
                	}
                    try{
                        nodes.forEach(function(el){
                            $this._nodeList[el.id].setPosition(el.x, el.y);
                        });
                    } catch(ex){
                        console.log(ex);

                        if($this.simulation) {
                            $this.simulation.stop();
                        }
                    }
                }

                this.simulation = d3.forceSimulation(nodes);
                if(JSB.isDefined(simulationOpts.alpha)){
                	this.simulation.alpha(simulationOpts.alpha);
                }
                if(JSB.isDefined(simulationOpts.alphaMin)){
                	this.simulation.alphaMin(simulationOpts.alphaMin);
                }
                if(JSB.isDefined(simulationOpts.alphaDecay)){
                	this.simulation.alphaDecay(simulationOpts.alphaDecay);
                }
                if(JSB.isDefined(simulationOpts.alphaTarget)){
                	this.simulation.alphaTarget(simulationOpts.alphaTarget);
                }
                if(JSB.isDefined(simulationOpts.velocityDecay)){
                	this.simulation.velocityDecay(simulationOpts.velocityDecay);
                }
                    
                var forceManyBody = d3.forceManyBody()
	                .strength(chargeOpts.strength);
                
                if(JSB.isDefined(chargeOpts.theta)){
                	forceManyBody.theta(chargeOpts.theta);
                }
                if(JSB.isDefined(chargeOpts.distanceMin)){
                	forceManyBody.distanceMin(chargeOpts.distanceMin)
                }
                if(JSB.isDefined(chargeOpts.distanceMax)){
                	forceManyBody.distanceMax(chargeOpts.distanceMax);
                }
                
                var forceLink = d3.forceLink()
                	.id(function(d) { return d.id })
                	.distance(linkOpts.distance)
	                .links(links);
                
                if(JSB.isDefined(linkOpts.strength)){
                	forceLink.strength(linkOpts.strength);
                }
                if(JSB.isDefined(linkOpts.iterations)){
                	forceLink.iterations(linkOpts.iterations);
                }
                
                this.simulation                    
                	.force("charge", forceManyBody)
                    .force("link", forceLink)
                    .on("tick", ticked);
                
                if(collideOpts){
                	var forceCollide = d3.forceCollide(collideOpts.radius);
                	if(JSB.isDefined(collideOpts.strength)){
                		forceCollide.strength(collideOpts.strength);
                	}
                	if(JSB.isDefined(collideOpts.iterations)){
                		forceCollide.iterations(collideOpts.iterations);
                	}
                	this.simulation.force("collide", forceCollide);
                }
                
                $this.getElement().loader('hide');
            } catch(ex){
                console.log(ex);

                if($this.simulation) {
                    $this.simulation.stop();
                }

                $this.getElement().loader('hide');
            } finally {
                this.ready();
            }
        },

        createLegend: function(){
            this.legendDiv = this.$('<div class="graphLegend hidden"></div>');
            this.append(this.legendDiv);

            this.legendBtn = this.$('<div class="graphLegendBtn">Легенда &#9660;</div>');
            this.legendBtn.click(function(){
                $this.legendDiv.toggleClass('hidden');
                if($this.legendDiv.hasClass('hidden')){
                    this.innerHTML = 'Легенда &#9660;';
                } else {
                    this.innerHTML = 'Легенда &#9650;';
                }
            });
            this.append(this.legendBtn);

            for(var i in this._namesList){
                var checkBox = new Checkbox({
                    class: "graphLegendCheckBox",
                    label: i,
                    checked: true,
                    onChange: function(b){
                        var elems = $this.find('.' + $this._namesList[this.options.label].nClass);
                        if(b){
                            elems.removeClass('hidden');
                        } else {
                            elems.addClass('hidden');
                        }

                        $this.updateLinks();
                    }
                });
                this.legendDiv.append(checkBox.getElement());
            }
        },

        ensureInitialized: function(callback){
            this.ensureTrigger(['_diagramInitialized', '_scriptLoaded', '_valuesLoaded'], callback);
        },

        updateLinks: function(){
            var links = this.diagram.getLinks();

            for(var i in links){
                if(links[i].source.node.getElement().hasClass('hidden') || links[i].target.node.getElement().hasClass('hidden')){
                    links[i].group.classed('hidden', true);
                }

                if(!links[i].source.node.getElement().hasClass('hidden') && !links[i].target.node.getElement().hasClass('hidden')){
                    links[i].group.classed('hidden', false);
                }
            }
        },

        removeOldNodes: function(newNodeList){
            for(var i in this._nodeList){
                if(!newNodeList[i]){
                    this.diagram.removeNode(this._nodeList[i]);
                    delete this._nodeList[i];
                }
            }
        }
    }
}