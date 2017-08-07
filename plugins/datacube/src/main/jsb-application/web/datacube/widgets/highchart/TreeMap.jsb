{
	$name: 'DataCube.Widgets.TreeMap',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Карта дерева',
		description: '',
		category: 'Диаграммы',
		thumb: `data:image/png;base64,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
		YAAAOpgAABdvkl/FRgAAAwBQTFRFTGlxHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0d
		HR0dHR0dHR0dHR0dHR0dHR0dHR0dQwtiUBxtaT6CpBm3qSi7rza/g2CX70wAtEXD71kUuVPH8Gcn
		nYGsdrgAxHDQ8IJOqpK3yX/UkcU18Y9imslH/64Ao81Z9rIPrdJqttZ8+cNLv9qO+sdayN6g+9B4
		/NSH29ve/diW/d2l////Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERE
		RUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dX
		WFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampq
		a2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19
		fn5+f39/gICAgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJioqKi4uLjIyMjY2Njo6Oj4+PkJCQ
		kZGRkpKSk5OTlJSUlZWVlpaWl5eXmJiYmZmZmpqam5ubnJycnZ2dnp6en5+foKCgoaGhoqKio6Oj
		pKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2
		t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJ
		ysrKy8vLzMzMzc3Nzs7Oz8/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc
		3d3d3t7e39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7u7u7+/v
		8PDw8fHx8vLy8/Pz9PT09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////wzkmyQAAAAF0
		Uk5TAEDm2GYAAADFSURBVHjaYmEwY6A5YDF7hSHGiqIAmcOEzPmLzTzuX5iK2VkY6ABGLRm1ZFBa
		wjQaXKOWUGgJM0ZiYoUWv7+IMJAZpyVMo3EyaskItoQRC280uEYtGfKW/MIo6P9gU/gLf4ZgYJB5
		gMpXeARjKY7Gyaglo5aMWjJqCaWWoLfCpV8MCp+wjEY8uZZIEqfwKUWWvMbjN5bROKGZJYyjwUVn
		S1jRNL1jY2BgQBoVGSCfsMFtGI14Ei2RIE6hAEEVSmh8cTgLMADfHw/zyK4h3wAAAABJRU5ErkJg
		gg==`
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
            name: 'Подзаголовок',
            type: 'item',
            key: 'subtitle',
            itemType: 'string',
            itemValue: ''
        },
        {
            name: 'Алгоритм построения',
            type: 'select',
            key: 'layoutAlgorithm',
            items:[
            {
                name: 'sliceAndDice',
                type: 'item',
                editor: 'none'
            },
            {
                name: 'squarified',
                type: 'item',
                editor: 'none'
            },
            {
                name: 'stripes',
                type: 'item',
                editor: 'none'
            },
            {
                name: 'strip',
                type: 'item',
                editor: 'none'
            }
            ]
        },
        {
            type: 'item',
            name: 'Альтернативное направление',
            optional: true
        },
        {
            type: 'item',
            key: 'autoSize',
            name: 'Автоматически считать размеры',
            optional: true,
            editor: 'none'
        },
        {
            type: 'item',
            key: 'skipSmallGroups',
            name: 'Опускать группы с одним элементом',
            optional: true,
            editor: 'none'
        },
        {
            type: 'item',
            key: 'skipEmptyNamedGroups',
            name: 'Опускать группы с пустыми именами',
            optional: true,
            editor: 'none'
        },
        {
            type: 'group',
            name: 'Источник',
            binding: 'array',
            key: 'source',
            items: [
            {
                type: 'group',
                name: 'Серии',
                key: 'series',
                multiple: 'true',
                items: [
                {
                    name: 'Имя поля',
                    type: 'item',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },{
                    name: 'Вес',
                    type: 'item',
                    binding: 'field',
                    itemType: 'number',
                    itemValue: ''
                }
                ]
            }
            ]
        }]
    },
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('treeMap');
			this.loadCss('TreeMap.css');
			//JSB().loadScript('tpl/highcharts/js/highcharts.js', function(){
			JSB().loadScript('tpl/highstock/highstock.js', function(){
				JSB().loadScript('tpl/highcharts/js/modules/treemap.js', function(){
					self.init();	
				});
			});
		},

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
            	if(!$this.getElement().is(':visible')){
            		return;
            	}

                if($this.highcharts){
                    $this.highcharts.setSize(self.getElement().width(), $this.getElement().height(), false);
                }
            });

            this.isInit = true;
        },

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;

            var data = [],
                series = this.getContext().find('series').values(),
                autoSize = this.getContext().find('autoSize').used(),
                skipSmallGroups = this.getContext().find('skipSmallGroups').used(),
                skipEmptyNamedGroups = this.getContext().find('skipEmptyNamedGroups').used();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    while(source.next()){
                        var el = data;

                        for(var i = 0; i < series.length; i++){
                            var label = series[i].get(0).value();
                            var weight = series[i].get(1).value();

                            var e = null;
                            for(var j = 0; j < el.length; j++){
                                if(el[j].label === label){
                                    e = el[j];
                                    break;
                                }
                            }

                            if(!e){
                                el.push({
                                    label: label,
                                    weight: parseInt(weight),
                                    groups: []
                                });

                                el = el[el.length - 1].groups;
                            } else {
                                el = e.groups;
                            }
                        }
                    }

                    data = $this.procData(data, autoSize, skipSmallGroups, skipEmptyNamedGroups);

                    data = $this.convertToTreemapFormat(data);

                    $this.container.highcharts({
                        title: {
                            text: this.getContext().find('title').value()
                        },
                        subtitle: {
                            text: this.getContext().find('subtitle').value()
                        },
                        plotOptions: {
                            treemap: {
                                allowPointSelect: true,
                                point: {
                                    events: {
                                        select: function(evt) {
                                            this.update({
                                                borderColor: 'green',
                                                borderWidth: 4
                                            });

                                            $this._addNewFilter(evt.target.level, evt.target.name);
                                        },
                                        unselect: function(evt) {
                                            this.update({
                                                borderColor: '#E0E0E0',
                                                borderWidth: 1
                                            });

                                            if($this._currentFilter) $this.removeFilter($this._currentFilter);
                                        }
                                    }
                                }
                            }
                        },
                        series: [{
                            type: 'treemap',
                            layoutAlgorithm: this.getContext().find('layoutAlgorithm').value().name(),
                            allowDrillToNode: true,
                            animationLimit: 1000,
                            dataLabels: {
                                enabled: true
                            },
                            levelIsConstant: false,
                            data: data,
                            turboThreshold: 0,

                            drillUpButton: {
                                text: '<< return',
                                position: {
                                    align: 'right',
                                    x: -10
                                },
                                theme: {
                                    fill: 'white',
                                    'stroke-width': 1,
                                    stroke: 'silver',
                                    r: 5,
                                    states: {
                                        hover: {
                                            fill: '#bada55'
                                        }
                                    }
                                }

                            }

                        }]
                    });

                    $this.chart =  $this.container.highcharts();

                    $this.getElement().loader('hide');
                });
            }, function(){
                return $this.isInit;
            });
        },

        _addNewFilter: function(level, value){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var field = this.getContext().find("series").values()[level].get(0).binding();
            if(!field[0]) return;

            this._currentFilter = this.addFilter(context.source, 'and', [{ field: field, value: value, op: '$eq' }], this._currentFilter);
        },

        // utils
        procData: function(data, autoSize, skipSmallGroups, skipEmptyNamedGroups){
            if(!data) return;

            var newData = [];

            for(var i = 0; i < data.length; i++){
                if((skipEmptyNamedGroups && data[i].label === "") || (skipSmallGroups && data[i].groups.length === 1)){
                    newData = newData.concat(this.procData(data[i].groups, autoSize, skipSmallGroups));
                    continue;
                }

                if((data[i].weight !== data[i].weight) && autoSize){
                    data[i].weight = this.countWeight(data[i]);
                }

                data[i].groups = this.procData(data[i].groups, autoSize, skipSmallGroups);

                newData.push(data[i]);
            }

            newData = newData.filter(function(el){
                return el !== undefined;
            });

            return newData;
        },

        countWeight: function(a){
            if(a.weight === a.weight) return a.weight;

            if(a.groups.length !== 0){
                var b = 0;
                for(var i = 0; i < a.groups.length; i++){
                    b += countWeight(a.groups[i]);
                }
                return b;
            } else {
                return 1;
            }
        },

        convertToTreemapFormat: function(data, array, parent){
            if(!array) array = [];
            for(var i = 0; i < data.length; i++){
                var id = JSB().generateUid();

                array.push({
                    id: id,
                    name: data[i].label,
                    parent: parent,
                    value: data[i].weight
                });

                this.convertToTreemapFormat(data[i].groups, array, id);
            }

            return array;
        }
	}
}