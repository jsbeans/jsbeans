{
	$name: 'DataCube.Query.Controls.ExtendEditor',
	$parent: 'JSB.Controls.Control',

	$client: {
	    $require: ['JSB.Controls.ScrollBox',
	               'JSB.Controls.Panel',
	               'css:ExtendEditor.css'],

        _controllerOptions: {},
        _descs: {},

	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('extendEditor');

	        this.container = new ScrollBox({
	            cssClass: 'container',
	            xAxisScroll: false
	        });
	        this.append(this.container);

	        var addBtn = this.$('<i class="addBtn"></i>');
	        this.append(addBtn);
	        addBtn.click(function() {
	            $this.create();
	        });
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

                    delete $this._descs[name];

                    $this.onChange('remove', {
                        name: namePrepare(name)
                    });
                },
                titleValidateFunction: function(val) {
                    if($this._descs[val]) {
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
                    $this._descs[val] = $this._descs[oldVal];
                    delete $this._descs[oldVal];
                }
	        });
	        this.container.append(item);

	        this._descs[name] = item;

	        return item;
	    },

	    extract: function() {
	        return Object.keys(this._descs);
	    },

	    onChange: function(type, options) {
	        options.alias = this.getJsb().getDescriptor().$alias;

	        this._controllerOptions.onChange.call(this, type, options);
	    },

	    refresh: function(opts) {
	        this._controllerOptions = opts;
	        this._descs = {};

	        this.container.clear();

	        var alias = this.getJsb().getDescriptor().$alias;

	        if(opts.query && opts.query[alias]) {
	            for(var i in opts.query[alias]) {
	                this.create(opts.query[alias][i], i);
	            }
	        }
	    }
	}
}