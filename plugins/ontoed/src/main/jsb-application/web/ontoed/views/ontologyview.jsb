JSB({
	name:'Ontoed.OntologyView',
	parent: 'JSB.Widgets.Widget',
	require: {
		'JSB.Widgets.Control': 'Control',
		'JSB.Widgets.GroupBox': 'GroupBox',
		'JSB.Widgets.ScrollBox': 'ScrollBox',
		'Ontoed.AnnotationsEditor': 'AnnotationsEditor',
		'Ontoed.OntologyStats': 'OntologyStats',
		'Ontoed.PrefixEditor': 'PrefixEditor',
		'Ontoed.OntologyImportsEditor': 'OntologyImportsEditor',
		'Ontoed.AxiomEditor': 'AxiomEditor'
	},
	
	client: {
		currentOntology: null,
	
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('ontologyOverview');
			this.loadCss('ontologyview.css');
			
			this.initialized = false;
			this.append(#dot{{
				<dwp-control jso="JSB.Widgets.ScrollBox">
					
					<div class="elementsPane">
						<dwp-control jso="JSB.Widgets.GroupBox" class="annotationsGroup" title="Аннотации" collapsible="false">
							<dwp-control jso="Ontoed.AnnotationsEditor"></dwp-control>
						</dwp-control>
						
						<dwp-control jso="JSB.Widgets.GroupBox" class="prefixGroup" title="Префиксы" collapsible="false">
							<dwp-control jso="Ontoed.PrefixEditor"></dwp-control>
						</dwp-control>
						
						<dwp-control jso="JSB.Widgets.GroupBox" class="importGroup" title="Импортируемые онтологии" collapsible="false">
							<dwp-control jso="Ontoed.OntologyImportsEditor"></dwp-control>
						</dwp-control>
					</div>
					
					<dwp-control jso="JSB.Widgets.GroupBox" class="ontologyStatsGroup" title="Статистика" collapsible="false">
						<dwp-control jso="Ontoed.OntologyStats"></dwp-control>
					</dwp-control>
					
				</dwp-control>
			}});
			
			JSB().deferUntil(function(){
				var ontoStats = self.find('*[jso="Ontoed.OntologyStats"]').jso();
				ontoStats.getElement().resize(function(){
					var scrollBox = self.find('*[jso="JSB.Widgets.ScrollBox"]').jso();
					scrollBox.find('> ._dwp_scrollPane').css({
						'min-height': ontoStats.getElement().outerHeight(true) + 40
					});
				});
			}, function(){
				return self.isContentReady('*[jso="Ontoed.OntologyStats"], *[jso="JSB.Widgets.ScrollBox"]');
			});
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Ontology')){
					return;
				}
				self.setOntology(obj);
			});
			JSB().deferUntil(function(){
				self.initialized = true;
			}, function(){
				return self.isContentReady('*[jso="JSB.Widgets.ScrollBox"], *[jso="JSB.Widgets.GroupBox"], *[jso="Ontoed.AnnotationsEditor"], *[jso="Ontoed.PrefixEditor"], *[jso="Ontoed.OntologyStats"], *[jso="Ontoed.OntologyImportsEditor"]');
			});
		},
		
		setOntology: function(onto){
			var self = this;
			if(this.currentOntology == onto){
				return;
			}
			this.currentOntology = onto;
			JSB().deferUntil(function(){
				self.refresh();
			}, function(){
				return self.initialized;
			});
			
		},
		
		refresh: function(){
			var self = this;
			// disable diagram tab
//			self.container.wcView.enableTab('diagramView', false);
			self.container.wcView.enableTab('axiomView', false);

			this.currentOntology.server.getInfo(function(info){
				self.container.wcView.find('.header > .projectInfo')
					.empty()
					.append(#dot{{
						<span class="title"></span>
						<br />
						<a class="uri" target="_blank"></a>
					}});
				self.container.wcView.find('.header > .projectInfo .title').text(info.title?info.title:'(без названия)');
				self.container.wcView.find('.header > .projectInfo .uri').text(info.uri).attr('href', info.uri);

/*				
				// update ontology tab
				var tab = self.container.getTab(self.getId());
				tab.tab.find('._dwp_tabText')
					.empty()
					.append(#dot{{
						<span class="title"></span>
						<br />
						<span class="uri"></span>
					}});
				tab.tab.find('._dwp_tabText .title').text(info.title?info.title:'(без названия)');
				tab.tab.find('._dwp_tabText .uri').text(info.uri);
*/				
			});

			var annotationsEditor = this.find('*[jso="Ontoed.AnnotationsEditor"]').jso();
			annotationsEditor.setCurrentEntity(this.currentOntology);
			
			var prefixEditor = this.find('*[jso="Ontoed.PrefixEditor"]').jso();
			prefixEditor.setOntology(this.currentOntology);

			var ontoStats = this.find('*[jso="Ontoed.OntologyStats"]').jso();
			ontoStats.setOntology(this.currentOntology);
			
			var ontoImported = this.find('*[jso="Ontoed.OntologyImportsEditor"]').jso();
			ontoImported.setOntology(this.currentOntology);
		}
	},
	
	server: {
		
	}
});