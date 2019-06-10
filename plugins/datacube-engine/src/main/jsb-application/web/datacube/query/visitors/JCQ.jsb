/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.JCQ',
	$sync: {
		updateCheckInterval: 0
	},

	$server: {
	    scheme: {},

		$constructor: function(cube){
            $this.cube = cube;
		},

		reloadScheme: function(){

		    /**
		    Запрос описывается JSON выражением. Главный элемент соответствует дескриптору схемы #query - него начинается парсинг запросе.


		    Запрос представляет дерево узлов, где каждый узел в схеме представлен дескриптором.
		    Схема состоит из набора дескрипторов, идентифицируемых по name (начинается с '#') и имеющих тип type.
		    Дескрипторы содержат ссылки на другие дескрипторы - либо сам дескриптор, либо ссылку с name.

		    type=object
		        - обисывает элемент запроса, являющийся объектом;
		        - имеет scheme, который описывает структуру элементв (текущего дочернего JSON объекта);
		        - имеет identity, который содержит имя свойства в scheme, которое позволяет привязать дескриптор схемы у узлу запроса;

            type=array
                - описывает структуру массива;
		        - имеет maxLength/minLength;
		        - может работать в двух режимах:
		            -- value - задает единственный тип для всех элементов массива;
		            -- arguments - задает свои типы для каждого элемента массима (по сути реализует концепт неименованных аргументов ф-и);

            type=group
                - по сути представляет виртуальный дескриптор, представляющий любой из связанных;
                - имеет values, который содержит набор дескрипторов за место группы;

            type=string/number/boolean/integer...
                - задает значение константы (JSON тип);
                - если fixed=true, то значения заданы в values;
                - если values ф-я, то она возвращает массив возможных значений;


		    */

		    $this.reload({
                name: '#query',
                title: 'Запрос',
		        type: 'object',

		        identity: '$select',
		        scheme: {
		            $context: {
		                name: '#context',
                        title: 'Имя запроса',
                        type : 'string',
                    },

                    $from: '#source',

                    $select: {
                        title: 'Выходные поля',
                        type: 'key-value',
                        key: '#outputFieldName',
                        value: '#valueExpression',
                    },

                    $distinct: {
                        name: '#queryDistinct',
                        type: 'boolean',
                        isOptional: true,
                        defaultValue: false,
                    }
		        }
		    });

		    $this.reload({
                type: 'group',
                name: '#source',
                title: 'Источник',
                isOptional: true,
                values: [
                    '#cube',
                    '#slice',
                    '#provider',
                    '#viewName',
                    '#query',
                    '#join',
                    '#union',
                    '#recursive',
                    {
                        name: '#emptyQuery',
                        title: 'Ничего',
                        type: 'object',
                        scheme: {}
                    },
                ],
            });

            $this.reload({
                name: '#union',
                title: 'Объединение',
                type: 'array',
                minLength:1,
                maxLength:-1,
                value: '#subQuery', // or arguments: ['#op1', '#op2']
            });

            $this.reload({
                name: '#join',
                title: 'Пересечение',
                type: 'object',
                scheme: {
                    $joinType: {
                        name: '#joinType',
                        type: 'string',
                        fixed: true,
                        defaultValue: 'inner',
                        values: [ 'inner', 'left', 'right', 'full' ],
                    },
                    $left: {
                        type: 'group',
                        name: '#left',
                        title: 'Запрос слева',
                        values: [ '#subQuery' ]
                    },
                    $right: {
                       type: 'group',
                       name: '#right',
                       title: 'Запрос справа',
                       values: [ '#subQuery' ]
                   },
                }
            });

            $this.reload({
                type: 'group',
                name: '#subQuery',
                title: 'Подзапрос',
                values: [
                    '#query',
                    '#viewName',
                    '#slice',
                ]
            });

            $this.reload({
                name: '#cube',
                type: 'string',
                fixed: true,
                defaultValue: function (){
                    return $this.cube.getWorkspace().getId() + '/' + $this.cube.getId();
                },
                values: function(){
                    //return $this.cube.getWorkspace().getId() + '/' + $this.cube.getId();
                    // TODO list cubes
                    return [$this.cube.getWorkspace().getId() + '/' + $this.cube.getId()];
                }
            });
		},

		reload: function(desc) {
		    if (JSB.isString(desc)) {
		        if (!$this.scheme[desc]) throw new JSB.Error('Unknown query scheme node: ' + desc);
		        return;
		    }
		    if (!JSB.isObject(desc)) throw new JSB.Error('Unexpected query scheme node type: ' + typeof desc);

		    $this.scheme[desc] = desc = JSB.clone(desc);

		    switch(desc.type) {
		        case 'object':
		            if (!desc.identity) desc.identity = desc.scheme[Object.keys(desc.scheme)[0]];
		            for(var p in desc.scheme) {
		                if(desc.scheme[p].type || JSB.isString(desc.scheme[p])) {
		                    reload(desc.scheme[p]);
		                    if (!JSB.isString(desc.scheme[p])) {
		                        desc.scheme[p] = desc.scheme[p].name;
		                    }
		                }
		            }
		            break;
		        case 'group':
		            for(var i=0, l=desc.values.length; i < l; i++) {
		                reload(desc.values[i]);
                        if (!JSB.isString(desc.values[i])) {
                            desc.values[i] = desc.values[i].name;
                        }
		            }
		            break;
		        case 'array':
		            if (desc.arguments) {
                        for(var i=0, l=desc.arguments.length; i < l; i++) {
                            reload(desc.arguments[i]);
                            if (!JSB.isString(desc.arguments[i])) {
                                desc.arguments[i] = desc.arguments[i].name;
                            }
                        }
                    }
                    if (desc.value) {
                        reload(desc.value);
                        if (!JSB.isString(desc.value)) {
                            desc.value = desc.value.name;
                        }
                    }
		            break;
		    }
		},
	}
}