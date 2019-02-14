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
            removable: false
	    },

	    $provider: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Таблица базы данных',
	        isSource: true,
	        editable: false,
	        removable: false
	    },

	    $union: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Объединение',
	        desc: 'Задает в качестве источника запроса объединение результатов двух запросов',
	        isSource: true,
	        multiple: true,
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