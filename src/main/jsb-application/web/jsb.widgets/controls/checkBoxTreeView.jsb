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
	$name: 'JSB.Widgets.CheckboxTreeView',
	$parent: 'JSB.Widgets.TreeView',

	$client: {
	    $require: ['JSB.Controls.Checkbox'],

	    _checkedItems: {},

		options: {
			allowSelect: false
		},

		checkedItems: function() {
		    return this._checkedItems;
		},
		
		isChecked: function(key) {
		    return this._checkedItems[key];
		},

		setChecked: function(key, isChecked) {
            if(isChecked) {
                this._checkedItems[key] = true;
            } else {
                if(this._checkedItems[key]) {
                    delete this._checkedItems[key];
                }
            }

            let currentCheckbox = this.get(key).checkbox.setChecked(isChecked, true),
                childKeys = this.getChildNodes(key);

            if(childKeys.length) {
                childKeys.forEach((key) => {
                    this.setChecked(key, isChecked);
                });
            }
		},

		wrapItem: function(itemObj) {
		    let wrappedItem = $base(itemObj);

			let checkbox = new Checkbox({
				label: itemObj.element,
				checked: itemObj.checked !== undefined ? itemObj.checked : false,
				onChange: function(bChecked) {
					$this.setChecked(itemObj.key, bChecked);
				}
			});

			itemObj.checkbox = checkbox;

			wrappedItem.find('> ._dwp_nodeHeader ._dwp_itemContainer').empty().append(checkbox);

			return wrappedItem;
		}
	}
}