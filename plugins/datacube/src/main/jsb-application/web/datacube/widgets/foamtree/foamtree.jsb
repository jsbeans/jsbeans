{
	$name: 'DataCube.Widgets.Foamtree',
    $parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'FoamTree',
        description: '',
        category: 'Кластеризация',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojQkIwRDQ4O30NCgkuc3Qxe2ZpbGw6IzVDQjhDRDt9DQoJLnN0MntmaWxsOiMwMEFBQkM7fQ0KCS5zdDN7ZmlsbDojMTUyRDM5O30NCgkuc3Q0e2ZpbGw6I0ZCOEE1Mjt9DQoJLnN0NXtmaWxsOiNGNzcyMzc7fQ0KCS5zdDZ7ZmlsbDojMDcxQzIzO30NCgkuc3Q3e2ZpbGw6Izk2MEM0MTt9DQoJLnN0OHtmaWxsOiNERUUyRTI7fQ0KPC9zdHlsZT48ZyBpZD0iWE1MSURfMzQyNl8iPjxnIGlkPSJYTUxJRF8zNDI3XyI+PHBhdGggY2xhc3M9InN0MCIgZD0iTTI1NiwyNTUuNXYwLjVDNTg5LjMsNjE3LDU4OS4zLTEwNS42LDI1NiwyNTUuNXoiIGlkPSJYTUxJRF8zNDI4XyIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTYuNSwyNTZIMjU2Qy0xMDUsNTg5LjMsNjE3LjYsNTg5LjMsMjU2LjUsMjU2eiIgaWQ9IlhNTElEXzM0MjlfIi8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTI1Ni4zLDQ4NmMtMTguNSwwLTM2LjYtNC4xLTUxLTExLjVjLTEwLjEtNS4yLTIzLjQtMTQuOC0yOS43LTMwLjkgICAgYy02LjgtMTcuNC00LjQtMzksNy4xLTY0LjNjMTMuMy0yOS4xLDM4LTYxLjMsNzMuNi05NmMzNS42LDM0LjcsNjAuMyw2Ni45LDczLjYsOTZjMTEuNSwyNS4yLDEzLjksNDYuOSw3LjEsNjQuMyAgICBjLTYuMywxNi4xLTE5LjYsMjUuNy0yOS43LDMwLjlDMjkyLjksNDgxLjksMjc0LjgsNDg2LDI1Ni4zLDQ4NnoiIGlkPSJYTUxJRF8zNDMyXyIvPjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0yNTYsMjU2LjVsMC0wLjVDLTc3LjMtMTA1LTc3LjMsNjE3LjYsMjU2LDI1Ni41eiIgaWQ9IlhNTElEXzM0MzNfIi8+PHBhdGggY2xhc3M9InN0NCIgZD0iTTI1NS41LDI1NmgwLjVDNjE3LTc3LjMtMTA1LjYtNzcuMywyNTUuNSwyNTZ6IiBpZD0iWE1MSURfMzQzNF8iLz48cGF0aCBjbGFzcz0ic3Q1IiBkPSJNMjU1LjcsMjI4LjdjLTM1LjYtMzQuNy02MC4zLTY2LjktNzMuNi05NmMtMTEuNS0yNS4yLTEzLjktNDYuOS03LjEtNjQuMyAgICBjNi4zLTE2LjEsMTkuNi0yNS43LDI5LjctMzAuOWMxNC4zLTcuNCwzMi40LTExLjUsNTEtMTEuNWMxOC41LDAsMzYuNiw0LjEsNTEsMTEuNWMxMC4xLDUuMiwyMy40LDE0LjgsMjkuNywzMC45ICAgIGM2LjgsMTcuNCw0LjQsMzktNy4xLDY0LjNDMzE2LDE2MS44LDI5MS4zLDE5NCwyNTUuNywyMjguN3oiIGlkPSJYTUxJRF8zNDM3XyIvPjxwYXRoIGNsYXNzPSJzdDYiIGQ9Ik0yNiwyNTYuM2MwLTE4LjUsNC4xLTM2LjYsMTEuNS01MWM1LjItMTAuMSwxNC44LTIzLjQsMzAuOS0yOS43YzE3LjQtNi44LDM5LTQuNCw2NC4zLDcuMSAgICBjMjkuMSwxMy4zLDYxLjMsMzgsOTYsNzMuNmMtMzQuNywzNS42LTY2LjksNjAuMy05Niw3My42Yy0yNS4yLDExLjUtNDYuOSwxMy45LTY0LjMsNy4xYy0xNi4xLTYuMy0yNS43LTE5LjYtMzAuOS0yOS43ICAgIEMzMC4xLDI5Mi45LDI2LDI3NC44LDI2LDI1Ni4zeiIgaWQ9IlhNTElEXzg0N18iLz48cGF0aCBjbGFzcz0ic3Q3IiBkPSJNMjgzLjMsMjU1LjdjMzQuNy0zNS42LDY2LjktNjAuMyw5Ni03My42YzI1LjItMTEuNSw0Ni45LTEzLjksNjQuMy03LjEgICAgYzE2LjEsNi4zLDI1LjcsMTkuNiwzMC45LDI5LjdjNy40LDE0LjMsMTEuNSwzMi40LDExLjUsNTFjMCwxOC41LTQuMSwzNi42LTExLjUsNTFjLTUuMiwxMC4xLTE0LjgsMjMuNC0zMC45LDI5LjcgICAgYy0xNy40LDYuOC0zOSw0LjQtNjQuMy03LjFDMzUwLjIsMzE2LDMxOCwyOTEuMywyODMuMywyNTUuN3oiIGlkPSJYTUxJRF84MzJfIi8+PC9nPjxnIGlkPSJYTUxJRF8zNDM4XyI+PHBhdGggY2xhc3M9InN0OCIgZD0iTTI2MS4zLDExMC42aC0xMy4ybC0zLjEsOWgtNC44bDEyLjYtMzVoNC4xbDEyLjQsMzVoLTQuOEwyNjEuMywxMTAuNnogTTI0OS41LDEwNi42aDEwLjUgICAgbC01LjEtMTVoLTAuMUwyNDkuNSwxMDYuNnoiIGlkPSJYTUxJRF8zNDQxXyIvPjxwYXRoIGNsYXNzPSJzdDgiIGQ9Ik0yNjcuNCw0MTZsMCwwLjFjMC4xLDMuMi0xLjEsNS45LTMuNCw4Yy0yLjMsMi4xLTUuNCwzLjItOS4xLDMuMmMtMy44LDAtNy0xLjQtOS40LTQuMSAgICBjLTIuNC0yLjctMy42LTYuMi0zLjYtMTAuNHYtNi4xYzAtNC4yLDEuMi03LjcsMy42LTEwLjRjMi40LTIuNyw1LjYtNC4xLDkuNC00LjFjMy44LDAsNi45LDEsOS4yLDMuMWMyLjMsMiwzLjQsNC44LDMuMyw4LjEgICAgbDAsMC4xSDI2M2MwLTIuNC0wLjctNC4zLTIuMS01LjdjLTEuNC0xLjQtMy40LTIuMS01LjktMi4xYy0yLjYsMC00LjYsMS02LjEsMy4xYy0xLjUsMi4xLTIuMyw0LjYtMi4zLDcuN3Y2LjEgICAgYzAsMy4xLDAuOCw1LjcsMi4zLDcuOGMxLjUsMi4xLDMuNiwzLjEsNi4xLDMuMWMyLjYsMCw0LjUtMC43LDUuOS0yLjFjMS40LTEuNCwyLjEtMy4zLDIuMS01LjdIMjY3LjR6IiBpZD0iWE1MSURfMzQ0NF8iLz48cGF0aCBjbGFzcz0ic3Q4IiBkPSJNMzk3LjMsMjY4Ljl2LTM1aDExLjRjMy43LDAsNi41LDAuOCw4LjYsMi40YzIuMSwxLjYsMy4xLDMuOSwzLjEsNy4xICAgIGMwLDEuNS0wLjUsMi45LTEuNCw0LjFjLTAuOSwxLjItMi4yLDIuMS0zLjcsMi43YzIuMywwLjMsNC4xLDEuMyw1LjQsM2MxLjMsMS43LDIsMy42LDIsNS45YzAsMy4yLTEsNS43LTMuMSw3LjMgICAgYy0yLjEsMS43LTQuOSwyLjUtOC41LDIuNUgzOTcuM3ogTTQwMiwyNDguOGg3LjdjMS44LDAsMy4yLTAuNSw0LjMtMS41YzEuMS0xLDEuNy0yLjMsMS43LTQuMWMwLTEuOS0wLjYtMy4zLTEuOC00LjIgICAgYy0xLjItMC45LTIuOS0xLjQtNS4yLTEuNEg0MDJWMjQ4Ljh6IE00MDIsMjUyLjV2MTIuN2g5LjFjMi4yLDAsMy44LTAuNSw1LTEuNmMxLjItMS4xLDEuOC0yLjYsMS44LTQuNWMwLTEuOS0wLjYtMy41LTEuOC00LjcgICAgYy0xLjItMS4yLTIuOS0xLjgtNC45LTEuOWgtMC4zSDQwMnoiIGlkPSJYTUxJRF8zNDQ2XyIvPjxwYXRoIGNsYXNzPSJzdDgiIGQ9Ik04OS4yLDI2OC45di0zNWgxMWM0LjYsMCw4LjIsMS40LDExLDQuMmMyLjgsMi44LDQuMiw2LjQsNC4yLDEwLjl2NC44ICAgIGMwLDQuNS0xLjQsOC4xLTQuMiwxMC45Yy0yLjgsMi44LTYuNSw0LjItMTEsNC4ySDg5LjJ6IE05NCwyMzcuNnYyNy42aDYuM2MzLjIsMCw1LjgtMS4xLDcuNy0zLjJjMS45LTIuMSwyLjgtNC45LDIuOC04LjJWMjQ5ICAgIGMwLTMuMy0wLjktNi0yLjgtOC4xYy0xLjktMi4xLTQuNC0zLjItNy43LTMuMkg5NHoiIGlkPSJYTUxJRF8zNDUwXyIvPjwvZz48L2c+PC9zdmc+`,
        thumb: `data:image/png;base64,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`
    },
    $scheme: {
        source: {
            render: 'sourceBinding',
            name: 'Источник'
        },
        levels: {
            render: 'group',
            name: 'Уровни',
            multiple: true,
            items: {
                fieldName: {
                    render: 'dataBinding',
                    name: 'Имя поля',
                    linkTo: 'source',
                    valueType: 'string'
                },
                fieldWeight: {
                    render: 'dataBinding',
                    name: 'Вес поля',
                    linkTo: 'source',
                    valueType: 'number'
                },
                autoSize: {
                    render: 'item',
                    name: 'Автоматически считать размеры',
                    optional: true,
                    editor: 'none'
                },
                isSum: {
                    render: 'item',
                    name: 'Суммировать количество',
                    optional: true,
                    editor: 'none'
                },
                skipEmptyNamedGroups: {
                    render: 'item',
                    name: 'Опускать группы с пустыми именами',
                    optional: 'checked',
                    editor: 'none'
                },
                useImages: {
                    render: 'switch',
                    name: 'Использовать изображения',
                    items: {
                        url: {
                            render: 'formatter',
                            name: 'URL',
                            linkTo: 'source'
                        },
                        showLabels: {
                            render: 'item',
                            name: 'Показывать подписи',
                            optional: 'checked',
                            editor: 'none'
                        }
                    }
                }
            }
        },
        settings: {
            render: 'group',
            name: 'Настройки отображения',
            items: {
                colorScheme: {
                    render: 'styleBinding',
                    name: 'Цветовая схема'
                },
                layout: {
                    render: 'select',
                    name: 'Алгоритм построения слоёв',
                    items: {
                        relaxed: {
                            name: 'relaxed'
                        },
                        ordered: {
                            name: 'ordered'
                        },
                        squarified: {
                            name: 'squarified'
                        }
                    }
                },
                stacking: {
                    render: 'select',
                    name: 'Алгоритм построения групп',
                    items: {
                        hierarchical: {
                            name: 'hierarchical'
                        },
                        flattened: {
                            name: 'flattened',
                            items: {
                                descriptionGroupType: {
                                    render: 'select',
                                    name: 'Тип имён групп',
                                    items: {
                                        stab: {
                                            name: 'stab'
                                        },
                                        floating: {
                                            name: 'floating'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                format: {
                    render: 'formatter',
                    name: 'Формат имён',
                    formatterOpts: {
                        variables: [
                            {
                                alias: 'Имя поля',
                                type: 'string',
                                value: 'name'
                            },
                            {
                                alias: 'Значение',
                                type: 'number',
                                value: 'value'
                            }
                        ]
                    },
                    valueType: 'string',
                    defaultValue: '{name}'
                }
            }
        }
    },
	$client: {
	    $require: ['JSB.Utils.Formatter',
	               'css:foamtree.css'],

	    _isNeedUpdate: false,

        $constructor: function(opts){
            $base(opts);

            $this.container = $this.$('<div class="container"></div>');
            $this.append($this.container);

            JSB().loadScript(['tpl/carrotsearch/foamtree.js'], function(){
                    $this.setInitialized();
            });

            this.container.resize(function(){
                if(!$this.container.is(':visible') || !$this.foamtree){
                    return;
                }

                JSB().defer(function(){
                    $this.foamtree.resize();
                }, 300, 'foamtree.resize_' + $this.getId())
            });

            this.container.visible(function(evt, isVisible){
                if($this._isNeedUpdate && isVisible){
                    $this._buildChart($this._data);
                    $this.ready();
                }
            });
        },

        onRefresh: function(opts){
        	$base(opts);
        	if(opts && opts.initiator == this){
        	    $this.ready();
        	    return;
        	}

            if(opts && opts.updateStyles){
                this._dataSource = null;
                this._schemeOpts = null;
                this._widgetOpts = null;
                this._styles = null;
            }

        	if(!this._dataSource){
        	    var dataSource = this.getContext().find('source');

                if(!dataSource.hasBinding()){
                    $this.ready();
                    return;
                }

                this._dataSource = dataSource;
        	}

        	if(!this._schemeOpts){
        	    var seriesContext = this.getContext().find('levels').values(),
        	        settings = this.getContext().find('settings');

        	    this._schemeOpts = {
        	        contentBindings: [],
        	        contentData: [],
        	        series: []
        	    }

        	    for(var i = 0; i < seriesContext.length; i++){
        	        var useImages = seriesContext[i].find('useImages').checked();

        	        this._schemeOpts.series.push({
                        nameSelector: seriesContext[i].find('fieldName'),
                        dataSelector: seriesContext[i].find('fieldWeight'),
                        autoSize: seriesContext[i].find('autoSize').checked(),
                        isSum: seriesContext[i].find('isSum').checked(),
                        skipEmptyNamedGroups: seriesContext[i].find('skipEmptyNamedGroups').checked(),
                        url: useImages ? seriesContext[i].find('useImages url').value() : undefined,
                        showLabels: useImages ? seriesContext[i].find('useImages showLabels').checked() : undefined
        	        });
        	    }
        	}

        	if(!this._styles){
        	    this._styles = {
                    layout: settings.find('layout').value(),
                    stacking: settings.find('stacking').value(),
                    descriptionGroupType: settings.find('descriptionGroupType').value(),
                    format: settings.find('format').value()
        	    }
        	}

            var data = [],
                colorCount = 0,
                widgetOpts = this._widgetOpts ? undefined : { styleScheme: this.getContext().find('settings colorScheme').value() };

            this.getElement().loader();

            function parseFormatterData(res){
                var data = {};

                for(var i in res){
                    data[i] = res[i].main;
                }

                return data;
            }

            function fetch(isReset){
                try{
                    $this.fetch($this._dataSource, { batchSize: 100, reset: isReset, widgetOpts: isReset ? widgetOpts : undefined }, function(res, fail, serverWidgetOpts){
                    	if(fail){
                            $this.ready();
                            $this.getElement().loader('hide');
                            return;
                        }

                        if(res.length === 0){
                            resultProcessing();
                            return;
                        }

                        if(serverWidgetOpts){
                            $this._widgetOpts = serverWidgetOpts;
                        }

                        var resCount = 0;

                        while($this._dataSource.next()){
                            var curCat = data;

                            for(var i = 0; i < $this._schemeOpts.series.length; i++){
                                var name = $this._schemeOpts.series[i].nameSelector.value(),
                                    value = $this._schemeOpts.series[i].dataSelector.value();

                                if($this._schemeOpts.series[i].skipEmptyNamedGroups && name.length === 0){
                                    break;
                                }

                                if(curCat[name]){
                                    if($this._schemeOpts.series[i].autoSize){
                                        curCat[name].weight++;
                                    } else if($this._schemeOpts.series[i].isSum){
                                        curCat[name].weight += value;
                                    }
                                } else {
                                    var color = undefined;

                                    if(i === 0 && $this._widgetOpts.styleScheme){
                                        color = $this._widgetOpts.styleScheme[colorCount%$this._widgetOpts.styleScheme.length];
                                    }

                                    curCat[name] = {
                                        binding: $this._schemeOpts.series[i].nameSelector.binding(),
                                        child: {},
                                        color: color,
                                        image: $this._schemeOpts.series[i].url ? Formatter.format($this._schemeOpts.series[i].url, parseFormatterData(res[resCount])) : undefined,
                                        showLabels: $this._schemeOpts.series[i].showLabels,
                                        name: name,
                                        weight: $this._schemeOpts.series[i].autoSize ? 0 : value
                                    };

                                    i === 0 && colorCount++;
                                }

                                curCat = curCat[name].child;
                            }

                            resCount++;
                        }

                        fetch();
                    });
                } catch(ex){
                    console.log('Foamtree load data exception');
                    console.log(ex);
                    $this.getElement().loader('hide');
                }
            }

            function resultProcessing(){
                try{
                    function resolveData(arr, data){
                        if(!data){
                            return;
                        }

                        for(var i in data){
                            var groups = []
                                group = {
                                    binding: data[i].binding,
                                    color: data[i].color,
                                    groups: groups,
                                    label: $this._styles.format ? Formatter.format($this._styles.format, {name: data[i].name, value: data[i].weight}) : data[i].name,
                                    showLabels: data[i].showLabels,
                                    weight: data[i].weight
                                };

                            if(data[i].image){
                                (function(group){
                                    JSB.merge(group, {
                                        image: undefined,
                                        imageLoaded: false,         // true when image has just been loaded
                                        imageLoadedTime: undefined, // time the image completed loading, used for fading-in animation

                                        hasImage: true,

                                        // True when some image-specific data is loading. We'll set this flag to true
                                        // when the list of author's images is loading to show a spinner in that group.
                                        loading: false
                                    });

                                    // Initiate loading of the low-resolution image
                                    var img = new Image();
                                    img.onload = function () {
                                      // Once the image has been loaded,
                                      // put it in the group's data object
                                      group.image = img;
                                      group.imageLoaded = true;
                                      group.imageLoadedTime = Date.now();

                                      // Schedule FoamTree redraw to show the newly loaded image
                                      if($this.foamtree){
                                        $this.foamtree.redraw(false, group);
                                      } else {
                                        $this._isNeedUpdate = true;
                                      }
                                    };
                                    img.src = data[i].image;
                                })(group);
                            }

                            arr.push(group);

                            resolveData(groups, data[i].child);
                        }
                    }

                    var seriesData = [];
                    resolveData(seriesData, data);

                    $this.buildChart(seriesData);

                    $this.getElement().loader('hide');
                } catch(ex){
                    console.log('Foamtree processing data exception');
                    console.log(ex);
                    $this.getElement().loader('hide');
                }
            }

            fetch(true);
        },

        buildChart: function(data){
            if(this.container.is(':visible')){
                this._buildChart(data);
                this.ready();
            } else {
                this._isNeedUpdate = true;
                this._data = data;
            }
        },

        _buildChart: function(data){
            if(this.foamtree){
                this.foamtree.set(JSB.merge(this._styles, {
                    dataObject: {
                        groups: data
                    }
                }));

                this.foamtree.redraw();
            } else {
                this.foamtree = new CarrotSearchFoamTree(JSB.merge(this._styles, {
                    element: this.container.get(0),
                    pixelRatio: window.devicePixelRatio || 1,
                    dataObject: {
                        groups: data
                    },
                    onGroupSelectionChanged: function(event){
                        if(event.groups.length){
                            var context = $this._dataSource.binding();
                            if(!context.source){
                                return;
                            }

                            var fDesc = {
                                sourceId: context.source,
                                type: '$and',
                                op: '$eq',
                                field: event.groups[0].binding,
                                value: event.groups[0].label
                            };

                            if(!$this.hasFilter(fDesc)){
                                if($this._currentFilter){
                                    $this.removeFilter($this._currentFilter);
                                }
                                $this._currentFilter = $this.addFilter(fDesc);
                                $this.refreshAll();
                            }
                        } else {
                            if($this._currentFilter){
                                $this.removeFilter($this._currentFilter);
                                $this._currentFilter = null;
                                $this.refreshAll();
                            }
                        }
                    },

                    // images
                    groupContentDecorator: function (opts, props, vars) {
                        var group = props.group;

                        if(!group.hasImage){
                            return;
                        }

                        // The canvas 2d context on which we'll be drawing
                        var ctx = props.context;

                        // Current time, we'll need it to draw animations
                        var now = Date.now();

                        // Don't draw default labels and polygons, we'll draw everything on our own.
                        vars.groupLabelDrawn = false;
                        if(props.exposure >= 1){
                            vars.groupLabelDrawn = true;
                        } else {
                            vars.groupLabelDrawn = group.showLabels;
                        }

                        // Here we handle the fading-in of the image that was just loaded and
                        // fading-out of the loading spinner animation.
                        var imageAlpha = 0;
                        if (group.image) {
                          // Image is available, fade it in
                          imageAlpha = Math.min(1, (now - group.imageLoadedTime) / 300);
                          ctx.globalAlpha = imageAlpha;
                          drawImage();
                        }
                        if (imageAlpha < 1 || group.loading) {
                          // Image still loading of fading-in, draw spinner animation.
                          // We'll also draw the spinner when we're loading more of
                          // authors photos.
                          ctx.globalAlpha = group.loading ? 1.0 : 1 - imageAlpha;
                          drawSpinner();

                          // Schedule a redraw of this group.
                          $this.foamtree.redraw(false, group);
                        }

                        // Draws the loading spinner animation
                        function drawSpinner() {
                            var cx = props.polygonCenterX;
                            var cy = props.polygonCenterY;

                            if (props.shapeDirty) {
                                // If group's polygon changed, recompute the radius of the inscribed polygon.
                                group.spinnerRadius = CarrotSearchFoamTree.geometry.circleInPolygon(props.polygon, cx, cy) * 0.1;
                            }

                            // Draw the spinner. Advance the animation based on the current time.
                            var angle = 2 * Math.PI * (now % 1000) / 1000;
                            ctx.beginPath();
                            ctx.arc(cx, cy, group.spinnerRadius, angle, angle + Math.PI / 5, true);
                            ctx.strokeStyle = "white";
                            ctx.lineWidth = group.spinnerRadius * 0.3;
                            ctx.stroke();
                        }

                        // Draws the image in the group's polygon.
                        //
                        // If the group is not exposed, we'll crop the image in such a way that it covers the whole polygon.
                        // If the group is exposed, we'll show the whole image. To fill the remaining space in the polygon,
                        // we'll draw the blurred version of the same image as the backdrop.
                        //
                        function drawImage() {
                          // If the group's polygon changed or image has just loaded, recompute the geometry-dependent elements.
                          if (props.shapeDirty || group.imageLoaded) {
                            group.imageLoaded = false;

                            // Bounding box of the polygon
                            group.boundingBox = CarrotSearchFoamTree.geometry.boundingBox(props.polygon);

                            // Rectangle inscribed in the polygon. We'll set the aspect ratio of the rectangle to be the
                            // same as the aspect ratio of the image. When the group is exposed, we'll draw the full
                            // image in the inscribed rectangle.
                            group.inscribedBox = CarrotSearchFoamTree.geometry.rectangleInPolygon(props.polygon, props.polygonCenterX, props.polygonCenterY, group.image.width / group.image.height, 0.95);

                            // Check if there's enough space for the label. If not, shift the inscribed box upwards a bit.
                            var descriptionHeight = group.boundingBox.y + group.boundingBox.h - group.inscribedBox.y - group.inscribedBox.h;
                            var minDescriptionHeight = 0.125 * group.boundingBox.h;
                            if (descriptionHeight < minDescriptionHeight) {
                              group.inscribedBox = CarrotSearchFoamTree.geometry.rectangleInPolygon(
                                props.polygon, props.polygonCenterX, props.polygonCenterY - (minDescriptionHeight - descriptionHeight), group.image.width / group.image.height, 0.95);
                            }

                            // Clear the label buffer. We'll lay out the label when needed.
                            group.labelBuffer = null;
                          }

                          var image = group.image;

                          // To ensure a smooth transition between the cropped and full image view, we'll animate the
                          // image rectangle during the expose animation.
                          var mainImageBox;
                          var exposure = props.exposure;
                          if (exposure <= 0) {
                            // Not exposed, render cropped image
                            mainImageBox = group.boundingBox;
                          } else if (exposure == 1) {
                            // Exposed, render full image
                            mainImageBox = group.inscribedBox;
                          } else {
                            // Expose animation in progress, transition the image rectangle geometry.
                            mainImageBox = {
                              x: group.boundingBox.x * (1 - exposure) + group.inscribedBox.x * exposure,
                              y: group.boundingBox.y * (1 - exposure) + group.inscribedBox.y * exposure,
                              w: group.boundingBox.w * (1 - exposure) + group.inscribedBox.w * exposure,
                              h: group.boundingBox.h * (1 - exposure) + group.inscribedBox.h * exposure
                            };
                          }

                          // Set the group polygon path on the drawing context.
                          ctx.beginPath();
                          props.polygonContext.replay(ctx);
                          ctx.closePath();

                          // Since the image is larger than the polygon, we'll need to apply
                          // clipping so that we don't draw beyond the polygon's area.
                          ctx.save();
                          ctx.clip();

                          // Draw the main image
                          if (exposure > 0) {
                            drawImageInBox(image, mainImageBox);
                          } else {
                            ctx.save();
                            ctx.globalAlpha *= 0.9;
                            drawImageInBox(image, mainImageBox);
                            ctx.restore();
                          }

                          ctx.restore();

                          // Draw a subtle polygon outline
                          ctx.strokeStyle = props.exposure > 0 || props.hovered ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.4)";
                          ctx.lineWidth = 1;
                          ctx.stroke();

                          // Draws the image positioned in the provided rectangle.
                          function drawImageInBox(image, box) {
                            var groupWidthToHeight = box.w / box.h;
                            var imageWidthToHeight = image.width / image.height;

                            var scale = groupWidthToHeight < imageWidthToHeight ?
                                box.h / image.height : box.w / image.width;

                            var xOffset = box.x / scale, yOffset = box.y / scale;
                            if (groupWidthToHeight < imageWidthToHeight) {
                              scale = box.h / image.height;
                              xOffset -= (image.width - box.w / scale) / 2;
                            } else {
                              scale = box.w / image.width;
                              yOffset -= (image.height - box.h / scale) / 2;
                            }

                            group.scale = scale;

                            ctx.save();
                            ctx.scale(scale, scale);
                            ctx.translate(xOffset, yOffset);

                            ctx.drawImage(image, 0, 0);
                            ctx.restore();
                          }
                        }
                    },
                    groupContentDecoratorTriggering: "onSurfaceDirty",

                    // colors
                    groupColorDecorator: function(opts, params, vars){
                        if(params.group.color){
                            vars.groupColor = params.group.color;
                            vars.labelColor = "auto";
                        }
                    },

                    incrementalDraw: 'none',

                    // todo
                    /*
                    groupLabelDecorator: function(opts, props, vars){
                        vars.labelText = vars.labelText;
                    }
                    */
                }));
            }

            this._isNeedUpdate = false;
        }
	}
}