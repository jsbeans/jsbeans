## Язык запросов к кубу

Запрос состоит из двух объектов:
* тело запроса - `$select | $filter | $groupBy | $sort`
* значения параметров запроса - `{ name: value }`

```
{
    $select: {
        "Код отрасли": {$toInt: "Код отрасли"},
        "Число показателей отрасли": {$sum:1},
        "Сумма показателей отрасли": {$sum: {$toDouble: "Значение"}},
        "Число отраслей": {$gcount: {$distinct: "Код отрасли"}},
        "Сумма показателей": {$gsum: {$toDouble: "Значение"}},
    },
    $groupBy: ["Код отрасли"]
}
```


## Функции преобразования значения

Применяются в секции $select.

`$toInt, $toDouble, $toString, $toBoolean, $distinct`

### Функции группировки

Применяются в секции $select.

`$sum: 1, $sum, $count: 1, $count, $min, $max, $avg, $array, $flatArray`

### Глобавльные функции группировки

Применяются в секции $select и формируют глобальное аггрегированное значение над всей выборкой. Значение будет одно и то же для всех объектов выходной выборки.

`$gcount: 1, $gcount, $gsum: 1, $gsum, $gmax, $gmin`

### Функции фильтрации

Применяются в секции $filter для фильтрации выборки по значениям полей. 

`$or, $and, $eq: null, $eq, $ne: null, $ne, $gt, $gte, $lt, $lte, $like, $ilike, $in, $nin`

```{
    $select: {...},
    $filter: {
        "Код отрасли": {$like: '${like}'},
        "Значение": {$ne: null}
    },
    {
        like: "*"
    }
}
```


### Синтаксис
````
query             := '{' select [filter] [groupBy] [sort] '}'

select            := '$select: {' [fieldSelection] '}' 
fieldSelection    := resultFieldAlias ':' fieldExpression [',' fieldSelection]
fieldExpression   := fieldName | valueFunction | aggregateFunction

aggregateFunction := '{' (
        '$sum' | '$count' |
        '$min' | '$max' | '$avg' | 
        '$array' | '$flatArray'
    ) ':' valueFunction '}' | '{$sum: 1}' | '{$count: 1}' 
    
valueFunction     := '{' (
        '$toInt' | '$toDouble' | 
        '$toString' | '$toBoolean' | 
        '$distinct') ':' fieldName | valueFunction '}'
        
filter            := '{' [filterSelection] '}'
filterSelection   := 
        '$or:[' filterSelection ']' | 
        '$and:[' filterSelection ']' | 
        fieldName ':' filterOperator [',' filterSelection]
filterOperator    := '{' (): filterValue '}' | '{$eq:null}' | '{$ne: null}'
filterValue :=

groupBy    := '[' fieldNames ']'
sort       := '[' fieldNames ']'
fieldNames := fieldName [',' fieldNames]
``