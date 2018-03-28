{
    $name: 'Datacube.ValueSelectors.StylesBindingSelector',
    $parent: 'Unimap.ValueSelectors.Basic',
    $require: ['Unimap.ValueSelector'],

    value: function(callback){
        if(this._widgetValueSelector){
            callback(this._widgetValueSelector);
            return;
        }

        this._selectorBean.server().getValues(this._values[0].value, function(res, fail){
            if(fail){
                callback();
                return;
            }

            var valueSelector = new ValueSelector({
                values: { values: res }
            });

            $this._widgetValueSelector = valueSelector.find('widgetSettings');

            callback($this._widgetValueSelector);
        });
    },

    values: function(callback){
        //
    },

    $server: {
        getValues: function(opts){
            return WorkspaceController.getWorkspace(opts.workspaceId).entry(opts.entryId).getStyles();
        }
    }
}