{
	$name: 'DataCube.Query.Syntax',
	$singleton: true,

	$sync: {
		updateCheckInterval: 0
	},

	_replacementsMap: {},
	_sourceKeys: {},
	_toolItems: [],

	replacements: [
	    ['$join', '$from', '$union', '$cube'],
	    ['$source'],
	    ['$field',
	    // матеметические операции
	    '$add', '$sub', '$mul', '$div', '$divz', '$mod', '$sqrt', '$pow2',
	    // функции
	    '$greatest', '$least', '$splitString', '$substring', '$trim', '$concat', '$regexpReplace',
	    '$dateYear', '$dateMonth', '$dateMonthDay', '$dateWeekDay', '$dateYearDay', '$dateTotalSeconds',
	    '$dateIntervalOrder', '$timeHour', '$timeMinute', '$timeSecond',
	    // разное
	    '$const']
	],

	scheme: {
	    $query: {
	        render: '$query',
	    },

        /*******/
        // sources
	    $cube: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Куб',
	        isSource: true,
	        editable: false,
	        priority: 1,
	        removable: false
	    },

	    $from: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Срез',
	        desc: 'Задает в качестве источника запроса другой запрос',
	        isSource: true,
	        priority: 1,
	        removable: false
	    },

	    $join: {
            render: '$join',
            category: 'Источник запроса',
            displayName: 'Пересечение',
            desc: 'Задает в качестве источника запроса перечесение результатов двух запросов',
            isSource: true,
            priority: 1,
            removable: false
	    },

	    $provider: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Таблица базы данных',
	        isSource: true,
	        editable: false,
	        priority: 1,
	        removable: false
	    },

	    $union: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Объединение',
	        desc: 'Задает в качестве источника запроса объединение результатов двух запросов',
	        isSource: true,
	        multiple: true,
	        priority: 1,
	        removable: false
	    },
	    /*******/
	    $select: {
	        render: '$select',
	        category: 'Запрос',
	        displayName: 'Столбцы',
	        desc: 'Выражения для формирования выходных полей (значений в столбцах)',
	        removable: false,
	        replaceable: false,
	        defaultValues: {$const: 0}
	    },

	    $field: {
	        render: '$field'
	    },

	    // math operators
	    $add: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Сложение',
	        desc: 'Сложение чисел',
	        multiple: true,
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $sub: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Вычитание',
	        desc: 'Вычитание чисел',
	        multiple: true,
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $mul: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Произведение',
	        desc: 'Произведение чисел',
	        multiple: true,
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $div: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Деление',
	        desc: 'Деление чисел',
	        multiple: true,
	        defaultValues: [{$const: 0},{$const: 1}]
	    },

	    $divz: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Деление (!0)',
	        desc: 'Деление чисел (ноль в знаменателе игнорируется)',
	        multiple: true,
	        defaultValues: [{$const: 0},{$const: 1}]
	    },

	    $mod: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Деление по модулю',
	        desc: 'Деление по модулю (получение остатка от деления)',
	        multiple: true,
	        defaultValues: [{$const: 0},{$const: 1}]
	    },

	    $sqrt: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Корень',
	        desc: 'Квадратный корень от числа',
	        defaultValues: {$const: 4}
	    },

	    $pow2: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Степень',
	        desc: 'Возведение числа в квадрат',
	        defaultValues: {$const: 2}
	    },

	    // functions
	    $greatest: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Максимум',
	        desc: 'Выбор максимального значения из перечня заданных',
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $least: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Минимум',
	        desc: 'Выбор минимального значения из перечня заданных',
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $splitString: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Разделить строку',
	        desc: 'Разделить строку на несколько (получить массив строк)',
	        defaultValues: {$const: ''},
	        valueName: 'Строка',
	        parameters: {
	            $separator: {
	                displayName: 'Разделитель',
	                defaultValue: '',
	                type: 'text'
	            }
	        }
	    },

	    $substring: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь подстроку',
	        desc: 'Извлекает подстроку начиная с указанной позиции',
	        defaultValues: {$const: ''},
	        valueName: 'Строка',
	        parameters: {
	            $separator: {
	                displayName: 'Индекс',
	                defaultValue: 0,
	                type: 'number'
	            }
	        }
	    },

	    $trim: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Удалить пробелы',
	        desc: 'Удалить пробельные символы в начале и в конце строки',
	        defaultValues: {$const: ''}
	    },

	    $concat: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Склеить строки',
	        desc: 'Упорядоченное соединение строк в одну',
	        defaultValues: {$const: ''},
	        multiple: true
	    },

	    $regexpReplace: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Замена по шаблону',
	        desc: 'Замена подстроки с использованием регулярного выражения POSIX',
	        defaultValues: {$const: ''},
	        valueName: 'Строка',
	        parameters: {
	            $pattern: {
	                displayName: 'Шаблон',
	                defaultValue: '',
	                type: 'text'
	            },
	            $replacementString: {
	                displayName: 'Строка замены',
	                defaultValue: '',
	                type: 'text'
	            },
	            // todo: селектор с флажками
	            $flags: {
	                displayName: 'Флажки',
	                defaultValue: '',
	                type: 'text'
	            }
	        }
	    },

	    $dateYear: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь год',
	        desc: 'Извлечь год из даты (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $dateMonth: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь месяц',
	        desc: 'Извлечь номер месяца из даты (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $dateMonthDay: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь день',
	        desc: 'Извлечь день месяца (1-31) из даты (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $dateWeekDay: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь день недели',
	        desc: 'Извлечь день недели (воскресенье 0 - суббота 6) из даты (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $dateYearDay: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь день в году',
	        desc: 'Извлечь день в году (1-365/366) из даты (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $dateTotalSeconds: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь секунды',
	        desc: 'Извлечь секунды из даты (date/timestamp; начиная отсчет с 1970-01-01)',
	        defaultValues: {$const: 1550252269}
	    },

	    $dateIntervalOrder: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Разбить дату',
	        desc: 'Разбить дату (date/timestamp) на равные интервалы в секундах и вернуть порядковый номер',
	        defaultValues: {$const: 1550252269},
	        valueName: 'Дата',
	        parameters: {
	            $seconds: {
	                displayName: 'Интервал',
	                defaultValue: 10,
	                type: 'number'
	            }
	        }
	    },

	    $timeHour: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь час',
	        desc: 'Извлечь час в сутках (0-23) из даты/времени (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $timeMinute: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь минуты',
	        desc: 'Извлечь минуты в часе (0-59) из даты/времени (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    $timeSecond: {
	        render: '$default',
	        category: 'Функции',
	        displayName: 'Извлечь секунды',
	        desc: 'Извлечь секунды в в минуте (0-59) из даты/времени (date/timestamp)',
	        defaultValues: {$const: 1550252269}
	    },

	    // another
	    $const: {
	        render: '$const',
	        category: 'Разное',
	        displayName: 'Константа',
	        desc: 'Постоянное значение выбранного типа',
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
	    }
	},

	getReplacements: function(name){
	    return this._replacementsMap[name];
	},

    getSchema: function (key){
        if(key){
            return this.scheme[key];
        }

        return this.scheme;
    },

    getSourceKeys: function(){
        return this._sourceKeys;
    },

    getToolItems: function(){
        return this._toolItems;
    },

	$client: {
		$constructor: function(){
			$base();
			$this.doSync();
		}
	},

	$server: {
        $constructor: function(){
            $base();

            // create replacement map
            for(var i = 0; i < this.replacements.length; i++){
                for(var j = 0; j < this.replacements[i].length; j++){
                    if(!this._replacementsMap[this.replacements[i][j]]){
                        this._replacementsMap[this.replacements[i][j]] = [];
                    }

                    for(var k = 0; k < this.replacements[i].length; k++){
                        /*
                        if(this.replacements[i][j] !== this.replacements[i][k]){
                            this._replacementsMap[this.replacements[i][j]].push(this.replacements[i][k]);
                        }
                        */
                        this._replacementsMap[this.replacements[i][j]].push(this.replacements[i][k]);
                    }
                }
            }

            for(var i in this.scheme){
                // set defaults
                if(!JSB.isDefined(this.scheme[i].removable)){
                    this.scheme[i].removable = true;
                }

                if(!JSB.isDefined(this.scheme[i].editable)){
                    this.scheme[i].editable = true;
                }

                if(!JSB.isDefined(this.scheme[i].replaceable)){
                    this.scheme[i].replaceable = true;
                }

                // create tool categories
                if(this.scheme[i].category){
                    this._toolItems.push(JSB.merge({}, this.scheme[i], {key: i}))
                }

                // collect source keys
                if(this.scheme[i].isSource){
                    this._sourceKeys[i] = true;
                }
            }
        }
    }
}