{
	$name: 'DataCube.Widgets.WidgetEditor',
	$parent: 'JSB.Widgets.Tool',
	$require: ['DataCube.Widgets.WidgetSchemeRenderer',
	           'JSB.Widgets.ScrollBox',
	           'JSB.Widgets.PrimitiveEditor',
	           'DataCube.Button'
	          ],
	$client: {
        $bootstrap: function(){
            JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
                toolMgr.registerTool({
                    id: 'widgetEditor',
                    jso: $this,
                    wrapperOpts: {
                        exclusive: 'widgetEditor',
                        modal: true,
                        hideByOuterClick: true,
                        hideInterval: 0,
                        cssClass: 'widgetEditorWrapper'
                    }
                });
            });
        },

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('widgetEditor');
            this.loadCss('WidgetEditor.css');

            this.construct();
	    },

	    construct: function(){
	        this.titleBlock = this.$('<div class="titleBlock"></div>');
	        this.append(this.titleBlock);

	        this.titleEditor = new PrimitiveEditor();
	        this.titleBlock.append(this.titleEditor.getElement());

            var closeBtn = new Button({
                hasIcon: true,
                hasCaption: false,
                cssClass: 'closeBtn',
                onclick: function(){
                    $this.close();
                }
            });
            this.titleBlock.append(closeBtn.getElement());

	        var minimizeBtn = new Button({
	            hasIcon: true,
	            hasCaption: false,
	            cssClass: 'minimizeBtn',
	            onclick: function(){
                    $this.minimize();
                }
            });
            this.titleBlock.append(minimizeBtn.getElement());

	        this.schemeBlock = new ScrollBox();
	        //this.$('<div class="schemeBlock"></div>');
	        this.append(this.schemeBlock);
	        this.schemeBlock.addClass('schemeBlock');

	        this.widgetBlock = this.$('<div class="widgetBlock"></div>');
	        this.append(this.widgetBlock);

            this.bottomBlock = this.$('<div class="bottomBlock"></div>');
	        this.append(this.bottomBlock);

	        var saveBtn = new Button({
	            caption: 'Сохранить',
                cssClass: 'success',
	            onclick: function(){
                    $this.applySettings();
                }
            });
            this.bottomBlock.append(saveBtn.getElement());
	    },

	    update: function(){
	        if(this.widgetSchemeRenderer) this.widgetSchemeRenderer.destroy();

	        this.data.data.schemeData.onChange = function(){
	            debugger;
	            $this.onChangeSettings();
	        }

            this.widgetSchemeRenderer = new WidgetSchemeRenderer(this.data.data.schemeData);
            this.schemeBlock.append(this.widgetSchemeRenderer.getElement());

            this.titleEditor.setData(this.data.data.title);

            if(this.widget) this.widget.destroy();

            this.widget = new this.data.data.widget();
            this.widgetBlock.append(this.widget.getElement());
            this.widget.setWrapper(this.data.data.schemeData.wrapper);
            this.widget.refresh();
	    },

	    applySettings: function(){
	        if(this.data.callback){
	            this.data.callback.call({
	                title: this.titleEditor.getData().getValue(),
	                values: this.widgetSchemeRenderer.getValues()
	            });
	        }
	    },

	    minimize: function(){

	    },

	    onChangeSettings: function(){

	    }
	}
}