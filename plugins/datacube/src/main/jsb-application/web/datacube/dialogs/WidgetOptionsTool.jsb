{
	$name: 'JSB.DataCube.Dialogs.WidgetOptionsTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager', 
	           'JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.ScrollBox'],
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'widgetOptionsTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: true,
					hideByOuterClick: false,
					hideInterval: 0,
					cssClass: 'datacubeToolWrapper'
				}
			});
		},
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('WidgetOptionsTool.css');
			this.addClass('widgetOptionsTool');
			
			this.append(`#dot
				<div class="header">
					<div class="icon"></div>
					<div class="name" 
						jsb="JSB.Widgets.PrimitiveEditor"
						onchange="{{=this.callbackAttr(function(evt){ $this.updateButtons(); })}}">
					</div>
				</div>
				
				<div jsb="JSB.Widgets.GroupBox" caption="Текст запроса">
					<div jsb="JSB.Widgets.MultiEditor" class="queryEditor" valuetype="org.jsbeans.types.JsonObject" showhints="false"></div>
				</div>
				
				<div class="buttons">
					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnOk btn16" 
						caption="Применить"
						onclick="{{=this.callbackAttr(function(evt){ $this.apply(evt); })}}" >
					</div>
					
					<div 
						jsb="JSB.Widgets.Button" 
						class="roundButton btnCancel btn16" 
						caption="Отмена"
						onclick="{{=this.callbackAttr(function(evt){ $this.close(); })}}" >
					</div>
				</div>
			`);
		},
		
		
		update: function(){
			$jsb.deferUntil(function(){
				$this.construct();
				$this.updateButtons();
			}, function(){
				return $this.isContentReady();
			});
		},
		
		construct: function(){
			var slice = this.data.data.slice;
/*			
			this.find('.name._dwp_primitiveEditor').jsb().setData(slice.getName());
			this.find('.queryEditor').jsb().setData(JSON.stringify(slice.getQuery(), null, 4));
*/			
		},
		
		isValid: function(){
			return true;
		},
		
		
		updateButtons: function(){
			this.find('.btnOk').jsb().enable(this.isValid());
		},
		
		apply: function(){
			// construct response
			var resp = {
				name: this.find('.name._dwp_primitiveEditor').jsb().getData().getValue(),
				query: this.find('.queryEditor').jsb().getData().getValue()
			};
			this.data.callback.call(this, resp);
			$this.close();
		}
		
	},
	
	$server: {	}
}