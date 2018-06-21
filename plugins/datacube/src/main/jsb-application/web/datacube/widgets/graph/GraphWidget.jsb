{
	$name: 'DataCube.Widgets.GraphWidget',
	$parent: 'DataCube.Widgets.Widget',
	/*
    $expose: {
        name: 'Граф',
        description: '',
        category: 'Диаграммы',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjQ3cHgiDQogICBoZWlnaHQ9IjQ3cHgiDQogICB2aWV3Qm94PSIwIDAgNDcgNDciDQogICBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NyA0NzsiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJidXNpbmVzcy1hZmZpbGlhdGUtbmV0d29yay5zdmciPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE1NCI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczUyIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzUwIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjUuMDIxMjc2NiINCiAgICAgaW5rc2NhcGU6Y3g9IjIzLjUiDQogICAgIGlua3NjYXBlOmN5PSIyMy41Ig0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJDYXBhXzEiIC8+PHBhdGgNCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgaWQ9InBhdGg4Ig0KICAgICBkPSJtIDE3LjU2NywxNS45MzggLTIuODU5LC0yLjcwMiBjIDAuMzMzLC0wLjYwNSAwLjUzOSwtMS4yOSAwLjUzOSwtMi4wMjkgMCwtMi4zNDIgLTEuODk3LC00LjIzOSAtNC4yNCwtNC4yMzkgLTIuMzQzLDAgLTQuMjQzLDEuODk2IC00LjI0Myw0LjIzOSAwLDIuMzQzIDEuOSw0LjI0MSA0LjI0Myw0LjI0MSAwLjgyNiwwIDEuNTksLTAuMjQ2IDIuMjQyLC0wLjY1NCBsIDIuODU1LDIuNjk5IGMgMC40MzIsLTAuNTcxIDAuOTE5LC0xLjA5NCAxLjQ2MywtMS41NTUgeiINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBpZD0icGF0aDEwIg0KICAgICBkPSJtIDI5LjY2LDE1LjYgMy43OTksLTYuMzkzIGMgMC4zNzQsMC4xMDcgMC43NjIsMC4xODQgMS4xNjksMC4xODQgMi4zNDcsMCA0LjI0NCwtMS44OTggNC4yNDQsLTQuMjQxIDAsLTIuMzQyIC0xLjg5NywtNC4yMzkgLTQuMjQ0LC00LjIzOSAtMi4zNDMsMCAtNC4yMzksMS44OTYgLTQuMjM5LDQuMjM5IDAsMS4xNjMgMC40NjksMi4yMTQgMS4yMjcsMi45ODEgbCAtMy43ODcsNi4zNzUgYyAwLjY1MSwwLjI5NSAxLjI2NSwwLjY2MyAxLjgzMSwxLjA5NCB6Ig0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxwYXRoDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIGlkPSJwYXRoMTIiDQogICAgIGQ9Im0gNDIuNzYyLDIwLjk1MiBjIC0xLjgyNCwwIC0zLjM2OSwxLjE1OSAtMy45NjgsMi43NzUgbCAtNS4yNzgsLTAuNTIxIGMgMCwwLjA0IDAuMDA2LDAuMDc4IDAuMDA2LDAuMTE3IDAsMC42ODggLTAuMDc2LDEuMzYgLTAuMjEzLDIuMDA5IGwgNS4yNzYsMC41MjEgYyAwLjMxOSwyLjAyNCAyLjA2MiwzLjU3NiA0LjE3NywzLjU3NiAyLjM0MiwwIDQuMjM4LC0xLjg5NiA0LjIzOCwtNC4yMzggMCwtMi4zNDEgLTEuODk2LC00LjIzOSAtNC4yMzgsLTQuMjM5IHoiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiIC8+PHBhdGgNCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgaWQ9InBhdGgxNCINCiAgICAgZD0ibSAyOC4xOTcsMzcuNjI0IC0xLjE4LC01LjE1NiBjIC0wLjY2NiwwLjIzMiAtMS4zNTksMC4zOTggLTIuMDgyLDAuNDgxIGwgMS4xODIsNS4xNTcgYyAtMS4zNTUsMC43MDkgLTIuMjksMi4xMSAtMi4yOSwzLjc0NiAwLDIuMzQyIDEuODk2LDQuMjM3IDQuMjQzLDQuMjM3IDIuMzQyLDAgNC4yMzgsLTEuODk2IDQuMjM4LC00LjIzNyAwLjAwMywtMi4yOTkgLTEuODI5LC00LjE2IC00LjExMSwtNC4yMjggeiINCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3OCIgLz48cGF0aA0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBpZD0icGF0aDE2Ig0KICAgICBkPSJtIDE0LjM1NywyNS4zNyAtNi41NywyLjIwMSBDIDcuMDI5LDI2LjQxMyA1LjcyNCwyNS42NDUgNC4yMzksMjUuNjQ1IDEuODk2LDI1LjY0NSAwLDI3LjU0MiAwLDI5Ljg4NCBjIDAsMi4zNDUgMS44OTYsNC4yNDIgNC4yMzksNC4yNDIgMi4zNDEsMCA0LjI0MiwtMS44OTcgNC4yNDIsLTQuMjQyIDAsLTAuMDk4IC0wLjAyMSwtMC4xODggLTAuMDI5LC0wLjI4NCBsIDYuNTkxLC0yLjIwNyBDIDE0Ljc0NiwyNi43NTIgMTQuNTEsMjYuMDc3IDE0LjM1NywyNS4zNyBaIg0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4IiAvPjxjaXJjbGUNCiAgICAgaWQ9ImNpcmNsZTE4Ig0KICAgICByPSI3LjI3MDk5OTkiDQogICAgIGN5PSIyMy4zMjMiDQogICAgIGN4PSIyMy44MyINCiAgICAgc3R5bGU9ImZpbGw6IzgwMzMwMCIgLz48Zw0KICAgICBpZD0iZzIwIiAvPjxnDQogICAgIGlkPSJnMjIiIC8+PGcNCiAgICAgaWQ9ImcyNCIgLz48Zw0KICAgICBpZD0iZzI2IiAvPjxnDQogICAgIGlkPSJnMjgiIC8+PGcNCiAgICAgaWQ9ImczMCIgLz48Zw0KICAgICBpZD0iZzMyIiAvPjxnDQogICAgIGlkPSJnMzQiIC8+PGcNCiAgICAgaWQ9ImczNiIgLz48Zw0KICAgICBpZD0iZzM4IiAvPjxnDQogICAgIGlkPSJnNDAiIC8+PGcNCiAgICAgaWQ9Imc0MiIgLz48Zw0KICAgICBpZD0iZzQ0IiAvPjxnDQogICAgIGlkPSJnNDYiIC8+PGcNCiAgICAgaWQ9Imc0OCIgLz48L3N2Zz4=`,
        thumb: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlz
                                      AAAOwgAADsIBFShKgAAADD1JREFUeF7tWwd3E0kS5gfv7m262/du94B7cDzSkmwwSzAmrgO2cV5w
                                      wgbjHHDEEUfJlqNsSTMKpq6/llq0RjUaedd6SPtU75X7c1d/3SVV18x0a/oExeTw8FCWnz59kiVE
                                      1UEUDoVC8TacnauDBINBWdrZOb7iQDg7hzkOxImfLf7lAxKTbPHvBAA0EokklHYYHaZqy9VBTdNM
                                      aef4imNn5zDH0bEdP1v8y2dITLLFvxP4cqGIEEoYrHU6RoeqDWfn6qCYGansHF9x7Owc5jg6tuNn
                                      i3/5DIlJtviXD0hMssW/nLmpu6aHqbP4LL2+e5o67v1XKofbfjtJPaXXyPR5HfvnxrKzc3zdP87O
                                      YY6j45zJkJZr35C5Pk6hzSlH3ZnuoJ5nVxz758ays3N8brY78TkOROGcCUh74Xfsl2+nHSJjnPrn
                                      xrKzc/yMBAQNoEglhbk6hQOBQEo7Vwf1+/0p7RxfcaAISFBkiKe1ioLuMTKWh8l0jcq6zY4aCiwN
                                      kavuCZlrozIg7eLS5dQ/N5adnePr/nF2DnMcHedUhphr72mm4DzN371KYyf/SeuvyuljSQEt3L9O
                                      3rEOctU/lYHJ6QzBlwvFTQUlDNY6HaND1Yazc3VQzIBUdo6vOFCZIRsTtPT0NrkbS8nd8Iw2Wipp
                                      pfw+rf9RRrsDzbT46Cbt9L2UAXl955Rj/9xYdnaOr/vH2TnMcXScv4fE5K/6x9k5zHEgCudEQILh
                                      T1Rz8R/kne+mg8U+R3UP1VN/RaFj/9xYdnaOn5GAAECRMnpph9FhqrZcHRSpmsrO8Q3DpOGFENX0
                                      B2l6fJJ6ym7QO/E42/3sqlTg+xd/lbjk8mVqK7lCb59cpuG6YgoGfI796/jP+Kc4dnYOcxwdZ22G
                                      LG0eUmV3gGbdifVWTnVvSOLV7TC1jYUdZyBXBzmqfxBuLCe+k39ZF5Cdgwg1DoWoby5CAcP5A6uA
                                      AFf1hWj3wJT/Q6xt9RKi46wJCABUpQyXRjpGh6na6nXu2ffUeuM7ar/5o7gp/xAtU2j9w3v0csSk
                                      AyPKT+eSUNUTfeoDXt2KUNOgL8FuxYEDL7Xd/Cl5fBv/Ou6epFDQiPP1PnPukvWm+AyZG+ltd0Db
                                      Cr5N4KczA/UMgZR1BcgM2fu30NdCC52/s+NzOl5bSOuzI3G+3mdGMgRfLhQRQgmDtU7H6FC14ex6
                                      HdYC3Ie0Uzza6nzMJoW5/oGRIXr9isek5tHEOh3Pvmuixa5ydnxOJxtvk2tqIM7X+0zHPyvmODrO
                                      aIZgLYAPtXDvGu0OtsgFnff9a9qfeEPrTWX08cEN2htuI1ftY9kOAdH5fyZDwKnsDVIgGJ1cShSe
                                      6/5DBsTdJBaXQrHtsjfUSrtDLbTb/4qmr56lgw/vaPFhYTwg7g+Dcb7eZ0YyRP4VoioyEZCVimLy
                                      tFfLAKCc/N/P8sMDm64xWqsqOdaAuHYOqXU8lNQWogKCsbG6n7l+jlYrH9BiSaEMzurz4qjP5fe+
                                      TEDQAIpUUpirU/gom4vY4MOHQnbgw7vrn9F2VwN5R1+LgDTTxqsKmTFrLx5R0DMpA6Lz09m8qxD3
                                      DL1eccpF/e5+YluUH97Uy4D45/tps7OWPK2V0if4t93dSJ62apkhy2V3yVgZkQFZHutlx8+5zUX8
                                      YISApKvHlSGQNWTJWDJ/rvvl0e4hDUUiQ4bY8dPxT4nCHAeicEYDMvO2nt4V/0JDZRccdbD0vHzE
                                      1Pl/JSCQyl6TAmair971FWq9/g3rA6ctV78mY3+XHT8jAQGA4i6vl3YYHaZqm1AXDtO+x0U7qwu0
                                      sTgty62VOVla8bbQUNBM4CON433ZjKmvQ1DqnOXNkMwS3Y4y4N1JGr+0YYI8yxafVubJONhL4qOE
                                      puOfFXMcHWc0Q3SsZoadneOnMwNTZQjqnouAYV1ix1dS3uWXpZ2d46fjnxKFOQ5E4Zz5PcQM+Ghj
                                      bpRc4nq+PjMiFbi0eiCOUa5M9IuZPSt9RF9r2xFqEesSrn8dIyCp7Dp/f9MVH0v3RS8lnh4m/95W
                                      Al//TFz/OZMhbbd+orGaApqov+Wo/U/P0lRbpewLrlaKLPGbEdkPN2bk8JPINENizg5ReGtpWj58
                                      cONy2nz1K3GJ3I7zHTNE/hWiKrI1IO2F37NPQXaq/0CFJ662scRLG0Th7YNPwp6ef9PiUXmlt5od
                                      k1NMIs/8eJzvGBAAKFJGL+0wOkzVlquDqpuZnZ3j6zdAzMqQWKv4ZnuSPrRvtleuYwIfByi4PiHr
                                      1E+4il/ebZDf4MeccYVpaD49/z50vJAB8S/0k+keS/ZlJuqff65PlgjI+uxonK9/Jq7/HMoQsWhc
                                      fU9TF0/Ffku/Rx5Ruuqe0lzRJbmwm79zxfYlh5WtMLWPh9kxe2cjtORJN0NqZEDWqh/KrRes8rHA
                                      Xat5ROsvy+nD5dNiYdlFC3evxgNypAyRf4WoimwOCF75WXx8i+Z/+5Xmbl2Sq2rsk61WldDBdLd8
                                      AWJ//A0bEOAq8UTmM6L3EoiyNw2HaN93tIBg68Xz+gVNnvs5uvUi/MJEWXpSRIaYFHO3L0t//96X
                                      LPFFY1sD72Ttj3dSYHFIbm/gC/DP98lNS5RoZ71kAS9vhsUTV/IloxqbkcbRLln4sn0z3fIShcsT
                                      fAosDsr/4c/eSHs8IH/TS1b6N3XDPUpvis+y/Vd0m0m/l1T3hdL2b/ZdIy11VbDjcjpSeYW2Fqfi
                                      fMcMCYvVNBQNUeILt9bp2DCMeBvOztVBsSmZys7xwdnzhalx0KT6J4+p+cb31GLRygvJda+uf0fl
                                      DePk2U3uf2nDpOb3ZrwuGAyL1b6Rln+zrhA979ii5pv/ThqT1YIf6E3JOQqKrFB9qXG4/lFm7cIw
                                      GDqkzokANQ4FaT8QTWmOY/2BSo3jMw+pbsCk/rmQWGd85odF+bzHpEAwWodsqRuI7rbq/eh40xuh
                                      mn6DBufFFxf6bFccvS3H1zHH0XHWXbIikUOaWj2k2oEQfVxPfmHBykm1dYJATK1FxCUpKF+egKDd
                                      6ra4J8WeuHZ9Yg0iMOcfFpNoB7tfBBii2/WxVL1u5zDHgSic0Zt64GCPekuvx89t6Oc4rLjz/hma
                                      GBoRX7BJo0vRWY3ZlKp/4FSbi6rOJ9Yfv1f1UtudM/Exi06flLiu4DSVi0dV3b/eshvUO+ml2n5T
                                      Zofelz5+Ov5ZMcfRcUYzBGc0dqY72ZudVfHebt3FrygU/sxPZwY6bS4qwTZ6ui9cbE29ptaH15LG
                                      0ktIRjJE/hWiKo4zIOon3HQVj7Y6/zgD0l7wLTumnSJbrGPpJSQjAQGAqpTh0kjH6DBVW71OvXWC
                                      BZSxOiKf07HdgO0NrCe2e5rkT7jb7xpkOwRE5x/XJQuKgGBsLCZRxs+XuMdpE/6J9Yyr9omsgy+4
                                      dFnHsvaZc5cslSFYTa83ldLYf36klecPaK7oMrkbfxcr66KMvOSgRG+LgBjLIzRbeEGuosdO/ktu
                                      deAIA86b7E++lQFBoODLF8sQfLlQRAglDNY6HaND1Yaz63UqQ3B+w9NaJd/o2MJuqSgxK1cq7svX
                                      gBAw9ZKDzsdsUpjrH9jusVevgyIgyEx5vqThmZwQG83PpQ94PQl+4PAP9sT0DLH2pdel458V2/mn
                                      cP4eYqNfLEPkXyGq4jgDgjMa7uFG9gyHVb0LPdR87esE/nEExBDm9okwvTj/tRyDG9uqawO1NFBZ
                                      lDSWXkIyEhAAKFJGL+0wOkzVVq8z/Ac0XPdAnt/AuQ11pkM/36Fwj1ivbC5OJ/D1G6DdOfV7Z07F
                                      MUp1Tt2755UbiWVdJi16wrQxPyHHsBtf92+4XtzTjIDj59P94+wc5jg6zmiG6FjNDDs7x9dn01HP
                                      qT+4dEnu7irh+ufGsrNzfG62O/E5DkThnAkI7i/cl2+n3O8hegnhxrKzc/yMBAQNoEglhbk6hY/y
                                      KqmO1SuUdnaOr792iYDg9wVP/px6VBT+khmSP6ceq9MxOlRtODtXB8UMSGXn+IoDlRmSP6eeHMH8
                                      PSSZA+HsHOY4EIVz5ynrev6cOovRYaq2XB0UqZrKzvEVB+r5OMWeU7fi/Dn1mCjM1UGyZQba8bPF
                                      v3xAYpIt/uXMJYuzc9jpkmDHzxb/8hkSk2zxL2fWIZydwxxHx3b8bPEvnyExyRb/8gGJSbb4lzOb
                                      i5ydw06bd3b87PAvSP8HfEezzimbMNEAAAAASUVORK5CYII=`
    },
    */
    $scheme: {},
    /*
    $scheme: {
        type: 'group',
        items: [{
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                type: 'group',
                name: 'Связи',
                key: 'graphGroups',
                multiple: true,
                collapsible: true,
                items: [
                {
                   name: 'Начальный элемент',
                   type: 'item',
                   key: 'sourceElement',
                   binding: 'field',
                   itemValue: '$field',
                },
                {
                   name: 'Конечный элемент',
                   type: 'item',
                   key: 'targetElement',
                   binding: 'field',
                   itemValue: '$field',
                },
                {
                    name: 'CSS стиль связи',
                    type: 'item',
                    key: 'linkCss',
                    editor: 'JSB.Widgets.MultiEditor',
                    description: 'JSON-объект с описанием css-свойств связей'
                }
                ]
            },
            {
                name: 'Способы отображения',
                type: 'group',
                key: 'viewTypes',
                multiple: 'true',
                collapsible: true,
                items:[
                {
                    name: 'Элемент',
                    type: 'item',
                    key: 'element',
                    binding: 'field',
                    multiple: 'true',
                    itemValue: '$field'
                },
                {
                   name: 'Способ отображения ячейки',
                   type: 'select',
                   key: 'view',
                   items:[
                   {
                       name: 'Простые графы',
                       type: 'group',
                       key: 'simpleGraph',
                       items: [
                       {
                           type: 'item',
                           name: 'Заголовки',
                           key: 'header',
                           binding: 'field',
                           description: 'Заголовок внутри вершины'
                       }
                       ]
                   },
                   {
                       name: 'Встроенный виджет',
                       type: 'group',
                       key: 'widgetGroup',
                       items: [{
                           name: 'Виджет',
                           key: 'widget',
                           type: 'widget',
                       }
                       ]
                   }
                   ]
                },
                {
                    name: 'Имя',
                    type: 'item',
                    key: 'name',
                    binding: 'field',
                    itemValue: '$field',
                    description: 'Имя вершин, отображаемое в легенде'
                },
                {
                    name: 'Всплывающая подпись',
                    type: 'item',
                    key: 'caption',
                    binding: 'field',
                    itemValue: '$field',
                    description: 'Надпись, отображаемая при наведении на вершину'
                },
                {
                    name: 'CSS стиль элемента',
                    type: 'item',
                    key: 'nodeCss',
                    editor: 'JSB.Widgets.MultiEditor',
                    description: 'JSON-объект с описанием css-свойств вершин'
                }
                ]
            },
            {
                type: 'item',
                name: 'Максимальное число вершин',
                key: 'maxNodes',
                binding: 'field',
                itemValue: '100',
                description: 'Максимальное отображаемое число вершин'
            },
            {
                type: 'item',
                name: 'Высота ячейки',
                key: 'itemHeight',
                binding: 'field',
                itemValue: '50',
                description: 'Высота объекта вершины'
            },
            {
                type: 'item',
                name: 'Ширина ячейки',
                key: 'itemWidth',
                binding: 'field',
                itemValue: '50',
                description: 'Ширина объекта вершины'
            },
            {
                type: 'group',
                name: 'Дополнительные настройки алгоритма расположения',
                key: 'advancedSettings',
                collapsible: true,
                collapsed: true,
                items: [
                {
                    type: 'group',
                    name: 'Симуляция',
                    key: 'simulation',
                    items: [
                        {
                            type: 'item',
                            name: 'alpha',
                            key: 'alpha',
                            itemValue: '1',
                        },
                        {
                            type: 'item',
                            name: 'alphaMin',
                            key: 'alphaMin',
                            itemValue: '0.001',
                        },
                        {
                            type: 'item',
                            name: 'alphaDecay',
                            key: 'alphaDecay',
                            itemValue: '0.0228',
                        },
                        {
                            type: 'item',
                            name: 'alphaTarget',
                            key: 'alphaTarget',
                            itemValue: '0',
                        },
                        {
                            type: 'item',
                            name: 'velocityDecay',
                            key: 'velocityDecay',
                            itemValue: '0.4',
                        }
                    ]
                },
                {
                    type: 'group',
                    name: 'Коллизия',
                    key: 'collide',
                    items: [
                        {
                            type: 'item',
                            name: 'radius',
                            key: 'radius',
                            itemValue: '1',
                        },
                        {
                            type: 'item',
                            name: 'strength',
                            key: 'strength',
                            itemValue: '0.7',
                        },
                        {
                            type: 'item',
                            name: 'iterations',
                            key: 'iterations',
                            itemValue: '1',
                        }
                    ]
                },
                {
                    type: 'group',
                    name: 'Связи',
                    key: 'link',
                    items: [
                        {
                            type: 'item',
                            name: 'distance',
                            key: 'distance',
                            itemValue: '30',
                        },
                        {
                            type: 'item',
                            name: 'iterations',
                            key: 'iterations',
                            itemValue: '1',
                        }
                    ]
                }
                ]
            }
            ]
        }
        ]
    },
    */
	$client: {
        $require: ['JQuery.UI.Loader', 'JSB.Widgets.Diagram', 'JSB.Widgets.CheckBox'],

        _nodeList: {},
        _namesList: {},
        _isRefreshing: false,

        $constructor: function(opts){
            $base(opts);
            this.loadCss('GraphWidget.css');
            this.addClass('graphWidget');

            JSB().loadScript('tpl/d3/d3.min.js', function(){
                $this._isInit = true;
            });

            this.diagram = new Diagram({
                minZoom: 0.25,
                highlightSelecting: false,
                autoLayout: false,
                background: 'none',
                onInit: function(){
                    $this._diagramInit = true;
                    $this.setInitialized();
                },
                nodes: {
                    graphNode: {
                        jsb: 'DataCube.GraphWidget.GraphNode',
                        layout: {
                            'default': {
                                auto: true,
                                animate: true,
                                nodeExpand: 20
                            }
                        }
                    }
                },
                connectors: {
                    nodeConnector: {
                        acceptLocalLinks: false,
                        offsetX: 2,
                        wiringLink: {
                            key: 'bind',
                            type: 'target'
                        }
                    }
                },
                links: {
                    bind: {
                        source: ['nodeConnector'],
                        target: ['nodeConnector'],
                        heads: {
                            target: {
                                // shape: 'arrow',
                                strip: 0
                            }
                        }
                    }
                }
            });
            this.append(this.diagram);
        },

        refresh: function(opts){
return;
            if(opts && this == opts.initiator) return;

            var source = this.getContext().find('source');
            if(!source.hasBinding()) return;

            $base();

            // cache
            this._isCacheMod = opts && opts.isCacheMod ? opts.isCacheMod : false;

            if(this._isRefreshing){
                JSB().deferUntil(function(){
                    if($this.simulation) $this.simulation.stop();

                    $this._isRefreshing = true;

                    if(opts && opts.refreshFromCache){
                        var cache = $this.getCache();
                        if(!cache) return;
                        $this.createGraph(cache.nodes, cache.links);
                    } else {
                        $this.innerRefresh();
                    }
                }, function(){
                    return !$this._isRefreshing;
                }, 300, 'graphWidget_' + this.getId());
            } else {
                this._isRefreshing = true;

                if(opts && opts.refreshFromCache){
                    var cache = $this.getCache();
                    if(!cache) return;
                    $this.createGraph(cache.nodes, cache.links);
                } else {
                    $this.innerRefresh();
                }
            }
        },

        innerRefresh: function(){
            this.getElement().loader();

            var viewTypes = this.getContext().find('viewTypes').values(),
                viewSelector = this.getContext().find('view').value(),
                viewList = [],
                bindingMap = {};

            for(var i = 0; i < viewTypes.length; i++){
                var viewSelector = viewTypes[i].find('view').value(),
                    binding = viewTypes[i].find('element').binding(),
                    caption = viewTypes[i].find('caption'),
                    name = viewTypes[i].find('name').value();

                try{
                    var nodeCss = JSON.parse(viewTypes[i].find('nodeCss').value());
                } catch(ex){
                    console.log(ex);
                    var nodeCss = undefined;
                }

                if(bindingMap[binding]) continue;

                if(!name) name = binding[0];
                var nClass = 'nodeType_' + JSB().generateUid();

                if(viewSelector.key() === 'widgetGroup'){
                    var jsb = viewSelector.find('widget').unwrap().widget.jsb;

                    viewList.push({
                        binding: binding,
                        jsb: jsb,
                        wrapper: this.getWrapper(),
                        value: viewSelector.value(),
                        caption: caption,
                        nClass: nClass,
                        nodeCss: nodeCss
                    });

                    this._namesList[name] = { binding: binding, type: 'widget', nClass: nClass };
                } else {
                    viewList.push({
                        binding: binding,
                        header: viewSelector.value(),
                        caption: caption,
                        nClass: nClass,
                        nodeCss: nodeCss
                    });

                    this._namesList[name] = { binding: binding, type: 'simpleGraph', nClass: nClass };
                }

                bindingMap[binding] = true;
            }

            this.createLegend();

            var graphGroups = this.getContext().find('graphGroups').values(),
                linksList = [];
            for(var i = 0; i < graphGroups.length; i++){
                try{
                    linksList.push(JSON.parse(graphGroups[i].find('linkCss').value()));
                } catch(ex){
                    console.log(ex);
                    linksList.push({});
                }
            }

            var viewListObject = viewList.reduce(function(obj, el){
                obj[el.binding] = el;
                return obj;
            }, {});

            JSB.chain(viewList, function(d, c){
                if(!d.jsb){
                    c();
                } else {
                    JSB.lookup(d.jsb, function(cls){
                        d.cls = cls;
                        c();
                    });
                }
            }, function(){
                JSB().deferUntil(function(){
                    $this.fetch(viewListObject, linksList);
                }, function(){
                    return $this._isInit && $this._diagramInit;
                });
            });
        },

        fetch: function(viewList, linksList){
            if(this.simulation) this.simulation.stop();
            this.diagram.setPan({x: 0, y: 0});

            var source = this.getContext().find('source'),
                graphGroups = this.getContext().find('graphGroups').values(),
                maxNodes = this.getContext().find('maxNodes').value(),
                itemWidth = this.getContext().find('itemWidth').value(),
                itemHeight = this.getContext().find('itemHeight').value(),
                count = 0,
                links = [],
                nodesMap = {};

            function innerFetch(reset){
                source.fetch({batchSize: 10, reset: reset}, function(){
                    var whileCnt = 0;
                    while(source.next() && count <= maxNodes){
                        whileCnt++;

                        for(var i = 0; i < graphGroups.length; i++){
                            var entry,
                                binding = graphGroups[i].find('element').binding(),
                                sourceElement = graphGroups[i].find('sourceElement'),
                                targetElement = graphGroups[i].find('targetElement'),
                                se = sourceElement.value(),
                                te = targetElement.value();

                            if(!nodesMap[se] && !$this._nodeList[se]){
                                var seEntry = JSB().clone(viewList[sourceElement.binding()]);

                                if(seEntry){
                                    if(seEntry.value){
                                        seEntry.value = seEntry.value.value();
                                    }
                                    if(seEntry.header){
                                        seEntry.header = seEntry.header.value();
                                    }
                                    if(seEntry.caption){
                                        seEntry.caption = seEntry.caption.value();
                                    }
                                } else {
                                    seEntry.header = se;
                                }

                                nodesMap[se] = seEntry;

                                var node = $this.diagram.createNode('graphNode', {entry: seEntry});
                                if(itemWidth && itemHeight){
                                    node.getElement().width(itemWidth);
                                    node.getElement().height(itemHeight);
                                }
                                $this._nodeList[se] = node;
                            }
                            if(!nodesMap[se] && $this._nodeList[se]){
                                nodesMap[se] = true;
                            }

                            if(!nodesMap[te] && !$this._nodeList[te]){
                                var teEntry = JSB().clone(viewList[targetElement.binding()]);

                                if(teEntry){
                                    if(teEntry.value){
                                        teEntry.value = teEntry.value.value();
                                    }
                                    if(teEntry.header){
                                        teEntry.header = teEntry.header.value();
                                    }
                                    if(teEntry.caption){
                                        teEntry.caption = teEntry.caption.value();
                                    }
                                } else {
                                    teEntry.header = te;
                                }

                                nodesMap[te] = teEntry;

                                var node = $this.diagram.createNode('graphNode', {entry: teEntry});
                                if(itemWidth && itemHeight){
                                    node.getElement().width(itemWidth);
                                    node.getElement().height(itemHeight);
                                }
                                $this._nodeList[te] = node;
                            }
                            if(!nodesMap[te] && $this._nodeList[te]){
                                nodesMap[te] = true;
                            }

                            var flag = true,
                                curLink = {
                                    source: se,
                                    target: te,
                                    css: linksList[i]
                                };
                            for(var j = 0; j < links.length; j++){
                                if(links[j].source === curLink.source && links[j].target === curLink.target || links[j].target === curLink.source && links[j].source === curLink.target){
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag){
                                links.push(curLink);
                            }
                        }

                        count = Object.keys(nodesMap).length;
                    }

                    if(count >= maxNodes || whileCnt !== 10){
                        var nodes = [];
                        for(var i in nodesMap){
                            nodes.push({
                                id: i,
                                entry: nodesMap[i]
                            });
                        }

                        if($this._isInit){
                            $this.removeOldNodes(nodesMap);
                            if($this._isCacheMod){
                                $this.storeCache({
                                    nodes: nodes,
                                    links: links
                                });
                            }
                            $this.createGraph(nodes, links);
                        } else {
                            JSB().deferUntil(function(){
                                $this.removeOldNodes(nodesMap);
                                if($this._isCacheMod){
                                    $this.storeCache({
                                        nodes: nodes,
                                        links: links
                                    });
                                }
                                $this.createGraph(nodes, links);
                            }, function(){
                                return $this._isInit;
                            })
                        }
                    } else {
                        innerFetch(false);
                    }
                });
            }

            innerFetch(true);
// нагрузочный тест
            /*
            source.fetch({readAll: true, reset: true}, function(){
                while(source.next() && count <= maxNodes){
                    for(var i = 0; i < graphGroups.length; i++){
                        var entry,
                            binding = graphGroups[i].find('element').binding(),
                            sourceElement = graphGroups[i].find('sourceElement'),
                            targetElement = graphGroups[i].find('targetElement'),
                            se = sourceElement.value(),
                            te = targetElement.value();

                        if(!nodesMap[se]){
                            var seEntry = JSB().clone(viewList[sourceElement.binding()]);

                            if(seEntry){
                                if(seEntry.value){
                                    seEntry.value = seEntry.value.value();
                                }
                                if(seEntry.header){
                                    seEntry.header = seEntry.header.value();
                                }
                            } else {
                                seEntry.header = se;
                            }

                            nodesMap[se] = seEntry;

                            var node = $this.diagram.createNode('graphNode', {entry: seEntry});
                            if(itemWidth && itemHeight){
                                node.getElement().width(itemWidth);
                                node.getElement().height(itemHeight);
                            }
                            $this._nodeList[se] = node;
                        }

                        if(!nodesMap[te]){
                            var teEntry = JSB().clone(viewList[targetElement.binding()]);

                            if(teEntry){
                                if(teEntry.value){
                                    teEntry.value = teEntry.value.value();
                                }
                                if(teEntry.header){
                                    teEntry.header = teEntry.header.value();
                                }
                            } else {
                                teEntry.header = te;
                            }

                            nodesMap[te] = teEntry;

                            var node = $this.diagram.createNode('graphNode', {entry: teEntry});
                            if(itemWidth && itemHeight){
                                node.getElement().width(itemWidth);
                                node.getElement().height(itemHeight);
                            }
                            $this._nodeList[te] = node;
                        }

                        var flag = true,
                            curLink = {
                                source: se,
                                target: te
                            };
                        for(var j = 0; j < links.length; j++){
                            if(links[j].source === curLink.source && links[j].target === curLink.target || links[j].target === curLink.source && links[j].source === curLink.target){
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            links.push(curLink);
                        }
                    }

                    count = Object.keys(nodesMap).length;
                }

                // nodeMap to node
                var nodes = [];
                for(var i in nodesMap){
                    nodes.push({
                        id: i,
                        entry: nodesMap[i]
                    });
                }

                if($this._isInit){
                    $this.createGraph(nodes, links);
                } else {
                    JSB().deferUntil(function(){
                        $this.createGraph(nodes, links);
                    }, function(){
                        return $this._isInit;
                    })
                }
            });
            */
        },

        createGraph: function(nodes, links){
            try{
                var itemWidth = this.getContext().find('itemWidth').value(),
                    itemHeight = this.getContext().find('itemHeight').value(),
                    // simulation settings
                    simulationOpts = {
                        id: 'simulation',
                        alpha: this.getContext().find('simulation').find('alpha').value(),
                        alphaMin: this.getContext().find('simulation').find('alphaMin').value(),
                        alphaDecay: this.getContext().find('simulation').find('alphaDecay').value(),
                        alphaTarget: this.getContext().find('simulation').find('alphaTarget').value(),
                        velocityDecay: this.getContext().find('simulation').find('velocityDecay').value()
                    },
                    // collide settings
                    collideOpts = {
                        id: 'collide',
                        radius: this.getContext().find('collide').find('radius').value(),
                        strength: this.getContext().find('collide').find('strength').value(),
                        iterations: this.getContext().find('collide').find('iterations').value()
                    },
                    linkOpts = {
                        distance: this.getContext().find('link').find('radius').value(),
                        // strength: this.getContext().find('link').find('strength').value(),
                        iterations: this.getContext().find('link').find('iterations').value()
                    };

                simulationOpts = this.prepareOpts(simulationOpts);
                collideOpts = this.prepareOpts(collideOpts);
                linkOpts = this.prepareOpts(linkOpts);

                this.simulation = d3.forceSimulation()
                    .alpha(simulationOpts.alpha)
                    .alphaMin(simulationOpts.alphaMin)
                    .alphaDecay(simulationOpts.alphaDecay)
                    .alphaTarget(simulationOpts.alphaTarget)
                    .velocityDecay(simulationOpts.velocityDecay)
                    .force("link", d3.forceLink().id(function(d) { return d.id })
                        .distance(linkOpts.distance)
                        // .strength(linkOpts.strength)
                        .iterations(linkOpts.iterations))
                    .force("collide", d3.forceCollide( function(d){
                        if(collideOpts.radius){
                            return collideOpts.radius;
                        }

                        if(!itemWidth){
                            itemWidth = $this._nodeList[d.id].getElement().width();
                        }
                        if(!itemHeight){
                            itemHeight = $this._nodeList[d.id].getElement().height();
                        }
                        return (Math.sqrt(Math.pow(itemWidth, 2) + Math.pow(itemHeight, 2))) / 2;
                    })
                        .radius(collideOpts.radius)
                        .strength(collideOpts.strength)
                        .iterations(collideOpts.iterations))
                    .force("charge", d3.forceManyBody());

                links.forEach(function(d){
                    var link = $this.diagram.createLink('bind');
                    link.setSource($this._nodeList[d.source].connector);
                    link.setTarget($this._nodeList[d.target].connector);

                    for(var i in d.css){
                        link.path.style(i, d.css[i]);
                    }
                });

                function ticked(){
                    try{
                        nodes.forEach(function(el){
                            $this._nodeList[el.id].setPosition(el.x, el.y);
                        });
                    } catch(ex){
                        console.log(ex);
                        if($this.simulation) $this.simulation.stop();
                    }
                }

                $this.getElement().loader('hide');

                this.simulation.nodes(nodes)
                          .on("tick", ticked);

                this.simulation.force("link")
                          .links(links);
            } catch(ex){
                console.log(ex);
                if($this.simulation) $this.simulation.stop();
                $this.getElement().loader('hide');
            } finally {
                this._isRefreshing = false;
            }
        },

        createLegend: function(){
            this.legendDiv = this.$('<div class="graphLegend hidden"></div>');
            this.append(this.legendDiv);

            this.legendBtn = this.$('<div class="graphLegendBtn">Легенда &#9660;</div>');
            this.legendBtn.click(function(){
                $this.legendDiv.toggleClass('hidden');
                if($this.legendDiv.hasClass('hidden')){
                    this.innerHTML = 'Легенда &#9660;';
                } else {
                    this.innerHTML = 'Легенда &#9650;';
                }
            });
            this.append(this.legendBtn);

            for(var i in this._namesList){
                var checkBox = new CheckBox({
                    class: "graphLegendCheckBox",
                    label: i,
                    checked: true,
                    onChange: function(b){
                        var elems = $this.find('.' + $this._namesList[this.options.label].nClass);
                        if(b){
                            elems.removeClass('hidden');
                        } else {
                            elems.addClass('hidden');
                        }

                        $this.updateLinks();
                    }
                });
                this.legendDiv.append(checkBox.getElement());
            }
        },

        updateLinks: function(){
            var links = this.diagram.getLinks();

            for(var i in links){
                if(links[i].source.node.getElement().hasClass('hidden') || links[i].target.node.getElement().hasClass('hidden')){
                    links[i].group.classed('hidden', true);
                }

                if(!links[i].source.node.getElement().hasClass('hidden') && !links[i].target.node.getElement().hasClass('hidden')){
                    links[i].group.classed('hidden', false);
                }
            }
        },

        removeOldNodes: function(newNodeList){
            for(var i in this._nodeList){
                if(!newNodeList[i]){
                    this.diagram.removeNode(this._nodeList[i]);
                    delete this._nodeList[i];
                }
            }
        },

        prepareOpts: function(item){
            var defSimulation = {
                alpha: 1,
                alphaMin: 0.001,
                alphaDecay: 1 - Math.pow(0.001, 1 / 300),
                alphaTarget: 0,
                velocityDecay: 0.4
            },
                defCollide = {
                radius: 1,
                strength: 0.7,
                iterations: 1
            },
                defLink = {
                distance: 30,
                iterations: 1
            };

            switch(item.id){
                case 'simulation':
                    for(var i in item){
                        if(!item[i] || item[i].length === 0){
                            item[i] = defSimulation[i];
                        } else {
                            item[i] = Number(item[i]);
                        }
                    }
                    break;
                case 'collide':
                    for(var i in item){
                        if(!item[i] || item[i].length === 0){
                            item[i] = defCollide[i];
                        } else {
                            item[i] = Number(item[i]);
                        }
                    }
                    break;
                case 'link':
                    for(var i in item){
                        if(!item[i] || item[i].length === 0){
                            item[i] = defLink[i];
                        } else {
                            item[i] = Number(item[i]);
                        }
                    }
                    break;
            }

            return item;
        }
    }
}