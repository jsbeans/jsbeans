{
	$name: 'JSB.Controls.Navigator',
	$parent: 'JSB.Controls.Control',
	$client: {
	    _clickX: null,
	    _noClick: false,

	    $constructor: function(opts){
	        $base(opts);

			this.addClass('jsb-navigator');
			this.loadCss('navigator.css');

			this._leftScroll = this.$('<div class="leftScroll hidden"></div>');
			this.append(this._leftScroll);
			this._leftScroll.click(function(){
			    var pos = $this._navigatorPane.position().left + 30;
			    pos = pos > 0 ? 0 : pos;
			    $this._navigatorPane.css({left: pos});
			    $this._changeButtonVisibility(pos);
			});

			this._navigatorPane = this.$('<ul class="navigatorPane"></ul>');
			this.append(this._navigatorPane);

			this._rightScroll = this.$('<div class="rightScroll hidden"></div>');
			this.append(this._rightScroll);
			this._rightScroll.click(function(){
			    var pos = $this._navigatorPane.position().left - 30;
			    pos = pos < $this.getElement().outerWidth() - $this._navigatorPane.width() ? $this.getElement().outerWidth() - $this._navigatorPane.width() : pos;
			    $this._navigatorPane.css({left: pos});
			    $this._changeButtonVisibility(pos);
			});

			this._navigatorPane.mousedown(function(e){
			    if($this._navigatorPane.width() > $this.getElement().outerWidth()){
                    $this._clickX = e.pageX;
                    $this._navigatorPane.addClass('moving');
                    //document.body.style.cursor = 'move';

                    $this._navigatorPane.on('mousemove.navigator', function(e){
                        var pos = $this._navigatorPane.position().left - $this._clickX + e.pageX;
                        pos = pos > 0 ? 0 : pos < $this.getElement().outerWidth() - $this._navigatorPane.width() ? $this.getElement().outerWidth() - $this._navigatorPane.width() : pos;
                        $this._navigatorPane.css({left: pos});
                    });

                    $this.$(document).on('mouseup.navigator', function(e){
                        $this._noClick = true;
                        $this._navigatorPane.off('mousemove.navigator');
                        $this.$(document).off('mouseup.navigator');
                        $this._navigatorPane.removeClass('moving');
                        //document.body.style.cursor = 'default';
                    });
			    }
			});

			this.getElement().resize(function(){
			    $this._changeButtonVisibility();
			});
        },

        options: {
            onclick: null
        },

        _elements: [],

        addElement: function(el){
            if(this._navigatorPane.children().length > 0){
                this._navigatorPane.append('<li></li>');
            }

            var element = this.$('<li></li>');
            if(JSB.isInstanceOf(el.element, 'JSB.Controls.Control') || JSB.isInstanceOf(el.element, 'JSB.Widgets.Control')){
                element.append(el.element.getElement());
            } else {
                element.append(el.element);
            }

            var index = this._elements.push({
                key: el.key,
                element: element
            });

            if(JSB.isFunction(this.options.onclick)){
                element.click(function(){
                    if($this._noClick){ return; }

                    $this.gotoElement(el.key);
                    $this.options.onclick.call($this, el.key, index - 1);
                });
            }

            this._navigatorPane.append(element);
        },

        gotoElement: function(key){
            var elements = this._navigatorPane.find('li:nth-child(odd)'),
                index;

            for(index = 0; index < this._elements.length; index++){
                if(this._elements[index].key === key){
                    break;
                }
            }

            this._elements.splice(index + 1, this._elements.length);

            this.$(elements[index]).nextAll().remove();
        },

        insertElement: function(el){
            // todo
        },

        removeElement: function(key){
            // todo
        },

        _changeButtonVisibility: function(left){
            if(!JSB.isDefined(left)){
                left = $this._navigatorPane.position().left;
            }

            if(left === 0){
                this._leftScroll.addClass('hidden');
            } else {
                this._leftScroll.removeClass('hidden');
            }

            if(this.getElement().outerWidth() - this._navigatorPane.width() === left){
                this._rightScroll.addClass('hidden');
            } else {
                this._rightScroll.removeClass('hidden');
            }
        }
    }
}