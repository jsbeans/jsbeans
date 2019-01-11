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
                    $this.sort();
                    $this.publish('DataCube.CubeEditor.toggleDimension', {field: field, isDimension: true});
                }
            });
        },

        refresh: function(cube, opts){
            if(cube){
                this.cube = cube;
            }

            var fieldBox = d3.select(this.cubeFields.getElement().get(0));

            // enter
            fieldBox.selectAll('.field').data(opts.fields).enter().append(function(d){
                var el = $this.$('<div class="field"></div>');

                el.append(new Checkbox({
                    onChange: function(b){
                        if(b){
                            this.addClass('dimension');
                            d.isDimension = true;
                            $this.addDimension(this.getLabel());
                        } else {
                            this.removeClass('dimension');
                            d.isDimension = false;
                            $this.removeDimensions(this.getLabel());
                        }
                    }
                }).getElement());

                el.append('<div class="type"></div>');

                return el.get(0);
            });

            // update
            var cubeFields = fieldBox.selectAll('.field').data(opts.fields);

            cubeFields.select('.jsb-checkbox').attr('test', function(d){
                var cb = $this.$(this).jsb();
                cb.setLabel(d.key);
                cb.setChecked(d.isDimension, true);
                cb.classed('dimension', d.isDimension);
            });

            // todo: create tooltip with description
            cubeFields.select('.type').html(function(d){
                if(d.hasTypesConflict){
                    this.classList.add('conflict');
                } else {
                    this.classList.remove('conflict');
                }

                return d.type;
            });

            cubeFields.style('top', function(d, i) {
                return (i*23) + 3 + "px";
              }
            );

            // exit
            fieldBox.selectAll('.field').data(opts.fields).exit().remove();
        },

        removeDimensions: function(field){
            this.cube.server().removeDimension(field, function(res, fail){
                $this.sort();
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
        },

        sort: function(){
		    d3.select(this.cubeFields.getElement().get(0)).selectAll('.field')
                .sort(function(a, b){
                    if(a.isDimension && !b.isDimension){
                        return -1;
                    }

                    if(!a.isDimension && b.isDimension){
                        return 1;
                    }

                    if(a.key > b.key){
                        return 1;
                    }

                    if(a.key < b.key){
                        return -1;
                    }

                    return 0;
                })
                .style('top', function(d, i) {
                    return (i*23) + 3 + "px";
                  }
                );
        }
    }
}