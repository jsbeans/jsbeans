{
	$name: 'DataCube.CubePanel',
	$parent: 'JSB.Widgets.Widget',
    $client: {
        $require: ['JSB.Controls.ScrollBox',
                   'JSB.Controls.Checkbox',
                   'JSB.Controls.Switch',
                   'css:CubePanel.css'],

        $constructor: function(opts){
            $base(opts);

            this.addClass('cubePanel');

            var caption = this.$('<header>Поля и измерения куба</header>');
            this.append(caption);

            var onlyDimensionsCheckbox = new Switch({
                title: 'Только измерения',
                onChange: function(b){
                    $this.getElement().toggleClass('onlyDimensions');
                }
            });
            caption.append(onlyDimensionsCheckbox.getElement());

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

            var fieldBox = d3.select(this.cubeFields.getElement().get(0)),
                tooltip = null;

            // enter
            fieldBox.selectAll('.field').data(opts.fields).enter().append(function(d){
                var el = $this.$('<div class="field"></div>');

                el.append(new Checkbox({
                    onChange: function(b){
                        if(b){
                            el.addClass('dimension');
                            d.isDimension = true;
                            $this.addDimension(this.getLabel());
                        } else {
                            el.removeClass('dimension');
                            d.isDimension = false;
                            $this.removeDimensions(this.getLabel());
                        }
                    }
                }).getElement());

                el.append('<div class="type"></div>');
                //el.append('<div class="tooltip"></div>');

                el.mouseenter(function(){
                    $this.publish('Datacube.CubeEditor.CubePanel.hoverField', {
                        field: d.key,
                        type: 'mouseIn'
                    });
                });

                el.mouseleave(function(){
                    $this.publish('Datacube.CubeEditor.CubePanel.hoverField', {
                        field: d.key,
                        type: 'mouseOut'
                    });
                });

                return el.get(0);
            });

            // update
            var cubeFields = fieldBox.selectAll('.field').data(opts.fields);

            cubeFields.classed('dimension', function(d){
                return d.isDimension;
            });

            cubeFields.classed('conflict', function(d){
                return d.hasTypesConflict;
            });

            cubeFields.select('.jsb-checkbox').attr('test', function(d){
                var cb = $this.$(this).jsb();
                cb.setLabel(d.key);
                cb.setChecked(d.isDimension, true);
            });

            cubeFields.select('.type').text(function(d){
                    if(d.type === ''){
                        this.classList.addClass('error');
                        return 'error';
                    }

                    return d.type;
                })
                .attr('type', function(d){
                    return d.type;
                });

            cubeFields.style('top', function(d, i) {
                return (i*23) + 3 + "px";
              }
            );

            // tooltip
            /*
            cubeFields.select('.tooltip').selectAll('.tooltipLine').data(function(d){
                return d.slices;
            }).enter().append(function(){
                var el = $this.$('<div class="tooltipLine"></div>');

                el.append('<div class="sliceName"></div>');
                el.append('<div class="fieldType"></div>');

                return el.get(0);
            });

            var tooltipLines = cubeFields.select('.tooltip').selectAll('.tooltipLine').data(function(d){
                return d.slices;
            });

            tooltipLines.select('.sliceName').text(function(d){
                return d.name;
            });

            tooltipLines.select('.fieldType').text(function(d){
                    return d.type;
                })
                .property('fieldKey', function(d){
                    return d.type;
                });

            cubeFields.select('.tooltip').selectAll('.tooltipLine').data(function(d){
                return d.slices;
            }).exit().remove();
            */
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
                this.cubeFields.find('.caption:not(:icontains("' + value + '"))').closest('.field').addClass('hidden');
                this.cubeFields.find('.caption:icontains("' + value + '")').closest('.field').removeClass('hidden');
            } else {
                this.cubeFields.find('.field').removeClass('hidden');
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