JSB({
	name:'Antiplag.NewDocumentTool',
	parent: 'JSB.Widgets.Tool',
	require: ['JSB.Widgets.ToolManager', 'JSB.Widgets.PrimitiveEditor'],
	client: {
		bootstrap: function(){
			// register tooltip
			var self = this;
			JSB.Widgets.ToolManager.registerTool({
				id: 'newDocumentTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'newDocumentToolWrapper'
				}
			});
		},
		
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('newdocumenttool.css');
			this.addClass('newDocumentTool');
			
			this.append(#dot{{
				<h2>Создание текстового документа</h2>
				<div class="splashIcon"></div>
				<ul class="fields">
					<li class="field name">
						<div class="icon"></div>
						<dwp-control jso="JSB.Widgets.PrimitiveEditor" class="editor nameEditor" placeholder="Название" change="{{=this.callbackAttr(function(evt){ self.validate(); })}}"></dwp-control>
					</li>
				</ul>
				<div class="buttons">
					<dwp-control 
						jso="JSB.Widgets.Button" 
						class="roundButton btnOk btn16" 
						caption="Создать"
						click="{{=this.callbackAttr(function(evt){ self.create(evt); })}}" >
					</dwp-control>
					
					<dwp-control 
						jso="JSB.Widgets.Button" 
						class="roundButton btnCancel btn16" 
						caption="Отмена"
						click="{{=this.callbackAttr(function(evt){ self.close(); })}}" >
					</dwp-control>
				</div>
			}});
		},
			
		onMessage: function(sender, msg, params ){
		},
		
		validate: function(){
			var bValid = true;
			var nameEditor = this.find('.nameEditor').jso();
			if(!nameEditor.getData() || !nameEditor.getData().getValue() || nameEditor.getData().getValue().length === 0){
				bValid = false;
			}
			var btnOk = this.find('.btnOk').jso();
			btnOk.enable(bValid);
		},
		
		update: function(){
			var self = this;
			JSB().deferUntil(function(){
				var type = self.data.data.type;
				self.find('h2').text('Создание текстового документа');
				self.find('.nameEditor').jso().setData('');
				
				JSB.defer(function(){
					var nameEditor = self.find('.nameEditor').jso();
					nameEditor.setFocus();
					nameEditor.select();
				}, 100);
				
				self.validate();
			}, function(){
				return self.isContentReady();
			});
		},
		
		setFocus: function(){
		},
		
		create: function(evt){
			if(!this.data.callback){
				return;
			}
			
			this.data.callback.call(this, {
				name: this.find('.nameEditor').jso().getData().getValue()
			});
			this.close();
		}
	},
	
	server: {
	}
	
});