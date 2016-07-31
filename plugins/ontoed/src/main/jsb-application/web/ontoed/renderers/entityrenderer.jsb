JSB({
	name: 'Ontoed.EntityRenderer',
	parent: 'Ontoed.Renderer',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.entity = opts.entity;
			this.loadCss('entityrenderer.css');
			this.addClass('entityRenderer');
			
			if(opts.cssClass){
				this.addClass(opts.cssClass);
			}

			
			this.icon = this.$('<div class="icon"><div class="subIcon"></div></div>');
			this.append(this.icon);
			this.title = this.$('<div class="title"></div>');
			this.append(this.title);
			this.toolbar = this.$('<div class="toolbar"></div>');
			this.append(this.toolbar);

			JSB().deferUntil(function(){
				self.constructNode();
			}, function(){
				return self.entity.isSynchronized();
			});
			
			if(this.options.allowNavigate){
				this.addClass('allowNavigate');
				this.icon.click(function(){
					self.publish('changeCurrentEntity', self.entity);
				});
				this.getElement().dblclick(function(){
					self.publish('changeCurrentEntity', self.entity);
				});
			}
			
			// process flags
			var flags = ['isAnonymous', 'isBuiltIn', 'isDeclared', 'isImported', 'isFunctional', 'isDeprecated', 'isEquivalent'];
			for(var i in flags){
				if(this.entity.info[flags[i]]){
					this.addClass(flags[i]);
				}
			}
			
			if(!this.entity.info.isDeclared && !this.entity.info.isImported && !this.entity.info.isBuiltIn){
				this.addClass('isMalformed');
			}
			
			if(this.entity.info.isEquivalent){
				this.icon.append('<div class="eqIcon">&#8801;</div>');
			}
			
			// parse annotations
			for(var aId in this.entity.info.annotations){
				var annot = this.entity.info.annotations[aId];
			}

/*			
			this.title = this.$('<span class="title"></span>').text(this.descriptor.name).attr('title',this.descriptor.name);
			this.append(this.title);
*/			
			this.subscribe('entityUpdated', function(sender){
				if(sender != self.entity){
					return;
				}
				self.constructNode();
			});
		},
		
		constructNode: function(){
			throw 'constructNode: method should be overriden';
		}
	}
});
