/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.FieldList',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $require: ['JSB.Controls.Button',
                   'JSB.Controls.Checkbox',
                   'JSB.Controls.Grid',
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

			this.fields = new Grid({
			    columns: ['name', 'type'],
			    cellRenderer: function(td, value, rowIndex, colIndex, rowData) {
			        if(colIndex === 'name'){
                        td.append(new Checkbox({
                            key: rowIndex,
                            label: value,
                            onChange: function(b){
                                $this._checkedFields[this.options.key] = b;
                            }
                        }));

                        td.attr('val', value);
			        } else {
                        var typeStr;

                        if(JSB.isInstanceOf(value, 'Datacube.Types.Type')){
                            typeStr = value.getName();
                        } else if(JSB.isString(value)){
                            typeStr = value;
                        } else {
                            typeStr = 'неизвестный тип';
                        }

                        td.append(typeStr);
                        td.attr('val', typeStr);
			        }
			    },
            	headerRenderer: function(el, index){
                    var titleElt = $this.$('<div class="headerName"></div>');
                    titleElt.attr('title', index);
                    titleElt.text(index);
                    el.append(titleElt);

                    el.append(new Button({
                        cssClass: 'btnSort',
                        icon: true,
                        onClick: function(evt){
                            $this.sort(evt.currentTarget, index);
                        }
                    }));
            	}
			});
			this.append(this.fields);

			var tools = this.$('<div class="tools"></div>');
			this.append(tools);

			function setCheckedAll(b){
			    var checkboxes = $this.fields.find('.grid-master > table > tr > td > .jsb-checkbox');

			    for(var i = 0; i < checkboxes.length; i++){
			        var jsb = $this.$(checkboxes[i]).jsb();

			        jsb.setChecked(b, true);

			        $this._checkedFields[jsb.getOption('key')] = b;
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
                this.fields.find('.grid-master > table > tr > td[key="name"]:not(:icontains("' + value + '"))').closest('tr').addClass('hidden');
                this.fields.find('.grid-master > table > tr > td[key="name"]:icontains("' + value + '")').closest('tr').removeClass('hidden');
            } else {
                this.fields.find('.grid-master > table > tr').removeClass('hidden');
            }
        },

        setFields: function(fieldsList){
            this.fields.clear();
            this._checkedFields = {};

            this.fields.setData(fieldsList);

            this.fields.getElement().height(this.fields.find('> .grid-master > table').height());
        },

        sort: function(target, colName) {
		    var fields = this.fields.find('.grid-master > table > tr'),
		        headers = this.fields.find('.grid-top > table > tr > th > .jsb-button'),
		        direction = 1;

            target = this.$(target);

            if(target.hasClass('upSort')) {
                headers.removeClass('upSort downSort');

                target.addClass('downSort');

                direction = -1;
            } else {
                headers.removeClass('upSort downSort');

                target.removeClass('downSort').addClass('upSort');
            }

		    fields.sort(function(a, b) {
		        a = $this.$(a).find('> td[colKey="' + colName + '"]').attr('val');
		        b = $this.$(b).find('> td[colKey="' + colName + '"]').attr('val');

                if(a > b){
                    return 1 * direction;
                }

                if(a < b){
                    return -1 * direction;
                }

                return 0;
		    });

		    fields.detach().appendTo(this.fields.find('.grid-master > table'));
        }
    }
}