/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Utils.Rainbow',
    // inner variables
    gradients: null,
    minNum: 0,
    maxNum: 100,
    colours: ['ff0000', 'ffff00', '00ff00', '0000ff'],
    colorMap: [],

    colorFunction: null,
    stepColors: false,

    $constructor: function(opts){
        this.ColourGradient = function(){
            var startColour = 'ff0000';
            var endColour = '0000ff';
            var minNum = 0;
            var maxNum = 100;

            this.setGradient = function (colourStart, colourEnd){
                startColour = getHexColour(colourStart);
                endColour = getHexColour(colourEnd);
            },

            this.setNumberRange = function (minNumber, maxNumber){
                if (maxNumber >= minNumber) {
                    minNum = minNumber;
                    maxNum = maxNumber;
                } else {
                    throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
                }
            },

            this.colourAt = function (number){
                return calcHex(number, startColour.substring(0,2), endColour.substring(0,2))
                    + calcHex(number, startColour.substring(2,4), endColour.substring(2,4))
                    + calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
            }

            function calcHex(num, channelStart_Base16, channelEnd_Base16){
                if (num <= minNum) {
                    num = minNum;
                }
                if (num >= maxNum) {
                    num = maxNum;
                }

                var cStart_Base10 = parseInt(channelStart_Base16, 16);
                var cEnd_Base10 = parseInt(channelEnd_Base16, 16);

                switch(this.colorFunction){
                    case 'quadratic':
                        var numRange = Math.pow(maxNum, 2) - Math.pow(minNum, 2);
                        numRange = numRange > 0 ? numRange : 1;
                        var cPerUnit = (cEnd_Base10 - cStart_Base10) / numRange;
                        var c_Base10 = Math.round(cPerUnit * (Math.pow(num, 2) - Math.pow(minNum, 2)) + cStart_Base10);
                        break;
                    case 'logarithmic':
                        var numRange = Math.log(maxNum) - Math.log(minNum);
                        numRange = numRange > 0 ? numRange : 1;
                        var cPerUnit = (cEnd_Base10 - cStart_Base10) / numRange;
                        var c_Base10 = Math.round(cPerUnit * (Math.log(num) - Math.log(minNum)) + cStart_Base10);
                        break;
                    case 'linear':
                    default:
                        var numRange = maxNum - minNum;
                        numRange = numRange > 0 ? numRange : 1;
                        var cPerUnit = (cEnd_Base10 - cStart_Base10) / numRange;
                        var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
                        break;
                }

                return formatHex(c_Base10.toString(16));
            }

            function formatHex(hex){
                if (hex.length === 1) {
                    return '0' + hex;
                } else {
                    return hex;
                }
            }

            function isHexColour(string){
                var regex = /^#?[0-9a-fA-F]{6}$/i;
                return regex.test(string);
            }

            function getHexColour(string){
                if (isHexColour(string)) {
                    return string.substring(string.length - 6, string.length);
                } else {
                    var name = string.toLowerCase();
                    if (colourNames.hasOwnProperty(name)) {
                        return colourNames[name];
                    }
                    throw new Error(string + ' is not a valid colour.');
                }
            }

            // Extended list of CSS colornames is taken from
            // http://www.w3.org/TR/css3-color/#svg-color
            var colourNames = {
                aliceblue: "F0F8FF",
                antiquewhite: "FAEBD7",
                aqua: "00FFFF",
                aquamarine: "7FFFD4",
                azure: "F0FFFF",
                beige: "F5F5DC",
                bisque: "FFE4C4",
                black: "000000",
                blanchedalmond: "FFEBCD",
                blue: "0000FF",
                blueviolet: "8A2BE2",
                brown: "A52A2A",
                burlywood: "DEB887",
                cadetblue: "5F9EA0",
                chartreuse: "7FFF00",
                chocolate: "D2691E",
                coral: "FF7F50",
                cornflowerblue: "6495ED",
                cornsilk: "FFF8DC",
                crimson: "DC143C",
                cyan: "00FFFF",
                darkblue: "00008B",
                darkcyan: "008B8B",
                darkgoldenrod: "B8860B",
                darkgray: "A9A9A9",
                darkgreen: "006400",
                darkgrey: "A9A9A9",
                darkkhaki: "BDB76B",
                darkmagenta: "8B008B",
                darkolivegreen: "556B2F",
                darkorange: "FF8C00",
                darkorchid: "9932CC",
                darkred: "8B0000",
                darksalmon: "E9967A",
                darkseagreen: "8FBC8F",
                darkslateblue: "483D8B",
                darkslategray: "2F4F4F",
                darkslategrey: "2F4F4F",
                darkturquoise: "00CED1",
                darkviolet: "9400D3",
                deeppink: "FF1493",
                deepskyblue: "00BFFF",
                dimgray: "696969",
                dimgrey: "696969",
                dodgerblue: "1E90FF",
                firebrick: "B22222",
                floralwhite: "FFFAF0",
                forestgreen: "228B22",
                fuchsia: "FF00FF",
                gainsboro: "DCDCDC",
                ghostwhite: "F8F8FF",
                gold: "FFD700",
                goldenrod: "DAA520",
                gray: "808080",
                green: "008000",
                greenyellow: "ADFF2F",
                grey: "808080",
                honeydew: "F0FFF0",
                hotpink: "FF69B4",
                indianred: "CD5C5C",
                indigo: "4B0082",
                ivory: "FFFFF0",
                khaki: "F0E68C",
                lavender: "E6E6FA",
                lavenderblush: "FFF0F5",
                lawngreen: "7CFC00",
                lemonchiffon: "FFFACD",
                lightblue: "ADD8E6",
                lightcoral: "F08080",
                lightcyan: "E0FFFF",
                lightgoldenrodyellow: "FAFAD2",
                lightgray: "D3D3D3",
                lightgreen: "90EE90",
                lightgrey: "D3D3D3",
                lightpink: "FFB6C1",
                lightsalmon: "FFA07A",
                lightseagreen: "20B2AA",
                lightskyblue: "87CEFA",
                lightslategray: "778899",
                lightslategrey: "778899",
                lightsteelblue: "B0C4DE",
                lightyellow: "FFFFE0",
                lime: "00FF00",
                limegreen: "32CD32",
                linen: "FAF0E6",
                magenta: "FF00FF",
                maroon: "800000",
                mediumaquamarine: "66CDAA",
                mediumblue: "0000CD",
                mediumorchid: "BA55D3",
                mediumpurple: "9370DB",
                mediumseagreen: "3CB371",
                mediumslateblue: "7B68EE",
                mediumspringgreen: "00FA9A",
                mediumturquoise: "48D1CC",
                mediumvioletred: "C71585",
                midnightblue: "191970",
                mintcream: "F5FFFA",
                mistyrose: "FFE4E1",
                moccasin: "FFE4B5",
                navajowhite: "FFDEAD",
                navy: "000080",
                oldlace: "FDF5E6",
                olive: "808000",
                olivedrab: "6B8E23",
                orange: "FFA500",
                orangered: "FF4500",
                orchid: "DA70D6",
                palegoldenrod: "EEE8AA",
                palegreen: "98FB98",
                paleturquoise: "AFEEEE",
                palevioletred: "DB7093",
                papayawhip: "FFEFD5",
                peachpuff: "FFDAB9",
                peru: "CD853F",
                pink: "FFC0CB",
                plum: "DDA0DD",
                powderblue: "B0E0E6",
                purple: "800080",
                red: "FF0000",
                rosybrown: "BC8F8F",
                royalblue: "4169E1",
                saddlebrown: "8B4513",
                salmon: "FA8072",
                sandybrown: "F4A460",
                seagreen: "2E8B57",
                seashell: "FFF5EE",
                sienna: "A0522D",
                silver: "C0C0C0",
                skyblue: "87CEEB",
                slateblue: "6A5ACD",
                slategray: "708090",
                slategrey: "708090",
                snow: "FFFAFA",
                springgreen: "00FF7F",
                steelblue: "4682B4",
                tan: "D2B48C",
                teal: "008080",
                thistle: "D8BFD8",
                tomato: "FF6347",
                turquoise: "40E0D0",
                violet: "EE82EE",
                wheat: "F5DEB3",
                white: "FFFFFF",
                whitesmoke: "F5F5F5",
                yellow: "FFFF00",
                yellowgreen: "9ACD32"
            }
        }

        if(opts.minNum !== undefined && opts.maxNum !== undefined){
            this.setNumberRange(opts.minNum, opts.maxNum);
        }

        if(opts.spectrum && JSB.isArray(opts.spectrum)){
            this.setColors(opts.spectrum);
        } else {
            this.setColors(this.colours);
        }

        if(opts.colorFunction){
            this.colorFunction = opts.colorFunction;
        }

        if(opts.stepColors){
            this.createColorMap(opts.stepColors);
            this.stepColors = true;
        }
    },

	colorAt: function (number){
        if (isNaN(number)) {
            throw new TypeError(number + ' is not a number');
        }

        if(this.stepColors){
            switch(this.colorFunction){
                case 'quadratic':
                    number = Math.pow(number, 2);
                    break;
                case 'logarithmic':
                    number = Math.log(number);
                    break;
            }

            for(var i = 0; i < this.colorMap.length; i++){
                if(this.colorMap[i].innerMin <= number && this.colorMap[i].innerMax >= number){
                    return {
                        color: this.colorMap[i].color,
                        group: i
                    }
                }
            }
        } else {
            if (this.gradients.length === 1) {
                return this.gradients[0].colourAt(number);
            } else {
                var segment = (this.maxNum - this.minNum)/(this.gradients.length);
                var index = Math.min(Math.floor((Math.max(number, this.minNum) - this.minNum)/segment), this.gradients.length - 1);
                return this.gradients[index].colourAt(number);
            }
        }
    },

    createColorMap: function(count){
        this.colorMap = [];

        var increment = (this.maxNum - this.minNum) / count;

        switch(this.colorFunction){
            case 'quadratic':
                for(var j = 0; j < count; j++){
                    var min = j * increment + this.minNum,
                        max = (j + 1) * increment + this.minNum;

                    this.colorMap.push({
                        min: min,
                        innerMin: Math.pow(min, 2),
                        max: max,
                        innerMax: Math.pow(max, 2),
                        color: this.colorAt(j * increment + this.minNum)
                    });
                }
                break;
            case 'logarithmic':
                for(var j = 0; j < count; j++){
                    var min = j * increment + this.minNum,
                        max = (j + 1) * increment + this.minNum;

                    this.colorMap.push({
                        min: min,
                        innerMin: Math.log(min),
                        max: max,
                        innerMax: Math.log(max),
                        color: this.colorAt(j * increment + this.minNum)
                    });
                }
                break;
            default:
                for(var j = 0; j < count; j++){
                    var min = j * increment + this.minNum,
                        max = (j + 1) * increment + this.minNum;

                    if(j + 1 === count){
                        max = this.maxNum;
                    }

                    this.colorMap.push({
                        min: min,
                        innerMin: min,
                        max: max,
                        innerMax: max,
                        color: this.colorAt(j * increment + this.minNum)
                    });
                }
                break;
        }
    },

    getColorMap: function(){
        return this.colorMap;
    },

    setNumberRange: function (minNumber, maxNumber){
		if (maxNumber >= minNumber) {
			this.minNum = minNumber;
			this.maxNum = maxNumber;
			this.setColors(this.colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	},

    setColors: function(spectrum){
        if (spectrum.length < 2) {
            throw new Error('Rainbow must have two or more colours.');
        } else {
            var increment = (this.maxNum - this.minNum)/(spectrum.length - 1);
            var firstGradient = new this.ColourGradient();
            firstGradient.setGradient(spectrum[0], spectrum[1]);
            firstGradient.setNumberRange(this.minNum, this.minNum + increment);
            this.gradients = [ firstGradient ];

            for (var i = 1; i < spectrum.length - 1; i++) {
                var colourGradient = new this.ColourGradient();
                colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
                colourGradient.setNumberRange(this.minNum + increment * i, this.minNum + increment * (i + 1));
                this.gradients[i] = colourGradient;
            }

            this.colours = spectrum;
        }
    },

    setSpectrum: function(){
        this.setColors(arguments);
        return this;
    }
}