{
	$name: 'JSB.Workspace.EntryRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$require: ['JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.RendererRepository',
	           'css:EntryRenderer.css'], 

	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('entryRenderer');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.attr('title', entry.getName());

			// extract icon
			if(!opts || !opts.customIcon){
				var iconData = null;
				var curWidgetJsb = entry.getJsb();
				while(curWidgetJsb){
		            var expose = curWidgetJsb.getDescriptor().$expose;
		            if(expose && expose.icon){
		            	iconData = expose.icon;
		            	break;
		            }
		            curWidgetJsb = curWidgetJsb.getParent();
		            if(!curWidgetJsb.isSubclassOf('JSB.Workspace.Entry')){
		                break;
		            }
		        }
				if(iconData){
					this.icon.css('background-image', 'url(' + iconData + ')');
				}
			}
			
			if(this.options.editable){
				this.editor = new PrimitiveEditor(JSB.merge({
					mode:'inplace',
					dblclick: false,
				}, opts));
				this.editor.setData(entry.getName());
				this.editor.addClass('title');
				this.append(this.editor);
			} else {
				this.append(this.$('<div class="title"></div>').text(entry.getName()));
			}
			
			if(opts && opts.showParent){
				this.addClass('showParent');
				entry.server().getParent(function(parentEntry){
					$this.append('<div class="leftParen">(</div>');
					$this.append(RendererRepository.createRendererFor(parentEntry).getElement());
					$this.append('<div class="rightParen">)</div>');
				});
			}
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender == entry){
					$this.update();
				}
			});
		},
		
		update: function(){
			this.attr('title', this.object.getName());
			if(this.editor){
				this.editor.setData(this.object.getName());
			} else {
				this.find('> .title').text(this.object.getName());
			}
		},
		
		beginEdit: function(){
			if(this.editor){
				this.editor.beginEdit();
			}
		},
		
		getEntry: function(){
			return this.object;
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.Workspace.Entry');
		}
	}
}