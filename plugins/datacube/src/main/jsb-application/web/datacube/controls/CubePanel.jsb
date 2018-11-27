{
	$name: 'DataCube.CubePanel',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $require: ['JSB.Controls.ScrollBox',
                   'JSB.Widgets.Button'
        ],

        $constructor: function(opts){
            $base(opts);

            $jsb.loadCss('CubePanel.css');
            this.addClass('cubePanel');

            var caption = this.$('<header>Измерения куба</header>');
            this.append(caption);

			var scrollBox = new ScrollBox();
			this.append(scrollBox);

            this.dimensions = this.$('<ul></ul>');
            scrollBox.append(this.dimensions);

			var btnAdd = new Button({
				cssClass: 'roundButton btn10 btnCreate',
				tooltip: 'Добавить измерение',
				onClick: function(evt){
                    $this.$('body').addClass('copyCursor');

                    $this.$(document).on('keyup.startAddDimension', function(e) {
                        if (e.key === "Escape") {
                            $this.publish('DataCube.CubeEditor.stopAddDimension');
                        }
                    });

				    $this.publish('DataCube.CubeEditor.startAddDimension');
				}
			});
			this.append(btnAdd);

            this.subscribe('DataCube.CubeEditor.stopAddDimension', function(sender, msg, obj){
                $this.$(document).off('keyup_startAddDimension');

                $this.$('body').removeClass('copyCursor');

                if(obj){
                    $this.addDimension(obj);
                }
            });
        },

        addDimension: function(obj){
            this.cube.server().addDimension(obj.field, function(res, fail){
                if(!fail){
                    $this.dimensions.append('<li>' + obj.field + '</li>');

                    $this.publish('DataCube.CubeEditor.addDimension', obj.field);
                }
            });
        },

        refresh: function(cube, dimensions){
            this.cube = cube;

            dimensions = Object.keys(dimensions);

	        var dimensionsList = d3.select(this.dimensions.get(0));
	        // enter
	        dimensionsList.selectAll('li').data(dimensions).enter().append('li');

	        // update
	        dimensionsList.selectAll('li').data(dimensions)
	            .text(function(d){
	                return d;
	            });

	        // exit
	        dimensionsList.selectAll('li').data(dimensions).exit().remove();
        }
    }
}