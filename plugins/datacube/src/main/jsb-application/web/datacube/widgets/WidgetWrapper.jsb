{
	$name: 'JSB.DataCube.Widgets.WidgetWrapper',
	$parent: 'JSB.Widgets.Widget',
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},

	entry: null,
	wType: null,
	name: null,
	
	getName: function(){
		return this.name;
	},
	
	getWidgetType: function(){
		return this.wType;
	},
	
	$client: {
		editor: null,
		widget: null,
		
		$constructor: function(){
			$base();
			this.ensureSynchronized(function(){
				$this.setTitle($this.getName());
				JSB.lookup($this.wType, function(WidgetClass){
					$this.widget = new WidgetClass();
					$this.append($this.widget);
				});
			});

		}
	},
	
	$server: {
		
		$constructor: function(id, entry, wType){
			this.id = id;
			this.entry = entry;
			this.wType = wType;
			$base();
		},
		
		setName: function(name){
			this.name = name;
		}
	}
}