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
						self.getElement().loader();
						self.docEditor.save(function(){
							self.getElement().loader('hide');
							self.toolbar.enableItem('saveDocument', false);
						});
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
			this.scrollBox = new JSB.Widgets.ScrollBox();
			this.append(this.scrollBox);
			this.scrollBox.addClass('docScroll');
			
			this.constructView();
			
			this.subscribe('textChanged', function(sender, msg, bChanged){
				if(sender != self.docEditor){
					return;
				}
				self.toolbar.enableItem('saveDocument', bChanged);
			});
		},
		
		switchMode: function(mode){
			var self = this;
			if(this.options.mode == mode){
				return;
			}
			if(this.options.mode == 'edit'){
				this.getElement().loader();
				this.docEditor.save(function(){
					self.getElement().loader('hide');
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
			if(this.options.mode == 'view'){
				this.scrollBox.clear();
				this.docRenderer = new Antiplag.DocumentRenderer({
					document: this.options.document,
					onLoadText: function(txt){
						self.toolbar.enableItem('checkDocument', txt && txt.trim().length > 0);
					}
				});
				this.scrollBox.append(this.docRenderer);
			} else {
				this.editorContainer.empty();
				this.docEditor = new Antiplag.DocumentEditor({
					document: this.options.document,
					onLoadText: function(txt){
						self.toolbar.enableItem('checkDocument', txt && txt.trim().length > 0);
					},
					onChangeText: function(txt, oldTxt){
						self.toolbar.enableItem('checkDocument', txt && txt.trim().length > 0);
					}
				});
				this.editorContainer.append(this.docEditor.getElement());
			}
		}
	},
	
	server: {
		
	}
});