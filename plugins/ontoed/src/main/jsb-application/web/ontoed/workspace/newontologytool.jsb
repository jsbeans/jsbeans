JSB({
	name:'Ontoed.NewOntologyTool',
	parent: 'JSB.Widgets.Tool',
	require: ['JSB.Widgets.ToolManager', 'JSB.Widgets.PrimitiveEditor'],
	client: {
		bootstrap: function(){
			// register tooltip
			var self = this;
			JSB.Widgets.ToolManager.registerTool({
				id: 'newOntologyTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'newOntologyToolWrapper'
				}
			});
		},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('newontologytool.css');
			this.addClass('newOntologyTool');
			
			this.append(#dot{{
				<h2>Создание онтологии</h2>
				<div class="splashIcon"></div>
				<ul class="fields">
					<li class="field name">
						<div class="icon"></div>
						<dwp-control jso="JSB.Widgets.PrimitiveEditor" class="editor nameEditor" placeholder="Название"></dwp-control>
					</li>
					<li class="field iri">
						<div class="icon"></div>
						<dwp-control jso="JSB.Widgets.PrimitiveEditor" class="editor iriEditor" placeholder="IRI"></dwp-control>
					</li>
					<li class="field desc">
						<div class="icon"></div>
						<dwp-control jso="JSB.Widgets.PrimitiveEditor" class="editor descEditor" multiline="true" rows="3" placeholder="Описание"></dwp-control>
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
		
		update: function(){
			var self = this;
			JSB().deferUntil(function(){
				self.find('.nameEditor').jso().setData('');
				self.find('.iriEditor').jso().setData('');
				self.find('.descEditor').jso().setData('');
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
				name: this.find('.nameEditor').jso().getData().getValue(),
				iri: this.find('.iriEditor').jso().getData().getValue(),
				desc: this.find('.descEditor').jso().getData().getValue()
			});
			this.close();
		}
	},
	
	server: {
	}
	
});