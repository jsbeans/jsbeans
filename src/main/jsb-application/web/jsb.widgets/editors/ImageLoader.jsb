/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.ImageLoader',
	$parent: 'JSB.Widgets.Editor',
	$require: ['css:ImageLoader.css'],
	$client: {
		
		_imgData: null,

		$constructor: function(opts){
			$base(opts);
			this.addClass('imageLoader');

			
			this.img = this.$('<img class="image" />');
			this.append(this.img);
			this.input = this.$('<input type="file" multiple style="display: none;" />');
			this.append(this.input);
			
			if(this.options.width){
				this.img.css('width', this.options.width);
			}
			if(this.options.height){
				this.img.css('height', this.options.height);
			}
			if(this.options.size){
				this.img.css('max-width', this.options.size);
				this.img.css('max-height', this.options.size);
			}
			
			if(this.options.value){
			    this.setData(this.options.value);
			}


			this.getElement().click(function(evt){
				if($this.isReadonly()){
					return;
				}
				if(evt.target == $this.input.get(0)){
					return;
				}
				$this.input.trigger('click');
			});
			
			this.input.change(function(){
				if(!this.files || this.files.length == 0){
					return;
				}
				$this._loadFromFile(this.files[0]);
			});
		},

		options: {
		    readonly: false,
			onChange: null
		},
		
		_loadFromFile: function(file){
			var prefixes = {
				'image/png': true,
				'image/svg+xml': true,
				'image/jpeg': true,
				'image/gif': true
			};
			var name = file.name;
			var size = file.size;
			var type = file.type;
			if(!prefixes[type]){
				return;
			}
			
			var reader = new FileReader();
			reader.onload = function(){
				var content = reader.result;
				var base64Data = JSB().Base64.encode(content);
				var imageStr = 'data:' + type + ';base64,' + base64Data;
				$this.setData(imageStr);
				if($this.options.onChange){
					$this.options.onChange.call($this, imageStr);
				}
			}
			reader.readAsArrayBuffer(file);
		},

		setData: function(val){
			this._imgData = val;
			$this.img.attr('src', this._imgData);
		},

		setReadonly: function(b){
			this.options.readonly = b;
		},

		isReadonly: function(){
			return this.options.readonly;
		},

		getData: function(){
			return this._imgData;
		},


		// events
		_onChange: function(color){
		    this._color = color;

		    if(this.options.onChange){
                this.options.onChange.call(this, color);
            }
		}
	}
}