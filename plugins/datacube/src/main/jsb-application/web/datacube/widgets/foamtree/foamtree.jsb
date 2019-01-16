{
	$name: 'DataCube.Widgets.Foamtree',
    $parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'FoamTree',
        description: '',
        category: 'Кластеризация',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojQkIwRDQ4O30NCgkuc3Qxe2ZpbGw6IzVDQjhDRDt9DQoJLnN0MntmaWxsOiMwMEFBQkM7fQ0KCS5zdDN7ZmlsbDojMTUyRDM5O30NCgkuc3Q0e2ZpbGw6I0ZCOEE1Mjt9DQoJLnN0NXtmaWxsOiNGNzcyMzc7fQ0KCS5zdDZ7ZmlsbDojMDcxQzIzO30NCgkuc3Q3e2ZpbGw6Izk2MEM0MTt9DQoJLnN0OHtmaWxsOiNERUUyRTI7fQ0KPC9zdHlsZT48ZyBpZD0iWE1MSURfMzQyNl8iPjxnIGlkPSJYTUxJRF8zNDI3XyI+PHBhdGggY2xhc3M9InN0MCIgZD0iTTI1NiwyNTUuNXYwLjVDNTg5LjMsNjE3LDU4OS4zLTEwNS42LDI1NiwyNTUuNXoiIGlkPSJYTUxJRF8zNDI4XyIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTYuNSwyNTZIMjU2Qy0xMDUsNTg5LjMsNjE3LjYsNTg5LjMsMjU2LjUsMjU2eiIgaWQ9IlhNTElEXzM0MjlfIi8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTI1Ni4zLDQ4NmMtMTguNSwwLTM2LjYtNC4xLTUxLTExLjVjLTEwLjEtNS4yLTIzLjQtMTQuOC0yOS43LTMwLjkgICAgYy02LjgtMTcuNC00LjQtMzksNy4xLTY0LjNjMTMuMy0yOS4xLDM4LTYxLjMsNzMuNi05NmMzNS42LDM0LjcsNjAuMyw2Ni45LDczLjYsOTZjMTEuNSwyNS4yLDEzLjksNDYuOSw3LjEsNjQuMyAgICBjLTYuMywxNi4xLTE5LjYsMjUuNy0yOS43LDMwLjlDMjkyLjksNDgxLjksMjc0LjgsNDg2LDI1Ni4zLDQ4NnoiIGlkPSJYTUxJRF8zNDMyXyIvPjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0yNTYsMjU2LjVsMC0wLjVDLTc3LjMtMTA1LTc3LjMsNjE3LjYsMjU2LDI1Ni41eiIgaWQ9IlhNTElEXzM0MzNfIi8+PHBhdGggY2xhc3M9InN0NCIgZD0iTTI1NS41LDI1NmgwLjVDNjE3LTc3LjMtMTA1LjYtNzcuMywyNTUuNSwyNTZ6IiBpZD0iWE1MSURfMzQzNF8iLz48cGF0aCBjbGFzcz0ic3Q1IiBkPSJNMjU1LjcsMjI4LjdjLTM1LjYtMzQuNy02MC4zLTY2LjktNzMuNi05NmMtMTEuNS0yNS4yLTEzLjktNDYuOS03LjEtNjQuMyAgICBjNi4zLTE2LjEsMTkuNi0yNS43LDI5LjctMzAuOWMxNC4zLTcuNCwzMi40LTExLjUsNTEtMTEuNWMxOC41LDAsMzYuNiw0LjEsNTEsMTEuNWMxMC4xLDUuMiwyMy40LDE0LjgsMjkuNywzMC45ICAgIGM2LjgsMTcuNCw0LjQsMzktNy4xLDY0LjNDMzE2LDE2MS44LDI5MS4zLDE5NCwyNTUuNywyMjguN3oiIGlkPSJYTUxJRF8zNDM3XyIvPjxwYXRoIGNsYXNzPSJzdDYiIGQ9Ik0yNiwyNTYuM2MwLTE4LjUsNC4xLTM2LjYsMTEuNS01MWM1LjItMTAuMSwxNC44LTIzLjQsMzAuOS0yOS43YzE3LjQtNi44LDM5LTQuNCw2NC4zLDcuMSAgICBjMjkuMSwxMy4zLDYxLjMsMzgsOTYsNzMuNmMtMzQuNywzNS42LTY2LjksNjAuMy05Niw3My42Yy0yNS4yLDExLjUtNDYuOSwxMy45LTY0LjMsNy4xYy0xNi4xLTYuMy0yNS43LTE5LjYtMzAuOS0yOS43ICAgIEMzMC4xLDI5Mi45LDI2LDI3NC44LDI2LDI1Ni4zeiIgaWQ9IlhNTElEXzg0N18iLz48cGF0aCBjbGFzcz0ic3Q3IiBkPSJNMjgzLjMsMjU1LjdjMzQuNy0zNS42LDY2LjktNjAuMyw5Ni03My42YzI1LjItMTEuNSw0Ni45LTEzLjksNjQuMy03LjEgICAgYzE2LjEsNi4zLDI1LjcsMTkuNiwzMC45LDI5LjdjNy40LDE0LjMsMTEuNSwzMi40LDExLjUsNTFjMCwxOC41LTQuMSwzNi42LTExLjUsNTFjLTUuMiwxMC4xLTE0LjgsMjMuNC0zMC45LDI5LjcgICAgYy0xNy40LDYuOC0zOSw0LjQtNjQuMy03LjFDMzUwLjIsMzE2LDMxOCwyOTEuMywyODMuMywyNTUuN3oiIGlkPSJYTUxJRF84MzJfIi8+PC9nPjxnIGlkPSJYTUxJRF8zNDM4XyI+PHBhdGggY2xhc3M9InN0OCIgZD0iTTI2MS4zLDExMC42aC0xMy4ybC0zLjEsOWgtNC44bDEyLjYtMzVoNC4xbDEyLjQsMzVoLTQuOEwyNjEuMywxMTAuNnogTTI0OS41LDEwNi42aDEwLjUgICAgbC01LjEtMTVoLTAuMUwyNDkuNSwxMDYuNnoiIGlkPSJYTUxJRF8zNDQxXyIvPjxwYXRoIGNsYXNzPSJzdDgiIGQ9Ik0yNjcuNCw0MTZsMCwwLjFjMC4xLDMuMi0xLjEsNS45LTMuNCw4Yy0yLjMsMi4xLTUuNCwzLjItOS4xLDMuMmMtMy44LDAtNy0xLjQtOS40LTQuMSAgICBjLTIuNC0yLjctMy42LTYuMi0zLjYtMTAuNHYtNi4xYzAtNC4yLDEuMi03LjcsMy42LTEwLjRjMi40LTIuNyw1LjYtNC4xLDkuNC00LjFjMy44LDAsNi45LDEsOS4yLDMuMWMyLjMsMiwzLjQsNC44LDMuMyw4LjEgICAgbDAsMC4xSDI2M2MwLTIuNC0wLjctNC4zLTIuMS01LjdjLTEuNC0xLjQtMy40LTIuMS01LjktMi4xYy0yLjYsMC00LjYsMS02LjEsMy4xYy0xLjUsMi4xLTIuMyw0LjYtMi4zLDcuN3Y2LjEgICAgYzAsMy4xLDAuOCw1LjcsMi4zLDcuOGMxLjUsMi4xLDMuNiwzLjEsNi4xLDMuMWMyLjYsMCw0LjUtMC43LDUuOS0yLjFjMS40LTEuNCwyLjEtMy4zLDIuMS01LjdIMjY3LjR6IiBpZD0iWE1MSURfMzQ0NF8iLz48cGF0aCBjbGFzcz0ic3Q4IiBkPSJNMzk3LjMsMjY4Ljl2LTM1aDExLjRjMy43LDAsNi41LDAuOCw4LjYsMi40YzIuMSwxLjYsMy4xLDMuOSwzLjEsNy4xICAgIGMwLDEuNS0wLjUsMi45LTEuNCw0LjFjLTAuOSwxLjItMi4yLDIuMS0zLjcsMi43YzIuMywwLjMsNC4xLDEuMyw1LjQsM2MxLjMsMS43LDIsMy42LDIsNS45YzAsMy4yLTEsNS43LTMuMSw3LjMgICAgYy0yLjEsMS43LTQuOSwyLjUtOC41LDIuNUgzOTcuM3ogTTQwMiwyNDguOGg3LjdjMS44LDAsMy4yLTAuNSw0LjMtMS41YzEuMS0xLDEuNy0yLjMsMS43LTQuMWMwLTEuOS0wLjYtMy4zLTEuOC00LjIgICAgYy0xLjItMC45LTIuOS0xLjQtNS4yLTEuNEg0MDJWMjQ4Ljh6IE00MDIsMjUyLjV2MTIuN2g5LjFjMi4yLDAsMy44LTAuNSw1LTEuNmMxLjItMS4xLDEuOC0yLjYsMS44LTQuNWMwLTEuOS0wLjYtMy41LTEuOC00LjcgICAgYy0xLjItMS4yLTIuOS0xLjgtNC45LTEuOWgtMC4zSDQwMnoiIGlkPSJYTUxJRF8zNDQ2XyIvPjxwYXRoIGNsYXNzPSJzdDgiIGQ9Ik04OS4yLDI2OC45di0zNWgxMWM0LjYsMCw4LjIsMS40LDExLDQuMmMyLjgsMi44LDQuMiw2LjQsNC4yLDEwLjl2NC44ICAgIGMwLDQuNS0xLjQsOC4xLTQuMiwxMC45Yy0yLjgsMi44LTYuNSw0LjItMTEsNC4ySDg5LjJ6IE05NCwyMzcuNnYyNy42aDYuM2MzLjIsMCw1LjgtMS4xLDcuNy0zLjJjMS45LTIuMSwyLjgtNC45LDIuOC04LjJWMjQ5ICAgIGMwLTMuMy0wLjktNi0yLjgtOC4xYy0xLjktMi4xLTQuNC0zLjItNy43LTMuMkg5NHoiIGlkPSJYTUxJRF8zNDUwXyIvPjwvZz48L2c+PC9zdmc+`
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

                                if($this._schemeOpts.series[i].skipEmptyNamedGroups && (!name || name.length === 0)){
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