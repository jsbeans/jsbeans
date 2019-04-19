{
	$name: 'DataCube.Query.Controls.ViewEditor',
	$parent: 'JSB.Controls.Control',

	$client: {
	    $require: ['DataCube.Query.SchemeController',
	               'DataCube.Query.Syntax',
	               'DataCube.Query.Helper',
	               'JSB.Controls.ScrollBox',
	               'JSB.Controls.Panel',
	               'css:ViewEditor.css'],

        _sliceOpts: {},
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

            var isAddToController = false;

            if(!values) {
                values = Syntax.constructDefaultValues({key: '$query'});

                isAddToController = true;
            }

            var view = new Panel({
                cssClass: 'viewItem',
                title: viewName,
                titleEditBtn: true,
                titleValidateFunction: function(val) {
                    if($this._viewsDescs[val]) {
                        return false;
                    } else {
                        return true;
                    }
                },
                onTitleEdited: function(val, oldVal) {
                    $this.options.schemeController.changeExtendCategoryItem('$views', null, oldVal, val);
                    viewName = val;
                    $this._viewsDescs[val] = $this._viewsDescs[oldVal];
                    delete $this._viewsDescs[oldVal];
                }
            });
            this.viewContainer.append(view);

            var controller = new SchemeController({
                data: this._sliceOpts.data,
                slice: this._sliceOpts.slice,
                values: values,
                onChange: function() {
                    $this.options.schemeController.changeExtendCategoryItem('$views', controller.getValues(), viewName);
                }
            });
            view.appendContent(controller);

            $this._viewsDescs[viewName] = controller;

            if(isAddToController) {
                this.options.schemeController.addExtendCategoryItem('$views', values, viewName, true);
            }
	    },

	    refresh: function(opts) {
	        this._sliceOpts = opts;
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