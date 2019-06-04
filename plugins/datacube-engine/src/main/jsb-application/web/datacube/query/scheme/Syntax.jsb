/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Syntax',
	$singleton: true,

	$sync: {
		updateCheckInterval: 0
	},

	_macros: {},
	_queryElements: [],
	_replacementsGroups: {},
	_sourceKeys: {},
	_toolItems: [],

	_replacements: {
	    $sources: {
	        categories: ['$querySource']
	    },
	    $source: {
	        categories: ['$slices', '$views']
	    },
	    $default: {
	        categories: ['$sourceFields', '$outputFields', '$mathOperators', '$functions', '$typeConversion', '$group', '$globalAggregation',
	                     '$other', '$comparison', '$logic', '$params', '$views']
	    },
	    $filter: {
	        categories: ['$comparison', '$logic']
	    }
	},

	schemeCategories: {
	    $comparison: {
	        displayName: 'Операторы сравнения'
	    },
	    $globalAggregation: {
	        displayName: 'Функции глобальной агрегации'
	    },
	    $group: {
	        displayName: 'Группировка'
	    },
	    $functions: {
	        displayName: 'Функции'
	    },
	    $logic: {
	        displayName: 'Логические операторы'
	    },
	    $mathOperators: {
	        displayName: 'Математические операторы'
	    },
	    $other: {
	        displayName: 'Разное'
	    },
	    $outputFields: {
	        displayName: 'Поля среза'
	    },
	    $querySource: {
	        displayName: 'Источник запроса'
	    },
	    $params: {
	        displayName: 'Параметры'
	    },
	    $slices: {
	        displayName: 'Срезы'
	    },
	    $sourceFields: {
	        displayName: 'Поля источника'
	    },
	    $typeConversion: {
	        displayName: 'Преобразование типов'
	    },
	    $views: {
	        displayName: 'Именованные подзапросы'
	    }
	},

	constructDefaultValues: function(desc) {
	    var key;

	    if(JSB.isObject(desc)){
	        key = desc.schemeKey || desc.key;
	    }

	    var scheme = this.getScheme(key);

	    if(!scheme) {
	        return;
	    }

	    if(scheme.defaultValuesConstructor) {
	        return scheme.defaultValuesConstructor(desc);
	    } else {
	        var val = {};

	        val[desc.key] = JSB().clone(this.getScheme(key).defaultValues) || {};

	        return val;
	    }
	},

    ensureReady: function(callback) {
        this.ensureTrigger('ready', callback);
    },

    getCategory: function(key) {
        return this.schemeCategories[key];
    },

    getCategories: function() {
        return this.schemeCategories;
    },

    /**
    * Возвращает список ключей, на которые можно заменить указанный ключ
    * @param {string} name - ключ, для которого нудно вернуть список замен
    *
    * @return {array} массив ключей для замены
    */
	getReplacements: function(key, parentKey) {
	    var replacementsGroupKey = '$default';

	    if(parentKey){
            if(this.getScheme(parentKey) && this.getScheme(parentKey).children){
                replacementsGroupKey = this.getScheme(parentKey).children;
            }
	    } else {
            if(this.getScheme(key) && this.getScheme(key).replacements){
                replacementsGroupKey = this.getScheme(key).replacements;
            }
	    }

        return this._replacements[replacementsGroupKey];
	},

	getReplacementItems: function(key, parentKey) {
	    var replacements = this.getReplacements(key, parentKey),
	        items = replacements.items || [];

	    for(var i = 0; i < replacements.categories.length; i++) {
	        items = items.concat(this._replacements[replacements.categories[i]]);
	    }

	    return items;
	},

    /**
    * Возвращает список ключей замены для данного ключа группы
    * @param {key} name - ключ группы, для которой нужно вернуть список замен
    *
    * @return {array} массив ключей для замены
    */
	getReplacementGroup: function(key){
	    var items = [];

	    if(this._replacements[key].categories) {
            for(var i in this.scheme) {
                if(this.scheme[i].category && this._replacements[key].categories.indexOf(this.scheme[i].category) > -1) {
                    items.push(i);
                }
            }
	    }

	    return items;
	},

    /**
    * Возвращает массив схем для замены указанного ключа
    * @param {key} name - ключ, для которого нудно вернуть список замен
    *
    * @return {array} массив схем
    */
	getReplacementGroupItems: function(key){
	    var items = [];

	    if(this._replacements[key].categories) {
            for(var i in this.scheme) {
                if(this.scheme[i].category && this._replacements[key].categories.indexOf(this.scheme[i].category) > -1) {
                    items.push(JSB.merge({}, this.scheme[i], {key: i}));
                }
            }
	    }

	    return items;
	},

    /**
    * Возвращает схему по уазанному ключу. Если ключ не указан, возвращает объект со списком всех ключей
    * @param {string} key - ключ
    *
    * @return {object} схема для указанного ключа или объект со схемами для всех ключей
    */
    getScheme: function (key){
        /*
        if(key){
            return this.scheme[key];
        }

        return this.scheme;
        */
        return this.scheme[key];
    },

    /**
    * Возвращает ключи источников данных
    *
    * @return {object} объект, содержащий в качестве свойств ключи источников данных
    */
    getSourceKeys: function(){
        return this._sourceKeys;
    },

    /**
    * Возвращает массив элементов для отображения во всплывающем окне (для замены)
    *
    * @return {array} массив элементов для отображения во всплывающем окне
    */
    getToolItems: function(){
        return this._toolItems;
    },

    getQueryElements: function(){
        return JSB.clone(this._queryElements);
    },

	$client: {
	    $require: ['DataCube.Query.Extractors.ExtractUtils',
	               'JSB.Widgets.RendererRepository'],

        categoriesFunctions: {
            $outputFields: {
                fill: function(options, callback) {
                    var render = options.render,
                        result = {
                            categoryItems: []
                        };

                    if(!render.getProperty('allowOutputFields')) {
                        result.categoryItems = [];
                        callback.call(null, result);
                        return;
                    }

                    var context = render.getContext(),
                        outputFields = render.getOutputFields();

                    for(var i = 0; i < outputFields.length; i++) {
                        result.categoryItems.push({
                            context: context,
                            item: outputFields[i],
                            key: '$outputFields' + '|' + outputFields[i],
                            schemeKey: '$field',
                            searchId: outputFields[i],
                            value: outputFields[i]
                        });
                    }

                    callback.call(null, result);
                }
            },

            $params: {
                render: function(itemDesc) {
                    return '<div class="key">' + itemDesc.name + '</div><div class="desc">' + itemDesc.item.$type + '</div>';
                }
            },

            $slices: {
                fill: function(options, callback) {
                    var result = {
                        categoryItems: []
                    };

                    var data = options.data;

                    for(var i in data.cubeSlices){
                        result.categoryItems.push({
                            item: data.cubeSlices[i],
                            key: i,
                            schemeKey: '$slices',
                            searchId: data.cubeSlices[i].getName()
                        });
                    }

                    callback.call(null, result);
                }
            },

            $sourceFields: {},

            $views: {
                fill: function(options, callback) {
                    var result = {
                            categoryItems: []
                        };

                    if(options.extendControllers && options.extendControllers['$views']) {
                        var viewsNames = options.extendControllers['$views'].extract();

                        for(var i = 0; i < viewsNames.length; i++) {
                            result.categoryItems.push({
                                item: viewsNames[i],
                                key: viewsNames[i],
                                schemeKey: '$view',
                                value: viewsNames[i]
                            });
                        }
                    }

                    callback.call(null, result);
                },
                render: function(itemDesc) {
                    return '<div class="key">' + itemDesc.item + '</div>';
                }
            }
        },

		$constructor: function(){
			$base();

			this.categoriesFunctions.$outputFields.render = function(itemDesc) {
                if(itemDesc.isHeader) {
                    if(JSB.isInstanceOf(itemDesc.item, 'DataCube.Model.Slice')) {
                        return RendererRepository.createRendererFor(itemDesc.item);
                    } else {
                        return '<div class="contextName">Подзапрос ' + itemDesc.item + '</div>';
                    }
                } else {
                    return '<div class="fieldName cubeFieldIcon sliceField">' + itemDesc.item + '</div>';
                }
			};

            this.categoriesFunctions.$params.fill = function(options, callback) {
                var context = options.render.getContext(),
                    query = options.render.getQuery(),
                    result = {
                        categoryItems: []
                    };

                ExtractUtils.server().extractAllowedParams(query, context, function(params, fail) {
                    if(fail){
                        throw new Error('Ошибка при загрузке доступных полей источников');
                    }

	                var regexp = /\{(.*?)\}/;

                    for(var i in params) {
                        result.categoryItems.push({
                            item: params[i],
                            key: i,
                            name: i.match(regexp)[1],
                            schemeKey: '$param',
                            searchId: i,
                            value: i
                        });
                    }

                    callback.call(null, result);
                });
            },

            this.categoriesFunctions.$slices.render = function(itemDesc) {
                return RendererRepository.createRendererFor(itemDesc.item);
            };

            this.categoriesFunctions.$sourceFields.fill = function(options, callback) {
                var render = options.render,
                    result = {
                        categoryItems: []
                    };

                var allowSourceFields = render.getProperty('allowSourceFields');

                if(allowSourceFields === false) {
                    callback.call(null, result);
                    return;
                }

                ExtractUtils.server().extractAllowedFields(render.getQuery(), render.getContext(), function(sourceFields, fail) {
                    if(fail){
                        throw new Error('Ошибка при загрузке доступных полей источников');
                    }

                    var cubeSlices = render.getData('cubeSlices'),
                        curContext;

                    for(var i = 0; i < sourceFields.length; i++) {
                        if(JSB.isDefined(sourceFields[i].$sourceContext)){
                            if(curContext !== sourceFields[i].$sourceContext){
                                curContext = sourceFields[i].$sourceContext;

                                result.categoryItems.push({
                                    allowSelect: false,
                                    isHeader: true,
                                    item: cubeSlices[curContext],
                                    key: curContext
                                });
                            }
                        } else if(sourceFields[i].$context !== curContext){
                            curContext = sourceFields[i].$context;

                            result.categoryItems.push({
                                allowSelect: false,
                                isHeader: true,
                                item: curContext,
                                key: curContext
                            });
                        }

                        result.categoryItems.push({
                            item: sourceFields[i].$field,
                            key: curContext + '|' + sourceFields[i].$field,

                            context: sourceFields[i].$context,
                            sourceContext: sourceFields[i].$sourceContext,
                            schemeKey: '$field',
                            searchId: sourceFields[i].$field,
                            value: sourceFields[i].$field
                        });
                    }

                    callback.call(null, result);
                });
            }

            this.categoriesFunctions.$sourceFields.render = function(itemDesc) {
                return $this.categoriesFunctions.$outputFields.render(itemDesc);
            }

			this.doSync();

			this.ensureSynchronized(function(){
                $this.server().getClientFields(function(scheme) {
                    $this.scheme = scheme;

                    $this.setTrigger('ready');
                });
			});
		},

		createRender: function(itemDesc) {
		    var catName = itemDesc.category;

            if(this.categoriesFunctions[catName] && this.categoriesFunctions[catName].render) {
                return this.categoriesFunctions[catName].render(itemDesc);
            }
		},

        fillCategory: function(catName, options, callback) {
            if(this.categoriesFunctions[catName] && this.categoriesFunctions[catName].fill) {
                this.categoriesFunctions[catName].fill(options, callback);
            }
        }
	},

	$server: {
        scheme: {
            $query: {
                render: '$query',
                category: '$other',
                displayName: 'Подзапрос',
                desc: 'Запрос внутри запроса',
                allowReplace: true,
                defaultValues: {$from: {}, $select: {}},
                defaultValuesConstructor: function(desc) {
                    return JSB().clone(this.defaultValues);
                }
            },

            $source: {
                replacements: '$source'
            },

            /*******/
            // sources
            $cube: {
                render: '$source',
                category: '$querySource',
                displayName: 'Куб',
                isSource: true,
                allowDelete: false,
                priority: 1,
                allowDelete: false,

                replacements: '$sources'
            },

            $from: {
                render: '$source',
                category: '$querySource',
                displayName: 'Срез',
                desc: 'Задает в качестве источника запроса другой запрос',
                isSource: true,
                priority: 1,
                allowDelete: false,

                replacements: '$sources'
            },

            $join: {
                render: '$join',
                category: '$querySource',
                displayName: 'Пересечение',
                desc: 'Задает в качестве источника запроса перечесение результатов двух запросов',
                isSource: true,
                priority: 1,
                allowDelete: false,

                replacements: '$sources'
            },

            $provider: {
                render: '$source',
                category: '$querySource',
                displayName: 'Таблица базы данных',
                isSource: true,
                allowDelete: false,
                priority: 1,
                allowDelete: false,

                replacements: '$sources'
            },

            $union: {
                render: '$source',
                category: '$querySource',
                displayName: 'Объединение',
                desc: 'Задает в качестве источника запроса объединение результатов двух запросов',
                isSource: true,
                multiple: true,
                priority: 1,
                allowDelete: false,

                replacements: '$sources'
            },

            $recursive: {
                render: '$recursive',
                category: '$querySource',
                displayName: 'Рекурсия',
                desc: 'Рекурсивный запрос',
                isSource: true,
                priority: 1,
                allowDelete: false,

                replacements: '$sources'
            },
            /*******/

            // query elements
            $select: {
                render: '$select',
                displayName: 'Столбцы',
                desc: 'Выражения для формирования выходных полей (значений в столбцах)',
                allowDelete: false,
                allowReplace: false,
                defaultValues: {$const: 0},

                allowOutputFields: false
            },

            $groupBy: {
                render: '$default',
                displayName: 'Группировка',
                desc: 'Группировка строк по значениям или выражениям',
                multiple: true,
                queryElement: true,
                allowReplace: false,
                allowDelete: true,
                defaultValues: [],
                defaultAddValues: {$const: 0},

                allowOutputFields: false
            },

            $filter: {
                render: '$filter',
                displayName: 'Фильтрация полей источника',
                desc: 'Фильтрация строк таблицы источника по условию (по умолчанию, если не задан источник, условия накладываются на поля куба)',

                multiple: true,
                queryElement: true,
                allowReplace: false,
                allowDelete: true,

                defaultValues: {},
                defaultAddValues: {$eq: [{$const: 0}, {$const: 0}]},

                allowOutputFields: false,

                children: '$filter'
            },

            $postFilter: {
                render: '$filter',
                displayName: 'Фильтрация результата',
                desc: 'Фильтрация результатов запроса по условию (условия накладываются на выходные столбцы результата запроса)',
                multiple: true,
                queryElement: true,
                allowReplace: false,
                allowDelete: true,
                defaultValues: {},
                defaultAddValues: {$eq: [{$const: 0}, {$const: 0}]},

                allowSourceFields: false,

                children: '$filter'
            },
    /*
            $cubeFilter: {
                render: '$filter',
                displayName: 'Глобальная фильтрация',
                desc: 'Дополнительная фильтрация строк куба для всех подзапросов в данном и вложенных срезах',
                multiple: true,
                queryElement: true,
                allowReplace: false,
                defaultValues: {$and: []},
                defaultAddValues: {$eq: [{$const: 0}, {$const: 0}]}
            },
    */
            $sort: {
                render: '$sort',
                displayName: 'Сортировка',
                desc: 'Сортировка элементов (строк)',
                queryElement: true,
                allowReplace: false,
                allowDelete: true,
                defaultValues: [],
                defaultAddValues: {$expr: {$const: 0}, $type: 1}
            },

            $field: {
                render: '$field',
                defaultValuesConstructor: function(desc) {
                    return {
                        $context: desc.context,
                        $field: desc.value,
                        $sourceContext: desc.sourceContext
                    }
                }
            },

            $view: {
                render: '$text',
                allowReplace: false,
                allowDelete: false,
                defaultValuesConstructor: function(desc) {
                    return desc.item;
                }
            },

            $views: {
                render: '$paramsViewsBase',
                displayName: 'Именованные подзапросы',
                desc: 'Значения подзапросов',
                queryElement: true,
                allowReplace: false,
                allowDelete: true,
                defaultValues: {},
                defaultAddValues: {$from: {}, $select: {}}
            },

            $param: {
                render: '$param',
                defaultValuesConstructor: function(desc) {
                    return desc.value;
                }
            },

            $params: {
                render: '$paramsViewsBase',
                displayName: 'Параметры',
                desc: 'Значения параметров',
                queryElement: true,
                allowReplace: false,
                allowDelete: true,
                defaultAddValues: {
                    $type: 'string',
                    $defaultValue: null
                },
                defaultValues: {}
            },

            // math operators
            $add: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Сложение',
                desc: 'Сложение чисел',
                multiple: true,
                dragDrop: true,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $sub: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Вычитание',
                desc: 'Вычитание чисел',
                multiple: true,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $mul: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Произведение',
                desc: 'Произведение чисел',
                multiple: true,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $div: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Деление',
                desc: 'Деление чисел',
                multiple: true,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 1}]
            },

            $divz: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Деление (!0)',
                desc: 'Деление чисел (ноль в знаменателе игнорируется)',
                multiple: true,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 1}]
            },

            $mod: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Деление по модулю',
                desc: 'Деление по модулю (получение остатка от деления)',
                multiple: true,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 1}]
            },

            $sqrt: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Корень',
                desc: 'Квадратный корень от числа',
                defaultValues: {$const: 4}
            },

            $pow2: {
                render: '$default',
                category: '$mathOperators',
                displayName: 'Степень',
                desc: 'Возведение числа в квадрат',
                defaultValues: {$const: 2}
            },

            // functions
            $greatest: {
                render: '$default',
                category: '$functions',
                displayName: 'Максимум',
                desc: 'Выбор максимального значения из перечня заданных',
                multiple: true,
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $least: {
                render: '$default',
                category: '$functions',
                displayName: 'Минимум',
                desc: 'Выбор минимального значения из перечня заданных',
                multiple: true,
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $splitString: {
                render: '$multiField',
                category: '$functions',
                displayName: 'Разделить строку',
                desc: 'Разделить строку на несколько (получить массив строк)',
                values: {
                    $field: {
                        displayName: 'Строка',
                        defaultValues: {$const: ''}
                    },
                    $separator: {
                        displayName: 'Разделитель',
                        defaultValues: '',
                        parameter: true,
                        type: 'text'
                    }
                }
            },

            $substring: {
                render: '$multiField',
                category: '$functions',
                displayName: 'Извлечь подстроку',
                values: {
                    $field: {
                        displayName: 'Строка',
                        defaultValues: {$const: ''}
                    },
                    $length: {
                        displayName: 'Длина',
                        defaultValues: 0,
                        parameter: true,
                        type: 'number'
                    }
                }
            },

            $trim: {
                render: '$default',
                category: '$functions',
                displayName: 'Удалить пробелы',
                desc: 'Удалить пробельные символы в начале и в конце строки',
                defaultValues: {$const: ''}
            },

            $concat: {
                render: '$default',
                category: '$functions',
                displayName: 'Склеить строки',
                desc: 'Упорядоченное соединение строк в одну',
                defaultAddValues: {$const: ''},
                defaultValues: {$const: ''},
                multiple: true
            },

            $concatArray: {
                render: '$default',
                category: '$functions',
                displayName: 'Сформировать массив',
                desc: 'Формирование массива из заданных значений',
                defaultAddValues: {$const: 0},
                defaultValues: {$const: 0},
                multiple: true
            },

            $regexpReplace: {
                render: '$multiField',
                category: '$functions',
                displayName: 'Замена по шаблону',
                desc: 'Замена подстроки с использованием регулярного выражения POSIX',
                values: {
                    $field: {
                        displayName: 'Строка',
                        defaultValues: {$const: ''}
                    },
                    $pattern: {
                        displayName: 'Шаблон',
                        defaultValues: '',
                        parameter: true,
                        type: 'text'
                    },
                    $replacementString: {
                        displayName: 'Строка замены',
                        defaultValues: '',
                        parameter: true,
                        type: 'text'
                    },
                    $flags: {   // todo: теги с флажками
                        displayName: 'Флажки',
                        defaultValues: '',
                        parameter: true,
                        type: 'text'
                    }
                }
            },

            $dateYear: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь год',
                desc: 'Извлечь год из даты (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $dateMonth: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь месяц',
                desc: 'Извлечь номер месяца из даты (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $dateMonthDay: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь день',
                desc: 'Извлечь день месяца (1-31) из даты (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $dateWeekDay: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь день недели',
                desc: 'Извлечь день недели (воскресенье 0 - суббота 6) из даты (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $dateYearDay: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь день в году',
                desc: 'Извлечь день в году (1-365/366) из даты (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $dateTotalSeconds: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь секунды',
                desc: 'Извлечь секунды из даты (date/timestamp; начиная отсчет с 1970-01-01)',
                defaultValues: {$const: 1550252269}
            },

            $dateIntervalOrder: {
                render: '$multiField',
                category: '$functions',
                displayName: 'Разбить дату',
                desc: 'Разбить дату (date/timestamp) на равные интервалы в секундах и вернуть порядковый номер',
                values: {
                    $field: {
                        displayName: 'Дата',
                        defaultValues: {$const: 1550252269}
                    },
                    $seconds: {
                        displayName: 'Интервал',
                        defaultValues: 10,
                        parameter: true,
                        type: 'number'
                    }
                }
            },

            $timeHour: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь час',
                desc: 'Извлечь час в сутках (0-23) из даты/времени (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $timeMinute: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь минуты',
                desc: 'Извлечь минуты в часе (0-59) из даты/времени (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $timeSecond: {
                render: '$default',
                category: '$functions',
                displayName: 'Извлечь секунды',
                desc: 'Извлечь секунды в в минуте (0-59) из даты/времени (date/timestamp)',
                defaultValues: {$const: 1550252269}
            },

            $coalesce: {
                render: '$default',
                category: '$functions',
                displayName: 'Первое не NULL',
                desc: 'Возвращает первое не NULL значение, перебирая заданные выражения по очереди',
                multiple: true,
                defaultValues: {$const: 0}
            },

            $similarity: {
                render: '$default',
                category: '$functions',
                displayName: 'Похожесть строк',
                desc: 'Вычисление похожести двух строк',
                multiple: true,
                fixedFieldCount: 2,
                defaultValues: [{$const: ''}, {$const: ''}]
            },

            // type conversion
            $toInt: {
                render: '$default',
                category: '$typeConversion',
                displayName: 'Целое число',
                desc: 'Преобразование к целому числу',
                defaultValues: {$const: 1.56}
            },

            $toDouble: {
                render: '$default',
                category: '$typeConversion',
                displayName: 'Вещественное число',
                desc: 'Преобразование к числу с плавающей точкой',
                defaultValues: {$const: 1.56}
            },

            $toBoolean: {
                render: '$default',
                category: '$typeConversion',
                displayName: 'Логический тип',
                desc: 'Преобразование к логическому типу (boolean)',
                defaultValues: {$const: 1}
            },

            $toDate: {
                render: '$default',
                category: '$typeConversion',
                displayName: 'Дата',
                desc: 'Преобразование строки или числа к дате',
                defaultValues: {$const: 1.56}
            },

            $toTimestamp: {
                render: '$default',
                category: '$typeConversion',
                displayName: 'Timestamp',
                desc: 'Преобразование числа к timestamp',
                defaultValues: {$const: 156000045}
            },

            $toString: {
                render: '$default',
                category: '$typeConversion',
                displayName: 'Строка',
                desc: 'Преобразование к строке',
                defaultValues: {$const: 1.56}
            },

            // aggregation functions
            $any: {
                render: '$default',
                category: '$group',
                displayName: 'Любое из',
                desc: 'Вернуть любое значение в группе',
                defaultValues: {$const: 1}
            },

            $first: {
                render: '$default',
                category: '$group',
                displayName: 'Первое из',
                desc: 'Вернуть первое значение в группе (если не важен порядок, используйте $any)',
                defaultValues: {$const: 1}
            },

            $last: {
                render: '$default',
                category: '$group',
                displayName: 'Последнее из',
                desc: 'Вернуть последнее значение в группе (если не важен порядок, используйте $any)',
                defaultValues: {$const: 1}
            },

            $sum: {
                render: '$default',
                category: '$group',
                displayName: 'Сумма',
                desc: 'Суммировать значения в группе',
                defaultValues: {$const: 1}
            },

            $count: {
                render: '$default',
                category: '$group',
                displayName: 'Количество',
                desc: 'Вычислить количество элементов в группе',
                defaultValues: {$const: 1}
            },

            $min: {
                render: '$default',
                category: '$group',
                displayName: 'Минимум',
                desc: 'Вернуть минимальное значение в группе',
                defaultValues: {$const: 1}
            },

            $max: {
                render: '$default',
                category: '$group',
                displayName: 'Максимум',
                desc: 'Вернуть максимальное значение в группе',
                defaultValues: {$const: 1}
            },

            $avg: {
                render: '$default',
                category: '$group',
                displayName: 'Среднее',
                desc: 'Вычислить среднее значение в группе (NULL в расчетах не участвует)',
                defaultValues: {$const: 1}
            },

            $array: {
                render: '$default',
                category: '$group',
                displayName: 'Массив',
                desc: 'Поместить все элементы группы в массив',
                defaultValues: {$const: 1}
            },

            $flatArray: {
                render: '$default',
                category: '$group',
                displayName: 'Склеить массивы',
                desc: 'Объединить все массивы группы в один массив',
                defaultValues: {$const: 1}
            },

            $expandArray: {
                render: '$default',
                category: '$group',
                displayName: 'Разбить массив',
                desc: 'Разложить элементы массива на множество элементов ($array/$flatArray наоборот)',
                defaultValues: {$const: 1}
            },

            $group: {
                render: '$default',
                category: '$group',
                displayName: 'Группировка по',
                desc: 'Установить выражение идентификатором группы (аналогично копированию выражения в $groupBy)',
                defaultValues: {$const: 1}
            },

            // global aggregation functions
            $gsum: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Сумма (глобальная)',
                desc: 'Сумма всех элементов таблицы (сумма всех групп)',
                defaultValues: {$const: 1}
            },

            $gcount: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Количество (глобальная)',
                desc: 'Число всех элементов таблицы (сумма размеров всех групп)',
                defaultValues: {$const: 1}
            },

            $gmin: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Минимум (глобальная)',
                desc: 'Вернуть минимальное значение в таблице (минимальное среди всех групп)',
                defaultValues: {$const: 1}
            },

            $gmax: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Максимум (глобальная)',
                desc: 'Вернуть максимальное значение в таблице (максимальное среди всех групп)',
                defaultValues: {$const: 1}
            },

            $gavg: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Среднее (глобальная)',
                desc: 'Вернуть среднее значение в таблице',
                defaultValues: {$const: 1}
            },

            $grmaxsum: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Сумма максимальная (глобальная)',
                desc: 'Вернуть значение с максимальной суммой элементов в группе (найти группу с максимальной суммой)',
                defaultValues: {$const: 1}
            },

            $grmaxcount: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Количество максимальное (глобальная)',
                desc: 'Вернуть значение с числом элементов самой крупной группы (найти группу с максимальным числом элементов)',
                defaultValues: {$const: 1}
            },

            $grmaxavg: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Среднее максимальное (глобальная)',
                desc: 'Вернуть значение с максимальным средним в группе (найти группу с максимальным арифметическим средним)',
                defaultValues: {$const: 1}
            },

            $grmax: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Максимум группы (глобальная)',
                desc: 'Вернуть максимальное значение группы (найти группу с максимальным значением агрегированного выражения)',
                defaultValues: {$const: 1}
            },

            $grmin: {
                render: '$default',
                category: '$globalAggregation',
                displayName: 'Минимум группы (глобальная)',
                desc: 'Вернуть минимальное значение группы (найти группу с минимальным значением агрегированного выражения)',
                defaultValues: {$const: 1}
            },

            // logic
            $and: {
                render: '$default',
                category: '$logic',
                displayName: 'И',
                desc: 'Логический оператор "И"',
                multiple: true,
                defaultAddValues: { $eq: [{$const: 0},{$const: 0}] },
                defaultValues: [{ $eq: [{$const: 0},{$const: 0}] }],

                children: '$filter'
            },

            $or: {
                render: '$default',
                category: '$logic',
                displayName: 'ИЛИ',
                desc: 'Логический оператор "ИЛИ"',
                multiple: true,
                defaultAddValues: { $eq: [{$const: 0},{$const: 0}] },
                defaultValues: [{ $eq: [{$const: 0},{$const: 0}] }],

                children: '$filter'
            },

            $not: {
                render: '$default',
                category: '$logic',
                displayName: 'НЕ',
                desc: 'Логический оператор "НЕ"',
                defaultValues: { $eq: [{$const: 0},{$const: 0}] },

                children: '$filter'
            },

            // comparison operators
            $eq: {
                render: '$default',
                category: '$comparison',
                displayName: '=',
                desc: 'Равно',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $ne: {
                render: '$default',
                category: '$comparison',
                displayName: '&ne;',
                desc: 'Не равно',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $gt: {
                render: '$default',
                category: '$comparison',
                displayName: '&gt;',
                desc: 'Больше',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $gte: {
                render: '$default',
                category: '$comparison',
                displayName: '&ge;',
                desc: 'Больше либо равно',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $lt: {
                render: '$default',
                category: '$comparison',
                displayName: '&lt;',
                desc: 'Меньше',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $lte: {
                render: '$default',
                category: '$comparison',
                displayName: '&le;',
                desc: 'Меньше либо равно',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $like: {
                render: '$default',
                category: '$comparison',
                displayName: '&asymp;',
                desc: 'Поиск по выражению LIKE (используйте % для задания любой подстроки и ? любого символа)',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            $ilike: {
                render: '$default',
                category: '$comparison',
                displayName: '&sim;',
                desc: 'Поиск по выражению LIKE без учета регистра (используйте % для задания любой подстроки и ? любого символа)',
                multiple: true,
                fixedFieldCount: 2,
                sortable: false,
                defaultAddValues: {$const: 0},
                defaultValues: [{$const: 0},{$const: 0}]
            },

            // another
            $const: {
                render: '$const',
                category: '$other',
                displayName: 'Константа',
                desc: 'Постоянное значение выбранного типа',
                defaultValues: 0,
                values: [
                {
                    key: 'number',
                    displayName: 'Число',
                    desc: 'Числовая константа'
                },
                {
                    key: 'string',
                    displayName: 'Текст',
                    desc: 'Текстовая константа'
                },
                {
                    key: 'boolTrue',
                    displayName: 'Истина',
                    desc: 'Булева истина'
                },
                {
                    key: 'boolFalse',
                    displayName: 'Ложь',
                    desc: 'Булева ложь'
                },
                {
                    key: 'null',
                    displayName: 'Нуль',
                    desc: 'Пустое значение'
                }
                ]
            },

            $distinct: {
                render: '$default',
                category: '$other',
                displayName: 'Убрать повторения',
                desc: 'Пропустить повторения (уменьшает число элелементов в группе)',
                defaultValues: {$const: 1}
            },

            $if: {
                render: '$multiField',
                category: '$other',
                displayName: 'Условие',
                desc: 'Условное выражение',
                values: {
                    $cond: {
                        displayName:'Условие',
                        desc:'Условное выражение',
                        renderName: '$filter',
                        scopeValue: true,
                        wrap: false
                    },
                    $then: {
                        displayName: 'Истина',
                        defaultValues: {$const: 0}
                    },
                    $else: {
                        displayName: 'Ложь',
                        defaultValues: {$const: 0}
                    }
                }
            }
        },

        $constructor: function() {
            $base();

            var defaultValues = {
                allowDelete: true,
                allowEdit: true,
                allowReplace: true,
            };

            for(var i in this.scheme) {
                // set defaults
                for(var j in defaultValues) {
                    if(!JSB.isDefined(this.scheme[i][j])) {
                        this.scheme[i][j] = defaultValues[j];
                    }
                }

                // create tool categories
                if(this.scheme[i].category) {
                    if(!this.schemeCategories[this.scheme[i].category].items) {
                        this.schemeCategories[this.scheme[i].category].items = [];
                    }

                    this.schemeCategories[this.scheme[i].category].items.push(i);

                    this._toolItems.push(JSB.merge({}, this.scheme[i], {key: i, schemeKey: i, searchId: i + '|' + this.scheme[i].displayName}));
                }

                // collect source keys
                if(this.scheme[i].isSource) {
                    this._sourceKeys[i] = true;
                }

                // collect query elements
                if(this.scheme[i].queryElement) {
                    this._queryElements.push(JSB.merge({}, this.scheme[i], {key: i}));
                }
            }

            this.registerBaseMacros();
        },

        getClientFields: function() {
            return this.scheme;
        },

        registerMacro: function(definition, values, objectGenerator){
            this.scheme[definition.name] = {
                render: '$multiField', //definition.renderName, //'$multiField',
                category: 'Макросы',
                displayName: definition.displayName || definition.name,
                desc: definition.desc,
                values: values,
                allowReplace: true
            };

		    this._macros[definition.name] = {
		        name: definition.name,
		        def: definition,
		        structure: values,
		        objectGenerator: objectGenerator
		    };

            this._toolItems.push(JSB.merge({}, this.scheme[definition.name], {key: definition.name, schemeKey: definition.name, searchId: definition.name + '|' + definition.displayName}));

            if(!this._replacements.$default.items) {
                this._replacements.$default.items = [];
            }

            this._replacements.$default.items.push(definition.name);
        },

		unwrapMacrosCurrentQuery: function(dcQuery, rootQuery){
		    function validateMacro(exp, macro){
		        var structure = macro.structure;
		        for (var f in structure) if(structure.hasOwnProperty(f)) {
		            if (typeof exp[f] === 'undefined') {
		                throw new Error('Field ' + f + ' is not defined in ' + macro.name);
		            }
		        }
		    }

		    function unwrapExpression(exp, setFunc) {
		        if (JSB.isPlainObject(exp)) {
		            var key = Object.keys(exp)[0];
		            for (var name in $this._macros) {
		                if (name == key) {
		                    validateMacro(exp[key], $this._macros[name].structure);
		                    setFunc($this._macros[name].objectGenerator.call(null, exp[key], dcQuery, rootQuery));
		                    return;
		                }
		            }
		            for (var f in exp) if(exp.hasOwnProperty(f)) {
		                unwrapExpression(exp[f], function(newExp){
		                   exp[f] = newExp;
		               });
		            }
		        } else if (JSB.isArray(exp)) {
		            for (var i in exp) {
		                unwrapExpression(exp[i], function(newExp){
		                    exp[i] = newExp;
		                });
		            }
		        }
		    }

		    for (var alias in dcQuery.$select) if(dcQuery.$select.hasOwnProperty(alias)) {
		        unwrapExpression(dcQuery.$select[alias], function(newExp){
		            dcQuery.$select[alias] = newExp;
		        });
		    }
		},

		registerBaseMacros: function(){
            $this.registerMacro(
                {
                    name:'$similarity2',
                    desc: 'Поиск похожих со значением по умолчанию. Если значение $value не определено, то подставляет $defaultValue, иначе`similarity($expr, $value) .'
                },
                {
                    $expr: {
                        displayName: 'Основное выражение',
                        desc: 'Ззадает основное значение и первый аргумент similarity',
                        defaultValues: {$const: ''}
                    },
                    $value: {
                        displayName: 'Проверяемое выражение',
                        desc: 'Задает проверяемое значение и второй аргумент similarity',
                        defaultValues: {$const: ''}
                    },
                    $defaultValue: {
                        displayName: 'Значение по умолчанию',
                        desc: 'Значение по умолчанию, которое подставляется в результат при $value = null',
                        defaultValues: 1,
                        parameter: true,
                        type: 'number'
                    },
                },
                function(expr, dcQuery, rootQuery) {
                    return {
                        $if:{
                            $cond: {$eq:[ expr.$value, {$const: null} ]},
                            $then: {$const: expr.$defaultValue},
                            $else: {
                                $similarity: [expr.$expr, expr.$value]
                            }
                        }
                    };
                }
            );
		}
    }
}