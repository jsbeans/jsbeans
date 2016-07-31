JSB({
	name: 'Ontoed.Diagram.ClassNode',
	parent: 'JSB.Widgets.Diagram.Node',
	require: {
		'Ontoed.RendererRepository': 'Ontoed.RendererRepository'
	},
	
	client: {
		entity: null,
		props: null,
		options: {
			onHighlight: function(bEnable){
				this.highlightNode(bEnable);
			},
			onSelect: function(bEnable){
				this.selectNode(bEnable);
			}
		},
		
		constructor: function(diagram, key, opts){
			var self = this;
			this.base(diagram, key, opts);
			this.addClass('classNode');
			this.loadCss('classnode.css');
			this.entity = opts.entity;
			
			this.caption = this.$('<div class="caption"></div>');
			this.body = this.$('<div class="body"></div>');
			this.append(this.caption);
			this.append(this.body);
			this.propsList = this.$('<table class="props" cellspacing="0" cellpadding="0"></table>');
			this.body.append(this.propsList);

			// load props
			this.server.loadClassProps(this.entity, function(entityList){
				self.props = entityList;
				self.refresh();
			});
			
			// install drag-move selector
			this.installDragHandle('drag', {
				selector: this.caption
			});
			
			// create top & bottom connectors
			this.topConnector = this.$('<div class="connector top"></div>');
			this.bottomConnector = this.$('<div class="connector bottom"></div>');
			this.append(this.topConnector);
			this.append(this.bottomConnector);
			
			this.installConnector('subClassOf_child', {
				handle: this.topConnector,
				origin: this.topConnector,
				onHighlight: function(bEnable, meta){
					self.highlightConnector(this, bEnable, meta);
				}
			});

			this.installConnector('subClassOf_parent', {
				handle: this.bottomConnector,
				origin: this.bottomConnector,
				onHighlight: function(bEnable, meta){
					self.highlightConnector(this, bEnable, meta);
				}
			});

			// create left & right class mapping connector
			this.leftConnector = this.$('<div class="connector left mapping"></div>');
			this.rightConnector = this.$('<div class="connector right mapping"></div>');
			this.append(this.leftConnector);
			this.append(this.rightConnector);

			this.installConnector('classMapping_target', {
				handle: this.leftConnector,
				origin: this.leftConnector,
				onHighlight: function(bEnable, meta){
					self.highlightConnector(this, bEnable, meta);
				}
			});

			this.installConnector('classMapping_source', {
				handle: this.rightConnector,
				origin: this.rightConnector,
				onHighlight: function(bEnable, meta){
					self.highlightConnector(this, bEnable, meta);
				}
			});
			
		},
		
		refresh: function(){
			var self = this;
			this.caption.empty();
			this.propsList.empty();
			
			// draw caption
			var classRenderer = Ontoed.RendererRepository.createRendererFor(this.entity);
			this.caption.append(classRenderer.getElement());
			
			// draw props
			this.props.sort(function(a, b){
				return a.key.info.shortIRI.localeCompare(b.key.info.shortIRI);
			});
			
			
			// generate group map
			var groupMap = {};
			var domainMap = {};
			for(var i in this.props){
				var propEntity = this.props[i].key;
				var propRanges = this.props[i].ranges;
				var domainEntity = this.props[i].domain;
				if(!domainEntity){
					domainEntity = self.entity;
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
				if(domainEntity && domainEntity != self.entity){
					var domainRenderer = Ontoed.RendererRepository.createRendererFor(domainEntity, {allowNavigate: true, cssClass:'min'});
					self.propsList.append(self.$('<tr class="domain"></tr>')
											.append(self.$('<td class="domain"></td>').append(domainRenderer.getElement()))
											.append('<td></td>'));
				}
				
				for(var i in items){
					var entity = items[i].entity;
					var ranges = items[i].ranges;
					
					var entityRenderer = Ontoed.RendererRepository.createRendererFor(entity, {allowNavigate: true}).getElement();
					var rangeRenderer = ranges.length > 0 ? Ontoed.RendererRepository.createRendererFor(ranges[0], {allowNavigate: true, cssClass:'min'}).getElement() : '<div class="empty"></div>';
					
					var leftConnector = self.$('<div class="connector left mapping prop" key="'+entity.info.md5+'"></div>');
					var rightConnector = self.$('<div class="connector right mapping prop" key="'+entity.info.md5+'"></div>');
					
					var tr = self.$('<tr class="prop" key="'+entity.info.md5+'"></tr>')
						.append(self.$('<td class="entity"></td>').append(entityRenderer).append(leftConnector))
						.append(self.$('<td class="range"></td>').append(rangeRenderer).append(rightConnector));

					self.propsList.append(tr);
					
					self.installConnector('propMapping_target', {
						entity: entity,
						handle: [tr.find('td.entity'), leftConnector],
						origin: leftConnector,
						allowLinkCallback: function(remoteConnector, linkId, callback){
							callback(remoteConnector.options.entity.jsb == this.options.entity.jsb);
//							return remoteConnector.options.entity.jsb == this.options.entity.jsb;
						},
						onHighlight: function(bEnable, meta){
							self.highlightConnector(this, bEnable, meta);
						}
					});

					self.installConnector('propMapping_source', {
						entity: entity,
						handle: [tr.find('td.range'), rightConnector],
						origin: rightConnector,
						allowLinkCallback: function(remoteConnector, linkId, callback){
							callback(remoteConnector.options.entity.jsb == this.options.entity.jsb);
//							return remoteConnector.options.entity.jsb == this.options.entity.jsb;
						},
						onHighlight: function(bEnable, meta){
							self.highlightConnector(this, bEnable, meta);
						}
					});
				}

			}

			// draw current domain
			if(groupMap[self.entity.info.md5]){
				drawGroup(groupMap[self.entity.info.md5], domainMap[self.entity.info.md5]);
			}
			
			// draw others
			for(var groupId in groupMap){
				if(groupId == self.entity.info.md5){
					continue; // skip self domain
				}
				drawGroup(groupMap[groupId], domainMap[groupId]);
			}

		},
		
		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		selectNode: function(bEnable){
			if(bEnable){
				this.addClass('selected');
			} else {
				this.removeClass('selected');
			}
		},

		highlightConnector: function(connector, bEnable, meta){
			var elt = connector.options.origin;
			if(bEnable){
				elt.addClass('highlighted');
				if(connector.options.category == 'prop' && meta == 'source'){
					// highlight whole prop
					var key = connector.options.entity.info.md5;
					this.propsList.find('tr[key="'+key+'"]').addClass('highlighted');
				}
			} else {
				elt.removeClass('highlighted');
				if(connector.options.category == 'prop' && meta == 'source'){
					var key = connector.options.entity.info.md5;
					this.propsList.find('tr[key="'+key+'"]').removeClass('highlighted');
				}
			}
		},
		
	},
	
	server: {
		loadClassProps: function(classEntity){
			var entityList = [];
			
			// obtain all props
			var props = classEntity.ontology.model.classProperties({iri:classEntity.info.iri, type: classEntity.info.type});
			var propMap = {};
			
			for(var i in props){
				var propDesc = props[i];
				
				// avoid duplicates
				if(propMap[propDesc.md5]){
					continue;
				}
				propMap[propDesc.md5] = true;
				
				var propEntity = classEntity.ontology.entities[propDesc.md5];
				var propRanges = propEntity.getRangeEntities();
				// obtain property domain
				var domains = propEntity.getDomainEntities();
				entityList.push({key: propEntity, domain: domains.length > 0 ? domains[0] : null, ranges: propRanges });
			}
			
			return entityList;
		}
	}
});