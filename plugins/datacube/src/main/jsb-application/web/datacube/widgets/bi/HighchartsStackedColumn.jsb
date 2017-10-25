{
	$name: 'DataCube.Widgets.HighchartsStackedColumn',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Столбики с накоплением',
		description: '',
		category: 'BI',
		thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAIAAABjvUUjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADQtJREFUeNrsXF1sXEcVnr/7t3vt3fV/WscipKmJUqjSQiuQaKuKQilCPLQPFFArgVTUN0ACJKS+o0p9KKp4qARVEfBQoaIWKUCRiqqiKk2aOEqbxMShdogTN7GTeu39ubv3zgxn7t1d7969d/eu63XdkInlbHb3zJz5Zuac850zN1hKiW60ZI3tNIWEEIcPH9Y0LZvN7tu3ryfZ+fn5y5cvc87vvvtuxrZ+amSngUUIAbzgt+tWe155xrjfoId+6IZvHMNP3jF891Ll5FJVo1gtoP9OsIaekJMZds9eK06w7Mq/zxYrHsK+WENW+n/dv88aten1BtbFvPf2ecdkOPR+lcvShN4BLPjCicVKoSpJq6jCS6IvTJmj9rbsrAt+K5VKBw8eHB4e7u8OJ9hg6idsJjAKtlusHUFIB0GBIsEieLsMPCh66eLF8+fPl8ulGwartrNCvgM8UfBi8uabH3nkYe55VNNqy+W3rfcyGHXuVkoR+TlGXQVlnGzvSmKmOquDBUrD4X/1vULF800AVn+gCVkOxvvGfmvMJkIm7R11m0zQaMfT4h8oUDKiH5ATogtYSG5NIEEpZQqw5vgNi3MrbsmNtpcPTKcJZf2IzQJk46wSIZSQuDmIzlEbJmyrNI7oBgyqHvOT3Fyur6+/+OKL4B+2HLuPM2Duly1kdHx8fHOcAw5WsVSqx0z/B0GpZaUefPDBTQhKTNnawl1j5Ixrex6/bsG6sOq9NlsEK4HD3BjZJvnWben2MKq9eZxPmNUDuydm35fX884qVMTpD6q0zbRxjobS4EPTSToBy7jIp353fM0cHNhphmsrbRY4UAimIzwDw52j8JCz13TdyIxBtLCdQFQqlZdeemlpaemTlM8KAENyu60VxN5Oucy590kDazvXpZ7fsNLpxx5/PAgnfWaA2o1AZ7CwB84Jic3YDkxcLhmW22p3MOaSIMFpMuuyuOq98m6xEe4CXZE+cuCR0gb+9sEBU8PJwAKW41asq+962X3SzPV0LiBoLi0vDONVPn674/LtAgq7VQddPJqd/Mw6HU+isOPKhWsugBX2SAJlzAhWp7ih53l1coCazizmbuX+6YH3aeb0sgDGAHuEC/gjuYjMsQSEXI3LJQyGvnvHxJ8XUanS8IkexyiSyTGqErY43uQLkI3hhrwJE88Td+4eELvGTy5xRoNBYxWG3Sck1xgmigL7nAETGCnAAVQCWDjZUBgC7DA3JHWqpVQn7K+ni9k9ktYosaJahED3cQwuyFBicH15B/3xyFVvZJzUAVL8jkaK+tYBNnI9Oxq2KRiTOEnVrWh8E2Z4tjjorUiN1rrqrrBvoQCEqlOuOCU7M1QfVTHn5mEVUCEi1ngNy6mZKX7T51cdTnAtdVBLQ3S1msKzRqZWBWJVjnFtbOy3OBFDYwMpy2izCmD41LvxkhufSMkMy9H3EiFw86cdZOvnTxKKCh98eTg/nxq7VvQasiFR1tmFU8Q3SdEA614E18+9tfS31y3TbAt/qiMHptHtjyaMOSjaTNwvhBy006mU61SqcDBQTFppp4QOlxbOHf3nobQdTpiXS44lCwg92tfRweOvI/sfF0UqB+cu1jXsFLAo03QzpRvhwgQXmGlG/6NgqZlpLTUgty0olX52BWIV3JZyETu1OCl8n+T7L4HqGdU4hbcSLI2SoQGDthlUP5LYiek85itMMGpX2NZxrxF8b620NDf/p9/44Uhr1sXjw8ND4vYfIWYlpIYQlPXjskLYIF55f+Hl51VcgmtBGYQLwYtMZpB/7idIS/cLrLX86syRt3QtvChV17vppl2iozkILe3IyFA+v97vqwXra2szRw4zlVRSRGdgwC4WSxBaw+qOjg5zz+1nioYQw7R00/R/Gi9MA34bRsI0cblcvvfee5566hdxFZ2tVlhpyHQ9N5T72c9/OpjJaqCrUthsZ9IsyubhdiVrdDwxUfM8F8ZiTOt1d+i6/t57p/x4kAAv7rcT5D5dAqtVLJZffeUvENbBzgpu4kQb+I26od9BLq1ZXkS2IKiGx9UsYZUauACrGhkZfuKJ77/wwu8b6TQYJa5G2ywLpury5eXFxddSqVQTnYgWTFCdjS2yKvpCWS4zRINjKOXs6TnbSqOUDfpnBzMqq9Y0bnuRFXul/IVDz5XKZdJaqPNlpDP1QzmwW0Tr3Xx7ScIGWVr6oFQqQj/BKgUDRxY8m8dSIY/fwlOOwitJkVUNGQ0WGZke/OZzXyI47A+BYKeoraVpsMC1SLC9yArW7eSxt9fX1wO/ENLX+cH3CI1NFjXmDB0CUs8//1vLshpgKV7qty4ULzLlQ2Jta9cia4eqsND52tAyQW1ggT/EFaIBY6SdbRYG26ZX3QCsxn4JwMI4qUMAcThHO/2mHISjHiAVBgsON6xPkJBIGjqoreSUdd3osLCt3Fm6VddPyLYM4rpg7rvEDbD7QNbVwt4a3uxaPezgkbZ2rVinuQvx5JNPzMycPHLkaKsRiW5Wytqz91Ma09rBGh0b7Yx4Lpf99N49sBnDyUynMjEx1jFBioZTOKWHg6AALI1sC1hBqs8w9GKxkJCqjN42+NVf3eGf87AJsMkgszpdV9z70MTX7rtTx2HO7El3t76ngyB4pH+//MtCoUDDHgl2nChN/hhlb+k7WIG1evbZX4Nfg22VxPpUcWWFLFEcBosjDh+B8p2oEiks00sGDuezXFnNkGyn8+t5c7Ozq/nVdo8EJ6NcKm7PMVR4GUYP6REMZlFQ0gaWbA0Ousm2ujNJsewoi7EG66kb7R4JwErukTYJFhhUsMey1WbGRTo7y7lJWSwWYYETHoWPChZsgfHxUTudIlFxVhIz//EhpUjCY4995+zZ/xw7drwfqobBMrP6A0/fWZEOaXUvvheW2Zy9kzcWY3Rqamp2dm4TwiqdTCVyUQfCHwYLQpYP9WVHliLB4sTbsVCpu69CPvPMs2C8wIb1dAwxxc5y1b2ABj6rK8hiRFuKrFjV6z0igNfSaLA8VbQUUX4Nvq8YfNOqEIaFJ5tMoUchEohShCDabCJVoEKw5LIxtl9jjSaVDeXrnElB1gh1gud4OOeRCgvBG1vELKe/kntohr6+Jj9sKOw1KRzBDamgnUmMonhRWTCsSki0QREklh8urg+O2bh+k1dJ4ujOVW3Pw40JV6HlXXssXUMQo9hBMYaPVJlcwYHbQ4eAjUbGiaoA7dEGcHmZf6fwL8wEcmuVzpDCnYqs8VsW4a5pPIqcBe8B/shZ9s5VcaXRc5LglmMvNT90/+h9b6FDsLBdBwUsBu0MEpgSGjoKABajLMmk4ATYk2ZeXNRcXe04xFHPRVasYkKqbgX09qyQX1nS8tWrsODKcPbkxAUiaXyVX0lIG8yM8dDTX6zwciikCpJRwxOZpGYLYZ0Ym43gCXbyDjs1OHCXUaCrSPZQnMECs3F0vPiGhSwwfxz1kPCkiJVuvvZO+fWUSOMEmWhJRD5zpYyKRLaBBXZPq26hDyHx2Qswk/TrUw/vorvB6vfcsUB2yia9B9AwLuCVTtnJMwaYE5Vpgd+CUMzUi+DHIz2t8ebB8m92iVdW/rAo5hnaTID3UWLoTcjCseWuuPbfVZUY7U+NknRITpkDhnmHLOECRjvxeYd2eulV+MHle6fIXg+52wpWsLywk8nOe4465vwC68ZUJ4XSOsG0H0NcRxdwJaIWOT7yRppZTDKBxA2wOoFFGMnuGoQYtU/ZEdZu2IW6gMpDdxYDutPNdgEl4U3PdW9kStX7uIsT5LVxUShx2GWPNCsMLqmesJdBCj6BwopuJFOYCcUNN7TxpEzJDJMmDifwlBMWLq4K3qRnC6KSU1vmfBsXGltAn64rUB2L5ufr63oYAzKno3BYaEjXEGnXbRDF8KCBwlTq7QqjZAorshWWFZa0QWHStHiMElwsu1JxKLyxUNhrnc7GEEQytEFvUbXKDZ02+yMIEaVEUTdpMWm6wggHxePSaCon+AUa4V/QaBWXPnOUG6NUXK6xpqeplMIcNwHUmmhlze9VelK4iSb7TxJgNaxh6K1bLmlURQlpGRtWkkNc2N17wtguF3p79VN2vz4CnFpjoYepNOlfDeg6NGlTOMmIQXOqHBY0Isg9duwYY8xxHFjqQqGg67plWfv3728vVbV05zgzMzOu68KXPQ+CDmKaJrwJXWUymVtu6V5lefPNN1dWVqamphSpxBiGO3DgQHfuzfmJEyc0TatUKkCeVR5CCPjn5OTk6OhoZ9lDhw6l/QadBD3AbxDP5XLt/xNOxBOAnt9AaZg2dAFiS0tLMO2uswV0gqwbDLawsHDrrbeeOnUKkALZhO4Jpgc9nDt3DnqYnp5eW1vzy+C4a+wOUqoaRumZM2fGx8er1SrMGTTvCpZt2zBTGAik5ubm4PulUgneiQl7Y6ZRu1Eh5Ue5gQcTgN2RsKC9NfGDr3aoLLZV7X8CDADlZ8uAT4TvXwAAAABJRU5ErkJggg=='
	},
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            itemType: 'string',
            itemValue: ''
        },
        {
            name: 'Подзаголовок',
            type: 'item',
            key: 'subtitle',
            itemType: 'string',
            itemValue: ''
        },
        {
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                type: 'group',
                name: 'Ось Х',
                key: 'xAxis',
                items: [
                {
                    type: 'group',
                    name: 'Данные осей',
                    key: 'categories',
                    multiple: 'true',
                    items: [
                        {
                            name: 'Категории',
                            type: 'item',
                            key: 'categoriesItem',
                            binding: 'field',
                            itemType: 'any'
                        }
                    ]
                },
                {
                    type: 'group',
                    name: 'Заголовок',
                    key: 'title',
                    items: [
                    {
                        type: 'item',
                        name: 'Текст',
                        key: 'text',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        key: 'style',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
                            key: 'color',
                            binding: 'field',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor'
                        }
                        ]
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Подписи',
                    key: 'labels',
                    items: [
                    {
                        type: 'item',
                        name: 'Показывать подписи',
                        key: 'enabled',
                        optional: 'checked',
                        editor: 'none'
                    },
                    {
                        type: 'item',
                        name: 'Поворот',
                        key: 'rotation',
                        itemType: 'string'
                    }
                    ]
                }
                ]
            },
            {
                type: 'group',
                name: 'Ось Y',
                key: 'yAxis',
                multiple: 'true',
                items: [
                {
                    type: 'group',
                    name: 'Заголовок',
                    key: 'title',
                    items: [
                    {
                        type: 'item',
                        name: 'Текст',
                        key: 'text',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        key: 'style',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
                            key: 'color',
                            binding: 'field',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor'
                        }
                        ]
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Значения',
                    key: 'labels',
                    items: [
                    {
                        type: 'item',
                        name: 'Формат',
                        key: 'format',
                        itemType: 'string',
                    },
                    {
                        type: 'group',
                        name: 'Стиль',
                        key: 'style',
                        items: [
                        {
                            type: 'item',
                            name: 'Цвет',
                            key: 'color',
                            binding: 'field',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor'
                        }
                        ]
                    }
                    ]
                },
                {
                    type: 'item',
                    name: 'Справа',
                    key: 'opposite',
                    optional: true
                }
                ]
            },
            {
                type: 'group',
                name: 'Серии',
                key: 'series',
                multiple: 'true',
                items: [
                {
                    name: 'Имя поля',
                    type: 'item',
                    key: 'seriesName',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: ''
                },
                {
                    name: 'Данные',
                    type: 'item',
                    key: 'seriesData',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field'
                },
                {
                    name: 'Тип отображения',
                    type: 'select',
                    key: 'type',
                    items:[
                    {
                        name: 'column',
                        type: 'item',
                        key: 'column',
                        editor: 'none'
                    }
                    ]
                },
                {
                    type: 'group',
                    name: 'Tooltip',
                    key: 'tooltip',
                    items: [
                    {
                        type: 'item',
                        name: 'Суффикс значения',
                        key: 'valueSuffix',
                        itemType: 'string'
                    }
                    ]
                },
                {
                    name: 'Индекс yAxis',
                    type: 'item',
                    key: 'yAxisIndex',
                    description: 'В случаях использования двух или более Y-осей, данный параметр определяет с какой из осей должна быть связана данная серия. Значением данного параметра должен быть индекс (порядковый номер) требуемой оси в массиве осей. При этом, нумерация осей начинается с 0. Значение по умолчанию: 0.'
                },
                /*
                {
                    name: 'Тип линии',
                    type: 'select',
                    items:[
                    {
                        name: 'Solid',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDash',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'ShortDashDotDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'Dot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'Dash',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'LongDash',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'DashDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDot',
                        type: 'item',
                        editor: 'none'
                    },
                    {
                        name: 'LongDashDotDot',
                        type: 'item',
                        editor: 'none'
                    }
                    ]
                },
                */
                {
                    name: 'Цвет',
                    type: 'item',
                    key: 'color',
                    binding: 'field',
                    itemType: 'color',
                    editor: 'JSB.Widgets.ColorEditor'
                },
                {
                    name: 'Стек',
                    type: 'item',
                    key: 'stack',
                    itemType: 'string',
                    description: 'Имя стека. Для объединения серий в один столбец следет указать одинаковые имена стеков. Работает только при отмеченном поле "Стек".'
                },
                /*,
                {
                    type: 'group',
                    name: 'Маркер',
	                items: [
	                {
	                    name: 'The fill color of the point marker',
	                    type: 'item',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor'
	                },
	                {
	                    name: 'The color of the point marker\'s outline',
	                    type: 'item',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
	                    itemValue: '#ffffff'
	                },
	                {
	                    name: 'The width of the point marker\'s outline',
	                    type: 'item',
	                    itemType: 'string',
	                    itemValue: '0'
	                },
	                {
	                    name: 'The radius of the point marker',
	                    type: 'item',
	                    itemType: 'string',
	                    itemValue: '4'
	                },
	                {
	                    name: 'A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)".',
	                    type: 'item',
	                    itemType: 'string'
	                }]
                }*/
                {
                    name: 'Показывать по умолчанию',
                    type: 'item',
                    key: 'visible',
                    editor: 'none',
                    optional: 'checked',
                    description: 'Показывать по умолчанию указанную серию на графике.'
                }
                ]
            }
            ]
        },
        {
            type: 'group',
            name: 'Легенда',
            key: 'legend',
            items: [
            {
                name: 'Активна',
                type: 'item',
                key: 'enabled',
                optional: true,
                editor: 'none'
            }
            ]
        },
        {
            name: 'Цветовая схема по умолчанию',
            key: 'colorScheme',
            type: 'select',
            items:[
            {
                name: '#1',
                type: 'item',
                key: 'color1',
                editor: 'none'
            },
            {
                name: '#2',
                type: 'item',
                key: 'color2',
                editor: 'none'
            },
            {
                name: '#3',
                type: 'item',
                key: 'color3',
                editor: 'none'
            },
            {
                name: '#4',
                type: 'item',
                key: 'color4',
                editor: 'none'
            }
            ]
        },
        {
            name: 'Режим накопления',
            key: 'stacking',
            type: 'select',
            items:[
            {
                name: 'normal',
                type: 'item',
                key: 'normal',
                editor: 'none'
            },
            {
                name: 'percent',
                type: 'item',
                key: 'percent',
                editor: 'none'
            }
            ]
        }
        /**
        The total value for each bar in a stacked column or bar chart.
        stackLabels
			0	enabled: false
			1	align: undefined
			2	format: "{total}"
			3	rotation: 0
			4	textAlign: undefined
			5	useHTML: false
			6	verticalAlign: undefined
			7	x: undefined
			8	y: undefined        
         
        **/
        ,{
            type: 'group',
            key: 'yAxisStackLabels',
            name: 'yAxis.stackLabels: the total value for each bar in a stacked column or bar chart',
            items: [
			{
				// 0	enabled: false
				type: 'item',
				name: 'Включено',
				key: 'enabled',
				optional: true
			},
			{
				// 1	align: undefined
                type: 'item',
				name: 'align',
				key: 'align',
                itemType: 'string'
			},
			{
				// 2	format: "{total}"
                type: 'item',
				name: 'format',
				key: 'format',
                itemType: 'string',
                itemValue: '{total}'
			},
			{
				// 3	rotation: 0
                type: 'item',
				name: 'rotation',
				key: 'rotation',
                itemType: 'number',
                itemValue: '0'
			},
			{
				// 4	textAlign: undefined
                type: 'item',
				name: 'textAlign',
				key: 'textAlign',
                itemType: 'string'
			},
			{
				// 5	useHTML: false
				type: 'item',
				name: 'useHTML',
				key: 'useHTML',
				optional: true
			},
			{
				// 6	verticalAlign: undefined	
                type: 'item',
				name: 'verticalAlign',
				key: 'verticalAlign',
                itemType: 'string'
			},
			{
				// 7	x: undefined	
                type: 'item',
				name: 'x',
				key: 'x',
                itemType: 'number'
			},
			{
				// 8	y: undefined	
                type: 'item',
				name: 'y',
				key: 'y',
                itemType: 'number'
			},
			{
				//	9	color**: undefined
				type: 'item',
				name: 'color',
				key: 'color',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			}			
            ]
        }        
        /**
        Options for the series data labels, appearing next to each data point.
        plotOptions.column.dataLabels
			0	enabled: false
			1	align: "center"
			2	allowOverlap: false
			3	backgroundColor: undefined
			4	borderColor: undefined
			5	borderRadius: 0
			6	borderWidth: 0
			7	color: undefined
			8	crop: true
			9	format: "{y}"
			10	inside: undefined
			11	overflow: "justify"
			12	padding: 5
			13	rotation: 0
			14	shadow: false
			15	shape: "square"
			16	useHTML: false
			17	verticalAlign: undefined
			18	x: 0
			19	y: -6
			20	zIndex: 6        
        **/
        ,{
            type: 'group',
            key: 'plotOptionsColumnDataLabels',
            name: 'plotOptions.column.dataLabels: options for the series data labels, appearing next to each data point',
            items: [
			{
				// 0	enabled: false
				type: 'item',
				name: 'Включено',
				key: 'enabled',
				optional: true
			},
			{
				// 1	align: "center"
                type: 'item',
				name: 'align',
				key: 'align',
                itemType: 'string',
				itemValue: "center"
			},
			{
				// 2	allowOverlap: false
				type: 'item',
				name: 'allowOverlap',
				key: 'allowOverlap',
				optional: true
			},
			{
				//	3	backgroundColor: undefined
				type: 'item',
				name: 'backgroundColor',
				key: 'backgroundColor',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			},
			{
				//	4	borderColor: undefined
				type: 'item',
				name: 'borderColor',
				key: 'borderColor',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			},
			{
				//	5	borderRadius: 0
				type: 'item',
				name: 'borderRadius',
				key: 'borderRadius',
                itemType: 'number',
				itemValue: '0'
			},
			{
				//	6	borderWidth: 0
				type: 'item',
				name: 'borderWidth',
				key: 'borderWidth',
                itemType: 'number',
				itemValue: '0'
			},
			{
				//	7	color: undefined
				type: 'item',
				name: 'color',
				key: 'color',
				itemType: 'color',
				editor: 'JSB.Widgets.ColorEditor'
			},
			{
				// 8	crop: true
				type: 'item',
				name: 'crop',
				key: 'crop',
				optional: true
			},
			{
				// 9	format: "{y}"
                type: 'item',
				name: 'format',
				key: 'format',
                itemType: 'string',
                itemValue: '{y}'
			},
			{
				// 10	inside: undefined
                type: 'item',
				name: 'inside',
				key: 'inside',
                itemType: 'string'
			},
			{
				//	11	overflow: "justify"
				type: 'item',
				name: 'overflow',
				key: 'overflow',
                itemType: 'string',
				itemValue: 'justify'
			},
			{
				//	12	padding: 5
				type: 'item',
				name: 'padding',
				key: 'padding',
                itemType: 'number',
				itemValue: '5'
			},
			{
				// 13	rotation: 0
                type: 'item',
				name: 'rotation',
				key: 'rotation',
                itemType: 'number',
                itemValue: '0'
			},
			{
				// 14	shadow: false
				type: 'item',
				name: 'shadow',
				key: 'shadow',
				optional: true
			},
			{
				// 15	shape: "square"
                type: 'item',
				name: 'shape',
				key: 'shape',
                itemType: 'string',
                itemValue: 'square'
			},
			{
				// 16	useHTML: false
				type: 'item',
				name: 'useHTML',
				key: 'useHTML',
				optional: true
			},
			{
				// 17	verticalAlign: undefined	
                type: 'item',
				name: 'verticalAlign',
				key: 'verticalAlign',
                itemType: 'string'
			},
			{
				// 18	x: 0	
                type: 'item',
				name: 'x',
				key: 'x',
                itemType: 'number',
				itemValue: '0'
			},
			{
				// 19	y: -6	
                type: 'item',
				name: 'y',
				key: 'y',
                itemType: 'number',
				itemValue: '-6'
			},
			{
				// 20	zIndex: 6
                type: 'item',
				name: 'zIndex',
				key: 'zIndex',
                itemType: 'number',
				itemValue: '6'
			}
            ]
        }        
        ]
    },
	$client: {
	    $require: ['JQuery.UI.Loader'],

        _curFilters: {},
        _deselectCategoriesCount: 0,
        _curFilterHash: null,

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			this.loadCss('HighchartsStackedColumn.css');
			JSB().loadScript('tpl/highstock/highstock.js', function(){
                JSB().loadScript('tpl/highstock/plugins/grouped-categories.js', function(){
                    self.init();
                });
			});
		},

        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

		init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
            	if(!$this.getElement().is(':visible') || !$this.chart){
                    return;
                }

                JSB.defer(function(){
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 300, 'hcResize' + $this.getId());
            });

            this.isInit = true;
		},

        refresh: function(opts){
        	try {
				if(opts && this == opts.initiator) return;

				var source = this.getContext().find('source');
				if(!source.bound()) return;

				$base();

                if(opts && opts.refreshFromCache){
                    JSB().deferUntil(function(){
                        var cache = $this.getCache();
                        if(!cache) return;
                        $this._buildChart(cache.seriesData, cache.xAxis);
                    }, function(){
                        return $this.isInit;
                    });
                    return;
                }

    // filters section
/**
Не используем globalFilters, если требуется drilldown
**/
if( !(this.hasOwnProperty('useInDrilldown') && this.useInDrilldown) ) {                
                var globalFilters = source.getFilters();

                if(globalFilters){
                    var categories = this.getContext().find("xAxis").find('categories').values(),
                        binding = categories[categories.length - 1].binding()[0],
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
                        source.setFilters(globalFilters);
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
}                
    // end filters section

                var seriesContext = this.getContext().find('series').values(),
                    xAxisContext = this.getContext().find('xAxis').find('categories').values(),
                    dataSource = [];

                for(var i = 0; i < seriesContext.length; i++){
                    var name = seriesContext[i].get(0);
                    dataSource.push({
                        name: name.binding() ? name : name.value(),
                        value: seriesContext[i].get(1)
                    });
                }

				$this.getElement().loader();
				JSB().deferUntil(function(){
					source.fetch({readAll: true, reset: true}, function(){
                        var seriesData = [],
                            xAxisCategories = [],
                            colorMap = {};

                        function rec(i, length){
                            if(i === length){
                                return undefined;
                            }

                            return [{
                                name: xAxisContext[i].get(0).value(),
                                categories: rec(i + 1, length)
                            }];
                        }

                        function merge(obj1, obj2){
                            for(var i = 0; i < obj2.length; i++){
                                var f = false;
                                for(var j = 0; j < obj1.length; j++){
                                    if(obj2[i].name === obj1[j].name){
                                        f = true;
                                        if(obj1[j].categories){
                                            obj1[j].categories = merge(obj1[j].categories, obj2[i].categories);
                                        } else {
                                            obj1[j].categories = obj2[i].categories;
                                        }
                                    }
                                }
                                if(!f){
                                    obj1.push(obj2[i]);
                                }
                            }
                            return obj1;
                        }

						try {
                            while(source.next()){
                                for(var i = 0; i < dataSource.length; i++){
                                    if(!JSB.isString(dataSource[i].name)){    // composite series
                                        if(!seriesData[i]){
                                            seriesData[i] = {
                                                data: {},
                                                simple: false
                                            };
                                        }

                                        if(!seriesData[i].data[dataSource[i].name.value()]){
                                            seriesData[i].data[dataSource[i].name.value()] = [];
                                        }

                                        seriesData[i].data[dataSource[i].name.value()].push(dataSource[i].value.value());
                                    } else {    // simple series
                                        if(!seriesData[i]){
                                            seriesData[i] = {
                                                index: i,
                                                simple: true,
                                                name: dataSource[i].name,
                                                data: []
                                            };
                                        }

                                        var d = dataSource[i].value.value();

                                        if(JSB().isArray(d)){
                                            seriesData[i].data = d;
                                        } else {
                                            seriesData[i].data.push(d);
                                        }
                                    }
                                }

                                if(xAxisContext.length > 1){
                                    xAxisCategories = merge(xAxisCategories, rec(0, xAxisContext.length));
                                } else {
                                    var a = xAxisContext[0].get(0).value();
                                    xAxisCategories.push(a ? a : 'Null');
                                }
                            }

                            var data = [];
                            for(var i = 0; i < seriesData.length; i++){
                                if(seriesData[i].simple){
                                    data.push(seriesData[i]);
                                } else {
                                    var obj = seriesData[i].data;

                                    for(var j in obj){
                                        data.push({
                                            index: i,
                                            name: j,
                                            data: obj[j]
                                        })
                                    }
                                }
                            }

                            if(opts && opts.isCacheMod){
                                $this.storeCache({
                                    seriesData: data,
                                    xAxis: xAxisCategories
                                });
                            }

                            $this._buildChart(data, xAxisCategories);
						} catch(e) {
							console.log("Exception", e);
							$this.getElement().loader('hide');
							throw new Error("Options create error");
						} finally{
						    $this.getElement().loader('hide');
						}
					});

				}, function(){
					return $this.isInit;
				});
            
            } catch(e) {
				$this.getElement().loader('hide');
				console.log("Exception", e);
			}
        },

        _buildChart: function(seriesData, xAxisData){
            try{
                var yAxisStackLabels = this.getContext().find('yAxisStackLabels').values(),
                    plotOptionsColumnDataLabels = this.getContext().find('plotOptionsColumnDataLabels').values(),
                    seriesContext = this.getContext().find('series').values(),
                    yAxisContext = this.getContext().find('yAxis').values(),
                    xAxisContext = this.getContext().find('xAxis').values(),
                    yAxis = [],
                    series = [];

                    for(var j = 0; j < seriesData.length; j++){
                        if(!series[j]){
                            series[j] = {
                                name: seriesData[j].name,
                                data: seriesData[j].data,
                                type: seriesContext[seriesData[j].index].get(2).value().name(),
                                tooltip: {
                                    valueSuffix: seriesContext[seriesData[j].index].get(3).value().get(0).value()
                                },
                                yAxis: $this.isNull(seriesContext[seriesData[j].index].get(4).value(), true),
                                //dashStyle: seriesContext[seriesData[j].index].get(5).value().name(),
                                color: $this.isNull(seriesContext[seriesData[j].index].get(5).value()),
                                /*
                                marker: {
                                    // The fill color of the point marker
                                    fillColor: $this.isNull(seriesContext[seriesData[j].index].get(7).value().get(0).value()),
                                    // The color of the point marker's outline
                                    lineColor: $this.isNull(seriesContext[seriesData[j].index].get(7).value().get(1).value()),
                                    // The width of the point marker's outline
                                    lineWidth: (($this.isNull(seriesContext[seriesData[j].index].get(7).value().get(2).value()) !== undefined) ? parseInt($this.isNull(seriesContext[seriesData[j].index].get(7).value().get(2).value()),10) : undefined),
                                    // The radius of the point marker
                                    radius: (($this.isNull(seriesContext[seriesData[j].index].get(7).value().get(3).value()) !== undefined) ? parseInt($this.isNull(seriesContext[seriesData[j].index].get(7).value().get(3).value()),10) : undefined),
                                    // A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down". Additionally, the URL to a graphic can be given on this form: "url(graphic.png)".
                                    symbol: $this.isNull(seriesContext[seriesData[j].index].get(7).value().get(4).value())
                                },
                                */
                                visible: seriesContext[seriesData[j].index].find('visible').used(),
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
                                stack: seriesContext[seriesData[j].index].get(6).value()
                            };
                        }
                    }

                    for(var i = 0; i < yAxisContext.length; i++){
                        yAxis[i] = {
                            title: {
                                text: yAxisContext[i].get(0).value().get(0).value(),
                                style: {
                                    color: $this.isNull(yAxisContext[i].get(0).value().get(1).value().get(0).value())
                                },
                                align: 'high'
                            },
                            labels: {
                                format: $this.isNull(yAxisContext[i].get(1).value().get(0).value()),
                                style: {
                                    color: $this.isNull(yAxisContext[i].get(1).value().get(1).value().get(0).value())
                                }
                            },
                            stackLabels: {
                                enabled: yAxisStackLabels[0].get(0).used(),
                                align:  $this.isNull(yAxisStackLabels[0].get(1).value()),
                                format: $this.isNull(yAxisStackLabels[0].get(2).value()),
                                rotation: parseInt($this.isNull(yAxisStackLabels[0].get(3).value()), 10),
                                textAlign: $this.isNull(yAxisStackLabels[0].get(4).value()),
                                useHTML: yAxisStackLabels[0].get(5).used(),
                                verticalAlign: $this.isNull(yAxisStackLabels[0].get(6).value()),
                                x: parseInt($this.isNull(yAxisStackLabels[0].get(7).value()), 10),
                                y: parseInt($this.isNull(yAxisStackLabels[0].get(8).value()), 10),
                                style: {
                                    color: $this.isNull(yAxisStackLabels[0].get(9).value()) || (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                }
                            },
                            opposite: yAxisContext[i].get(2).used()
                        };
                    }

                    var colors = [
                        ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                        ['#110C08', '#35312F', '#626A7A', '#9A554B', '#D88A82', '#BBBBBB', '#E0DFDE', '#EEEDEB', '#F4F4F4'],
                        ['#1C3E7E', '#006DA9', '#B2D3E5', '#BFC6D9', '#EFB9BF', '#CA162A'],
                        ['#1C3E7E', '#FF553E', '#FFCCC5', '#D0D0D0', '#8E8E8E', '#636363'],
                        ['#4FBDE2', '#CAEBF6', '#89CBC6', '#DBEFEE', '#8A5C91', '#DCCEDE', '#4F3928', '#CAC3BE', '#FFF3D9']
                    ], colorSchemeIdx = parseInt(this.getContext().find('colorScheme').value().name().toString().replace(/\D/g,''), 10);

                    var chartOptions = {

                        colors: !colors.hasOwnProperty(colorSchemeIdx) ? colors[0] : colors[colorSchemeIdx],

                        chart: {
                            //zoomType: 'x'
                        },

                        title: {
                            text: this.getContext().find('title').value()
                        },

                        subtitle: {
                            text: this.getContext().find('subtitle').value()
                        },

                        xAxis: {
                            categories: xAxisData,
                            title: {
                                text: xAxisContext[0].get(1).value().get(0).value(),
                                style: {
                                    color: $this.isNull(xAxisContext[0].get(1).value().get(1).value().get(0).value())
                                },
                                align: 'high'
                            },
                            labels: {
                                enabled: xAxisContext[0].get(2).value().get(0).used(),
                                rotation: xAxisContext[0].get(2).value().get(1).value()
                            }
                        },

                        yAxis: yAxis,

                        tooltip: {
                            shared: false
                        },

                        legend: {
                            enabled: this.getContext().find('legend').find('enabled').used(),
                            layout: 'horizontal',
                            floating: false,
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0,
                            itemDistance: 30,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },

                        plotOptions: {
                            column: {
                                stacking: this.getContext().find('stacking').value().name().toString(),
                                dataLabels: {
                                    enabled: plotOptionsColumnDataLabels[0].get(0).used(),
                                    align: $this.isNull(plotOptionsColumnDataLabels[0].get(1).value()),
                                    allowOverlap: plotOptionsColumnDataLabels[0].get(2).used(),
                                    backgroundColor: $this.isNull(plotOptionsColumnDataLabels[0].get(3).value()),
                                    borderColor: $this.isNull(plotOptionsColumnDataLabels[0].get(4).value()),
                                    borderRadius: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(5).value()), 10),
                                    borderWidth: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(6).value()), 10),
                                    color: $this.isNull(plotOptionsColumnDataLabels[0].get(7).value()) || (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                    crop: plotOptionsColumnDataLabels[0].get(8).used(),
                                    format: $this.isNull(plotOptionsColumnDataLabels[0].get(9).value()),
                                    inside: $this.isNull(plotOptionsColumnDataLabels[0].get(10).value()),
                                    overflow: $this.isNull(plotOptionsColumnDataLabels[0].get(11).value()),
                                    padding: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(12).value()), 10),
                                    rotation: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(13).value()), 10),
                                    shadow: plotOptionsColumnDataLabels[0].get(14).used(),
                                    shape: $this.isNull(plotOptionsColumnDataLabels[0].get(15).value()),
                                    useHTML: plotOptionsColumnDataLabels[0].get(16).used(),
                                    verticalAlign: $this.isNull(plotOptionsColumnDataLabels[0].get(17).value()),
                                    x: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(18).value()), 10),
                                    y: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(19).value()), 10),
                                    zIndex: parseInt($this.isNull(plotOptionsColumnDataLabels[0].get(20).value()), 10)
                                }
                            }
                            /*
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                            */
                            /*,
                            series: {
                                allowPointSelect: true,
                                states: {
                                    select: {
                                        color: null,
                                        borderWidth: 5,
                                        borderColor: 'Blue'
                                    }
                                }
                            }
                            */
                        },

                        credits: {
                            enabled: false
                        },

                        series: series
                    };

                    console.log(chartOptions);
                    $this.container.highcharts(chartOptions);
                    $this.chart =  $this.container.highcharts();
            } catch(e){
                console.log(e);
                return;
            }
        },

        _addNewFilter: function(evt){
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var categories = this.getContext().find("xAxis").find('categories').values();
            var field = categories[categories.length - 1].binding()[0];
            if(!field) return;

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

        // utils
        isNull: function(a, b){
            if(b) return a === null ? undefined : parseInt(a);
            return a === null ? undefined : a;
        },

        _selectAllCategory: function(cat){
            var series = this.chart.series;

            for(var i = 0; i < series.length; i++){
                for(var j = 0; j < series[i].points.length; j++){
                    if(series[i].points[j].category.name == cat && !series[i].points[j].selected){
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
                    if(series[i].points[j].category.name == cat && series[i].points[j].selected){
                        this._deselectCategoriesCount++;
                        series[i].points[j].select(false, true);
                        break;
                    }
                }
            }
        }
	}
}