JSB({
	name: 'Ontoed.InstanceListItem',
	parent: 'JSB.Widgets.ListItem',
	require: ['Ontoed.RendererRepository'],
	
	client: {
		constructor: function(opts, entity, classes){
			this.base(opts);
			this.entity = entity;
			this.classes = classes;
			this.addClass('instanceListItem');
			
			this.append(Ontoed.RendererRepository.createRendererForEntity(this.entity, {allowNavigate: true}).getElement());
		}
	}
});

JSB({
	name:'Ontoed.InstanceView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.ItemList', 'Ontoed.RendererRepository', 'JSB.Widgets.ItemList.TableView', 'Ontoed.InstanceListItem'],
	
	common: {
		currentOntology: null,
	},
	
	client: {
		
		hierarchySelection: null,
		entityTabSelection: null,
		entityPropsSelection: null,
		filter: null,
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('instanceView');
			this.loadCss('instanceview.css');
			
			this.instanceList = new JSB.Widgets.ItemList({
				allowHover: false,
				allowSelect: false,
				
				views: {
					table: new JSB.Widgets.ItemList.TableView()
				},
				view: 'table',
				
				emptyText: 'Нет экземпляров',
				
				onScroll: function(x, y){
					self.fetchNext();
				},
				
				onSelectionChanged: function(key, item, evt){
/*					
					if(!item){
						return;
					}
					var entity = item.obj.entity;
					self.publish('changeCurrentEntity', entity);
*/					
				}
			});
			this.append(this.instanceList);
			
			var tableView = this.instanceList.getCurrentView();
			tableView.insertColumn(0, 'idx', {
				onCreateCell: function(listItem, cellWrapper){
					cellWrapper.append(listItem.idx);
				}
			});
			
			tableView.addColumn('label', {
				onCreateCell: function(listItem, cellWrapper){
					cellWrapper.append(listItem.entity.info.label);
				}
			});
			
			tableView.addColumn('instanceOf', {
				onCreateCell: function(listItem, cellWrapper){
					var cnt = 0;
					for(var j in listItem.classes ){
						if(cnt > 0){ cellWrapper.append('<span class="comma">,</span>'); }
						cellWrapper.append(Ontoed.RendererRepository.createRendererForEntity(listItem.classes[j], {allowNavigate: true}).getElement());
						cnt++;
					}
				}
			});

			
			this.loadingIcon = this.$('<div class="loading hidden"><div class="icon"></div></div>');
			
			JSB().deferUntil(function(){
				self.instanceList.find('> ._dwp_scrollBox > ._dwp_scrollPane').append(self.loadingIcon);
			}, function(){
				return self.instanceList.find('> ._dwp_scrollBox > ._dwp_scrollPane').length > 0;
			});
/*			
			// create instance count element in tab
			this.countElement = this.$('<div class="count zero"></div>').text('0');
			JSB().deferUntil(function(){
				var tab = self.container.getTab(self.getId());
				var textElt = tab.tab.find('._dwp_tabText');
				textElt.after('<span class="paren">)</span>');
				textElt.after(self.countElement);
				textElt.after('<span class="paren">(</span>');
			}, function(){
				return self.container && self.container.getTab(self.getId()).tab.length > 0;
			});
*/
			JSB().deferUntil(function(){
				self.instanceList.scrollBox.scrollPane.resize(function(){
					self.updateScrollBoxSizes(true);
				});
				
				self.instanceList.scrollBox.getElement().resize(function(){
					self.updateScrollBoxSizes();
				});
				
				self.updateScrollBoxSizes(true);
			}, function(){
				return !JSB().isNull(self.instanceList.scrollBox.scrollPane);
			});
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Ontology')){
					return;
				}
				self.hierarchySelection = null;
				self.entityTabSelection = null;
				self.entityPropsSelection = null;
				self.setOntology(obj);
			});
			
			this.subscribe('selectEntity', function(sender, msg, obj){
				if(self.entityTabSelection != null){
					return;
				}
				if(JSB().isInstanceOf(sender, 'Ontoed.HierarchyView')){
					if(self.hierarchySelection == obj){
						return;
					}
					self.hierarchySelection = obj;
					self.refresh();
				}
			});
			
			this.subscribe('_jsb_activateWidget', function(sender, msg, params){
				if(!JSB().isInstanceOf(sender, 'JSB.Widgets.SplitLayoutManager')){
					return;
				}
				if(params.opts.id != 'ontologyView' && params.opts.id != 'axiomView' && params.opts.id != 'diagramView' && params.opts.id != 'entityView'){
					return;
				}
				if(params.opts.id != 'entityView'){
					self.entityTabSelection = null;
					self.refresh();
				} else {
					JSB().deferUntil(function(){
						if(JSB().isInstanceOf(params.widget.currentEntity, 'Ontoed.Model.Class') || JSB().isInstanceOf(params.widget.currentEntity, 'Ontoed.Model.Property')){
							self.entityTabSelection = params.widget.currentEntity;
							self.refresh();
						}
					}, function(){
						return params.widget.currentEntity;
					});
				}
				
			});
			
			this.subscribe('changeCurrentEntity', function(sender, msg, entity){
				if(JSB().isInstanceOf(entity, 'Ontoed.Model.Class') || JSB().isInstanceOf(entity, 'Ontoed.Model.Property')){
					self.entityTabSelection = entity;
					self.refresh();
				}
			});
		},
		
		injectCount: function(cnt){
			var self = this;
			if(!self.container || self.container.getTab(self.getId()).tab.length === 0){
				return;
			}
			var tab = self.container.getTab(self.getId());
			
			var cntElt = tab.tab.find('div.count');
			if(cntElt.length === 0){
				var textElt = tab.tab.find('._dwp_tabText');
				cntElt = this.$('<div class="count zero"></div>');
				textElt.after('<span class="paren">)</span>');
				textElt.after(cntElt);
				textElt.after('<span class="paren">(</span>');
			}
			cntElt.text(cnt);
			
			if(cnt > 0){
				cntElt.removeClass('zero');
			} else {
				cntElt.addClass('zero');
			}
		},
		
		setOntology: function(onto){
			var self = this;
			if(this.currentOntology == onto){
				return;
			}
			this.server.setOntology(onto, function(){
				self.currentOntology = onto;
				self.refresh();
			});
		},
		
		updateScrollBoxSizes: function(updatePane){
			var scrollBox = this.instanceList.scrollBox;
			if(updatePane){
				this.scrollPaneSize = { 
					width: scrollBox.scrollPane.outerWidth(),
					height: scrollBox.scrollPane.outerHeight(),
				};
			}
			this.scrollBoxSize = {
				width: scrollBox.getElement().width(),
				height: scrollBox.getElement().height()
			};
		},
		
		refresh: function(){
			var self = this;
			if(!this.currentOntology){
				return;
			}
			this.lastOffset = 0;
			this.fetchedAll = false;
			
			this.instanceList.clear();
			
			var classFilter = null;
			var propertyFilter = null;
			// setup filter
			if(this.entityTabSelection == null){
				// no specified tab entity selected
				if(this.hierarchySelection){
					if(JSB().isInstanceOf(this.hierarchySelection, 'Ontoed.Model.Class')){
						classFilter = this.hierarchySelection;
					} else if(JSB().isInstanceOf(this.hierarchySelection, 'Ontoed.Model.Property')){
						propertyFilter = this.hierarchySelection;
					}
				}
			} else {
				// specified tab entity selected
				if(JSB().isInstanceOf(this.entityTabSelection, 'Ontoed.Model.Class')){
					classFilter = this.entityTabSelection;
				} else if(JSB().isInstanceOf(this.entityTabSelection, 'Ontoed.Model.Property')){
					propertyFilter = this.entityTabSelection;
				}
			}
			
			this.filter = {
				classFilter: classFilter,
				propFilter: propertyFilter
			};
			
			self.fetchNext();
/*			
			this.server.setFilter(classFilter, propertyFilter, function(){
				
			});
*/			
		},
		
		fetchNext: function(){
			var self = this;
			
			if(this.fetchingInProgress || this.fetchedAll){
				return;
			}
			
			// test scroll
			var scrollBox = this.instanceList.scrollBox;
			if(!scrollBox || !scrollBox.scroll){
				return;
			}
			if( this.scrollPaneSize.height - (-scrollBox.scroll.y + this.scrollBoxSize.height) > 2 * this.scrollBoxSize.height && self.instanceList.length() > 0 /*!initial*/){
				return;
			}
			
			this.fetchingInProgress = true;
			this.loadingIcon.removeClass('hidden');
			var curOnto = this.currentOntology;
			this.server.fetch(this.lastOffset, this.filter, function(res){
				if(self.currentOntology != curOnto){
					self.fetchingInProgress = false;
					self.loadingIcon.addClass('hidden');
					self.refresh();
					return;
				}
				
				self.injectCount(res.total);
				
				// draw items
				for(var i = 0; i < res.items.length; i++ ){
					var item = res.items[i].item;
					var classes = res.items[i].classes;
					
					var listItem = new Ontoed.InstanceListItem({close: false}, item, classes);
					listItem.idx = self.lastOffset + i + 1;
					
					var li = self.instanceList.addItem(listItem);
				}
				self.lastOffset += res.items.length;
				
				self.fetchingInProgress = false;
				self.loadingIcon.addClass('hidden');
				
				if(res.items.length == 0){
					self.fetchedAll = true;
					return;
				}
				
				// wait for the last item is appended
				var lastItemElt = self.instanceList.getElement().find('li:last-child');
				if(lastItemElt.length == 0){
					self.fetchNext();
					return;
				}
				JSO().deferUntil(function(){
					self.fetchNext();
				}, function(){
					return lastItemElt.width() > 0 && lastItemElt.height() > 0;
				});
			});
		}
	},
	
	server: {
		
		filter: null,
		
		setOntology: function(onto){
			this.currentOntology = onto;
			this.filter = null;
		},
		
		setFilter: function(filter){
			if(this.filter == filter || (this.filter && this.filter.classFilter == filter.classFilter && this.filter.propFilter == filter.propFilter)){
				return;
			}
			var classEntity = null;
			var propertyEntity = null;
			
			if(filter){
				this.filter = filter;
				classEntity = filter.classFilter;
				propertyEntity = filter.propFilter;
			}

			this.items = [];
			
			if(classEntity == null && propertyEntity == null) {
				for(var i in this.currentOntology.instances){
					this.items.push(this.currentOntology.instances[i]);
				}
			} else {
				var items = this.currentOntology.model.individuals(classEntity ? {iri:classEntity.info.iri} : null, propertyEntity ? {iri:propertyEntity.info.iri} : null, {});
				for(var i in items){
					var indDesc = items[i];
					var inst = this.currentOntology.instances[indDesc.md5];
					if(inst){
						this.items.push(inst);
					}
				}
			}
			
			this.items.sort(function(a, b){
				var labelA = a.info.shortIRI;
				if(!labelA){
					labelA = a.info.functionalExpression;
				}
				if(!labelA){
					return 0;
				}
				var labelB = b.info.shortIRI;
				if(!labelB){
					labelB = b.info.functionalExpression;
				}
				if(!labelB){
					return 0;
				}
				return labelA.localeCompare(labelB);
			});
		},
		
		fetch: function(offset, filter){
			var limit = 20;

			this.setFilter(filter);
			
			var items = [];
			for(var i = offset; i < Math.min(this.items.length, offset + limit); i++ ){
				var item = this.items[i];
				var classes = item.getInstanceClasses();
				
				items.push({item: item, classes: classes});
			}
			
			return {total: this.items.length, items: items};
		}
	}
});