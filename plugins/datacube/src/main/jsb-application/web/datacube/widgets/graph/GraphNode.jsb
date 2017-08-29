{
	$name: 'DataCube.GraphWidget.GraphNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$client: {
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);
			this.addClass('graphNode');
			this.loadCss('GraphNode.css');

			this.entry = opts.entry;

			this.append(`#dot
                <div class="connector top"></div>
                <div class="connector bottom"></div>
            `);

			if(this.entry.widget){
			    this.addClass('widgetMode');
			    this.widget = new this.entry.widget.wClass();
			    this.append(this.widget.getElement());
			    this.widget.setWrapper(this.entry.widget.wrapper,  JSB().clone(this.entry.widget.value.unwrap()));
			    this.widget.refresh();
			} else if(this.entry.header){
			    this.addClass('simpleMode');
			    this.header = this.$(`#dot
                    <div class="caption">{{=this.entry.header}}</div>
                `);
                this.append(this.header);
			}

			this._createConnectors();
		},

		destroy: function(){
		    // destroy widget
		    if(this.widget) this.widget.destroy();

		    $base();
		},

		_createConnectors: function(){
		    this.connector = this.installConnector('nodeConnector', {
		        origin: this.find('.connector'),
		    });
		}
	}
}