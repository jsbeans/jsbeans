{
    $name: 'Datacube.Unimap.Bootstrap',
    $parent: 'Unimap.Bootstrap',

    _customRenders: [{
        name: 'sourceBinding',
        render: "Unimap.Render.SourceBinding"
    },{
        name: 'parserBinding',
        render: "Unimap.Render.ParserSourceBinding"
    },{
        name: 'dataBinding',
        render: "Unimap.Render.DataBinding"
    },{
        name: 'embeddedWidget',
        render: "Unimap.Render.EmbeddedWidgetBinding"
    },{
        name: 'completeWidget',
        render: 'Unimap.Render.CompleteWidgetBinding'
    },{
        name: 'entryBinding',
        render: 'Unimap.Render.EntryBinding'
    },{
        name: 'autocompleteGroup',
        render: 'Unimap.Render.AutocompleteGroup'
    },{
        name: 'styleBinding',
        render: 'Unimap.Render.StylesBinding'
    },{
        name: 'namesBinding',
        render: 'Unimap.Render.NamesBinding'
    },{
        name: 'formatter',
        render: 'Unimap.Render.Formatter'
    },{
        name: 'joinFilter',
        render: 'Unimap.Render.JoinFilterBinding'
    }],

    _customSelectors: [{
        name: 'sourceBinding',
        render: 'Datacube.ValueSelectors.SourceSelector'
    },{
        name: 'dataBinding',
        render: 'Datacube.ValueSelectors.DataBindingSelector'
    },{
        name: 'entryBinding',
        render: 'Datacube.ValueSelectors.EntryBinding'
    },{
        name: 'embeddedWidget',
        render: 'Datacube.ValueSelectors.EmbeddedWidgetBinding'
    },{
        name: 'autocompleteGroup',
        render: 'Unimap.ValueSelectors.Group'
    },{
        name: 'formatter',
        render: 'Datacube.ValueSelectors.Formatter'
    },{
        name: 'parserBinding',
        render: 'Datacube.ValueSelectors.SourceSelector'
    },{
        name: 'joinFilter',
        render: 'Datacube.ValueSelectors.JoinFilterSelector'
    }]
}