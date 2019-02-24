{
	$name: 'DataCube.Query.Renders.Comparison',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$comparison',

	$client: {
	    $require: ['css:Comparison.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('comparisonRender');
	    },

	    constructHead: function(){
	        var scheme = this.getScheme(),
	            desc = this.getKey() + '\n' + scheme.desc;

            var header = this.$('<header></header>');
            this.append(header);

            var logic = this.$('<i class="logicType"></i>');
            header.append(logic);

            function setKey(key){
                logic.attr('key', key);

                switch(key){
                    case '$and':
                        logic.text('И');
                    break;
                    case '$or':
                        logic.text('ИЛИ');
                    break;
                    case '$not':
                        logic.text('НЕ');
                    break;
                }
            }

            setKey(this.getParent().getKey());

            logic.click(function(){
                ToolManager.activate({
                    id: 'simpleSelectTool',
                    cmd: 'show',
                    data: {
                        key: JSB.generateUid(),
                        values: Syntax.getReplacements($this.getParent().getKey())
                    },
                    scope: null,
                    target: {
                        selector: header,
                        dock: 'bottom'
                    },
                    callback: function(desc){
console.log(desc);
debugger;
                        /*
                        $this.getParent().replaceValue(desc.key);

                        setKey(desc.key);

                        $this.onChange();
                        */
                    }
                });
            });

	        var operator = this.$('<span class="operator" title="' + desc + '">' + scheme.displayName + '</span>');
            header.append(operator);

            this.installMenuEvents(operator, this.getId() + '_operator', {
                removable: this.isAllowDelete(),
                deleteCallback: function(){
                    $this.getDeleteCallback().call($this);
                }
            });

            this.append(this.createSeparator(this.isMultiple() || scheme.parameters));
	    }
    }
}