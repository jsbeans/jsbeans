{
	$name: 'DataCube.Widgets.PolarChart',
	$parent: 'DataCube.Widgets.LineChart',
    $expose: {
        name: 'Полярная диаграмма',
        description: '',
        category: 'Диаграммы',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iNjAwcHgiIGhlaWdodD0iNjAwcHgiIHZpZXdCb3g9IjAgMCA2MDAgNjAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA2MDAgNjAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGxpbmUgZmlsbD0ibm9uZSIgeDE9IjI5OS4yMjQiIHkxPSIyMS45MzUiIHgyPSIyOTkuMjI0IiB5Mj0iNTc3LjcxNCIvPgo8bGluZSBmaWxsPSJub25lIiB4MT0iNTguMTA3IiB5MT0iNDM4Ljc5MiIgeDI9IjU0MC4zNCIgeTI9IjE2MC44NTYiLz4KPGxpbmUgZmlsbD0ibm9uZSIgeDE9IjU4LjEwNyIgeTE9IjE2MC44NTYiIHgyPSI1NDAuMzQiIHkyPSI0MzguNzkyIi8+CjxnPgoJPHBhdGggZmlsbD0iIzI5M0M1NCIgZD0iTTI5OS4yNiw1ODkuNjAxTDQ3Ljc4Myw0NDQuNzY1di0yODkuODJMMjk5LjI2LDEwLjA0OGwyNTEuNDA0LDE0NC44OTZ2Mjg5LjgyTDI5OS4yNiw1ODkuNjAxegoJCSBNNjguNDE2LDQzMi44MTdMMjk5LjI2LDU2NS44NDdsMjMwLjg0Mi0xMzMuMDI5VjE2Ni44NjRMMjk5LjI2LDMzLjgzNUw2OC40MTYsMTY2Ljg2NFY0MzIuODE3eiIvPgoJPHBhdGggZmlsbD0iIzI5M0M1NCIgZD0iTTI5OS4yNiw0OTQuNDkxbC0xNjguOTU3LTk3LjMyNlYyMDIuNTU0bDE2OC45NTctOTcuMzQ4bDE2OC44NDEsOTcuMzQ4djE5NC42MTFMMjk5LjI2LDQ5NC40OTF6CgkJIE0xNTAuOTgyLDM4NS4yNjNsMTQ4LjI3Nyw4NS40NDlsMTQ4LjI4My04NS40NDlWMjE0LjQyMUwyOTkuMjYsMTI4Ljk4N2wtMTQ4LjI3Nyw4NS40MzRWMzg1LjI2M3oiLz4KPC9nPgo8cG9seWdvbiBmaWxsPSIjQzEzNTMxIiBwb2ludHM9IjI5OC42NDksNjcuMzk3IDE4Ny4xMjYsMjM1LjIzNSAxNDAuNjc1LDM5MS4yMSAzMDEuODY4LDQyMi44MzEgNDk0LjA0NSw0MTIuMTEyIDM2MS45NzcsMjY0Ljg1MyAKCSIvPgo8L3N2Zz4K`
    },
    $client: {
        _buildChart: function(data){
            var baseChartOpts = $base(data);

            try {
                var chartOpts = {
                    chart: {
                        polar: true
                    }
                }

                JSB.merge(true, baseChartOpts, chartOpts);
            } catch(ex){
                console.log('LineChart build chart exception');
                console.log(ex);
            } finally {
                return baseChartOpts;
            }
        }
    }
}