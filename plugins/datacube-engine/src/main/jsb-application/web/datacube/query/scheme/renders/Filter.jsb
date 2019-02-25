{
	$name: 'DataCube.Query.Renders.Filter',
	$parent: 'DataCube.Query.Renders.QueryElements',

	$alias: '$filter',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('filterRender');
	    },

        /**
        *
        * Добавляет новое значение
        * @param {string} key - логический ключ нового элемента: $and, $or, $not
        * @param {object} value - значение, подходящее под логический рендер
        *
        * @return {number} индекс нового элемента
        */
	    addValue: function(key, value){
	        var values = this.getValues();

	        if(!values[key]){
	            values[key] = [];
	        }

	        return values[key].push(value) - 1;
	    },

        /**
        *
        * Меняет логический тип значения
        * @param {string} oldKey - старый логический ключ
        * @param {string} newKey - новый логический ключ
        * @param {number} index - индекс старого логического элемента
        *
        * @return {number} новый индекс логического элемента
        */
	    changeLogicType: function(oldKey, newKey, index){
            var value = this.getValues()[oldKey].splice(index, 1)[0];

            return this.addValue(newKey, value);
	    },

	    constructValues: function(){
            var values = this.getValues();

            for(var i in values){
                for(var j = 0; j < values[i].length; j++){
                    var render = this.createRender({
                        index: j,
                        key: values[i],
                        renderName: '$filterItem',
                        scope: this.getValues()
                    });

                    if(render){
                        this.append(render);
                    }
                }
            }

            var addBtn = this.$('<i class="addBtn"></i>');
            this.append(addBtn);
            addBtn.click(function(){
                var index = $this.addValue('$and', $this.getDefaultAddValues());    // {$eq: [{$const: 0}, {$const: 0}]}

                var render = $this.createRender({
                    index: index,
                    key: '$and',
                    renderName: '$filterItem',
                    scope: $this.getValues()
                });

                if(render){
                    addBtn.before(render);

                    $this.onChange();
                }
            });
	    }
	}
}