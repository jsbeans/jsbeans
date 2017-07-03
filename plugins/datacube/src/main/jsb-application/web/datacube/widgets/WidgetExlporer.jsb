{
	$name: 'JSB.DataCube.Widgets.WidgetExplorer',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.ScrollBox',
		           'JSB.Widgets.GroupBox',
		           'JSB.Widgets.ItemList',
		           'JSB.Widgets.ItemList.BlockView',
		           'JSB.DataCube.Widgets.WidgetListItem'],
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('WidgetExplorer.css');
			this.addClass('widgetExplorer');
			
			this.scrollBox = new ScrollBox();
			this.append(this.scrollBox);
			
			this.server().getWidgets(function(wDesc){
				$this.draw(wDesc);
			});
		},
		
		draw: function(wDescObj){
			var descArr = Object.keys(wDescObj);
			descArr.sort(function(a, b){
				if(b == 'Основные'){
					return 1;
				} else if(a == 'Основные'){
					return -1;
				}
				return a.localeCompare(b);
			});
			
			for(var i = 0; i < descArr.length; i++){
				var category = descArr[i];
				var groupBox = new GroupBox({
					caption: category
				});
				groupBox.attr('category', category);
				this.scrollBox.append(groupBox);
				var widgetList = new ItemList({
					views: {
						block: new BlockView()
					},
					view: 'block',
				});
				groupBox.append(widgetList);
				
				var wDescArr = wDescObj[category];
				for(var j = 0; j < wDescArr.length; j++){
					var wDesc = wDescArr[j];
					var wli = new WidgetListItem({
						close: false,
					}, wDesc);
					widgetList.addItem(wli);
				}
			}
		}
	},
	
	$server: {
		$singleton: true,
		registry: {},
		
		$constructor: function(){
			$base();
			JSB.onLoad(function(){
				if(this.isSubclassOf('JSB.DataCube.Widgets.Widget') && this.$name != 'JSB.DataCube.Widgets.Widget'){
					$this.register(this);
				}
			});
		},
		
		register: function(jsb){
			JSB.getLogger().info(jsb.$name);
			var expose = jsb.getDescriptor().$expose;
			if(!this.registry[expose.category]){
				this.registry[expose.category] = [];
			}
			this.registry[expose.category].push({
				name: expose.name,
				description: expose.description,
				thumb: expose.thumb,
				jsb: jsb.$name,
			});
		},
		
		getWidgets: function(){
			return this.registry;
		},
	}
}