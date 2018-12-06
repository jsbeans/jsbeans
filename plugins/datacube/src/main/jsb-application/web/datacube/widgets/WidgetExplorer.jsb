{
	$name: 'DataCube.Widgets.WidgetExplorer',
	$parent: 'JSB.Widgets.Widget',
	$require: ['DataCube.Widgets.WidgetRegistry'],
	
	$client: {
		$require: ['JSB.Controls.ScrollBox',
		           'JSB.Widgets.GroupBox',
		           'JSB.Widgets.ItemList',
		           'JSB.Widgets.ItemList.BlockView',
		           'DataCube.Widgets.WidgetListItem',
		           'css:WidgetExplorer.css'],
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('widgetExplorer');
			
			this.scrollBox = new ScrollBox();
			this.append(this.scrollBox);
			
			WidgetRegistry.lookupWidgets(function(wDesc){
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
	}
}