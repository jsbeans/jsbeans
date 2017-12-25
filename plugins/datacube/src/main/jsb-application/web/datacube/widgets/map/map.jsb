{
	$name: 'DataCube.Widgets.LeafletMap',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Карта',
        description: '',
        category: 'Карты',
        thumb: 'data:image/png;base64,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'
    },
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Источник данных',
            type: 'group',
            key: 'dataSource',
            binding: 'array',
            items: [
            // Регионы
            {
                name: 'Регионы',
                type: 'group',
                key: 'regions',
                collapsable: true,
                multiple: true,
                items: [
                {
                    name: 'Серия',
                    type: 'group',
                    key: 'seriesItem',
                    collapsable: true,
                    items: [
                    {
                        name: 'Имя региона или поле для сопоставления',
                        type: 'item',
                        key: 'region',
                        binding: 'field'
                    },
                    {
                        name: 'Количество',
                        type: 'item',
                        key: 'value',
                        binding: 'field'
                    },
                    {
                        name: 'GeoJson-карта',
                        type: 'select',
                        key: 'geojson',
                        items:[
                        {
                            name: 'Карта регионов России',
                            type: 'group',
                            key: 'russianRegions',
                            editor: 'none',
                            items: [
                            {
                                name: 'Сопоставление по',
                                type: 'select',
                                key: 'compareTo',
                                items: [
                                {
                                    name: 'Имя региона',
                                    type: 'item',
                                    key: 'NAME_1',
                                    editor: 'none'
                                },
                                {
                                    name: 'Номер по конституции',
                                    type: 'item',
                                    key: 'KONST_NUM',
                                    editor: 'none'
                                },
                                {
                                    name: 'Код OKTMO',
                                    type: 'item',
                                    key: 'OKTMO',
                                    editor: 'none'
                                },
                                {
                                    name: 'ISO',
                                    type: 'item',
                                    key: 'ISO',
                                    editor: 'none'
                                }
                                ]
                            }
                            ]
                        }
                        ]
                    },
                    {
                        name: 'Цвет',
                        type: 'select',
                        key: 'color',
                        items: [
                        {
                            name: 'Единый цвет',
                            type: 'group',
                            key: 'simpleColor',
                            editor: 'none',
                            items: [
                            {
                                name: 'Цвет',
                                type: 'item',
                                key: 'color',
                                itemType: 'color',
                                editor: 'JSB.Widgets.ColorEditor'
                            }
                            ]
                        },
                        {
                            name: 'Диапазон цветов',
                            type: 'group',
                            key: 'rangeColor',
                            editor: 'none',
                            items: [
                            {
                                name: 'Начальный цвет',
                                type: 'item',
                                key: 'startColor',
                                itemType: 'color',
                                editor: 'JSB.Widgets.ColorEditor'
                            },
                            {
                                name: 'Конечный цвет',
                                type: 'item',
                                key: 'endColor',
                                itemType: 'color',
                                editor: 'JSB.Widgets.ColorEditor'
                            },
                            /*
                            {
                                name: 'Шаг',
                                type: 'item',
                                key: 'step',
                                itemType: 'number'
                            }
                            */
                            ]
                        },
                        {
                            name: 'Цвет из источника',
                            type: 'item',
                            key: 'sourceColor',
                            binding: 'field',
                            editor: 'none'
                        }
                        ]
                    },
                    {
                        name: 'Цвет регионов без данных',
                        type: 'item',
                        key: 'defaultColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: 'rgb(115, 115, 115)'
                    }
                    ]
                }
                ]
            },
            // Тайлы
            {
                name: 'Tile-карты',
                type: 'group',
                key: 'tileMaps',
                collapsable: true,
                multiple: true,
                items: [
                {
                    name: 'Сервер карт',
                    type: 'select',
                    key: 'url',
                    editor: 'none',
                    items: [
                    {
                        name: 'Спутник.ру',
                        type: 'item',
                        key: 'sputnik',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Openstreetmap.org',
                        type: 'item',
                        key: 'openstreetmap',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Cartocdn.com',
                        type: 'item',
                        key: 'cartocdn',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Stamen.com',
                        type: 'item',
                        key: 'stamen',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Свой',
                        type: 'item',
                        key: 'custom',
                        itemType: 'string'
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
        $require: ['JSB.Utils.Rainbow', 'JSB.Text.Translit'],

        $constructor: function(opts){
            $base(opts);

            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.addClass('mapWidget');
            this.loadCss('map.css');

            this.loadCss('leaflet/leaflet.css');
            JSB.loadScript('datacube/widgets/map/leaflet/leaflet.js', function(){
                $this.setInitialized();
            });

            $this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.map){
                        return;
                    }
                    $this.map.invalidateSize();
                }, 300, 'hcResize' + $this.getId());
            });
        },

        // inner variables
        _isMapsLoaded: false,
        _isDataLoaded: false,
        _maps: [],
        _mapHash: null,

        refresh: function(opts){
            // if filter source is current widget
            if(opts && this == opts.initiator){
                return;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                return;
            }

            var dataSource = this.getContext().find('dataSource');
            if(!dataSource.bound()){
                return;
            }

            $base();

            var regionsContext = this.getContext().find('regions').values(),
                regionsColors = [],
                maps = [];

            for(var i = 0; i < regionsContext.length; i++){
                var colorSelector = regionsContext[i].find('color').value();
                switch(colorSelector.key()){
                    case 'simpleColor':
                        regionsColors[i] = {
                            simpleColor: colorSelector.value().value()
                        }
                        break;
                    case 'rangeColor':
                        regionsColors[i] = {
                            rangeColor: {
                                startColor: colorSelector.find('startColor').value(),
                                endColor: colorSelector.find('endColor').value(),
                                //step: colorSelector.find('step').value()
                            }
                        }
                        break;
                    case 'sourceColor':
                        regionsColors[i] = {
                            sourceColor: colorSelector
                        }
                        break;
                }

                regionsColors[i].defaultColor = regionsContext[i].find('defaultColor').value();

                var jsonMapSelector  = regionsContext[i].find('geojson').value();
                switch(jsonMapSelector.key()){
                    case 'russianRegions':
                        maps.push({
                            data: null,
                            path: 'geojson/russianRegions.json',
                            compareTo: jsonMapSelector.find('compareTo').value().key(),
                            wrapLongitude: -30
                        });
                        break;
                }
            }

            var newMapHash = this.createFilterHash(maps);
            if(newMapHash !== this._mapHash){
                this._mapHash = newMapHash;
                this._maps = maps;
                this._isMapsLoaded = false;
                this.loadMaps();
            }

            this.getElement().loader();
            dataSource.fetch({readAll: true, reset: true}, function(res){
                try{
                    var regions = {};

                    while(dataSource.next()){
                        for(var i = 0; i < regionsContext.length; i++){
                            var value = regionsContext[i].find('value').value();

                            if(!regions[i]){
                                regions[i] = {
                                    data: []
                                };
                            }

                            regions[i].data.push({
                                region: regionsContext[i].find('region').value(),
                                value: value
                            });

                            if(!regions[i].maxValue || regions[i].maxValue < value){
                                regions[i].maxValue = value;
                            }

                            if(!regions[i].minValue || regions[i].minValue > value){
                                regions[i].minValue = value;
                            }

                            if(regionsColors[i].simpleColor){
                                regions[i].color = regionsColors[i].simpleColor;
                            }

                            if(regionsColors[i].sourceColor){
                                regions[i][regions[i].data.length].color = regionsColors[i].sourceColor.value();
                            }
                        }
                    }

                    for(var i = 0; i < regionsColors.length; i++){
                        if(regionsColors[i].rangeColor){
                            var rainbow = new Rainbow({
                                minNum: regions[i].minValue,
                                maxNum: regions[i].maxValue,
                                spectrum: [regionsColors[i].rangeColor.startColor, regionsColors[i].rangeColor.endColor]
                            });

                            for(var j = 0; j < regions[i].data.length; j++){
                                regions[i].data[j].color = '#' + rainbow.colourAt(regions[i].data[j].value);
                            }

                            regions[i].defaultColor = regionsColors[i].defaultColor;
                        }
                    }

                    $this.buildChart({
                        regions: regions
                    });
                } catch(ex){
                    console.log('Load data exception!');
                    console.log(ex);
                } finally {
                    if($this._isMapsLoaded){
                        $this.getElement().loader('hide');
                    }
                    $this._isDataLoaded = true;
                }
            });
        },

        // refresh after data and/or style changes
        buildChart: function(data){
            JSB.defer(function(){
                $this.ensureInitialized(function(){
                    $this.innerBuildChart(data);
                });
            }, 300, 'buildChart_' + this.getId());
        },

        innerBuildChart: function(data){
            if(!this._isMapsLoaded){
                JSB.defer(function(){
                    $this.innerBuildChart(data);
                }, 500, 'mapLoading_' + this.getId());
                return;
            }

            try {
                var tileMaps = this.getContext().find('tileMaps').values();

                if(this.map){
                    this.map.remove();
                }

                var mapOpts = {
                    center: [40.5, -280.5],
                    zoom: 2
                };

                this.map = L.map(this.container.get(0), mapOpts);

                // add title layers
                for(var i = 0; i < tileMaps.length; i++){
                    L.tileLayer(tileMaps[i].find('url').value().value(), {foo: 'bar'}).addTo(this.map);
                }

                // add geojson layers
                for(var i = 0; i < this._maps.length; i++){
                    if(this._maps[i].data){
                        (function(i, data){
                            L.geoJSON($this._maps[i].data, {
                                style: function (feature) {
                                    if(data && data.color){
                                        return {fillColor: data.color, color: data.color, fillOpacity: 0.7};
                                    }
                                    var reg = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data);
                                    if(!reg){
                                        return {fillColor: data.regions[i].defaultColor, color: data.regions[i].defaultColor, fillOpacity: 0.7};
                                    }
                                    return {fillColor: reg.color, color: reg.color, fillOpacity: 0.7};
                                },
                                coordsToLatLng: function(point){
                                    if(point[0] > $this._maps[i].wrapLongitude){
                                        point[0] -= 360;
                                    }
                                    return L.GeoJSON.coordsToLatLng(point);
                                },
                                onEachFeature: function(feature, layer){
                                    var reg = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data);
                                    if(!reg){
                                        layer.bindTooltip(feature.properties[$this._maps[i].compareTo] + ': Нет данных');
                                        return;
                                    }
                                    layer.bindTooltip(reg.region + ': ' + reg.value);

                                    layer.on({
                                        // todo: filter
                                        click: undefined
                                    });
                                }
                            }).addTo($this.map);
                        })(i, data);
                    }
                }
            } catch(ex){
                console.log('Build chart exception!');
                console.log(ex);
            }
        },

        loadMaps: function(){
            if(this._maps.length === 0){
                this._isMapsLoaded = true;
                return;
            }

            var params = {
                maps: []
            };
            for(var i = 0; i < this._maps.length; i++){
                if(!this._maps[i].path){
                    continue;
                }

                params.maps.push({
                    path: this._maps[i].path
                });
            }

            this.getElement().loader();
            this.ajax('datacube/widgets/map/map.jsb', params, function(result, obj){
                if($this._isDataLoaded){
                    $this.getElement().loader('hide');
                }

                if(result !== 'success'){
                    $this._isMapsLoaded = true;
                    return;
                }

                obj = obj.result;

                for(var i = 0; i < obj.length; i++){
                    $this._maps[i].data = obj[i].data;
                }

                $this._isMapsLoaded = true;
            });
        },

        // utils
        findRegion: function(region, array){
            if(!region){
                return;
            }

            for(var j = 0; j < array.length; j++){
                var name = array[j].region;
                if(!name){
                    continue;
                }

                if(name.indexOf(region) > -1){
                    return array[j];
                }
            }
        }
    },

    $server: {
        $require: ['JSB.Web', 'java:org.jsbeans.helpers.FileHelper'],

        post: function(params){
            for(var i = 0; i < params.maps.length; i++){
                if(FileHelper.fileExists($jsb.getFullPath() + '/' + params.maps[i].path)){
                    params.maps[i].data = JSON.parse(FileHelper.readStringFromFile($jsb.getFullPath() + '/' + params.maps[i].path));
                }
            }

            return Web.response(params.maps, {mode:'json'})
        }
    }
}