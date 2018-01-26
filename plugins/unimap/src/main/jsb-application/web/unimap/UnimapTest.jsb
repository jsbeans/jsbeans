{
	$name: 'Unimap.Test',
	$parent: 'JSB.Controls.Control',
	$require: ['Unimap.Controller', 'Datacube.ValueSelector', 'JSB.Controls.Button'],
	$client: {
	    $constructor: function(opts){
	        $base(opts);
	        /*
	        var scheme = {
	            sources: {
	                render: 'sourceBinding',
	                name: 'Sources'
	            },
	            dataBindings: {
	                render: 'dataBinding',
                    name: 'DataBinding',
	                linkTo: 'sources'
	            },
	            users: {
	                render: 'group',
	                name: 'Users',
	                multiple: true,
	                optional: true,
	                items: {
                        name : {
                            render: 'item',
                            name: 'Name',
                            options: {}
                        },
                        surname: {
                            render: 'item',
                            name: 'Surname',
                            options: {}
                        }
	                }
	            },
	            select: {
	                render: 'select',
	                name: 'Select',
	                items: {
	                    sel1: {
	                        name: 'Select_1',
	                        items: {
                                name : {
                                    render: 'item',
                                    name: 'Name',
                                    options: {}
                                },
                                surname: {
                                    render: 'item',
                                    name: 'Surname',
                                    options: {}
                                }
	                        }
	                    }
	                }
	            }
	        };

	        var values = {
	            users: {
	                checked: true,
	                values: [
	                {
	                    name: {
	                        values: [{
	                            value: 'Alex'
	                        }]
	                    },
	                    surname: {
	                        values: [{
	                            value: 'Morgan'
	                        }]
	                    }
	                },
	                {
	                    name: {
	                        values: [{
	                            value: 'Gregor'
	                        }]
	                    },
	                    surname: {
	                        values: [{
	                            value: 'Dokins'
	                        }]
	                    }
	                }
	                ]
	            }
	        };
	        */

	        var scheme = {
                 dataSource: {
                     render: 'sourceBinding',
                     name: 'Источник данных',
                     description: 'Укажите источник данных'
                 },
                 innerWidget: {
                    render: 'innerWidget',
                    name: 'Встроенный виджет'
                 },
                 regions: {
                     render: 'group',
                     name: 'Регионы',
                     collapsable: true,
                     multiple: true,
                     description: 'Укажите регионы',
                     items: {
                         item: {
                             render: 'group',
                             name: 'Серия',
                             items: {
                                 region: {
                                     render: 'dataBinding',
                                     name: 'Имя региона или поле для сопоставления',
                                     linkTo: 'dataSource'
                                 },
                                 value: {
                                     render: 'dataBinding',
                                     name: 'Значения',
                                     linkTo: 'dataSource'
                                 },
                                 geojsonMap: {
                                     render: 'select',
                                     name: 'GeoJson-карта',
                                     items: {
                                         russianRegions: {
                                             name: 'Карта регионов России'
                                         },
                                         russianRegionsMPT: {
                                             name: 'Карта регионов России MPT'
                                         },
                                         worldCountries: {
                                            name: 'Карта мира'
                                         }
                                     }
                                 },
                                 compareTo: {
                                     render: 'select',
                                     name: 'Сопоставление по',
                                     linkTo: 'geojsonMap',
                                     itemsGroups: {
                                         russianRegions: {
                                             forFields: ['russianRegions', 'russianRegionsMPT'],
                                             items: {
                                                 NAME_1: {
                                                     name: 'Имя региона'
                                                 },
                                                 KONST_NUM: {
                                                     name: 'Номер по конституции'
                                                 },
                                                 OKTMO: {
                                                     name: 'Код OKTMO'
                                                 },
                                                 ISO: {
                                                     name: 'Код ISO'
                                                 }
                                             }
                                         },
                                         worldCountries: {
                                             forFields: ['worldCountries'],
                                             items: {
                                                 ru_name: {
                                                     name: 'Название страны'
                                                 },
                                                 id: {
                                                     name: 'Код ISO'
                                                 }
                                             }
                                         }
                                     }
                                 },
                                 fillColor: {
                                    render: 'select',
                                    name: 'Цвет заливки',
                                    items: {
                                        simpleColor: {
                                            name: 'Единый цвет',
                                            items: {
                                                color: {
                                                    render: 'item',
                                                    name: 'Цвет',
                                                    editor: 'color'
                                                }
                                            }
                                        },
                                        rangeColor: {
                                            name: 'Диапазон цветов',
                                            items: {
                                                startColor: {
                                                    render: 'item',
                                                    name: 'Начальный цвет',
                                                    editor: 'color'
                                                },
                                                endColor: {
                                                    render: 'item',
                                                    name: 'Конечный цвет',
                                                    editor: 'color'
                                                },
                                                functionType: {
                                                    render: 'select',
                                                    name: 'Функция вычисления цвета',
                                                    items: {
                                                        linear: {
                                                            name: 'Линейная'
                                                        },
                                                        logarithmic: {
                                                            name: 'Логарифмическая'
                                                        },
                                                        quadratic: {
                                                            name: 'Квадратичная'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                 }
                             }
                         }
                     }
                 },
                 tileMaps: {
                     render: 'group',
                     name: 'Tile-карты',
                     items: {
                         serverUrl: {
                             render: 'select',
                             name: 'Сервер карт',
                             items: {
                                 sputnik: {
                                     name: 'Спутник.ру'
                                 },
                                 openstreetmap: {
                                     name: 'Openstreetmap.org'
                                 },
                                 cartocdn: {
                                     name: 'Cartocdn.com'
                                 },
                                 stamen: {
                                     name: 'Stamen.com'
                                 },
                                 custom: {
                                     name: 'Свой',
                                     items: {
                                         customServer: {
                                             render: 'item',
                                             name: 'Url-адрес'
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 },
                 testItem: {
                    render: 'item',
                    name: 'Тестовое значение',
                    defaultValue: 'По-умолчанию'
                 }
             };

	        var values = {};

	        var renders = [
	            {
	                name: 'group',
	                render: 'Unimap.Render.Group'
                },
	            {
	                name: 'item',
	                render: 'Unimap.Render.Item'
	            },
	            {
	                name: 'select',
	                render: 'Unimap.Render.Select'
	            },
	            {
	                name: 'sourceBinding',
	                render: "Unimap.Render.SourceBinding"
	            },
	            {
	                name: 'dataBinding',
	                render: "Unimap.Render.DataBinding"
	            },
	            {
	                name: 'innerWidget',
	                render: 'Unimap.Render.EmbeddedWidgetBinding'
	            }
	        ];

	        var controller = new Controller({
                 scheme: scheme,
                 values: values,
                 rendersDescription: renders
            });

            this.append(controller);

            var rendersDescription = [
	            {
	                name: 'group',
	                render: 'Unimap.ValueSelectors.Group'
                },
	            {
	                name: 'select',
	                render: 'Unimap.ValueSelectors.Select'
                },
            ]

            var valuesBtn = new Button({
                caption: 'Получить значения',
                onclick: function(){
                    var values = controller.getValues();
                    console.log(values);
                    debugger;
/*
                    var valueSelector = new ValueSelector({
                        rendersDescription: rendersDescription,
                        values: values
                    });

                    valueSelector.ensureInitialized(function(){
                        var res = valueSelector.find('regions > item functionType');
                    });
*/
                }
            });
            this.append(valuesBtn);
	    }
	}
}