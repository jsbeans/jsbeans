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
	$name: 'JSB.Widgets.Dashboard.Dashboard',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['JSB.Widgets.Dashboard.Container',
		           'JSB.Widgets.Dashboard.Placeholder',
		           'css:Dashboard.css'],
		           
	    placeholder: null,
	    container: null,
	    widgets: {},
	    widgetStates: {},
	    
		$constructor: function(opts){
			$base(opts);
			this.addClass('_jsb_dashboard');
			
			// setup initial placeholder
			this.placeholder = new Placeholder(JSB.merge({
				emptyText: opts.emptyText,
				onDragAccept: function(d){
					var dragAccept = false;
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var widx in d.get(0).draggingItems){
							var w = d.get(0).draggingItems[widx];
							if($this.isWidgetAccepted(w)){
								dragAccept = true;
								break;
							}
						}
					}
					if(!dragAccept && $this.options.onDragAccept){
						if($this.options.onDragAccept(d)){
							dragAccept = true;
						}
					}
					
					return dragAccept;
				},
				onDragDrop: function(d, callback){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var widx in d.get(0).draggingItems){
							var w = d.get(0).draggingItems[widx];
							if($this.isWidgetAccepted(w)){
								callback.call($this, w);
								return;
							}
						}
					}
					if($this.options.onDragDrop){
						$this.options.onDragDrop.call($this, d, callback);
					}
				},
				onDropWidget: function(widget){
					$this.dockWidget(widget);
				}
			}, opts.placeholder || {}));
			this.append(this.placeholder);
		},
		
		destroy: function(){
			this.clear();
			$base();
		},
		
		dockWidget: function(widget){
			if(!this.container){
				this.container = new Container($this.options, $this, $this);
				this.append(this.container);
				this.placeholder.getElement().css('display', 'none');
			}
			this.container.dockWidget(widget, 'center');
		},
		
		isWidgetAccepted: function(widget){
			if(!JSB.isInstanceOf(widget, 'JSB.Widgets.Widget')){
				return false;
			}
			if(this.widgets[widget.getId()]){
				return true;
			}
			return false;
		},
		
		getLayout: function(){
			if(this.container){
				return { 
					layout: this.container.getLayout(),
					widgets: this.widgets
				}
			}
			return null;
		},
		
		notifyChanged: function(container, msg, params){
			if(this.options.onChange){
				this.options.onChange.call(this);
			}
			this.publish(msg, JSB.merge({actor: container}, params));
		},
		
		clear: function(){
			if(this.container){
				this.container.destroy();
				this.container = null;
			}
			this.widgets = {};
			this.widgetStates = {};
			this.placeholder.getElement().css('display', 'block');
		},
		
		setLayout: function(lDesc){
			this.clear();
			if(!lDesc || !lDesc.layout || Object.keys(lDesc.layout).length == 0){
				return;
			}
			this.widgets = lDesc.widgets;
			
			this.container = new Container($this.options, $this, $this);
			this.append(this.container);
			this.placeholder.getElement().css('display', 'none');
			this.container.setLayout(lDesc.layout);
		}
	}
}