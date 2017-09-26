{
	$name: 'DataCube.Widgets.HighchartsPieChart',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Круговая диаграмма',
		description: '',
		category: 'BI',
		thumb: `data:image/png;base64,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
		32D87wCdIs7XaNuRKgAAAABJRU5ErkJggg==`
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
            binding: 'array',
            key: 'source',
            items: [
            {
                name: 'Имя',
                type: 'item',
                key: 'name',
                itemType: 'string',
                itemValue: ''
            },
            {
                name: 'Данные',
                type: 'group',
                multiple: 'true',
                key: 'data',
                items: [
                {
                    type: 'item',
                    name: 'Имена частей',
                    key: 'partNames',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field',
                },
                {
                    type: 'item',
                    name: 'Размеры частей',
                    key: 'partSize',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field',
                }
                ]
            }
            ]
        },
		{
			type: 'group',
			key: 'tooltip',
			name: 'Tooltip',
			items: [
			/*{
				type: 'item',
				name: 'Суффикс значения',
				itemType: 'string'
			},*/
			{
				type: 'item',
				name: 'Формат',
				key: 'format',
				itemType: 'string',
				description: 'A format string for the data label. Available variables are: point.percentage (The point\'s percentage of the total), point.name, point.x (The x value), point.y (The y value), series (The series object. The series name is available through series.name).'
			}
			]
		},
        {
            name: 'Диаметр внутреннего круга',
            type: 'item',
            key: 'innerSize',
            itemType: 'string',
            itemValue: '0',
            description: 'Диаметр внутреннего круга. По умолчанию 0. Диаметр больше 0 делает диаграмму вида бублика. Указывается числовое или процентное значение'
        },
        {
            name: 'Цветовая схема по умолчанию',
            key: 'colorScheme',
            type: 'select',
            items:[
            {
                name: '#1',
                type: 'item',
                key: 'color1',
                editor: 'none'
            },
            {
                name: '#2',
                type: 'item',
                key: 'color2',
                editor: 'none'
            },
            {
                name: '#3',
                type: 'item',
                key: 'color3',
                editor: 'none'
            },
            {
                name: '#4',
                type: 'item',
                key: 'color4',
                editor: 'none'
            }
            ]
        }]
    },
	$client: {
	    $require: ['JQuery.UI.Loader'],

	    _series: {},
	    _curFilters: {},
	    _removedFiltersCnt: 0,
	    _curFilterHash: null,

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('pieChart');
			this.loadCss('HighchartsPieChart.css');
			//JSB().loadScript('tpl/highcharts/js/highcharts.js', function(){
			JSB().loadScript('tpl/highstock/highstock.js', function(){
				self.init();
			});
		},

        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
            	if(!$this.getElement().is(':visible') || !$this.chart){
                    return;
                }

                JSB.defer(function(){
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 300, 'hcResize' + $this.getId());

            });

            this.isInit = true;
        },

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.bound()) return;

			$base();

// filters section
            var globalFilters = source.getFilters();

            if(globalFilters){
                var binding = source.value().get(1).value().get(0).binding()[0],
                    newFilters = {};

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding && cur.op === '$eq'){
                        if(!this._curFilters[cur.value]){
                            this._curFilters[cur.value] = cur.id;
                            this.chart.series[0].data[this._series[cur.value]].select(true, true);
                        }

                        newFilters[cur.value] = true;

                        delete globalFilters[i];
                    }
                }

                for(var i in this._curFilters){
                    if(!newFilters[i]){
                        this._removedFiltersCnt++;
                        this.chart.series[0].data[this._series[i]].select(false, true);
                        delete this._curFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length === 0) globalFilters = null;

                if(globalFilters && this.createFilterHash(globalFilters) === this._curFilterHash || !globalFilters && !this._curFilterHash){ // update data not require
                    return;
                } else {
                    this._curFilterHash = globalFilters ? this.createFilterHash(globalFilters) : undefined;
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    this._removedFiltersCnt = Object.keys(this._curFilters).length;
                    for(var i in this._curFilters){
                        this.chart.series[0].data[this._series[i]].select(false, true);
                    }
                    this._curFilters = {};
                    this._curFilterHash = null;
                    return;
                }
            }
// end filters section
            var dataValues = this.getContext().find('data').values(),
                dataSource = [];
            for(var i = 0; i < dataValues.length; i++){
                dataSource.push({
                    name: dataValues[i].get(0),
                    bName: dataValues[i].get(0).binding()[0],
                    y: dataValues[i].get(1),
                    bY: dataValues[i].get(1).binding()[0]
                });
            }
			var tooltipSettings = this.getContext().find('tooltip').value();

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

					try {
                        while(source.next()){
                            for(var i = 0; i < dataSource.length; i++){
                                var d = {
                                    name: dataSource[i].name.value(),
                                    y: dataSource[i].y.value(),
                                    sortField: dataSource[i].bName ? dataSource[i].bName : dataSource[i].bY ? dataSource[i].bY : null,
                                    sortValue: dataSource[i].bName ?  dataSource[i].name.value() : dataSource[i].bY ? dataSource[i].y.value() : null
                                }

                                if(JSB().isArray(d.name)){
                                    for(var j = 0; j < d.name.length; j++){
                                        data.push({
                                            name: d.name[j],
                                            y: d.y[j],
                                            sortField: d.bName ? d.bName : d.bY ? d.bY : null,
                                            sortValue: d.bName ? d.name[j] : d.bY ? d.y[j] : null,
                                        });
                                    }
                                } else {
                                    data.push(d);
                                }
                            }
                        }

						$this._series = data.reduce(function(arr, el, i){
							arr[el.name] = i;
							return arr;
						}, {});

						var colors = [
							['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
							["#626a7a", "#9a554b", "#adadad", "#738299", "#d88a82", "#d1d1d1", "#110c08", "#b5cce2", "#e5e5e5"],
							["#1c3e7e", "#ca162a", "#006da9", "#b2d3e5", "#efb9bf", "#bfc6d9"],
							["#1c3e7e", "#ff553e", "#8e8e8e", "#ffccc5", "#d0d0d0", "#636363"],
							["#4fbde2", "#ffd682", "#89cbc6", "#8a5c91", "#cac3be", "#caebf6", "#fff3d9", "#dbefee", "#dccede", "#4f3928"]
						], colorSchemeIdx = parseInt(this.getContext().find('colorScheme').value().name().toString().replace(/\D/g,''), 10);

						var chartOptions = {

							HighchartsPieChart: {
								version: 'v-2017-09-21-02'
							},

							colors: !colors.hasOwnProperty(colorSchemeIdx) ? colors[0] : colors[colorSchemeIdx],

							chart: {
								plotBackgroundColor: null,
								plotBorderWidth: null,
								plotShadow: false,
								type: 'pie'
							},

							title: {
								text: this.getContext().find('title').value()
							},

							plotOptions: {
								pie: {
									allowPointSelect: true,
									cursor: 'pointer',
									dataLabels: {
										enabled: false
									},
									showInLegend: true
								}
							},

							legend: {
								rtl: true,
								layout: 'vertical',
								floating: false,
								align: 'left',
								verticalAlign: 'middle',
								x: 0,
								y: 0,
								itemMarginTop: 15,
								itemMarginBottom: 15,
								backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
							},


							tooltip: {
								//valueSuffix: $this.safeGetValue(tooltipSettings, [0]),
								pointFormat: $this.safeGetValue(tooltipSettings, [0]) || '{series.name}: <b>{point.percentage:.1f}%</b>'
							},

							credits: {
								enabled: false
							},

							series: [{
								data: data,
								colorByPoint: true,
								innerSize: this.getContext().find('innerSize').value(),
								point: {
                                    events: {
                                        click: function(evt) {
                                            $this._clickEvt = evt;

                                            if(JSB().isFunction($this.options.onClick)){
                                                $this.options.onClick.call(this, evt);
                                            }
                                        },
                                        select: function(evt) {
                                            var flag = false;

                                            if(JSB().isFunction($this.options.onSelect)){
                                                flag = $this.options.onSelect.call(this, evt);
                                            }

                                            if(!flag && $this._clickEvt){
                                                $this._addPieFilter(evt);
                                                $this._clickEvt = null;
                                            }
                                        },
                                        unselect: function(evt) {
                                            $this._clickEvt = null;
                                            var flag = false;

                                            if(JSB().isFunction($this.options.onUnselect)){
                                                flag = $this.options.onUnselect.call(this, evt);
                                            }

                                            if(!flag && $this._removedFiltersCnt === 0){
                                                if(Object.keys($this._curFilters).length > 0){
                                                    if(evt.accumulate){
                                                        $this.removeFilter($this._curFilters[evt.target.options.sortValue]);
                                                        delete $this._curFilters[evt.target.options.sortValue];
                                                        $this.refreshAll();
                                                    } else {
                                                        for(var i in $this._curFilters){
                                                            $this.removeFilter($this._curFilters[i]);
                                                        }
                                                        $this._curFilters = {};
                                                        $this.refreshAll();
                                                    }
                                                }
                                            } else {
                                                $this._removedFiltersCnt--;
                                            }
                                        },
                                        mouseOut: function(evt) {
                                            if(JSB().isFunction($this.options.mouseOut)){
                                                $this.options.mouseOut.call(this, evt);
                                            }
                                        },
                                        mouseOver: function(evt) {
                                            if(JSB().isFunction($this.options.mouseOver)){
                                                $this.options.mouseOver.call(this, evt);
                                            }
                                        }
                                    }
								}
							}]
						};

						$this.container.highcharts(chartOptions);

                    } catch(e) {
						var wTypeName = $this.hasOwnProperty('wrapper') && $this.wrapper.hasOwnProperty('widgetEntry') && $this.wrapper.widgetEntry.hasOwnProperty('wType') ? $this.wrapper.widgetEntry.wType : '';
                    	console.log("Exception", [wTypeName, e]);
                    } finally {
                        $this.getElement().loader('hide');
                    }
					console.log(chartOptions);

                    $this.chart =  $this.container.highcharts();
                });


            }, function(){
                return $this.isInit;
            });
        },

        _addPieFilter: function(evt){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var fDesc = {
            	sourceId: context.source,
            	type: '$or',
            	op: '$eq',
            	field: evt.target.options.sortField,
            	value: evt.target.options.sortValue
            };

            if(!evt.accumulate && Object.keys(this._curFilters).length > 0){
                this._removedFiltersCnt = Object.keys(this._curFilters).length;

                for(var i in this._curFilters){
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};
            }

            this._curFilters[evt.target.options.sortValue] = this.addFilter(fDesc);
            this.refreshAll();
        },
		
		safeGetValue: function(context, args) {
			console.log(arguments);
			if( context !== null && typeof context === 'object') {
				if( args !== null && (!!args && args.constructor === Array) && args.length) {
					if(context.get(args[0]) !== null) {
						var value = context.get(args[0]).value();
						return (((args.length === 1) || (value === null)) ? value : this.safeGetValue(value, args.slice(1)));
					}
				}
			}
			
			return;
		}
		
	}
}