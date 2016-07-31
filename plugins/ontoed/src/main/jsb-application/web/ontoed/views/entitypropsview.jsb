JSB({
	name: 'Ontoed.EntityPropsListItem',
	parent: 'JSB.Widgets.ListItem',
	require: ['Ontoed.RendererRepository'],
	
	client: {
		constructor: function(opts, currentEntity, entry){
			this.base(opts);
			this.currentEntity = currentEntity;
			this.entry = entry;
			this.addClass('entityPropsListItem');
			
			if(this.options.foreignDomain){
				this.addClass('entityPropsListItemGroup');
				this.append('<span class="separator">Унаследовано в классах</span>');
			} else {
				if(this.options.domain){
					this.addClass('entityPropsListItemGroup');
					this.append('<span class="separator">Унаследовано от</span>');
				}
				this.append(Ontoed.RendererRepository.createRendererFor(this.entry.key, JSB().merge({allowNavigate: true}, opts)).getElement());
			}
		}
	}
});

JSB({
	name:'Ontoed.EntityPropsView',
	parent: 'JSB.Widgets.Widget',
	require: {
		'JSB.Widgets.ItemList': 'ItemList',
		'Ontoed.RendererRepository': 'RendererRepository',
		'Ontoed.TypeRenderer': 'TypeRenderer',
		'JSB.Widgets.ItemList.TableView': 'TableView',
		'Ontoed.EntityPropsListItem': 'EntityPropsListItem'
	},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('entityPropsView');
			this.loadCss('entitypropsview.css');
			
			this.propsList = new self.ItemList({
				views: {
					table: new self.TableView()
				},
				view: 'table',
				selectMulti: true,
				
				onSelectionChanged: function(key, item, evt){
/*					
					if(!item){
						return;
					}
					var entity = item.obj.entry.key;
					self.publish('changeCurrentEntity', entity);
*/					
				},
				
				emptyText: 'Нет элементов',
			});
			this.append(this.propsList);
			
			var tableView = this.propsList.getCurrentView();
			tableView.addColumn('secondary', {
				onCreateCell: function(listItem, cellWrapper){
					if(JSB().isInstanceOf(listItem.currentEntity, 'Ontoed.Model.Class')){
						if(listItem.options.domain){
							
						} else {
							var rangeLst = listItem.entry.ranges;
							if(rangeLst.length == 0){
								return;
							}
							var range = rangeLst[0];
							if( range && (JSB().isBean(range) || JSB().isPlainObject(range) || range.length > 0)){
								cellWrapper.append(Ontoed.RendererRepository.createRendererFor(range, {allowNavigate: true}).getElement());
							}
						}
					} else if(JSB().isInstanceOf(listItem.currentEntity, 'Ontoed.Model.Instance') ){
						cellWrapper.append(Ontoed.RendererRepository.createRendererFor(listItem.entry.value, {allowNavigate: true}).getElement());
					}
				}
			});
			
			
			this.subscribe('changeCurrentEntity', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Entity')){
					return;
				}
				self.setEntity(obj);
			});
		},
		
		setEntity: function(e){
			var self = this;
			if(this.currentEntity == e){
				return;
			}
			this.currentEntity = e;
			
			// set entity renderer into tab
			var prefix = 'Классы: ';
			if(JSB().isInstanceOf(self.currentEntity, 'Ontoed.Model.Class')){
				prefix = 'Свойства: ';
			} else if(JSB().isInstanceOf(self.currentEntity, 'Ontoed.Model.Instance')){
				prefix = 'Значения: ';
			}
			var entityRenderer = Ontoed.RendererRepository.createRendererForEntity(self.currentEntity);
			var tab = self.container.getTab(self.getId());
			var textElt = tab.tab.find('._dwp_tabText');
			var rElt = textElt.find('> .renderer');
			if(rElt.length > 0){
				rElt.jso().destroy();
			}
			textElt.empty().append(prefix).append(entityRenderer.getElement());
			
			this.refresh();
		},
		
		refresh: function(){
			var self = this;
			this.getElement().loader();
			this.server.loadPropsForEntity(this.currentEntity, function(entityList){
				entityList.sort(function(a, b){
					return a.key.info.shortIRI.localeCompare(b.key.info.shortIRI);
				});
				self.propsList.clear();
				
				if(JSB().isInstanceOf(self.currentEntity, 'Ontoed.Model.Class')){
					// generate group map
					var groupMap = {};
					var domainMap = {};
					for(var i in entityList){
						var propEntity = entityList[i].key;
						var propRanges = entityList[i].ranges;
						var domainEntity = entityList[i].domain;
						if(!domainEntity){
							domainEntity = self.currentEntity;
						}
						if(!groupMap[domainEntity.info.md5]){
							groupMap[domainEntity.info.md5] = [];
						}
						if(!domainMap[domainEntity.info.md5]){
							domainMap[domainEntity.info.md5] = domainEntity;
						}
						groupMap[domainEntity.info.md5].push({entity: propEntity, ranges: propRanges});
					}
					
					function drawGroup(items, domainEntity){
						if(domainEntity && domainEntity != self.currentEntity){
							var liObj = new self.EntityPropsListItem({close: false, domain: true, allowHover: false, allowSelect:false}, self.currentEntity, {key: domainEntity});
							self.propsList.addItem(liObj);
						}
						
						for(var i in items){
							var entity = items[i].entity;
							var ranges = items[i].ranges;
							var liObj = new self.EntityPropsListItem({close: false}, self.currentEntity, {key:entity, ranges: ranges});
							self.propsList.addItem(liObj);
						}

					}
/*					
					// sort & draw
					for(var i in groupMap){
						groupMap[i].sort(function(a, b){
							return a.entity.info.shortIRI.localeCompare(b.entity.info.shortIRI);
						});
						
					}
*/					
					// draw current domain
					if(groupMap[self.currentEntity.info.md5]){
						drawGroup(groupMap[self.currentEntity.info.md5], domainMap[self.currentEntity.info.md5]);
					}
					
					// draw others
					for(var groupId in groupMap){
						if(groupId == self.currentEntity.info.md5){
							continue; // skip self domain
						}
						drawGroup(groupMap[groupId], domainMap[groupId]);
					}
					
				} else if(JSB().isInstanceOf(self.currentEntity, 'Ontoed.Model.Property')){
					var selfList = [];
					var otherList = [];
					for(var i in entityList){
						var propEntity = entityList[i].key;
						if(entityList[i].selfDomain){
							selfList.push(entityList[i]);
						} else {
							otherList.push(entityList[i]);
						}
					}
					
					function drawGroup(items, bSelf){
						if(items.length == 0){
							return;
						}
						if(!bSelf){
							var liObj = new self.EntityPropsListItem({close: false, foreignDomain: true, allowHover: false, allowSelect:false}, self.currentEntity, {key: null});
							self.propsList.addItem(liObj);
						}
						
						for(var i in items){
							var liObj = new self.EntityPropsListItem({close: false}, self.currentEntity, items[i]);
							self.propsList.addItem(liObj);
						}
					}
					
					drawGroup(selfList, true);
					drawGroup(otherList, false);
					
				} else {
					for(var i in entityList){
						var liObj = new self.EntityPropsListItem({close: false}, self.currentEntity, entityList[i]);
						self.propsList.addItem(liObj);
					}
				}
				self.getElement().loader('hide');
			});
		}
	},
	
	server: {
		loadPropsForEntity: function(entity){
			var allAxioms = entity.getAxioms();
			var entityList = [];
			var idx0 = 0;
			var idx1 = 1;
			if(JSB().isInstanceOf(entity, 'Ontoed.Model.Class')){
				
				// obtain all props
				var props = entity.ontology.model.classProperties({iri:entity.info.iri, type: entity.info.type});
				var propMap = {};
				
				for(var i in props){
					var propDesc = props[i];
					
					// avoid duplicates
					if(propMap[propDesc.md5]){
						continue;
					}
					propMap[propDesc.md5] = true;
					
					var propEntity = entity.ontology.entities[propDesc.md5];
					var propRanges = propEntity.getRangeEntities();
					// obtain property domain
					var domains = propEntity.getDomainEntities();
					entityList.push({key: propEntity, domain: domains.length > 0 ? domains[0] : null, ranges: propRanges });
				}
				
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Property')){
				var classes = entity.ontology.model.propertyClasses({iri:entity.info.iri, type: entity.info.type});
				var domains = entity.getDomainEntities();
				var domainMap = {};
				for(var i in domains){
					domainMap[domains[i].info.md5] = domains[i];
					entityList.push({key: domains[i], selfDomain: true});
				}
				for(var i in classes){
					var classDesc = classes[i];
					var classEntity = entity.ontology.entities[classDesc.md5];
					if(!classEntity){
						continue;
					}
					if(domainMap[classDesc.md5]){
						continue;
					}
					entityList.push({key: classEntity, selfDomain: false});
				}
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Instance')){
				for(var i in allAxioms){
					var axiom = allAxioms[i];
					if(axiom.info.axiomType == 'ObjectPropertyAssertion' 
						|| axiom.info.axiomType == 'DataPropertyAssertion'
						|| axiom.info.axiomType == 'AnnotationAssertion'
						|| axiom.info.axiomType == 'NegativeObjectPropertyAssertion'){
						
						if(axiom.info.resolver.items[1] == entity){
							var field = axiom.info.resolver.items[0];
							var value = axiom.info.resolver.items[2];
							entityList.push({key: field, value: value});
						}
					}
				}
			} else {
				throw 'loadPropsForEntity: Invalid entity: ' + entity.jsb.name;
			}
			

			
			return entityList;
		}
	}
});