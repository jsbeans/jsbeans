{
	name:'JSB.Widgets.CheckBox',
	parent: 'JSB.Widgets.Control',
	require: {
	},
	
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('checkBox.css');
			this.addClass('_dwp_checkBox');
			
			// construct
			this.getElement().append(#dot{{
				<div class="shadowPanel"></div>
				<label>
					{{? self.options.check}}
					<input type="checkbox">
					{{?}}
					<span class="_dwp_caption"></span>
				</label>
				<div class="contents"><div class="shadowPanel"></div></div>
			}});
			
			if(this.options.label){
				this.setLabel(this.options.label);
			}
			
			this.find('> label').click(function(evt){
				if(self.options.onClick){
					self.options.onClick.call(self, evt);
				}
			});
			this.find('> label > input').change(function(){
				self.setChecked(self.isChecked());
			});
			this.enable(this.options.enabled);
			
			if(this.options.check){
				this.setChecked(this.options.checked, true);
			}
		},
		
		options: {
			label: null,
			check: true,
			checked: false,
			enabled: true,
			
			onClick: null,
			onChange: null
		},
		
		setLabel: function(str){
			this.getElement().find('._dwp_caption').append(str);
		},
		
		isChecked: function(){
			if(!this.options.check){
				return false;
			}
			return this.find('> label > input').prop('checked');
		},
		
		isEnabled: function(){
			return this.options.enabled;
		},
		
		setChecked: function(b, dontNotify){
			if(!this.options.check){
				return;
			}
			this.find('> label > input').prop('checked', b);
			this.enableContents(b);
			if(this.options.onChange && !dontNotify){
				this.options.onChange.call(this, b);
			}
		},
		
		enable: function(b){
			this.options.enabled = b;
			if(b) {
				this.removeClass('disabled');
			} else { 
				this.addClass('disabled');
			}
			this.enableContents(!b || this.isChecked() || !this.options.check);
		},
		
		enableContents: function(b){
			var cElt = this.find('> .contents');
			if(b){
				cElt.removeClass('disabled');
			} else {
				cElt.addClass('disabled');
			}
		},
		
		append: function(c){
			return this.find('> .contents').append(this.resolveElement(c));
		}
	}
}