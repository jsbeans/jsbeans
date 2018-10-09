{
	$name: 'JSB.Controls.Positioner',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        $base(opts);

			this.addClass('jsb-positioner');
			$jsb.loadCss('positioner.css');

            this.currentVal = this.$('<div class="curVal"></div>');
            this.append(this.currentVal);

            this.dropDownBtn = this.$('<i class="dropDownBtn"></i>');
            this.append(this.dropDownBtn);

            this.dropDown = this.$('<div class="dropDown hidden"></div>');
            this.append(this.dropDown);

            function ddToggle(evt){
                evt.stopPropagation();

                if($this.dropDown.hasClass('hidden')){
                    $this.dropDown.removeClass('hidden');

                    var top = $this.getElement().offset().top,
                        elementHeight = $this.getElement().height(),
                        ddHeight = $this.dropDown.outerHeight(),
                        bodyHeight = $this.$(window).height();

                    if(bodyHeight <= top + elementHeight + ddHeight){
                        $this.dropDown.css('top', 'initial');
                        $this.dropDown.css('bottom', elementHeight);
                    } else {
                        $this.dropDown.css('top', elementHeight);
                        $this.dropDown.css('bottom', 'initial');
                    }

                    $this.$(document).on('click.comboEditor_closeDD', function(evt){
                        if(!$this.dropDown.is(evt.target) && $this.dropDown.has(evt.target).length === 0){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                        }
                    });

                    return;
                }

                $this.dropDown.addClass('hidden');
            }

            this.dropDownBtn.click(ddToggle);
            this.currentVal.click(ddToggle);

			if(this.options.positions){
			    this.setPositions(this.options.positions);
			}

			if(this.options.value){
			    this.setValue(this.options.value, true);
			}
	    },

	    options: {
	        positions: null,
	        value: null
	    },

	    getValue: function(){
	        if(this._value){
	            return this._value.key;
	        }
	    },

	    setPositions: function(positions){
	        this.dropDown.empty();
	        this._positions = {};

	        if(!JSB.isArray(positions)){
	            positions = [positions];
	        }

	        for(var i = 0; i < positions.length; i++){
	            if(!JSB.isArray(positions[i])){
	                positions[i] = [positions[i]];
	            }

	            var str = this.$('<div class="string"></div>');

	            for(var j = 0; j < positions[i].length; j++){
	                if(JSB.isDefined(positions[i][j])){
                        var el = this.$('<div></div>');

                        el.css('width', 100 / positions[i].length + '%');

                        (function(i, j){
                            el.click(function(){
                                $this.dropDown.addClass('hidden');
                                $this.$(document).off('click.comboEditor_closeDD');
                                $this.setValue(positions[i][j].key);
                            });
                        })(i, j)

                        this._positions[positions[i][j].key] = {
                            name: positions[i][j].name,
                            element: el
                        }
	                } else {
	                    var el = this.$('<div class="empty"></div>');
	                }

	                str.append(el);
	            }

	            this.dropDown.append(str);
	        }
	    },

	    setValue: function(value, hEvt){
	        if(!this._positions[value]){
	            return;
	        }

	        if(this._value){
	            this._value.element.removeClass('selected');
	        }

	        this._value = {
	            key: value,
	            element: this._positions[value].element
	        }
	        this._positions[value].element.addClass('selected');

	        this.currentVal.empty().append(this._positions[value].name);

	        if(!hEvt && JSB.isFunction(this.options.onchange)){
	            this.options.onchange.call(this, this._value.key);
	        }
	    }
	}
}