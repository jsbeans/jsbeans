{
	$name: 'DataCube.GraphWidget.GraphNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$client: {
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);
			this.addClass('graphNode');
			this.loadCss('GraphNode.css');

			this.append(`#dot
                <div class="connector"></div>
            `);

            this.updateEntry(opts.entry);

			this._createConnectors();
		},

		destroy: function(){
		    // destroy widget
		    if(this.widget) this.widget.destroy();

		    $base();
		},

		updateEntry: function(entry){
            this.entry = entry;

            if(this.entry.nClass){
                this.addClass(this.entry.nClass);
            }

            if(this.entry.nodeCss){
                this.getElement().css(this.entry.nodeCss);
            }

            if(this.entry.cls){
                this.addClass('widgetMode');
                this.widget = new this.entry.cls();
                this.append(this.widget.getElement());
                this.widget.setWrapper(this.entry.wrapper,  JSB().clone(this.entry.value.unwrap()));
                this.widget.refresh();
            } else if(this.entry.header){
                this.addClass('simpleMode');
                this.header = this.$(`#dot
                    <div class="caption">{{=this.entry.header}}</div>
                `);
                this.append(this.header);
            }

            if(this.entry.caption){
                var caption = this.$('<div class="graphNodePopup hidden">' + this.entry.caption + '</div>');
                this.append(caption);

                this.getElement().hover(function() { caption.removeClass( "hidden" ); },
                                        function() { caption.addClass( "hidden" ); });

                this.getElement().mousemove(function(evt){
                    caption.offset({top: evt.pageY + 10, left: evt.pageX + 10 });
                });
            }
		},

		_createConnectors: function(){
		    this.connector = this.installConnector('nodeConnector', {
		        origin: this.find('.connector'),
		    });
		}
	}
}