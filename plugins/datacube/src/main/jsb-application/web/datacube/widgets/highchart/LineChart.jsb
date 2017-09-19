{
	$name: 'DataCube.Widgets.LineChart',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Линейная диаграмма',
		description: '',
		category: 'Диаграммы',
		thumb: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlz
                                      AAAOwgAADsIBFShKgAAADGxJREFUeF7tXGlz20YSzZ/dv7DfU1v7YWvPypetTTlxUinn2N04tta2
                                      fOkgJZISSYn3DR7gTVE8QIK4eLztHoK26FA0rcgWZfOxujAABiDQr6enewDMZ7quYzQabWRN5DPD
                                      MHATGFomDNMSZUsfYKAPRXkGtd+Dpv/62pSOYpdWxGSCTvfyY4yBCt0cifKb555MxlAHmr22HBqd
                                      ZzSeYEBLOpKWmjielzOo/T5fDgaqOt2n6WKp9Pp2DdwcIe4DB+pnDYQCp4h6XAhGZUQTCQR9fgzp
                                      xp4/2UYxn8b+wSGOj3wIxhIIhyM43HUhEYsieOJFOpPF0UkQfr8PcTo2ETxFMHAC95EfO/sO6IaF
                                      E58HzfNzJCJxyPkcTgJBpLN5hIJBOJ4/gHP3AI9fHEK3xrS+g3AkCkmSUCyWkYoEEJMKyKTiyKST
                                      CMcy2H35jPankUqnETj1YUQKZvQ6TRw49+H2HCGSkPDc4aD/OKV1Dyy6H0a9mKF1N7x+L2LpEt2b
                                      A/5jN8KJtNjPuDFCmmc1PHmyhX1S3O6DB/jp31v44ecHcO25xf4X288QDx3hyc4Odp0O/PfFHtXd
                                      w8GuG07HLtzHHnz33ffYdbtxRDfo9bnwn3v34Nh7in2XC7uHR9CIkHDQh4OXL/Hof/tIJWJw7u3h
                                      ydOn+OmHH+H3ubH73IEdIqSlmnA+38OOw4mnWz+j3u5D7SnYerSNh/d/QsDrhi+cweHBPjxHLjgP
                                      D+Gh/6k3GuJ6n29voVqrwLG/j2S2iD26rng0BIfzAGdnZ1SviUcPfkG9KuOAiMjIDbjYEMmA9kgH
                                      M9wYIe8KuVy2S69Rrdbt0vWiWq3Zpbej3WnbpevBrSHkU8GGkDXDR0FIXkqiQJ1wLp/HWb2MTLaA
                                      kiyjWK5haKpwuY6Qy2WRzUooFIpUV0YgEEAylcaJ/wRZKYt6rQyJjsvTOSKREAUMSZyeRiDLeRTk
                                      AkVqfVQrFREYFGhbIinZ/369+CgI6XXbpGiZlFdAkZRVrTepH6igTeHuZDIkJctEVJWirRZKRIZc
                                      KiGbyyEj5dDtdimay9NxORQrDVRKRFheQo4IzefyVL+ARvMcLTq2Vq1CLhDprSZKpar979eLjcta
                                      M1xKCCduOiVm6mAAVe1jOBrbezZ4n7iUkL7SpcSHEi1KwMKRMCVgEXsPRIo/HA43co0yHk8N/lJC
                                      LNOg1F6DRun9gFrJomGMDa4fmz5kzbAhZM2wIWTNsCFkzbAhZM2wIWTNsCFkzbAhZM2wIeSGwY+A
                                      vbKO2cjUpYQMjT6aZ03UGmcol0s4b7/jywUbLAW/EJE9txCqmPjqSMHAfMvQCaw+KrUmwuEQUqkk
                                      ApGEvWMzlnVV0U0LqbqGYGmARN1EX7Ne7Vs4lmUaOpQev8aywXXBIp8kNS1EqiaSDRMDy35N5RLM
                                      EVLKS6g3O/baBlcBv/HjyetC+eGKIVrC20i4iDlCanIWxVrLXtvgXcDvkmWoJZyWDHzrVdDWrvb8
                                      aI6Qci6FcmPTQlYFk8DuKEQtIVajlmCu3hIuwxwh9YqMeDJrr22wCEwCR0fB8pSEvnG1lnAZ5gg5
                                      q9dQpzB3g3mw8rkv4I45SiT0rpmEi7hAyASpRBxy+f28TXEboVFnzK3g+5Me8q3pi+HvG2+0kCqy
                                      edle+3TRHoxFa+BOmqOmD4k5QuRCljLyrr326aHcHQoiePmBeXiFC4SMkM/JaDSa9vqnAW4B3BIi
                                      VYNaxvQ7kZvEBULGKMpFdLo9sTYctBFL5hANhxBPxJCUXruy2z500tNYLMSquhjG4PKieh9SFgyd
                                      jCFlJPT6g+nqyESr1RGv5ldrVRQrq7+iv87QqaP+614bO+kBhbD2xjXCXB9SKckfbZTF+QNHTDyk
                                      oZrjD95Zr4o5QlTx7duaXukVwYpnEjh/4IG+dcccIaVsEvny9BOt2w62q+nzBkO4qduCOUIalSIq
                                      9dsfZZU6Q0GEoq9hJ/EWXCCEM/UYcoWivX77UO+NECQiztWbD1+virkWUi4Wbt0DKn4W/TCiYi+j
                                      oabMf+t+GzFHSK1cRKFUsdfWEyZ1zHKbM2pDZNXxugl/Ub/VreIi5lxWLpNGhrL1dYIxpOuiznlG
                                      AEdMt7FvWBVzhHg9bpyd38wDKh5Z5T6AH/jc8/fwMjUQJKTPLJE3fCqYc1lvYjy00FV6UBQF1vDd
                                      XQKHnqzofUnDdmIgErOFQm6HQ1R2O9wiuNy54iPQ246lhJgDBYHTE/EqkNsXsrf+eizLIlEGJnJN
                                      HeHyAFHhXgyEqMyvvUQrGjINbe6YjczLWz9pY0zGI5iWBdM0xHIGf9HA45gqsl8WtnL28+zb13VI
                                      4rZgKSGXoUiJF7uVDRYjGo0Ji+evmDudLmq1GvL5AhIJnowgCLf7CAcHh3CSvPA9w7fnX0AZT/vu
                                      KxFy28Eu9zrAuuMJC46PfXA6D4Ts7zvxr7/8Ac4X2/Ae7CHs9yAW8SKQcuK48ByB+h4SXQ/Sqg8Z
                                      1Y+CFsFx40fok+ko+1oSksvxDAsKWZi+ksRicZyft9BqtVAqlZFKpREMhuDz+W1rdJGyyCJJuPz5
                                      53/E48fbr7YLa7X3eTzH4ji2ZLb0bDYLh+OAzheGy+URdWfi9fogEyF6qwKjdIyqdB/J1B2kn/4O
                                      MekrlIqP0C97MK6GL5dyAOb+3zmCEvd+JUI0TROR16rg5juzSi5zM5akLN2QH4eHbvsGXWLJirl7
                                      91vs7u4Lxawi9+79QMpyC2JyuTzq9QZ6vZ74pJs7zDdhGKZdmgePdHN9Jrnf7xPBbVQqVXz1yx1I
                                      pQwlpeSChk20W2GoshNawQEl/xKNugs1Iwd13MNwYqEylGFNFv/H23AlQthSvv76m1eWMrOyi3Jx
                                      2507d/HPf34pth0eusTMcHyj7GNn0cVvQWd0/qrJr4K2qM9T703oR76eyrytSorMWUlkzJgQyYgi
                                      0znAbuj38Cb/hnz2J0HEuFvhiGd6smvGe3ZZZHFkMSeaC0fqHnVcbWFFrACTLIj3jSYU8tGPVTND
                                      fVhGbzx92WJEP3NioD9W0BzVUB7mSWmpV0pjudP5M16ov8xte1MkM46slRDHftn+E3bUh2KbpEdQ
                                      7PpxVnWiV9iFJXswkr1TKfoxbkoYpncwUpc/lmC70vQJqrUh7txtIxozkEqTZKaSZpFMZFiyJiRb
                                      ePv9hwp5kOn9X4mQVKGHSKonlMkKZgUWrIy44elNJ8WN50lKwxx8ulPI2ahKVlhEycpBtiQ6Ji3q
                                      Zc2kUM5Med90/4Hn6n1R5nNx3fqwhO6oBY1aAv/vRTQ7DQwoNMfIwsRUMRm0MSErZmWOa1GMK0GM
                                      SiekZJ9QtOL+Anr6mSiPS6dUL4OJTi74kodz5YqFwYCjpgnOmhRh5kwkkgbiFySZMpAvmGi1R2h3
                                      KME1JytLrf76fq5EyE7Dge98TvjjLexFc/DGzhBOqEiSRVSq04v/LYil+2hQkmkMdChtDY1yF7LU
                                      QjrSQCJQRfykhJhXRuw4h9hRBj9+k4Jry4forhfR/VPEDmNiXzxQQyLaQTLRRzqtIy+Tf68OsfMg
                                      jkT4HHLRgkTKZYtNZ8ypRZOwchMzIWU/ftpDOKojlzcpeJgq+309WL0SIexeLrqYGbjZdbojFGRT
                                      WE0sQdZD8ni7h63HypxFLRPnVggRtwQpo6JcNtFsWtTJ8ugAeXzi+k1lLOuGuC7v52vTtDFFbyPh
                                      KhRlLBS76Hw3iZUIsQxNzM52VbAyWJkbvB0rEaKrCjXt18PyqjYUEx/rxmgl6akWtAXbLxOlby3c
                                      fpl8DPWHV+3U+30VXaUvZmzm2ZyXj11N0FdV8fId5y4sS0GhZF8dUJ4yrc+5wFJQfZ55elp/mjss
                                      w3hEhkT1ptejz43PLcJoSIZEOQnPt8j1OVldBp7SikP5LtcnvXIutAwmeR5Rn/TJ019x3vNuhJCz
                                      zWRS8B0fi2fvPPlkrXn5vLUTUoCUTuLo+BTFYomy6JK9ZzHGQ+pgUzEc+SOiblbKvPpceBEsU0M2
                                      TfVPYqJ+Mh5f0LO9hj7oIRkNIJTMibkXOQNfhkFfQTR0imRWFufnEYBlULptBCnDz8slFHIpeLwB
                                      e89idFpNBIJhCi5YN0XqL8vv2kImIkNn6xUZLS2XtZDZvOaz+ouy5ovg0eXehfr8X8s6XLb4HrXY
                                      WX2eaG0ZRkQ4T1m46vUMeRI39gR2xj+d1/1y8EezPOkbW/0q12PoU69hGNNXWXk0451d1gbvFxtC
                                      1grA/wEk+DRuEVWbTgAAAABJRU5ErkJggg==`
	},
    $scheme: {
        type: 'group',
        items: [
        {
            type: 'group',
            key: 'mapping',
            name: 'Маппирование',
            binding: 'array',
            items: [
            {
                type: 'item',
                key: 'xAxis',
                name: 'Данные оси Х',
                binding: 'field',
                itemType: 'any'
            },
            {
                type: 'group',
                key: 'seriesData',
                name: 'Серии',
                key: 'series',
                multiple: 'true',
                items: [
                    {
                        type: 'item',
                        key: 'series',
                        name: 'Данные',
                        binding: 'field',
                        itemType: 'string',
                        itemValue: '$field'
                    }
                ]
            }
            ]
        },
        {
            type: 'group',
            key: 'chart',
            name: 'Общие настройки',
            items: [
            {
                type: 'select',
                name: 'Инвертировать',
                key: 'inverted',
                items:[
                {
                    name: 'Нет',
                    type: 'item',
                    editor: 'none',
                    itemValue: 'false'
                },
                {
                    name: 'Да',
                    type: 'item',
                    editor: 'none',
                    itemValue: 'true'
                }
                ]
            },
            {
                type: 'select',
                name: 'Зум',
                key: 'zoomType',
                items:[
                {
                    name: 'Нет',
                    type: 'item',
                    editor: 'none',
                    itemValue: 'none'
                },
                {
                    name: 'X',
                    type: 'item',
                    editor: 'none',
                    itemValue: 'x'
                },
                {
                    name: 'XY',
                    type: 'item',
                    editor: 'none',
                    itemValue: 'xy'
                },
                {
                    name: 'Y',
                    type: 'item',
                    editor: 'none',
                    itemValue: 'y'
                }
                ]
            }
            ]
        },
        {
            type: 'group',
            key: 'title',
            name: 'Заголовок',
            items: [
            {
                type: 'item',
                key: 'text',
                name: 'Текст',
                itemType: 'string',
                itemValue: ''
            }
            ]
        },
        {
            type: 'group',
            key: 'subtitle',
            name: 'Подзаголовок',
            items: [
            {
                type: 'item',
                key: 'text',
                name: 'Текст',
                itemType: 'string',
                itemValue: ''
            }
            ]
        }
        ]
    },
    $client: {
        $require: ['JQuery.UI.Loader'],

        $constructor: function(opts){
            $base(opts);
            this.getElement().addClass('highchartsWidget');
            this.loadCss('Highcharts.css');
            JSB().loadScript('tpl/highstock/highstock.js', function(){
                $this.init();
            });
        },

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
                if(!$this.getElement().is(':visible')){
                    return;
                }
                JSB.defer(function(){
                    if($this.highcharts){
                        $this.highcharts.setSize($this.getElement().width(), $this.getElement().height(), false);
                    }
                }, 300, 'hcResize' + $this.getId());
            });

            this.isInit = true;
        },

        refresh: function(opts){
            if(opts && this == opts.initiator) return;

            var mapping = this.getContext().find('mapping');
            if(!mapping.bound()) return;

            $base();

            // todo: add global filters

            this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(data){
                    console.log(data);
                    debugger;
                });
            }, function(){
                return $this.isInit;
            });
        }
    }
}