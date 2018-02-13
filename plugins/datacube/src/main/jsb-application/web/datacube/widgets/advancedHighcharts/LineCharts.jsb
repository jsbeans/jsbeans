{
	$name: 'DataCube.Widgets.LineCharts',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Линейная диаграмма',
        description: '',
        category: 'Диаграммы',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl9jb21ib19jaGFydF8yNjM5NzkxLnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGEyNSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZSAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczIzIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzIxIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjMxLjQ2NjY2NiINCiAgICAgaW5rc2NhcGU6Y3g9IjIuOTU1NjUwNCINCiAgICAgaW5rc2NhcGU6Y3k9IjYuOTUzMjgzMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSINCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSINCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjQuMDA0MjM3NCwtOC42NzU4NDc2Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNi4wMzgxMzU3LC05LjE1MjU0MjUiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTYyIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI4Ljk5MzY0NDIsLTkuNTY1Njc4MSINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxNjQiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEwLjk5NTc2MywtOS43ODgxMzU4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuMDE0ODMxLC05Ljc4ODEzNTgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTY4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNS45ODUxNywtOS40MDY3Nzk4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE3MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMC45ODUxNjk1MSwtOS4zNDMyMjA1Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE3MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTkuMDA0MjM4LC0xLjMzNDc0NTgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTc0IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI0LjAwNDIzNzQsMTEuOTgwOTMyIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE3NiIgLz48L3NvZGlwb2RpOm5hbWVkdmlldz48cGF0aA0KICAgICBkPSJtIDE4Ljk5MTM0MSwxOS45NDgzODkgLTMuMDIwMjk3LDAgMCwtMTEuNzc4MzYxMyBjIDAsLTAuNTAwMTI3MyAwLjMzODI3NCwtMC45MDYwMjc4IDAuNzU1MDc1LC0wLjkwNjAyNzggbCAxLjUxMDE0OSwwIGMgMC40MTY4LDAgMC43NTUwNzMsMC40MDU5MDA1IDAuNzU1MDczLDAuOTA2MDI3OCBsIDAsMTEuNzc4MzYxMyB6Ig0KICAgICBpZD0icGF0aDMiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiIC8+PHBhdGgNCiAgICAgZD0ibSAxNC4wMzE4NywxOS45NDgzODkgLTMuMDIwMjk3LDAgMCwtOC4xNTQyNSBjIDAsLTAuNTAwMTI3IDAuMzM4MjczLC0wLjkwNjAyOCAwLjc1NTA3MywtMC45MDYwMjggbCAxLjUxMDE1LDAgYyAwLjQxNjgwMSwwIDAuNzU1MDc0LDAuNDA1OTAxIDAuNzU1MDc0LDAuOTA2MDI4IGwgMCw4LjE1NDI1IHoiDQogICAgIGlkPSJwYXRoNSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBkPSJtIDkuMDA4ODM4OSwxOS45NDgzODkgLTIuOTU2NzM4MywwIDAsLTkuOTY2MzA1NyBjIDAsLTAuNTAwMTI3MyAwLjMzMTE1NDcsLTAuOTA2MDI3OCAwLjczOTE4NDYsLTAuOTA2MDI3OCBsIDEuNDc4MzY5MiwwIGMgMC40MDgwMjk4LDAgMC43MzkxODQ1LDAuNDA1OTAwNSAwLjczOTE4NDUsMC45MDYwMjc4IGwgMCw5Ljk2NjMwNTcgeiINCiAgICAgaWQ9InBhdGg3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwYXRoDQogICAgIGQ9Im0gNC4wMTc1ODc4LDE5Ljk0ODM4OSAtMy4wMjAyOTgwNywwIDAsLTYuMzQyMTk0IGMgMCwtMC41MDAxMjggMC4zMzgyNzMzNywtMC45MDYwMjggMC43NTUwNzQ2NywtMC45MDYwMjggbCAxLjUxMDE0OSwwIGMgMC40MTY4MDEsMCAwLjc1NTA3NDQsMC40MDU5IDAuNzU1MDc0NCwwLjkwNjAyOCBsIDAsNi4zNDIxOTQgeiINCiAgICAgaWQ9InBhdGg5Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwb2x5bGluZQ0KICAgICBwb2ludHM9IiAgNiwxMiAxMiw4IDE4LDExIDI0LDYgIg0KICAgICBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojOWE3OTM3O3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icG9seWxpbmUxOSINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjEwNDYyOSwwLDAsMC44NDAwOTUwNSwtMi44ODk2MTkxLC0yLjg1NjA4MDUpIiAvPjxjaXJjbGUNCiAgICAgY3g9IjE3LjQ5NzA4MiINCiAgICAgY3k9IjIuMzY4MDg4MiINCiAgICAgcj0iMS40OTQyNTkiDQogICAgIGlkPSJjaXJjbGUxMSINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48Y2lyY2xlDQogICAgIGN4PSIxMi41NTM1MDEiDQogICAgIGN5PSI2LjExOTYyNDYiDQogICAgIHI9IjEuNTEwMTQ4OSINCiAgICAgaWQ9ImNpcmNsZTEzIg0KICAgICBzdHlsZT0iZmlsbDojODAzMzAwIiAvPjxjaXJjbGUNCiAgICAgY3g9IjcuNTE0NTc5OCINCiAgICAgY3k9IjQuMjc1NDgzMSINCiAgICAgaWQ9ImNpcmNsZTE1Ig0KICAgICBzdHlsZT0iZmlsbDojODAzMzAwIg0KICAgICByPSIxLjQ2MjQ3OTQiIC8+PGNpcmNsZQ0KICAgICBjeD0iMi41MDc0MzkxIg0KICAgICBjeT0iNi44NjQ2MzQ1Ig0KICAgICByPSIxLjUxMDE0ODgiDQogICAgIGlkPSJjaXJjbGUxNyINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48L3N2Zz4=`,
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
            // Серия
            {
                name: 'Серии',
                type: 'group',
                key: 'series',
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
                        name: 'Имя серии или значения',
                        type: 'item',
                        key: 'name',
                        binding: 'field',
                        itemType: 'any'
                    },
                    {
                        name: 'Данные',
                        type: 'item',
                        key: 'data',
                        binding: 'field',
                        itemType: 'any'
                    },
                    {
                        name: 'Тип',
                        type: 'select',
                        key: 'type',
                        items: [
                        {
                            name: 'Area',
                            type: 'item',
                            key: 'area',
                            editor: 'none',
                            itemValue: 'area'
                        },
                        {
                            name: 'Line',
                            type: 'item',
                            key: 'line',
                            editor: 'none',
                            itemValue: 'line'
                        },
                        {
                            name: 'Column',
                            type: 'item',
                            key: 'column',
                            editor: 'none',
                            itemValue: 'column'
                        }
                        ]
                    },
                    {
                        name: 'Разрешить события',
                        type: 'item',
                        key: 'allowPointSelect',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Цвет',
                        type: 'item',
                        key: 'color',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor'
                    },
                    {
                        name: 'Стэк',
                        type: 'item',
                        key: 'stack',
                        itemType: 'string'
                    },
                    {
                        name: 'Шаговая диаграмма',
                        type: 'select',
                        key: 'step',
                        items: [
                        {
                            name: 'Нет',
                            type: 'item',
                            key: 'none',
                            editor: 'none',
                            itemValue: undefined
                        },
                        {
                            name: 'Левый',
                            type: 'item',
                            key: 'left',
                            editor: 'none',
                            itemValue: 'left'
                        },
                        {
                            name: 'Центр',
                            type: 'item',
                            key: 'center',
                            editor: 'none',
                            itemValue: 'center'
                        },
                        {
                            name: 'Правый',
                            type: 'item',
                            key: 'right',
                            editor: 'none',
                            itemValue: 'right'
                        }
                        ]
                    },
                    {
                        name: 'Подпись',
                        type: 'group',
                        key: 'tooltip',
                        collapsable: true,
                        items: [
                        {
                            name: 'Число знаков после запятой',
                            type: 'item',
                            key: 'valueDecimals',
                            itemType: 'number'
                        },
                        {
                            name: 'Префикс значения',
                            type: 'item',
                            key: 'valuePrefix',
                            itemType: 'string'
                        },
                        {
                            name: 'Суффикс значения',
                            type: 'item',
                            key: 'valueSuffix',
                            itemType: 'string'
                        }
                        ]
                    },
                    {
                        name: 'Показывать по-умолчанию',
                        type: 'item',
                        key: 'visible',
                        optional: 'checked',
                        editor: 'none'
                    }
                    ]
                }
                ]
            },
            // Ось Х
            {
                name: 'Ось Х',
                type: 'group',
                key: 'xAxis',
                collapsable: true,
                items: [
                    {
                        name: 'Категории',
                        type: 'item',
                        key: 'categories',
                        binding: 'field',
                        itemType: 'any'
                    },
                    {
                        name: 'Подписи',
                        type: 'group',
                        key: 'labels',
                        collapsable: true,
                        items: [
                        {
                            name: 'Активны',
                            type: 'item',
                            key: 'enabled',
                            optional: 'checked',
                            editor: 'none'
                        },
                        {
                            name: 'Поворот',
                            type: 'item',
                            key: 'rotation',
                            itemType: 'number',
                            defaultValue: 0
                        },
                        {
                            name: 'Шаг',
                            type: 'item',
                            key: 'step',
                            itemType: 'number'
                        },
                        {
                            name: 'Цвет шрифта',
                            type: 'item',
                            key: 'fontColor',
                            itemType: 'fontColor',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#666666'
                        },
                        {
                            name: 'Размер шрифта',
                            type: 'item',
                            key: 'fontSize',
                            itemType: 'string',
                            defaultValue: '11px'
                        }
                        ]
                    },
                    {
                        name: 'Заголовок оси',
                        type: 'group',
                        key: 'title',
                        collapsable: true,
                        items: [
                        {
                            name: 'Текст',
                            type: 'item',
                            key: 'text',
                            itemType: 'string'
                        },
                        {
                            name: 'Расположение',
                            type: 'select',
                            key: 'align',
                            items: [
                            {
                                name: 'Слева',
                                type: 'item',
                                key: 'low',
                                editor: 'none',
                                itemValue: 'low'
                            },
                            {
                                name: 'По центру',
                                type: 'item',
                                key: 'middle',
                                editor: 'none',
                                itemValue: 'middle'
                            },
                            {
                                name: 'Справа',
                                type: 'item',
                                key: 'high',
                                editor: 'none',
                                itemValue: 'high'
                            }
                            ]
                        },
                        {
                            name: 'Поворот',
                            type: 'item',
                            key: 'rotation',
                            itemType: 'number',
                            defaultValue: 0
                        },
                        {
                            name: 'Отступ',
                            type: 'item',
                            key: 'offset',
                            itemType: 'number'
                        },
                        {
                            name: 'Цвет',
                            type: 'item',
                            key: 'color',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#666666'
                        },
                        {
                            name: 'X',
                            type: 'item',
                            key: 'x',
                            itemType: 'number',
                            defaultValue: 0
                        },
                        {
                            name: 'Y',
                            type: 'item',
                            key: 'y',
                            itemType: 'number'
                        }
                        ]
                    },
                    {
                        name: 'Чередующийся цвет',
                        type: 'item',
                        key: 'alternateGridColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor'
                    },
                    {
                        name: 'Указатель',
                        type: 'item',
                        key: 'crosshair',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Цвет оси',
                        type: 'item',
                        key: 'lineColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: '#ccd6eb'
                    },
                    {
                        name: 'Толщина оси',
                        type: 'item',
                        key: 'lineWidth',
                        itemType: 'number',
                        defaultValue: 1
                    },
                    {
                        name: 'Отступ оси',
                        type: 'item',
                        key: 'offset',
                        itemType: 'number',
                        defaultValue: 0
                    },
                    {
                        name: 'Напротив',
                        type: 'item',
                        key: 'opposite',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Обратное направление',
                        type: 'item',
                        key: 'reversed',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Цвет отметок',
                        type: 'item',
                        key: 'tickColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: '#ccd6eb'
                    },
                    {
                        name: 'Интервал отметок',
                        type: 'item',
                        key: 'tickInterval',
                        itemType: 'number'
                    },
                    {
                        name: 'Тип',
                        type: 'select',
                        key: 'type',
                        items: [
                        {
                            name: 'Линейная',
                            type: 'item',
                            key: 'linear',
                            editor: 'none',
                            itemValue: 'linear'
                        },
                        {
                            name: 'Логарифмическая',
                            type: 'item',
                            key: 'logarithmic',
                            editor: 'none',
                            itemValue: 'logarithmic'
                        }
                        ]
                    }
                ]
            },
            // Ось Y
            {
                name: 'Ось Y',
                type: 'group',
                key: 'yAxis',
                collapsable: true,
                items: [
                    {
                        name: 'Подписи',
                        type: 'group',
                        key: 'labels',
                        collapsable: true,
                        items: [
                        {
                            name: 'Активны',
                            type: 'item',
                            key: 'enabled',
                            optional: 'checked',
                            editor: 'none'
                        },
                        {
                            name: 'Поворот',
                            type: 'item',
                            key: 'rotation',
                            itemType: 'number',
                            defaultValue: 0
                        },
                        {
                            name: 'Шаг',
                            type: 'item',
                            key: 'step',
                            itemType: 'number'
                        },
                        {
                            name: 'Цвет шрифта',
                            type: 'item',
                            key: 'fontColor',
                            itemType: 'fontColor',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#666666'
                        },
                        {
                            name: 'Размер шрифта',
                            type: 'item',
                            key: 'fontSize',
                            itemType: 'string',
                            defaultValue: '11px'
                        }
                        ]
                    },
                    {
                        name: 'Заголовок оси',
                        type: 'group',
                        key: 'title',
                        collapsable: true,
                        items: [
                        {
                            name: 'Текст',
                            type: 'item',
                            key: 'text',
                            itemType: 'string',
                            defaultValue: 'Значения'
                        },
                        {
                            name: 'Расположение',
                            type: 'select',
                            key: 'align',
                            items: [
                            {
                                name: 'Снизу',
                                type: 'item',
                                key: 'low',
                                editor: 'none',
                                itemValue: 'low'
                            },
                            {
                                name: 'По центру',
                                type: 'item',
                                key: 'middle',
                                editor: 'none',
                                itemValue: 'middle'
                            },
                            {
                                name: 'Сверху',
                                type: 'item',
                                key: 'high',
                                editor: 'none',
                                itemValue: 'high'
                            }
                            ]
                        },
                        {
                            name: 'Поворот',
                            type: 'item',
                            key: 'rotation',
                            itemType: 'number',
                            defaultValue: 270
                        },
                        {
                            name: 'Отступ',
                            type: 'item',
                            key: 'offset',
                            itemType: 'number'
                        },
                        {
                            name: 'Цвет',
                            type: 'item',
                            key: 'color',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#666666'
                        },
                        {
                            name: 'X',
                            type: 'item',
                            key: 'x',
                            itemType: 'number',
                            defaultValue: 0
                        },
                        {
                            name: 'Y',
                            type: 'item',
                            key: 'y',
                            itemType: 'number'
                        }
                        ]
                    },
                    {
                        name: 'Чередующийся цвет',
                        type: 'item',
                        key: 'alternateGridColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor'
                    },
                    {
                        name: 'Указатель',
                        type: 'item',
                        key: 'crosshair',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Цвет оси',
                        type: 'item',
                        key: 'lineColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: '#ccd6eb'
                    },
                    {
                        name: 'Толщина оси',
                        type: 'item',
                        key: 'lineWidth',
                        itemType: 'number',
                        defaultValue: 0
                    },
                    {
                        name: 'Отступ оси',
                        type: 'item',
                        key: 'offset',
                        itemType: 'number',
                        defaultValue: 0
                    },
                    {
                        name: 'Напротив',
                        type: 'item',
                        key: 'opposite',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Обратное направление',
                        type: 'item',
                        key: 'reversed',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Цвет отметок',
                        type: 'item',
                        key: 'tickColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: '#ccd6eb'
                    },
                    {
                        name: 'Интервал отметок',
                        type: 'item',
                        key: 'tickInterval',
                        itemType: 'number'
                    },
                    {
                        name: 'Тип',
                        type: 'select',
                        key: 'type',
                        items: [
                        {
                            name: 'Линейная',
                            type: 'item',
                            key: 'linear',
                            editor: 'none',
                            itemValue: 'linear'
                        },
                        {
                            name: 'Логарифмическая',
                            type: 'item',
                            key: 'logarithmic',
                            editor: 'none',
                            itemValue: 'logarithmic'
                        }
                        ]
                    },
                    {
                        name: 'Цвет линий сетки',
                        type: 'item',
                        key: 'gridLineColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: '#e6e6e6'
                    },
                    {
                        name: 'Тип линии сетки',
                        type: 'select',
                        key: 'gridLineDashStyle',
                        items: [
                        {
                            name: 'Solid',
                            type: 'item',
                            key: 'Solid',
                            editor: 'none',
                            itemValue: 'Solid'
                        },
                        {
                            name: 'ShortDash',
                            type: 'item',
                            key: 'ShortDash',
                            editor: 'none',
                            itemValue: 'ShortDash'
                        },
                        {
                            name: 'ShortDot',
                            type: 'item',
                            key: 'ShortDot',
                            editor: 'none',
                            itemValue: 'ShortDot'
                        },
                        {
                            name: 'ShortDashDot',
                            type: 'item',
                            key: 'ShortDashDot',
                            editor: 'none',
                            itemValue: 'ShortDashDot'
                        },
                        {
                            name: 'ShortDashDotDot',
                            type: 'item',
                            key: 'ShortDashDotDot',
                            editor: 'none',
                            itemValue: 'ShortDashDotDot'
                        },
                        {
                            name: 'Dot',
                            type: 'item',
                            key: 'Dot',
                            editor: 'none',
                            itemValue: 'Dot'
                        },
                        {
                            name: 'Dash',
                            type: 'item',
                            key: 'Dash',
                            editor: 'none',
                            itemValue: 'Dash'
                        },
                        {
                            name: 'LongDash',
                            type: 'item',
                            key: 'LongDash',
                            editor: 'none',
                            itemValue: 'LongDash'
                        },
                        {
                            name: 'DashDot',
                            type: 'item',
                            key: 'DashDot',
                            editor: 'none',
                            itemValue: 'DashDot'
                        },
                        {
                            name: 'LongDashDot',
                            type: 'item',
                            key: 'LongDashDot',
                            editor: 'none',
                            itemValue: 'LongDashDot'
                        },
                        {
                            name: 'LongDashDotDot',
                            type: 'item',
                            key: 'LongDashDotDot',
                            editor: 'none',
                            itemValue: 'LongDashDotDot'
                        }
                        ]
                    },
                    {
                        name: 'Толщина линии сетки',
                        type: 'item',
                        key: 'gridLineWidth',
                        itemType: 'number',
                        defaultValue: 1
                    }
                ]
            },
            // Заголовок
            {
                name: 'Заголовок',
                type: 'group',
                key: 'header',
                collapsable: true,
                collapsed: true,
                items: [
                {
                    name: 'Текст',
                    type: 'item',
                    key: 'text',
                    itemType: 'string',
                    defaultValue: ''
                },
                {
                    name: 'Горизонтальное выравнивание',
                    type: 'select',
                    key: 'align',
                    items: [
                    {
                        name: 'Левый край',
                        type: 'item',
                        key: 'left',
                        editor: 'none',
                        itemValue: 'left'
                    },
                    {
                        name: 'Центр',
                        type: 'item',
                        key: 'center',
                        editor: 'none',
                        itemValue: 'center'
                    },
                    {
                        name: 'Правый край',
                        type: 'item',
                        key: 'right',
                        editor: 'none',
                        itemValue: 'right'
                    }
                    ]
                },
                {
                    name: 'Вертикальное выравнивание',
                    type: 'select',
                    key: 'verticalAlign',
                    items: [
                    {
                        name: 'Нет',
                        type: 'item',
                        key: 'undefined',
                        editor: 'none',
                        itemValue: undefined
                    },
                    {
                        name: 'Верх',
                        type: 'item',
                        key: 'top',
                        editor: 'none',
                        itemValue: 'top'
                    },
                    {
                        name: 'Центр',
                        type: 'item',
                        key: 'middle',
                        editor: 'none',
                        itemValue: 'middle'
                    },
                    {
                        name: 'Низ',
                        type: 'item',
                        key: 'bottom',
                        editor: 'none',
                        itemValue: 'bottom'
                    }
                    ]
                },
                {
                    name: 'Обтекание',
                    type: 'item',
                    key: 'floating',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'Отступ',
                    type: 'item',
                    key: 'margin',
                    itemType: 'number',
                    defaultValue: 15
                },
                {
                    name: 'Цвет шрифта',
                    type: 'item',
                    key: 'fontColor',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#333333'
                },
                {
                    name: 'Размер шрифта',
                    type: 'item',
                    key: 'fontSize',
                    itemType: 'string',
                    defaultValue: '18px'
                },
                {
                    name: 'X',
                    type: 'item',
                    key: 'x',
                    itemType: 'number',
                    defaultValue: 0
                },
                {
                    name: 'Y',
                    type: 'item',
                    key: 'y',
                    itemType: 'number',
                    defaultValue: 10
                }
                ]
            },
            // Легенда
            {
                name: 'Легенда',
                type: 'group',
                key: 'legend',
                collapsable: true,
                collapsed: true,
                items: [
                {
                    name: 'Активна',
                    type: 'item',
                    key: 'enabled',
                    optional: 'checked',
                    editor: 'none'
                },
                {
                    name: 'Расположение',
                    type: 'select',
                    key: 'layout',
                    items: [
                    {
                        name: 'Горизонтальное',
                        type: 'item',
                        key: 'bottom',
                        editor: 'none',
                        itemValue: 'horizontal'
                    },
                    {
                        name: 'Вертикальное',
                        type: 'item',
                        key: 'middle',
                        editor: 'none',
                        itemValue: 'vertical'
                    }
                    ]
                },
                {
                    name: 'Горизонтальное выравнивание',
                    type: 'select',
                    key: 'align',
                    items: [
                    {
                        name: 'По левому краю',
                        type: 'item',
                        key: 'left',
                        editor: 'none',
                        itemValue: 'left'
                    },
                    {
                        name: 'По центру',
                        type: 'item',
                        key: 'center',
                        editor: 'none',
                        itemValue: 'center'
                    },
                    {
                        name: 'По правому краю',
                        type: 'item',
                        key: 'right',
                        editor: 'none',
                        itemValue: 'right'
                    }
                    ]
                },
                {
                    name: 'Вертикальное выравнивание',
                    type: 'select',
                    key: 'verticalAlign',
                    items: [
                    {
                        name: 'По нижнему краю',
                        type: 'item',
                        key: 'bottom',
                        editor: 'none',
                        itemValue: 'bottom'
                    },
                    {
                        name: 'По центру',
                        type: 'item',
                        key: 'middle',
                        editor: 'none',
                        itemValue: 'middle'
                    },
                    {
                        name: 'По верхнему краю',
                        type: 'item',
                        key: 'top',
                        editor: 'none',
                        itemValue: 'top'
                    }
                    ]
                },
                {
                    name: 'Цвет фона',
                    type: 'item',
                    key: 'backgroundColor',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Цвет границы',
                    type: 'item',
                    key: 'borderColor',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Радиус границы',
                    type: 'item',
                    key: 'borderRadius',
                    itemType: 'number',
                    defaultValue: 0
                },
                {
                    name: 'Толщина границы',
                    type: 'item',
                    key: 'borderWidth',
                    itemType: 'number',
                    defaultValue: 0
                },
                {
                    name: 'Обтекание',
                    type: 'item',
                    key: 'floating',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'Интервал между подписями',
                    type: 'item',
                    key: 'itemDistance',
                    itemType: 'number',
                    defaultValue: 20
                },
                {
                    name: 'Ширина подписей',
                    type: 'item',
                    key: 'itemWidth',
                    itemType: 'number'
                },
                {
                    name: 'Отступ сверху',
                    type: 'item',
                    key: 'itemMarginTop',
                    itemType: 'number',
                    defaultValue: 0
                },
                {
                    name: 'Отступ снизу',
                    type: 'item',
                    key: 'itemMarginBottom',
                    itemType: 'number',
                    defaultValue: 0
                },
                {
                    name: 'Стиль подписей',
                    type: 'group',
                    key: 'itemStyle',
                    collapsable: true,
                    items: [
                    {
                        name: 'Цвет',
                        type: 'item',
                        key: 'color',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: '#333333'
                    },
                    {
                        name: 'Размер шрифта',
                        type: 'item',
                        key: 'fontSize',
                        itemType: 'string',
                        defaultValue: '12px'
                    },
                    {
                        name: 'Полнота шрифта',
                        type: 'item',
                        key: 'fontWeight',
                        itemType: 'string',
                        defaultValue: 'bold'
                    }
                    ]
                },
                {
                    name: 'Формат подписей',
                    type: 'item',
                    key: 'labelFormat',
                    itemType: 'string',
                    defaultValue: '{name}'
                },
                {
                    name: 'Обратный порядок',
                    type: 'item',
                    key: 'reversed',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'Тень',
                    type: 'item',
                    key: 'shadow',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'Ширина',
                    type: 'item',
                    key: 'width',
                    itemType: 'number'
                },
                {
                    name: 'Расположение по оси Х',
                    type: 'item',
                    key: 'x',
                    itemType: 'number',
                    defaultValue: 0
                },
                {
                    name: 'Расположение по оси Y',
                    type: 'item',
                    key: 'y',
                    itemType: 'number',
                    defaultValue: 0
                }
                ]
            },
            // Tooltip
            {
                name: 'Всплывающая подсказка',
                type: 'group',
                key: 'mainTooltip',
                collapsable: true,
                collapsed: true,
                items: [
                {
                    name: 'Активна',
                    type: 'item',
                    key: 'enabled',
                    optional: 'checked',
                    editor: 'none'
                },
                {
                    name: 'Цвет фона',
                    type: 'item',
                    key: 'backgroundColor',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#f8f8f8'
                },
                {
                    name: 'Цвет границы',
                    type: 'item',
                    key: 'borderColor',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Радиус границы',
                    type: 'item',
                    key: 'borderRadius',
                    itemType: 'number',
                    defaultValue: 3
                },
                {
                    name: 'Толщина границы',
                    type: 'item',
                    key: 'borderWidth',
                    itemType: 'number',
                    defaultValue: 1
                },
                {
                    name: 'Использовать HTML',
                    type: 'item',
                    key: 'useHTML',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'Формат верхнего колонтитула',
                    type: 'item',
                    itemType: 'string',
                    itemValue: '',
                    key: 'headerFormat',
                    editor: 'JSB.Widgets.MultiEditor',
                    options: {
                        valueType: 'org.jsbeans.types.Html'
                    },
                    defaultValue: '<span style="font-size: 10px">{point.key}</span><br/>'
                },
                {
                    name: 'Формат точек',
                    type: 'item',
                    itemType: 'string',
                    itemValue: '',
                    key: 'pointFormat',
                    editor: 'JSB.Widgets.MultiEditor',
                    options: {
                        valueType: 'org.jsbeans.types.Html'
                    },
                    defaultValue: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
                },
                {
                    name: 'Формат нижнего колонтитула',
                    type: 'item',
                    itemType: 'string',
                    itemValue: '',
                    key: 'footerFormat',
                    editor: 'JSB.Widgets.MultiEditor',
                    options: {
                        valueType: 'org.jsbeans.types.Html'
                    }
                },
                {
                    name: 'Внутренний отступ',
                    type: 'item',
                    key: 'padding',
                    itemType: 'number',
                    defaultValue: 8
                },
                {
                    name: 'Тень',
                    type: 'item',
                    key: 'shadow',
                    optional: 'checked',
                    editor: 'none'
                },
                {
                    name: 'Количество символов после запятой',
                    type: 'item',
                    key: 'valueDecimals',
                    itemType: 'number'
                },
                {
                    name: 'Префикс значения',
                    type: 'item',
                    key: 'valuePrefix',
                    itemType: 'string'
                },
                {
                    name: 'Постфикс значения',
                    type: 'item',
                    key: 'valueSuffix',
                    itemType: 'string'
                }
                ]
            },
            // Опции точек (неполный список)
            {
                name: 'Опции точек',
                type: 'group',
                key: 'plotOptions',
                collapsable: true,
                collapsed: true,
                items: [
                {
                    name: 'Тип стека',
                    type: 'select',
                    key: 'stacking',
                    items: [
                        {
                            name: 'Нет',
                            type: 'item',
                            key: 'none',
                            editor: 'none',
                            itemValue: undefined
                        },
                        {
                            name: 'Нормальный',
                            type: 'item',
                            key: 'normal',
                            editor: 'none',
                            itemValue: 'normal'
                        },
                        {
                            name: 'Процентный',
                            type: 'item',
                            key: 'percent',
                            editor: 'none',
                            itemValue: 'percent'
                        }
                    ]
                }
                ]
            },
            // Авторство
            {
                name: 'Авторская подпись',
                type: 'group',
                key: 'credits',
                collapsable: true,
                collapsed: true,
                items: [
                {
                    name: 'Активна',
                    type: 'item',
                    key: 'enabled',
                    optional: true,
                    editor: 'none'
                },
                {
                    name: 'Текст',
                    type: 'item',
                    key: 'text',
                    itemType: 'string',
                    defaultValue: 'Highcharts.com'
                },
                {
                    name: 'Ссылка',
                    type: 'item',
                    key: 'href',
                    itemType: 'string',
                    defaultValue: 'http://www.highcharts.com'
                },
                {
                    name: 'Цвет шрифта',
                    type: 'item',
                    key: 'fontColor',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#999999'
                },
                {
                    name: 'Размер шрифта',
                    type: 'item',
                    key: 'fontSize',
                    itemType: 'string',
                    defaultValue: '9px'
                },
                {
                    name: 'Горизонтальное выравнивание',
                    type: 'select',
                    key: 'align',
                    items: [
                    {
                        name: 'Левый край',
                        type: 'item',
                        key: 'left',
                        editor: 'none',
                        itemValue: 'left'
                    },
                    {
                        name: 'Центр',
                        type: 'item',
                        key: 'center',
                        editor: 'none',
                        itemValue: 'center'
                    },
                    {
                        name: 'Правый край',
                        type: 'item',
                        key: 'right',
                        editor: 'none',
                        itemValue: 'right'
                    }
                    ]
                },
                {
                    name: 'Вертикальное выравнивание',
                    type: 'select',
                    key: 'verticalAlign',
                    items: [
                    {
                        name: 'Верх',
                        type: 'item',
                        key: 'top',
                        editor: 'none',
                        itemValue: 'top'
                    },
                    {
                        name: 'Центр',
                        type: 'item',
                        key: 'middle',
                        editor: 'none',
                        itemValue: 'middle'
                    },
                    {
                        name: 'Низ',
                        type: 'item',
                        key: 'bottom',
                        editor: 'none',
                        itemValue: 'bottom'
                    }
                    ]
                },
                {
                    name: 'X',
                    type: 'item',
                    key: 'x',
                    itemType: 'number',
                    defaultValue: -10
                },
                {
                    name: 'Y',
                    type: 'item',
                    key: 'y',
                    itemType: 'number',
                    defaultValue: -5
                }
                ]
            }
            ]
        }
        ]
    },

    $client: {
        $require: ['JQuery.UI.Loader', 'JSB.Tpl.Highstock'],
        $constructor: function(opts){
            $base(opts);
            $this.addClass('highchartsWidget');
            $this.container = $this.$('<div class="container"></div>');
            $this.append($this.container);

            $this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.chart){
                        return;
                    }
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height());
                }, 500, 'hcResize' + $this.getId());
            });

            $this.setInitialized();
        },

        // inner variables
        _curFilters: {},
        _deselectCategoriesCount: 0,
        _curFilterHash: null,

        // events
        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

        // refresh after data changes
        refresh: function(opts){
return;
            // if filter source is current widget
            if(opts && this == opts.initiator){
                return;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                var cache = this.getCache();
                if(cache){
                    this._buildChart(cache.seriesData, cache.xAxisCategories);
                    return;
                }
            }

            var dataSource = this.getContext().find('dataSource');
            if(!dataSource.bound()){
                return;
            }

            $base();

            // filters section
            var globalFilters = dataSource.getFilters();
            if(globalFilters){
                var binding = this.getContext().find("xAxis").get(0).value().binding()[0],
                    newFilters = {};

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding && cur.op === '$eq'){
                        if(!this._curFilters[cur.value]){
                            this._curFilters[cur.value] = cur.id;
                            this._selectAllCategory(cur.value);
                        }

                        newFilters[cur.value] = true;

                        delete globalFilters[i];
                    }
                }

                for(var i in this._curFilters){
                    if(!newFilters[i]){
                        this._deselectAllCategory(i);
                        delete this._curFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length > 0 && this.createFilterHash(globalFilters) === this._curFilterHash || Object.keys(globalFilters).length === 0 && !this._curFilterHash){ // update data not require
                    return;
                } else {
                    this._curFilterHash = Object.keys(globalFilters).length > 0 ? this.createFilterHash(globalFilters) : undefined;
                    dataSource.setFilters(globalFilters);
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    for(var i in this._curFilters){
                        this._deselectAllCategory(i);
                    }
                    this._curFilters = {};
                    return;
                }
                this._curFilterHash = null;
            }

            var seriesContext = this.getContext().find('series').values(),
                xAxisCategories = this.getContext().find('xAxis').find('categories'),
                useCompositeSeries = false;

            for(var i = 0; i < seriesContext.length; i++){
                if(seriesContext[i].find('name').bound()){
                    useCompositeSeries = true;
                    break;
                }
            }

            this.getElement().loader();
            dataSource.fetch({readAll: true, reset: true}, function(){
                try{
                    var seriesData = [],
                        xAxisData = [];

                    while(dataSource.next()){
                        // xAxis
                        xAxisData.push(xAxisCategories.value());

                        // series data
                        for(var i = 0; i < seriesContext.length; i++){
                            var name = seriesContext[i].find('name'),
                                data = seriesContext[i].find('data'),
                                x = xAxisCategories.value();

                                if(!seriesData[i]){
                                    seriesData[i] = {
                                        data: {}
                                    };
                                }

                                if(!seriesData[i].data[name.value()]){
                                    seriesData[i].data[name.value()] = [];
                                }

                                seriesData[i].data[name.value()].push({
                                    x: x ? x : undefined,
                                    y: data.value()
                                });
                        }
                    }

                    // resolve xAxis for composite series
                    if(useCompositeSeries){
                        var cats = {};
                        for(var i = 0; i < xAxisData.length; i++){
                            cats[xAxisData[i]] = true;
                        }
                        xAxisData = [];
                        for(var i in cats){
                            xAxisData.push(i);
                        }
                    }

                    function resolveData(data){
                        for(var i in data){
                            if(data[i].x){
                                data[i].x = xAxisData.indexOf(data[i].x.toString());
                            }
                        }
                        return data;
                    }

                    // resolve data
                    var data = [];
                    for(var i = 0; i < seriesData.length; i++){
                        var obj = seriesData[i].data;

                        for(var j in obj){
                            data.push({
                                index: i,
                                name: j,
                                data: resolveData(obj[j])
                            });
                        }
                    }

                    if(opts && opts.isCacheMod){
                        $this.storeCache({
                            seriesData: data,
                            xAxisCategories: xAxisData
                        });
                    }

                    $this._buildChart(data, xAxisData);

                    for(var i in $this._curFilters){
                        this._selectAllCategory(i);
                    }
                } catch(ex){
                    console.log('Load data exception!');
                    console.log(ex);
                } finally {
                    $this.getElement().loader('hide');
                }
            });
        },

        // refresh after data and/or style changes
        _buildChart: function(data, xAxisCategories){
            JSB.defer(function(){
                $this.ensureInitialized(function(){
                    $this.innerBuildChart(data, xAxisCategories);
                });
            }, 300, '_buildChart_' + this.getId());
        },

        innerBuildChart: function(seriesData, xAxisCategories){
            try{
                var creditsContext = this.getContext().find('credits').value(),
                    legendContext = this.getContext().find('legend').value(),
                    plotOptionsContext = this.getContext().find('plotOptions').value(),
                    seriesContext = this.getContext().find('series').values(),
                    titleContext = this.getContext().find('header').value(),
                    tooltipContext = this.getContext().find('mainTooltip').value(),
                    xAxisContext = this.getContext().find('xAxis').value(),
                    yAxisContext = this.getContext().find('yAxis').value(),
                    series = [];

                // series
                for(var j = 0; j < seriesData.length; j++){
                    series[j] = {
                        name: seriesData[j].name,
                        data: seriesData[j].data,
                        type: seriesContext[seriesData[j].index].find('type').value().value(),
                        allowPointSelect: seriesContext[seriesData[j].index].find('allowPointSelect').used(),
                        color: seriesContext[seriesData[j].index].find('color').value(),
                        stack: seriesContext[seriesData[j].index].find('stack').value(),
                        step: seriesContext[seriesData[j].index].find('step').value().value(),
                        tooltip: {
                            valueDecimals: seriesContext[seriesData[j].index].find('valueDecimals').value(),
                            valuePrefix: seriesContext[seriesData[j].index].find('valuePrefix').value(),
                            valueSuffix: seriesContext[seriesData[j].index].find('valueSuffix').value()
                        },
                        // yAxis: $this.isNull(seriesContext[seriesData[j].index].get(4).value(), true),
                        //dashStyle: seriesContext[seriesData[j].index].get(5).value().name(),
                        visible: seriesContext[seriesData[j].index].find('visible').used()
                    }
                }

                var chartOpts = {
                    credits: {
                        enabled: creditsContext.find('enabled').used(),
                        text: creditsContext.find('text').value(),
                        href: creditsContext.find('href').value(),
                        style: {
                           color: creditsContext.find('fontColor').value(),
                           fontSize: creditsContext.find('fontSize').value()
                        },
                        position: {
                            align: creditsContext.find('align').value().value(),
                            verticalAlign: creditsContext.find('verticalAlign').value().value(),
                            x: creditsContext.find('x').value(),
                            y: creditsContext.find('y').value()
                        }
                    },
                    legend: {
                        enabled: legendContext.find('enabled').used(),
                        layout: legendContext.find('layout').value().value(),
                        align: legendContext.find('align').value().value(),
                        verticalAlign: legendContext.find('verticalAlign').value().value(),
                        backgroundColor: legendContext.find('backgroundColor').value(),
                        borderColor: legendContext.find('borderColor').value(),
                        borderRadius: legendContext.find('borderRadius').value(),
                        borderWidth: legendContext.find('borderWidth').value(),
                        floating: legendContext.find('floating').used(),
                        itemDistance: legendContext.find('itemDistance').value(),
                        itemWidth: legendContext.find('itemWidth').value(),
                        itemMarginTop: legendContext.find('itemMarginTop').value(),
                        itemMarginBottom: legendContext.find('itemMarginBottom').value(),
                        itemStyle: {
                            color: legendContext.find('itemStyle').find('color').value(),
                            fontSize: legendContext.find('itemStyle').find('fontSize').value(),
                            fontWeight: legendContext.find('itemStyle').find('fontWeight').value()
                        },
                        labelFormat: legendContext.find('labelFormat').value(),
                        reversed: legendContext.find('reversed').used(),
                        shadow: legendContext.find('shadow').used(),
                        width: legendContext.find('width').value(),
                        x: legendContext.find('x').value(),
                        y: legendContext.find('y').value()
                    },
                    plotOptions: {
                        series: {
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
                                            evt.preventDefault();
                                            $this._clickEvt = null;
                                            $this._addNewFilter(evt);
                                        }
                                    },
                                    unselect: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onUnselect)){
                                            flag = $this.options.onUnselect.call(this, evt);
                                        }

                                        if(!flag && $this._deselectCategoriesCount === 0){
                                            if(Object.keys($this._curFilters).length > 0){
                                                evt.preventDefault();

                                                if(evt.accumulate){
                                                    $this.removeFilter($this._curFilters[evt.target.category]);
                                                    $this._deselectAllCategory(evt.target.category);
                                                    delete $this._curFilters[evt.target.category];
                                                    $this.refreshAll();
                                                } else {
                                                    for(var i in $this._curFilters){
                                                        $this.removeFilter($this._curFilters[i]);
                                                        $this._deselectAllCategory(i);
                                                    }
                                                    $this._curFilters = {};
                                                    $this.refreshAll();
                                                }
                                            }
                                        } else {
                                            $this._deselectCategoriesCount--;
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
                            },
                            stacking: plotOptionsContext.find('stacking').value().value(),
                            turboThreshold: 0
                        }
                    },
                    series: series,
                    title: {
                        text: titleContext.find('text').value(),
                        align: titleContext.find('align').value().value(),
                        verticalAlign: titleContext.find('verticalAlign').value().value(),
                        floating: titleContext.find('floating').used(),
                        margin: titleContext.find('margin').value(),
                        color: titleContext.find('fontColor').value(),
                        fontSize: titleContext.find('fontSize').value(),
                        x: titleContext.find('x').value(),
                        y: titleContext.find('y').value()
                    },
                    tooltip: {
                        enabled: tooltipContext.find('enabled').used(),
                        backgroundColor: tooltipContext.find('backgroundColor').value(),
                        borderColor: tooltipContext.find('borderColor').value(),
                        borderRadius: tooltipContext.find('borderRadius').value(),
                        borderWidth: tooltipContext.find('borderWidth').value(),
                        useHTML: tooltipContext.find('useHTML').used(),
                        headerFormat: tooltipContext.find('headerFormat').value(),
                        pointFormat: tooltipContext.find('pointFormat').value(),
                        footerFormat: tooltipContext.find('footerFormat').value(),
                        padding: tooltipContext.find('padding').value(),
                        shadow: tooltipContext.find('shadow').used(),
                        valueDecimals: tooltipContext.find('valueDecimals').value(),
                        valuePrefix: tooltipContext.find('valuePrefix').value(),
                        valueSuffix: tooltipContext.find('valueSuffix').value()
                    },
                    xAxis: {
                        categories: xAxisCategories,
                        labels: {
                            enabled: xAxisContext.find('labels').find('enabled').used(),
                            rotation: xAxisContext.find('labels').find('rotation').value(),
                            step: xAxisContext.find('labels').find('step').value(),
                            color: xAxisContext.find('labels').find('fontColor').value(),
                            fontSize: xAxisContext.find('labels').find('fontSize').value()
                        },
                        title: {
                            text: xAxisContext.find('title').find('text').value(),
                            align: xAxisContext.find('title').find('align').value().value(),
                            rotation: xAxisContext.find('title').find('rotation').value(),
                            offset: xAxisContext.find('title').find('offset').value(),
                            style: {
                                color: xAxisContext.find('title').find('color').value(),
                            },
                            x: xAxisContext.find('title').find('x').value(),
                            y: xAxisContext.find('title').find('y').value()
                        },
                        alternateGridColor: xAxisContext.find('alternateGridColor').value(),
                        crosshair: xAxisContext.find('crosshair').used(),
                        lineColor: xAxisContext.find('lineColor').value(),
                        offset: xAxisContext.find('offset').value(),
                        opposite: xAxisContext.find('opposite').used(),
                        reversed: xAxisContext.find('reversed').used(),
                        tickColor: xAxisContext.find('tickColor').value(),
                        tickInterval: xAxisContext.find('tickInterval').value(),
                        type: xAxisContext.find('type').value().value()
                    },
                    yAxis: {
                        labels: {
                            enabled: yAxisContext.find('labels').find('enabled').used(),
                            rotation: yAxisContext.find('labels').find('rotation').value(),
                            step: yAxisContext.find('labels').find('step').value(),
                            color: yAxisContext.find('labels').find('fontColor').value(),
                            fontSize: yAxisContext.find('labels').find('fontSize').value()
                        },
                        title: {
                            text: yAxisContext.find('title').find('text').value(),
                            align: yAxisContext.find('title').find('align').value().value(),
                            rotation: yAxisContext.find('title').find('rotation').value(),
                            offset: yAxisContext.find('title').find('offset').value(),
                            style: {
                                color: yAxisContext.find('title').find('color').value(),
                            },
                            x: yAxisContext.find('title').find('x').value(),
                            y: yAxisContext.find('title').find('y').value()
                        },
                        alternateGridColor: yAxisContext.find('alternateGridColor').value(),
                        crosshair: yAxisContext.find('crosshair').used(),
                        lineColor: yAxisContext.find('lineColor').value(),
                        offset: yAxisContext.find('offset').value(),
                        opposite: yAxisContext.find('opposite').used(),
                        reversed: yAxisContext.find('reversed').used(),
                        tickColor: yAxisContext.find('tickColor').value(),
                        tickInterval: yAxisContext.find('tickInterval').value(),
                        type: yAxisContext.find('type').value().value(),
                        gridLineColor: yAxisContext.find('gridLineColor').value(),
                        gridLineDashStyle: yAxisContext.find('gridLineDashStyle').value().value(),
                        gridLineWidth: yAxisContext.find('gridLineWidth').value()
                    }
                }

                if(this.chart){
                    this.chart.update(chartOpts);
                } else {
                    this.chart = Highcharts.chart(this.container.get(0), chartOpts);
                }
            } catch(ex){
                console.log('Build chart exception!');
                console.log(ex);
            }
        },

        _addNewFilter: function(evt){
            var context = this.getContext().find('dataSource').binding();
            if(!context.source) return;

            var field = this.getContext().find("xAxis").get(0).value().binding()[0];
            if(!field[0]) return;
            var fDesc = {
                sourceId: context.source,
                type: '$or',
                op: '$eq',
                field: field,
                value: evt.target.category.name
            };

            if(!evt.accumulate && Object.keys(this._curFilters).length > 0){
                for(var i in this._curFilters){
                    this._deselectAllCategory(i);
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};
            }

            if(!this.hasFilter(fDesc)){
                this._selectAllCategory(evt.target.category);
                this._curFilters[evt.target.category] = this.addFilter(fDesc);
                this.refreshAll();
            }
        },

        _selectAllCategory: function(cat){
            var series = this.chart.series;

            for(var i = 0; i < series.length; i++){
                for(var j = 0; j < series[i].points.length; j++){
                    if(series[i].points[j].category == cat && !series[i].points[j].selected){
                        series[i].points[j].select(true, true);
                        break;
                    }
                }
            }
        },

        _deselectAllCategory: function(cat){
            var series = this.chart.series;

            for(var i = 0; i < series.length; i++){
                for(var j = 0; j < series[i].points.length; j++){
                    if(series[i].points[j].category == cat && series[i].points[j].selected){
                        this._deselectCategoriesCount++;
                        series[i].points[j].select(false, true);
                        break;
                    }
                }
            }
        }
    }
}