{
	$name: 'DataCube.Widgets.LeafletMap',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Карта',
        description: '',
        category: 'Карты',
        thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAEo5JREFUeF7tXFl0k2d67m0ve9ubnp7ObS/ai3Y6NzNtTqeTTM5MZmlmmk4ymZlkQhOywSQhJUCAhBACBgMxS8DYGGNsg/G+yrssyZatxbKtfbEWy1osS3jHwNP3/bR4++VVYDfDc857pH+R/l/v873r9/36CzzFjsJTQnYYnhKyw7AjCbk/N4OJySmMjPrR12+F3mCA2WTE+PRDXLv4DVw2Mx48mofd5YOsxwCnSQ+jcVB81huMITzigtXthr6nFS63D/OxUczFAgg79ZiKjmDu4UP09A+I83cCIpEI3HS/ExMTO5SQ2WnxOmA0o7S+G83yXpTcrkCUCLl15SrKS0qh7+3A1YsF6DTYICu9iJLKJsw8Ai6dOojzBXehtPgFIUWltzFPJMxG/ZgNWIC5MXxx4CC0A/2wOVziOtuN5uZm5OTkQKvVPnVZOw1PCdlh2NGEzMzMYHZ2jmQ2sefbjydCyEMKolPTM7A6PGhQDKNe4REiU9ohUzkxNzeHscg4xsfH4XR5MDBowkiIgjqJLzCBYd8YHMN+cd6jR4+EfFvx2AkZMLvRO+CFrn8IPVoHunqGUqTYHT54R6PwBSdTBKwm3sA9ON0BTJPlrIb5Bw+Edd2/Py+2eUAkEQiGoNGbER4bg1pnQYfajsh4NHF0JQbMPtR1mhJbjx8ZJyQSvSdGsH7Ig6mpGQRC44KA9h47WlVWQURP36BI8fjYyDrJYPH4xxNXkYbbF0JOsQ5X7ujh84cRuze1hIzN4AGRq9S64fQEMGD1J/Y+PmSMEO3gMKKxCYTC40IJ/EPYxQxZnGIEdva5yEU5oOwzCsJ8Ph8sDq+k4tOJyxNc010ZzF4Ex2KCkPWSMT8/j9m5+4mtlbhPx9nlFtebMUPxbH7+QeJI5pERQviHR6MxdPSSwntNaO8dRjgcEa9dfQ60dLsh77WhSeWmWDCS+BRSymXy1uu2WHmZQovKDgW5USkF8731mzzIrzLiWoUJV8sXpKTBnDhrKXz+IAqqjWjqMkE34CCXmZ7kdMgIIeyGGpXDMNp85IqmyO96yYfPERFOqOgHD1p9UOrc6O73otfgEqNtOfyjo5IEJMVsdWJsLJI4e+swmNwYCSy4wCi5Wlbg5NQ0VfFu3GmyLCEhKS0qCxFiQlWbFe6RCKrb7VAbvIlvgcgKRwPhxNbGsSYhVlcIPgq8yQC5HGwdgxafyJJkSpcgp0HpFqYdjsQoixrGAzqH3RUfq1e4hegGbEtcCivD5hiWJMM7SsF82LehEcf3y1Y6NS2dMjfKzeRiJ8V7vg+2AqPFjcYOgxjlueVGSUKkJK/SRImLB2UyM4pqhxL7jTT4PHB5OZbFOw+LMRqMYHJyKrG1gLSEOIZH8f4pxQr54IyC3A+nq45EtsTiRp/BAavdQW5pGFqDBQqNlX6gE263V5zPFsPnjUej6KXsht+rdI7E1eIYi0SkCaHsKjy2ekBPYopG+PlbOtyo7ENumQaFNQMoqackYjKuFHZPyj6riHcc9G9UDwkXU9ligtsbQF3bwBJlZ0pySfIqjTQQ4pZX3RqPpcuRlhBOR4tr9ZKExEe6lPDo96C125ba19bjFK/NKhe6NHbx3eyyGsmKZLSvpceVujGXN7SCiAcP4lbE53CsmZiIj+p0KKox4OAFNT69qMaxXC2uVw2gps2Im7VGWJyjqOuQdkWsMO2gV/LY45QWlY2SnwXLlySEA+eQzY9unX2DhEgLW5LD5YOcMi1WqtXlF5YUt5h7iauCMrQFCwmOLa0NmBAFpZ8q8tdzaVyXdtCN7BtqQQhbwPFrWuRX6IU7Kq4npS8LztspJrtP/CZ294uR1kIqmweWELEnIZshJBkrOAa4PT40KZ0UUEOiSOPUeDHYMpmQ9WCxyZ8q0OHkdZ0gIxKdwOkCjbCQa3f1kgp5UsKWp+yjrGvQmdpntC7oZDnSEjI9Mwu52oajl7uRX66jwigsFDBJxV63zoaypkFJ5S+XVrVnieKYlOSxqelpaIYWMpQkZpeRlA4TdC9Jl/b1LT0qmocEIXKNE8FgGLl3tcJvL1bQk5BBywi0VBizR4jF7pG136P03y46COmISCItIQwOhB1qB/n2YGLPAswWGxrk8cp7LWlTuxEMx8TnwuEwWnvisSYpm60t3j7ekgrWjDwaOGwZ00T0yTwFjlzswvXKZNbz+CW3wkjZ5VJ3Go5MiGMuTyixZ3VIEsJ+flqiVlgMPsflWqrYtYTT4UAoKnlsZHQl6avhMCk7Sq7p+6+Vi22bawTP7CrHkZxWPPt2LV7YU4ddn3fgj591kELSW0mLXIfSJhtKSGpbh8jK1p9lcWqcX9G/ZJtrlLFFGWGABmJNuyWxtTZWtZD1oKPHLKngdCLrXuj2clBv6XZBofNi0Lg0BV4Lk1OzcPuCyC5QIfu6Ai/tq8Y/vHQbn5yVCTKee6cWL38iw6uHmvH7w83kvhYUV9EyhLJms3Bxde2DRIZ9ifDx61VDlAxwmmpCAb3vM47iVp1J7GOC88ny3iEL/dc3qsgyF767qM5I2eRw4i7J9ZO1bgRbJoRxIleFP51WSAonAXcb+xEMRRYRQZU9ZV6NXRbKsiZEvOqmmmRxxrUecFX9u0NN+I/dNfivj+uw+1g9Xj/chPdPyHDofJtQ2GtHZPjPj5rwv2c7hcLyKabckdlwm2Q5EYuluGFIfEZrDktKNaXSv95XLwhhycpTCQuxDYfod8Td82aQEUIWZ2PppKObRqZsgGKSC7dq+/FlbjcaOo0wmDzC/W0UDx8+ErGnosUkCPnTySY8/04V9IMufHmlAwfOtuE3+5sQHp8gsp0wmD2CEA7y7I5LiZAD5zqoPhlKuKwFMj46055S9Een26A1BZeQcSpPiWd3V6fOYSmp1ZK1O0QCw/M8ofBY4k43hidGyOFLKhwh2XdWKbb7je7EpzeHQYsHv/yoES/sbYDZEW+Lc8H5wak28uFRUloHrpQqoDE48MbnrdAT8aevK3GpSA5/MAKrw4vCKh2OX5HjD5+2kEL7cCKvG8e+UeCHby1V9jP/U0VxqRp7Trbix+/UpPY/+3YNfvhmNd75oiGVSXrIjU7PrC9LlEJGCKlqNa8gYDXRDiz42M2iidzdLz5swMl8tUilp6dnRd+KWx+snCMXO2B3esQ5P/ugAa8caBTuax+5IQ0VkBYi8WyhGhdKB3CpWI0jF+REhhz/tmuBiNWEz9MMxq37j0caxD3xdV89GH+/WWSEEL6RU/m9kspfLhxXovfWV/itBr7mW8facOWOBicL9Dh1Qy/6VsmRyq/JuXjukf343Vq8drQZh3La8caxjpScvaGgoN+GN+m7vvtqGX6+p0KSACnhgciobjPhdqMBe76SwR/afPxgZISQJO42DeDzS53ixy0n4kBOPPAnFbZVHDjfhZcPNCOLiGBCWIrr+kXCwJ1Uft19vBXHryqRda0TuWW9uFDci199LMO7JztThJzOV+DdL9vx3d+W4V+IkL95vpAytjpJApbLc+Sykr+HC+ZMIKOEDFMBqdIP47eHWoUcvdS1pDKdJB/PcxBbIYXnysubTSiu7k4RkZRm5UJTk+WXHzYKqWoZQFZhf0pMdj9lRP3kvuTY/WUH/vG/7+C53RX4258UCkL++ZUSvHG4Fp9daMZP3ysnwpokCTl2tTtxV5lDRglhmGw+MV2bJGUx7k1MijZCILj5CRyOE7XtRrRrRnDlrh5fF+tShOTe1aFebkstovjVvkYhL1G2ZXeHUoScLtRT/OgRM4Y8OFj2nWkRZCyWn+8pw/7sRvzmk2b8OwXvFz9cCOh7T3VS8rC5TGo1rIuQjUwMMdgqFhMyPDJGdUe89U7ZqpgnUWulp0HXQpgyKCaDhUd5dpEBd+q1uF6pw7niASGc3hbXDeBEvi4l/tEgckoNKVKKarRoUi4tRncdrU+R8cKeSrHP4ggKQvLvKHH0QgdiE9OiJ/W4kHELWQyXN4LWHjsF0jaqP2wYG18Z8Hh0rtVwYyTdnNE2gjtNRjSrHFTkGXC+uF+sMkmSUVAVr5q5kl5MyMfZHYjQ9d/7qhPvUQzx+ldOB9uHA4IMbuEnwdfVDPnwzK5q/O5gI7rJJSf3F1M9xfVQJvFYCVkM9tuKPpt4z6mixe4W06xMxkaaix5fACevyXG5tA8Xi/tE4P76Zjd+8n4V1SQ1FKTlgpAbREySjK9vafGLDxpx/JtOsUwpFJHuCLCS/+6nN6lOWTlwfCNsKTLs+qwpsQcIBMJoV+gSWwtIDp7N4IkRwvD6w1SQ+agS7hLtlj1ZCiHtqo0tROPq/NwNJdUWLRS06ymza8X3fl+OH7xRQfWHApUyAwrrrDhXxC6N5HqXIISlsKoPN+vijy5IwewYxfmbCxaShNUVENO/SSSten92i3jNFJ4oIUm8e4JS4y86kZWnwJkCFW7V6Ckm+HCNgvJ6EYpMUM5/j7K2+Mxis9KKvVld+OKKEiWU/uaXa8RczuXbGkp31fgwq5UsqwvZN9NfI10LJ6dIjcYOo5ivZ7BFn8rtXJer3SjWJGQr5ieFq2U6fHZJLgg5dkWNo9+ocfhSfNr1CL2GwumXda4Gnta9TbGlpL4fp64TAdkqIfuz23CaSP811R+Xb2s3pUQm6sWPGkR94w9G8fIn9eQi60T7xe3xw+ZwS7q55ViPLp+4hWTldeEQKf+rvDgJUnKUiDpTqNtw09EzEsbF0v4UGSxn8jupQm/HpzmdWxpc7K5+trdOEMqJRb/Jhyu3u2kgzCMYCiMcHqdB1oLn36sVCQzD7x8VrxvBEyekR++WJEFKjlxe6cvXwskCCuJFPTh7o1sQUlTdiz8cacfrRMpWwWSUNerx4ZkOsVKf1wOExyJLiOYG5M0aA+R9TrGfPyPV+U03OLYlhrCi2U1dp7Q163qvJBkso6GNu69v7sQLRe5xnaPiL7tQg4K7Snx2uSs1vZpcILdV8Hw+xxNWrtPtJ0uJzxTGYhOCiI1aOEOSkK2Y9nrAVfOhi+rE7JsJ18o0K8jgeLJR3Ce3kqzar93V4Hielr5bjc8vy/HBGZVoizvcQRHoMwXuOnTpvKJQZTfGRHRoPImjS2G2Lyz5SVdcbouFMPjG8ysHBSFVMv0KQi7f7k+cuX7wOIpX8T7RPimi7G3vaSX2n+9ODbK9pxVivoSx1YHHraBk12C5BEJLC8/l11q8OG4xto0QHiHXynrFUp3sm1pcoiKPiWDL4dWOy1dvrBc2qhdYIaLB2OXCpxcU+PicKnGUUu6TXYl3W8NyAqSE1zYvRuze2q5y2wjhVeIXSxJzGSQXirWCEJ1x5TqtjYCXmrIysgvUePuEHPvOdkkWdFsBf8dy5aeTjWLbCBmy+lL+niWPfH1WgYZ+7Nbj16ELKrx5XI63SHLI8h4HOjRuSQKWy0axbYQ0yU0pMni27wxV0FLPjWwG3AwsqDKgk1LPxwV+/MBo8yMyvtAX01NQX0yGe0S6Pb9a7No2Qo7nqlOE8PzEao+U/X/CSCCCTq0XSn0845KCTGkRE21S2DZCCip6BRkVLTvnP0cyBX5YyWyT/tsOLiZbVOnngraFEC6mCiv7iBAdBfdvh2Usx8zMyie3JiZnUFi9+gDcFkI4R8+jwu3rYn1iz58H2HLWqn22hRB+mObcLR38wfU9pvYkkKmEYqvYFkJ4lBRWasQqleT2U8SxbUGdSeAnd59iKbaNkKeQxlNCdhgEIZwbx2KxlOwEZB19D5VVDdB2NWBosB9lRRdRW3kX1U2dUHS2QdbEK84f4vQXn6Cyph7VtbVQdGtwqzAXGnU3gj4XhmxO2KxmzFKBdrxIhrqaanS2b32i6nFCEMKzX1w58h9PpqsgnzRCgRGMB3wozTmI2HhE/FmNwaCBxeqEw2rEaGhMxKF+wyB0Gg28bjtMVjsCbv7nIQNMehWiU3PweONzEyNB+g7PMCKxrS/0fpxIETI5MYHsy+U7hpDJGbLayTlS4CyC4zMYDfMfCUxi2D8Bhy8m/m7D6BjHgD0CnTmMPmMQPYNBKPtH0an1i15Sc48XDUoP6hRuVHUMo7zViTvNdhQ32nGzzgqTM/NLQbeKJRaSlJ0Az2gMZlcUeksYKsMoWtU+1MiHcVtmR0GNRfz5y5mbBvHnADyHwvPnu7+U47WjbXhpf7NYZP2j3TX4/uuV+KdXyvD3L5bgOz8twl//6Ab+6gfX8JffuyLmYXYadiwhf67YsYT43Ks8lfvoAeYezSM2nb4PNjs5jkDQi/nEHwssxxgd34nYsYTMTK3+RO48HmB6Lv2a4PuzU5QxjuFBmgmv6bkp3MvQQzaZhCCEH/2KRqMpeYrtgyDkKXYKgP8DBWNeAGtMzPYAAAAASUVORK5CYII='
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
            // Регионы
            {
                name: 'Регионы',
                type: 'group',
                key: 'regions',
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
                        name: 'Имя региона или поле для сопоставления',
                        type: 'item',
                        key: 'region',
                        binding: 'field'
                    },
                    {
                        name: 'Значение',
                        type: 'item',
                        key: 'value',
                        binding: 'field'
                    },
                    {
                        name: 'GeoJson-карта',
                        type: 'select',
                        key: 'geojson',
                        items:[
                        {
                            name: 'Карта регионов России',
                            type: 'group',
                            key: 'russianRegions',
                            editor: 'none',
                            items: [
                            {
                                name: 'Сопоставление по',
                                type: 'select',
                                key: 'compareTo',
                                items: [
                                {
                                    name: 'Имя региона',
                                    type: 'item',
                                    key: 'NAME_1',
                                    editor: 'none'
                                },
                                {
                                    name: 'Номер по конституции',
                                    type: 'item',
                                    key: 'KONST_NUM',
                                    editor: 'none'
                                },
                                {
                                    name: 'Код OKTMO',
                                    type: 'item',
                                    key: 'OKTMO',
                                    editor: 'none'
                                },
                                {
                                    name: 'ISO',
                                    type: 'item',
                                    key: 'ISO',
                                    editor: 'none'
                                }
                                ]
                            }
                            ]
                        },
                        {
                            name: 'Карта регионов России MPT',
                            type: 'group',
                            key: 'russianRegionsMPT',
                            editor: 'none',
                            items: [
                            {
                                name: 'Сопоставление по',
                                type: 'select',
                                key: 'compareTo',
                                items: [
                                {
                                    name: 'Имя региона',
                                    type: 'item',
                                    key: 'NAME_1',
                                    editor: 'none'
                                },
                                {
                                    name: 'Номер по конституции',
                                    type: 'item',
                                    key: 'KONST_NUM',
                                    editor: 'none'
                                },
                                {
                                    name: 'Код OKTMO',
                                    type: 'item',
                                    key: 'OKTMO',
                                    editor: 'none'
                                },
                                {
                                    name: 'ISO',
                                    type: 'item',
                                    key: 'ISO',
                                    editor: 'none'
                                }
                                ]
                            }
                            ]
                        },
                        {
                            name: 'Карта стран мира',
                            type: 'group',
                            key: 'worldCountries',
                            editor: 'none',
                            items: [
                            {
                                name: 'Сопоставление по',
                                type: 'select',
                                key: 'compareTo',
                                items: [
                                {
                                    name: 'Название страны',
                                    type: 'item',
                                    key: 'ru_name',
                                    editor: 'none'
                                },
                                {
                                    name: 'Код ISO',
                                    type: 'item',
                                    key: 'id',
                                    editor: 'none'
                                }
                                ]
                            }
                            ]
                        }
                        ]
                    },
                    {
                        name: 'Цвет заливки',
                        type: 'select',
                        key: 'color',
                        items: [
                        {
                            name: 'Единый цвет',
                            type: 'group',
                            key: 'simpleColor',
                            editor: 'none',
                            items: [
                            {
                                name: 'Цвет',
                                type: 'item',
                                key: 'color',
                                itemType: 'color',
                                editor: 'JSB.Widgets.ColorEditor'
                            }
                            ]
                        },
                        {
                            name: 'Диапазон цветов',
                            type: 'group',
                            key: 'rangeColor',
                            editor: 'none',
                            items: [
                            {
                                name: 'Начальный цвет',
                                type: 'item',
                                key: 'startColor',
                                itemType: 'color',
                                editor: 'JSB.Widgets.ColorEditor'
                            },
                            {
                                name: 'Конечный цвет',
                                type: 'item',
                                key: 'endColor',
                                itemType: 'color',
                                editor: 'JSB.Widgets.ColorEditor'
                            },
                            {
                                name: 'Функция вычисления цвета',
                                type: 'select',
                                key: 'functionType',
                                editor: 'none',
                                items: [
                                {
                                    name: 'Линейная',
                                    type: 'item',
                                    key: 'linear',
                                    editor: 'none'
                                },
                                {
                                    name: 'Логарифмическая',
                                    type: 'item',
                                    key: 'logarithmic',
                                    editor: 'none'
                                },
                                {
                                    name: 'Квадратичная',
                                    type: 'item',
                                    key: 'quadratic',
                                    editor: 'none'
                                }
                                ]
                            }
                            ]
                        },
                        {
                            name: 'Цвет из источника',
                            type: 'item',
                            key: 'sourceColor',
                            binding: 'field',
                            editor: 'none'
                        }
                        ]
                    },
                    {
                        name: 'Цвет заливки регионов без данных',
                        type: 'item',
                        key: 'defaultColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: 'rgb(115, 115, 115)'
                    },
                    {
                        name: 'Цвет границ регионов',
                        type: 'item',
                        key: 'borderColor',
                        itemType: 'color',
                        editor: 'JSB.Widgets.ColorEditor',
                        defaultValue: 'rgb(115, 115, 115)'
                    },
                    {
                        name: 'Толщина границы',
                        type: 'item',
                        key: 'borderWidth',
                        itemType: 'number',
                        defaultValue: 1
                    },
                    {
                        name: 'Показывать значения на регионах',
                        type: 'item',
                        key: 'showValuesPermanent',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Показывать регионы без значений',
                        type: 'item',
                        key: 'showEmptyRegions',
                        optional: true,
                        editor: 'none'
                    },
                    {
                        name: 'Выбранная область',
                        type: 'group',
                        key: 'selectRegion',
                        items: [
                        {
                            name: 'Цвет заливки регионов',
                            type: 'item',
                            key: 'selectColor',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: 'rgb(115, 115, 115)'
                        },
                        {
                            name: 'Цвет границ регионов',
                            type: 'item',
                            key: 'selectBorderColor',
                            itemType: 'color',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: 'rgb(0, 0, 0)'
                        }
                        ]
                    }
                    ]
                }
                ]
            },
            // Тайлы
            {
                name: 'Tile-карты',
                type: 'group',
                key: 'tileMaps',
                collapsable: true,
                multiple: true,
                items: [
                {
                    name: 'Сервер карт',
                    type: 'select',
                    key: 'url',
                    editor: 'none',
                    items: [
                    {
                        name: 'Спутник.ру',
                        type: 'item',
                        key: 'sputnik',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Openstreetmap.org',
                        type: 'item',
                        key: 'openstreetmap',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Cartocdn.com',
                        type: 'item',
                        key: 'cartocdn',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Stamen.com',
                        type: 'item',
                        key: 'stamen',
                        editor: 'none',
                        itemType: 'string',
                        defaultValue: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
                    },
                    {
                        name: 'Свой',
                        type: 'item',
                        key: 'custom',
                        itemType: 'string'
                    }
                    ]
                }
                ]
            }
            ]
        }
        ]
    },
    $client: {
        $require: ['JSB.Utils.Rainbow', 'JQuery.UI.Loader', 'JSB.Crypt.MD5'],

        $constructor: function(opts){
            $base(opts);

            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.addClass('mapWidget');
            this.loadCss('map.css');

            JSB.loadCss('tpl/leaflet/leaflet.css');
            JSB.loadScript('tpl/leaflet/leaflet.js', function(){
                $this.setInitialized();
            });

            $this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.map){
                        return;
                    }
                    $this.map.invalidateSize();
                }, 300, 'hcResize' + $this.getId());
            });
        },

        // inner variables
        _curFilters: {},
        _isMapsLoaded: false,
        _isDataLoaded: false,
        _maps: [],
        _mapHash: null,

        refresh: function(opts){
            // if filter source is current widget
            if(opts && this == opts.initiator){
                return;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                return;
            }

            var dataSource = this.getContext().find('dataSource');
            if(!dataSource.bound()){
                return;
            }

            $base();

            // advanced filters
            var globalFilters = dataSource.getFilters(),
                regionsContext = this.getContext().find('regions').values();

            if(globalFilters){
                var bindings = [],
                    newFilters = {};

                for(var i = 0; i < regionsContext.length; i++){
                    bindings.push(regionsContext[i].find('region').binding()[0]);
                }

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    for(var j = 0; j < bindings.length; j++){
                        if(cur.field === bindings[j] && cur.op === '$eq'){
                            if(!this._curFilters[cur.value]){
                                this._curFilters[cur.value] = cur.id;
                                this._selectFeature(cur.value);
                            }

                            newFilters[cur.value] = true;

                            delete globalFilters[i];
                        }
                    }
                }

                for(var i in this._curFilters){
                    if(!newFilters[i]){
                        this._deselectFeature(i);
                        delete this._curFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length > 0 && this.createFilterHash(globalFilters) === this._curFilterHash || Object.keys(globalFilters).length === 0 && !this._curFilterHash){
                    return;
                } else {
                    this._curFilterHash = Object.keys(globalFilters).length > 0 ? this.createFilterHash(globalFilters) : undefined;
                    dataSource.setFilters(globalFilters);
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    for(var i in this._curFilters){
                        this._deselectFeature(i);
                    }
                    this._curFilters = {};
                    return;
                }
                this._curFilterHash = null;
            }

            try{
                var regionsColors = [],
                    maps = [],
                    newMapHash = '';

                for(var i = 0; i < regionsContext.length; i++){
                    var colorSelector = regionsContext[i].find('color').value();
                    switch(colorSelector.key()){
                        case 'simpleColor':
                            regionsColors[i] = {
                                simpleColor: colorSelector.value().value()
                            }
                            break;
                        case 'rangeColor':
                            regionsColors[i] = {
                                rangeColor: {
                                    startColor: colorSelector.find('startColor').value(),
                                    endColor: colorSelector.find('endColor').value(),
                                    functionType: colorSelector.find('functionType').value().key()
                                }
                            }
                            break;
                        case 'sourceColor':
                            regionsColors[i] = {
                                sourceColor: colorSelector
                            }
                            break;
                    }

                    regionsColors[i].defaultColor = regionsContext[i].find('defaultColor').value();
                    regionsColors[i].borderColor = regionsContext[i].find('borderColor').value();
                    regionsColors[i].borderWidth = regionsContext[i].find('borderWidth').value();
                    regionsColors[i].selectBorderColor = regionsContext[i].find('selectBorderColor').value();
                    regionsColors[i].selectColor = regionsContext[i].find('selectColor').value();

                    var jsonMapSelector  = regionsContext[i].find('geojson').value();
                    switch(jsonMapSelector.key()){
                        case 'russianRegions':
                            maps.push({
                                data: null,
                                path: 'geojson/russianRegions.json',
                                compareTo: jsonMapSelector.find('compareTo').value().key(),
                                wrapLongitude: -30
                            });
                            newMapHash += 'geojson/russianRegions.json';
                            break;
                        case 'russianRegionsMPT':
                            maps.push({
                                data: null,
                                path: 'geojson/russianRegionsMPT.json',
                                compareTo: jsonMapSelector.find('compareTo').value().key(),
                                wrapLongitude: -30
                            });
                            newMapHash += 'geojson/russianRegionsMPT.json';
                            break;
                        case 'worldCountries':
                            maps.push({
                                data: null,
                                path: 'geojson/worldCountries.json', // 'geojson/countries.json', //'geojson/worldCountries.json',
                                compareTo: jsonMapSelector.find('compareTo').value().key(),
                                wrapLongitude: -32
                            });
                            newMapHash += 'geojson/worldCountries.json';
                            break;
                    }
                }

                newMapHash = MD5.md5(newMapHash);
                if(newMapHash !== this._mapHash){
                    this._mapHash = newMapHash;
                    this._maps = maps;
                    this._isMapsLoaded = false;
                    this.loadMaps();
                }
            } catch(ex){
                console.log('Parse scheme exception!');
                console.log(ex);
            }

            this.getElement().loader();
            dataSource.fetch({readAll: true, reset: true}, function(res){
                try{
                    var regions = {};

                    while(dataSource.next()){
                        for(var i = 0; i < regionsContext.length; i++){
                            var value = regionsContext[i].find('value').value();

                            if(!regions[i]){
                                regions[i] = {
                                    data: [],
                                    showValuesPermanent: regionsContext[i].find('showValuesPermanent').used(),
                                    showEmptyRegions: regionsContext[i].find('showEmptyRegions').used()
                                };
                            }

                            regions[i].data.push({
                                region: regionsContext[i].find('region').value(),
                                value: value
                            });

                            if(!regions[i].maxValue || regions[i].maxValue < value){
                                regions[i].maxValue = value;
                            }

                            if(!regions[i].minValue || regions[i].minValue > value){
                                regions[i].minValue = value;
                            }

                            if(regionsColors[i].simpleColor){
                                regions[i].color = regionsColors[i].simpleColor;
                            }

                            if(regionsColors[i].sourceColor){
                                regions[i][regions[i].data.length].color = regionsColors[i].sourceColor.value();
                            }
                        }
                    }

                    for(var i = 0; i < regionsColors.length; i++){
                        if(regionsColors[i].rangeColor){
                            var rainbow = new Rainbow({
                                minNum: regions[i].minValue,
                                maxNum: regions[i].maxValue,
                                spectrum: [regionsColors[i].rangeColor.startColor, regionsColors[i].rangeColor.endColor]
                            });

                            for(var j = 0; j < regions[i].data.length; j++){
                                regions[i].data[j].color = '#' + rainbow.colourAt(regions[i].data[j].value, regionsColors[i].rangeColor.functionType);
                            }

                            regions[i].defaultColor = regionsColors[i].defaultColor;
                            regions[i].borderColor = regionsColors[i].borderColor;
                            regions[i].borderWidth = regionsColors[i].borderWidth;
                            regions[i].selectBorderColor = regionsColors[i].selectBorderColor;
                            regions[i].selectColor = regionsColors[i].selectColor;
                        }
                    }

                    $this.buildChart({
                        regions: regions
                    });
                } catch(ex){
                    console.log('Load data exception!');
                    console.log(ex);
                } finally {
                    if($this._isMapsLoaded){
                        $this.getElement().loader('hide');
                    }
                    $this._isDataLoaded = true;
                }
            });
        },

        // refresh after data and/or style changes
        buildChart: function(data){
            JSB.defer(function(){
                $this.ensureInitialized(function(){
                    $this.innerBuildChart(data);
                });
            }, 300, 'buildChart_' + this.getId());
        },

        innerBuildChart: function(data){
            if(!this._isMapsLoaded){
                JSB.defer(function(){
                    $this.innerBuildChart(data);
                }, 500, 'mapLoading_' + this.getId());
                return;
            }

            try {
                var tileMaps = this.getContext().find('tileMaps').values();

                if(this.map){
                    this.map.remove();
                }

                var mapOpts = {
                    center: [40.5, -280.5],
                    zoom: 2
                };

                this.map = L.map(this.container.get(0), mapOpts);

                // add title layers
                for(var i = 0; i < tileMaps.length; i++){
                    L.tileLayer(tileMaps[i].find('url').value().value(), {foo: 'bar'}).addTo(this.map);
                }

                // add geojson layers
                for(var i = 0; i < this._maps.length; i++){
                    if(this._maps[i].data){
                        (function(i, data){
                            var tooltipLayers = [];

                            $this._maps[i].map = L.geoJSON($this._maps[i].data, {
                                style: function (feature) {
                                    if(data && data.color){
                                        return {fillColor: data.color, color: data.color, fillOpacity: 0.7};
                                    }
                                    var reg = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data);
                                    if(!reg){
                                        if(data.regions[i].showEmptyRegions){
                                            return {fillColor: data.regions[i].defaultColor, color: data.regions[i].borderColor, weight: data.regions[i].borderWidth, fillOpacity: 0.7};
                                        } else {
                                            return {fillColor: 'transparent', color: 'transparent'};
                                        }
                                    }
                                    return {fillColor: reg.color, color: data.regions[i].borderColor, weight: data.regions[i].borderWidth, fillOpacity: 0.7};
                                },
                                coordsToLatLng: function(point){
                                    if($this._maps[i].wrapLongitude && (point[0] > $this._maps[i].wrapLongitude)){
                                        point[0] -= 360;
                                    }
                                    return L.GeoJSON.coordsToLatLng(point);
                                },
                                onEachFeature: function(feature, layer){
                                    var reg = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data);
                                    if(!reg){
                                        layer.bindPopup(feature.properties[$this._maps[i].compareTo] + ': Нет данных', {closeButton: false, autoPan: false});
                                        return;
                                    }
                                    layer.bindPopup(reg.region + ': ' + reg.value, {closeButton: false, autoPan: false});

                                    if(data.regions[i].showValuesPermanent){
                                        layer.bindTooltip(String(reg.value), {permanent: true, /*direction: "center",*/ interactive: true, className: 'permanentTooltips', opacity: 0.7});
                                        tooltipLayers.push(layer);
                                    }

                                    layer.on({
                                        click: function(evt){
                                            if(!reg){
                                                return;
                                            }

                                            if(evt.target.datacubeOpts){
                                                if(evt.target.datacubeOpts.selected){
                                                    // remove filter
                                                    $this._removeFilter(evt, {
                                                        regionValue: reg.region,
                                                        seriesIndex: i
                                                    });
                                                    return;
                                                }
                                            } else {
                                                evt.target.datacubeOpts = {
                                                    defaultColor: evt.target.options.fillColor,
                                                    defaultBorderColor: evt.target.options.color
                                                }
                                            }

                                            // add filter
                                            evt.target.datacubeOpts.selected = true;

                                            evt.target.setStyle({color: data.regions[i].selectBorderColor, fillColor: data.regions[i].selectColor});

                                            $this._addFilter(evt, {
                                                regionValue: reg.region,
                                                seriesIndex: i
                                            });
                                        },
                                        mouseover: function(evt){
                                            evt.originalEvent.stopPropagation();
                                            this.openPopup();
                                        },
                                        mouseout: function(evt){
                                            evt.originalEvent.stopPropagation();
                                            this.closePopup();
                                        }
                                    });
                                }
                            });
                            $this._maps[i].map.addTo($this.map);

                            for(var j = 0; j < tooltipLayers.length; j++){
                                tooltipLayers[j].openTooltip();
                            }
                        })(i, data);
                    }
                }
            } catch(ex){
                console.log('Build chart exception!');
                console.log(ex);
            }
        },

        // filters
        _addFilter: function(evt, opts){
            var dataSource = this.getContext().find('dataSource').binding();
            if(!dataSource.source) return;

            var field = this.getContext().find("regions").values()[opts.seriesIndex].find('region').binding()[0];
            if(!field[0]) return;

            var fDesc = {
                sourceId: dataSource.source,
                type: '$or',
                op: '$eq',
                field: field,
                value: opts.regionValue
            };

            if(!evt.originalEvent.ctrlKey && !evt.originalEvent.shiftKey && Object.keys(this._curFilters).length > 0){
                for(var i in this._curFilters){
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};
            }

            if(!this.hasFilter(fDesc)){
                this._curFilters[opts.regionValue] = this.addFilter(fDesc);
                this.refreshAll();
            }
        },

        _removeFilter: function(evt, opts){
            if(!evt.originalEvent.ctrlKey && !evt.originalEvent.shiftKey && Object.keys(this._curFilters).length > 1){
                for(var i in this._curFilters){
                    if(i != opts.regionValue){
                        this._deselectFeature(i);
                        this.removeFilter(this._curFilters[i]);
                    }
                }
                var temp = this._curFilters[opts.regionValue];
                this._curFilters = {};
                this._curFilters[opts.regionValue] = temp;
                return;
            }

            evt.target.datacubeOpts.selected = false;

            evt.target.setStyle({color: evt.target.datacubeOpts.defaultBorderColor, fillColor: evt.target.datacubeOpts.defaultColor});

            this.removeFilter(this._curFilters[opts.regionValue]);
            this._curFilters = {};
        },

        _deselectFeature: function(value){
            for(var i = 0; i < this._maps.length; i++){
                this._maps[i].map.eachLayer(function(layer){
                    if(value.indexOf(layer.feature.properties[$this._maps[i].compareTo]) > -1){
                        layer.datacubeOpts.selected = false;
                        layer.setStyle({color: layer.datacubeOpts.defaultBorderColor, fillColor: layer.datacubeOpts.defaultColor});
                    }
                });
            }
        },

        _selectFeature: function(value){
            var regionsContext = this.getContext().find('regions').values();

            for(var i = 0; i < this._maps.length; i++){
                var selectBorderColor = regionsContext[i].find('selectBorderColor').value(),
                    selectColor = regionsContext[i].find('selectColor').value();

                this._maps[i].map.eachLayer(function(layer){
                    if(layer.feature.properties[$this._maps[i].compareTo] == value){
                        layer.datacubeOpts = {
                            defaultColor: layer.options.fillColor,
                            defaultBorderColor: layer.options.color,
                            selected: true
                        }

                        layer.setStyle({color: selectBorderColor, fillColor: selectColor});
                    }
                });
            }
        },

        loadMaps: function(){
            if(this._maps.length === 0){
                this._isMapsLoaded = true;
                return;
            }

            var params = {
                maps: []
            };
            for(var i = 0; i < this._maps.length; i++){
                if(!this._maps[i].path){
                    continue;
                }

                params.maps.push({
                    path: this._maps[i].path
                });
            }

            this.getElement().loader();
            this.ajax('datacube/widgets/map/map.jsb', params, function(result, obj){
                if($this._isDataLoaded){
                    $this.getElement().loader('hide');
                }

                if(result !== 'success'){
                    $this._isMapsLoaded = true;
                    return;
                }

                obj = obj.result;

                for(var i = 0; i < obj.length; i++){
                    $this._maps[i].data = obj[i].data;
                }

                $this._isMapsLoaded = true;
            });
        },

        // utils
        findRegion: function(region, array){
            if(!region){
                return;
            }

            for(var j = 0; j < array.length; j++){
                var name = array[j].region;
                if(!name){
                    continue;
                }

                if(name.indexOf(region) > -1){
                    return array[j];
                }
            }
        }
    },

    $server: {
        $require: ['JSB.Web', 'JSB.IO.FileSystem'],

        post: function(params){
            for(var i = 0; i < params.maps.length; i++){
                if(FileSystem.exists($jsb.getFullPath() + '/' + params.maps[i].path)){
                    params.maps[i].data = eval('(' + FileSystem.read($jsb.getFullPath() + '/' + params.maps[i].path, 'r') + ')');
                    //params.maps[i].data = JSON.parse(FileSystem.read($jsb.getFullPath() + '/' + params.maps[i].path, 'r'));
                }
            }

            return Web.response(params.maps, {mode:'json'})
        }
    }
}