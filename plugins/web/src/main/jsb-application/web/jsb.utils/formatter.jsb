// based on Highcharts ver 6.1.0
{
	$name: 'JSB.Utils.Formatter',

	// H.formatSingle
    _formatSingle: function (format, val, time) {
        var floatRegex = /f$/,
            decRegex = /\.([0-9])/,
            lang = H.defaultOptions.lang,
            decimals;

        if (floatRegex.test(format)) { // float
            decimals = format.match(decRegex);
            decimals = decimals ? decimals[1] : -1;
            if (val !== null) {
                val = H.numberFormat(
                    val,
                    decimals,
                    lang.decimalPoint,
                    format.indexOf(',') > -1 ? lang.thousandsSep : ''
                );
            }
        } else {
            // val = (time || H.time).dateFormat(format, val);
        }
        return val;
    },

    // H.format
    _format: function (str, ctx, time) {
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

	format: function(data, variables, template){
	    //
	}
}