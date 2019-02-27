{
	$name: 'DataCube.Query.Syntax',
	$singleton: true,

	$sync: {
		updateCheckInterval: 0
	},

	_logicReplacements: {},
	_queryElements: [],
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
	    // преобразование типов
	    '$toInt', '$toDouble', '$toBoolean', '$toDate', '$toTimestamp', '$toString',
	    // функции агрегации
	    '$any', '$first', '$last', '$sum', '$count', '$min', '$max', '$avg', '$array', '$flatArray', '$expandArray',
	    // функции глобальной агрегации
	    '$gsum', '$gcount', '$gmin', '$gmax', '$gavg', '$grmaxsum', '$grmaxcount', '$grmaxavg', '$grmax', '$grmin',
	    // разное
	    '$const', '$distinct'//, '$query'
	    // test
	    ],
	    ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$like', '$ilike']
	],

	scheme: {
	    $query: {
	        render: '$query'
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

	    // query elements
	    $select: {
	        render: '$select',
	        category: 'Запрос',
	        displayName: 'Столбцы',
	        desc: 'Выражения для формирования выходных полей (значений в столбцах)',
	        removable: false,
	        replaceable: false,
	        defaultValues: {$const: 0},

	        allowOutputFields: false
	    },

	    $groupBy: {
	        render: '$queryElements',
	        displayName: 'Группировка',
	        desc: 'Группировка строк по значениям или выражениям',
	        multiple: true,
	        queryElement: true,
	        replaceable: false,
	        defaultValues: [],
	        defaultAddValues: {$const: 0},

	        allowSourceFields: false
	    },

	    $filter: {
	        render: '$filter',
	        displayName: 'Фильтрация полей источника',
	        desc: 'Фильтрация строк таблицы источника по условию (по умолчанию, если не задан источник, условия накладываются на поля куба)',
	        multiple: true,
	        queryElement: true,
	        replaceable: false,
	        defaultValues: {$and: []},
	        defaultAddValues: {$eq: [{$const: 0}, {$const: 0}]},

	        allowOutputFields: false
	    },

	    $postFilter: {
	        render: '$filter',
	        displayName: 'Фильтрация результата',
	        desc: 'Фильтрация результатов запроса по условию (условия накладываются на выходные столбцы результата запроса)',
	        multiple: true,
	        queryElement: true,
	        replaceable: false,
	        defaultValues: {$and: []},
	        defaultAddValues: {$eq: [{$const: 0}, {$const: 0}]},

	        allowSourceFields: false
	    },
/*
	    $cubeFilter: {
	        render: '$filter',
	        displayName: 'Глобальная фильтрация',
	        desc: 'Дополнительная фильтрация строк куба для всех подзапросов в данном и вложенных срезах',
	        multiple: true,
	        queryElement: true,
	        replaceable: false,
	        defaultValues: {$and: []},
	        defaultAddValues: {$eq: [{$const: 0}, {$const: 0}]}
	    },
*/
	    $sort: {
	        render: '$sort',
	        displayName: 'Сортировка',
	        desc: 'Сортировка элементов (строк)',
	        queryElement: true,
	        replaceable: false,
	        defaultValues: [],
	        defaultAddValues: {$expr: {$const: 0}, $type: 1},

	        allowSourceFields: false
	    },

	    $limit: {
	        render: '$singleValue',
	        displayName: 'Лимит элементов',
	        desc: 'Ограничение количества элементов',
	        queryElement: true,
	        replaceable: false,
	        defaultValues: 10
	    },

	    //$distinct: {},

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
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $sub: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Вычитание',
	        desc: 'Вычитание чисел',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $mul: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Произведение',
	        desc: 'Произведение чисел',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $div: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Деление',
	        desc: 'Деление чисел',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 1}]
	    },

	    $divz: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Деление (!0)',
	        desc: 'Деление чисел (ноль в знаменателе игнорируется)',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 1}]
	    },

	    $mod: {
	        render: '$default',
	        category: 'Математические операторы',
	        displayName: 'Деление по модулю',
	        desc: 'Деление по модулю (получение остатка от деления)',
	        multiple: true,
	        defaultAddValues: {$const: 0},
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
	        render: '$multiField',
	        category: 'Функции',
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
	        category: 'Функции',
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
	        defaultAddValues: {$const: ''},
	        defaultValues: {$const: ''},
	        multiple: true
	    },

	    $regexpReplace: {
	        render: '$multiField',
	        category: 'Функции',
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
	            $flags: {   // todo: селектор с флажками
	                displayName: 'Флажки',
	                defaultValues: '',
	                parameter: true,
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
	        render: '$multiField',
	        category: 'Функции',
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

        // type conversion
	    $toInt: {
	        render: '$default',
	        category: 'Преобразование типов',
	        displayName: 'Целое число',
	        desc: 'Преобразование к целому числу',
	        defaultValues: {$const: 1.56}
	    },

	    $toDouble: {
	        render: '$default',
	        category: 'Преобразование типов',
	        displayName: 'Вещественное число',
	        desc: 'Преобразование к числу с плавающей точкой',
	        defaultValues: {$const: 1.56}
	    },

	    $toBoolean: {
	        render: '$default',
	        category: 'Преобразование типов',
	        displayName: 'Логический тип',
	        desc: 'Преобразование к логическому типу (boolean)',
	        defaultValues: {$const: 1}
	    },

	    $toDate: {
	        render: '$default',
	        category: 'Преобразование типов',
	        displayName: 'Дата',
	        desc: 'Преобразование строки или числа к дате',
	        defaultValues: {$const: 1.56}
	    },

	    $toTimestamp: {
	        render: '$default',
	        category: 'Преобразование типов',
	        displayName: 'Timestamp',
	        desc: 'Преобразование числа к timestamp',
	        defaultValues: {$const: 156000045}
	    },

	    $toString: {
	        render: '$default',
	        category: 'Преобразование типов',
	        displayName: 'Строка',
	        desc: 'Преобразование к строке',
	        defaultValues: {$const: 1.56}
	    },

        // aggregation functions
	    $any: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Любое из',
	        desc: 'Вернуть любое значение в группе',
	        defaultValues: {$const: 1}
	    },

	    $first: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Первое из',
	        desc: 'Вернуть первое значение в группе (если не важен порядок, используйте $any)',
	        defaultValues: {$const: 1}
	    },

	    $last: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Последнее из',
	        desc: 'Вернуть последнее значение в группе (если не важен порядок, используйте $any)',
	        defaultValues: {$const: 1}
	    },

	    $sum: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Сумма',
	        desc: 'Суммировать значения в группе',
	        defaultValues: {$const: 1}
	    },

	    $count: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Количество',
	        desc: 'Вычислить количество элементов в группе',
	        defaultValues: {$const: 1}
	    },

	    $min: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Минимум',
	        desc: 'Вернуть минимальное значение в группе',
	        defaultValues: {$const: 1}
	    },

	    $max: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Максимум',
	        desc: 'Вернуть максимальное значение в группе',
	        defaultValues: {$const: 1}
	    },

	    $avg: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Среднее',
	        desc: 'Вычислить среднее значение в группе (NULL в расчетах не участвует)',
	        defaultValues: {$const: 1}
	    },

	    $array: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Массив',
	        desc: 'Поместить все элементы группы в массив',
	        defaultValues: {$const: 1}
	    },

	    $flatArray: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Склеить массивы',
	        desc: 'Объединить все массивы группы в один массив',
	        defaultValues: {$const: 1}
	    },

	    $expandArray: {
	        render: '$default',
	        category: 'Функции агрегации',
	        displayName: 'Разбить массив',
	        desc: 'Разложить элементы массива на множество элементов ($array/$flatArray наоборот)',
	        defaultValues: {$const: 1}
	    },

	    // global aggregation functions
	    $gsum: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Сумма (глобальная)',
	        desc: 'Сумма всех элементов таблицы (сумма всех групп)',
	        defaultValues: {$const: 1}
	    },

	    $gcount: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Количество (глобальная)',
	        desc: 'Число всех элементов таблицы (сумма размеров всех групп)',
	        defaultValues: {$const: 1}
	    },

	    $gmin: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Минимум (глобальная)',
	        desc: 'Вернуть минимальное значение в таблице (минимальное среди всех групп)',
	        defaultValues: {$const: 1}
	    },

	    $gmax: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Максимум (глобальная)',
	        desc: 'Вернуть максимальное значение в таблице (максимальное среди всех групп)',
	        defaultValues: {$const: 1}
	    },

	    $gavg: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Среднее (глобальная)',
	        desc: 'Вернуть среднее значение в таблице',
	        defaultValues: {$const: 1}
	    },

	    $grmaxsum: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Сумма максимальная (глобальная)',
	        desc: 'Вернуть значение с максимальной суммой элементов в группе (найти группу с максимальной суммой)',
	        defaultValues: {$const: 1}
	    },

	    $grmaxcount: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Количество максимальное (глобальная)',
	        desc: 'Вернуть значение с числом элементов самой крупной группы (найти группу с максимальным числом элементов)',
	        defaultValues: {$const: 1}
	    },

	    $grmaxavg: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Среднее максимальное (глобальная)',
	        desc: 'Вернуть значение с максимальным средним в группе (найти группу с максимальным арифметическим средним)',
	        defaultValues: {$const: 1}
	    },

	    $grmax: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Максимум группы (глобальная)',
	        desc: 'Вернуть максимальное значение группы (найти группу с максимальным значением агрегированного выражения)',
	        defaultValues: {$const: 1}
	    },

	    $grmin: {
	        render: '$default',
	        category: 'Функции глобальной агрегации',
	        displayName: 'Минимум группы (глобальная)',
	        desc: 'Вернуть минимальное значение группы (найти группу с минимальным значением агрегированного выражения)',
	        defaultValues: {$const: 1}
	    },

	    // logic
	    /*
	    $and: {
	        render: '$default',
	        category: 'Логические операторы',
	        displayName: 'И',
	        desc: 'Логический оператор "И"',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $or: {
	        render: '$default',
	        category: 'Логические операторы',
	        displayName: 'ИЛИ',
	        desc: 'Логический оператор "ИЛИ"',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $not: {
	        render: '$default',
	        category: 'Логические операторы',
	        displayName: 'НЕ',
	        desc: 'Логический оператор "НЕ"',
	        multiple: true,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },
	    */

	    // comparison operators
	    $eq: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '=',
	        desc: 'Равно',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $ne: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&ne;',
	        desc: 'Не равно',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $gt: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&gt;',
	        desc: 'Больше',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $gte: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&ge;',
	        desc: 'Больше либо равно',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $lt: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&lt;',
	        desc: 'Меньше',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $lte: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&le;',
	        desc: 'Меньше либо равно',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $like: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&asymp;',
	        desc: 'Поиск по выражению LIKE (используйте % для задания любой подстроки и ? любого символа)',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
	    },

	    $ilike: {
	        render: '$comparison',
	        category: 'Операторы сравнения',
	        displayName: '&sim;',
	        desc: 'Поиск по выражению LIKE без учета регистра (используйте % для задания любой подстроки и ? любого символа)',
	        multiple: true,
	        fixedFieldCount: 2,
	        defaultAddValues: {$const: 0},
	        defaultValues: [{$const: 0},{$const: 0}]
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
	    },

	    $distinct: {
	        render: '$default',
	        category: 'Разное',
	        displayName: 'Убрать повторения',
	        desc: 'Пропустить повторения (уменьшает число элелемнтов в группе)',
	        defaultValues: {$const: 1}
	    }
	},

    ensureReady: function(callback){
        this.ensureTrigger('ready', callback);
    },

	getLogicReplacements: function(key){
	    return this._logicReplacements[key];
	},

    /**
    * Возвращает список ключей, на которые можно заменить указанный ключ
    * @param {string} name - ключ, для которого нудно вернуть список замен
    *
    * @return {array} массив ключей для замены
    */
	getReplacements: function(name){
	    return this._replacementsMap[name];
	},

    /**
    * Возвращает схему по уазанному ключу. Если ключ не указан, возвращает объект со списком всех ключей
    * @param {string} key - ключ
    *
    * @return {object} схема для указанного ключа или объект со схемами для всех ключей
    */
    getSchema: function (key){
        if(key){
            return this.scheme[key];
        }

        return this.scheme;
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
		$constructor: function(){
			$base();
			this.doSync();

			this.ensureSynchronized(function(){
			    $this.setTrigger('ready');
			});
		}
	},

	$server: {
        $constructor: function(){
            $base();

            var logic = [
            {
                 key: '$and',
                 displayName: 'И',
                 desc: 'Логическое И'
            },
            {
                 key: '$or',
                 displayName: 'ИЛИ',
                 desc: 'Логическое ИЛИ'
            },
            {
                 key: '$not',
                 displayName: 'НЕ',
                 desc: 'Логическое НЕ'
            }];

            // create logic replacements
            for(var i = 0; i < logic.length; i++){
                if(!this._logicReplacements[logic[i].key]){
                    this._logicReplacements[logic[i].key] = [];
                }

                for(var j = 0; j < logic.length; j++){
                    if(logic[i].key !== logic[j].key){
                        this._logicReplacements[logic[i].key].push(logic[j]);
                    }
                }
            }

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
                    this._toolItems.push(JSB.merge({}, this.scheme[i], {key: i}));
                }

                // collect source keys
                if(this.scheme[i].isSource){
                    this._sourceKeys[i] = true;
                }

                // collect query elements
                if(this.scheme[i].queryElement){
                    this._queryElements.push(JSB.merge({}, this.scheme[i], {key: i}));
                }
            }
        }
    }
}