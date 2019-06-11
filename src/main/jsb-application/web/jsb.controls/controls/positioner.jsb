/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.Positioner',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:positioner.css'],
	    $constructor: function(opts){
	        $base(opts);

			this.addClass('jsb-positioner');

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

	    /*
	    * @param {object} options - опции редактора
	    *
	    * @param {string} options.dummyColor - цвет неактивной ячейки
	    *
	    * @param {[][]} options.positions - элементы расположения
	    * @param {string} [options.positions.color] - цвет ячейки
	    * @param {string|jQuery|HTMLElement|JSBElement} [options.positions.content] - содержимое ячейки
	    * @param {boolean} [options.positions.dummy] - ячейка активна?
	    * @param {string} options.positions.key - ключ ячейки. Является значением
	    *
	    * @param {string} options.value - ключ изначально выбранной ячейки
	    */
	    options: {
	        positions: null,
	        value: null
	    },

	    getValue: function(){
	        if(this._value){
	            return this._value.key;
	        }
	    },

	    setPositions: function(positions) {
	        this.dropDown.empty();
	        this._positions = {};

	        if(!JSB.isArray(positions)) {
	            positions = [positions];
	        }

	        for(var i = 0; i < positions.length; i++) {
	            if(!JSB.isArray(positions[i])) {
	                positions[i] = [positions[i]];
	            }

	            var str = this.$('<div class="string"></div>'),
	                cellWidth = 100 / positions[i].length + '%';

	            for(var j = 0; j < positions[i].length; j++) {
                    var el = this.$('<div></div>');
                    str.append(el);

                    el.css('width', 'calc('+cellWidth+' - 2px)');

                    this._positions[positions[i][j].key] = JSB.merge({}, positions[i][j], {
                        element: el
                    });

                    if(positions[i][j].color) {
                        el.css('background-color', positions[i][j].color);
                    }

                    if(positions[i][j].content) {
                        el.append(positions[i][j].content);
                    }

                    if(positions[i][j].dummy) {
                        if(positions[i][j].color) {
                            // already installed
                        } else if(this.options.dummyColor) {
                            el.css('background-color', this.options.dummyColor);
                        } /*else {
                            el.css('background-color', '#555');
                        }*/

                        el.addClass('dummy');

                        continue;
                    }

                    (function(i, j){
                        el.click(function(){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                            $this.setValue(positions[i][j].key);
                        });
                    })(i, j);
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

	        if(!hEvt && JSB.isFunction(this.options.onChange)){
	            this.options.onChange.call(this, this._value.key);
	        }
	    }
	}
}