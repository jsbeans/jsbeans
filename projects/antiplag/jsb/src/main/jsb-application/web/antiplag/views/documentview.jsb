JSB({
	name:'Antiplag.DocumentView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.ScrollBox', 'Antiplag.DocumentRenderer', 'JSB.Widgets.ToolBar', 'JSB.Widgets.Button', 'Antiplag.DocumentEditor'],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentView');
			this.loadCss('documentview.css');
			
			this.toolbar = new JSB.Widgets.ToolBar();
			this.append(this.toolbar);
			
			if(!this.options.mode){
				this.options.mode = 'view';
			}
			
			this.toolbar.addItem({
				key: 'saveDocument',
				tooltip: 'Сохранить документ',
				element: '<div class="icon"></div>',
				disabled: true,
				click: function(){
					if(self.options.mode == 'edit'){
						self.saveText();
					}
				}
			});
			
			
			this.toolbar.addItem({
				key: 'editMode',
				group: 'mode',
				tooltip: 'Режим редактирования',
				checked: this.options.mode == 'edit',
				disabled: this.options.document.getType() != 'TXT',
				element: '<div class="icon"></div>',
				cssClass: 'right',
				click: function(){
					self.switchMode('edit');
				}
			});

			this.toolbar.addItem({
				key: 'viewMode',
				group: 'mode',
				tooltip: 'Режим просмотра',
				checked: this.options.mode == 'view',
				element: '<div class="icon"></div>',
				cssClass: 'right',
				click: function(){
					self.switchMode('view');
				}
			});

			this.editorContainer = this.$('<div class="editorContainer"></div>');
			this.append(this.editorContainer);
			this.docEditor = new Antiplag.DocumentEditor({
				onChangeText: function(txt, oldTxt){
					self.toolbar.enableItem('saveDocument', txt != oldTxt);
				}
			});
			this.editorContainer.append(this.docEditor.getElement());
			
			this.scrollBox = new JSB.Widgets.ScrollBox();
			this.append(this.scrollBox);
			this.scrollBox.addClass('docScroll');
			this.docRenderer = new Antiplag.DocumentRenderer();
			this.scrollBox.append(this.docRenderer);
			
			
			this.constructView();
			
			this.subscribe('relDocHighlight', function(sender, msg, params){
				if(params.document != self.options.document){
					return;
				}
				self.docRenderer.highlight(params.originalHighlight);
			});
		},
		
		switchMode: function(mode){
			var self = this;
			if(this.options.mode == mode){
				return;
			}
			if(this.options.mode == 'edit' && this.docEditor.isTextChanged()){
				this.saveText(function(){
					self.options.mode = mode;
					self.constructView();
				});
			} else {
				this.options.mode = mode;
				this.constructView();
			}
		},
		
		constructView: function(){
			var self = this;
			this.toolbar.enableItem('saveDocument', false);
			this.getElement().attr('mode', this.options.mode);
			
			this.options.document.server.getPlainText(function(txt){
				if(self.options.mode == 'view'){
					self.docRenderer.setText(txt);
				} else {
					self.docEditor.setText(txt);
				}
			});
		},
		
		saveText: function(callback){
			var self = this;
			var txt = this.docEditor.getText();
			this.getElement().loader();
			this.options.document.server.saveText(txt, function(){
				self.docEditor.updateOriginal();
				self.toolbar.enableItem('saveDocument', false);
				self.getElement().loader('hide');
				if(callback){
					callback.call(self);
				}
			});
		}
	},
	
	server: {
		
	}
});