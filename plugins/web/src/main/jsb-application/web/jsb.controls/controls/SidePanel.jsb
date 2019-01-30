{
	$name: 'JSB.Controls.SidePanel',
	$parent: 'JSB.Controls.Control',
	
	$client: {
		$require: ['css:SidePanel.css'],
		
		options: {
			dock: 'bottom',
			visible: false,
			cssClass: null,
        },
        
        $constructor: function(opts){
        	$base(opts);

            this.addClass('jsb-sidePanel');
            if(this.options.cssClass){
            	this.addClass(this.options.cssClass);
            }
            this.panel = this.$('<div class="panel"></div>');
            this.getElement().append(this.panel);
            
            if(this.options.dock){
            	this.dock(this.options.dock);
            }
            
            this.panel.resize(function(evt, w, h){
            	$this.update();
            });
        },
        
        dock: function(side){
        	if(side != 'top' 
        		&& side != 'bottom' 
        		&& side != 'left' 
        		&& side != 'right'){
        		throw new Error('Invalid side: ' + side);
        	}
        	this.options.dock = side;
        	this.panel.removeClass('left');
        	this.panel.removeClass('right');
        	this.panel.removeClass('top');
        	this.panel.removeClass('bottom');
        	
        	this.panel.addClass(side);
        	this.update();
        },
        
        append: function(ctrl){
			this.panel.append(this.resolveElement(ctrl));
			return this;
		},

		prepend: function(ctrl){
			this.panel.prepend(this.resolveElement(ctrl));
			return this;
		},
		
		clear: function(){
			if(this.panel){
				this.panel.empty();
			}
		},
		
		show: function(){
			this.options.visible = true;
			this.update();
		},
		
		hide: function(){
			this.options.visible = false;
			this.update();
		},
		
		toggle: function(){
			if(this.options.visible){
				this.hide();
			} else {
				this.show();
			}
		},
		
		isVisible: function(){
			return this.options.visible;
		},
		
		update: function(){
			JSB.defer(function(){
				var w = $this.panel.outerWidth(true);
				var h = $this.panel.outerHeight(true);
				var cssObj = {
					left: '',
					top: '',
					bottom: '',
					right: ''
				};
				switch($this.options.dock){
				case 'top':
					if($this.isVisible()){
						cssObj.top = 0;
					} else {
						cssObj.top = -h;
					}
					break;
				case 'bottom':
					if($this.isVisible()){
						cssObj.bottom = 0;
					} else {
						cssObj.bottom = -h;
					}
					break;
				case 'left':
					if($this.isVisible()){
						cssObj.left = 0;
					} else {
						cssObj.left = -w;
					}
					break;
				case 'right':
					if($this.isVisible()){
						cssObj.right = 0;
					} else {
						cssObj.right = -w;
					}
					break;
				}
				$this.panel.css(cssObj);
				
			}, 0, '_update_' + this.getId());
		}
	}
}