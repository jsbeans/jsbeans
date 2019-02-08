{
	$name: 'DataCube.Query.Renders.Select',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$select',

	$client: {
	    $require: ['css:Select.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectRender');

	        this.construct();
	    },

	    construct: function(){
            var fieldsArr = [];

            for(var i in this._values){
                fieldsArr.push(i);
            }

            fieldsArr.sort();

            for(var i = 0; i < fieldsArr.length; i++){
                var fieldEl = this.$('<div class="field"></div>'),
                    fieldName = this.$('<div class="fieldName cubeFieldIcon sliceField">' + fieldsArr[i] + '</div>');

                fieldEl.append(fieldName);
                fieldEl.append('<div class="separator"></div>');
                this.append(fieldEl);

                (function(fieldName, fieldEl){
                    var value = fieldsArr[i];

                    $this.installMenuEvents(fieldName, JSB.generateUid(), {
                        removable: true,
                        replaceable: true,
                        editCallback: function(){
                            var input = $this.$('<input type="text" value="' + value + '" />');
                            fieldName.append(input);

                            input.change(function(){
                                var newVal = input.val();

                                if(newVal !== value){
                                    $this.replaceValue(value, newVal);
                                    value = newVal;
                                    input.remove();
                                    fieldName.text(newVal);

                                    $this.onChange();
                                }
                            });

                            $this.$(window).on('click.renameQueryFieldInput', function(){
                                input.remove();
                                $this.$(window).off('click.renameQueryFieldInput');
                            });
                            input.click(function(evt){
                                evt.stopPropagation();
                            });

                            input.focus();
                        },
                        deleteCallback: function(){
                            delete $this._values[value];
                            fieldEl.remove();

                            $this.onChange();
                        }
                    });
                })(fieldName, fieldEl);

                for(var j in this._values[fieldsArr[i]]){
                    var render = this.createRender(j, this._values[fieldsArr[i]][j]);

                    if(render){
                        fieldEl.append(render);
                    }
                }
            }

            // add field btn
	    },

	    sort: function(){}
	}
}