/**
 * @license Highcharts JS v6.0.3 (2017-11-14)
 * Exporting module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function(factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function(Highcharts) {
    (function(Highcharts) {
        var each = Highcharts.each,
            pick = Highcharts.pick,
            win = Highcharts.win,
            doc = win.document,
            seriesTypes = Highcharts.seriesTypes,
            downloadAttrSupported = doc.createElement('a').download !== undefined;

        Highcharts.setOptions({
            /**
             * @optionparent exporting
             */
            exporting: {
                /**
                 * Options for exporting data to CSV or ExCel, or displaying the data
                 * in a HTML table or a JavaScript structure. Requires the
                 * `export-data.js` module. This module adds data export options to the
                 * export menu and provides functions like `Chart.getCSV`,
                 * `Chart.getTable`, `Chart.getDataRows` and `Chart.viewData`.
                 *
                 * @sample  highcharts/export-data/categorized/ Categorized data
                 * @sample  highcharts/export-data/stock-timeaxis/ Highstock time axis
                 *
                 * @since 6.0.0
                 */
                csv: {
                    /**
                     * Formatter callback for the column headers. Parameters are:
                     * - `item` - The series or axis object)
                     * - `key` -  The point key, for example y or z
                     * - `keyLength` - The amount of value keys for this item, for
                     *   example a range series has the keys `low` and `high` so the
                     *   key length is 2.
                     *
                     * By default it returns the series name, followed by the key if
                     * there is more than one key. For the axis it returns the axis
                     * title or "Category" or "DateTime" by default.
                     *
                     * Return `false` to use Highcharts' proposed header.
                     *
                     * @type {Function|null}
                     */
                    columnHeaderFormatter: null,
                    /**
                     * Which date format to use for exported dates on a datetime X axis.
                     * See `Highcharts.dateFormat`.
                     */
                    dateFormat: '%Y-%m-%d %H:%M:%S',
                    /**
                     * The item delimiter in the exported data. Use `;` for direct
                     * exporting to Excel.
                     */
                    itemDelimiter: ',',
                    /**
                     * The line delimiter in the exported data, defaults to a newline.
                     */
                    lineDelimiter: '\n'
                },
                /**
                 * Export-data module required. Show a HTML table below the chart with
                 * the chart's current data.
                 *
                 * @sample highcharts/export-data/showtable/ Show the table
                 * @since 6.0.0
                 */
                showTable: false
            }
        });

        // Set up key-to-axis bindings. This is used when the Y axis is datetime or
        // categorized. For example in an arearange series, the low and high values
        // sholud be formatted according to the Y axis type, and in order to link them
        // we need this map.
        Highcharts.Chart.prototype.setUpKeyToAxis = function() {
            if (seriesTypes.arearange) {
                seriesTypes.arearange.prototype.keyToAxis = {
                    low: 'y',
                    high: 'y'
                };
            }
        };

        /**
         * Export-data module required. Returns a two-dimensional array containing the
         * current chart data.
         *
         * @returns {Array.<Array>}
         *          The current chart data
         */
        Highcharts.Chart.prototype.getDataRows = function() {
            var csvOptions = (this.options.exporting && this.options.exporting.csv) || {},
                xAxis,
                xAxes = this.xAxis,
                rows = {},
                rowArr = [],
                dataRows,
                names = [],
                i,
                x,
                xTitle,
                // Options
                columnHeaderFormatter = function(item, key, keyLength) {

                    if (csvOptions.columnHeaderFormatter) {
                        var s = csvOptions.columnHeaderFormatter(item, key, keyLength);
                        if (s !== false) {
                            return s;
                        }
                    }


                    if (item instanceof Highcharts.Axis) {
                        return (item.options.title && item.options.title.text) ||
                            (item.isDatetimeAxis ? 'DateTime' : 'Category');
                    }
                    return item ?
                        item.name + (keyLength > 1 ? ' (' + key + ')' : '') :
                        'Category';
                },
                xAxisIndices = [];

            // Loop the series and index values
            i = 0;

            this.setUpKeyToAxis();

            each(this.series, function(series) {
                var keys = series.options.keys,
                    pointArrayMap = keys || series.pointArrayMap || ['y'],
                    valueCount = pointArrayMap.length,
                    xTaken = !series.requireSorting && {},
                    categoryMap = {},
                    datetimeValueAxisMap = {},
                    xAxisIndex = Highcharts.inArray(series.xAxis, xAxes),
                    j;

                // Map the categories for value axes
                each(pointArrayMap, function(prop) {

                    var axisName = (
                        (series.keyToAxis && series.keyToAxis[prop]) ||
                        prop
                    ) + 'Axis';

                    categoryMap[prop] = (
                        series[axisName] &&
                        series[axisName].categories
                    ) || [];
                    datetimeValueAxisMap[prop] = (
                        series[axisName] &&
                        series[axisName].isDatetimeAxis
                    );
                });

                if (
                    series.options.includeInCSVExport !== false &&
                    series.visible !== false // #55
                ) {

                    // Build a lookup for X axis index and the position of the first
                    // series that belongs to that X axis. Includes -1 for non-axis
                    // series types like pies.
                    if (!Highcharts.find(xAxisIndices, function(index) {
                            return index[0] === xAxisIndex;
                        })) {
                        xAxisIndices.push([xAxisIndex, i]);
                    }

                    // Add the column headers, usually the same as series names
                    j = 0;
                    while (j < valueCount) {
                        names.push(columnHeaderFormatter(
                            series,
                            pointArrayMap[j],
                            pointArrayMap.length
                        ));
                        j++;
                    }

                    each(series.points, function(point, pIdx) {
                        var key = point.x,
                            prop,
                            val;

                        if (xTaken) {
                            if (xTaken[key]) {
                                key += '|' + pIdx;
                            }
                            xTaken[key] = true;
                        }

                        j = 0;

                        if (!rows[key]) {
                            // Generate the row
                            rows[key] = [];
                            // Contain the X values from one or more X axes
                            rows[key].xValues = [];
                        }
                        rows[key].x = point.x;
                        rows[key].xValues[xAxisIndex] = point.x;

                        // Pies, funnels, geo maps etc. use point name in X row
                        if (!series.xAxis || series.exportKey === 'name') {
                            rows[key].name = point.name;
                        }

                        while (j < valueCount) {
                            prop = pointArrayMap[j]; // y, z etc
                            val = point[prop];
                            rows[key][i + j] = pick(
                                categoryMap[prop][val], // Y axis category if present
                                datetimeValueAxisMap[prop] ?
                                Highcharts.dateFormat(csvOptions.dateFormat, val) :
                                null,
                                val
                            );
                            j++;
                        }

                    });
                    i = i + j;
                }
            });

            // Make a sortable array
            for (x in rows) {
                if (rows.hasOwnProperty(x)) {
                    rowArr.push(rows[x]);
                }
            }

            var xAxisIndex, column;
            dataRows = [names];

            i = xAxisIndices.length;
            while (i--) { // Start from end to splice in
                xAxisIndex = xAxisIndices[i][0];
                column = xAxisIndices[i][1];
                xAxis = xAxes[xAxisIndex];

                // Sort it by X values
                rowArr.sort(function(a, b) { // eslint-disable-line no-loop-func
                    return a.xValues[xAxisIndex] - b.xValues[xAxisIndex];
                });

                // Add header row
                xTitle = columnHeaderFormatter(xAxis);
                dataRows[0].splice(column, 0, xTitle);

                // Add the category column
                each(rowArr, function(row) { // eslint-disable-line no-loop-func
                    var category = row.name;
                    if (!category) {
                        if (xAxis.isDatetimeAxis) {
                            if (row.x instanceof Date) {
                                row.x = row.x.getTime();
                            }
                            category = Highcharts.dateFormat(
                                csvOptions.dateFormat,
                                row.x
                            );
                        } else if (xAxis.categories) {
                            category = pick(
                                xAxis.names[row.x],
                                xAxis.categories[row.x],
                                row.x
                            );
                        } else {
                            category = row.x;
                        }
                    }

                    // Add the X/date/category
                    row.splice(column, 0, category);
                });
            }
            dataRows = dataRows.concat(rowArr);

            return dataRows;
        };

        // Series specific
        if (seriesTypes.map) {
            seriesTypes.map.prototype.exportKey = 'name';
        }
        if (seriesTypes.mapbubble) {
            seriesTypes.mapbubble.prototype.exportKey = 'name';
        }
        if (seriesTypes.treemap) {
            seriesTypes.treemap.prototype.exportKey = 'name';
        }
    }(Highcharts));
}));