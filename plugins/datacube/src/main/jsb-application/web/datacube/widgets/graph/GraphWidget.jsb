{
	$name: 'DataCube.Widgets.GraphWidget',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Граф Болконский',
        description: '',
        category: 'Диаграммы',
        thumb: 'data:image/png;base64,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'
    },
    $scheme: {
        type: 'group',
        items: [{
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
               name: 'Список связей',
               type: 'item',
               key: 'linkList',
               binding: 'field',
               itemType: 'string',
               itemValue: '$field'
            },
            {
                type: 'group',
                name: 'Группы',
                key: 'graphGroups',
                multiple: true,
                items: [
                {
                   name: 'Список вершин',
                   type: 'item',
                   key: 'nodeList',
                   binding: 'field',
                   itemType: 'string',
                   itemValue: '$field'
                },
                {
                   name: 'Способ отображения ячейки',
                   type: 'select',
                   key: 'view',
                   items:[
                   {
                       name: 'Простые графы',
                       type: 'group',
                       key: 'simpleGraph',
                       items: [
                       {
                           type: 'item',
                           name: 'Заголовки',
                           key: 'header',
                           binding: 'field',
                           itemType: 'string'
                       }
                       ]
                   },
                   {
                       name: 'Встроенный виджет',
                       type: 'group',
                       key: 'widgetGroup',
                       items: [{
                           name: 'Виджет',
                           key: 'widget',
                           type: 'widget',
                       }
                       ]
                   }
                   ]
                }
                ]
            }
            ]
        }
        ]
    },
	$client: {
        $require: ['JQuery.UI.Loader', 'JSB.Widgets.Diagram'],

        _nodeList: {},

        $constructor: function(opts){
            $base(opts);
            this.loadCss('GraphWidget.css');
            this.addClass('graphWidget');

            this.diagram = new Diagram({
                minZoom: 0.25,
                highlightSelecting: false,
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
                        /*
                        joints: [
                        {
                            name: 'offsStart',
                            position: function(){
                                var ptStart = this.getLink().getSourcePosition();
                                var ptEnd = this.getLink().getTargetPosition();
                                var dist = Math.sqrt((ptEnd.x - ptStart.x)*(ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y)*(ptEnd.y - ptStart.y));
                                var offs = dist / 4;
                                if(ptStart && ptEnd){
                                    return {x: ptStart.x - 40, y: ptStart.y};
                                }
                                return null;
                            }
                        },
                        {
                            name: 'offsEnd',
                            position: function(){
                                var ptStart = this.getLink().getSourcePosition();
                                var ptEnd = this.getLink().getTargetPosition();
                                var dist = Math.sqrt((ptEnd.x - ptStart.x)*(ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y)*(ptEnd.y - ptStart.y));
                                var offs = dist / 4;
                                if(ptStart && ptEnd){
                                    return {x: ptEnd.x + 40, y: ptEnd.y};
                                }
                                return null;
                            }
                        }
                        ],
                        */
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
        },

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;

            $base();

            this.getElement().loader();
            this.diagram.clear();

            var graphGroups = this.getContext().find('graphGroups').values(),
                viewList = [];
            for(var i = 0; i < graphGroups.length; i++){
                var viewSelector = graphGroups[i].find('view').value();

                if(viewSelector.key() === 'widgetGroup'){
                    var widgetSelector = viewSelector.find('widget');

                    viewList.push({
                        jsb: widgetSelector.unwrap().widget.jsb,
                        wrapper: this.getWrapper(),
                    });
                } else {
                    viewList.push({
                        header: 'header'
                    });
                }
            }

            JSB.chain(viewList, function(d, c){
                if(!d.jsb){
                    c();
                } else {
                    JSB.lookup(d.jsb, function(cls){
                        d.cls = cls;
                        c();
                    })
                }
            }, function(){
                $this.fetch(viewList);
            });
        },

        fetch: function(viewList){
            var source = this.getContext().find('source'),
                graphGroups = this.getContext().find('graphGroups').values(),
                nodeList = this.getContext().find('nodeList'),
                linkList = this.getContext().find('linkList');

            source.fetch({readAll: true, reset: true}, function(){
                var links = [];

                while(source.next()){
                    for(var i = 0; i < graphGroups.length; i++){
                        var entry,
                            viewSelector = graphGroups[i].find('view').value();

                        if(viewList[i].header){
                            entry = {
                                header: viewSelector.value().value()
                            }
                        } else {
                            entry = {
                                widget: {
                                    wClass: viewList[i].cls,
                                    wrapper: viewList[i].wrapper,
                                    value: viewSelector.value().value()
                                }
                            }
                        }

                        $this._nodeList[nodeList.value()] = $this.diagram.createNode('graphNode', {entry: entry});
                    }

                    var flag = true,
                        curLink = linkList.value();
                    for(var i = 0; i < links.length; i++){
                        if(links[i].source === curLink.source && links[i].target === curLink.target || links[i].target === curLink.source && links[i].source === curLink.target){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        links.push(curLink);
                    }
                }

                for(var i = 0; i < links.length; i++){
                    var link = $this.diagram.createLink('bind');
                    link.setSource($this._nodeList[links[i].source].connector);
                    link.setTarget($this._nodeList[links[i].target].connector);
                }

                $this.getElement().loader('hide');
            });
        }
    }
}