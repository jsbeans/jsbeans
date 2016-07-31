JSB({
	name:'Ontoed.PrefixEditor',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.Button', 'JSB.Widgets.PrimitiveEditor'],
	
	client: {
		currentOntology: null,
		tableElement: null,
		prefixes: {},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('prefixEditor');
			this.loadCss('prefixeditor.css');
			
			this.toolBar = this.$('<div class="toolbar"></div>');
			this.append(this.toolBar);
			
			var createBtn = new JSB.Widgets.Button({
				cssClass: 'roundButton btnCreate btn16',
				tooltip: 'Добавить префикс',
				onClick: function(){
					self.createPrefix();
				}
			});
			this.toolBar.append(createBtn.getElement());

			this.prefixContainer = this.$('<div class="prefixContainer"></div>');
			this.append(this.prefixContainer);
			this.tableElement = this.$('<table cellspacing="0"></table>');
			this.prefixContainer.append(this.tableElement);
		},
		
		setOntology: function(onto){
			if(this.currentOntology == onto){
				return;
			}
			if(!JSB().isInstanceOf(onto, 'Ontoed.Model.Ontology')){
				return;
			}
			this.currentOntology = onto;
			this.refresh();
		},
		
		refresh: function(){
			var self = this;
			this.currentOntology.server.getPrefixes(function(prefixes){
				self.prefixes = prefixes;
				self.draw();
			});
		},
		
		generatePrefix: function(prefixDesc){
			var self = this;
			return #dot{{
				<tr key="{{=prefixDesc.prefix}}">
					<td class="prefix">
						<div class="value">{{=prefixDesc.prefix}}</div>
						<div class="editor">
							<dwp-control jso="JSB.Widgets.PrimitiveEditor"
								change="{{=this.callbackAttr(function(){ self.checkValid(); })}}">
							</dwp-control>
						</div>
					</td>
					<td class="uri">
						<div class="value">{{=prefixDesc.uri}}</div>
						<div class="editor">
							<dwp-control jso="JSB.Widgets.PrimitiveEditor"
								change="{{=this.callbackAttr(function(){ self.checkValid(); })}}">
							</dwp-control>
						</div>
					</td>
					<td class="toolbar">
						<div class="value">
							<dwp-control jso="JSB.Widgets.Button"
								class="roundButton btnEdit btn10"
								tooltip="Редактировать"
								key="{{=prefixDesc.prefix}}"
								click="{{=this.callbackAttr(function(evt){ self.editPrefix(evt); })}}">
							</dwp-control>
							<dwp-control jso="JSB.Widgets.Button"
								class="roundButton btnDelete btn10"
								tooltip="Удалить"
								key="{{=prefixDesc.prefix}}"
								click="{{=this.callbackAttr(function(evt){ self.deletePrefix(evt); })}}">
							</dwp-control>
						</div>
						<div class="editor">
							<dwp-control jso="JSB.Widgets.Button"
								class="roundButton btnOk btn10"
								tooltip="Сохранить"
								key="{{=prefixDesc.prefix}}"
								click="{{=this.callbackAttr(function(evt){ self.saveEditing(evt); })}}">
							</dwp-control>
							<dwp-control jso="JSB.Widgets.Button"
								class="roundButton btnCancel btn10"
								tooltip="Отменить"
								key="{{=prefixDesc.prefix}}"
								click="{{=this.callbackAttr(function(evt){ self.cancel(evt); })}}">
							</dwp-control>
						</div>
					</td>
				</tr>

			}};
		},
		
		draw: function(){
			var self = this;
			var prefixArr = [];
			for(var p in this.prefixes){
				prefixArr.push({
					prefix: p,
					uri: this.prefixes[p]
				});
			}
			
			prefixArr.sort(function(a, b){
				return a.prefix.localeCompare(b.prefix);
			});
			
			this.tableElement.empty();
			for(var i = 0; i < prefixArr.length; i++ ) {
				var trStr = this.generatePrefix(prefixArr[i]);
				this.tableElement.append(trStr);
			}
		},
		
		createPrefix: function(){
			var tmpPrefix = JSB().generateUid();
			var trStr = this.generatePrefix({prefix:tmpPrefix, uri: ''});
			this.tableElement.prepend(trStr);
			var tr = this.tableElement.find('tr[key="'+tmpPrefix+'"]');
			this.enterEditMode(tr);
		},
		
		editPrefix: function(evt){
			var self = this;
			var prefix = this.$(evt.currentTarget).attr('key');
			var tr = this.find('table tr[key="'+prefix+'"]');
			this.enterEditMode(tr, prefix);
		},
		
		enterEditMode: function(tr, prefix){
			var self = this;
			tr.addClass('editing');
			
			JSB().deferUntil(function(){
				var prefixEditor = tr.find('td.prefix > .editor > ._dwp_primitiveEditor').jso();
				var uriEditor = tr.find('td.uri > .editor > ._dwp_primitiveEditor').jso();
				
				if(prefix && self.prefixes[prefix]){
					prefixEditor.setData(prefix);
					uriEditor.setData(self.prefixes[prefix]);		
				} else {
					prefixEditor.setData('');
					uriEditor.setData('');
				}
				
				prefixEditor.setFocus();
				prefixEditor.select();
				
				self.checkValid();
				
			}, function(){
				return tr.find('td.prefix > .editor > ._dwp_primitiveEditor').length > 0
				&& tr.find('td.uri > .editor > ._dwp_primitiveEditor').length > 0;
			});
			
		},
		
		checkValid: function(){
			var self = this;
			var trs = this.find('table tr.editing');
			trs.each(function(){
				var tr = self.$(this);
				var prefixEditor = tr.find('td.prefix > .editor > ._dwp_primitiveEditor').jso();
				var uriEditor = tr.find('td.uri > .editor > ._dwp_primitiveEditor').jso();
				
				var btnOk = tr.find('td.toolbar > .editor > .btnOk').jso();
				btnOk.enable(prefixEditor.getData().getValue().trim().length > 0 && uriEditor.getData().getValue().trim().length > 0);
			});
			
		},
		
		deletePrefix: function(evt){
			var prefix = this.$(evt.currentTarget).attr('key');
			var tr = this.find('table tr[key="'+prefix+'"]');
			
			var prefixes = JSB().clone(this.prefixes);
			delete prefixes[prefix];
			
			this.save(prefixes, function(){
				tr.remove();
			});
		},
		
		saveEditing: function(evt){
			var self = this;
			var prefix = this.$(evt.currentTarget).attr('key');
			var tr = this.find('table tr[key="'+prefix+'"]');
			
			var prefixEditor = tr.find('td.prefix > .editor > ._dwp_primitiveEditor').jso();
			var uriEditor = tr.find('td.uri > .editor > ._dwp_primitiveEditor').jso();
			
			// construct new prefixes json
			var prefixes = JSB().clone(this.prefixes);
			delete prefixes[prefix];
			
			var newPrefix = prefixEditor.getData().getValue();
			var newUri = uriEditor.getData().getValue();
			
			prefixes[newPrefix] = newUri;
			
			this.save(prefixes, function(){
				// update values
				var prefixValue = tr.find('td.prefix > .value');
				var uriValue = tr.find('td.uri > .value');
				
				prefixValue.text(newPrefix);
				uriValue.text(newUri);
				
				tr.attr('key', newPrefix);
				tr.find('._dwp_primitiveEditor').attr('key', newPrefix);
				tr.find('._dwp_button').attr('key', newPrefix);
				
				tr.removeClass('editing');
			});
		},
		
		save: function(prefixes, callback){
			var self = this;
			this.currentOntology.server.savePrefixes(prefixes, function(res){
				if(res){
					self.prefixes = prefixes;
					if(callback){
						callback.call(self);
					}
				}
			});
			
		},
		
		cancel: function(evt){
			var prefix = this.$(evt.currentTarget).attr('key');
			var tr = this.find('table tr[key="'+prefix+'"]');
			if(this.prefixes[prefix]){
				tr.removeClass('editing');
			} else {
				tr.remove();
			}
		}
		
	},
	
	server: {
		
	}
});