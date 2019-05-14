{
	$name: 'DataCube.Query.Controls.ViewsEditor',
	$parent: 'JSB.Controls.Control',

	$client: {
	    $require: ['DataCube.Query.SchemeController',
	               'DataCube.Query.Syntax',
	               'DataCube.Query.Helper',
	               'JSB.Controls.ScrollBox',
	               'JSB.Controls.Panel',
	               'css:ViewEditor.css'],

        _controllerOptions: {},
        _viewsDescs: {},

	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('viewEditor');

	        this.viewContainer = new ScrollBox({
	            cssClass: 'viewContainer',
	            xAxisScroll: false
	        });
	        this.append(this.viewContainer);

	        var addBtn = this.$('<i class="addBtn"></i>');
	        this.append(addBtn);
	        addBtn.click(function() {
	            $this.createView();
	        });
	    },

	    createView: function(values, viewName) {
            viewName = viewName || Helper.createName($this._viewsDescs, 'Именованный подзапрос');

            var isNew = false;

            if(!values) {
                values = Syntax.constructDefaultValues({key: '$query'}).$query;

                isNew = true;
            }

            var controller = new SchemeController({
                data: this._controllerOptions.data,
                slice: this._controllerOptions.slice,
                values: values,
                onChange: function() {
                    this.onChange('change', {
                        name: viewName,
                        values: values
                    });
                }
            });

            var view = new Panel({
                cssClass: 'viewItem',
                closeBtn: true,
                title: viewName,
                titleEditBtn: true,
                onCloseBtnClick: function() {
                    controller.destroy();
                    view.destroy();

                    delete $this._viewsDescs[viewName];

                    $this.onChange('remove', {
                        name: viewName
                    });
                },
                titleValidateFunction: function(val) {
                    if($this._viewsDescs[val]) {
                        return false;
                    } else {
                        return true;
                    }
                },
                onTitleEdited: function(val, oldVal) {
                    $this.onChange('rename', {
                        oldName: oldVal,
                        newName: val
                    });

                    viewName = val;
                    $this._viewsDescs[val] = $this._viewsDescs[oldVal];
                    delete $this._viewsDescs[oldVal];
                }
            });
            this.viewContainer.append(view);

            view.appendContent(controller);

            $this._viewsDescs[viewName] = controller;

            if(isNew) {
                this.onChange('add', {
                    name: viewName,
                    values: values
                });
            }
	    },

	    extract: function() {
	        return Object.keys(this._viewsDescs);
	    },

	    onChange: function(type, options) {
	        this._controllerOptions.onChange.call(this, type, options);
	    },

	    refresh: function(opts) {
	        this._controllerOptions = opts;
	        this._viewsDescs = {};

	        this.viewContainer.clear();

	        if(opts.query && opts.query.$views) {
	            for(var i in opts.query.$views) {
	                this.createView(opts.query.$views[i], i);
	            }
	        }
	    }
	}
}