{
    $name: 'Datacube.Unimap.Bootstrap',
    $parent: 'Unimap.Bootstrap',

    _customRenders: [
        {
            name: 'sourceBinding',
            render: "Unimap.Render.SourceBinding"
        },
        {
            name: 'dataBinding',
            render: "Unimap.Render.DataBinding"
        },
        {
            name: 'embeddedWidget',
            render: "Unimap.Render.EmbeddedWidgetBinding"
        },
        {
            name: 'completeWidget',
            render: 'Unimap.Render.CompleteWidgetBinding'
        },
        {
            name: 'autocompleteGroup',
            render: 'Unimap.Render.AutocompleteGroup'
        }
    ],

    _customSelectors: [
        {
            name: 'sourceBinding',
            render: 'Datacube.ValueSelectors.SourceSelector'
        },
        {
            name: 'dataBinding',
            render: 'Datacube.ValueSelectors.DataBindingSelector'
        },
        {
            name: 'embeddedWidget',
            render: 'Datacube.ValueSelectors.EmbeddedWidgetBinding'
        },
        {
            name: 'autocompleteGroup',
            render: 'Unimap.ValueSelectors.Group'
        }
    ],
}