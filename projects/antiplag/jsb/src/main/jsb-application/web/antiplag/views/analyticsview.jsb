JSB({
	name:'Antiplag.AnalyticsView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.TabView', 'Antiplag.RelevantDocsView', 'Antiplag.StorylineView', 'Antiplag.GraphView'],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('analyticsView');
			this.loadCss('analyticsview.css');
			
			this.toolbar = new JSB.Widgets.ToolBar();
			this.append(this.toolbar);
			
			this.tabView = new JSB.Widgets.TabView({
				tabPosition: 'left',
				allowCloseTab: false,
				allowNewTab: false,
				showTabs: false
			});
			this.append(this.tabView);
			
			// add relevant docs view
			this.relevantDocsView = new Antiplag.RelevantDocsView({document: this.options.document, toolbar: this.toolbar});
			var relDocsTab = this.tabView.addTab('', this.relevantDocsView, {id: 'relDocs'});
			relDocsTab.tab.attr('type', 'relDocs');
			relDocsTab.tab.attr('title', 'Похожие документы');
/*			
			// add storyline
			this.storylineView = new Antiplag.StorylineView(this.options);
			var storylineTab = this.tabView.addTab('', this.storylineView, {id: 'storyline', disabled: true});
			storylineTab.tab.attr('type', 'storyline');
			storylineTab.tab.attr('title', 'Сюжет');

			// add graph
			this.graphView = new Antiplag.GraphView(this.options);
			var graphTab = this.tabView.addTab('', this.graphView, {id: 'graph', disabled: true});
			graphTab.tab.attr('type', 'graph');
			graphTab.tab.attr('title', 'Граф');

			this.tabView.switchTab(relDocsTab);
*/			
		}
		
	},
	
	server: {
		
	}
});