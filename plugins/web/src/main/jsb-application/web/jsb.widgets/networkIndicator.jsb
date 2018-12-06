{
	$name:'JSB.Widgets.NetworkIndicator',
	$require: ['JQuery',
	           'css:networkIndicator.css'],
	$client: {
		$singleton: true,
		$constructor: function(){
			this.element = this.$('<div class="networkConnection"></div>');
			this.icon = this.$('<div class="icon"></div>');
			this.element.append(this.icon);
			this.element.css({
				visibility:'hidden'	// used to precache images
			});
			this.$('body').prepend(this.element);
		},
		
		enabled: false,
		
		enable: function(bShow){
			var self = this;
			if(bShow){
				if(this.enabled){
					return;
				}
				if(this.element.hasClass('connected')){
					this.element.removeClass('connected');
				}
				this.element.css({
					visibility: 'visible',
					display:'none'
				});
				this.enabled = true;
				this.element.fadeIn(300, function(){
					self.doPulse();
				});
			} else {
				if(this.enabled){
					this.enabled = false;
				}
			}
		},
		
		doPulse: function(){
			var self = this;
			this.icon.animate({
				opacity: 0.2
			},{
				duration: 400,
				complete: function(){
					self.icon.animate({
						opacity: 1
					},{
						duration: 400,
						complete: function(){
							if(self.enabled){
								JSB().defer( function(){
									self.doPulse();
								},50);
							} else {
								self.element.addClass('connected');
								JSB().defer(function(){
									self.element.fadeOut(1000);
								},1000);
							}
						}
					});
				}
			});
		}
	}
}