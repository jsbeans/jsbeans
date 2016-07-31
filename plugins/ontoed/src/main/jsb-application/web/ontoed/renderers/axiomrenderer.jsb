JSB({
	name: 'Ontoed.AxiomRenderer',
	parent: 'Ontoed.Renderer',
	require: ['Ontoed.Host', 'Ontoed.DefaultExpressionRenderer', 'Ontoed.ExpressionPlaceholderRenderer', 'JSB.Widgets.Button'],
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('axiomRenderer');
			this.loadCss('axiomrenderer.css');
			this.context = opts.context;
			this.axiom = opts.axiom;
			
			this.generate();
		},
		
		generateViewMode: function(){
			this.getElement().attr('title', this.axiom.info.functionalExpression);
			var renderer = new Ontoed.DefaultExpressionRenderer(JSB().merge({}, this.options, {resolver: this.axiom.info.resolver}));
			this.append(renderer);
		},
		
		generateEditMode: function(){
			var self = this;
			
			this.okBtn = new JSB.Widgets.Button({
				cssClass: 'roundButton btnOk btn16',
				tooltip: 'Сохранить',
				onClick: function(){
					self.save(renderer.resolver);
				}
			});
			this.cancelBtn = new JSB.Widgets.Button({
				cssClass: 'roundButton btnCancel btn16',
				tooltip: 'Отменить',
				onClick: function(){
					self.options.edit = false;
					if(self.axiom){
						self.generate();
					}
					if(self.options.onComplete){
						self.options.onComplete.call(self);
					}
				}
			});

			
			var resolver = this.axiom ? JSB().clone(this.axiom.info.resolver) : null;
			var renderer = new Ontoed.ExpressionPlaceholderRenderer(JSB().merge({}, this.options, {
				resolver: resolver, 
				scheme: Ontoed.Host.getEntriesByEntityType('Axiom'), 
				group: true,
				onChangeFilled: function(){
					self.okBtn.enable(this.isFilled());
				}
			}));
			
			this.append(renderer);
			this.append(this.okBtn);
			this.append(this.cancelBtn);
		},
		
		save: function(resolver){
			var self = this;
			
			function convert(tree, resolver){
				if(JSB().isBean(resolver)){
					tree.nodeType = 'Entity';
					tree.entityType = resolver.getEntityType();
					tree.md5 = resolver.info.md5;
					tree.iri = resolver.info.iri;
				} else if(resolver.type.toLowerCase() == 'typename'){
					tree.nodeType = 'Datatype';
					tree.data = resolver.value;
				} else if(resolver.type.toLowerCase() == 'facet'){
					tree.nodeType = 'Facet';
					tree.data = resolver.enum;
				} else if(resolver.type.toLowerCase() == 'literal'){
					tree.nodeType = 'Literal';
					tree.data = resolver.value;
					tree.dataType = resolver.datatype;
				} else if(resolver.type.toLowerCase() == 'iri'){
					tree.nodeType = 'IRI';
					tree.iri = resolver.value;
				} else {
					tree.nodeType = 'Expression';
					tree.name = resolver.type;
					tree.items = [];
					for(var i in resolver.items){
						if(!resolver.items[i]){
							continue;	// skip nulls
						}
						var item = {};
						tree.items.push(item);
						convert(item, resolver.items[i]);
					}
				}
			}
			
			// convert resolver
			var expressionTree = {};
			convert(expressionTree, resolver);
			this.server.store(this.options.ontology, expressionTree, (this.axiom ? this.axiom.info.md5 : null), function(newAxiom){
/*				
				function eliminateEmptyResolvers(resolver){
					if(!resolver.items || resolver.items.length == null){
						return;
					}
					for(var i = resolver.items.length - 1; i >= 0; i--){
						if(!resolver.items[i]){
							resolver.items.splice(i, 1);
						} else {
							eliminateEmptyResolvers(resolver.items[i]);
						}
					}
				}
*/				
				if(newAxiom){
					// eliminate empty resolvers
//					eliminateEmptyResolvers(resolver);
					
					// create new axiom and destroy previous
					self.axiom = newAxiom;
					self.options.edit = false;
					self.generate();
					if(self.options.onComplete){
						self.options.onComplete.call(self, newAxiom);
					}
				}
			});
			
		},
		
		generate: function(){
			this.getElement().empty();
			if(this.options.edit){
				this.generateEditMode();
			} else {
				this.generateViewMode();
			}
		},
		
		beginEdit: function(){
			this.options.edit = true;
			this.generate();
		}
	},
	
	server: {
		store: function(onto, tree, oldAxiomId){
			return onto.saveAxiom(tree, oldAxiomId);
		}
	}
});

JSB({
	name: 'Ontoed.ExpressionRenderer',
	parent: 'Ontoed.Renderer',
	
	client: {
		constructor: function(opts){
			this.base(opts);
			this.addClass('expressionRenderer');
			this.context = opts.context;
			this.axiom = opts.axiom;
			this.resolver = opts.resolver;
		},
		
		isShort: function(){
			return !this.options.full 
			&& this.resolver.items 
			&& this.resolver.items.length == 2 
			&& this.context 
			&& (JSB().isBean(this.resolver.items[0]) || JSB().isString(this.resolver.items[0])) 
			&& (JSB().isBean(this.resolver.items[1]) || JSB().isString(this.resolver.items[1]));
		}
	}
});

JSB({
	name: 'Ontoed.DefaultExpressionRenderer',
	parent: 'Ontoed.ExpressionRenderer',
	require: ['Ontoed.TypeRenderer', 'Ontoed.EquivalentEntityExpressionRenderer', 'Ontoed.UnionExpressionRenderer'],
	
	client: {
		constructor: function(opts){
			this.base(opts);
			
			// choose typed expression renderer
/*			
			if(this.resolver.type == 'EquivalentClasses' 
				|| this.resolver.type == 'EquivalentObjectProperties' 
				|| this.resolver.type == 'EquivalentDataProperties'){
				this.append(new Ontoed.EquivalentEntityExpressionRenderer(opts));
				return;
			}
*/			
			if(this.resolver.type == 'ObjectUnionOf'){
				this.append(new Ontoed.UnionExpressionRenderer(opts));
				return;
			}
			
			// figure out rendering type
			if(false/*this.isShort()*/){
				// short rendering
				for(var i in this.resolver.items){
					var entity = this.resolver.items[i];
					if(entity == this.context){
						continue;
					}
					var renderer = null;
					if(JSB().isString(entity)){
						renderer = new Ontoed.TypeRenderer(JSB().merge({}, opts, {type:entity}));
					} else if(JSB().isBean(entity)){
						renderer = Ontoed.RendererRepository.createRendererForEntity(entity, opts);
					}
					
					this.append(renderer);
				}
			} else {
				// full rendering
				this.append(this.$('<span class="type"></span>').text(this.resolver.type));
				this.append('<span class="paren">(</span>');
				for(var i = 0; i < this.resolver.items.length; i++){
					if(i > 0){
						this.append('&nbsp;');
					}
					var item = this.resolver.items[i];
					if(JSB().isBean(item)){
						var itemRenderer = Ontoed.RendererRepository.createRendererForEntity(item, opts);
						this.append(itemRenderer);
						if(this.context == item){
							itemRenderer.addClass('context');
						}
					} else if(JSB().isString(item)){
						var typeRenderer = new Ontoed.TypeRenderer(JSB().merge({}, opts, {type:item}));
						this.append(typeRenderer);
					} else if(item.type && (item.type.toLowerCase() == 'literal' || item.type.toLowerCase() == 'typename' || item.type.toLowerCase() == 'iri' ||  item.type.toLowerCase() == 'facet')){
						var renderer = Ontoed.RendererRepository.createRendererFor(item, opts);
						this.append(renderer);
					} else {
						var expressionRenderer = new Ontoed.DefaultExpressionRenderer(JSB().merge({}, opts, {resolver: item, full: true}));
						this.append(expressionRenderer);
					}
				}
				this.append('<span class="paren">)</span>');
			}
		}
	}
});

JSB({
	name: 'Ontoed.EquivalentEntityExpressionRenderer',
	parent: 'Ontoed.ExpressionRenderer',
	
	client: {
		constructor: function(opts){
			this.base(opts);
			this.addClass('equivalentEntityExpressionRenderer');
			
			for(var i = 0; i < this.resolver.items.length; i++){
				if(i > 0){
					this.append('<div class="eqSign">&#8801;</div>');
				}
				var item = this.resolver.items[i];
				if(JSB().isBean(item)){
					var itemRenderer = Ontoed.RendererRepository.createRendererForEntity(item, opts);
					this.append(itemRenderer);
					if(this.context == item){
						itemRenderer.addClass('context');
					}
				} else if(JSB().isString(item)){
					var typeRenderer = new Ontoed.TypeRenderer(JSB().merge({}, opts, {type:item}));
					this.append(typeRenderer);
				} else {
					var expressionRenderer = new Ontoed.DefaultExpressionRenderer(JSB().merge({}, opts, {resolver: item, full: true}));
					this.append(expressionRenderer);
				}
			}
		}
	}
});

JSB({
	name: 'Ontoed.UnionExpressionRenderer',
	parent: 'Ontoed.ExpressionRenderer',
	
	client: {
		constructor: function(opts){
			this.base(opts);
			this.addClass('unionExpressionRenderer');
			
			this.append('<span class="paren">(</span>');
			
			for(var i = 0; i < this.resolver.items.length; i++){
				if(i > 0){
					this.append('<div class="unionSign">&#8746;</div>');
				}
				var item = this.resolver.items[i];
				if(JSB().isBean(item)){
					var itemRenderer = Ontoed.RendererRepository.createRendererForEntity(item, opts);
					this.append(itemRenderer);
					if(this.context == item){
						itemRenderer.addClass('context');
					}
				} else if(JSB().isString(item)){
					var typeRenderer = new Ontoed.TypeRenderer(JSB().merge({}, opts, {type:item}));
					this.append(typeRenderer);
				} else {
					var expressionRenderer = new Ontoed.DefaultExpressionRenderer(JSB().merge({}, opts, {resolver: item, full: true}));
					this.append(expressionRenderer);
				}
			}
			this.append('<span class="paren">)</span>');
		}
	}
});