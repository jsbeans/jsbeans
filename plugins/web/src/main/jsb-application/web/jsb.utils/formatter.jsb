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

	_lang: {},

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
            // todo
            // val = (time || H.time).dateFormat(format, val);
        }
        return val;
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
    }
}