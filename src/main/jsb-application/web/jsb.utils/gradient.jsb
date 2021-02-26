{
	$name: 'JSB.Utils.Gradient',

	$singleton: true,

	$require: ['script:../tpl/chroma/chroma.min.js'],

	getLimits: function(values) {
	    let min = values.reduce((accumulator, currentValue) => {
                if(currentValue < accumulator) {
                    return currentValue;
                }

                return accumulator;
            }, values[0]),
            max = values.reduce((accumulator, currentValue) => {
                if(currentValue > accumulator) {
                    return currentValue;
                }

                return accumulator;
            }, values[0]);

	    return {
	        min: min,
	        max: max
	    };
	},

	gradient: function(values, colors, calculateFunction) {
        let limits = this.getLimits(values),
            result = [],
            chromaRes;

        switch(calculateFunction) {
            case 'logarithmic':
                let logMin = Math.log(limits.min),
                    logMax = Math.log(limits.max);

                chromaRes = chroma.scale(colors).domain([logMin, logMax]);

                values.forEach(value => {
                    result.push(chromaRes(Math.log(value)).hex());
                });
                break;
            case 'quadratic':
                let sqrMin = Math.pow(limits.min, 2),
                    sqrMax = Math.pow(limits.max, 2);

                chromaRes = chroma.scale(colors).domain([sqrMin, sqrMax]);

                values.forEach(value => {
                    result.push(chromaRes(Math.pow(value, 2)).hex());
                });
                break;
            case 'linear':
            default:
                chromaRes = chroma.scale(colors).domain([limits.min, limits.max]);

                values.forEach(value => {
                    result.push(chromaRes(value).hex());
                });
        }

        return result;
	},

	stepGradient: function(values, colors, steps, calculateFunction) {
        let limits = this.getLimits(values),
            result = [],
            colorMap = [],
            chromaRes,
            classes;

        switch(calculateFunction) {
            case 'logarithmic':
                let logMin = Math.log(limits.min),
                    logMax = Math.log(limits.max);

                chromaRes = chroma.scale(colors).domain([logMin, logMax]).classes(steps);

                classes = chromaRes.classes();

                values.forEach(value => {
                    result.push(chromaRes(Math.log(value)).hex());
                });

                for(let i = 0; i < classes.length - 1; i++) {
                    colorMap.push({
                        min: Math.pow(Math.E, classes[i]),
                        max: Math.pow(Math.E, classes[i + 1]),
                        color: chromaRes(classes[i] + (classes[i + 1] - classes[i]) / 2).hex()
                    });
                }
                break;
            case 'quadratic':
                let sqrMin = Math.pow(limits.min, 2),
                    sqrMax = Math.pow(limits.max, 2);

                chromaRes = chroma.scale(colors).domain([sqrMin, sqrMax]).classes(steps);

                classes = chromaRes.classes();

                values.forEach(value => {
                    result.push(chromaRes(Math.pow(value, 2)).hex());
                });

                for(let i = 0; i < classes.length - 1; i++) {
                    colorMap.push({
                        min: Math.sqrt(classes[i]),
                        max: Math.sqrt(classes[i + 1]),
                        color: chromaRes(classes[i] + (classes[i + 1] - classes[i]) / 2).hex()
                    });
                }
                break;
            case 'linear':
            default:
                chromaRes = chroma.scale(colors).domain([limits.min, limits.max]).classes(steps);

                classes = chromaRes.classes();

                values.forEach(value => {
                    result.push(chromaRes(value).hex());
                });

                for(let i = 0; i < classes.length - 1; i++) {
                    colorMap.push({
                        min: classes[i],
                        max: classes[i + 1],
                        color: chromaRes(classes[i] + (classes[i + 1] - classes[i]) / 2).hex()
                    });
                }
        }

        return {
            colorMap: colorMap,
            colors: result
        };
	}
}