{
	$name: 'JSB.Controls.Navigator',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        $base(opts);

			this.addClass('jsb-navigator');
			this.loadCss('navigator.css');

			this._leftScroll = this.$('<div class="leftScroll hidden"></div>');
			this.append(this._leftScroll);

			this._navigatorPane = this.$('<ul class="navigatorPane"></ul>');
			this.append(this._navigatorPane);

			this._rightScroll = this.$('<div class="rightScroll hidden"></div>');
			this.append(this._rightScroll);

			/*
			this._rightScroll.hover(function(){

			}, function(){

			});
			*/
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

            this._elements.splice(index, this._elements.length);

            this.$(elements[index]).nextAll().remove();
        },

        insertElement: function(el){
            // todo
        },

        removeElement: function(key){
            // todo
        }
    }
}