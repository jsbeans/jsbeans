{
    $name: 'DataCube.Widgets.SummaryInterval',
    $parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Интервал',
        description: '',
        category: 'Кешиф',
        thumb: `data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlz
                                       AAAOwgAADsIBFShKgAAAC85JREFUeF7tXGdT48gW3X+9/2H/xNsPW7tVM/PCDDkNGDDJOeeIc8AJ
                                       DCad16ctDUKWbAOCwXhu1eHi9pXU3afD7dst/4Zf8q5kbgm5vyfuFeg/Cyh2WjFKs1rmkpBmq4ND
                                       Twj/LH7HsS8CRyAmwf8PvWEcCe0MxuCLphBKZBHLnMIpvv+yasPt3Z1yl9eRuSOk0WrDE07Iyj4Q
                                       pFBPA5L0v819cX1HudPryFwR0rvowx2K/6jkpxBCqPYc0l5L5oaQOzHU+GPGFTwtaM+hq9u7UO5q
                                       vcwNIblSFd5IcqSCtZ8nQbVP5orKXa2XEUJub2+RSCSQyWSQz+cRiURkF2ULs0Lf6/UboHfel5O0
                                       JERA1Qfu4KPPk7S0j/JzQpZnUlmfo0cIaTQaODo6Qi6XQyAQQLFYRP/iAr1eD1dXV0N9eSn1pdDn
                                       en1+PlZfUPf7D1rcuz9JC6ha+7+hrYF2B6JwB6NwBSJD7R/qPYdX8zk2Roel3qd9KIZDdwCdbvdx
                                       nVCLtMEE/cjeQI8QQpay2SxqtRo6nQ4KhYLyzWxKtXEGt+JV6fHcIYs9plRrKE+wVj70HHJ9fWNK
                                       BvFcQgiuTV5DPjQh8ezpcPzXVKoWLyHEK+YSjvtWy4clhEOVugA0w0sI4ar++uZWeZp18m4JYYgi
                                       mMigI3x+1QuZVlqd3kQyiJcQwgUmV/1Wi+GkHo1GUS6X0RVewenp64yV44SudyyTx7/+vYLvR25Z
                                       uVzUBWJphJM5uQ7IFiooVOqotzqSgPpZW9qmxHfj5g0tXkIIkS2UlRxbJyOE0DV1uVxyDeL1eiUh
                                       dE/plt3c3Eynr6+lvhaa7t4jPRiM1Xx+OJmRLXDf6YdHaDO4hCvqFK6sQ7indpcf/yxu4sgbGn4f
                                       VuzGaF7z8DkhdGysHtonpOvrFdon1iOGdSDKYKj1dgZ6hBBWTDAYRDqdlmuQeDyufPM2wpavTsQH
                                       7pe14El4qT3JsXpif1dzSLvbg0u01h8V8M4JeY2J/d0Qcnd3j0A8/ajA750QDqvNdlcpgTXybgip
                                       Nlojk/F7J4TIFStKCayRd0EIPTt9QYlZICSaziulsEbeBSG1pugdoVFXdRYIoQNi5bRuSAgjvalU
                                       SobgQ6GQbMHq4mwa/RTciDWHXymYHnZX0DDdDAyPG6Wb4SX2alh+OLHfTF03k/QIIe12G5ubm3JP
                                       hOF3Rn7pI/OC1wD3qKVnxUJGhwVVtbpf8ShdZ6PVB57hfoXZ9+PtRYufoIf2w8ajau4g0js0Kttz
                                       YNhDSECr1ZL7CfV6XUm1XtjVeapDFtoAszJklarWheJ/6hzSVXby9IVUMQuEEImsdXtGP5WQeKZg
                                       WEAVs0IIg6BWyU8j5HIwGNs7iFkhxBGIyvHfCvlphGSL5R+ToxlmhZATf1Q0sGulZC+TEUIYcU0m
                                       kzKw2Gw2petrtdBN1B5YM8OsEMIgIzfErJARQhj+djqdMuzu8/kkMTwx0hHuME9wjOhOR54A0Wp6
                                       Z10jLe7DPZZYKgunLyRPgTj94VHtH+rdY4888TEeD9fsnQh7s3tS+1Q9fPYPezUvUkel5kmVR5qn
                                       VIQ9tfrZoWpvEPF0Dm3hmbL+JmpRd9zS0OojdwDbBw5jQsLhsFwcVioV2VusFNk7dDErM8xKDyFC
                                       yaxSwqcJZ570aRnr+04s7Ry9/RzCYJxnwtyhYpYIYejnORN7rjg8UekS13MuejNCmFk+2O4KGBbI
                                       CLNEiAyhXN8opZ1Omu2OnH94/ZsTwn3yz6s72DpwjxTGDDPVQ0TFcl9/WuEhDu1I8eaEMGa1J3rH
                                       JFdXi1kihMg84dBDrvSwVU2YEsKhhXEsnjOlC0wP4KXCiC4fzreTPjIh4Skn9oEY2vSLYlNC6OIy
                                       5M7wO91eHnKg58XDDww6PkcncwV5UoPRW2qOmw8nPRTN0x86yFMnBulm4PxkeG8TrZ4i0abzNImZ
                                       pv2470+EWy3LfHUlh2gjze+jwu3XP49R42NvaJQQri329vbkawh0eekCv0Q6vXPB/nAR+NF7CN9T
                                       PO9fKiU3lssr45DRm8whnLj8sYeDCx+dEG8khdPK+O0KRoaNrn0TQjhxecIPBHx0QohIKqeUflQu
                                       RO8xC6i+OiH6FyyJeSDEKSO/SiXohGQZXUO8KiF3Ikf6M1bEPBDiCsbR6vaUmngQnj/WHgLU41UJ
                                       4SFo7VClYh4IIfQvheoXgUYwJYRuWalUktHearX65OCi0VClYl4I4Tyh/cUHvm01qdymhPAoCiO9
                                       DLv7/X5JDkPEXE/cKusKVZO8a43mQpInws18dXUdon5+tAYwWlc4ua4YTTfDuHWIUZ4mrSuea88X
                                       RHki3ykQEWsOVzA68TrTdQiF+xd82ZMnTrhAnFZOyzVZAUYtgJiXHkKs7Tvw9+LW1OW1fA7hgmjS
                                       LuA8EULYn2BvKSFmXpUe80bIU+wtJSRfroqhanJF/yLEHJYRci68qnH+tRa/CDGHJYTwpUdWstED
                                       jPCLEHO8mJDh5nxJLoIq9bOpUKw1UDZIN0Ox2jBMN8Ms25frTflzHWMJUTeqfsnbiSkhXCD+8ccf
                                       2NnZUVIeCwNoqUxOYpIUSmWEYwnkC0WJI6dH7iKaSSAcQySehD8UQfOshb3DE7n4NJNjlxeJtFiA
                                       +QKoNZrw+EOmJ0CYfuLyiTxV4HD75XOYNzN7PvfgxIVG8wxuXxCxZFo+a5wwDw63TzTmc4Si499i
                                       Zvk8/iASYgHJfJgSwnemf//9d/kjAmZSqdbRFQ+dJK1WB+VKDYcnbviCEZnJusi0mfCe8WQGudOi
                                       DFln8wWcn5v/ilun25MkJNM5nIiKYAWaEc4KDkfFalpUListLPLCRmVGSI87qMLG4fELnRCEZGRD
                                       GSeVak2S7Q2EZL7GCes5XyjhtFgSz/CNH7KYee4cfv78GV+/flVSh8L8s7VX66PvRuj34UkcH8qH
                                       s2L5cG5pqqK3P2u1Zcs5v7jAYHCNU3GttsL09lUx9pIU2l0NBvK3rMbZlypVaU/CW+3OSOPQ2vM+
                                       zHv/8gqFYhntTlfuqmpFf/+rq4G8NxtFR9hrRW/LfLBBMM9siGMJYWzq27dvMlN//vmnDKdMg/X1
                                       dcN0M8yT/STbiYQsLCzI///66y85yU8Dm81mmG6GebKfZDuWEAojvp8+fcKXL1+UlMnCU/NPkXmy
                                       n2QrCeExH0Z4tVLMRLB35IfHvoVoKoHVpQ1EY2HYT4wnqUzEiWNfHJ2zMrKZBFbWbIiETuAIJBQL
                                       rdwjcGRDKJbB8sIiQl4/Nvdd8B3uIJKuKjZauYVzdxOJbBFeRwD5uB92TwAO2zoy5ZZio5HbS2yv
                                       bcDnP8bnrwtwnRzCLzy376vrqPWuFKMHuR+0sbqyhnQqjO92N1wHW4ilUthYXsNZf9S7uzqrYGnd
                                       hoTfKcqXxN76EgqneSwurqN/O+oc9Ns1xLN5RJ378MVT2F5ZRE54a0ubduh/J/s3EsGNKL4Hcnb2
                                       8I5DNpsWyKMiMnm8u49yvwr7YUSmGUk2LexzKeERJRE68qLZyuLEJ9LyRi7iNdLpMnKJKNZXlrAj
                                       7M+yMQREWj5rYH/TRbrQgO94B//5tCz3F0pJHxLFprAfdbuvz+ootooiPy2UhAPBsiRcLpTa4v/c
                                       40mV0i2VRH4zODx0YmX7EMlUGnGnHeXzirAfXYfxl5K6mTy2979jw/ZdlKWNgBiK2r0Msg0Db+3+
                                       TjgGeaRzOeQi+0iXL7FvO0BPlFX/VslvfJ+DG1LU/OFLVUrZKHbsLjh2NxCKJ7C8uIJoPIxdUXlG
                                       kos5sS/czZX//o3tAzuWVzcRDTtw5DVyEe8ROt6FN5jG9sYmYsEANnZO4D+0IZgwOo55C5foIYFY
                                       Eltrm4j7vbCJtYzTtiFIMXhRhj1kfVWslGtodvuIeI/hES7o1toqqp3Rc1P3gw7WlpcRjfixvnsM
                                       1+EWwqLM6yKtcWHUQ6pYXN5GJZ9GLF+BfW1J1KHoIQtLuDDoISxvvdlAzGWHKxLH9vKC6I0ZLK7u
                                       jvYQ/uFPw7KXaF3RX/IzBPg/V1LH+vrP9SwAAAAASUVORK5CYII=`
    },
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            itemType: 'string',
            itemValue: ''
        },
        {
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                name: 'Дата',
                type: 'item',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field',
                description: 'Массив дат в формате Date или String'
            },
            {
                name: 'Количество',
                type: 'item',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field',
                description: 'Количество значений для каждой даты'
            },
            {
                type: 'item',
                name: 'Автоподсчёт',
                optional: true,
                editor: 'none',
                description: 'Автоматический подсчёт количества значений для каждой даты (считается количество одинаковых дат)'
            }
            ]
        }
        ]
    },
    $client: {
        $require: ['JQuery.UI.Loader'],

        $constructor: function(opts){
            $base(opts);

            JSB().loadScript('tpl/d3/d3.min.js', function(){
                // $this.init();
            });
        },

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.summaryInterval = d3.select(this.container.get());
            this.DOM.histogram = this.summaryInterval.append("div").attr("class", "histogram");

            this.DOM.histogram_bins = this.DOM.histogram.append("div").attr("class", "aggrGroup")
                .on("click", function(){
                /*
                  if(d3.event.shiftKey && me.highlightRangeLimits_Active){
                    // Lock for comparison
                    me.browser.flexAggr_Compare_A.minV = me.browser.flexAggr_Highlight.minV;
                    me.browser.flexAggr_Compare_A.maxV = me.browser.flexAggr_Highlight.maxV;
                    me.browser.setSelect_Compare(false);
                    this.initPos = undefined;
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                  }
                */
                });

            this.DOM.highlightRangeLimits = this.DOM.histogram_bins.selectAll(".highlightRangeLimits")
                .data([0,1]).enter()
                .append("div").attr("class","highlightRangeLimits");

            this.DOM.timeSVG = this.DOM.histogram.append("svg").attr("class","timeSVG")
                .attr("xmlns","http://www.w3.org/2000/svg")
                .style("margin-left",(this.width_barGap/2)+"px");

            var x = this.DOM.timeSVG.append('defs')
                .selectAll("marker")
                .data([
                    'kshfLineChartTip_Active',
                    'kshfLineChartTip_Highlight',
                    'kshfLineChartTip_Compare_A',
                    'kshfLineChartTip_Compare_B',
                    'kshfLineChartTip_Compare_C',
                ])
                .enter()
                .append('marker')
                    .attr('id', function(d){ return d; })
                    .attr('patternUnits', 'userSpaceOnUse')
                    .attr('viewBox', "0 0 20 20")
                    .attr('refX', 10)
                    .attr('refY', 10)
                    .attr('markerUnits', 'strokeWidth')
                    .attr('markerWidth', 9)
                    .attr('markerHeight', 9)
                    .attr('orient', "auto")
                .append('circle')
                    .attr("r",5)
                    .attr("cx",10)
                    .attr("cy",10);

            this.insertChartAxis_Measure(this.DOM.histogram, 'w', 'nw');
            this.initDOM_Slider();
            this.insertVizDOM();

            this.isInit = true;
        },

        insertChartAxis_Measure: function(dom, pos1, pos2){
            this.DOM.chartAxis_Measure = dom.append("div").attr("class", "chartAxis_Measure");
            this.DOM.measurePercentControl = this.DOM.chartAxis_Measure.append("span").attr("class", "measurePercentControl")
                .each(function(){
                    /*
                    this.tipsy = new Tipsy(this, {
                        gravity: pos1, title: function(){
                        return "Label as "+kshf.lang.cur[(me.browser.percentModeActive?'Absolute':'Percent')];
                        },
                    });
                    */
                });

            // Two controls, one for each side of the scale
            this.DOM.scaleModeControl = this.DOM.chartAxis_Measure.selectAll(".scaleModeControl").data(["1","2"])
              .enter().append("span")
                .attr("class", function(d){ return "scaleModeControl measureAxis_" + d; })
                .each(function(d){
                  var pos = pos2;
                  if(pos2==='nw' && d==="2") pos = 'ne';
                  /*
                  this.tipsy = new Tipsy(this, {
                    gravity: pos, title: function(){
                      return kshf.lang.cur[me.browser.ratioModeActive?'AbsoluteSize':'PartOfSize']+
                        " <span class='fa fa-arrows-h'></span>";
                    },
                  });
                  */
                });

            this.DOM.chartAxis_Measure_TickGroup = this.DOM.chartAxis_Measure.append("div").attr("class", "tickGroup");

            this.DOM.highlightedMeasureValue = this.DOM.chartAxis_Measure.append("div").attr("class", "highlightedMeasureValue longRefLine");
            this.DOM.highlightedMeasureValue.append("div").attr('class', 'fa fa-mouse-pointer highlightedAggrValuePointer');
        },

        initDOM_Slider: function(){
          var me=this;

          this.DOM.intervalSlider = this.DOM.summaryInterval.append("div").attr("class","intervalSlider");

          var controlLine = this.DOM.intervalSlider.append("div").attr("class","controlLine")
            .on("mousedown", function(){
              if(d3.event.which !== 1) return; // only respond to left-click

              me.browser.DOM.root.attr("adjustWidth", true).attr("pointerEvents", false);
              var e = this.parentNode;
              var initPos = me.valueScale.invert(d3.mouse(e)[0]);

              d3.select("body").on("mousemove", function(){
                var targetPos = me.valueScale.invert(d3.mouse(e)[0]);

                // me.setRangeFilter(d3.min([initPos,targetPos]) , d3.max([initPos,targetPos])); // filter

              }).on("mouseup", function(){
                me.browser.DOM.root.attr("adjustWidth", null).attr("pointerEvents", true);;

                d3.select("body").on("mousemove", null).on("mouseup", null);
              });
              d3.event.preventDefault();
            });

          controlLine.append("span").attr("class","base total");

          this.DOM.activeBaseRange = controlLine.append("span").attr("class","base active")
            /*
            .each(function(){
                this.tipsy = new Tipsy(this, { gravity: "s", title: kshf.lang.cur.DragToFilter });
            })
            // TODO: The problem is, the x-position (left-right) of the tooltip is not correctly calculated
            // because the size of the bar is set by scaling, not through width....
            .on("mouseenter", function(){ this.tipsy.show(); })
            .on("mouseleave", function(){ this.tipsy.hide(); })
            */
            .on("mousedown",  function(){ this.tipsy.hide();
              if(d3.event.which !== 1) return; // only respond to left-click
              if(me.scaleType==='time') return; // time is not supported for now.

              /*
              me.browser.DOM.root.attr("adjustWidth",true).attr("pointerEvents",false);

              var e=this.parentNode;
              var initMin = me.summaryFilter.active.min;
              var initMax = me.summaryFilter.active.max;
              var initPos = d3.mouse(e)[0];

              d3.select("body").on("mousemove", function() {
                me.dragRange(initPos, d3.mouse(e)[0], initMin, initMax);
              }).on("mouseup", function(){
                me.browser.DOM.root.attr("adjustWidth",null).attr("pointerEvents",true);;
                d3.select("body").on("mousemove",null).on("mouseup",null);
              });
              d3.event.preventDefault();
              d3.event.stopPropagation();
              */
            });

          this.DOM.rangeHandle = controlLine.selectAll(".rangeHandle").data(['min','max']).enter()
            .append("span").attr("class",function(d){ return "rangeHandle " + d; })
            .each(function(d,i){
              this.tipsy = new Tipsy(this, { gravity: i==0?"w":"e", title: kshf.lang.cur.DragToFilter });
            })
            .on("mouseenter", function(){ if(!this.dragging){ this.tipsy.show(); this.setAttribute("dragging",true);} })
            .on("mouseleave", function(){ if(!this.dragging){
              this.tipsy.hide();
              this.removeAttribute("dragging");
            } })
            .on("mousedown", function(d,i){
              this.tipsy.hide();
              if(d3.event.which !== 1) return; // only respond to left-click
              /*
              me.browser.DOM.root.attr("adjustWidth",true).attr("pointerEvents",false);
              this.setAttribute("dragging",true);

              var mee = this;
              mee.dragging = true;
              var e=this.parentNode;
              d3.select("body").on("mousemove", function() {
                me.summaryFilter.active[d] = me.valueScale.invert(d3.mouse(e)[0]);
                // Swap is min > max
                if(me.summaryFilter.active.min>me.summaryFilter.active.max){
                  var t=me.summaryFilter.active.min;
                  me.summaryFilter.active.min = me.summaryFilter.active.max;
                  me.summaryFilter.active.max = t;
                  if(d==='min') d='max'; else d='min'; // swap
                }
                me.refreshRangeFilter(true);
              }).on("mouseup", function(){
                mee.dragging = false;
                mee.removeAttribute("dragging");
                me.browser.DOM.root.attr("adjustWidth",null).attr("pointerEvents",true);;
                d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
              });
              d3.event.stopPropagation();
              */
            });

          this.DOM.valueTickGroup = this.DOM.intervalSlider.append("div").attr("class", "valueTickGroup");
        },

        insertVizDOM: function(){
            var zeroPos = d3.scaleLinear(0).clamp(true);

            var timeAxis_XFunc = function(aggr){
                return (d3.scaleUtc(aggr.minV) + d3.scaleUtc(aggr.maxV)) / 2;
            };

            // delete existing DOM:
            // TODO: Find  a way to avoid this?
            this.DOM.timeSVG.selectAll('[class^="measure_"]').remove();

            this.DOM.measure_Total_Area = this.DOM.timeSVG
              .append("path")
                .attr("class","measure_Total_Area")
                .datum(this._aggrs)
                .attr("d",
                  d3.area()
                    .curve(d3.curveMonotoneX)
                    .x (timeAxis_XFunc)
                    .y0(1 + 2 - zeroPos)
                    .y1(1 + 2 - zeroPos)
                  );
            this.DOM.measure_Active_Area = this.DOM.timeSVG
              .append("path")
                .attr("class","measure_Active_Area")
                .datum(this._aggrs)
                .attr("d",
                  d3.area()
                    .curve(d3.curveMonotoneX)
                    .x (timeAxis_XFunc)
                    .y0(1+2-zeroPos)
                    .y1(1+2-zeroPos)
                  );
            this.DOM.lineTrend_ActiveLine = this.DOM.timeSVG.selectAll(".measure_Active_Line")
              .data(this._aggrs, function(d,i){ return i; })
              .enter().append("line")
                .attr("class","measure_Active_Line")
                .attr("marker-end","url(#kshfLineChartTip_Active)")
                .attr("x1",timeAxis_XFunc)
                .attr("x2",timeAxis_XFunc)
                .attr("y1",1+3-zeroPos)
                .attr("y2",1+3-zeroPos);

            this.DOM.measure_Highlight_Area = this.DOM.timeSVG
              .append("path").attr("class","measure_Highlight_Area").datum(this._aggrs);
            this.DOM.measure_Highlight_Line = this.DOM.timeSVG.selectAll(".measure_Highlight_Line")
              .data(this._aggrs, function(d,i){ return i; })
              .enter().append("line").attr("class","measure_Highlight_Line").attr("marker-end","url(#kshfLineChartTip_Highlight)");

            this.DOM.measure_Compare_Area_A = this.DOM.timeSVG
              .append("path").attr("class","measure_Compare_Area_A measure_Compare_A").datum(this._aggrs);
            this.DOM.measure_Compare_Line_A = this.DOM.timeSVG.selectAll(".measure_Compare_Line_A")
              .data(this._aggrs, function(d,i){ return i; })
              .enter().append("line").attr("class","measure_Compare_Line_A measure_Compare_A").attr("marker-end","url(#kshfLineChartTip_Compare_A)");
            this.DOM.measure_Compare_Area_B = this.DOM.timeSVG
              .append("path").attr("class","measure_Compare_Area_B measure_Compare_B").datum(this._aggrs);
            this.DOM.measure_Compare_Line_B = this.DOM.timeSVG.selectAll(".measure_Compare_Line_B")
              .data(this._aggrs, function(d,i){ return i; })
              .enter().append("line").attr("class","measure_Compare_Line_B measure_Compare_B").attr("marker-end","url(#kshfLineChartTip_Compare_B)");
            this.DOM.measure_Compare_Area_C = this.DOM.timeSVG
              .append("path").attr("class","measure_Compare_Area_C measure_Compare_C").datum(this._aggrs);
            this.DOM.measure_Compare_Line_C = this.DOM.timeSVG.selectAll(".measure_Compare_Line_C")
              .data(this._aggrs, function(d,i){ return i; })
              .enter().append("line").attr("class","measure_Compare_Line_C measure_Compare_C").attr("marker-end","url(#kshfLineChartTip_Compare_C)");

          this.insertBins();
          this.refreshViz_Axis();
          this.refreshMeasureLabel();
          this.updateValueTicks();
        },

        insertBins: function(){
          var me=this;

          var zeroPos = d3.scaleLinear(0).clamp(true);

          var width = this.getWidth_Bin();
          var offset = (this.stepTicks)? this.width_barGap : 0;

          // just remove all aggrGlyphs that existed before.
          this.DOM.histogram_bins.selectAll(".aggrGlyph").data([]).exit().remove();

          var activeBins = this.DOM.histogram_bins.selectAll(".aggrGlyph").data(this._aggrs, function(d,i){return i;});

          var newBins=activeBins.enter().append("span").attr("class","aggrGlyph rangeGlyph")
            .each(function(aggr){
              aggr.isVisible = true;
              aggr.DOM.aggrGlyph = this;
            })
            .on("mouseenter",function(aggr){
              if(aggr.recCnt.Active===0) return;
              if(me.highlightRangeLimits_Active) return;
              // mouse is moving slow, just do it.
              if(me.browser.mouseSpeed<0.2) {
                me.onAggrHighlight(aggr);
                return;
              }
              // mouse is moving fast, should wait a while...
              this.highlightTimeout = window.setTimeout(
                function(){ me.onAggrHighlight(aggr) },
                me.browser.mouseSpeed*300);
            })
            .on("mouseleave",function(aggr){
              if(aggr.recCnt.Active===0) return;
              if(me.highlightRangeLimits_Active) return;
              if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
              me.onAggrLeave(aggr);
            })
            .on("click",function(aggr){ me.onAggrClick(aggr); });

          ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
            var X = newBins.append("span").attr("class","measure_"+m)
              .style("transform","translateY("+(me.height_hist-zeroPos)+"px) scale("+width+",0)");
            if(m!=="Total" && m!=="Active" && m!=="Highlight"){
              X.on("mouseenter" ,function(){
                me.browser.refreshMeasureLabels(this.classList[0].substr(8));
              });
              X.on("mouseleave", function(){
                me.browser.refreshMeasureLabels("Active");
              });
            }
          },this);

          newBins.append("span").attr("class","total_tip");
          newBins.append("span").attr("class","lockButton fa")
            .each(function(aggr){
              this.tipsy = new Tipsy(this, {
                gravity: 's',
                title: function(){
                  var isLocked = me.browser.selectedAggr["Compare_A"]===aggr ||
                        me.browser.selectedAggr["Compare_B"]===aggr ||
                        me.browser.selectedAggr["Compare_C"]===aggr
                  return kshf.lang.cur[ !isLocked ? 'LockToCompare' : 'Unlock'];
                }
              });
            })
            .on("click",function(aggr){
              this.tipsy.hide();
              me.browser.setSelect_Compare(true);
              d3.event.stopPropagation();
            })
            .on("mouseenter",function(aggr){
              this.tipsy.hide();
              this.tipsy.show();
              d3.event.stopPropagation();
            })
            .on("mouseleave",function(aggr){
              this.tipsy_title = undefined;
              this.tipsy.hide();
              d3.event.stopPropagation();
            });

          newBins.append("span").attr("class","measureLabel");

          this.DOM.aggrGlyphs      = this.DOM.histogram_bins.selectAll(".aggrGlyph");
          this.DOM.measureLabel    = this.DOM.aggrGlyphs.selectAll(".measureLabel");
          this.DOM.measureTotalTip = this.DOM.aggrGlyphs.selectAll(".total_tip");
          this.DOM.lockButton      = this.DOM.aggrGlyphs.selectAll(".lockButton");
          ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
            this.DOM["measure_"+m] = this.DOM.aggrGlyphs.selectAll(".measure_"+m);
          },this);
        },

        intervalRange: {
            getActiveMax: function(){
              if(!me.stepTicks) return this.active.max;
              return new Date(this.active.max.getTime()+1000); // TODO
            },
            getTotalMax: function(){
              if(!me.stepTicks) return this.total.max;
              if(me.scaleType==='time') {
                return new Date(this.total.max.getTime()+1000); // TODO
              } else {
                return this.total.max+1;
              }
            }
        },

        getValueTicks: function(optimalTickCount){
            var me=this;
            var ticks;

            // HANDLE TIME CAREFULLY
            // 1. Find the appropriate aggregation interval (day, month, etc)
            var timeRange_ms = this.intervalRange.getActiveMax() - this.intervalRange.active.min; // in milliseconds
            var timeInterval;
            optimalTickCount *= 1.3;

            // Listing time resolutions, from high-res to low-res
            var timeMult = {
              'Second': 1000,
              'Minute': 1000*60,
              'Hour'  : 1000*60*60,
              'Day'   : 1000*60*60*24,
              'Month' : 1000*60*60*24*30,
              'Year'  : 1000*60*60*24*365,
            };

            var timeRes = [
              {
                type: 'Second',
                step: 1,
                format: '%S'
              },{
                type: 'Second',
                step: 5,
                format: '%S'
              },{
                type: 'Second',
                step: 15,
                format: '%S'
              },{
                type: 'Minute',
                step: 1,
                format: '%M'
              },{
                type: 'Minute',
                step: 5,
                format: '%M'
              },{
                type: 'Minute',
                step: 15,
                format: '%M'
              },{
                type: 'Hour',
                step: 1,
                format: '%H'
              },{
                type: 'Hour',
                step: 6,
                format: '%H'
              },{
                type: 'Day',
                step: 1,
                format: '%e'
              },{
                type: 'Day',
                step: 4,
                format: function(v){
                  var suffix = kshf.Util.ordinal_suffix_of(v.getUTCDate());
                  var first=d3.utcFormat("%-b")(v);
                  return suffix+"<br>"+first;
                },
                twoLine: true
              },{
                type: 'Month',
                step: 1,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 1);
                  var first=d3.utcFormat("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br><span class='secondLayer'>"+(d3.utcFormat("%Y")(nextTick))+"</span>";
                  return s;
                },
                twoLine: true
              },{
                type: 'Month',
                step: 3,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 3);
                  var first=d3.utcFormat("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br><span class='secondLayer'>"+(d3.utcFormat("%Y")(nextTick))+"</span>";
                  return s;
                },
                twoLine: true
              },{
                type: 'Month',
                step: 6,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 6);
                  var first=d3.utcFormat("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br>"+(d3.utcFormat("%Y")(nextTick));
                  return s;
                },
                twoLine: true
              },{
                type: 'Year',
                step: 1,
                format: "%Y"
              },{
                type: 'Year',
                step: 2,
                format: "%Y"
              },{
                type: 'Year',
                step: 3,
                format: "%Y"
              },{
                type: 'Year',
                step: 5,
                format: "%Y"
              },{
                type: 'Year',
                step: 10,
                format: "%Y"
              },{
                type: 'Year',
                step: 25,
                format: "%Y"
              },{
                type: 'Year',
                step: 50,
                format: "%Y"
              },{
                type: 'Year',
                step: 100,
                format: "%Y"
              },{
                type: 'Year',
                step: 500,
                format: "%Y"
              }
            ];

            timeRes.every(function(tRes,i){
              var stopIteration = i===timeRes.length-1 ||
                timeRange_ms/(timeMult[tRes.type]*tRes.step) < optimalTickCount;
              if(stopIteration){
                if(tRes.type==="Day"   && this.timeTyped.maxDateRes()==="Month") stopIteration = false;
                if(tRes.type==="Day"   && this.timeTyped.maxDateRes()==="Year" ) stopIteration = false;
                if(tRes.type==="Month" && this.timeTyped.maxDateRes()==="Year" ) stopIteration = false;
                if(tRes.type==="Hour"  && this.timeTyped.maxDateRes()==="Day"  ) stopIteration = false;
              }
              if(stopIteration){
                // TODO: Fix D3
                timeInterval = d3['utc'+[tRes.type]];
                this.timeTyped.activeRes = tRes;
                if(typeof tRes.format === "string"){
                  this.intervalTickPrint = d3.utcFormat(tRes.format);
                } else {
                  this.intervalTickPrint = tRes.format;
                }
                this.height_labels = (tRes.twoLine) ? 28 : 13;
              }

              return !stopIteration;
            }, this);

            this.setStepTicks(this.timeTyped.activeRes.step===1);

            this.valueScale.nice(timeInterval, this.timeTyped.activeRes.step);
            ticks = this.valueScale.ticks(timeInterval, this.timeTyped.activeRes.step);

            // Make sure the non-extreme ticks are between intervalRange.active.min and intervalRange.active.max
            for(var tickNo = 1; tickNo < ticks.length - 1; ){
              var tick = ticks[tickNo];
              if(tick<this.intervalRange.active.min){
                ticks.splice(tickNo-1,1); // remove the tick
              } else if(tick > this.intervalRange.getActiveMax()){
                ticks.splice(tickNo+1,1); // remove the tick
              } else {
                tickNo++
              }
            }

            if(!this.stepTicks)
              this.valueScale.domain([ticks[0], ticks[ticks.length-1]]);

            return ticks;
        },

        updateScaleAndBins: function(force){
          var me=this;

          this.valueScale = d3.scaleUtc();

          var _width_ = this.getElement().width();

          var minn = this.intervalRange.active.min;
          var maxx = this.intervalRange.getActiveMax();

          this.valueScale
            .domain([minn, maxx])
            .range([0, _width_]);

          var old_height_labels = this.height_labels;
          var curHeight = this.getHeight();

          var ticks = this.getValueTicks( _width_/this.getWidth_OptimumTick() );

          if(ticks.length===0) return;

          // Maybe the ticks still follow step-function ([3,4,5] - [12,13,14,15,16,17] - [2010,2011,2012,2013,2014] etc. )
          if(!this.stepTicks && !this.hasFloat && this.scaleType==='linear' && ticks.length>2){
            if( (ticks[1]===ticks[0]+1) && (ticks[ticks.length-1]===ticks[ticks.length-2]+1)) {
              this.setStepTicks(true);
              ticks = this.getValueTicks( _width_/this.getWidth_OptimumTick() );

              minn = this.intervalRange.active.min;
              maxx = this.intervalRange.getActiveMax();

              this.valueScale
                .domain([minn, maxx])
                .range([0, _width_]);
            }
          }

          // width for one aggregate - fixed width
          this.aggrWidth = this.valueScale(ticks[1])-this.valueScale(ticks[0]);

          if( force ||
              this.intervalTicks.length !== ticks.length ||
              this.intervalTicks[0] !== ticks[0] ||
              this.intervalTicks[this.intervalTicks.length-1] !== ticks[ticks.length-1]
            )
          {
            this.intervalTicks = ticks;

            // Remove existing aggregates from browser
            if(this._aggrs){
              var aggrs=this.browser.allAggregates;
              this._aggrs.forEach(function(aggr){ aggrs.splice(aggrs.indexOf(aggr),1); },this);
            }

            this._aggrs = [];
            // Create _aggrs as kshf.Aggregate
            this.intervalTicks.forEach(function(tick,i){
              var d = new kshf.Aggregate_Interval(this, tick, this.intervalTicks[i+1]);
              d.summary = this;
              this._aggrs.push(d);
              me.browser.allAggregates.push(d);
            }, this);

            this._aggrs.pop(); // remove last bin

            // distribute records across bins
            this.filteredRecords.forEach(function(record){
              var v = this.getRecordValue(record);
              // DO NOT CHANGE BELOW
              if(v===null || v===undefined || v<this.intervalRange.active.min || v>this.intervalRange.getActiveMax()) return;
              var binI = null;
              this.intervalTicks.every(function(tick,i){
                if(v>=tick) {
                  binI = i;
                  return true; // keep going
                }
                return false; // stop iteration
              });
              var bin = this._aggrs[ Math.min(binI, this._aggrs.length-1) ];

              // If the record already had a bin for this summary, remove that bin
              var existingBinIndex = null;
              record._aggrCache.some(function(aggr,i){
                if(aggr.summary && aggr.summary === this) {
                  existingBinIndex = i;
                  return true;
                }
                return false;
              },this);
              if(existingBinIndex!==null){ record._aggrCache.splice(existingBinIndex,1); }
              // ******************************************************************

              if(bin) bin.addRecord(record);
            },this);

            if(this.stepTicks) this.intervalTicks.pop();

            this.updateBarScale2Active();

            if(this.DOM.root) this.insertVizDOM();

            this.updatePercentiles("Active");
          }

          if(this.DOM.root){
            if(this.DOM.aggrGlyphs===undefined) this.insertVizDOM();

            if(old_height_labels !== this.height_labels){
              this.setHeight(curHeight);
            }

            this.refreshBins_Translate();
            setTimeout(function(){
              me.refreshViz_Scale();
            }, 10);

            this.refreshValueTickPos();

            this.refreshIntervalSlider();
          }
        },

        refresh: function(opts){
            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var seriesContext = this.getContext().find('series').value(),
                autoCount = source.value().get(2).used(),
                tooltip = this.getContext().find('tooltip').value(),
                value = source.value().get(0),
                count = source.value().get(1);

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

                    while(source.next()){

                    }

                    data.sort(function(a, b){
                        if(a.x < b.x) return -1;
                        if(a.x > b.x) return 1;
                        return 0;
                    });

                    try{

                    } catch(e){
                        console.log(e);
                        return;
                    } finally{
                        $this.getElement().loader('hide');
                    }
                });
            }, function(){
                return $this.isInit;
            });
        },
    }
}