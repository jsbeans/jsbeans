/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
    $name: 'Datacube.Selectors.Formatter',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'formatter',

    getBindingFields: function(){
        var result = [],
            res;

        // old settings
        if(this._values[0] && this._values[0].advancedValue){
            var res = this._values[0].advancedValue.match(/{binding\$[^}]+/g);
        }

        if(this._values[0] && this._values[0].value){
            var res = this._values[0].value.match(/{binding\$[^}]+/g);
        }

        if(res){
            for(var i = 0; i < res.length; i++){
                result.push(res[i].replace('{binding$', '').replace(/:.+/, ""));
            }
        }

        return result;
    },

    value: function(){
        if(!this._values || !this._values[0]){
            return JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
        }

        if(this._values[0].value){
            return this._values[0].value.replace(/binding\$/g, '');
        }

        // old settings
        /***/
        if(JSB.isDefined(this._values[0].isAdvancedSettings)){
            if(this._values[0].isAdvancedSettings){
                return this._values[0].advancedValue.replace(/binding\$/g, '') || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
            } else {
                return this._values[0].baseValue || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
            }
        }

        if(JSB.isDefined(this._values[0].baseValue)){
            return this._values[0].baseValue || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
        }

        if(JSB.isDefined(this._values[0].advancedValue)){
            return this._values[0].advancedValue.replace(/binding\$/g, '') || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
        }
        /***/

        return $base();
    }
}