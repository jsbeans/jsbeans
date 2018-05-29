{
	$name: 'JSB.Controls.Panel',
	$parent: 'JSB.Controls.Control',
	$require: ['JSB.Controls.Editor'],
    $client: {
        $constructor: function(opts){
            $base(opts);

            this.loadCss('panel.css');
            this.loadCss('../fonts/fa/fontawesome-all.min.css');
            this.addClass('jsb-panel');

            this.elements.header = this.$('<div class="header"></div>');
            this.append(this.elements.header);

            this.elements.content = this.$('<div class="content"></div>');
            this.append(this.elements.content);

            if(this.options.title){
                this.elements.title = this.$('<h1><span>' + this.options.title + '</span></h1>');
                this.elements.header.append(this.elements.title);
            }

            if(this.options.title && this.options.titleEditBtn){
                this.elements.buttons.titleEditBtn = this.$('<i class="fas fa-pencil-alt"></i>');
                this.elements.title.append(this.elements.buttons.titleEditBtn);

                this.elements.buttons.titleEditBtn.click(function(evt){
                    evt.stopPropagation();
                    $this.elements.title.find('span').addClass('hidden');
                    $this.elements.buttons.titleEditBtn.addClass('hidden');
                    $this.editTitle();
                });
            }

            if(this.options.hasToolbar){
                this.elements.toolbar = this.$('<ul class="' + this.options.toolbarPosition + '"></ul>');

                if(this.options.toolbarPosition === 'right'){
                    this.elements.header.append(this.elements.toolbar);
                } else if(this.options.toolbarPosition === 'left') {
                    this.elements.header.prepend(this.elements.toolbar);
                }
                this.elements.header.addClass('hasToolbar');
            }

            if(this.options.collapseBtn){
            	this.addClass('collapsable');
                var cl = 'fas fa-chevron-up';
                if(this.options.collapsed){
                	this.addClass('collapsed');
                    cl = 'fas fa-chevron-down'
                    this.elements.content.css('display', 'none');
                }
                this.elements.buttons.collapseBtn = this.$('<li key="collapseBtn" class="collapse-link"><i class="' + cl + '"></i></li>');
                this.elements.toolbar.append(this.elements.buttons.collapseBtn);

                this.elements.buttons.collapseBtn.click(function(){
                    $this.togglePanel();
                });

                var title = this.elements.header.find('h1');
                title.addClass('collapsable');
                title.click(function(){
                    $this.togglePanel();
                });
            }

            if(this.options.settingsBtn){
                this.elements.buttons.settingsBtn = this.$('<li key="settingsBtn" class="settings-link"><i class="fas fa-cog"></i></li>');
                this.elements.toolbar.append(this.elements.buttons.settingsBtn);

                if(JSb.isFunction(this.options.onSettingsBtnClick)){
                    this.elements.buttons.settingsBtn.click(function(){
                        $this.options.onSettingsBtnClick.call($this);
                    });
                }
            }

            if(this.options.closeBtn){
                this.elements.buttons.closeBtn = this.$('<li key="closeBtn" class="close-link"><i class="fas fa-times"></i></li>');
                this.elements.toolbar.append(this.elements.buttons.closeBtn);

                if(JSB.isFunction(this.options.onCloseBtnClick)){
                    this.elements.buttons.closeBtn.click(function(){
                        $this.options.onCloseBtnClick.call($this);
                    });
                }
            }

            if(this.options.content){
                if(JSB.isInstanceOf(this.options.content, 'JSB.Controls.Control') || JSB.isInstanceOf(this.options.content, 'JSB.Widgets.Control')){
                    this.elements.content.append(this.options.content.getElement());
                } else {
                    this.elements.content.append(this.options.content);
                }
            }
        },

        elements: {
            buttons: {}
        },

        options: {
            // options
            collapsed: false,
            title: null,
            hasToolbar: true,
            toolbarPosition: 'right',
            collapseBtn: true,
            titleEditBtn: false,
            settingsBtn: false,
            closeBtn: false,
            titleValidateFunction: null,
            // events
            onCollapse: null,
            onExpand: null,
            onTitleEdited: null,
            onSettingsBtnClick: null,
            onCloseBtnClick: null
        },

        addCustomBtn: function(key, btnOpts){
            if(this.elements.buttons[key]){
                throw new Error('Button with same key already exist.');
            }

            var el;
            if(btnOpts.after){
                el = this.elements.toolbar.find('[key="' + btnOpts.after + '"]');
                if(el.length === 0){
                    throw new Error('Button btnOpts.after is not exist.');
                }
            }

            this.elements.buttons[key] = this.$('<li key="' + key + '" class="' + btnOpts.cssClass + '"><i></i></li>');

            if(el){
                el.after(this.elements.buttons[key]);
            } else {
                this.elements.toolbar.prepend(this.elements.buttons[key]);
            }

            return this.elements.buttons[key];
        },

        appendContent: function(content){
            if(JSB.isInstanceOf(content, 'JSB.Controls.Control') || JSB.isInstanceOf(content, 'JSB.Widgets.Control')){
                this.elements.content.append(content.getElement());
            } else {
                this.elements.content.append(content);
            }
        },

        editTitle: function(){
            var editor = new Editor({
                value: this.options.title,
                onenterpressed: function(val){
                    function validTrue(){
                        $this.options.title = val;

                        $this.elements.title.find('span').removeClass('hidden').text(val);
                        $this.elements.buttons.titleEditBtn.removeClass('hidden');

                        editor.destroy();

                        if(JSB.isFunction($this.options.onTitleEdited)){
                            $this.options.onTitleEdited.call($this, val);
                        }
                    }

                    if(JSB.isFunction($this.options.titleValidateFunction)){
                        if($this.options.titleValidateFunction(val)){
                            validTrue();
                        } else {
                            editor.getElement().focus();
                            editor.addClass('notValid');
                        }

                        return;
                    }

                    validTrue();
                },
                onfocusout: function(val){
                    $this.elements.title.find('span').removeClass('hidden');//.text(val);
                    $this.elements.buttons.titleEditBtn.removeClass('hidden');

                    editor.destroy();
                }
            });

            this.elements.header.append(editor.getElement());
        },

        setContent: function(content){
            this.elements.content.empty();
            this.elements.content.append(content);
        },

        setTitle: function(title){
            this.elements.title.find('span').text(title);
        },

        togglePanel: function(){
            var $BOX_PANEL = $this.getElement(),
                $ICON = $this.elements.buttons.collapseBtn.find('i'),
                $BOX_CONTENT = $BOX_PANEL.find('.content');

            // fix for some div with hardcoded fix class
            if ($BOX_PANEL.attr('style')) {
                $BOX_CONTENT.slideToggle(200, function(){
                    $BOX_PANEL.removeAttr('style');
                });
            } else {
                $BOX_CONTENT.slideToggle(200);
                $BOX_PANEL.css('height', 'auto');
            }

            if($ICON.hasClass('fa-chevron-up')){
            	this.addClass('collapsed');
                if(JSB.isFunction($this.options.onCollapse)){
                    $this.options.onCollapse.call($this);
                }
            } else {
            	this.removeClass('collapsed');
                if(JSB.isFunction($this.options.onExpand)){
                    $this.options.onExpand.call($this);
                }
            }

            $ICON.toggleClass('fa-chevron-up fa-chevron-down');
        }
    }
}