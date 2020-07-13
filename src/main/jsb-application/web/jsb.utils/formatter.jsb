/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

// based on Highcharts ver 6.1.0
{
	$name: 'JSB.Utils.Formatter',
	$singleton: true,

	$constructor: function(){
	    this._lang = {
            decimalPoint: (1.1).toLocaleString()[1],
            thousandsSep: (1.1).toLocaleString()[1] === ',' ? ' ' : ','
	    };
	},

	_lang: {
	    invalidDate: 'Неверный формат даты',
        shortMonths: [ "Янв" , "Фев" , "Мар" , "Апр" , "Май" , "Июн" , "Июл" , "Авг" , "Сен" , "Окт" , "Ноя" , "Дек"],
        thousandsSep: " ",
        shortWeekdays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
	},

    _pick: function () {
        var args = arguments,
            i,
            arg,
            length = args.length;

        for (i = 0; i < length; i++) {
            arg = args[i];
            if (arg !== undefined && arg !== null) {
                return arg;
            }
        }
    },

    /**
     * Formats a JavaScript date timestamp (milliseconds since Jan 1st 1970)
     * into a human readable date string. The format is a subset of the formats
     * for PHP's [strftime](http://www.php.net/manual/en/function.strftime.php)
     * function.
     *
     * @function _dateFormat
     *
     * @param {string} [format]
     *        The desired format where various time representations are
     *        prefixed with %.
     *
     * @param {number} timestamp
     *        The JavaScript timestamp.
     *
     * @param {boolean} [capitalize=false]
     *        Upper case first letter in the return.
     *
     * @return {string}
     *         The formatted date.
     */
    _dateFormat: function (format, timestamp, capitalize) {
        if (isNaN(timestamp)) {
            return this._lang.invalidDate || '';
        }

        format = this._pick(format, '%Y-%m-%d %H:%M:%S');

        var time = this,
            date = new Date(timestamp),
            parsedDate = this._parseDate(date)
            lang = this._lang,
            langWeekdays = lang.weekdays,
            shortWeekdays = lang.shortWeekdays,
            pad = this._pad,
            // List all format keys. Custom formats can be added from the
            // outside.
            replacements = {
                // Day
                // Short weekday, like 'Mon'
                a: shortWeekdays ?
                    shortWeekdays[parsedDate.day] :
                    langWeekdays[parsedDate.day].substr(0, 3),
                // Long weekday, like 'Monday'
                A: langWeekdays[parsedDate.day],
                // Two digit day of the month, 01 to 31
                d: pad(parsedDate.dayOfMonth),
                // Day of the month, 1 through 31
                e: pad(parsedDate.dayOfMonth, 2, ' '),
                w: parsedDate.day,
                // Week (none implemented)
                // 'W': weekNumber(),
                // Month
                // Short month, like 'Jan'
                b: lang.shortMonths[parsedDate.month],
                // Long month, like 'January'
                B: lang.months[parsedDate.month],
                // Two digit month number, 01 through 12
                m: pad(parsedDate.month + 1),
                // Month number, 1 through 12 (#8150)
                o: parsedDate.month + 1,
                // Year
                // Two digits year, like 09 for 2009
                y: parsedDate.fullYear.toString().substr(2, 2),
                // Four digits year, like 2009
                Y: parsedDate.fullYear,
                // Time
                // Two digits hours in 24h format, 00 through 23
                H: pad(parsedDate.hours),
                // Hours in 24h format, 0 through 23
                k: parsedDate.hours,
                // Two digits hours in 12h format, 00 through 11
                I: pad((parsedDate.hours % 12) || 12),
                // Hours in 12h format, 1 through 12
                l: (parsedDate.hours % 12) || 12,
                // Two digits minutes, 00 through 59
                M: pad(time.get('Minutes', date)),
                // Upper case AM or PM
                p: parsedDate.hours < 12 ? 'AM' : 'PM',
                // Lower case AM or PM
                P: parsedDate.hours < 12 ? 'am' : 'pm',
                // Two digits seconds, 00 through  59
                S: pad(date.getSeconds()),
                // Milliseconds (naming from Ruby)
                L: pad(Math.floor(timestamp % 1000), 3)
            };

        // Do the replaces
        replacements.forEach(function (val, key) {
            // Regex would do it in one line, but this is faster
            while (format.indexOf('%' + key) !== -1) {
                format = format.replace('%' + key, typeof val === 'function' ? val.call(this, timestamp) : val);
            }
        });

        // Optionally capitalize the string and return
        return capitalize ?
            (format.substr(0, 1).toUpperCase() +
                format.substr(1)) :
            format;
    },

	// H.numberFormat
    _numberFormat: function (number, decimals, decimalPoint, thousandsSep) {
        number = +number || 0;
        decimals = +decimals;

        var lang = this._lang,
            origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
            strinteger,
            thousands,
            ret,
            roundedNumber,
            exponent = number.toString().split('e'),
            fractionDigits;

        if (decimals === -1) {
            // Preserve decimals. Not huge numbers (#3793).
            decimals = Math.min(origDec, 20);
        } else if (!JSB.isNumber(decimals)) {
            decimals = 2;
        } else if (decimals && exponent[1] && exponent[1] < 0) {
            // Expose decimals from exponential notation (#7042)
            fractionDigits = decimals + +exponent[1];
            if (fractionDigits >= 0) {
                // remove too small part of the number while keeping the notation
                exponent[0] = (+exponent[0]).toExponential(fractionDigits)
                    .split('e')[0];
                decimals = fractionDigits;
            } else {
                // fractionDigits < 0
                exponent[0] = exponent[0].split('.')[0] || 0;

                if (decimals < 20) {
                    // use number instead of exponential notation (#7405)
                    number = (exponent[0] * Math.pow(10, exponent[1]))
                        .toFixed(decimals);
                } else {
                    // or zero
                    number = 0;
                }
                exponent[1] = 0;
            }
        }

        // Add another decimal to avoid rounding errors of float numbers. (#4573)
        // Then use toFixed to handle rounding.
        roundedNumber = (
            Math.abs(exponent[1] ? exponent[0] : number) +
            Math.pow(10, -Math.max(decimals, origDec) - 1)
        ).toFixed(decimals);

        // A string containing the positive integer component of the number
        strinteger = String(parseInt(roundedNumber));

        // Leftover after grouping into thousands. Can be 0, 1 or 3.
        thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

        // Language
        decimalPoint = this._pick(decimalPoint, lang.decimalPoint);
        thousandsSep = this._pick(thousandsSep, lang.thousandsSep);

        // Start building the return
        ret = number < 0 ? '-' : '';

        // Add the leftover after grouping into thousands. For example, in the
        // number 42 000 000, this line adds 42.
        ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

        // Add the remaining thousands groups, joined by the thousands separator
        ret += strinteger
            .substr(thousands)
            .replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);

        // Add the decimal point and the decimal component
        if (decimals) {
            // Get the decimal component
            ret += decimalPoint + roundedNumber.slice(-decimals);
        }

        if (exponent[1] && +ret !== 0) {
            ret += 'e' + exponent[1];
        }

        return ret;
    },

	// H.formatSingle
    _formatSingle: function (format, val, time) {
        var floatRegex = /f$/,
            decRegex = /\.([0-9])/,
            lang = this._lang,
            decimals;

        if (floatRegex.test(format)) { // float
            decimals = format.match(decRegex);
            decimals = decimals ? decimals[1] : -1;
            if (val !== null) {
                val = this._numberFormat(
                    val,
                    decimals,
                    lang.decimalPoint,
                    format.indexOf(',') > -1 ? lang.thousandsSep : ''
                );
            }
        } else {
            val = time.dateFormat(format, val);
        }
        return val;
    },

    /**
     * Left-pad a string to a given length by adding a character repetetively.
     *
     * @function _pad
     *
     * @param {number} number
     *        The input string or number.
     *
     * @param {number} [length]
     *        The desired string length.
     *
     * @param {string} [padder=0]
     *        The character to pad with.
     *
     * @return {string}
     *         The padded string.
     */
    _pad: function(number, length, padder) {
        return new Array((length || 2) +
            1 -
            String(number)
                .replace('-', '')
                .length).join(padder || '0') + number;
    },

    _parseDate: function(date) {
        return {
            hours: date.getUTCHours(),
            day: date.getUTCDay(),
            dayOfMonth: date.getUTCDate(),
            month: date.getUTCMonth(),
            fullYear: date.getUTCFullYear()
        };
    },

    // H.format
    format: function (str, ctx, time) {
        var splitter = '{',
            isInside = false,
            segment,
            valueAndFormat,
            path,
            i,
            len,
            ret = [],
            val,
            index;

        while (str) {
            index = str.indexOf(splitter);
            if (index === -1) {
                break;
            }

            segment = str.slice(0, index);
            if (isInside) { // we're on the closing bracket looking back

                valueAndFormat = segment.split(':');
                path = valueAndFormat.shift().split('.'); // get first and leave
                len = path.length;
                val = ctx;

                // Assign deeper paths
                for (i = 0; i < len; i++) {
                    if (val) {
                        val = val[path[i]];
                    }
                }

                // Format the replacement
                if (valueAndFormat.length) {
                    val = this._formatSingle(valueAndFormat.join(':'), val, time);
                }

                // Push the result and advance the cursor
                ret.push(val);

            } else {
                ret.push(segment);

            }
            str = str.slice(index + 1); // the rest
            isInside = !isInside; // toggle
            splitter = isInside ? '}' : '{'; // now look for next matching bracket
        }
        ret.push(str);
        return ret.join('');
    },

    format2: function(format, values) {
        var string = '';

        for(let i = 0; i < format.length; i++) {
            if(format[i].type === 'text') {
                string += format[i].value;
            } else {
                if(format[i].valueType === 'number') {
                    if(values[format[i].key] !== null && values[format[i].key] !== undefined) {
                        string += this._numberFormat(values[format[i].key], format[i].decimals, null, format[i].thousandDelimiter);
                    }
                } else {
                    string += values[format[i].key];
                }
            }
        }

        return string;
    }
}