{
	$name: 'DataCube.Views.EntryOptionsView',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['Unimap.Controller',
	               'Datacube.Unimap.Bootstrap',
                   'JSB.Controls.ScrollBox',
                   'JSB.Widgets.Button',
                   'JSB.Widgets.PrimitiveEditor',
                   'css:EntryOptionsView.css'
        ],
        
        entry: null,

		$constructor: function(opts){
			$base(opts);
			
			this.addClass('entryOptionsView');

            this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);
            
            this.nameEditor = new PrimitiveEditor();
            this.titleBlock.append(this.nameEditor.getElement());


            if(!$this.options.dontSave){
	            this.saveBtn = new Button({
	                cssClass: "btnOk",
	                caption: "Сохранить",
	                onClick: function(){
	                    $this.applySettings();
	                }
	            });
	            this.titleBlock.append(this.saveBtn.getElement());
            }
            

			this.schemeBlock = this.$('<div class="schemeBlock"></div>');
			this.append(this.schemeBlock);

	        this.schemeScroll = new ScrollBox();
	        this.schemeBlock.append(this.schemeScroll.getElement());

	        this.warningBlock = this.$('<div class="warningBlock hidden"></div>');
	        this.schemeBlock.append(this.warningBlock);
	        
	        this.subscribe('DataCube.Model.SettingsEntry.settingsUpdated', function(sender, msg, settings){
	        	if(sender != $this.getCurrentEntry()){
	        		return;
	        	}
	        	$this.refresh();
	        })
	        
		},
		
		setCurrentEntry: function(entry){
			if(entry == this.entry){
				return;
			}
			this.entry = entry;
			this.refresh();
		},
		
		getCurrentEntry: function(){
			return this.entry;
		},

		refresh: function(){
			this.entry = this.getCurrentEntry();
			
			if(!this.entry){
				$this.nameEditor.setData('');
				$this.saveBtn.enable(false);
				if($this.widgetSchemeRenderer){
                    $this.widgetSchemeRenderer.destroy();
                }
			} else {
				$this.saveBtn.enable(true);
				$this.nameEditor.setData(this.entry.getName());
	            $this.schemeBlock.loader();
	            $this.entry.loadSettings(function(settings){
	                if($this.widgetSchemeRenderer){
	                    $this.widgetSchemeRenderer.destroy();
	                }
	                $this.widgetSchemeRenderer = new Controller({
	                    scheme: $this.entry.extractSettingsScheme(),
	                    values: settings,
	                    bootstrap: 'Datacube.Unimap.Bootstrap',
	                    context: $this.entry.getId()
	                });
	                $this.schemeScroll.append($this.widgetSchemeRenderer.getElement());
	
	                $this.schemeBlock.loader('hide');
	            });
			}

		},
		

		applySettings: function(){
			if($this.options.dontSave){
				return;
			}

            if(this.updateValidation()){
    		    var values = this.widgetSchemeRenderer.getValues();
	            this.getElement().loader({message:'Сохранение...'});
	            this.server().saveSettings(this.entry, this.nameEditor.getData().getValue(), values, function(){
	            	$this.getElement().loader('hide');
	            })
/*	            
	            this.entry.saveSettings(values, function(){
	                $this.getElement().loader('hide');
	            });
*/	            
            }
		},

		updateValidation: function(){
		    this.warningBlock.empty();

            var validate = this.widgetSchemeRenderer.validate();
            if(validate.length > 0){
                this.warningBlock.removeClass('hidden');

                for(var i = 0; i < validate.length; i++){
                    this.warningBlock.append('<p>Поле <b>' + validate[i].name + '</b> обязательно к заполнению!</p>');
                }

                var warningBlockHeight = this.warningBlock.outerHeight();

                if(warningBlockHeight > 200){
                    this.warningBlock.outerHeight(200);
                    this.schemeScroll.getElement().outerHeight('calc(100% - 200px)');
                } else {
                    this.schemeScroll.getElement().outerHeight('calc(100% - ' + warningBlockHeight + 'px)');
                }
                return false;
            } else {
                this.warningBlock.addClass('hidden');
                this.schemeScroll.getElement().outerHeight('100%');
            }
            return true;
		}
	},
	
	$server: {
		saveSettings: function(entry, name, values){
			if(!entry){
				return;
			}
			entry.setName(name);
			entry.applySettings(values);
		}
	}
}