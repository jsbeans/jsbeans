{
    $name: 'Unimap.Bootstrap',
    $singleton: true,

    _rendersMap: {},
    _valueSelectorsMap: {},

    _basicRenders: [
        {
            name: 'group',
            render: 'Unimap.Render.Group'
        },
        {
            name: 'item',
            render: 'Unimap.Render.Item'
        },
        {
            name: 'select',
            render: 'Unimap.Render.Select'
        }
    ],

    _basicSelectors: [
        {
            name: 'group',
            render: 'Unimap.ValueSelectors.Group'
        },
        {
            name: 'select',
            render: 'Unimap.ValueSelectors.Select'
        }
    ],

    _customRenders: [],
    _customSelectors: [],

    $constructor: function(){
        this.createRendersMap();
        this.createValueSelectorsMap();
    },

    createRendersMap: function(){
        var rendersDescriptions = this._basicRenders.concat(this._customRenders);

        for(var i = 0; i < rendersDescriptions.length; i++){
            (function(i){
                JSB.lookup(rendersDescriptions[i].render, function(cls){
                    $this._rendersMap[rendersDescriptions[i].name] = cls;
                });
            })(i);
        }
    },

    createValueSelectorsMap: function(){
        var selectorsDescriptions = this._basicSelectors.concat(this._customSelectors);

        for(var i = 0; i < selectorsDescriptions.length; i++){
            (function(i){
                JSB.lookup(selectorsDescriptions[i].render, function(cls){
                    $this._valueSelectorsMap[selectorsDescriptions[i].name] = cls;
                });
            })(i);
        }
    },

    getRendersMap: function(){
        return this._rendersMap;
    },

    getValueSelectorsMap: function(){
        return this._valueSelectorsMap;
    }
}