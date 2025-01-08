/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JsonView',
	$parent: 'JSB.Widgets.Widget',
/*	
	require: {
		'JSB.Widgets.ScrollBox': 'ScrollBox',
		'JSB.Widgets.TabView': 'TabView',
		'MultiEditor': 'MultiEditor'
	},
*/	
	$client: {
		$require: ['css:jsonView.css'],
		$constructor: function(opts){
			$base(opts);
//			this.preloadImages();
			this.init(opts);
		},
		
		defVisibleDeep: 2,
		embeddedCount: 0,
		embeddedWidgets:[],
		
		init: function(opts){
			var self = this;
			this.element.addClass('jsonView');
			this.applyBehavior({
				allowResize: {
					vertical: false
				}
			});
/*				
				this.tabView = new self.TabView({
					allowCloseTab: false,
					allowNewTab: false
				});
				this.append(this.tabView);
*/				
			// add general view
//				this.scrollBox = new self.ScrollBox();
//				var generalTab = self.tabView.addTab('Вид', this.scrollBox, {});
			this.pane = this.$('<div class="pane"></div>');
			this.append(this.pane);
//				this.scrollBox.append(this.pane);
/*				
				// add source view
				this.editor = new self.MultiEditor({
					valueType: 'org.jsbeans.types.Javascript',
					readOnly: true
				});
				var editorTab = self.tabView.addTab('Источник', this.editor, {});
*/					
			if(opts && opts['data'] != null && opts['data'] != undefined){
				this.setData(opts['data']);
			}

            if(this.options.data){
                this.setData(this.options.data);
            }
//				self.tabView.switchTab(generalTab);
		},

        options: {
            data: undefined,
            collapsed: false
        },
		
		destroy: function(){
			for(var i in this.embeddedWidgets){
				this.embeddedWidgets[i].destroy();
			}
			$base();
		},
		
		setData: function(obj){
			var self = this;
			this.pane.empty();	//avoid content
			this.renderElement(obj, this.pane, 0);
			this.pane.find('.expandCollapseToggle').click(function(evt){
				var toggler = self.$(evt.currentTarget);
				var ul = toggler.find('+ .objBody');	
				if( toggler.hasClass('collapsed')){
					// expand
					toggler.removeClass('collapsed');
					toggler.addClass('expanded');
					ul.css('display','');
				} else {
					// collapse
					toggler.removeClass('expanded');
					toggler.addClass('collapsed');
					ul.css('display','none');
				}
			});
		},
		
		renderElement: function(obj, elt, deep){
			if(obj === null){
				this.renderNull(elt, deep);
			} else if(obj === undefined){
				// do nothing
			} else if(JSB.isDate(obj)){
				this.renderDate(obj, elt);
			} else if(JSB.isArray(obj)){
				this.renderArray(obj, elt, deep);
			} else if(JSB.isBean(obj)) {
				this.renderBean(obj, elt, deep);
			} else if(JSB.isPlainObject(obj)) {
				this.renderObj(obj, elt, deep);
			} else if(JSB.isBoolean(obj)){
				this.renderBool(obj, elt, deep);
			} else if(JSB.isNumber(obj)){
				this.renderNumber(obj, elt, deep);
			} else if(JSB.isString(obj)){
				this.renderString(obj, elt, deep);
			} else if(JSB.isFunction(obj)){
				this.renderFunction(obj, elt, deep);
			} else {
				// internal error: unknown type
			}
		},
		
		renderBean: function(obj, elt, deep){
			elt.append('<span class="bean">{ bean "'+obj.getJsb().getName()+'" ('+obj.getId()+') }</span>');
		},
		
		renderObj: function(obj, elt, deep){
			var self = this;
			elt.append('<span class="brace leftBrace">{</span>');
			var objBody = null;
			var size = 0;
			var cnt = 0;
			for(var i in obj){ size++; }
			if(size > 0){
				var expColCls = 'expanded';
				if(deep >= this.defVisibleDeep){
					expColCls = 'collapsed';
				}
				if(this.options.collapsed){
				    expColCls = 'collapsed';
				}
				elt.append('<span class="expandCollapseToggle '+expColCls+'"></span>');
			}
			var embeddedField = '_embeddedType_';
			var dataField = '_embeddedData_';
			if(obj[embeddedField] != null 
				&& obj[embeddedField] != undefined ) {
				var allowedWidth = this.element.width();
				JSB().lookup('JSB.Widgets.FloatingContainer',function(ff){
					var container = new ff({
						position: 'fixed',
						suggested: {
							width: elt.width() / 2,
							height: elt.width() / 2,
						}
					});
					var containerElt = container.getElement();
					containerElt.addClass('objBody').addClass('embedded');
					elt.append(containerElt);
					elt.resize(function(evt, w, h){
						if(evt.target != elt.get(0)){
							return;
						}

						container.updateArea(w - containerElt.position().left, 0);
					});
					if(deep >= self.defVisibleDeep){
						containerElt.css('display','none');
					}
					if($this.options.collapsed){
                        containerElt.css('display','none');
                    }

					JSB().lookup(obj[embeddedField], function(ff){
						var embId = self.embeddedCount;
						self.embeddedCount++;
						var embeddedWidget = new ff({
							data: obj[dataField]
						});
						self.embeddedWidgets[self.embeddedWidgets.length] = embeddedWidget; 
						container.attachWidget(embeddedWidget);
					});
				});
			} else {
				for(var i in obj){
					if(objBody == null){
						objBody = this.$('<ul class="objBody"></ul>');
						if(deep >= this.defVisibleDeep){
							objBody.css('display','none');
						}
						if($this.options.collapsed){
                            objBody.css('display','none');
                        }
						elt.append(objBody);
					}
					var idElt = this.$('<span class="key"></span>');
					idElt.text('' + i + ':');
					var itemElt = this.$('<li></li>').append(idElt);
					objBody.append(itemElt);
					this.renderElement(obj[i], itemElt, deep + 1);
					if(cnt + 1 < size){
						itemElt.append('<span class="comma">,</span>');
					}
					itemElt.append('<div class="eos"></div>');
					cnt++;
				}
			}
			if(objBody != null){
				
			}
			elt.append('<span class="brace rightBrace">}</span>');
		},

		renderArray: function(obj, elt, deep){
			elt.append('<span class="bracket leftBracket">[</span>');
			if(obj.length > 0){
				var expColCls = 'expanded';
				if(deep >= this.defVisibleDeep){
					expColCls = 'collapsed';
				}
				if(this.options.collapsed){
                    expColCls = 'collapsed';
                }
				elt.append('<span class="expandCollapseToggle '+expColCls+'"></span>');
				var objBody = this.$('<ul class="objBody"></ul>');
				if(deep >= this.defVisibleDeep){
					objBody.css('display','none');
				}
				if($this.options.collapsed){
                    objBody.css('display','none');
                }
				for(var i = 0; i < obj.length; i++ ){
					var itemElt = this.$('<li></li>');
					objBody.append(itemElt);
					this.renderElement(obj[i], itemElt, deep + 1);
					if(i + 1 < obj.length){
						itemElt.append('<span class="comma">,</span>');
					}
					itemElt.append('<div class="eos"></div>');
				}
				elt.append(objBody);
			}
			elt.append('<span class="bracket rightBracket">]</span>');
		},
		
		renderBool: function(obj, elt){
			if(obj == true){
				elt.append('<span class="bool true">true</span>');
			} else {
				elt.append('<span class="bool false">false</span>');
			}
		},
		
		renderDate: function(obj, elt){
			elt.append(this.$('<span class="date"></span>').text(obj.toLocaleString()));
		},

		renderNull: function(elt){
			elt.append('<span class="nil">null</span>');
		},

		renderNumber: function(obj, elt){
			elt.append('<span class="number">'+obj+'</span>');
		},
		
		renderString: function(obj, elt){
			var strElt = this.$('<span class="string"></span>');
			strElt.text('"' + obj + '"');
			elt.append(strElt);
		},
		
		renderFunction: function(obj, elt){
			elt.append('<span class="function">function</span>');
		}
	}
}