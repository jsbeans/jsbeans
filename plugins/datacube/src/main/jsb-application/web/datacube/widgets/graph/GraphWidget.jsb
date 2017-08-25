{
	$name: 'DataCube.Widgets.GraphWidget',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Граф',
        description: '',
        category: 'Диаграммы',
        thumb: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlz
                                      AAAOwgAADsIBFShKgAAADD1JREFUeF7tWwd3E0kS5gfv7m262/du94B7cDzSkmwwSzAmrgO2cV5w
                                      wgbjHHDEEUfJlqNsSTMKpq6/llq0RjUaedd6SPtU75X7c1d/3SVV18x0a/oExeTw8FCWnz59kiVE
                                      1UEUDoVC8TacnauDBINBWdrZOb7iQDg7hzkOxImfLf7lAxKTbPHvBAA0EokklHYYHaZqy9VBTdNM
                                      aef4imNn5zDH0bEdP1v8y2dITLLFvxP4cqGIEEoYrHU6RoeqDWfn6qCYGansHF9x7Owc5jg6tuNn
                                      i3/5DIlJtviXD0hMssW/nLmpu6aHqbP4LL2+e5o67v1XKofbfjtJPaXXyPR5HfvnxrKzc3zdP87O
                                      YY6j45zJkJZr35C5Pk6hzSlH3ZnuoJ5nVxz758ays3N8brY78TkOROGcCUh74Xfsl2+nHSJjnPrn
                                      xrKzc/yMBAQNoEglhbk6hQOBQEo7Vwf1+/0p7RxfcaAISFBkiKe1ioLuMTKWh8l0jcq6zY4aCiwN
                                      kavuCZlrozIg7eLS5dQ/N5adnePr/nF2DnMcHedUhphr72mm4DzN371KYyf/SeuvyuljSQEt3L9O
                                      3rEOctU/lYHJ6QzBlwvFTQUlDNY6HaND1Yazc3VQzIBUdo6vOFCZIRsTtPT0NrkbS8nd8Iw2Wipp
                                      pfw+rf9RRrsDzbT46Cbt9L2UAXl955Rj/9xYdnaOr/vH2TnMcXScv4fE5K/6x9k5zHEgCudEQILh
                                      T1Rz8R/kne+mg8U+R3UP1VN/RaFj/9xYdnaOn5GAAECRMnpph9FhqrZcHRSpmsrO8Q3DpOGFENX0
                                      B2l6fJJ6ym7QO/E42/3sqlTg+xd/lbjk8mVqK7lCb59cpuG6YgoGfI796/jP+Kc4dnYOcxwdZ22G
                                      LG0eUmV3gGbdifVWTnVvSOLV7TC1jYUdZyBXBzmqfxBuLCe+k39ZF5Cdgwg1DoWoby5CAcP5A6uA
                                      AFf1hWj3wJT/Q6xt9RKi46wJCABUpQyXRjpGh6na6nXu2ffUeuM7ar/5o7gp/xAtU2j9w3v0csSk
                                      AyPKT+eSUNUTfeoDXt2KUNOgL8FuxYEDL7Xd/Cl5fBv/Ou6epFDQiPP1PnPukvWm+AyZG+ltd0Db
                                      Cr5N4KczA/UMgZR1BcgM2fu30NdCC52/s+NzOl5bSOuzI3G+3mdGMgRfLhQRQgmDtU7H6FC14ex6
                                      HdYC3Ie0Uzza6nzMJoW5/oGRIXr9isek5tHEOh3Pvmuixa5ydnxOJxtvk2tqIM7X+0zHPyvmODrO
                                      aIZgLYAPtXDvGu0OtsgFnff9a9qfeEPrTWX08cEN2htuI1ftY9kOAdH5fyZDwKnsDVIgGJ1cShSe
                                      6/5DBsTdJBaXQrHtsjfUSrtDLbTb/4qmr56lgw/vaPFhYTwg7g+Dcb7eZ0YyRP4VoioyEZCVimLy
                                      tFfLAKCc/N/P8sMDm64xWqsqOdaAuHYOqXU8lNQWogKCsbG6n7l+jlYrH9BiSaEMzurz4qjP5fe+
                                      TEDQAIpUUpirU/gom4vY4MOHQnbgw7vrn9F2VwN5R1+LgDTTxqsKmTFrLx5R0DMpA6Lz09m8qxD3
                                      DL1eccpF/e5+YluUH97Uy4D45/tps7OWPK2V0if4t93dSJ62apkhy2V3yVgZkQFZHutlx8+5zUX8
                                      YISApKvHlSGQNWTJWDJ/rvvl0e4hDUUiQ4bY8dPxT4nCHAeicEYDMvO2nt4V/0JDZRccdbD0vHzE
                                      1Pl/JSCQyl6TAmair971FWq9/g3rA6ctV78mY3+XHT8jAQGA4i6vl3YYHaZqm1AXDtO+x0U7qwu0
                                      sTgty62VOVla8bbQUNBM4CON433ZjKmvQ1DqnOXNkMwS3Y4y4N1JGr+0YYI8yxafVubJONhL4qOE
                                      puOfFXMcHWc0Q3SsZoadneOnMwNTZQjqnouAYV1ix1dS3uWXpZ2d46fjnxKFOQ5E4Zz5PcQM+Ghj
                                      bpRc4nq+PjMiFbi0eiCOUa5M9IuZPSt9RF9r2xFqEesSrn8dIyCp7Dp/f9MVH0v3RS8lnh4m/95W
                                      Al//TFz/OZMhbbd+orGaApqov+Wo/U/P0lRbpewLrlaKLPGbEdkPN2bk8JPINENizg5ReGtpWj58
                                      cONy2nz1K3GJ3I7zHTNE/hWiKrI1IO2F37NPQXaq/0CFJ662scRLG0Th7YNPwp6ef9PiUXmlt5od
                                      k1NMIs/8eJzvGBAAKFJGL+0wOkzVlquDqpuZnZ3j6zdAzMqQWKv4ZnuSPrRvtleuYwIfByi4PiHr
                                      1E+4il/ebZDf4MeccYVpaD49/z50vJAB8S/0k+keS/ZlJuqff65PlgjI+uxonK9/Jq7/HMoQsWhc
                                      fU9TF0/Ffku/Rx5Ruuqe0lzRJbmwm79zxfYlh5WtMLWPh9kxe2cjtORJN0NqZEDWqh/KrRes8rHA
                                      Xat5ROsvy+nD5dNiYdlFC3evxgNypAyRf4WoimwOCF75WXx8i+Z/+5Xmbl2Sq2rsk61WldDBdLd8
                                      AWJ//A0bEOAq8UTmM6L3EoiyNw2HaN93tIBg68Xz+gVNnvs5uvUi/MJEWXpSRIaYFHO3L0t//96X
                                      LPFFY1sD72Ttj3dSYHFIbm/gC/DP98lNS5RoZ71kAS9vhsUTV/IloxqbkcbRLln4sn0z3fIShcsT
                                      fAosDsr/4c/eSHs8IH/TS1b6N3XDPUpvis+y/Vd0m0m/l1T3hdL2b/ZdIy11VbDjcjpSeYW2Fqfi
                                      fMcMCYvVNBQNUeILt9bp2DCMeBvOztVBsSmZys7xwdnzhalx0KT6J4+p+cb31GLRygvJda+uf0fl
                                      DePk2U3uf2nDpOb3ZrwuGAyL1b6Rln+zrhA979ii5pv/ThqT1YIf6E3JOQqKrFB9qXG4/lFm7cIw
                                      GDqkzokANQ4FaT8QTWmOY/2BSo3jMw+pbsCk/rmQWGd85odF+bzHpEAwWodsqRuI7rbq/eh40xuh
                                      mn6DBufFFxf6bFccvS3H1zHH0XHWXbIikUOaWj2k2oEQfVxPfmHBykm1dYJATK1FxCUpKF+egKDd
                                      6ra4J8WeuHZ9Yg0iMOcfFpNoB7tfBBii2/WxVL1u5zDHgSic0Zt64GCPekuvx89t6Oc4rLjz/hma
                                      GBoRX7BJo0vRWY3ZlKp/4FSbi6rOJ9Yfv1f1UtudM/Exi06flLiu4DSVi0dV3b/eshvUO+ml2n5T
                                      Zofelz5+Ov5ZMcfRcUYzBGc0dqY72ZudVfHebt3FrygU/sxPZwY6bS4qwTZ6ui9cbE29ptaH15LG
                                      0ktIRjJE/hWiKo4zIOon3HQVj7Y6/zgD0l7wLTumnSJbrGPpJSQjAQGAqpTh0kjH6DBVW71OvXWC
                                      BZSxOiKf07HdgO0NrCe2e5rkT7jb7xpkOwRE5x/XJQuKgGBsLCZRxs+XuMdpE/6J9Yyr9omsgy+4
                                      dFnHsvaZc5cslSFYTa83ldLYf36klecPaK7oMrkbfxcr66KMvOSgRG+LgBjLIzRbeEGuosdO/ktu
                                      deAIA86b7E++lQFBoODLF8sQfLlQRAglDNY6HaND1Yaz63UqQ3B+w9NaJd/o2MJuqSgxK1cq7svX
                                      gBAw9ZKDzsdsUpjrH9jusVevgyIgyEx5vqThmZwQG83PpQ94PQl+4PAP9sT0DLH2pdel458V2/mn
                                      cP4eYqNfLEPkXyGq4jgDgjMa7uFG9gyHVb0LPdR87esE/nEExBDm9okwvTj/tRyDG9uqawO1NFBZ
                                      lDSWXkIyEhAAKFJGL+0wOkzVVq8z/Ac0XPdAnt/AuQ11pkM/36Fwj1ivbC5OJ/D1G6DdOfV7Z07F
                                      MUp1Tt2755UbiWVdJi16wrQxPyHHsBtf92+4XtzTjIDj59P94+wc5jg6zmiG6FjNDDs7x9dn01HP
                                      qT+4dEnu7irh+ufGsrNzfG62O/E5DkThnAkI7i/cl2+n3O8hegnhxrKzc/yMBAQNoEglhbk6hY/y
                                      KqmO1SuUdnaOr792iYDg9wVP/px6VBT+khmSP6ceq9MxOlRtODtXB8UMSGXn+IoDlRmSP6eeHMH8
                                      PSSZA+HsHOY4EIVz5ynrev6cOovRYaq2XB0UqZrKzvEVB+r5OMWeU7fi/Dn1mCjM1UGyZQba8bPF
                                      v3xAYpIt/uXMJYuzc9jpkmDHzxb/8hkSk2zxL2fWIZydwxxHx3b8bPEvnyExyRb/8gGJSbb4lzOb
                                      i5ydw06bd3b87PAvSP8HfEezzimbMNEAAAAASUVORK5CYII=`
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
                },
                /*
                {
                    type: 'item',
                    name: 'Высота ячейки',
                    key: 'itemHeight',
                    binding: 'field',
                    itemType: 'string'
                },
                {
                    type: 'item',
                    name: 'Ширина ячейки',
                    key: 'itemWidth',
                    binding: 'field',
                    itemType: 'string'
                }
                */
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

            JSB().loadScript('tpl/d3/d3.min.js', function(){
                $this._isInit = true;
            });

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
                var links = [],
                    nodes = [];

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

                        var nl = nodeList.value();
                        if(JSB().isArray(nl)){
                            nodes = nl.reduce(function(arr, el){
                                arr.push({
                                    id: el,
                                    entry: entry
                                });
                                return arr;
                            }, []);
                        } else {
                            nodes.push({
                                id: nodeList.value(),
                                entry: entry
                            });
                        }
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

                if($this._isInit){
                    $this.createGraph(nodes, links);
                } else {
                    JSB().deferUntil(function(){
                        $this.createGraph(nodes, links);
                    }, function(){
                        return $this._isInit;
                    })
                }
            });
        },

        createGraph: function(nodes, links){
            try{
                /*
                var itemWidth = this.getContext().find('itemWidth').value(),
                    itemHeight = this.getContext().find('itemHeight').value();
*/
                    var simulation = d3.forceSimulation()
                                       .force("link", d3.forceLink().id(function(d) { return d.id; }));

                    simulation.nodes(nodes)
                              .on("tick", ticked);

                    simulation.force("link").links(links);

                function ticked(arg) {
                    $this.diagram.clear();

                    nodes.forEach(function(d){
                        var node = $this.diagram.createNode('graphNode', {entry: d.entry});
                        node.setPosition(d.x, d.y)
                        $this._nodeList[d.id] = node;
                    });

                    links.forEach(function(d){
                        var link = $this.diagram.createLink('bind');
                        link.setSource($this._nodeList[d.source.id].connector);
                        link.setTarget($this._nodeList[d.target.id].connector);
                    });

                    simulation.force("collide", d3.forceCollide().radius(function(d) {
                        /*
                        if(itemWidth && itemHeight){
                            var r = Math.sqrt(Math.pow(itemWidth, 2) + Math.pow(itemHeight, 2));
                        } else {
                            var r = Math.sqrt(Math.pow($this._nodeList[d.id].getElement().width(), 2) + Math.pow($this._nodeList[d.id].getElement().height(), 2));
                        }
                        */
                        var r = Math.sqrt(Math.pow($this._nodeList[d.id].getElement().width(), 2) + Math.pow($this._nodeList[d.id].getElement().height(), 2));
                        return r;
                    })
                    .iterations(1));

                    JSB().defer(function(){
                        $this.getElement().loader('hide');
                    }, 300, 'simulations_defer_' + $this.getId());
    /*
                    JSB().defer(function(){
                        simulation.force("collide", d3.forceCollide().radius(function(d) {
                            var r = Math.sqrt(Math.pow($this._nodeList[d.id].getElement().width(), 2) + Math.pow($this._nodeList[d.id].getElement().height(), 2));
                            return r;
                            })
                            .iterations(1));
                    }, 100, 'simulations_defer_' + $this.getId());
    */
                }
            } catch(ex){
                console.log(ex);
                simulation.stop();
            } finally {
                JSB().defer(function(){
                    $this.getElement().loader('hide');
                }, 300, 'simulations_defer_' + $this.getId());
            }
        }
    }
}