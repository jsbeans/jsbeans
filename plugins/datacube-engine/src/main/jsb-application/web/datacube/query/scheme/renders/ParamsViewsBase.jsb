/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.ParamsViewsBase',
	$parent: 'DataCube.Query.Renders.Basic',

	$client: {
	    $require: ['JSB.Controls.Panel',
	               'css:ParamsViewsBase.css'],

	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('paramsViewsBase');

	        this.createHeader();

	        this.container = this.$('<div class="container"></div>');
	        this.append(this.container);

	        var addBtn = this.$('<i class="addBtn"></i>');
	        this.append(addBtn);
	        addBtn.click(function() {
	            $this.create();
	        });

	        var values = this.getValues();

	        for(var i in values) {
	            this.create(values[i], i);
	        }
	    },

	    create: function(values, name) {
	        throw Error('Method should be overridden');
	    },

	    createItem: function(name, deleteCallback, namePrepareCallback) {
	        function namePrepare(name) {
	            if(namePrepareCallback) {
	                return namePrepareCallback.call($this, name);
	            } else {
	                return name;
	            }
	        }

	        var item = new Panel({
                cssClass: 'item',
                closeBtn: true,
                title: name,
                titleEditBtn: true,
                onCloseBtnClick: function() {
                    deleteCallback.call();

                    item.destroy();

                    delete $this.getValues()[item.getTitle()];

                    $this.onChange('remove', {
                        name: namePrepare(item.getTitle())
                    });
                },
                titleValidateFunction: function(val) {
                    if($this.getValues()[namePrepare(val)]) {
                        return false;
                    } else {
                        return true;
                    }
                },
                onTitleEdited: function(val, oldVal) {
                    $this.onChange('rename', {
                        oldName: namePrepare(oldVal),
                        newName: namePrepare(val)
                    });

                    name = val;
                    $this.getValues()[val] = $this.getValues()[oldVal];
                    delete $this.getValues()[oldVal];
                }
	        });
	        this.container.append(item);

	        return item;
	    },

	    onChange: function(type, options) {
	        var values = this.getValues();

            switch(type) {
                case 'add':
                    values[options.name] = options.values;
                    break;
                case 'change':
                    values[options.name] = options.values;
                    break;
                case 'rename':
                    var oldValues = values[options.oldName];

                    values[options.newName] = oldValues;

                    delete values[options.oldName];
                    break;
                case 'remove':
                    delete values[options.name];
                    break;
            }

            $base();
	    }
    }
}