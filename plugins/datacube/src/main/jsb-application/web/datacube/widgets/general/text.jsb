{
	$name: 'JSB.DataCube.Widgets.Text',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$require: [],
	$expose: {
    		name: 'Текст',
    		description: '',
    		category: 'Основные',
    		thumb: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA4CAYAAAALrl3YAAAABGdBTUEAALGPC/xhBQAAAAlwSFlz
                                          AAAOwQAADsEBuJFr7QAAIMpJREFUeF7d3AewleW1BmA0cRJjSG6cNHOvc8cYNRoUc5OLiRE1xNgT
                                          NbG3KAZHMCgWkCYoigUUEAQUBBF7bxSl995770167/jd/azDd2aHIIebcRKTxezZ5+z97///vlXe
                                          913r34dyuz/dnf6dHns+3ZPWbViX5s6bm5YuXZqGjxieZs2elVgc498+n/kiPf5tAlJsm7duTlOn
                                          TU2jRo9KgwYPSrPnzE6fFv7tz/YU/uVz5GOKz+v9bN4vPo+fi4/9PB7/kgEpdlI2Th88ZHCaM3dO
                                          mj17dho5amQaOmxo6tu3b1qxckUcM3bs2PTRxx9FsCZNnhTHb9m2Jd7j3G07tqUNmzbE79l27NqR
                                          1q5fm1atWRWB9r7zLV6yOG3avGnvUX9r1ri/dRabveQAO9bvX9iAWGBJPpb8y6+xnbt3pnXr16VP
                                          Vn6S5i+YnzZs3JDWrF2T5i+cn5YtXxbvrVy9Mn2y6pO0ZOmStHHTxrR+w/qAslWrV8Xz0mVL0/Tp
                                          09PGzRvjmaMFa8rUKRGslatWRoXNmz8vjRo1Kk2cODENHjw4DRs2LI0YMSINHDgwjR4zOqBxwcIF
                                          sY55C+bF734WQMGeNn1aWrx0cVq4aGGaMWtGGjNmTJx/7bq1sZcdO3YErK5euzr2+YUMyK49u2Iz
                                          nCULPT799NO0/JPlqcsLXdJrr7+WWrdunTp17pSeffbZ1L1H99jM5CmT04BBA6IqXn/j9fRhtw9T
                                          7z6903PPPZdeeumlcACbMm1K6ta9W/wsmF1f7JpeeOGF1OShJunFF19Mbdq0Sd26dYtzbN22NY7Z
                                          vmN7Wr1mdVqzbk1pZUgMjh47bmw8Zs6cGc6dOGliONgeJk+enIYMHRLr8L7AegjKyy+/nDp27Jia
                                          N2+e+vTtE+f8xwek8I/5OZufiyti7ty5sYlBgwYF7IAfWb97z+5w1KQpk9KMmTMiC8HOuAnj0s5d
                                          OwOKBKNDhw6xyee7PJ/ee++9NGHihKiCd959J5zdrl271K9/v7i263Lq8hXL4/NDhw+NapLBAqHi
                                          VMqYsWOiIoYPH56mTZsWn802a86sqIodO3fsfaXEwN2BDL9Z2/gJ49OixYvitX94QDgAvDCblklM
                                          VWzfuT02ZSOOZY4BD6BkyZIlqX///sETMHzy1MlxDMvnXrt2bZo5a2Zk874msB7eE3iWHSHzwRwe
                                          8f7y5csju2U+GLIuGa2y3njjjahGGS+ATzzxRFTY480eTwMHDYz1qlQOB3MjRo6IBFq9enVUp/Nv
                                          27YtTZ8xPYIsASSgBPuHBoT1H9A/NX24aXr5lZcjU0HEhx9+GJt97LHHAvMZh3FCp06dUsfnOkam
                                          v9D1hfTqa6+mLl26pBYtWqQPPvgg7dy5M6Su43FF3bp1A6dtlqPwguDJ6gcffDA1fqBxBAXMcdod
                                          Ne9IU6ZMifdGjiwJlgAIuqCoHlVBOr/08kvptddeS0899VSs5eGHH07Pdng2NWvWLN1zzz1p3Phx
                                          sZ9WrVqlxx5/LCDP8c79zjvvROWqUBBqv84HsrzmPNNnTv/8ApKdmH+XrfHzXojyHseBBkQJ38EA
                                          RQRK3nv/vdS7d+9QMHCb+fyCRQsCq2UYnOUw2Cyz94UEsMapr7zySnr66acDy//yl79EkAWqadOm
                                          ce3OnTunOXPmpMaNG6e333k7AsCZr776atq2fdves6XUoEGDUq6htMCLClIBeOD5558PPnvzzTdL
                                          xcP7778f65RAu3btCthD7ISExABtKtj6wSHC98w/6zeu/3wCEs1YwRkcly0Hx2sUjY0UG4hiK1eu
                                          LJWoCxcujCDJ3hUrVsR5WZ8+fdLFF1+crrzyylTxlIoBFwzmgwWwAs6UP6fij2eeeSa1eqpVVKTg
                                          VK1aNYQAe/311wNK+vbrm956+6307rvvxvOTTz6ZZs+dHRXDbr7p5oAhZv1gbev2rQGfnJrNXrPZ
                                          a6/evUrX/lnGN9mIFxXp+XMJCKMaOBJcyKQePXsE5Ch5G+fExYsXl2Yj523atCkyjAPhMoeBIs5U
                                          EUz2XHD+BZFZrH379mnAwAGhemC+RLAZPYa1yHwO8o8DmWuG5C1gNGGgnxg2fFi8B9KsXfauWbMm
                                          9R/YPz300EPxnozNSeYaXm/ZqmV6uu3TqedHPeN1hgclFP5YtGRRGj9+fARWokkWpE1l4QlS3c9e
                                          A6v9+vWLY1WdvfxdAbFZkJRhiSlZGfbue++mDz78IJ6ZjXzc6+PAffISPPkZbFAnyllmbNiwIX53
                                          HtocLDGQAYOZ6xWb8952220BcQSBjXnGTQJ5ySWXBC85l/5h3rx5UVGugV8kyZHfOjKdeOKJEWQm
                                          kR5/vKQqrr/++uAAJvjgDheBXdC6efPmtHvX7rR0+dKoQjK8SZMmwRUe9ul1HGHfEq/9M+2Dc3AN
                                          LgLVEgXcgeC/KyAcKENlD+jxbJEeNpSrRVnLSE0W7S57NGb6CU7MzRDL/GJzJGw28FClSpWAM5aD
                                          AopUzt133x0VBSoEqE6dOumQcoekn5z0kwgkmKPUPv744yDacePGxbUdd+EFFwYBw3PnUs133XVX
                                          Ouqoo+L8F114UWlicehznZ6LqrYfGQ2aHGfNbNOWTSGnN27cGAG0J9dWqcF7hf1rHvnFXlUtFFnx
                                          yYpICPx40AEpzk6lZoNweNasWXExJav58npWILIfhICwCRMKj8IzaGACxxmUxoABA0JtUFQyt2fP
                                          noHz5CBz3AnHn5AeeeSR+F3AfvmLX4YwQKAUzphxY9JVV10VGar6Kv1vpTj2/kb3p6daP5XOPPPM
                                          IPiTK5wccPHrs3+dzjjjjDiG/enGP6U//uGP6bjjjku1atUKaf6L036Rxk8cH8quXr166YYbbkiV
                                          z6gcAd2ytaSCiQC8kiGVn2S6pCy2DJGOI91Be5bExXxzUAGRxcpVEzZ16tSILB2N6CxIFXCw0pSl
                                          73/wfjz7zKJFi9Lc+XMjgwOnC9ninGTk6NGjw6lvvPlGQElulGCvpk4ZZwM3KkXWU17H/vDYcHD1
                                          6tUDk0njr37lq7EeigpJMxl/6aWXlqql+++/P3jq1IqnBhdku+H6GyJTJYT1sIonVwzhcMstt5TO
                                          uJYsXhJcYd3du3ePrMd3lJ31gyQBVDnz58+Ptc6ZNyeqCZqEvwr7xyV8ooJ27d6VlixbEorroAOy
                                          ecvmKG1DPBH1WlZKTGYoZQ61MPgpSIIwZNiQcIgNCNL+zEIzfMH4ZcuWxbMuvNiO+e9jgohlbLHd
                                          fPPN4UznOLPymSE3ORHH3HHHHSEaGHirdWetdMXlV5RmNbv8j5eHc1TYiy+9GK9V+nmlgNg/3/Ln
                                          cGw2CYAPJCDJS6DgRzLaaMde69evH0Hxfus2rUP9WRsIhjASxvv4Dhq0bds2JgIHDVmip9RlLZXC
                                          4KjBmyEehaD83n777cgw1cRBMl0jhBw1QwZxegWkGzOg8WPTkCFDIsMj22bMiJK2aIuXyZxvJHLv
                                          vfem8887PzBaFTRq3CigEdQYqdiwtdS+t3asj6NUkSz/+f/8PHqOBx54IFX7c7WA1aygJNZZZ54V
                                          vYbzUnIMPDknOK1Ro0ZJ5RZ6D1wDAfRNoNq+oYDKwZWqAUQ5ns80fRQW87n77rsvkvWZZ5+JQPAL
                                          uNY3lRkQma86ZJgPeShLi6YSkB1FkUnJA4aCNRmeSZ/60SipoEaNGgVsyCpduhKn0HBGDBQL5Ehy
                                          BiEWsNyxte6qFRmpvBlhUK9+vfRgkwcjgCyPQbLpaZ5s8WT8DNNlcOXKlaNiim3rjq1B8CBYd63X
                                          UcmTJk2KgDAJc+ONN8baDTpzU2p/ODRb8c85cR2DZ1SbAAmc6vDsd+sURHstOyAFeHJCkhTuebbY
                                          kaNHhlIADRwCf53YhQXQuIGsxBmqCiQxnxNIY49efXrFogSVGNAvmB+RqJpB53WuYhNcyoQRDSpH
                                          EGU3haPXMXH1Wk6MYlPpoIHMpvLIV3s0us/GWctWLIuf7f2zjOyVdCEuCuvFJRDho48+ir336tUr
                                          sp65jkrCwYQQpZXhi9/yOg8KsmAtqMEf2bEiCi/1GT169AiMzCNvZQlDH276cPCJuRXnCR4ig+3F
                                          0jaba3nPNTxwErLzmrkSR955552hzDgdP4BFeK7sZa9GUx8Rk9uhQyO4Nux4Gco42Ro5xeQ4mwrN
                                          arLufXVjYMjJxIdrU1egGPRZGyUnkaAFCAJnuNO1JAjTHphReY1JWImjwvlOXyOZVaL9lxkQJgtE
                                          3CYzLHBKhhsQ9sijj4RjSF84rfkRRHyiUXQcstOZ6tQpMbgKR2l9WWnTlI/3ZNmbb70ZhBcwWdg0
                                          teNYpC7bgo8KFYc4cQkI5CDXBJ2CrppUAyfAcqZy2jxdQsgc6RqktjWrIND1pUO+lB599NFQk3jJ
                                          uUhdhK/Z03uUP6J8euutt9K6desikMWqEKcyUGmt+JI5N0KnPr0uUQmfjEQHDIiDZEImJ0Fxj4IC
                                          ElV8YBblYi5i8dQIp/ssU5bGGgsXLwxn6mZBlKriJNksg/2OaIeNGBZjCefzcJ3Oz3eOoFa/rXpM
                                          dzkedGrSSG7O4CAb8ju4Am0qKztJP1KuXLmAJmuLkc0TzaMKJJc9Go2oyOEjh8exRj7MPgVCUqhI
                                          sy9Q/O0jv12qyJhAv/LqK8E9+Ap531v73pDqkoxfNMz2RyiYtTFVqJpxTpkVgmA5JTKtsEGOFVUd
                                          rwAxysIC3VjCA8jJNz7gpc8KUoYC5mdOUXnIPr+2r0kC0EjVcJ7AMTBoDddde110xAyZWiNnUHGa
                                          LsnjAQ46dOwQTsZfTABA8fbt22P2BFKMMayLA7/7ne+WCgjXN0aBCDjOugT86P88OrVt1zaqQeMr
                                          qfQjhEQMKmfPjqaWwjT2J3zcwyF1H3jwgVijqgsxVOAz5ywzIFll4A+Y5zXGkU7m9UyAsg+MIK2u
                                          XbvGAjVH4Gji5IlRmrLBAvJ5OTmrEZ/lUMeARxsiIFQpw0FZ3XCc6rMJRmZmael8sNv6dMRG5d4X
                                          kCuuuCJmZdnZAuQaOCqv4zdVfhN9SQR4b8ftfDr+DD2swk8qlE6DwZZmV5XrW3LgVRB+xa0gki8E
                                          X1X6XbAlkIAe1Pg9W6iCKVOiVwAJNqQqZBNHyB4Xgce4BI/IHngrOBqu3oWGCmzhkBwQ+h7p6S3i
                                          nnNBlYA0ROp6Ah5zoT17Ako4hOyUUcbjTO+iI5eBqu6aa64pHVVwtirAAZrKyr+qHDwYaqcAe4Kk
                                          98gG9lQHhxIWzm0KfMopp6TDDz88YEoPxfQpeAdsZyMcEL8kkjSuQY0yiELUOK89Gyr6WXLjljI5
                                          hNMsHu4hUo5VbgjXhuGzqaVvYSBSgUGECFw1IHjKx80acOAcMgWeMrh/5RVXBpFTJ/oZA7xHH3s0
                                          BADlhC/c9AFdrqtJRLLI96abboog1KheI9QXXjBs7NK1SzhU41b1lqqh+DjnD5f9IYaO2Zo1bxYB
                                          URHZDP8QuulCttNOOy2dddZZkTTnnXte8Ai78YYb08knnxzDzFNPPTUqn4FtAkUl5FsNKhV3qBA9
                                          DZnMD/aHSwWKvw8ckEIm4gBE7EMcD7thuIs5gd5EVtPZAiSjs1mM43CMTEWO8BcP0fDgQD9iRK6C
                                          OBsROk7AES78paBsRtUIAOyXYTVr1oyAq1TX8vtVV14VZEk1mVuBLZ277DRAPPq/jo61gdnyXy8f
                                          AfnhMT+MDGWc9PWvfT3gg0lAI/psDzV5KFW9uWr8fO0116YjvnZEat+ufTr99NPTJb+/JF5XIZJR
                                          Akkm0AQdTCQkGRizPsnJXwSLSiozIB4Zs/dnWZcLFAiAhT6jOhjcVYbKWIYQAojMzwKTMVsGGUFo
                                          8gSYVicgfI5q4kwzLSXuASKosdq1a8dsSi8hYJQNDN+6dWtArMEjeCGtTYUF9rDDDotr6taP/I8j
                                          U8MGDdNXDvtKqCsG+n566k/jZzB37DHHppNOOin6kpq314zggVl8dughh0bQGVhyPoNEEJkDXJbh
                                          W+Mn/FlmQBjilDWyEgFZOLKjahh1FKpnxrQgNqqGpONE1WUs7v1M/PszQXNOvJAtqy7NmgDrekEB
                                          FUOOyizPHOGLChdeeGFUFgKtdmu11LJly6hmQTr//POj36CsVITgHHH4EdHf4ESv5Y76xBNOjKAw
                                          6/nOt7+Tzj3v3HR7jduDaygo4mXLli0xwheobFV+XSWyn59APSGTpTN/4kbjH1XtlgPFtWzpshAx
                                          GkmwWmZAOBZmyjI6nM52vwGma2yoE9NMXTtowyGylEzVqeshQBIHIn4QZkwAO2EuaKJelLJNauIc
                                          gws0Xd16dAvJqiKQPi6y0WKZLBs5lOJyPsFXZaqQMHA+QXXdb33zW8Ej3/vu9yIJQO2h5Q4NKFSR
                                          gqOLZ4TLGb86IxzMXMf3u8AgA7G33357/MxurXZrzN0EQwJQmSr41ltvDegjNjS74PWySy8L/zHn
                                          gUT2dMCAiBhFReXoJfCAjHVCFaNxk4WcRd1QVcgZuYMhGUh5gSMmSGZXjmvQoEF0zsjY3TtjBzeg
                                          OP/aa68NfDWiMNCjZPCCYJgmZyMzrS1PDzhM8vhdcK0NxGUTsON/dHw4/bLLLovXVPo3yn8jUEDC
                                          fflLXw44ymZ9xcNIszIV5hgK0/Qg2+m/PD2mFpQT0aEfU1Em1qCO/Fa5Eq1atWohiFzTjS9WZkA8
                                          GDwmNxcsWJDGjB4TG41xSqFJgrO5F5CByFAzmbnHcHD37t3RVyBxCyKJc/aQyRSJqlKFSJCOl53I
                                          LlRWwVmCIki+bGZd+Ek1UlOxyUJyyD4OwSecgj/AlPXDZ+ZeiYDotrP96Ngfpfr16seU19SX5QpU
                                          2Ui+foP6AU8VKlSIz1NjJP05vzknxI9G0OvIWbXiQ5+lzFSnfTIBtWbJZc4m6ZyH2VeZAfEwBpeJ
                                          tLWoCwZlo8HyviDAYmqK0y0WVGgkOYZzOQd8cSqJZxBJ9nIUchdkwsA43T0SBkbIX4527TzY8xnr
                                          kanwV1WS3aCR5HZuMEjZuNPovJxkH/qKDBUQgJHe5cuXKC7BZ5IsTwZkccWKFVOlSpWiegWc/e7i
                                          38VnfnDUD+K5ZYuW8TpOZPYclVLwlYSU1GBagIgWNnP2zPi+GOPLMiHLySkAJ3UiAQENYIG0Q6Kt
                                          WraKLBVpMIRjZDS5p7ewMUHTPzDnUEWwWNCQcdbwxcbxNrI/swakiwcIDeMLG/a6GZd1EQEMl7hJ
                                          5iG43nPNXDUShUNBS+7g2dVXX12qvlg+PpuEMKTUV4DwYuMz18VpphXg3l5UuGpWIaqZVHergvF5
                                          maSO0BCVLFSWvm0uQ1atWhV8gE/yWN0FwQNsFzwKyG1bpEp36zlkIOzEI4IlgM6v+fQz2OMUGY0Y
                                          NZVgkYrT5atAxwoE43Rjh+x8Rjy4RjbQwTkZNjWoxcdLOl+UUNWUIbjxPpyP/RSkKbnu/oy9CCZR
                                          I4lkt+csW8le0G5PIFgy+t2+VIuAqHLy3vuqPluZHOIC5BisE0Ub03NYVDZQAsIoFJCQM90FNUKO
                                          p3rMpQRPg2mR5LRn78VwrrBJcJZ7EFMBDZgkoHpAGcloHRSZtVifwOAyvKQnwEd5wgvC8qwpm/UR
                                          HCrTPkBcFgXZVLPJdZ3adSK5CATrkih6DNfHf2SwyYJEku1ux8p871tLfG+3UEF4EaQ61lTCz9DB
                                          +vVyMZwtoAbeLZNDRM0GcxNnA/kuHkhTikYUhoLwWmbLMpNfmxcoGb6vOa8FOHccX8hIz8znBChu
                                          NBXw37cFQSaIgP9ueAlItipnVwn1JQHAKEP41193fQwTVQXT9YNTk2hCA8F/8xvfTMcfd3yoR2s1
                                          dlFNTDKoBKRfrLTcFeRwfCJ5ehe4So9BkUke/RjuQ+QChwvtR2WAdmhjwgzOJJD3JD0+LLf3Gn9l
                                          +2KlbAoCLRCiLIh7HEVTT0ZeagBHjBoRpGpsQAkxcDN67OhwOHiTZZ5VjIW4T+B+AGJnuEYl6REY
                                          waAh9LpjZCvLSkjT5itCeiJmbRQTeHAfRNZyxLnnnhtfnDNekZnHHXtckCrZrU/Q+evmv//978cX
                                          OHw73teNSFtfEwJfLN9sM8pR3c4lIUAh+OSffgP6RfJ4D7R7TZKC6TxsZHgQ3EGa9evXp3KcpNz9
                                          3YKTmymJuqghKycFRSaSysp8iROfePKJcIDOlPNxjSmvgJGrFihzbEyG+96uxfh2CKhiFqhHwSu5
                                          OqwBQRbfSyeJEa97C6pGc6pzz/0N69ypczrnnHOCc6iin/3sZ5HVeEAjKQi5UklbPKhvyIoo/r6j
                                          cG6GD014BfLHJ/w4XsNLeiVGshf3KtkksvXvDxFUIHLneDCYm02/k+Y+x8ppxpQ1EjIVlS02Cv80
                                          PhzFubJVgDj1mquviU6aY30fSgcNE8EOqed+se/ZItHBQ0u+nQd6QEfuC2RNw/sbhqOpsbjHXTgP
                                          iBBsHOK1+GzhPKqDEBBssPP73/0+uItYUOrM3Ou35/w2mkMOLjZByDfDTGmR8aWXXBq/M5PiPJfK
                                          prHNQeCTpo+UyFMJSs3JftmOtH1ZAYrYi94pOzw3pvxinSrcfXQ+ANn5fTLbo5wNwH0R9KUBOIzk
                                          XFQmyBrqhky9/PLLwyEy2hgZ2SFUIxKqCkSZz2QoOZBRUP6IBRdYJIiiOHzdSGV5n9rxzPCKKbFn
                                          fOYPKJkRvO9rGTjCfKMOFeYGE6VV846aqdnjzWIKoDs3yDOVNXj0JwpMZquKiy+6OBIAJPkusb3b
                                          L4Mc4KzYcAPVqYJJfteQyF5TqQLk8/nvID00pMQEngLx9qfafV7/Vu6UCqeEQ9wAUgFI0UyqRcsW
                                          MRirXad2qIa69erGl9Sc1Ou57ScHfRlNhqiQPJo3A3NRr3G67OTQ3BAxgQcZmRNkWzRN+8ABaKSM
                                          Mm/pDWh5JjiNGzWO7/WeffbZcV3GGWZIbpXiQGYf99W5L0iazK1Xt+Tbj8QLA9NmU756KkDmc3iO
                                          CXBWlyF29o6VwI91SwKSV+XYKyQInims25ratG4TPZBrGCwKBPjWChAE9ubLduVAEGmbs0R2ysKp
                                          06eGmqA8dMWqwjGqAMmCFApJqWdOcGFQpGxBkXMjLK/pnJ3PwyzHDRqZk5UIzoCjcaewQIBM6Zse
                                          e3ZOZb52zdoIPmgjBATdGgmJHFjrdA6Oc31wKSgSgxzHgX6GAjkYjHNdQ1JACuZcnO947xeba6iI
                                          /LpzSRbw5HgEL+nsyzmZXsSaikdO2SRnqCwXLV7Y/sxmEb/shd0i6sJwG2lmWZzhSvnhH+MVDtRj
                                          5MZMs6jSNFwSIKsXplqVPvw2BQVDyNlEWTBVsEzzszG5RFGVKloiZRPsvEZBWDB/QYn6KyihYuNs
                                          +9F3SCjZCz5VYCZahkNxml7Ez/xFfuPO7DucIDhaACbBJZg1MC2CKstVx/jL+Tz7V2YfwixYk8VJ
                                          lIfv1BqQadTIURtArt6DmR7eV/LFEIWnZDSukF1G2fuaQNk46DApZriGg9xy9Xkb04ypwIDIQrOo
                                          7D2QqRtIbrnKRtVo+kwCe/26666LABEG/tSAqVbJJjF11BLEdJvj/GkdNSjjVQPBQfz4W5OGDRtG
                                          gPQTjtHwgXEzOsLCvRgJ5rMkrc+gA9dyM09ySizr4kNWdmNYyCDZL8tlIALq3bd33IKV8crPiTU9
                                          sgt25+CABmLAOTxUF5nHIYJMOblGzJ8K3SqTcarJZjMUcjRM5lQCQzPlOMGT8a6pj8BXyFrQyGx9
                                          hf8MwIbdFPJ3is5NYZHihorWImslkMCDR9cQMERu3xytku+5+55YF8iO7wB07BCfdSy5bxpMlJhP
                                          4SiNaIMGDSJxCASioF37dgHfoJ6Mp/Tc8JLYrMyAeCilbLnlP5Bxev5M4Qyl52ECA59HjhgZ9weU
                                          uOCpAMoGjsJ2mWWEgRQpH0FjW7ZtCfmYA1hsKtA9ecbhvhXPVAhCx1e+vAAKmTEGtaiqDEMpHQ7V
                                          53A4yat68JfRCESQfDI+OvBC46g6BJBzfV7FIHMKTEIJTPee3UOy632oLNUjMSSR64E6n2UHFZDi
                                          R5Bc4d/+3ssP9lnHcLis9FAxqgTpU216B/whW2Uqp+AOGaopxR2yUSaDFc7xzCmqExbrnWTmXXff
                                          FU7SqXuWlZ4Fh2M5wKgDvLpnQSERL5STNREKHIVHqEPBzs2qSpQkEkOC5u8uZxWYzZwOf1BUEo46
                                          JdeJIXtSGQwCgSy+/X8H5PN4FJsAWRBowzcwXBVwgIWrEo6wGVBDEFg8PqP0BFG5czIo8wUH2G36
                                          wPALuDJyB3v5L2xNF6rXqB4BKssoNGtTyWZqDGHvz+zDlzgEDU8IGPN5wSGRNc75NkZOcMY3/5SA
                                          FD/yYmzEghGp2Rd+4gCqihNyVfmMIMrmfIeSApSNXvssw3/Ob8Se+xKGA3EdGW28Dk6pw8yZZL5q
                                          lf0gDIRyOP7ymjuEOEvFCC5VqcJ8ltTNcldS5SqyR3CW+60clH9ahez7YPS67KWKOEBGy3xwhEQZ
                                          rOcUDogOt+BE4/ccVOZ8Nqa6fFa1MRDka0jUHXkrEIzDBVXGchr+8j4ZTRERDDiHGjKrIyJUqRke
                                          CFS1+EVTjTeYvfhjV9+4ydNe1Wu9ApVlr3VqIvO9HVX0hQiIh8XJfM2SjPfsd6/Dcs84Q9UgQ8Rr
                                          o6Sx6mD5XL4hz5GqrNjARYy6C4HSDOMOMGaeJEATJk2IjluVuI+CgKknjhcAUElmg0pkL3B6Gz/j
                                          LSMoplKs0UMlOY+fBULPlm/U4UhQK8mQu3nZFyYgHpyeS9ezf17Pz9lwjqyS1Ui5uIFjRi3+XiV3
                                          y6YGZKsHhcO5SJWQCKlbcLBvtZhhyWgVmrNYUqgyg0RmHSqKUXqq13VAmQfuoLRku0RSAcVrxxuO
                                          ExCiAHzqy6hA5/lCBeRgH9kEJvOBjPeIkUThoV/ibPrfzSq3nOE5h4EzfZAM93nY7tnn/QxynDsn
                                          xWcZ6KL6wJX7La5JCeI2JrH8EwTnVbUgE1/uz+ztXzIgHjbq1qjbBhrHdm3bRQNGfbl3gZQ53Wvu
                                          aO5r+MLtZSQL2pCyuVke5TPX0TcRC9SazDY69znTAn+4JMAUl2A7J4m8fVdJVXgwnJen5s2bNY+1
                                          uWtJbeFFVRafK1TTv2xAOEojKePy3TpOhc8yfF/LnyGnA8oKXKKH8eBQ7+GtDI+l1yn8A42UGJ7B
                                          Q6ayB1J0f/X5wnlVnnM4PwWnX8pKC1/hDtw0e87s9H/GfeIREh4zMwAAAABJRU5ErkJggg==`
    	},
    $scheme: {
        type: 'group',
        items: [
        {
            type: 'group',
            name: 'Источник',
            binding: 'array',
            key: 'source',
            items: [
            {
                type: 'item',
                name: 'Текст',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field',
            },
            {
                type: 'item',
                name: 'Разметка',
                binding: 'field',
                itemType: 'string',
                itemValue: '$field',
            }
            ]
        }]
    },
	$client: {
		highlights: [],

		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('textWidget');
			this.loadCss('text.css');
		},

		refresh: function(){
		    var source = this.getContext().find('source');
            if(!source.bound()) return;

            $this.getElement().loader();

            if(source.data()){
                $this.update();
            } else {
                source.fetch({batchSize: 1}, function(){
                    source.next();
                    $this.update();
                });
            }
        },

        update: function(){
            var sourceValue = this.getContext().find('source').value();

            this.text = sourceValue.get(0).value();

            var annot = sourceValue.get(1).value();
            if(!JSB().isArray(annot)) annot = [annot];

            if(annot.length > 0){
                try{
                    this.highlights = [];

                    for(var i = 0; i < annot.length; i++){
                        var h = JSON.parse(annot[i]);

                        this.highlights.push({
                            id: h.id,
                            docId: h.document_id,
                            offset: h.start,
                            length: h.end - h.start + 1
                        });
                    }

                    this.highlights.sort(function(a, b){
                        return a.offset - b.offset;
                    });
                } catch(ex){}
            }

            this.redraw();

            $this.getElement().loader('hide');
        },

		redraw: function(){
			var self = this;
			this.getElement().empty();

			// inject highlight marks
			var html = this.text;
			var deltaOffset = 0;
			var lastSize = html.length;

			for(var i = 0; i < this.highlights.length; i++){
				var h = this.highlights[i];
				var fromIdx = h.offset + deltaOffset;
				var toIdx = fromIdx + h.length;
				// do replace
				var prefix = html.substr(0, fromIdx);
				var postfix = html.substr(toIdx, html.length - toIdx);
				var highlightStr = html.substr(fromIdx, toIdx - fromIdx);
				html = prefix + '<span class="highlight" hid="'+h.id+'">' + highlightStr + '</span>' + postfix;
				var newSize = html.length;
				var oddSize = newSize - lastSize;
				lastSize = newSize;
				deltaOffset += oddSize;
			}

			var pArr = html.split('\n');

			for(var i = 0; i < pArr.length; i++){
				var pTxt = pArr[i];
				if(pTxt.trim().length === 0){
				} else {
					var pElt = this.$('<p></p>').append(pTxt);
					this.append(pElt);
				}
			}


			this.find('span.highlight').click(function(evt){
				var hElt = self.$(evt.currentTarget);
				var hid = hElt.attr('hid');
				self.publish('activateHighlight', hid);
				self.activateHighlight(hid);
			});
		},

		activateHighlight: function(hid){
			var hElt = this.find('span.highlight[hid="'+hid+'"]');
			if(hElt.length === 0){
				return;
			}
			this.find('span.highlight').removeClass('active');
			hElt.addClass('active');
			return hElt;
		}
	}
}