{
	$name: 'Unimap.Render.Basic',
	$parent: 'JSB.Controls.Control',
	$require: ['Unimap.Controller'],
    $client: {
        $constructor: function(opts){
            $base(opts);
            this.addClass('basicRender');
            this.loadCss('Basic.css');
            JSB().loadCss('tpl/font-awesome/css/font-awesome.min.css');

            this._key = opts.key;
            this._scheme = opts.scheme;
            this._values = opts.values;
            this._schemeController = opts.schemeController;

	        if(this._values && Object.keys(this._values).length === 0){
	            this.createValues();
	        }

	        this.extendValues();

            this.construct(opts.options ? opts.options : {});
        },

        construct: function(opts){
            throw new Error('This method must be overwritten');
        },

        changeLinkTo: function(values, render){
            if(JSB.isFunction(this.options.linkToFunc)){
                this.options.linkToFunc.call(this, values, render);
                return true;
            }
        },

        changeLinkToWarning: function(){
            // todo: add standard warning
        },

        createDescription: function(name){
            if(!name || !this._scheme.description){
                return;
            }

            var description = this.$('<div class="description hidden">' + this._scheme.description + '</div>');
            name.append(description);

            var descriptionIcon = this.$('<i class="fa fa-question-circle" aria-hidden="true"></i>');

            descriptionIcon.hover(function() { description.removeClass( "hidden" ); },
                                  function() { description.addClass( "hidden" ); });

            descriptionIcon.mousemove(function(evt){
                                if(description.hasClass('show')) return;

                                var descWidth = description.outerWidth(),
                                    descHeight = description.outerHeight(),
                                    bodyWidth = $this.$(window).width(),
                                    bodyHeight = $this.$(window).height(),
                                    top = evt.pageY,
                                    left = evt.pageX;

                                if(top + descHeight + 20 > bodyHeight){
                                    top = bodyHeight - descHeight - 20;
                                }

                                if(left + descWidth + 20 > bodyWidth){
                                    left = bodyWidth - descWidth - 20;
                                }

                                description.offset({top: top + 15, left: left + 15 });
                           });

            descriptionIcon.click(function(evt){
                               evt.stopPropagation();

                               description.toggleClass('show');

                               var descWidth = description.outerWidth(),
                                   descHeight = description.outerHeight(),
                                   bodyWidth = $this.$(window).width(),
                                   bodyHeight = $this.$(window).height(),
                                   top = evt.pageY,
                                   left = evt.pageX;

                               if(top + descHeight + 20 > bodyHeight){
                                   top = bodyHeight - descHeight - 20;
                               }

                               if(left + descWidth + 20 > bodyWidth){
                                   left = bodyWidth - descWidth - 20;
                               }

                               description.offset({top: top + 15, left: left + 15 });
                           });

            name.append(descriptionIcon);
        },

        createInnerScheme: function(scheme, values, onchange){
            return new Controller({
                scheme: scheme,
                values: values,
                onchange: onchange,
                rendersMap: this._schemeController.getRenderMap(),
            });
        },

        createRender: function(key, scheme, values, opts){
            return this._schemeController.createRender(this, key, scheme, values, opts);
        },

        createValues: function(){
            this._values.checked = this._scheme.optional === 'checked' ? true : undefined;
            this._values.render = this._scheme.render;
            this._values.defaultValue = this._scheme.defaultValue;
            this._values.valueType = this._scheme.valueType;
            this._values.linkTo = this._scheme.linkTo;
            this._values.values = [];

            if(this._scheme.value){
                this._values.values[0] = {
                    value: this._scheme.value
                }
            }
        },

        destroy: function(){
            $base();
        },

        extendValues: function(){
            // if add new properties to values
            // example
            // this._values.valueType = this._scheme.valueType;
        },

        getKey: function(){
            return this._key;
        },

        getParent: function(){
            return this.options.parent;
        },

        getRenderName: function(){
            return this._scheme.render;
        },

        getSchemeController: function(){
            return this._schemeController;
        },

        getValueByKey: function(){
            return this._schemeController.getValueByKey(this._scheme.linkTo);
        },

        getValues: function(){
            return this._values;
        },

        validate: function(){
            var res = {
                name: this._scheme.name
            };

            if(this._scheme.require && (this._values.values.length === 0 || !this._values.values[0].value)){
                res.valueNotExist = true;
            }

            return res;
        },

        validateWarning: function(){
            // todo
        }
    }
}