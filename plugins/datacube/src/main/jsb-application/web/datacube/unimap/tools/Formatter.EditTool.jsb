{
	$name: 'DataCube.Formatter.EditTool',
	$parent: 'JSB.Widgets.Tool',
	$require: [
	    'JSB.Widgets.ToolManager',
	    'JSB.Controls.Checkbox',
	    'JSB.Controls.Editor',
	    'css:Formatter.EditTool.css'
	],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'formatterEditTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					hideByEsc: true,
					cssClass: 'formatterEditToolWrapper'
				}
			});
		},

		desc: {},

		$constructor: function(opts){
		    $base(opts);

		    this.addClass('formatterEditTool');

		    this._variableBlock = this.$('<div class="variableBlock"></div>');
		    this.append(this._variableBlock);

		    // number type
            this._separator = new Checkbox({
                cssClass: 'thousandSeparator',
                label: 'Разделение тысячных',
                onChange: function(b){
                    $this.desc.isThousandSeparate = b;
                }
            });
            this._variableBlock.append(this._separator.getElement());

            var decimalsLabel = this.$('<label class="label decimalsLabel">Число знаков после запятой</label>');
            this._decimals = new Editor({
                onChange: function(val){
                    $this.desc.decimals = val;
                }
            });
            decimalsLabel.append(this._decimals.getElement());
            this._variableBlock.append(decimalsLabel);

            // date type
            /*
            var desc = '<b>Форматирование даты</b><br/>%Y - год<br/>%m - месяц<br/>%d - день<br/><a href="http://php.net/manual/en/function.strftime.php" target="_blank">Больше форматов</a>',
                description = this.$('<div class="description hidden">' + desc + '</div>'),
                msgIcon = this.createMsgIcon(description, 'desc fas fa-question-circle'),
            */
            var dateLabel = this.$('<label class="label dateLabel">Формат даты</label>');
		    this._date = new Editor({
		        onChange: function(val){
		            $this.desc.dateFormat = val;
		        }
		    });
		    dateLabel.append(this._date.getElement());
		    this._variableBlock.append(dateLabel);

		    this._textBlock = this.$('<div class="textBlock"></div>');
		    this.append(this._textBlock);

		    this._text = new Editor({
		        onChange: function(val){
		            $this.desc.key = val;
		            $this.desc.value = '"' + val + '"';
		        }
		    });
		    this._textBlock.append(this._text.getElement());

		    var applyBtn = this.$('<button class="addBtn">Изменить</button>');
		    this.append(applyBtn);
		    applyBtn.click(function(){
		        $this.apply();
		    });
		},

		apply: function(){
		    this.data.callback.call($this, this.desc);
		    this.close();
		},

		destroy: function(){
		    this._separator.destroy();
		    this._decimals.destroy();
		    this._date.destroy();
		    this._text.destroy();

		    $base();
		},

		update: function(){
		    var desc = this.data.data;

            this._variableBlock.removeClass();
            this._variableBlock.addClass('variableBlock');

		    if(desc.type === 'variable'){
		        this._variableBlock.removeClass('hidden');
		        this._textBlock.addClass('hidden');

		        switch(desc.dataType){
                    case 'number':
                    case 'integer':
                    case 'uint':
                    case 'float':
                        this._separator.setChecked(desc.isThousandSeparate, true);
                        this._decimals.setValue(desc.decimals);

                        this._variableBlock.addClass('number');
                        break;
                    case 'date':
                        this._date.setValue(desc.dateFormat);

                        this._variableBlock.addClass('date');
                        break;
		        }
		    } else {
		        this._variableBlock.addClass('hidden');
		        this._textBlock.removeClass('hidden');

		        this._text.setValue(desc.key);
		    }

		    this.desc = desc;
		}
    }
}