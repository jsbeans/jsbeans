/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2021
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2021гг.
 */

{
	$name:'JSB.Widgets.RichTextEditor',
	$parent: 'JSB.Widgets.Editor',
	$client: {
		$require: ['css:RichTextEditor.css'],
		
		options: {
			header: true,
			image: true,
			inlineimage: false,
			raw: false,
			checklist: false,
			list: true,
			placeholder: 'Напишите здесь что-нибудь',
			autofocus: true,
			align: true,
			underline: true,
			textcolor: true,
			table: true,
			
			data: null,
			
			onChange: null
		},
		
		_data: null,
		_html: null,
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('_jsb_richTextEditor');
			
			// construct module list to load
			var modules = ['tpl/editorjs/editor.js', 'tpl/editorjs/parser.js'];
			if(this.getOption('header')){
				modules.push('tpl/editorjs/header.tool.js');
			}
			if(this.getOption('image')){
				modules.push('tpl/editorjs/image.tool.js');
			}
			if(this.getOption('inlineimage')){
				modules.push('tpl/editorjs/inlineimage.tool.js');
			}
			if(this.getOption('raw')){
				modules.push('tpl/editorjs/raw.tool.js');
			}
			if(this.getOption('checklist')){
				modules.push('tpl/editorjs/checklist.tool.js');
			}
			if(this.getOption('list')){
				modules.push('tpl/editorjs/list.tool.js');
			}
			if(this.getOption('align')){
				modules.push('tpl/editorjs/align.tool.js');
			}
			if(this.getOption('underline')){
				modules.push('tpl/editorjs/underline.tool.js');
			}
			if(this.getOption('textcolor')){
				modules.push('tpl/editorjs/textcolor.tool.js');
			}
			if(this.getOption('table')){
				modules.push('tpl/editorjs/table.tool.js');
			}
			
			JSB.loadScript(modules, function(){
				$this._setupEditor();
			}, {
				chain: true
			});
		},
		
		_setupEditor: function(){
			var tools = {};
			if(this.getOption('header')){
				tools.header = {
					class: Header,
					inlineToolbar: true
				};
			}
			if(this.getOption('image')){
				tools.image = SimpleImage;
			}
			if(this.getOption('inlineimage')){
				tools.image = {
					class: InlineImage,
					inlineToolbar: true,
					config: {
						embed: {
							display: true,
						},
						unsplash: {
							display: false
						}
					}
				};
			}
			if(this.getOption('raw')){
				tools.raw = RawTool;
			}
			if(this.getOption('checklist')){
				tools.checklist = {
					class: Checklist,
					inlineToolbar: true
				};
			}
			if(this.getOption('list')){
				tools.list = {
					class: List,
					inlineToolbar: true
				};
			}
			if(this.getOption('align')){
				tools.paragraph = {
					class: Paragraph,
					inlineToolbar: true
			    }
			}
			if(this.getOption('table')){
				tools.table = {
					class: Table,
					inlineToolbar: true,
					config: {
						rows: 2,
						cols: 3,
					},
			    }
			}
			if(this.getOption('underline')){
				tools.underline = Underline;
			}
			if(this.getOption('textcolor')){
				tools.Color = {
					class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
					config: {
						colorCollections: ['#000000','#FF1300','#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
						defaultColor: '#FF1300',
						type: 'text', 
					}     
				};
				tools.Marker = {
					class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
					config: {
						defaultColor: '#FFBF00',
						type: 'marker', 
					}       
				};
			}
			
			// setup config
			var cfg = {
				holder: $this.getElement().get(0),
				tools: tools,
				logLevel: 'ERROR',
				onChange: function(){
					$this._handleOnChange();
				}
			};
			
			if($this.options.data){
				cfg.data = $this.options.data;
				$this._data = $this.options.data;
			}
			
			var ph = this.getOption('placeholder');
			if(ph && ph.length > 0){
				cfg.placeholder = ph;
			}
			
			if(this.getOption('readOnly')){
				cfg.readOnly = this.getOption('readOnly');
			}
			
			if(this.getOption('autofocus')){
				cfg.autofocus = this.getOption('autofocus');
			}
			
			// create editor
			this.editor = new EditorJS(cfg);
			this.parser = new edjsParser();
			this.editor.isReady.then(function(){
				$this.setTrigger('ready');
			});
		},
		
		_handleOnChange: function(){
			this.editor.save().then(function(outputData){
				$this._data = outputData;
				
				if($this.options.onChange){
					$this.options.onChange.call($this, $this._data);
				}
			});
		},
		
		ensureReady: function(callback){
			return $this.ensureTrigger('ready', callback);
		},
		
		clear: function(){
			$this._data = null;
			this.editor.clear();
			this.editor.save().then(function(outputData){
				$this._data = outputData;
			});
		},
		
		setData: function(obj){
			$this._data = obj;
			this.editor.render(obj);
		},
		
		getData: function(){
			return $this._data;
		},
		
		getHtml: function(){
			var data = $this.getData();
			if(data){
				return $this.parser.parse(data);	
			}
			return '';
		},
		
		getText: function(){}
	}
}