{
	$name: 'DataCube.Query.Renders.Recursive',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$recursive',

	$client: {
	    $require: ['css:Recursive.css'],

	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('recursiveQueryRender');

            // create header
            var header = this.$('<header>' + this.getScheme().category + ': ' + this.getScheme().displayName + '</header>');
            this.append(header);

            this.installMenuEvents({ element: header });

	        // $start
	        var start = this.$('<div class="operator">$start</div>');
            this.append(start);

	        this.append(this.createSeparator(true));

            var startRender = this.createRender({
                allowChangeSource: false,
                allowChild: ['$filter', '$postFilter'],
                allowDelete: false,
                allowWrap: false,
                key: '$start',
                noHeader: true,
                renderName: '$query',
                scope: this.getValues()['$start']
            });
            this.append(startRender);

	        // $joinedNext
	        var joinedNext = this.$('<div class="operator">$joinedNext</div>');
            this.append(joinedNext);

	        this.append(this.createSeparator(true));

            var joinedNextRender = this.createRender({
                allowChangeSource: false,
                allowChild: ['$filter', '$postFilter'],
                allowDelete: false,
                allowWrap: false,
                key: '$joinedNext',
                noHeader: true,
                renderName: '$query',
                scope: this.getValues()['$joinedNext']
            });
            this.append(joinedNextRender);

	        // $filter
	        var filter = this.$('<div class="operator">$filter</div>');
            this.append(filter);

            var filterRender = this.createRender({
                allowSourceFields: true,
                allowOutputFields: false,
                allowDelete: false,
                allowWrap: false,
                key: '$filter',
                scope: this.getValues()
            });

            this.append(filterRender);
	    }
	}
}