{
	$name: 'templatewidget',
	$parent: 'JSB.Widgets.Widget',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('templatewidget');
			
			this.draw(['Anna', 'Maria', 'Vera']);
			
		},
		draw: function(data){
			
			var htmlText = `#dot
				<h1>Это пример шаблонного виджета</h2>
				<ul>
				{{ for( var i in data ) { }}
					<li class="tag">
						<span class="text">{{=data[i]}}</span>
						<span class="close">x</span>
					</li>
				{{ } }}
				</ul>
			`;
			
			this.getElement().append(htmlText);
		}
	
	},
	
	$server: {
	}
}