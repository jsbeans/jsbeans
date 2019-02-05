{
	$name: 'DataCube.Query.Syntax',
	$singleton: true,

	$sync: {
		updateCheckInterval: 0
	},

	_replacementsMap: {},
	_sourceKeys: {},
	_toolItems: [],

	replacements: [
	    ['$join', '$from', '$union'],   // '$cube'
	    ['$slice']
	],

	scheme: {
	    $query: {
	        render: '$query',
	    },

        /*******/
        // sources
	    $cube: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Куб',
	        isSource: true,
	        editable: false,
	        removable: false
	    },

	    $from: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Срез',
	        desc: 'Задает в качестве источника запроса другой запрос',
	        isSource: true,
	        priority: 1,
	        removable: false
	    },

	    $join: {
            render: '$join',
            category: 'Источник запроса',
            displayName: 'Пересечение',
            desc: 'Задает в качестве источника запроса перечесение результатов двух запросов',
            isSource: true,
            removable: false
	    },

	    $provider: {
	        render: '$source',
	        displayName: 'Таблица базы данных',
	        isSource: true,
	        editable: false,
	        removable: false
	    },

	    $union: {
	        render: '$source',
	        category: 'Источник запроса',
	        displayName: 'Объединение',
	        desc: 'Задает в качестве источника запроса объединение результатов двух запросов',
	        isSource: true,
	        multiple: true,
	        removable: false
	    }
	    /*******/
	},

	getReplacements: function(name){
	    return this._replacementsMap[name];
	},

    getSchema: function (key){
        if(key){
            return this.scheme[key];
        }

        return this.scheme;
    },

    getSourceKeys: function(){
        return this._sourceKeys;
    },

    getToolItems: function(){
        return this._toolItems;
    },

	$client: {
		$constructor: function(){
			$base();
			$this.doSync();
		}
	},

	$server: {
        $constructor: function(){
            $base();

            // create replacement map
            for(var i = 0; i < this.replacements.length; i++){
                for(var j = 0; j < this.replacements[i].length; j++){
                    if(!this._replacementsMap[this.replacements[i][j]]){
                        this._replacementsMap[this.replacements[i][j]] = [];
                    }

                    for(var k = 0; k < this.replacements[i].length; k++){
                        if(this.replacements[i][j] !== this.replacements[i][k]){
                            this._replacementsMap[this.replacements[i][j]].push(this.replacements[i][k]);
                        }
                    }
                }
            }

            for(var i in this.scheme){
                // set defaults
                if(!JSB.isDefined(this.scheme[i].removable)){
                    this.scheme[i].removable = true;
                }

                if(!JSB.isDefined(this.scheme[i].editable)){
                    this.scheme[i].editable = true;
                }

                // create tool categories
                if(this.scheme[i].category){
                    this._toolItems.push(JSB.merge({}, this.scheme[i], {key: i}))
                }

                // collect source keys
                if(this.scheme[i].isSource){
                    this._sourceKeys[i] = true;
                }
            }
        }
    }
}