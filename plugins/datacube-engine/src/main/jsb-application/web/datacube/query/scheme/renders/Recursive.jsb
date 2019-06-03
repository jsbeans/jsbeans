/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Recursive',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$recursive',

	$client: {
	    $require: ['DataCube.Query.Controls.FieldComparison',
	               'css:Recursive.css'],

	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('recursiveQueryRender');

            // create header
            var header = this.$('<header>' + this.getScheme().category + ': ' + this.getScheme().displayName + '</header>');
            this.append(header);

            this.bindMenu(this.createMainMenuOptions());

            // $start
            var startContainer = this.$('<div class="startContainer"></div>');
            this.append(startContainer);

	        var start = this.$('<div class="operator">$start</div>');
            startContainer.append(start);

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
            startContainer.append(startRender);

            // $joinedNext
            var joinedNextContainer = this.$('<div class="joinedNextContainer"></div>');
            this.append(joinedNextContainer);

	        var joinedNext = this.$('<div class="operator">$joinedNext</div>');
            joinedNextContainer.append(joinedNext);

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
            joinedNextContainer.append(joinedNextRender);

            var filter = new FieldComparison({
	            context: '$context',
	            fields: [{
	                context: startRender.getContext(),
	                fields: startRender.getOutputFields()
	            },{
	                context: joinedNextRender.getContext(),
	                fields: joinedNextRender.getOutputFields()
	            }],
	            values: this.getValues()['$filter'],
	            onChange: function(changeDesc){
	                $this.onChange(changeDesc);
	            }
            });
            this.append(filter);

            this.connectSelect(startRender, joinedNextRender, filter);
	    },

	    changeTo: function(newKey){
	        var newValue,
	            values = this.getValues();

            if(newKey === '$from'){
                newValue = values.$start.$from || values.$joinedNext.$from;
            }

            if(newKey === '$union'){
                newValue = [];

                if(values.$start.$from){
                    newValue.push(values.$start.$from);
                }

                if(values.$joinedNext.$from){
                    newValue.push(values.$joinedNext.$from);
                }
            }

            if(newKey === '$join'){
                newValue = {
                    $left: values.$start.$from,
                    $right: values.$joinedNext.$from,
                    $filter: {}
                };
            }

	        $base(newKey, newValue || null);
	    },

	    connectSelect: function(startRender, joinedNextRender, filter){
	        function findByKey(render, key){
	            var renders = render.getChildren();

	            for(var i in renders){
	                if(renders[i].getKey() === key){
	                    return renders[i];
	                }
	            }
	        }

	        function resizeFields(firstRender, secondRender){
                var firstRenderChildren = firstRender.getChildren();

                for(var i in firstRenderChildren){
                    var firstHeight = firstRenderChildren[i].getElement().height(),
                        secondChild = findByKey(secondRender, firstRenderChildren[i].getKey()),
                        secondHeight = secondChild.getElement().height();

                    if(firstHeight > secondHeight){
                        secondChild.getElement().height(firstHeight);
                    }

                    if(firstHeight < secondHeight){
                        firstRenderChildren[i].getElement().height(secondHeight);
                    }
                }
	        }

	        function subscribe(firstRender, secondRender){
                firstRender.subscribeToChanges($this.getId(), function(changeDesc){
                    switch(changeDesc.name){
                        case 'addField':
                            secondRender.addField(changeDesc.fieldName, changeDesc.fieldDesc, true);
                            break;
                        case 'renameField':
                            secondRender.renameField(changeDesc.oldName, changeDesc.newName);
                            break;
                        case 'removeItem':
                            secondRender.removeField(changeDesc.item.getKey());
                            break;
                    }

                    filter.changeFields(0, {
                        context: startRender.getContext(),
                        fields: startRender.getOutputFields()
                    });

                    filter.changeFields(1, {
                        context: joinedNextRender.getContext(),
                        fields: joinedNextRender.getOutputFields()
                    });
                });

                firstRender.getElement().resize(function(){
                    if(Math.ceil(firstRender.getElement().height()) === Math.ceil(secondRender.getElement().height())){
                        return;
                    }

                    resizeFields(firstRender, secondRender);
                });
	        }

	        var startSelect = findByKey(startRender, '$select'),
	            joinedNextSelect = findByKey(joinedNextRender, '$select');

            subscribe(startSelect, joinedNextSelect);
            subscribe(joinedNextSelect, startSelect);

            JSB.defer(function(){
                resizeFields(startSelect, joinedNextSelect);
            }, 500);
	    }
	}
}