{
	$name: 'DataCube.CubePanel',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $require: ['JSB.Controls.ScrollBox',
                   'JSB.Controls.Checkbox',
                   'JSB.Widgets.ToolManager'],

        $constructor: function(opts){
            $base(opts);

            $jsb.loadCss('CubePanel.css');
            this.addClass('cubePanel');

            var caption = this.$('<header>Поля и измерения куба</header>');
            this.append(caption);

			// select fields
			this.cubeFields = new ScrollBox({
			    xAxisScroll: false
			});
			this.append(this.cubeFields);

            this.subscribe('DataCube.CubeEditor.search', function(sender, msg, value){
                $this.search(value);
            });

			this.subscribe('DataCube.Model.Cube.updateCubeFields', {session: true}, function(sender, msg, opts){
			    $this.refresh(null, opts);
			});
        },

        addDimension: function(field){
            this.cube.server().addDimension(field, function(res, fail){
                if(!fail){
                    $this.publish('DataCube.CubeEditor.toggleDimension', {field: field, isDimension: true});
                }
            });
        },

        refresh: function(cube, opts){
            if(cube){
                this.cube = cube;
            }

            var fieldsArr = Object.keys(opts.fields).sort(),
                cubeFields = d3.select(this.cubeFields.getElement().get(0));

            // enter
            cubeFields.selectAll('.jsb-checkbox').data(fieldsArr).enter()
                      .append(function(){
                            return new Checkbox({
                                onChange: function(b){
                                    if(b){
                                        $this.addDimension(this.getLabel());
                                    } else {
                                        $this.removeDimensions(this.getLabel());
                                    }
                                }
                            }).getElement().get(0);
                        });

            // update
            cubeFields.selectAll('.jsb-checkbox').data(fieldsArr).attr('test', function(d){
                var cb = $this.$(this).jsb();
                cb.setLabel(d);
                cb.setChecked(opts.dimensions[d], true);
            });

            // exit
            cubeFields.selectAll('.jsb-checkbox').data(fieldsArr).exit().remove();
        },

        removeDimensions: function(field){
            this.cube.server().removeDimension(field, function(res, fail){
                $this.publish('DataCube.CubeEditor.toggleDimension', {field: field, isDimension: false});
            });
        },

        search: function(value){
		    if(value){
                this.cubeFields.find('.caption:not(:icontains("' + value + '"))').closest('.jsb-checkbox').addClass('hidden');
                this.cubeFields.find('.caption:icontains("' + value + '")').closest('.jsb-checkbox').removeClass('hidden');
            } else {
                this.cubeFields.find('.jsb-checkbox').removeClass('hidden');
            }
        }
    }
}