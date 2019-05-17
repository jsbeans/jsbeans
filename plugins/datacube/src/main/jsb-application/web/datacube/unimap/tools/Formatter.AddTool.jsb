{
	$name: 'DataCube.Formatter.AddTool',
	$parent: 'JSB.Widgets.Tool',
	$require: [
	    'JSB.Widgets.ToolManager',
	    'JSB.Controls.Editor',
	    'css:Formatter.AddTool.css'
	],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'formatterAddTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					hideByEsc: true,
					cssClass: 'formatterAddToolWrapper'
				}
			});
		},

		selected: {
		    type: null,
		    value: null
		},

		$constructor: function(opts){
		    $base(opts);

		    this.addClass('formatterAddTool');

		    this._itemsList = this.$('<ul class="itemsList"></ul>');
		    this.append(this._itemsList);

		    this._variableItem = this.$('<li class="selected">Переменная</li>');
		    this._itemsList.append(this._variableItem);
		    this._variableItem.click(function(){
		        $this.selectItem($this._variableItem, 'variable');
		    });

		    this._textItem = this.$('<li>Текст</li>');
		    this._itemsList.append(this._textItem );
		    this._textItem .click(function(){
		        $this.selectItem($this._textItem , 'text');
		    });

		    this._itemsDesc = this.$('<div class="itemsDesc"></div>');
		    this.append(this._itemsDesc);

		    this._textOpts = new Editor({
		        onChange: function(val){
		            $this.selected.key = val;
		            $this.selected.value = '"' + val + '"';
		        }
		    });

		    this._variablesList = this.$('<ul class="variablesList"></ul>');
		    this._itemsDesc.append(this._variablesList);

		    var applyBtn = this.$('<button class="addBtn">Добавить</button>');
		    this.append(applyBtn);
		    applyBtn.click(function(){
		        $this.apply();
		    });
		},

		apply: function(){
		    this.data.callback.call($this, this.selected);
		    this.close();
		},

		selectItem: function(element, type){
		    this._itemsList.find('li').removeClass('selected');
		    element.addClass('selected');

		    this.selected = {
		        type: type
		    };

		    if(type === 'variable'){
		        this._textOpts.detach();
		        this._itemsDesc.append(this._variablesList);
		    } else {
		        this._variablesList.detach();
		        this._itemsDesc.append(this._textOpts.getElement());

		        this.selected.key = '';
		        this.selected.value = '""';
		    }
		},

        update: function(){
		    var variables = $this.data.data.variables;

		    this._variablesList.empty();

		    for(var i = 0; i < variables.length; i++){
		        var item = this.$('<li key="' + variables[i].key + '" dataType="' + variables[i].type + '">' + variables[i].value + '</li>');
		        item.click(function(evt){
		            $this._variablesList.find('li').removeClass('selected');

		            var target = $this.$(evt.target);

		            target.addClass('selected');
		            $this.selected.key = target.attr('key');
		            $this.selected.dataType = target.attr('dataType');
		            $this.selected.value = target.text();
		        });

		        this._variablesList.append(item);
		    }

		    this.selectItem(this._variableItem, 'variable');
		}
	}
}