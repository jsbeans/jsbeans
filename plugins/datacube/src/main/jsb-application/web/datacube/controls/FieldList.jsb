{
	$name: 'DataCube.FieldList',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $require: ['JSB.Controls.ScrollBox',
                   'JSB.Controls.Checkbox',
                   'JSB.Workspace.SearchEditor',
                   'css:FieldList.css'],

        _checkedFields: {},

        $constructor: function(opts){
            $base(opts);

            this.addClass('fieldList');

            var search = new SearchEditor({
                onChange: function(value){
                    $this.search(value);
                }
            });
            this.append(search);

			this.fields = new ScrollBox({
			    cssClass: 'fields',
			    xAxisScroll: false
			});
			this.append(this.fields);

			var tools = this.$('<div class="tools"></div>');
			this.append(tools);

			function setCheckedAll(b){
			    var checkboxes = $this.fields.find('.field > .jsb-checkbox');

			    for(var i = 0; i < checkboxes.length; i++){
			        var jsb = $this.$(checkboxes[i]).jsb();

			        jsb.setChecked(b, true);

			        $this._checkedFields[jsb.getLabel()] = b;
			    }
			}

			var selectAll = this.$('<div class="selectAll" title="Выделить все"></div>');
			tools.append(selectAll);
			selectAll.click(function(){
			    setCheckedAll(true);
			});

			var deselectAll = this.$('<div class="deselectAll" title="Снять выделение со всех"></div>');
			tools.append(deselectAll);
			deselectAll.click(function(){
			    setCheckedAll(false);
			});

			if(this.options.fieldsList){
			    this.setFields(this.options.fieldsList);
			}
        },

        getChecked: function(){
            return this._checkedFields;
        },

        search: function(value){
		    if(value){
                this.fields.find('.field[key]:not(:icontains("' + value + '"))').addClass('hidden');
                this.fields.find('.field[key]:icontains("' + value + '")').removeClass('hidden');
            } else {
                this.fields.find('.field').removeClass('hidden');
            }
        },

        setFields: function(fieldsList){
            this.fields.clear();
            this._checkedFields = {};

            for(var i in fieldsList){
                var field = $this.$('<div class="field" key="' + (fieldsList[i].name || i) + '"></div>');

                field.append(new Checkbox({
                    key: i,
                    label: fieldsList[i].name || i,
                    onChange: function(b){
                        $this._checkedFields[this.options.key] = b;
                    }
                }));
                
                var type = fieldsList[i].type;
                var typeStr = '';
                if(JSB.isInstanceOf(type, 'Datacube.Types.Type')){
                	typeStr = type.getName();
                } else if(JSB.isString(type)){
                	typeStr = type;
                } else {
                	typeStr = 'неизвестный тип';
                }

                field.append('<div class="type">' + typeStr + '</div>');

                this.fields.append(field);
            }
        }
    }
}