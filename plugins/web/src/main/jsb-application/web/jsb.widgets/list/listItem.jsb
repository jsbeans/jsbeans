{
	$name:'JSB.Widgets.ListItem',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('itemList.css');
			this.addClass('_dwp_listItem');
			
			// add close btn
			if(this.options.close){
				this.closeBtn = this.$('<div class="_dwp_closeBtn"></div>');
				this.append(this.closeBtn);
				this.closeBtn.click(function(evt){
					if(self.list.options.readOnly){
						return;
					}
					if(self.options.onClose){
						var can = self.options.onClose.call(self, evt, function(can){
							if(can){
								self.deleteSelf();
								evt.stopPropagation();
							}
						});
						if(can){
							self.deleteSelf();
							evt.stopPropagation();
						}
					} else {
						self.deleteSelf();
						evt.stopPropagation();
					}
				});
				
			}
		},
		
		options: {
			onSelected: function(tgtObj){},
			close: true,
			allowHover: true,
			allowSelect: true
		},
		
		deleteSelf: function(){
			this.list.deleteItem(this.key);
			this.destroy();
		},
		
		viewChanged: function(viewName){
			console.log('viewChanged: ' + viewName);
		},
		
		getKey: function(){
			return this.key;
		}
	}
}