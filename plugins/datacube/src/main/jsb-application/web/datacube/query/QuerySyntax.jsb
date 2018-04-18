{
	$name: 'DataCube.Query.QuerySyntax',
	$singleton: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	schemeExpressions: {},
	
	getSchema: function (){
	    return this.schemeExpressions;
	},

	isAggregateOperator: function(op){
	    var desc = this.getSchema()[op];
	    if (!desc) throw new Error('Operator ' + op + ' is not defined in schema');
	    return !!desc.aggregate;
	},

	$client: {
		$constructor: function(){
			$base();
			$this.doSync();
		}
	},

	$server: {
		$constructor: function(){
		    function installSuper(obj, _super) {
		        if (!Object.setPrototypeOf) {
		            obj.__proto__ = _super;
		        } else {
		            Object.setPrototypeOf(obj, _super);
		        }
		
		        return _super;
		    };
		
		    function installExpression(expr) {
		        $this.schemeExpressions = $this.schemeExpressions || {};
		        $this.schemeExpressions[expr.name] = expr;
		    }
		
		    /** Abstract expression value
		    */
		    this.Expression = function Expression(desc) {
		   		desc.expressionType = desc.expressionType || 'Expression';
		        JSB.merge(true, this, desc);
		        if (!this.name) throw new Error('Undefined expression name');
		        if (!this.type) throw new Error(this.name + ': ' + 'Undefined expression type for');
		
		        installExpression(this);
		    };
		
		    /** Group of expressions
		    */
		    this.Group = function Group(desc) {
		        desc.type = 'group';
		        desc.expressionType = desc.expressionType || 'Group';
		        if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined expressions of group');
		        var _super = installSuper(this, new $this.EObject(desc));
		    };
		
		    /** String expression value
		    */
		    this.EString = function EString(desc) {
		        desc.type = 'string';
		        desc.expressionType = desc.expressionType || 'EString';
		        var _super = installSuper(this, new $this.Expression(desc));
		    };
		
		    /** Abstract object expression value
		    */
		    this.EArray = function EArray(desc) {
		        desc.type = 'array';
		        desc.expressionType = desc.expressionType || 'EArray';
		        if (!desc.values || Object.keys(desc.values).length < 1) throw new Error(desc.name + ': ' + 'Undefined values ');
		        var _super = installSuper(this, new $this.Expression(desc));
		    };
		
		    this.EConst = function EConst(desc) {
		    	desc.expressionType = desc.expressionType || 'EConst';
		        var _super = installSuper(this, new $this.Expression(desc));
		    };
		    this.EConstNumber = function EConstNumber(desc) {
		        desc.type = 'number';
		        desc.expressionType = desc.expressionType || 'EConstNumber';
		        var _super = installSuper(this, new $this.EConst(desc));
		    };
		    this.EConstBoolean = function EConstBoolean(desc) {
		        desc.type = 'boolean';
		        desc.expressionType = desc.expressionType || 'EConstBoolean';
		        var _super = installSuper(this, new $this.EConst(desc));
		    };
		    this.EConstString = function EConstString(desc) {
		        desc.type = 'string';
		        desc.expressionType = desc.expressionType || 'EConstString';
		        var _super = installSuper(this, new $this.EConst(desc));
		    };
		    this.EConstNull = function EConstNull(desc) {
		        desc.type = 'null';
		        desc.expressionType = desc.expressionType || 'EConstNull';
		        var _super = installSuper(this, new $this.EConst(desc));
		    };
		
		    /** Abstract object expression value
		    */
		    this.EObject = function EObject(desc) {
		        desc.type = 'object';
		        desc.expressionType = desc.expressionType || 'EObject';
		        var _super = installSuper(this, new $this.Expression(desc));
		    };
		
		    /** Single key object expression value
		    */
		    this.SingleObject = function SingleObject(desc) {
		        if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined object expression values ');
		        desc.expressionType = desc.expressionType || 'SingleObject';
		        var _super = installSuper(this, new $this.EObject(desc));
		    };
		
		    /** Multi keys object expression value - has optional or mandatory N keys
		    */
		    this.ComplexObject = function ComplexObject(desc) {
		        if (JSB.isArray(desc.values)) {
		            var arr = desc.values;
		            desc.values = {};
		            for (var i in arr) {
		                desc.values[arr[i]] = arr[i];
		            }
		        }
		        if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined object expression values');
		        desc.expressionType = desc.expressionType || 'ComplexObject';
		        var _super = installSuper(this, new $this.EObject(desc));
		    };
		
		
		    new this.ComplexObject({
		        name: '$query',
		        desc: 'Подзапрос',
		        values: {
		            '$context': '$contextName',
		            '$filter': '$filter',
		            '$groupBy': '$groupBy',
		            '$select': '$select',
		            '$from':'$from',
		            '$distinct': '$distinctAll',
		            '$postFilter': '$postFilter',
		            '$cubeFilter': '$cubeFilter',
		            '$sort': '$sort',
		            '$limit': '$limit',
		            '$finalize': '$finalize',
		            '$sql': '$sqlQuery',
		        },
		        optional: ['$context', '$filter', '$groupBy', '$from', '$distinct', '$postFilter', '$cubeFilter', '$sort', '$finalize', '$sql','$limit']
		    });

		    new this.ComplexObject({
		        name: '$select',
		        desc: 'Выражения для формирования выходных полей (значений в столбцах)',
		        displayName: 'Столбцы',
		        customKey: '#outputFieldName',
		        values: {
		            '#outputFieldName': '$valueDefinition'
		        },
		    });
		
		    new this.Group({
		    	name: '$from',
		        displayName: 'Источник запроса',
		    	desc: 'Промежуточный запрос с несколькими столбцами',
		        values: ['$query', '$viewName'],
		    });
		
		    new this.Group({
		    	name: '$valueDefinition',
		        values: ['$const', '$expression', '$query', '$field', '$param', '$sql'],
		    });
		
		    new this.Group({
		        name: '$expression',
		        values: [
		            '$add', '$sub', '$mul', '$div', '$divz', '$mod',
		            '$greatest', '$least',
		            '$splitString', '$substring', '$trim', '$concat',
		            '$toInt', '$toDouble', '$toBoolean', '$toDate', '$toString', '$toTimestamp',
		            '$dateMonthDay', '$dateWeekDay', '$dateYearDay', '$timeHour', '$timeMinute', '$timeSecond',
		            '$dateYear', '$dateMonth', '$dateTotalSeconds', '$dateIntervalOrder',
		            '$distinct',
		            '$any', '$last','$first', '$sum', '$count','$min', '$max', '$avg',
		            '$array', '$flatArray', '$expandArray', '$concatArray',
		            '$gsum', '$gcount', '$gmin', '$gmax', '$gavg',
		            '$grmaxsum', '$grmaxcount', '$grmaxavg', '$grmax', '$grmin',
		            '$if', '$coalesce',
		            '$macros'
		        ]
		    });

		    new this.Group({
		        name: '$macros',
		        macro: true,
		        values: []
		    });

		    new this.EArray({
		        name: '$fieldsArray',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$field'],
		    });
		    new this.SingleObject({
		        name: '$add',
		        displayName: '+',
		        category: 'Математические операторы',
		        desc: 'Сложение чисел',
		        values: ['$addValues'],
		    });
		    new this.EArray({
		        name: '$addValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$sub',
		        displayName: '-',
		        category: 'Математические операторы',
		        desc: 'Вычитание чисел',
		        values: ['$subValues'],
		    });
		    new this.EArray({
		        name: '$subValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$mul',
		        displayName: '*',
		        category: 'Математические операторы',
		        desc: 'Произведение чисел',
		        values: ['$mulValues'],
		    });
		    new this.EArray({
		        name: '$mulValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$div',
		        displayName: '/',
		        category: 'Математические операторы',
		        desc: 'Деление чисел',
		        values: ['$divValues'],
		    });
		    new this.EArray({
		        name: '$divValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$divz',
		        displayName: '/',
		        category: 'Математические операторы',
		        desc: 'Деление чисел (ноль в знаменателе игнорируется)',
		        values: ['$divzValues'],
		    });
		    new this.EArray({
		        name: '$divzValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$mod',
		        displayName: '%',
		        category: 'Математические операторы',
		        desc: 'Деление по модулю (получение остатка от деления)',
		        values: ['$modValues'],
		    });
		    new this.EArray({
		        name: '$modValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });

		    // $greatest
		    new this.SingleObject({
		        name: '$greatest',
		        category: 'Функции',
		        desc: 'Выбор максимального значения из перечня заданных',
		        values: ['$greatestValues'],
		    });
		    new this.EArray({
		        name: '$greatestValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });

		    // $least
		    new this.SingleObject({
		        name: '$least',
		        category: 'Функции',
		        desc: 'Выбор минимального значения из перечня заданных',
		        values: ['$leastValues'],
		    });
		    new this.EArray({
		        name: '$leastValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });

		    new this.SingleObject({
		        name: '$splitString',
		        category: 'Функции',
		        desc: 'Разделить строку на несколько (получить массив строк)',
		        values: ['$splitStringExpr']
		    });
		    
		    new this.ComplexObject({
		        name: '$splitStringExpr',
		        values: {
		            '$field': '$valueDefinition',
		            '$separator': '$constString'
		        }
		    });


		    new this.SingleObject({
		        name: '$concat',
		        displayName: 'Склеить строки',
		        category: 'Функции',
		        desc: 'Упорядоченное соединение строк в одну',
		        values: ['$concatValues'],
		    });
            new this.SingleObject({
                name: '$concatArray',
                category: 'Функции',
                desc: 'Формирование массива из заданных значений',
                values: ['$concatValues'],
            });
		    new this.EArray({
		        name: '$concatValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$field', '$expression', '$query', '$const', '$param'],
		    });
		    
		    new this.SingleObject({
		        name: '$substring',
		        category: 'Функции',
		        desc: 'Извлечь подстроку',
		        values: ['$substringExpr']
		    });
		    
		    new this.ComplexObject({
		        name: '$substringExpr',
		        values: {
		            '$field': '$valueDefinition',
		            '$length': '$constNumber'
		        }
		    });


		    new this.SingleObject({
		        name: '$coalesce',
//		        displayName: 'Первое не пустое значение',
		        category: 'Условные выражения',
		        desc: 'Возвращает первое не NULL значение, перебирая заданные выражения по очереди',
		        values: ['$coalesceValues'],
		    });
		    new this.EArray({
		        name: '$coalesceValues',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });

		    new this.SingleObject({
		        name: '$if',
		        category: 'Условные выражения',
//		        displayName: 'Выражение "Если-то-иначе"',
		        desc: 'Условное выражение выбора значения по условию',
		        values: ['$ifExpr']
		    });
		    
		    new this.ComplexObject({
		        name: '$ifExpr',
		        values: {
		            '$cond': '$filter',
		            '$then': '$valueDefinition',
		            '$else': '$valueDefinition'
		        }
		    });
		
		
		    new this.SingleObject({
		        name: '$toInt',
		        category: 'Преобразование типов',
		        desc: 'Преобразование к целому числу',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toDouble',
		        category: 'Преобразование типов',
		        desc: 'Преобразование к числу с плавающей точкой',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toBoolean',
		        category: 'Преобразование типов',
		        desc: 'Преобразование к логическому типу (boolean)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toDate',
		        category: 'Преобразование типов',
		        desc: 'Преобразование строки или числа к дате',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toTimestamp',
		        category: 'Преобразование типов',
		        desc: 'Преобразование числа к timestamp',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toString',
		        category: 'Преобразование типов',
		        desc: 'Преобразование к строке',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateYear',
		        category: 'Функции',
		        desc: 'Извлечь номер года из даты (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateMonth',
		        category: 'Функции',
		        desc: 'Извлечь номер месяца из даты (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateMonthDay',
		        category: 'Функции',
		        desc: 'Извлечь день месяца (1-31) из даты (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateWeekDay',
		        category: 'Функции',
		        desc: 'Извлечь день недели (воскресенье 0 - суббота 6) из даты (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateYearDay',
		        category: 'Функции',
		        desc: 'Извлечь день в году (1-365/366) из даты (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateTotalSeconds',
		        category: 'Функции',
		        desc: 'Извлечь секунды из даты (date/timestamp; начиная отсчет с 1970-01-01)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.ComplexObject({
		        name: '$dateIntervalOrder',
		        category: 'Функции',
		        desc: 'Разбить дату (date/timestamp) на равные интервалы в секундах и вернуть порядковый номер',
		        values: {
		            '$field': '$valueDefinition',
		            '$seconds': '$constNumber'
		        }
		    });
		    new this.SingleObject({
		        name: '$timeHour',
		        category: 'Функции',
		        desc: 'Извлечь час в сутках (0-23) из даты/времени (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$timeMinute',
		        category: 'Функции',
		        desc: 'Извлечь митуны в часе (0-59) из даты/времени (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$timeSecond',
		        category: 'Функции',
		        desc: 'Извлечь секунды в в минуте (0-59) из даты/времени (date/timestamp)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$distinct',
		        desc: 'Пропустить повторения (уменьшает число элелемнтов в группе)',
		        values: ['$field', '$expression', '$query'],
		    });
		    new this.SingleObject({
		         name: '$trim',
		         category: 'Функции',
		         desc: 'Удалить пробельные символы в начале и в конце строки',
		         values: ['$field', '$const', '$expression', '$query', '$param'],
		    });

		    new this.SingleObject({
		        name: '$any',
		        category: 'Функции агрегации',
		        desc: 'Вернуть любое значение в группе',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$first',
		        category: 'Функции агрегации',
		        desc: 'Вернуть первое значение в группе (если не важен порядок, используйте $any)',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$last',
		        category: 'Функции агрегации',
		        desc: 'Вернуть последнее значение в группе (если не важен порядок, используйте $any)',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$sum',
		        category: 'Функции агрегации',
		        desc: 'Суммировать значения в группе',
		        aggregate: true,
		        values: ['$field', '$constOne', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$count',
		        category: 'Функции агрегации',
		        desc: 'Вычислить число элементов в группе',
		        aggregate: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$min',
		        category: 'Функции агрегации',
		        desc: 'Вернуть минимальное значение в группе',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$max',
		        category: 'Функции агрегации',
		        desc: 'Вернуть максимальное значение в группе',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$avg',
		        category: 'Функции агрегации',
		        desc: 'Вычислить среднее значение в группе (NULL в расчетах не участвует)',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$array',
		        category: 'Функции агрегации',
		        desc: 'Поместить все элементы группы в массив',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$flatArray',
		        category: 'Функции агрегации',
		        desc: 'Объединить все массивы в группы в один массив',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$expandArray',
		        category: 'Функции агрегации',
		        desc: 'Разложить элементы массива на множество элементов ($array/$flatArray наоборот)',
		        aggregate: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gsum',
		        category: 'Функции глобальной агрегации',
		        desc: 'Сумма всех элементов таблицы (сумма всех групп)',
		        aggregate: true,
		        global: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gcount',
		        category: 'Функции глобальной агрегации',
		        desc: 'Число всех элементов таблицы (сумма размеров всех групп)',
		        aggregate: true,
		        global: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gmin',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть минимальное значение в таблице (минимальное среди всех групп)',
		        aggregate: true,
		        global: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gmax',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть максимальное значение в таблице (максимальное среди всех групп)',
		        aggregate: true,
		        global: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gavg',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть среднее значение в таблице',
		        aggregate: true,
		        global: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$grmaxsum',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть значение с максимальной суммой элементов в группе (найти группу с максимальной суммой)',
		        aggregate: true,
		        global: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$grmaxcount',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть значение с числом элементов самой крупной группы (найти группу с максимальным числом элементов)',
		        aggregate: true,
		        global: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$grmaxavg',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть значение с максимальным средним в группе (найти группу с максимальным арифметическим средним)',
		        aggregate: true,
		        global: true,
		        values: ['$field', '$const', '$expression', '$query', '$param'],
		    });
		    new this.SingleObject({
		        name: '$grmax',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть максимальное значение группы (найти группу с максимальным значением агрегированного выражения)',
		        aggregate: true,
		        global: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$grmin',
		        category: 'Функции глобальной агрегации',
		        desc: 'Вернуть минимальное значение группы (найти группу с минимальным значением агрегированного выражения)',
		        aggregate: true,
		        global: true,
		        values: ['$constOne', '$const', '$expression', '$query', '$field', '$param'],
		    });
		
		
		    new this.EArray({
		        name: '$groupBy',
		        category: 'Выражения запроса',
		        displayName: 'Группировка',
		        desc: 'Группировка строк по значениям или выражениям',
		        minOperands: 0,
		        maxOperands: -1,
		        values: ['$field', '$expression'],
		    });
		
		    new this.ComplexObject({
		        name: '$filter',
		        category: 'Выражения запроса',
		        displayName: 'Фильтрация полей источника',
		        desc: 'Фильтрация строк таблицы источника по условию (по умолчанию, если не задан источник, условия накладываются на поля куба)',
		        customKey: '#fieldName',
		        values: {
		            '#fieldName': '$valueCondition',
		
		            '$or': '$or',
		            '$and': '$and',
		            '$not': '$filter',
		
		            '$eq': '$eqExpr',
		            '$ne': '$neExpr',
		            '$gt': '$gtExpr',
		            '$gte': '$gteExpr',
		            '$lt': '$ltExpr',
		            '$lte': '$lteExpr',
		            '$like': '$likeExpr',
		            '$ilike': '$ilikeExpr',
		            '$in': '$inExpr',
		            '$nin': '$ninExpr',
		        },
		        optional: ['#fieldName', '$and', '$or', '$not', '$eq', '$ne', '$gte', '$gt', '$lte', '$lt', '$ilike', '$like', '$in', '$nin']
		    });
		
		
		    new this.ComplexObject({
		        name: '$postFilter',
		        category: 'Выражения запроса',
		        displayName: 'Фильтрация результата',
		        desc: 'Фильтрация результатов запроса по условию (условия накладываются на выходные столбцы результата запроса)',
		        customKey: '#outputFieldName',
		        values: {
		            '#outputFieldName': '$valueCondition',
		
		            '$or': '$orPostFilter',
		            '$and': '$andPostFilter',
		            '$not': '$postFilter',
		
		            '$eq': '$eqExpr',
		            '$ne': '$neExpr',
		            '$gt': '$gtExpr',
		            '$gte': '$gteExpr',
		            '$lt': '$ltExpr',
		            '$lte': '$lteExpr',
		            '$like': '$likeExpr',
		            '$ilike': '$ilikeExpr',
		            '$in': '$inExpr',
		            '$nin': '$ninExpr',
		        },
		        optional: ['#outputFieldName', '$and', '$or', '$not', '$eq', '$ne', '$gte', '$gt', '$lte', '$lt', '$ilike', '$like', '$in', '$nin']
		    });


		    new this.ComplexObject({
		        name: '$cubeFilter',
		        category: 'Выражения запроса',
		        displayName: 'Глобальная фильтрация',
		        desc: 'Дополнительная фильтрация строк куба для всех подзапросов в данном и вложенных срезах',
		        customKey: '#fieldName',
		        values: {
		            '#fieldName': '$valueCondition',

		            '$or': '$orCubeFilter',
		            '$and': '$andCubeFilter',
		            '$not': '$cubeFilter',

		            '$eq': '$eqExpr',
		            '$ne': '$neExpr',
		            '$gt': '$gtExpr',
		            '$gte': '$gteExpr',
		            '$lt': '$ltExpr',
		            '$lte': '$lteExpr',
		            '$like': '$likeExpr',
		            '$ilike': '$ilikeExpr',
		            '$in': '$inExpr',
		            '$nin': '$ninExpr',
		        },
		        optional: ['#fieldName', '$and', '$or', '$not', '$eq', '$ne', '$gte', '$gt', '$lte', '$lt', '$ilike', '$like', '$in', '$nin']
		    });

		    // valueCondition
		    new this.Group({
		        name: '$valueCondition',
		        values: [ '$eq','$ne', '$gt', '$gte', '$lt', '$lte',
		            '$like', '$ilike', '$in', '$nin' ],
		    });
		
		    new this.EArray({
		        name: '$or',
		        category: 'Логические операторы',
		        displayName: 'или',
		        desc: 'Логическое ИЛИ',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$filter'],
		    });
		
		    new this.EArray({
		        name: '$and',
		        category: 'Логические операторы',
		        displayName: 'и',
		        desc: 'Логическое И',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$filter'],
		    });
		
		    new this.EArray({
		        name: '$orPostFilter',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$postFilter'],
		    });
		
		    new this.EArray({
		        name: '$andPostFilter',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$postFilter'],
		    });

		    new this.EArray({
		        name: '$orCubeFilter',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$cubeFilter'],
		    });

		    new this.EArray({
		        name: '$andCubeFilter',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$cubeFilter'],
		    });

		    new this.SingleObject({
		        name: '$eq',
		        category: 'Операторы сравнения',
		        displayName: '=',
		        desc: 'Если равно',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$ne',
		        category: 'Операторы сравнения',
		        displayName: '&ne;',
		        desc: 'Если не равно',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gt',
		        category: 'Операторы сравнения',
		        displayName: '&gt;',
		        desc: 'Если больше',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gte',
		        category: 'Операторы сравнения',
		        displayName: '&ge;',
		        desc: 'Если больше или равно',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$lt',
		        category: 'Операторы сравнения',
		        displayName: '&lt;',
		        desc: 'Если меньше',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$lte',
		        category: 'Операторы сравнения',
		        displayName: '&le;',
		        desc: 'Если меньше или равно',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$like',
		        category: 'Операторы сравнения',
		        displayName: '&asymp;',
		        desc: 'Поиск по выражению LIKE (используйте % для задания любой подстроки и ? любого символа)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$ilike',
		        category: 'Операторы сравнения',
		        displayName: '&sim;',
		        desc: 'Поиск по выражению LIKE без учета регистра (используйте % для задания любой подстроки и ? любого символа)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$in',
		        category: 'Операторы множеств',
		        displayName: '&isin;',
		        desc: 'Если содержится в массиве',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$nin',
		        category: 'Операторы множеств',
		        displayName: '&notin;',
		        desc: 'Если не содержится в массиве',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		
		    // expressionCondition
		    new this.EArray({
		        name: '$eqExpr',
		        desc: 'Если первое равно второму',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        desc: 'Если первое не равно второму',
		        name: '$neExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$gtExpr',
		        desc: 'Если первое больше второго',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$gteExpr',
		        desc: 'Если первое больше или равно второму',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$ltExpr',
		        desc: 'Если первое меньшевторому',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$lteExpr',
		        desc: 'Если первое меньше или равно второму',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$likeExpr',
		        desc: 'Если первое соответствует второму, условие по выражению LIKE (используйте % для задания любой подстроки и ? любого символа)',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$ilikeExpr',
		        desc: 'Если первое соответствует второму, условие по выражению LIKE без учета регистра (используйте % для задания любой подстроки и ? любого символа)',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$inExpr',
		        desc: 'Если первое содержится во втором (элемент содержится в массиве)',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.EArray({
		        name: '$ninExpr',
		        desc: 'Если первое не содержится во втором (элемент не содержится в массиве)',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		    new this.SingleObject({
		        name: '$not',
		        category: 'Логические операторы',
		        displayName: 'не',
		        desc: 'Инверсия (NOT)',
		        values: ['$const', '$expression', '$query', '$field', '$param'],
		    });
		
		    new this.EArray({
		        name: '$sort',
		        category: 'Выражения запроса',
		        displayName: 'Сортировка',
		        desc: 'Сортировка элементов (строк)',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$sortDefinition'],
		    });
		    
		    new this.Group({
		        name: '$sortDefinition',
		        values: ['$sortField', '$sortExpression']
		    });
		    
		    new this.SingleObject({
		        name: '$sortField',
		        customKey: '#anyFieldName',
		        minOperands: 1,
		        maxOperands: 1,
		        values: {
		            '#anyFieldName': '$sortType'
		        },
		    });
		    
		    new this.ComplexObject({
		        name: '$sortExpression',
		        category: 'Выражения',
		        desc: 'Сортировка по значению выражения',
		        values: {
		            '$expr': '$valueDefinition',
		            '$type': '$sortType',
		        },
		    });
		    
		    new this.Group({
		        name: '$sortType',
		        values: ['$sortTypeAsc', '$sortTypeDesc']
		    });
		    
		    new this.EConstNumber({
		        name: '$sortTypeAsc',
		    	displayName: 'По возрастанию',
		    	desc: 'Опция сортировки значения по возрастанию',
		        value: 1,
		    });
		    
		    new this.EConstNumber({
		        name: '$sortTypeDesc',
		    	displayName: 'По убыванию',
		    	desc: 'Опция сортировки значения по убыванию',
		        value: -1,
		    });

		    new this.EConstNumber({
		        name: '$constOne',
		    	displayName: '1',
		    	category: 'Функции агрегации',
		    	desc: 'Единичный операнд, используемый в функциях агрегации для обобщенного рассчета',
		        value: 1,
		    });

		    new this.EConstNumber({
		        name: '$limit',
		        category: 'Выражения запроса',
		        displayName: 'Ограничить число элементов',
		        desc: 'Ограничение количества элементов (строк) результата запроса',
		        value: 10,
		        editable: true
		    });
		
		    new this.Group({
		        name: '$finalize',
		        category: 'Выражения запроса',
		        displayName: 'Финальные преобразования',
		        desc: 'Финальные преобразования выходных элементов (строк)',
		        values: ['$finalizeFunction', '$finalizeFields']
		    });
		    
		    new this.ComplexObject({
		        name: '$finalizeFields',
		        customKey: '#field',
				values: {
				    '#field': '$finalizeExpression'
				}
		    });
		    
		    new this.ComplexObject({
		        name: '$finalizeExpression',
		        values: {
		            '$replace': '$finalizeReplace'
		//	            '$group': '$finalizeGroup'
		        },
		    });
		    
		    new this.ComplexObject({
		        name: '$finalizeReplace',
		        desc: 'Замена элементов по таблице соответствия ключ-значение (ключем может быть строка "value" или регулярное выражение "/R/i")',
		        customKey: '#value',
		        values: {
		            '#value': '$replaceWithValue'
		        },
		    });
		    
		    new this.Group({
		        name: '$replaceWithValue',
		        values: ['$constString', '$constNumber', '$constBoolean'],
		    });
		
		    new this.EConstBoolean({
		        name: '$distinctAll',
		        category: 'Выражения запроса',
		        displayName: 'Исключить повторы',
		        desc: 'Исключить повторяющиеся элементы (строки)',
		        value: true,
		    });
		
		
		    new this.Group({
		        name: '$field',
		        displayName: 'Поле',
		        desc: 'Поле',
		        values: ['$fieldName', '$fieldExpr'],
		    });
		    
		    new this.ComplexObject({
		        name: '$fieldExpr',
		        displayName: 'Поле',
		        desc: 'Поле',
		        values: {
		            '$field': '$fieldName',
		            '$context': '$contextName'
		        },
		        optional: ['$context']
		    });
		
		    new this.SingleObject({
		        name: '$const',
		        desc: 'Константа',
		        values: ['$constValue']
		    });
		    
		    new this.Group({
		        name: '$constValue',
		        values: ['$constNumber', '$constBoolean', '$constString', '$constNull'],
		    });
		    
		    new this.Group({
		    	name: '$constBoolean',
		    	values: ['$constBooleanTrue', '$constBooleanFalse'],
		    });
		
		    new this.EConstString({
		        name: '$fieldName'
		    });
		    
		    new this.EConstString({
		        name: '$contextName'
		    });

		    new this.EConstString({
		        name: '$viewName',
		        desc: 'Имя среза источника'
		    });

		    new this.EConstNumber({
		    	displayName: 'Число',
		    	desc: 'Константное число',
		        name: '$constNumber',
		        editable: true
		    });
		    
		    new this.EConstBoolean({
		        name: '$constBooleanTrue',
		        displayName: 'true',
		        desc: 'Булевская истина',
		        value: true
		    });

		    new this.EConstBoolean({
		        name: '$constBooleanFalse',
		        displayName: 'false',
		        desc: 'Булевская ложь',
		        value: false
		    });

		    new this.EConstString({
		    	displayName: 'Строка',
		    	desc: 'Константная строка',
		        name: '$constString',
		        editable: true
		    });
		    
		    new this.EConstNull({
		    	displayName: 'null',
		    	desc: 'Пустое значение',
		        name: '$constNull'
		    });
		
		
		    new this.EConstString({
		        name: '$param',
		        disabled:true
		    });
		    
		    new this.EConstString({
		        name: '$sqlQuery',
		    	displayName: 'Встроенный SQL запрос',
		        desc: 'Заменить текущий запрос SQL выражением/запросом',
		        editable: true
		    });

		    new this.EConstString({
		        name: '$sql',
		        desc: 'Подставить SQL выражение/запрос',
		        editable: true
		    });

		
		},
		
		macros: {},
		
		schemaAggregateOperators: {
		    $any: {},
		    $first: {},
		    $last: {},
		    $sum: {},
		    $count: {},
		    $min: {},
		    $max: {},
		    $avg: {},
		    $array: {},
		    $flatArray: {},
		    $gsum: {},
		    $gcount: {},
		    $gmin: {},
		    $gmax: {},
		    $gavg: {},
		    $grmaxsum: {},
		    $grmaxcount: {},
		    $grmaxavg: {},
		    $grmax: {},
		    $grmin: {},
		},
		
		
		registerMacros: function(def, structure, objectGenerator) {
		    var name = def.name;
		    this.macros[name] = {
		        name: name,
		        def: def,
		        structure: structure,
		        objectGenerator: objectGenerator
		    };
		
		    $this.getSchema().$macros.values.push(name);
		    var exprName = name + '_Expr';
		    new this.SingleObject({
		    	name: name,
		    	desc: def.desc,
		    	category: 'Макросы',
		    	values: [exprName]
		    });
		    new this.ComplexObject({
		        name: exprName,
		        values: (function(){
		            var values = {};
		            for (var f in structure) if (structure.hasOwnProperty(f)) {
		                if (!structure[f].name) {
		                    throw new Error('Field value descriptor name is not defined for macro ' + name);
		                }
		                values[f] = structure[f].name;
		            }
		            return values;
		        })(),
		        valueDesc: (function(){
		        	var valueDesc = {};
		            for (var f in structure) if (structure.hasOwnProperty(f)) {
		                if (!structure[f].desc) {
		                    continue;
		                }
		                valueDesc[f] = structure[f].desc;
		            }
		            return valueDesc;
		        })(),
		        optional: (function(){
		            var optional = [];
		            for (var f in structure) if (structure.hasOwnProperty(f)) {
		                if (structure[f].optional) {
		                    optional.push(f);
		                }
		            }
		            return optional;
		        })()
		    });
//		    JSB.getLogger().debug('Registered DataCube query macro ' + name);
		},
		
		unwrapMacros: function(dcQuery) {
		    function validateMacro(exp, macro){
		        var structure = macro.structure;
		        for (var f in structure) if(structure.hasOwnProperty(f)) {
		            if (typeof exp[f] === 'undefined') {
		                throw new Error('Field ' + f + ' is not defined in ' + macro.name);
		            }
		//                if (typeof exp[f] !== typeof structure[f]) {
		//                    throw new Error('Field ' + f + ' must has type ' + structure[f]);
		//                }
		        }
		    }
		
		    function unwrapExpression(exp, setFunc) {
		        if (JSB.isPlainObject(exp)) {
		            var key = Object.keys(exp)[0];
		            for (var name in $this.macros) {
		                if (name == key) {
		                    validateMacro(exp[key], $this.macros[name].structure);
		                    //dcQuery.$select[alias] = $this.macros[name].objectGenerator.call(null, exp[key], dcQuery);
		                    setFunc($this.macros[name].objectGenerator.call(null, exp[key], dcQuery));
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
		}
	}
}