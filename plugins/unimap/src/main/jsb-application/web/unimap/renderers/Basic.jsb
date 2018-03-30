{
	$name: 'Unimap.Render.Basic',
	$parent: 'JSB.Controls.Control',
	$require: ['Unimap.Controller'],
    $client: {
        $constructor: function(opts){
            $base(opts);
            this.addClass('basicRender');
            this.loadCss('Basic.css');

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

            name.append(this.createMsgIcon(description, 'desc fas fa-question-circle'));
        },

        createErrorDesc: function(name){
            if(!name){
                return;
            }

            var error = this.$('<div class="error hidden"></div>');
            name.append(error);

            var icon = this.createMsgIcon(error, 'error fas fa-exclamation-triangle hidden');
            name.append(icon);

            this._errorDesc ={
                desc: error,
                icon: icon
            }
        },

        createInnerScheme: function(scheme, values, onchange){
            return new Controller({
                scheme: scheme,
                values: {values: values},
                onchange: onchange,
                rendersMap: this._schemeController.getRenderMap(),
            });
        },

        createMsgIcon: function(msg, cssClass){
            var icon = this.$('<i class="' + cssClass + '" aria-hidden="true"></i>');

            icon.hover(function() { msg.removeClass( "hidden" ); },
                       function() { msg.addClass( "hidden" ); });

            icon.mousemove(function(evt){
                if(msg.hasClass('show')) return;

                var descWidth = msg.outerWidth(),
                    descHeight = msg.outerHeight(),
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

                msg.offset({top: top + 15, left: left + 15 });
            });

            icon.click(function(evt){
               evt.stopPropagation();

               msg.toggleClass('show');

               var descWidth = msg.outerWidth(),
                   descHeight = msg.outerHeight(),
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

               msg.offset({top: top + 15, left: left + 15 });
            });

            return icon;
        },

        createRender: function(key, scheme, values, opts){
            return this._schemeController.createRender(this, key, scheme, values, opts);
        },

        createRequireDesc: function(name){
            if(!name || !this._scheme.require){
                return;
            }

            var warning = this.$('<div class="warning hidden">Это поле обязательно для заполнения!</div>');
            name.append(warning);

            var hidden = this._scheme.require && (this._values.values.length === 0 || !this._values.values[0].value) ? '' : ' hidden';

            this._warningIcon = this.createMsgIcon(warning, 'warn fas fa-exclamation-triangle' + hidden);

            name.append(this._warningIcon);
        },

        createValues: function(){
            this._values.checked = this._scheme.optional === 'checked' ? true : undefined;
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
            this._values.render = this._scheme.render;
            this._values.defaultValue = this._scheme.defaultValue;
            this._values.valueType = this._scheme.valueType;
            this._values.linkTo = this._scheme.linkTo;
        },

        findRenderByKey: function(key){
            return this._schemeController.findRenderByKey(key);
        },

        findRendersByKey: function(key){
            return this._schemeController.findRendersByKey(key);
        },

        getCommonGroupValues: function(commonGroup){
            return this._schemeController.getCommonGroupValues(commonGroup);
        },

        getKey: function(){
            return this._key;
        },

        getName: function(){
            return this._values.name || this._scheme.name;
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

        hideError: function(msg){
            if(!this._errorDesc){
                throw new Error('Error description is not defined');
            }

            this._errorDesc.icon.addClass('hidden');
        },

        onchange: function(){
            // check require
            if(this._warningIcon){
                if(this._scheme.require && (this._values.values.length === 0 || !this._values.values[0].value)){
                    this._warningIcon.removeClass('hidden');
                } else {
                    this._warningIcon.addClass('hidden');
                }
            }

            if(JSB.isFunction(this.options.onchange)){
                this.options.onchange.call(this, this._values);
            }
        },

        showError: function(msg){
            if(!this._errorDesc){
                throw new Error('Error description is not defined');
            }

            this._errorDesc.desc.html(msg);
            this._errorDesc.icon.removeClass('hidden');
        },

        validate: function(){
            var res = {
                name: this._scheme.name
            };

            if(this._scheme.require && (this._values.values.length === 0 || !this._values.values[0].value)){
                res.valueNotExist = true;
            }

            if(Object.keys(res).length > 1){
                return res;
            }
        }
    }
}